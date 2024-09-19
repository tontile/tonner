import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetUserAccountsParams = {
  user_id?: string;
};

export async function getUserAccountsQuery(
  { user_id }: GetUserAccountsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase
    .from("account_registry")
    .select(`
      account_name,
      is_organization,
      organization:organizations!fk_account_registry(id,display_name),
      user:users!fk_account_registry(id,display_name),
      projects!fk_account_registry(id, account_name, partial_name, display_name),
      teams!fk_account_registry(id, account_name, partial_name, display_name)
  `)
    .order("created_at", { ascending: false });

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export type UserAccounts = Awaited<ReturnType<typeof getUserAccountsQuery>>;
