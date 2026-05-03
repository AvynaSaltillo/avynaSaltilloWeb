import { createClient } from "@supabase/supabase-js";

const url =
  import.meta.env.PUBLIC_SUPABASE_URL;

const key =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Faltan variables PUBLIC_SUPABASE_URL o PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase =
  createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });