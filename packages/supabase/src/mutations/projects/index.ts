import { logger } from "@tonner/logger";
import type { Client, Json } from "../../types";

type CreateProjectParams = {
  account_name: string;
  partial_name: string;
  display_name?: string;
  bio?: string;
  public: boolean;
  archived: boolean;
};

export async function createProject(
  params: CreateProjectParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("create_project", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type CreateProject = Awaited<ReturnType<typeof createProject>>;

type UpdateProjectParams = {
  project_id: string;
  display_name?: string;
  bio?: string;
  public_metadata?: Json;
  replace_metadata?: boolean;
};

export async function updateProject(
  params: UpdateProjectParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("update_project", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type UpdateProject = Awaited<ReturnType<typeof updateProject>>;

type DeleteProjectParams = {
  project_id: string;
};

export async function deleteProject(
  params: DeleteProjectParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("delete_project", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type DeleteProject = Awaited<ReturnType<typeof deleteProject>>;

type UpdateProjectUserParams = {
  project_id: string;
  user_id: string;
  new_membership_role: "owner" | "write" | "read";
};

export async function updateProjectUser(
  params: UpdateProjectUserParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("update_user_on_project", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type UpdateProjectUser = Awaited<ReturnType<typeof updateProjectUser>>;

type RemoveProjectUserParams = {
  project_id: string;
  user_id: string;
};

export async function removeProjectUser(
  params: RemoveProjectUserParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("remove_project_user", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type RemoveProjectUser = Awaited<ReturnType<typeof removeProjectUser>>;

type RemoveProjectTeamParams = {
  project_id: string;
  team_id: string;
};

export async function removeProjectTeam(
  params: RemoveProjectTeamParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("remove_project_team", params);

  if (error) {
    logger.error(error);
    return null;
  }

  return data;
}

export type RemoveProjectTeam = Awaited<ReturnType<typeof removeProjectTeam>>;
