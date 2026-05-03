// src/scripts/profile.ts

import { supabase } from "../lib/supabase";

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id: string) =>
    document.getElementById(id);

  const setText = (
    id: string,
    value: string
  ) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  try {
    /* AUTH REAL */
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      location.href = "/auth/login";
      return;
    }

    const {
      data: profile,
      error
    } = await supabase
      .from("profiles")
      .select(`
        first_name,
        last_name,
        business_name,
        phone,
        city,
        advisor,
        local_client_id,
        approved,
        created_at
      `)
      .eq("id", user.id)
      .maybeSingle();

    if (error || !profile) {
      location.href = "/auth/signup";
      return;
    }

    if (profile.approved !== true) {
      location.href = "/auth/pending";
      return;
    }

    const fullName =
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

    setText("profileName", fullName || "Mi Perfil");
    setText("profileEmail", user.email || "");
    setText("profileClientId", profile.local_client_id || "AVY-0000");
    setText("profileStatus", "Activo");

    const avatar = $("profileAvatar");
    if (avatar) {
      avatar.textContent =
        (profile.first_name?.[0] ||
          user.email?.[0] ||
          "A").toUpperCase();
    }

    setText("firstName", profile.first_name || "--");
    setText("lastName", profile.last_name || "--");
    setText("businessName", profile.business_name || "--");
    setText("phone", profile.phone || "--");
    setText("city", profile.city || "Saltillo");
    setText("advisor", profile.advisor || "--");

    const { count } = await supabase
      .from("orders")
      .select("*", {
        count: "exact",
        head: true
      })
      .eq("user_id", user.id);

    setText("ordersTotal", String(count || 0));

    if (profile.created_at) {
      setText(
        "memberSince",
        new Date(profile.created_at).toLocaleDateString(
          "es-MX",
          {
            year: "numeric",
            month: "short"
          }
        )
      );
    }

    setText("lastAccess", "Hoy");

  } catch (err) {
    console.error(err);
    location.href = "/auth/login";
  }
});