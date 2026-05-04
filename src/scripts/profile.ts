import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  business_name?: string | null;
  phone?: string | null;
  city?: string | null;
  advisor?: string | null;
  local_client_id?: string | null;
  created_at?: string | null;
};

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id: string) => document.getElementById(id);

  const setText = (id: string, value: string) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  let user: any = null;
  let profile: Profile | null = null;

  /* =========================
     🎨 GRADIENT GENERATOR
  ========================= */
  function getGradient(seed: string) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const gradients = [
      "linear-gradient(135deg,#6366f1,#8b5cf6)",
      "linear-gradient(135deg,#ec4899,#f43f5e)",
      "linear-gradient(135deg,#22c55e,#06b6d4)",
      "linear-gradient(135deg,#f59e0b,#ef4444)",
      "linear-gradient(135deg,#0ea5e9,#6366f1)",
      "linear-gradient(135deg,#a855f7,#ec4899)"
    ];

    return gradients[Math.abs(hash) % gradients.length];
  }

  function renderAvatar() {
    const profileBox = $("profileAvatar");
    const sidebarBox = $("sidebarAvatar");

    if (!profile || !user) return;

    const letter =
      (
        profile.first_name?.[0] ||
        profile.business_name?.[0] ||
        user.email?.[0] ||
        "A"
      ).toUpperCase();

    const seed =
      profile.first_name ||
      profile.business_name ||
      user.email ||
      "A";

    const gradient = getGradient(seed);

    const html = `
      <span class="avatar-letter">
        ${letter}
      </span>
    `;

    [profileBox, sidebarBox].forEach((el) => {
      if (!el) return;

      el.innerHTML = html;

      const box = el as HTMLElement;

      box.style.background = gradient;
      box.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.45), 0 0 0 2px rgba(255,255,255,.04)";
    });
  }

  /* ========================= */
  async function loadProfile() {
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser();

    if (!authUser) {
      location.href = "/auth/login";
      return;
    }

    user = authUser;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data as Profile;

    const full =
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

    const biz =
      profile.business_name || "Mi negocio";

    const email =
      user.email || "--";

    setText("profileName", full || biz);
    setText("profileBusiness", biz);
    setText("profileEmail", email);
    setText("profileClientId", profile.local_client_id || "AVY-0000");

    setText("fullName", full || "--");
    setText("businessNameText", biz);
    setText("phoneText", profile.phone || "--");
    setText("emailText", email);
    setText("city", profile.city || "Saltillo");
    setText("advisor", profile.advisor || "--");

    ( $("businessNameInput") as HTMLInputElement ).value = biz;
    ( $("phoneInput") as HTMLInputElement ).value = profile.phone || "";
    ( $("emailInput") as HTMLInputElement ).value = email;

    renderAvatar();
  }

  /* ========================= */
  $("editProfileBtn")?.addEventListener("click", () => {
    $("editProfileBtn")?.classList.add("hidden");
    $("saveProfileBtn")?.classList.remove("hidden");
    $("cancelProfileBtn")?.classList.remove("hidden");

    ["businessNameInput", "phoneInput", "emailInput"].forEach(id =>
      $(id)?.classList.remove("hidden")
    );

    ["businessNameText", "phoneText", "emailText"].forEach(id =>
      $(id)?.classList.add("hidden")
    );
  });

  $("cancelProfileBtn")?.addEventListener(
    "click",
    () => location.reload()
  );

  $("saveProfileBtn")?.addEventListener(
    "click",
    async () => {
      const business =
        ( $("businessNameInput") as HTMLInputElement ).value.trim();

      const phone =
        ( $("phoneInput") as HTMLInputElement ).value.trim();

      const email =
        ( $("emailInput") as HTMLInputElement ).value.trim();

      await supabase
        .from("profiles")
        .update({
          business_name: business,
          phone
        })
        .eq("id", user.id);

      if (email && email !== user.email) {
        await supabase.auth.updateUser({ email });
      }

      location.reload();
    }
  );

  $("changePasswordBtn")?.addEventListener(
    "click",
    async () => {
      const pass = prompt("Nueva contraseña");

      if (!pass || pass.length < 6) {
        alert("Mínimo 6 caracteres");
        return;
      }

      await supabase.auth.updateUser({ password: pass });

      alert("Contraseña actualizada");
    }
  );

  loadProfile();
});