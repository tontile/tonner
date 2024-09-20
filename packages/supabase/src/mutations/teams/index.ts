import { logger } from "@tonner/logger";
import type { Client, Json } from "../../types";

type CreateTeamParams = {
  account_name: string;
  partial_name: string;
  display_name?: string;
  bio?: string;
};

export async function createTeam(params: CreateTeamParams, supabase: Client) {
  const { error, data } = await supabase.rpc("create_team", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type CreateTeam = Awaited<ReturnType<typeof createTeam>>;

type UpdateTeamParams = {
  team_id: string;
  display_name?: string;
  bio?: string;
  public_metadata?: Json;
  replace_metadata?: boolean;
};

export async function updateTeam(params: UpdateTeamParams, supabase: Client) {
  const { error, data } = await supabase.rpc("update_team", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type UpdateTeam = Awaited<ReturnType<typeof updateTeam>>;

type DeleteTeamParams = {
  team_id: string;
};

export async function deleteTeam(params: DeleteTeamParams, supabase: Client) {
  return supabase.from("teams").delete().eq("id", params.team_id);
}

type UpdateUserOnTeamParams = {
  team_id: string;
  user_id: string;
  new_membership_role: "owner" | "write" | "read";
};

export async function updateTeamUser(
  params: UpdateUserOnTeamParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("update_user_on_team", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type UpdateTeamUser = Awaited<ReturnType<typeof updateTeamUser>>;

type DeleteTeamUserParams = {
  team_id: string;
  user_id: string;
};

export async function removeTeamUser(
  params: DeleteTeamUserParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("remove_team_user", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type RemoveTeamUser = Awaited<ReturnType<typeof removeTeamUser>>;
