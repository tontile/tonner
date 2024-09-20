import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type Organization,
  type OrganizationUser,
  type OrganizationUsers,
  type UserOrganizations,
  getOrganizationQuery,
  getOrganizationUserQuery,
  getOrganizationUsersQuery,
  getUserOrganizationsQuery,
} from "../../queries/organizations";
import { organizationKeys } from "../keys";
import { getUser } from "../users";

export async function getUserOrganization(): Promise<Organization> {
  const supabase = createClient();
  const user = await getUser();

  const organization_id = user?.app?.organization_id;

  if (!organization_id) {
    return;
  }

  const keyParts = organizationKeys.single({ organization_id });

  return createUnstableCache<Organization>(
    () =>
      getOrganizationQuery(
        {
          organization_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserOrganizations(): Promise<UserOrganizations> {
  const supabase = createClient();

  const user = await getUser();
  const user_id = user?.data?.id;

  if (!user_id) {
    return;
  }

  const keyParts = organizationKeys.userOrganizations({ user_id });

  return createUnstableCache<UserOrganizations>(
    () =>
      getUserOrganizationsQuery(
        {
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getOrganizationMembers(): Promise<OrganizationUsers> {
  const supabase = createClient();

  const user = await getUser();
  const organization_id = user?.meta?.organization_id;

  if (!organization_id) {
    return;
  }

  const keyParts = organizationKeys.members({ organization_id });

  return createUnstableCache<OrganizationUsers>(
    () =>
      getOrganizationUsersQuery(
        {
          organization_id,
        },
        supabase,
      ),
    keyParts,
  );
}

export async function getUserOrganizationMembership(): Promise<OrganizationUser> {
  const supabase = createClient();
  const user = await getUser();

  const user_id = user?.data?.id;
  const organization_id = user?.app?.organization_id;

  if (!user_id || !organization_id) {
    return;
  }

  const keyParts = organizationKeys.membership({ organization_id, user_id });

  return createUnstableCache<OrganizationUser>(
    () =>
      getOrganizationUserQuery(
        {
          organization_id,
          user_id,
        },
        supabase,
      ),
    keyParts,
  );
}
