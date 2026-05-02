import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  async ({ url }, next) => {

    const path = url.pathname;

    const protectedRoutes = [
      "/portal",
      "/grow",
      "/admin"
    ];

    const needsAuth = protectedRoutes.some(route =>
      path.startsWith(route)
    );

    if (!needsAuth) {
      return next();
    }

    return next();
  }
);