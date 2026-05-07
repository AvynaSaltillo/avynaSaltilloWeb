// src/scripts/signup.ts

import { supabase } from "../lib/supabase";

type Admin = {
  profile_id: string;
  display_name: string;
};

document.addEventListener("DOMContentLoaded", () => {

  const $ = (id: string) =>
    document.getElementById(id) as HTMLElement | null;

  const form = $("signupForm") as HTMLFormElement | null;
  const msg = $("msg") as HTMLElement | null;
  const btn = $("submitBtn") as HTMLButtonElement | null;

  const phone = $("phone") as HTMLInputElement | null;
  const password = $("password") as HTMLInputElement | null;
  const eye = $("togglePassword") as HTMLButtonElement | null;

  /* 🔥 ADVISOR */
  const advisor = $("advisor") as HTMLInputElement | null;
  const trigger = $("advisorTrigger") as HTMLButtonElement | null;
  const menu = $("advisorMenu") as HTMLElement | null;
  const label = $("advisorLabel") as HTMLElement | null;
  const arrow = $("advisorArrow") as HTMLElement | null;

  /* 🔥 ADDRESS */
  const address = $("address") as HTMLInputElement | null;
  const colony = $("colony") as HTMLInputElement | null;
  const postalCode = $("postalCode") as HTMLInputElement | null;

  let admins: Admin[] = [];

  if (
    !form ||
    !msg ||
    !btn ||
    !phone ||
    !password ||
    !advisor ||
    !address ||
    !colony ||
    !postalCode
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
     ADVISOR MENU
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
     LOAD ADMINS
  ========================= */

  async function loadAdmins() {

    const { data, error } = await supabase
      .from("admins")
      .select(`
        profile_id,
        display_name
      `)
      .eq("active", true)
      .order("display_name");

    if (error || !data || !menu) {
      console.error(error);
      return;
    }

    admins = data;

    menu.innerHTML = data.map((admin) => `
      <button
        type="button"
        class="advisor-option w-full px-4 py-3 text-left hover:bg-white/5 transition"
        data-id="${admin.profile_id}"
        data-name="${admin.display_name}"
      >
        ${admin.display_name}
      </button>
    `).join("");

    bindAdvisorOptions();

  }

  function bindAdvisorOptions() {

    document
      .querySelectorAll(".advisor-option")
      .forEach((item) => {

        item.addEventListener("click", () => {

          const el = item as HTMLElement;

          const id = el.dataset.id || "";
          const name = el.dataset.name || "";

          if (advisor) {
  advisor.value = id;
}

          if (label) {

            label.textContent = name;

            label.classList.remove("text-white/40");
            label.classList.add("text-white");

          }

          closeMenu();

        });

      });

  }

  /* =========================
     LOADING UI
  ========================= */

  function loading(state: boolean) {

    btn!.disabled = state;

    btn!.textContent = state
      ? "Creando cuenta..."
      : "Crear cuenta";

    btn!.classList.toggle("opacity-70", state);

  }

  /* =========================
     SUBMIT
  ========================= */

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    msg.textContent = "";

    const first =
      ($("firstName") as HTMLInputElement)
        ?.value
        .trim().toUpperCase();

    const last =
      ($("lastName") as HTMLInputElement)
        ?.value
        .trim().toUpperCase();

    const business =
      ($("business") as HTMLInputElement)
        ?.value
        .trim().toUpperCase();

    const email =
      ($("email") as HTMLInputElement)
        ?.value
        .trim()
        .toLowerCase();

    const phoneVal = phone.value.trim();
    const advisorVal = advisor.value.trim();
console.log("ADVISOR:", advisorVal);

    const pass = password.value.trim();

    const addressVal = address.value.trim();
    const colonyVal = colony.value.trim();
    const postalCodeVal = postalCode.value.trim();

    /* VALIDATION */

    if (
      !first ||
      !last ||
      !business ||
      !email ||
      !phoneVal ||
      !advisorVal ||
      !pass ||
      !addressVal ||
      !colonyVal ||
      !postalCodeVal
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

    let uid = "";

    try {
      /* AUTH */

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

      /* CLIENT ID */

      const folio =
        "AVY-" +
        crypto.randomUUID()
          .slice(0, 6)
          .toUpperCase();

      /* INSERT PROFILE */

      console.log({
  advisorVal
});

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

            /* 🔥 NEW SYSTEM */
            advisor_id: advisorVal,
            
            /* ADDRESS */

            address_line: addressVal,
            colony: colonyVal,
            postal_code: postalCodeVal,

            city: "Saltillo",
            state: "Coahuila",
            country: "MX",

            /* CORE */

            role: "client",
            status: "pending",
            payment_type: "credit",

            /* IDS */

            local_client_id: folio,
            official_client_id: null

          });

      if (profileError) {

        console.error(profileError);
        console.log(profileError);

        await supabase.auth.signOut();

        msg.textContent =
          "Cuenta creada parcialmente. Contacta soporte.";

        loading(false);

        return;

      }

      window.location.href = "/auth/pending";

    } catch (error) {

      console.error(error);

      msg.textContent =
        "Error inesperado.";

      loading(false);

    }

  });

  /* INIT */

  loadAdmins();

});