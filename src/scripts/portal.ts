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
  const sidebarAvatar = $("sidebarAvatar");

  const openMobileMenu = $("openMobileMenu");
  const closeMobileMenu = $("closeMobileMenu");
  const mobileSidebar = $("mobileSidebar");
  const mobileOverlay = $("mobileOverlay");

  /* =========================
     MOBILE MENU
  ========================= */
  const openMenu = () => {
    mobileSidebar?.classList.remove(
      "-translate-x-full"
    );

    mobileOverlay?.classList.remove(
      "hidden"
    );

    document.body.style.overflow =
      "hidden";
  };

  const closeMenu = () => {
    mobileSidebar?.classList.add(
      "-translate-x-full"
    );

    mobileOverlay?.classList.add(
      "hidden"
    );

    document.body.style.overflow =
      "";
  };

  openMobileMenu?.addEventListener(
    "click",
    openMenu
  );

  closeMobileMenu?.addEventListener(
    "click",
    closeMenu
  );

  mobileOverlay?.addEventListener(
    "click",
    closeMenu
  );

  document
    .querySelectorAll(".mobile-link")
    .forEach((link) => {
      link.addEventListener(
        "click",
        closeMenu
      );
    });

  /* =========================
     DESKTOP SIDEBAR
  ========================= */
  const collapsed =
    localStorage.getItem(
      "sidebar-collapsed"
    ) === "true";

  if (collapsed) {
    sidebar?.classList.add(
      "sidebar-collapsed"
    );

    iconOpen?.classList.add(
      "hidden"
    );

    iconClose?.classList.remove(
      "hidden"
    );
  }

  toggle?.addEventListener(
    "click",
    () => {
      const state =
        sidebar?.classList.toggle(
          "sidebar-collapsed"
        ) || false;

      iconOpen?.classList.toggle(
        "hidden",
        state
      );

      iconClose?.classList.toggle(
        "hidden",
        !state
      );

      localStorage.setItem(
        "sidebar-collapsed",
        String(state)
      );
    }
  );

  /* =========================
     ACTIVE LINKS
  ========================= */
  const path =
    location.pathname.replace(
      /\/$/,
      ""
    ) || "/";

  document
    .querySelectorAll(".nav-link")
    .forEach((link) => {
      const href =
        (
          link.getAttribute("href") ||
          ""
        ).replace(/\/$/, "");

      if (!href) return;

      const isHome =
        href === "/portal";

      const active =
        isHome
          ? path === "/portal"
          : path === href ||
            path.startsWith(
              href + "/"
            );

      if (active) {
        link.classList.add(
          "active-link"
        );
      } else {
        link.classList.remove(
          "active-link"
        );
      }
    });

  /* =========================
     AUTH FIX REAL
     NO REDIRECT AGRESIVO
  ========================= */

  let tries = 0;
  let session = null;

  while (
    tries < 8 &&
    !session
  ) {
    const {
      data
    } =
      await supabase.auth.getSession();

    session =
      data.session;

    if (!session) {
      await new Promise(
        (r) =>
          setTimeout(
            r,
            350
          )
      );
    }

    tries++;
  }

  if (!session) {
    window.location.href =
      "/auth/login";
    return;
  }

  const user =
    session.user;

  /* =========================
     PROFILE
  ========================= */
  try {
    const {
      data: profile
    } =
      await supabase
        .from("profiles")
        .select(`
          first_name,
          email,
          approved,
          avatar_url
        `)
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
      return;
    }

    const name =
      profile.first_name ||
      "Cliente";

    if (sidebarName) {
      sidebarName.textContent =
        name;
    }

    if (sidebarEmail) {
      sidebarEmail.textContent =
        profile.email ||
        user.email ||
        "";
    }

    if (sidebarAvatar) {
      if (
        profile.avatar_url
      ) {
        sidebarAvatar.innerHTML = `
          <img
            src="${profile.avatar_url}"
            class="h-full w-full rounded-2xl object-cover"
          />
        `;
      } else {
        sidebarAvatar.textContent =
          name
            .charAt(0)
            .toUpperCase();
      }
    }

  } catch (error) {
    console.error(error);
  }

  /* =========================
     AUTO REFRESH SESSION
  ========================= */
  supabase.auth.onAuthStateChange(
    (_event, newSession) => {
      if (!newSession) {
        window.location.href =
          "/auth/login";
      }
    }
  );

  /* =========================
     LOGOUT
  ========================= */
  async function logout() {
    await supabase.auth.signOut();

    closeMenu();

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