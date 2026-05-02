import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";

export const onRequest = defineMiddleware(
  async (context, next) => {

    const { cookies, redirect, url } = context;
    const path = url.pathname;

    /* =========================
       RUTAS PROTEGIDAS
    ========================= */

    const protectedRoutes = [
      "/portal",
      "/grow",
      "/admin"
    ];

    const needsAuth =
      protectedRoutes.some(route =>
        path.startsWith(route)
      );

    /* públicas */
    if (!needsAuth) {
      return next();
    }

    /* =========================
       SUPABASE SSR
    ========================= */

    const supabase = createServerClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookies.get(name)?.value;
          },

          set(
            name: string,
            value: string,
            options: any
          ) {
            cookies.set(name, value, options);
          },

          remove(
            name: string,
            options: any
          ) {
            cookies.delete(name, options);
          }
        }
      }
    );

    /* =========================
       USUARIO LOGUEADO
    ========================= */

    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      return redirect("/login");
    }

    /* =========================
       PERFIL
    ========================= */

    const { data: profile } = await supabase
      .from("profiles")
      .select("approved, role")
      .eq("id", user.id)
      .maybeSingle();

    /* si no existe perfil */
    if (!profile) {
      await supabase.auth.signOut();
      return redirect("/signup");
    }

    /* =========================
       APROBACIÓN
    ========================= */

    if (profile.approved !== true) {
      return redirect("/auth/pending");
    }

    /* =========================
       ADMIN
    ========================= */

    if (
      path.startsWith("/admin") &&
      profile.role !== "admin"
    ) {
      return redirect("/portal");
    }

    /* ========================= */

    return next();
  }
);