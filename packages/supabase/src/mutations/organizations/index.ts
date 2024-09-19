import type { PostgrestError } from "@supabase/supabase-js";
import type { Client, Json } from "../../types";

type CreateOrganizationParams = {
  account_name: string;
  display_name?: string;
  bio?: string;
};

export async function createOrganization(
  params: CreateOrganizationParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("create_organization", params);

  if (error) throw error;
  return data;
}

export type CreateOrganization = Awaited<ReturnType<typeof createOrganization>>;
export type CreateOrganizationError = PostgrestError;

type UpdateOrganizationParams = {
  organization_id: string;
  display_name?: string;
  bio?: string;
  public_metadata?: Json;
  replace_metadata?: boolean;
};

export async function updateOrganization(
  params: UpdateOrganizationParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("update_organization", params);

  if (error) throw error;
  return data;
}

export type UpdateOrganization = Awaited<ReturnType<typeof updateOrganization>>;
export type UpdateOrganizationError = PostgrestError;

type UpdateOrganizationUserParams = {
  organization_id: string;
  user_id: string;
  new_membership_role: "owner" | "write" | "read";
};

export async function updateOrganizationUser(
  params: UpdateOrganizationUserParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc(
    "update_user_on_organization",
    params,
  );

  if (error) throw error;
  return data;
}

export type UpdateOrganizationUser = Awaited<
  ReturnType<typeof updateOrganizationUser>
>;
export type UpdateOrganizationUserError = PostgrestError;

type RemoveOrganizationUserParams = {
  organization_id: string;
  user_id: string;
};

export async function removeOrganizationUser(
  params: RemoveOrganizationUserParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc(
    "remove_organization_user",
    params,
  );

  if (error) throw error;
  return data;
}

export type RemoveOrganizationUser = Awaited<
  ReturnType<typeof removeOrganizationUser>
>;
export type RemoveOrganizationUserError = PostgrestError;
