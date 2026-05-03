// src/scripts/signup.ts

import { supabase } from "../lib/supabase";

window.addEventListener("DOMContentLoaded", () => {
  const $ = <T extends HTMLElement>(id: string) =>
    document.getElementById(id) as T | null;

  const form = $("signupForm") as HTMLFormElement | null;
  const msg = $("msg");
  const btn = $("submitBtn") as HTMLButtonElement | null;

  const phone = $("phone") as HTMLInputElement | null;
  const password = $("password") as HTMLInputElement | null;
  const eye = $("togglePassword") as HTMLButtonElement | null;

  const advisor = $("advisor") as HTMLInputElement | null;
  const trigger = $("advisorTrigger") as HTMLButtonElement | null;
  const menu = $("advisorMenu");
  const label = $("advisorLabel");
  const arrow = $("advisorArrow");

  if (!form || !msg || !btn) return;

  /* 📱 PHONE */
  phone?.addEventListener("input", () => {
    phone.value = phone.value
      .replace(/\D/g, "")
      .slice(0, 10);
  });

  /* 👁 PASSWORD */
  eye?.addEventListener("click", (e) => {
    e.preventDefault();

    if (!password) return;

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  /* 👤 ASESOR */
  function closeMenu() {
    menu?.classList.add("hidden");

    if (arrow) {
      arrow.style.transform = "rotate(0deg)";
    }
  }

  trigger?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    menu?.classList.toggle("hidden");

    if (menu && arrow) {
      arrow.style.transform =
        menu.classList.contains("hidden")
          ? "rotate(0deg)"
          : "rotate(180deg)";
    }
  });

  document
    .querySelectorAll(".advisor-option")
    .forEach((item) => {
      item.addEventListener("click", () => {
        const el = item as HTMLElement;
        const val = el.dataset.value || "";

        if (advisor) advisor.value = val;

        if (label) {
          label.textContent = val;
          label.classList.remove("text-white/40");
          label.classList.add("text-white");
        }

        closeMenu();
      });
    });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (
      !target.closest("#advisorTrigger") &&
      !target.closest("#advisorMenu")
    ) {
      closeMenu();
    }
  });

  /* 🔄 LOADING */
  function loading(state: boolean) {
  if (!btn) return;
    btn.disabled = state;
    btn.textContent =
      state
        ? "Creando cuenta..."
        : "Crear cuenta";

    btn.classList.toggle(
      "opacity-70",
      state
    );
  }

  /* 🚀 SUBMIT */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";

    const first =
      ($("firstName") as HTMLInputElement)
        ?.value.trim() || "";

    const last =
      ($("lastName") as HTMLInputElement)
        ?.value.trim() || "";

    const business =
      ($("business") as HTMLInputElement)
        ?.value.trim() || "";

    const email =
      ($("email") as HTMLInputElement)
        ?.value.trim()
        .toLowerCase() || "";

    const phoneVal =
      phone?.value.trim() || "";

    const advisorVal =
      advisor?.value.trim() || "";

    const pass =
      password?.value.trim() || "";

    if (
      !first ||
      !last ||
      !business ||
      !email ||
      !phoneVal ||
      !advisorVal ||
      !pass
    ) {
      msg.textContent =
        "Completa todos los campos.";
      return;
    }

    if (pass.length < 8) {
      msg.textContent =
        "La contraseña debe tener mínimo 8 caracteres.";
      return;
    }

    loading(true);

    try {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password: pass
        });

      if (error || !data.user) {
        msg.textContent =
          error?.message ||
          "No se pudo crear usuario.";

        loading(false);
        return;
      }

      const uid = data.user.id;

      const { count } =
        await supabase
          .from("profiles")
          .select("*", {
            count: "exact",
            head: true
          });

      const folio =
        "AVY-" +
        String(
          (count || 0) + 1
        ).padStart(4, "0");

      const { error: profileError } =
        await supabase
          .from("profiles")
          .insert({
            id: uid,
            email,
            first_name: first,
            last_name: last,
            name: `${first} ${last}`,
            business_name: business,
            phone: phoneVal,
            advisor: advisorVal,
            city: "Saltillo",
            role: "client",
            approved: false,
            local_client_id: folio
          });

      if (profileError) {
        msg.textContent =
          profileError.message;

        loading(false);
        return;
      }

      window.location.href =
        "/auth/pending";

    } catch {
      msg.textContent =
        "Error inesperado.";

      loading(false);
    }
  });
});