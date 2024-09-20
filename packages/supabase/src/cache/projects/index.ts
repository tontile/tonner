import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type AccountProjects,
  type Project,
  type ProjectTeams,
  type ProjectUser,
  type ProjectUsers,
  type TeamProjects,
  type UserProjects,
  getAccountProjectsQuery,
  getProjectQuery,
  getProjectTeamsQuery,
  getProjectUserQuery,
  getProjectUsersQuery,
  getTeamProjectsQuery,
  getUserProjectsQuery,
} from "../../queries/projects";
import { projectKeys } from "../keys";
import { getUser } from "../users";

export async function getUserProject(): Promise<Project> {
  const supabase = createClient();
  const user = await getUser();

  const project_id = user?.app?.project_id;

  if (!project_id) {
    return;
  }

  const keyParts = projectKeys.single({ project_id });

  return createUnstableCache<Project>(
    () =>
      getProjectQuery(
        {
          project_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getAccountProjects(): Promise<AccountProjects> {
  const supabase = createClient();

  const user = await getUser();
  const account_name = user?.meta?.account_name;

  if (!account_name) {
    return;
  }

  const keyParts = projectKeys.accountProjects({ account_name });

  return createUnstableCache<AccountProjects>(
    () =>
      getAccountProjectsQuery(
        {
          account_name,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserTeamProjects(): Promise<TeamProjects> {
  const supabase = createClient();

  const user = await getUser();
  const team_id = user?.app?.team_id;

  if (!team_id) {
    return;
  }

  const keyParts = projectKeys.teamProjects({ team_id });

  return createUnstableCache<TeamProjects>(
    () =>
      getTeamProjectsQuery(
        {
          team_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserProjects(): Promise<UserProjects> {
  const supabase = createClient();

  const user = await getUser();
  const user_id = user?.data?.id;

  if (!user_id) {
    return;
  }

  const keyParts = projectKeys.userProjects({ user_id });

  return createUnstableCache<UserProjects>(
    () =>
      getUserProjectsQuery(
        {
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getProjectMembers(): Promise<ProjectUsers> {
  const supabase = createClient();

  const user = await getUser();
  const project_id = user?.meta?.project_id;

  if (!project_id) {
    return;
  }

  const keyParts = projectKeys.members({ project_id });

  return createUnstableCache<ProjectUsers>(
    () =>
      getProjectUsersQuery(
        {
          project_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getProjectTeams(): Promise<ProjectTeams> {
  const supabase = createClient();

  const user = await getUser();
  const project_id = user?.meta?.project_id;

  if (!project_id) {
    return;
  }

  const keyParts = projectKeys.teams({ project_id });

  return createUnstableCache<ProjectTeams>(
    () =>
      getProjectTeamsQuery(
        {
          project_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserProjectMembership(): Promise<ProjectUser> {
  const supabase = createClient();
  const user = await getUser();

  const user_id = user?.data?.id;
  const project_id = user?.app?.project_id;

  if (!user_id || !project_id) {
    return;
  }

  const keyParts = projectKeys.membership({ project_id, user_id });

  return createUnstableCache<ProjectUser>(
    () =>
      getProjectUserQuery(
        {
          project_id,
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}
