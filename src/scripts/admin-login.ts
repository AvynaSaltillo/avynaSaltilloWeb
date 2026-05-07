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

  /* =========================
     👁 PASSWORD
  ========================= */

  eye?.addEventListener("click", (e) => {

    e.preventDefault();

    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });

  /* =========================
     LOADING
  ========================= */

  function loading(state: boolean) {

    btn!.disabled = state;

    btn!.innerHTML =
      state
        ? "Entrando..."
        : `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 13c0 5-3.5 7-8 7s-8-2-8-7V8a2 2 0 0 1 2-2h1V4a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2z"/>
          </svg>
          Entrar al panel
        `;

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

      /* =========================
         VALIDAR ADMIN
      ========================= */

      const {
        data: admin,
        error: adminError
      } = await supabase
        .from("admins")
        .select("id")
        .eq("profile_id", uid)
        .maybeSingle();

      if (adminError || !admin) {

        await supabase.auth.signOut();

        msg.textContent =
          "No tienes acceso al panel.";

        loading(false);

        return;
      }

      /* =========================
         SUCCESS
      ========================= */

      window.location.href =
        "/admin";

    } catch (err) {

      console.error(err);

      msg.textContent =
        "Error inesperado.";

      loading(false);
    }

  });

});