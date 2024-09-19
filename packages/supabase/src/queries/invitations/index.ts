import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetOrganizationInvitesParams = {
  organization_id?: string;
};

export async function getOrganizationInvitesQuery(
  { organization_id }: GetOrganizationInvitesParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!organization_id) {
    return [];
  }

  let query = supabase
    .from("invitations")
    .select(
      `*, 
      user:users!invited_by(*), 
      invitee:users!account_name(*), 
      organization:organization_id(*), 
      team:team_id(*), 
      project:project_id(*)
      `,
    )
    .eq("organization_id", organization_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return;
    }

    return data ?? [];
  } catch (error) {
    logger.error(error);
  }
}

export type OrganizationInvites = Awaited<
  ReturnType<typeof getOrganizationInvitesQuery>
>;

export type GetTeamInvitesParams = {
  team_id?: string;
};

export async function getTeamInvitesQuery(
  { team_id }: GetTeamInvitesParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!team_id) {
    return [];
  }

  let query = supabase
    .from("invitations")
    .select(
      `*, 
      user:users!invited_by(*), 
      invitee:users!account_name(*), 
      organization:organization_id(*), 
      team:team_id(*), 
      project:project_id(*)
      `,
    )
    .eq("team_id", team_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return;
    }

    return data ?? [];
  } catch (error) {
    logger.error(error);
  }
}

export type TeamInvites = Awaited<ReturnType<typeof getTeamInvitesQuery>>;

export type GetProjectInvitesParams = {
  project_id?: string;
};

export async function getProjectInvitesQuery(
  { project_id }: GetProjectInvitesParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!project_id) {
    return [];
  }

  let query = supabase
    .from("invitations")
    .select(
      `*, 
      user:users!invited_by(*), 
      invitee:users!account_name(*), 
      organization:organization_id(*), 
      team:team_id(*), 
      project:project_id(*)
      `,
    )
    .eq("project_id", project_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return;
    }

    return data ?? [];
  } catch (error) {
    logger.error(error);
  }
}

export type ProjectInvites = Awaited<ReturnType<typeof getProjectInvitesQuery>>;

export type GetUserInvitesParams = {
  account_name?: string;
};

export async function getUserInvitesQuery(
  { account_name }: GetUserInvitesParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!account_name) {
    return [];
  }

  let query = supabase
    .from("invitations")
    .select(
      `*, 
      user:users!invited_by(*), 
      organization:organization_id(*), 
      team:team_id(*), 
      project:project_id(*)
      `,
    )
    .eq("account_name", account_name);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return;
    }

    return data ?? [];
  } catch (error) {
    logger.error(error);
  }
}

export type UserInvites = Awaited<ReturnType<typeof getUserInvitesQuery>>;
