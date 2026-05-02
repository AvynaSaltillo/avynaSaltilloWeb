import { defineMiddleware } from "astro:middleware";
import { createServerClient } from "@supabase/ssr";

export const onRequest = defineMiddleware(
  async (context, next) => {

    const { url, cookies, redirect } = context;
    const path = url.pathname;

    /* IGNORAR ARCHIVOS Y ASTRO INTERNOS */
    if (
      path.startsWith("/_astro") ||
      path.startsWith("/favicon") ||
      path.includes(".")
    ) {
      return next();
    }

    /* SOLO RUTAS PRIVADAS */
    const protectedRoutes = [
      "/portal",
      "/admin"
    ];

    const needsAuth =
      protectedRoutes.some(route =>
        path.startsWith(route)
      );

    if (!needsAuth) {
      return next();
    }

    try {

      const supabase = createServerClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            get(name: string) {
              return cookies.get(name)?.value;
            },

            set(name: string, value: string, options: any) {
              cookies.set(name, value, options);
            },

            remove(name: string, options: any) {
              cookies.delete(name, options);
            }
          }
        }
      );

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/login");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("approved, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        return redirect("/signup");
      }

      if (profile.approved !== true) {
        return redirect("/auth/pending");
      }

      if (
        path.startsWith("/admin") &&
        profile.role !== "admin"
      ) {
        return redirect("/portal");
      }

      return next();

    } catch (error) {

      console.error(error);

      return redirect("/login");
    }
  }
);