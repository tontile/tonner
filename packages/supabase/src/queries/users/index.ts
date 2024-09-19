import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetUserParams = {
  user_id?: string;
};

export async function getUserQuery(
  { user_id }: GetUserParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase
    .from("users")
    .select(
      `
      *,
      organizations (id, account_name, avatar_url),
      teams (id, account_name, partial_name, avatar_url),
      projects (id, account_name, partial_name, avatar_url)
    `,
    )
    .eq("id", user_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error(error);
  }
}

export type User = Awaited<ReturnType<typeof getUserQuery>>;
