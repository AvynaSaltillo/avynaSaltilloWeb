// src/scripts/auth-guard.ts

import { supabase } from "../lib/supabase";

(async () => {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      location.href = "/auth/login";
      return;
    }
  } catch {
    location.href = "/auth/login";
  }
})();