import { supabase } from "../lib/supabase";

const {
  data: { session }
} = await supabase.auth.getSession();

if (!session) {
  location.href = "/auth/login";
}