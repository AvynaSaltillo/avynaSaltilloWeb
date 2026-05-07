import { supabase } from "../lib/supabase";

/* ========================================
   LOGOUT
======================================== */

const logoutBtn =
  document.getElementById("logoutBtn");

logoutBtn?.addEventListener(
  "click",
  async () => {

    await supabase.auth.signOut();

    window.location.href =
      "/admin/login";
  }
);

/* ========================================
   MOBILE SIDEBAR
======================================== */

const sidebar =
  document.getElementById("sidebar");

const overlay =
  document.getElementById("sidebarOverlay");

const openBtn =
  document.getElementById("openSidebar");

const closeBtn =
  document.getElementById("closeSidebar");

function openSidebar() {

  sidebar?.classList.remove(
    "-translate-x-full"
  );

  overlay?.classList.remove(
    "opacity-0",
    "pointer-events-none"
  );

  document.documentElement.style.overflow =
  "hidden";
}

function closeSidebar() {

  sidebar?.classList.add(
    "-translate-x-full"
  );

  overlay?.classList.add(
    "opacity-0",
    "pointer-events-none"
  );

  document.documentElement.style.overflow =
  "";
}

openBtn?.addEventListener(
  "click",
  openSidebar
);

closeBtn?.addEventListener(
  "click",
  closeSidebar
);

overlay?.addEventListener(
  "click",
  closeSidebar
);

/* ========================================
   AUTO CLOSE MOBILE NAV
======================================== */

document
  .querySelectorAll(".nav-admin")
  .forEach((item) => {

    item.addEventListener(
      "click",
      closeSidebar
    );
  });