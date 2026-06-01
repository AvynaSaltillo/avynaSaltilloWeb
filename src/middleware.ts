import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  async ({ url, redirect, cookies }, next) => {

    const path = url.pathname;

    // =========================
    // PREVIEW ACCESS
    // =========================

    if (url.searchParams.get("preview")) {

      cookies.set(
        "preview",
        "true",
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 30
        }
      );

    }

    const preview =
      cookies.get("preview");

    // =========================
    // MODES
    // =========================

    const maintenance = false;

    // =========================
    // STATIC FILES
    // =========================

    const staticPaths = [
      "/images",
      "/fonts",
      "/favicon",
    ];

    const isStatic =
      staticPaths.some(route =>
        path.startsWith(route)
      );

    // =========================
    // MAINTENANCE MODE
    // =========================

    if (
      maintenance &&
      !preview
    ) {

      if (
        path !== "/maintenance" &&
        !isStatic
      ) {

        return redirect(
          "/maintenance"
        );

      }

      return next();

    }

    // =========================
    // PROTECTED ROUTES
    // =========================

    const protectedRoutes = [
      "/portal",
      "/admin"
    ];

    const needsAuth =
      protectedRoutes.some(route =>
        path.startsWith(route)
      );

    if (needsAuth) {

      return next();

    }

    return next();

  }
);