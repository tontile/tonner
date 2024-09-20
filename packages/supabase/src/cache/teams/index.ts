import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type Team,
  type TeamUser,
  type TeamUsers,
  type UserTeams,
  getTeamQuery,
  getTeamUserQuery,
  getTeamUsersQuery,
  getUserTeamsQuery,
} from "../../queries/teams";
import { teamKeys } from "../keys";
import { getUser } from "../users";

export async function getUserTeam(): Promise<Team> {
  const supabase = createClient();
  const user = await getUser();

  const team_id = user?.app?.team_id;

  if (!team_id) {
    return;
  }

  const keyParts = teamKeys.single({ team_id });

  return createUnstableCache<Team>(
    () =>
      getTeamQuery(
        {
          team_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserTeams(): Promise<UserTeams> {
  const supabase = createClient();

  const user = await getUser();
  const user_id = user?.data?.id;

  if (!user_id) {
    return;
  }

  const keyParts = teamKeys.userTeams({ user_id });

  return createUnstableCache<UserTeams>(
    () =>
      getUserTeamsQuery(
        {
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getTeamMembers(): Promise<TeamUsers> {
  const supabase = createClient();

  const user = await getUser();
  const team_id = user?.meta?.team_id;

  if (!team_id) {
    return;
  }

  const keyParts = teamKeys.members({ team_id });

  return createUnstableCache<TeamUsers>(
    () =>
      getTeamUsersQuery(
        {
          team_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserTeamMembership(): Promise<TeamUser> {
  const supabase = createClient();
  const user = await getUser();

  const user_id = user?.data?.id;
  const team_id = user?.app?.team_id;

  if (!user_id || !team_id) {
    return;
  }

  const keyParts = teamKeys.membership({ team_id, user_id });

  return createUnstableCache<TeamUser>(
    () =>
      getTeamUserQuery(
        {
          team_id,
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}

// TODO: accountTeams, currentUserAccountTeams
