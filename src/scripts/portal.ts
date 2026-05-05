// src/scripts/portal.ts
// PREMIUM DEFINITIVO (basado en tu archivo bueno)

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
      (link.getAttribute("href") || "").replace(/\/$/, "");

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
     SESSION FIX REAL
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
     PROFILE LOAD + STATUS GUARD 🔥
  ========================= */
  try {
    // =========================
// 🔥 PROFILE FIX (ANTI-RACE)
// =========================

// =========================
// 🔥 PROFILE LOAD SAFE
// =========================

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
    await new Promise(r => setTimeout(r, 250));
  }

  attempts++;
}

// ⚠️ SOLO FALLA SI DESPUÉS DE INTENTOS NO HAY PROFILE
if (!profile) {
  console.warn("Profile no disponible aún, evitando logout forzado");
  return; // 🔥 clave: NO cerrar sesión
}

if (!profile) {
  await supabase.auth.signOut();
  window.location.href = "/auth/login";
  return;
}

    // =========================
    // 🔥 STATUS GUARD (AQUÍ ESTÁ EL FIX)
    // =========================
   /* 🔒 BLOQUEADO */
if (profile.status === "blocked") {
  await supabase.auth.signOut();
  window.location.href = "/auth/blocked";
  return;
}

/* 🚫 SOLO ACTIVE PUEDE ESTAR AQUÍ */
if (profile.status !== "active") {
  window.location.href = "/auth/login";
  return;
}

    // =========================
    // 👇 TU LÓGICA ORIGINAL (NO TOCADA)
    // =========================

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
    }

    else if (profile?.name) {
      const parts =
        String(profile.name)
          .trim()
          .split(/\s+/)
          .filter(Boolean);

      fullName =
        `${parts[0] || ""} ${parts[1] || ""}`.trim();
    }

    else if (profile?.full_name) {
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

    if (sidebarName) {
      sidebarName.textContent = fullName;
    }

    if (sidebarEmail) {
      sidebarEmail.textContent = email;
    }

    if (sidebarAvatar) {
      if (profile?.avatar_url) {
        sidebarAvatar.innerHTML = `
<img src="${profile.avatar_url}" class="h-full w-full rounded-2xl object-cover"/>
`;
      } else {
        sidebarAvatar.textContent =
          fullName.charAt(0).toUpperCase();
      }
    }

    const mobileName = document.getElementById("mobileName");
    const mobileEmail = document.getElementById("mobileEmail");
    const mobileAvatar = document.getElementById("mobileAvatar");

    if (mobileName) mobileName.textContent = fullName;
    if (mobileEmail) mobileEmail.textContent = email;

    if (mobileAvatar) {
      if (profile?.avatar_url) {
        mobileAvatar.innerHTML = `
<img src="${profile.avatar_url}" class="h-full w-full rounded-2xl object-cover"/>
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

    const mobileName = document.getElementById("mobileName");
    const mobileEmail = document.getElementById("mobileEmail");
    const mobileAvatar = document.getElementById("mobileAvatar");

    if (mobileName) mobileName.textContent = "Cliente";
    if (mobileEmail) mobileEmail.textContent = "";
    if (mobileAvatar) mobileAvatar.textContent = "C";
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