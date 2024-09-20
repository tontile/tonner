import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type AccountMiniApps,
  type MiniApp,
  getAccountMiniAppsQuery,
  getMiniAppQuery,
} from "../../queries/miniapps";
import { miniappKeys } from "../keys";
import { getUser } from "../users";

export async function getMiniApp({
  miniapp_name,
}: { miniapp_name?: string }): Promise<MiniApp> {
  const supabase = createClient();

  if (!miniapp_name) {
    return;
  }

  const keyParts = miniappKeys.single({ miniapp_name });

  return createUnstableCache<MiniApp>(
    () =>
      getMiniAppQuery(
        {
          miniapp_name,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getAccountMiniApps(): Promise<AccountMiniApps> {
  const supabase = createClient();

  const user = await getUser();
  const account_name = user?.meta?.account_name;

  if (!account_name) {
    return;
  }

  const keyParts = miniappKeys.list({ account_name });

  return createUnstableCache<AccountMiniApps>(
    () =>
      getAccountMiniAppsQuery(
        {
          account_name,
        },
        supabase,
      ),
    keyParts,
  );
}
