import { supabase } from "../lib/supabase";

type ProfileRole =
  | "super_admin"
  | "admin"
  | "client";

type ProfileStatus =
  | "active"
  | "pending"
  | "blocked";

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("loginForm") as HTMLFormElement | null;

  const msg =
    document.getElementById("msg") as HTMLElement | null;

  const btn =
    document.getElementById("submitBtn") as HTMLButtonElement | null;

  const email =
    document.getElementById("email") as HTMLInputElement | null;

  const password =
    document.getElementById("password") as HTMLInputElement | null;

  const eye =
    document.getElementById("togglePassword") as HTMLButtonElement | null;

  if (!form || !msg || !btn || !email || !password) return;

  /* =========================
     👁 TOGGLE PASSWORD
  ========================= */

  eye?.addEventListener("click", (e) => {

    e.preventDefault();

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  /* =========================
     BUTTON LOADING
  ========================= */

  function loading(state: boolean) {

    btn!.disabled = state;

    btn!.textContent =
      state
        ? "Entrando..."
        : "Entrar";

    btn!.classList.toggle(
      "opacity-70",
      state
    );

    btn!.classList.toggle(
      "pointer-events-none",
      state
    );
  }

  /* =========================
     LOGIN
  ========================= */

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    msg.textContent = "";

    const mail =
      email.value
        .trim()
        .toLowerCase();

    const pass =
      password.value.trim();

    if (!mail || !pass) {

      msg.textContent =
        "Completa correo y contraseña.";

      return;
    }

    loading(true);

    try {

      /* =========================
         AUTH
      ========================= */

      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: mail,
        password: pass
      });

      if (error || !data.user) {

        msg.textContent =
          "Credenciales inválidas.";

        loading(false);

        return;
      }

      const uid = data.user.id;

      await supabase.auth.getSession();

      const sessionCheck =
  await supabase.auth.getSession();

console.log(sessionCheck);

      /* =========================
         PROFILE
      ========================= */

      const {
        data: profile,
        error: profileError
      } = await supabase
        .from("profiles")
        .select(`
          status,
          role,
          advisor_id
        `)
        .eq("id", uid)
        .maybeSingle();

     if (profileError || !profile) {

  console.log("PROFILE ERROR:", profileError);
  console.log("PROFILE:", profile);
  console.log("UID:", uid);

  msg.textContent =
    profileError?.message ||
    "No se pudo cargar perfil.";

  loading(false);

  return;
}


            const role =
  (profile.role as ProfileRole)
  || "client";

const status =
  profile.status as ProfileStatus;

      /* =========================
         STATUS FLOW
      ========================= */

      if (status === "pending") {

        loading(false);

        window.location.href =
          "/auth/pending";

        return;
      }

      if (status === "blocked") {

        await supabase.auth.signOut();

        loading(false);

        window.location.href =
          "/auth/blocked";

        return;
      }

      if (status !== "active") {

        await supabase.auth.signOut();

        msg.textContent =
          "Estado inválido.";

        loading(false);

        return;
      }

      /* =========================
         ROLE FLOW
      ========================= */

      // 🔥 SUPER ADMIN
      if (role === "super_admin") {

        loading(false);

        window.location.href =
          "/super-admin";

        return;
      }

      // 🔥 ADMIN / ADVISOR
      if (role === "admin") {

        loading(false);

        window.location.href =
          "/admin";

        return;
      }

      // 🔥 CLIENT
      loading(false);

      window.location.href =
        "/portal";

    } catch (err) {

      console.error(err);

      msg.textContent =
        "Error inesperado.";

      loading(false);
    }

  });

});