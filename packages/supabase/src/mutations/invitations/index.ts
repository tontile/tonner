import { logger } from "@tonner/logger";
import type { Client } from "../../types";

type CreateUserInviteParams = {
  account_name: string;
  membership_role: "owner" | "write" | "read";
  invitation_type: "one_time" | "24_hour";
  organization_id?: string;
  team_id?: string;
  project_id?: string;
};

export async function createUserInvite(
  params: CreateUserInviteParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("create_invitation", params);

  if (error) throw error;
  return data;
}

export type CreateUserInvite = Awaited<ReturnType<typeof createUserInvite>>;

type AcceptInviteByTokenParams = {
  token: string;
};

export async function acceptInviteByToken(
  { token }: AcceptInviteByTokenParams,
  supabase: Client,
) {
  try {
    const { error, data } = await supabase.rpc("accept_invitation", {
      lookup_invitation_token: token,
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

export type AcceptInviteByToken = Awaited<
  ReturnType<typeof acceptInviteByToken>
>;

type DeleteInviteParams = {
  invitation_id: string;
};

export async function deleteInvite(
  { invitation_id }: DeleteInviteParams,
  supabase: Client,
) {
  const { data, error } = await supabase.rpc("delete_invitation", {
    invitation_id,
  });

  if (error) throw error;
  return data;
}

export type DeleteInvite = Awaited<ReturnType<typeof deleteInvite>>;
