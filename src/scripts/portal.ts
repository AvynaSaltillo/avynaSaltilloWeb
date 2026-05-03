// src/scripts/portal.ts

import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id: string) =>
    document.getElementById(id);

  const sidebar = $("sidebar");
  const toggle = $("toggleSidebar");
  const iconOpen = $("iconOpen");
  const iconClose = $("iconClose");

  const logoutBtn = $("logoutBtn");
  const mobileLogout = $("mobileLogout");

  const sidebarName = $("sidebarName");
  const sidebarEmail = $("sidebarEmail");

  /* =========================
     RESTORE SIDEBAR STATE
  ========================= */
  const collapsed =
    localStorage.getItem("sidebar-collapsed") === "true";

  if (collapsed) {
    sidebar?.classList.add("sidebar-collapsed");
    iconOpen?.classList.add("hidden");
    iconClose?.classList.remove("hidden");
  }

  /* =========================
     TOGGLE SIDEBAR
  ========================= */
  toggle?.addEventListener("click", () => {
    const isCollapsed =
      sidebar?.classList.toggle(
        "sidebar-collapsed"
      ) || false;

    iconOpen?.classList.toggle(
      "hidden",
      isCollapsed
    );

    iconClose?.classList.toggle(
      "hidden",
      !isCollapsed
    );

    localStorage.setItem(
      "sidebar-collapsed",
      String(isCollapsed)
    );
  });

  /* =========================
     ACTIVE LINK
  ========================= */
  const path = window.location.pathname;

  document
    .querySelectorAll(".nav-link")
    .forEach((link) => {
      const href =
        link.getAttribute("href");

      if (
        href &&
        path.startsWith(href)
      ) {
        link.classList.add(
          "active-link"
        );
      }
    });

  /* =========================
     AUTH CHECK
  ========================= */
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href =
        "/auth/login";
      return;
    }

    const {
      data: profile,
      error: profileError
    } = await supabase
      .from("profiles")
      .select(
        "first_name,email,approved"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile
    ) {
      window.location.href =
        "/auth/signup";
      return;
    }

    if (
      profile.approved !== true
    ) {
      window.location.href =
        "/auth/pending";
      return;
    }

    if (sidebarName) {
      sidebarName.textContent =
        profile.first_name ||
        "Cliente";
    }

    if (sidebarEmail) {
      sidebarEmail.textContent =
        profile.email ||
        user.email ||
        "";
    }

  } catch {
    window.location.href =
      "/auth/login";
    return;
  }

  /* =========================
     LOGOUT
  ========================= */
  async function logout() {
    try {
      await supabase.auth.signOut();
    } catch {}

    window.location.href =
      "/auth/login";
  }

  logoutBtn?.addEventListener(
    "click",
    logout
  );

  mobileLogout?.addEventListener(
    "click",
    logout
  );
});