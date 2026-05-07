// src/scripts/portal.ts

import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {

  const $ = (id: string) =>
    document.getElementById(id);

  const sidebar = $("sidebar");
  const toggleSidebar = $("toggleSidebar");

  const iconOpen = $("iconOpen");
  const iconClose = $("iconClose");

  const logoutBtn = $("logoutBtn");
  const mobileLogout = $("mobileLogout");

  const sidebarName = $("sidebarName");
  const sidebarEmail = $("sidebarEmail");
  const sidebarAvatar = $("sidebarAvatar");

  const openMobileMenu = $("openMobileMenu");
  const closeMobileMenu = $("closeMobileMenu");

  const mobileSidebar = $("mobileSidebar");
  const mobileOverlay = $("mobileOverlay");

  /* =========================
     MOBILE MENU
  ========================= */

  function openMenu() {
    mobileSidebar?.classList.remove("-translate-x-full");
    mobileSidebar?.classList.remove("translate-x-[-100%]");

    mobileOverlay?.classList.remove("hidden");

    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileSidebar?.classList.add("-translate-x-full");
    mobileSidebar?.classList.add("translate-x-[-100%]");

    mobileOverlay?.classList.add("hidden");

    document.body.style.overflow = "";
  }

  openMobileMenu?.addEventListener("click", openMenu);

  closeMobileMenu?.addEventListener("click", closeMenu);

  mobileOverlay?.addEventListener("click", closeMenu);

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* =========================
     DESKTOP SIDEBAR
  ========================= */

  const collapsed =
    localStorage.getItem("sidebar-collapsed") === "true";

  if (collapsed) {
    sidebar?.classList.add("sidebar-collapsed");

    iconOpen?.classList.add("hidden");
    iconClose?.classList.remove("hidden");
  }

  toggleSidebar?.addEventListener("click", () => {

    const state =
      sidebar?.classList.toggle("sidebar-collapsed") || false;

    iconOpen?.classList.toggle("hidden", state);
    iconClose?.classList.toggle("hidden", !state);

    localStorage.setItem(
      "sidebar-collapsed",
      String(state)
    );
  });

  /* =========================
     ACTIVE LINKS
  ========================= */

  const path =
    location.pathname.replace(/\/$/, "") || "/";

  document.querySelectorAll(".nav-link").forEach((link) => {

    const href =
      (link.getAttribute("href") || "")
        .replace(/\/$/, "");

    if (!href) return;

    const isHome = href === "/portal";

    const active =
      isHome
        ? path === "/portal"
        : path === href ||
          path.startsWith(href + "/");

    link.classList.toggle("active-link", active);
  });

  /* =========================
     SESSION FIX
  ========================= */

  let tries = 0;
  let session = null;

  while (tries < 8 && !session) {

    const { data } =
      await supabase.auth.getSession();

    session = data.session;

    if (!session) {
      await new Promise((r) =>
        setTimeout(r, 350)
      );
    }

    tries++;
  }

  if (!session) {
    window.location.href = "/auth/login";
    return;
  }

  const user = session.user;

  /* =========================
     🔒 STATUS SECURITY GUARD
  ========================= */

  async function validateStatus() {

    try {

      const { data: latestProfile } = await supabase
        .from("profiles")
        .select(`
          status,
          role,
          first_name,
          last_name,
          name,
          email,
          avatar_url,
          business_name,
          official_client_id,
          local_client_id,
          payment_type
        `)
        .eq("id", user.id)
        .maybeSingle();

      if (!latestProfile) return;

      /* 🚫 BLOCKED */
      if (latestProfile.status === "blocked") {

        await supabase.auth.signOut();

        window.location.href = "/auth/blocked";

        return;
      }

      /* ⏳ PENDING */
      if (latestProfile.status === "pending") {

        await supabase.auth.signOut();

        window.location.href = "/auth/pending";

        return;
      }

      /* ❌ INVALID */
      if (latestProfile.status !== "active") {

        await supabase.auth.signOut();

        window.location.href = "/auth/login";

        return;
      }

    } catch (err) {
      console.error("validateStatus error", err);
    }
  }

  /* 🔥 VALIDACIÓN INICIAL */
  await validateStatus();

  /* 🔥 AUTO VALIDACIÓN */
  setInterval(() => {
    validateStatus();
  }, 15000);

  /* 🔥 VALIDAR AL VOLVER */
  window.addEventListener("focus", () => {
    validateStatus();
  });

  /* 🔥 VALIDAR EN NAVEGACIÓN */
window.addEventListener("popstate", () => {
  validateStatus();
});

/* 🔥 VALIDAR EN LINKS */
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    validateStatus();
  });
});

/* 🔥 VALIDAR AL VISIBILIDAD */
document.addEventListener("visibilitychange", () => {

  if (document.visibilityState === "visible") {
    validateStatus();
  }

});

/* =========================
   🔥 GLOBAL SECURITY CLICK GUARD
========================= */

window.addEventListener(
  "click",
  async (e) => {

    try {

      const { data: latestProfile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", user.id)
        .maybeSingle();

      if (!latestProfile) return;

      /* 🚫 BLOCKED */
      if (latestProfile.status === "blocked") {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        await supabase.auth.signOut();

        window.location.href = "/auth/blocked";

        return false;
      }

      /* ⏳ PENDING */
      if (latestProfile.status === "pending") {

        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        await supabase.auth.signOut();

        window.location.href = "/auth/pending";

        return false;
      }

    } catch (err) {
      console.error(err);
    }

  },
  true
);

  /* =========================
     PROFILE LOAD
  ========================= */

  try {

    let profile = null;
    let attempts = 0;

    while (!profile && attempts < 6) {

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      profile = data;

      if (!profile) {
        await new Promise((r) =>
          setTimeout(r, 250)
        );
      }

      attempts++;
    }

    if (!profile) {
      console.warn("Profile no disponible aún");
      return;
    }

    /* =========================
   🔥 ADMIN REDIRECT
========================= */

if (
  profile.role === "admin" ||
  profile.role === "super_admin"
) {

  window.location.href = "/admin";

  return;
}

    /* =========================
       🔒 STATUS GUARD
    ========================= */

    if (profile.status === "blocked") {

      await supabase.auth.signOut();

      window.location.href = "/auth/blocked";

      return;
    }

    if (profile.status === "pending") {

      await supabase.auth.signOut();

      window.location.href = "/auth/pending";

      return;
    }

    if (profile.status !== "active") {

      await supabase.auth.signOut();

      window.location.href = "/auth/login";

      return;
    }

    /* =========================
       USER DATA
    ========================= */

    const rawFirst =
      profile?.first_name ||
      profile?.firstname ||
      profile?.nombre ||
      "";

    const rawLast =
      profile?.last_name ||
      profile?.lastname ||
      profile?.apellido ||
      "";

    const firstName =
      String(rawFirst)
        .trim()
        .split(" ")[0] || "";

    const lastName =
      String(rawLast)
        .trim()
        .split(" ")[0] || "";

    let fullName = "";

    if (firstName || lastName) {

      fullName =
        `${firstName} ${lastName}`.trim();

    } else if (profile?.name) {

      const parts =
        String(profile.name)
          .trim()
          .split(/\s+/)
          .filter(Boolean);

      fullName =
        `${parts[0] || ""} ${parts[1] || ""}`.trim();

    } else if (profile?.full_name) {

      const parts =
        String(profile.full_name)
          .trim()
          .split(/\s+/)
          .filter(Boolean);

      fullName =
        `${parts[0] || ""} ${parts[1] || ""}`.trim();
    }

    if (!fullName) {
      fullName = "Cliente";
    }

    const email =
      profile?.email ||
      user.email ||
      "";

    /* =========================
       SIDEBAR
    ========================= */

    if (sidebarName) {
      sidebarName.textContent = fullName;
    }

    if (sidebarEmail) {
      sidebarEmail.textContent = email;
    }

    if (sidebarAvatar) {

      if (profile?.avatar_url) {

        sidebarAvatar.innerHTML = `
<img
src="${profile.avatar_url}"
class="h-full w-full rounded-2xl object-cover"
/>
`;

      } else {

        sidebarAvatar.textContent =
          fullName.charAt(0).toUpperCase();
      }
    }

    /* =========================
       MOBILE
    ========================= */

    const mobileName =
      document.getElementById("mobileName");

    const mobileEmail =
      document.getElementById("mobileEmail");

    const mobileAvatar =
      document.getElementById("mobileAvatar");

    if (mobileName) {
      mobileName.textContent = fullName;
    }

    if (mobileEmail) {
      mobileEmail.textContent = email;
    }

    if (mobileAvatar) {

      if (profile?.avatar_url) {

        mobileAvatar.innerHTML = `
<img
src="${profile.avatar_url}"
class="h-full w-full rounded-2xl object-cover"
/>
`;

      } else {

        mobileAvatar.textContent =
          fullName.charAt(0).toUpperCase();
      }
    }

  } catch (error) {

    console.error(error);

    if (sidebarName)
      sidebarName.textContent = "Cliente";

    if (sidebarEmail)
      sidebarEmail.textContent = "";

    if (sidebarAvatar)
      sidebarAvatar.textContent = "C";

    const mobileName =
      document.getElementById("mobileName");

    const mobileEmail =
      document.getElementById("mobileEmail");

    const mobileAvatar =
      document.getElementById("mobileAvatar");

    if (mobileName)
      mobileName.textContent = "Cliente";

    if (mobileEmail)
      mobileEmail.textContent = "";

    if (mobileAvatar)
      mobileAvatar.textContent = "C";
  }

  /* =========================
     WATCH SESSION
  ========================= */

  supabase.auth.onAuthStateChange(
    (_event, newSession) => {

      if (!newSession) {
        window.location.href = "/auth/login";
      }
    }
  );

  /* =========================
     LOGOUT
  ========================= */

  async function logout() {

    await supabase.auth.signOut();

    closeMenu();

    window.location.href = "/auth/login";
  }

  logoutBtn?.addEventListener("click", logout);

  mobileLogout?.addEventListener("click", logout);

});