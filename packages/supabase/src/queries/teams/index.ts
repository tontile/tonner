import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetTeamParams = {
  team_id?: string;
};

export async function getTeamQuery(
  { team_id }: GetTeamParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!team_id) {
    throw new Error("team_id is required");
  }

  let query = supabase
    .from("teams")
    .select(
      `
      *,
      users (*, team_role:users_on_team(membership_role)),
      projects (*)
      `,
    )
    .eq("id", team_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return;
    }

    return data;
  } catch (error) {
    logger.error(error);
  }
}

export type Team = Awaited<ReturnType<typeof getTeamQuery>>;

export type GetUserTeamsParams = {
  user_id?: string;
};

export async function getUserTeamsQuery(
  { user_id }: GetUserTeamsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase.from("v_user_teams").select("*").eq("user_id", user_id);

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

export type UserTeams = Awaited<ReturnType<typeof getUserTeamsQuery>>;

export type GetTeamUsersParams = {
  team_id?: string;
};

export async function getTeamUsersQuery(
  { team_id }: GetTeamUsersParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!team_id) {
    throw new Error("team_id is required");
  }

  let query = supabase
    .from("v_team_members")
    .select("*")
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

export type TeamUsers = Awaited<ReturnType<typeof getTeamUsersQuery>>;

export type GetTeamUserParams = {
  team_id?: string;
  user_id?: string;
};

export async function getTeamUserQuery(
  { team_id, user_id }: GetTeamUserParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!team_id) {
    throw new Error("team_id is required");
  }

  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase
    .from("users_on_team")
    .select("*, user:users!user_id(*), team:teams!team_id(*)")
    .eq("user_id", user_id)
    .eq("team_id", team_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return;
    }

    return data;
  } catch (error) {
    logger.error(error);
  }
}

export type TeamUser = Awaited<ReturnType<typeof getTeamUserQuery>>;

export async function getCurrentUserTeamQuery(
  supabase: Client,
  signal?: AbortSignal,
): Promise<TeamUser> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  const user_id = session.user.id;
  const team_id = session.user.app_metadata.team_id;

  if (!team_id) {
    return;
  }

  return await getTeamUserQuery({ team_id, user_id }, supabase, signal);
}
