import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", () => {
  const eye = document.getElementById("togglePassword");
  const password =
    document.getElementById("password") as HTMLInputElement;

  eye?.addEventListener("click", () => {
    password.type =
      password.type === "password"
        ? "text"
        : "password";
  });
});