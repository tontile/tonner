import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type UserAccounts,
  getUserAccountsQuery,
} from "../../queries/accounts";
import { accountKeys } from "../keys";
import { getUser } from "../users";

export async function getUserAccounts(): Promise<UserAccounts> {
  const supabase = createClient();

  const user = await getUser();

  const user_id = user?.data?.id;

  if (!user_id) {
    return;
  }

  const keyParts = accountKeys.userAccounts({ user_id });

  return createUnstableCache<UserAccounts>(
    () =>
      getUserAccountsQuery(
        {
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}
