import { createClient } from "@/utils/supabase/client";

export async function fetchUserSession() {
  // Get the session from Supabase
  const supabase = createClient();

  // Get the session which contains the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session:", session);

  return session;
}
