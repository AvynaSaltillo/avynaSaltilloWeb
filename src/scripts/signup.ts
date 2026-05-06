// src/scripts/signup.ts

import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id: string) =>
    document.getElementById(id) as HTMLElement | null;

  const form = $("signupForm") as HTMLFormElement | null;
  const msg = $("msg") as HTMLElement | null;
  const btn = $("submitBtn") as HTMLButtonElement | null;

  const phone = $("phone") as HTMLInputElement | null;
  const password = $("password") as HTMLInputElement | null;
  const eye = $("togglePassword") as HTMLButtonElement | null;

  const advisor = $("advisor") as HTMLInputElement | null;
  const trigger = $("advisorTrigger") as HTMLButtonElement | null;
  const menu = $("advisorMenu") as HTMLElement | null;
  const label = $("advisorLabel") as HTMLElement | null;
  const arrow = $("advisorArrow") as HTMLElement | null;

  if (
    !form ||
    !msg ||
    !btn ||
    !phone ||
    !password ||
    !advisor
  ) return;

  /* =========================
     PHONE FORMAT
  ========================= */
  phone.addEventListener("input", () => {
    phone.value = phone.value
      .replace(/\D/g, "")
      .slice(0, 10);
  });

  /* =========================
     👁 PASSWORD TOGGLE
  ========================= */
  eye?.addEventListener("click", (e) => {
    e.preventDefault();

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  /* =========================
     ASESOR DROPDOWN
  ========================= */
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

        advisor.value = val;

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

  /* =========================
     LOADING UI
  ========================= */
  function loading(state: boolean) {
    if (!btn) return;

    btn.disabled = state;
    btn.textContent = state
      ? "Creando cuenta..."
      : "Crear cuenta";

    btn.classList.toggle("opacity-70", state);
  }

  /* =========================
     SUBMIT
  ========================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";

    const first = (
      $("firstName") as HTMLInputElement
    )?.value.trim();

    const last = (
      $("lastName") as HTMLInputElement
    )?.value.trim();

    const business = (
      $("business") as HTMLInputElement
    )?.value.trim();

    const email = (
      $("email") as HTMLInputElement
    )?.value.trim().toLowerCase();

    const phoneVal = phone.value.trim();
    const advisorVal = advisor.value.trim();
    const pass = password.value.trim();

    /* VALIDACIÓN */
    if (
      !first ||
      !last ||
      !business ||
      !email ||
      !phoneVal ||
      !advisorVal ||
      !pass
    ) {
      msg.textContent = "Completa todos los campos.";
      return;
    }

    if (pass.length < 8) {
      msg.textContent =
        "La contraseña debe tener mínimo 8 caracteres.";
      return;
    }

    loading(true);

    let uid = "";

    try {
      /* LIMPIAR SESIÓN */
      await supabase.auth.signOut();

      /* =========================
         AUTH USER
      ========================= */
      const {
        data: authData,
        error: authError
      } = await supabase.auth.signUp({
        email,
        password: pass
      });

      if (authError || !authData.user) {
        msg.textContent =
          authError?.message ||
          "No se pudo crear usuario.";

        loading(false);
        return;
      }

      uid = authData.user.id;

      /* =========================
         GENERAR FOLIO
      ========================= */
      const folio =
        "AVY-" +
        crypto.randomUUID()
          .slice(0, 6)
          .toUpperCase();

      /* =========================
         INSERT PROFILE
      ========================= */
      const {
        error: profileError
      } = await supabase
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

          /* 🔥 SISTEMA NUEVO */
          role: "client",
          status: "pending",

          /* 💰 CONFIG */
          payment_type: "cash",

          /* 🆔 IDS */
          local_client_id: folio,
          official_client_id: null
        });

      if (profileError) {
        await supabase.auth.signOut();

        msg.textContent =
          "Cuenta creada parcialmente. Contacta soporte.";

        loading(false);
        return;
      }

      /* REDIRECT */
      window.location.href = "/auth/pending";

    } catch (error) {
      console.error(error);

      msg.textContent = "Error inesperado.";

      loading(false);
    }
  });
});