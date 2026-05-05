import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm") as HTMLFormElement | null;
  const msg = document.getElementById("msg") as HTMLElement | null;
  const btn = document.getElementById("submitBtn") as HTMLButtonElement | null;
  const email = document.getElementById("email") as HTMLInputElement | null;
  const password = document.getElementById("password") as HTMLInputElement | null;
  const eye = document.getElementById("togglePassword") as HTMLButtonElement | null;

  if (!form || !msg || !btn || !email || !password) return;

  /* 👁 TOGGLE PASSWORD */
  eye?.addEventListener("click", (e) => {
    e.preventDefault();
    password.type = password.type === "password" ? "text" : "password";
  });

  /* LOADING */
  function loading(state: boolean) {
    btn!.disabled = state;
    btn!.textContent = state ? "Entrando..." : "Entrar";
    btn!.classList.toggle("opacity-70", state);
  }

  /* LOGIN */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";

    const mail = email.value.trim().toLowerCase();
    const pass = password.value.trim();

    if (!mail || !pass) {
      msg.textContent = "Completa correo y contraseña.";
      return;
    }

    loading(true);

    try {
      /* AUTH */
      const { data, error } = await supabase.auth.signInWithPassword({
        email: mail,
        password: pass
      });

      if (error || !data.user) {
        msg.textContent = "Credenciales inválidas.";
        loading(false);
        return;
      }

      const uid = data.user.id;

      /* PROFILE */
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("status, role")
        .eq("id", uid)
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        msg.textContent = "No se pudo cargar perfil.";
        loading(false);
        return;
      }

      /* =========================
         🔥 STATUS FLOW
      ========================= */

      if (profile.status === "pending") {
        loading(false);
        window.location.href = "/auth/pending";
        return;
      }

      if (profile.status === "blocked") {
        await supabase.auth.signOut(); // 🔥 clave
        loading(false);
        window.location.href = "/auth/blocked";
        return;
      }

      if (profile.status !== "active") {
        msg.textContent = "Estado desconocido.";
        loading(false);
        return;
      }

      /* =========================
         🔥 ROLE FLOW
      ========================= */

      if (profile.role === "admin") {
        loading(false);
        window.location.href = "/admin";
        return;
      }

      loading(false);
      window.location.href = "/portal";

    } catch (err) {
      console.error(err);
      msg.textContent = "Error inesperado.";
      loading(false);
    }
  });

});