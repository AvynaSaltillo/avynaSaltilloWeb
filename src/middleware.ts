import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  async ({ url, redirect, cookies }, next) => {

    const path =
      url.pathname;

    /* =========================
       PREVIEW ACCESS
    ========================= */

    if (
      url.searchParams.get("preview")
    ) {

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

    /* =========================
       MODES
    ========================= */

    const comingSoon =
      true;

    const maintenance =
      false;

    /* =========================
       ALLOWED PATHS
    ========================= */

    const allowedPaths = [

      "/coming-soon",

      "/maintenance",

      "/images",

      "/fonts",

      "/favicon",

    ];

    const isAllowed =
      allowedPaths.some(route =>
        path.startsWith(route)
      );

    /* =========================
       MAINTENANCE MODE
    ========================= */

    if (
      maintenance &&
      !preview &&
      !isAllowed
    ) {

      return redirect(
        "/maintenance"
      );

    }

    /* =========================
       COMING SOON MODE
    ========================= */

    if (
      comingSoon &&
      !preview &&
      !isAllowed
    ) {

      return redirect(
        "/coming-soon"
      );

    }

    /* =========================
       PROTECTED ROUTES
    ========================= */

    const protectedRoutes = [
      "/portal",
      "/admin"
    ];

    const needsAuth =
      protectedRoutes.some(route =>
        path.startsWith(route)
      );

    // aquí luego pondrás auth real
    if (needsAuth) {

      return next();

    }

    return next();

  }
);