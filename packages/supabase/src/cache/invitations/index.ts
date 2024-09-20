import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type OrganizationInvites,
  type ProjectInvites,
  type TeamInvites,
  type UserInvites,
  getOrganizationInvitesQuery,
  getProjectInvitesQuery,
  getTeamInvitesQuery,
  getUserInvitesQuery,
} from "../../queries/invitations";
import { invitationKeys } from "../keys";
import { getUser } from "../users";

export async function getOrganizationInvites(): Promise<OrganizationInvites> {
  const supabase = createClient();

  const user = await getUser();

  const organization_id = user?.app?.organization_id;

  if (!organization_id) {
    return;
  }

  const keyParts = invitationKeys.organizationInvites({ organization_id });

  return createUnstableCache(
    () => getOrganizationInvitesQuery({ organization_id }, supabase),
    keyParts,
  );
}

export async function getTeamInvites(): Promise<TeamInvites> {
  const supabase = createClient();

  const user = await getUser();

  const team_id = user?.app?.team_id;

  if (!team_id) {
    return;
  }

  const keyParts = invitationKeys.teamInvites({ team_id });

  return createUnstableCache<TeamInvites>(
    () => getTeamInvitesQuery({ team_id }, supabase),
    keyParts,
  );
}

export async function getProjectInvites(): Promise<ProjectInvites> {
  const supabase = createClient();

  const user = await getUser();

  const project_id = user?.app?.project_id;

  if (!project_id) {
    return;
  }

  const keyParts = invitationKeys.projectInvites({ project_id });

  return createUnstableCache<ProjectInvites>(
    () => getProjectInvitesQuery({ project_id }, supabase),
    keyParts,
  );
}

export async function getUserInvites(): Promise<UserInvites> {
  const supabase = createClient();

  const user = await getUser();

  const account_name = user?.data?.account_name;

  if (!account_name) {
    return;
  }

  const keyParts = invitationKeys.userInvites({ account_name });

  return createUnstableCache<UserInvites>(
    () => getUserInvitesQuery({ account_name }, supabase),
    keyParts,
  );
}
