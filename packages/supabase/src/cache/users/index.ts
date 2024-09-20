import "server-only";

import type { UserAppMetadata, UserMetadata } from "@supabase/supabase-js";
import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import { type User, getUserQuery } from "../../queries/users";
import { getSession } from "../auth";
import { userKeys } from "../keys";

export interface CurrentUser {
  data: User | undefined;
  meta: UserMetadata | undefined;
  app: UserAppMetadata | undefined;
}

export async function getUser(): Promise<CurrentUser | undefined> {
  const {
    data: { session },
  } = await getSession();

  if (!session) {
    return;
  }

  const user_id = session.user.id;
  const meta = session.user.user_metadata;
  const app = session.user.app_metadata;

  const keyParts = userKeys.single({ user_id });

  const supabase = createClient();

  const cachedUser = await createUnstableCache(async () => {
    const data = await getUserQuery({ user_id }, supabase);
    return { data, meta, app };
  }, keyParts);

  return cachedUser;
}
