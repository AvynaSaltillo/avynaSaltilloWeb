// src/scripts/login.ts

import { supabase } from "../lib/supabase";

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

  /* 👁 TOGGLE PASSWORD */
  eye?.addEventListener("click", (e) => {
    e.preventDefault();

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  /* LOADING */
  function loading(state: boolean) {
    if(!btn) return;
    btn.disabled = state;

    btn.textContent =
      state
        ? "Entrando..."
        : "Entrar";

    btn.classList.toggle(
      "opacity-70",
      state
    );
  }

  /* LOGIN */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";

    const mail =
      email.value.trim().toLowerCase();

    const pass =
      password.value.trim();

    if (!mail || !pass) {
      msg.textContent =
        "Completa correo y contraseña.";
      return;
    }

    loading(true);

    try {
      /* LOGIN AUTH */
      const {
        data,
        error
      } =
        await supabase.auth.signInWithPassword({
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

      /* PERFIL */
      const {
        data: profile,
        error: profileError
      } =
        await supabase
          .from("profiles")
          .select("approved, role")
          .eq("id", uid)
          .maybeSingle();

      if (profileError) {
        msg.textContent =
          "No se pudo cargar perfil.";
        loading(false);
        return;
      }

      /* SIN PROFILE */
      if (!profile) {
        await supabase.auth.signOut();

        msg.textContent =
          "Cuenta incompleta. Contacta soporte.";
        loading(false);
        return;
      }

      /* NO APROBADO */
      if (profile.approved !== true) {
        window.location.href =
          "/auth/pending";
        return;
      }

      /* ADMIN */
      if (profile.role === "admin") {
        window.location.href =
          "/admin";
        return;
      }

      /* CLIENTE */
      window.location.href =
        "/portal/dashboard";

    } catch (err) {
      console.error(err);

      msg.textContent =
        "Error inesperado.";

      loading(false);
    }
  });
});