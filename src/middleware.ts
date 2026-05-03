import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async ({ url, redirect }, next) => {
  const path = url.pathname;

  const protectedRoutes = [
    "/portal",
    "/admin"
  ];

  const needsAuth =
    protectedRoutes.some(route =>
      path.startsWith(route)
    );

  if (!needsAuth) return next();

  return next();
});