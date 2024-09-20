import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetProjectParams = {
  project_id?: string;
};

export async function getProjectQuery(
  { project_id }: GetProjectParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  let query = supabase
    .from("projects")
    .select(
      `
      *,
      users (*, project_role:users_on_project(membership_role)),
      projects (*)
      `,
    )
    .eq("id", project_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return;
    }

    if (data) return data;
  } catch (error) {
    logger.error(error);
  }
}

export type Project = Awaited<ReturnType<typeof getProjectQuery>>;

export type GetAccountProjectsParams = {
  account_name?: string;
};

export async function getAccountProjectsQuery(
  { account_name }: GetAccountProjectsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!account_name) {
    throw new Error("account_name is required");
  }

  let query = supabase
    .from("v_projects")
    .select("*")
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

export type AccountProjects = Awaited<
  ReturnType<typeof getAccountProjectsQuery>
>;

export type GetUserProjectsParams = {
  user_id?: string;
};

export async function getUserProjectsQuery(
  { user_id }: GetUserProjectsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase
    .from("v_user_projects")
    .select("*")
    .eq("user_id", user_id);

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

export type UserProjects = Awaited<ReturnType<typeof getUserProjectsQuery>>;

export type GetProjectUsersParams = {
  project_id?: string;
};

export async function getProjectUsersQuery(
  { project_id }: GetProjectUsersParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  let query = supabase
    .from("v_project_members")
    .select("*")
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

export type ProjectUsers = Awaited<ReturnType<typeof getProjectUsersQuery>>;

export type GetProjectUserParams = {
  project_id?: string;
  user_id?: string;
};

export async function getProjectUserQuery(
  { project_id, user_id }: GetProjectUserParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  if (!user_id) {
    throw new Error("user_id is required");
  }

  let query = supabase
    .from("users_on_project")
    .select("*, user:users!user_id(*), project:projects!project_id(*)")
    .eq("user_id", user_id)
    .eq("project_id", project_id);

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return;
    }

    if (data) return data;
  } catch (error) {
    logger.error(error);
  }
}

export type ProjectUser = Awaited<ReturnType<typeof getProjectUserQuery>>;

export type GetTeamProjectsParams = {
  team_id?: string;
};

export async function getTeamProjectsQuery(
  { team_id }: GetTeamProjectsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!team_id) {
    throw new Error("team_id is required");
  }

  let query = supabase
    .from("v_team_projects")
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

export type TeamProjects = Awaited<ReturnType<typeof getTeamProjectsQuery>>;

export type GetProjectTeamsParams = {
  project_id?: string;
};

export async function getProjectTeamsQuery(
  { project_id }: GetProjectTeamsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!project_id) {
    throw new Error("project_id is required");
  }

  let query = supabase
    .from("v_project_teams")
    .select("*")
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

export type ProjectTeams = Awaited<ReturnType<typeof getProjectTeamsQuery>>;
