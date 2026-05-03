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

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

function loading(state: boolean) {
  if (!btn) return;

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
      const { data, error } =
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

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("approved, role")
          .eq("id", data.user.id)
          .maybeSingle();

      if (!profile) {
        msg.textContent =
          "No se encontró perfil.";
        loading(false);
        return;
      }

      if (profile.approved !== true) {
        window.location.href =
          "/auth/pending";
        return;
      }

      if (profile.role === "admin") {
        window.location.href =
          "/admin";
        return;
      }

      window.location.href =
        "/portal/dashboard";

    } catch {
      msg.textContent =
        "Error inesperado.";
      loading(false);
    }
  });
});