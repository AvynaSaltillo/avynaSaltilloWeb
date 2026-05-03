import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm") as HTMLFormElement;
  const email = document.getElementById("email") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const eye = document.getElementById("togglePassword") as HTMLButtonElement;
  const msg = document.getElementById("msg") as HTMLElement;
  const btn = document.getElementById("submitBtn") as HTMLButtonElement;

  eye?.addEventListener("click", () => {
    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";
    btn.disabled = true;

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.value.trim(),
        password: password.value
      });

    if (error || !data.user) {
      msg.textContent = "Credenciales inválidas.";
      btn.disabled = false;
      return;
    }

    window.location.href =
      "/portal/dashboard";
  });
});