import { logger } from "@tonner/logger";
import type { Client, Json } from "../../types";

export type UpdateUserParams = {
  user_id: string;
  display_name?: string;
  bio?: string;
  public_metadata?: Json;
  replace_metadata?: boolean;
};

export async function updateUser(params: UpdateUserParams, supabase: Client) {
  const { data, error } = await supabase.rpc("update_user", params);

  if (error) {
    logger.error(error);
    return;
  }

  return data;
}

export type UpdateUser = Awaited<ReturnType<typeof updateUser>>;

export async function deleteUser(supabase: Client) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  await Promise.all([
    supabase.auth.admin.deleteUser(session.user.id),
    supabase.auth.signOut(),
  ]);

  return session.user.id;
}

export type DeleteUser = Awaited<ReturnType<typeof deleteUser>>;
