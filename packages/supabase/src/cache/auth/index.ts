import "server-only";

import { cache } from "react";
import { createClient } from "../../clients/server";

export const getSession = cache(async () => {
  const supabase = createClient();

  return supabase.auth.getSession();
});
