import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetMiniAppParams = {
  miniapp_name?: string;
};

export async function getMiniAppQuery(
  { miniapp_name }: GetMiniAppParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!miniapp_name) {
    throw new Error("miniapp_name is required");
  }

  let query = supabase
    .from("miniapps")
    .select("*")
    .eq("miniapp_name", miniapp_name);

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

export type MiniApp = Awaited<ReturnType<typeof getMiniAppQuery>>;

export type GetAccountMiniAppsParams = {
  account_name?: string;
};

export async function getAccountMiniAppsQuery(
  { account_name }: GetAccountMiniAppsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!account_name) {
    throw new Error("account_name is required");
  }

  let query = supabase
    .from("miniapps")
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

    if (data) return data;
  } catch (error) {
    logger.error(error);
  }
}

export type AccountMiniApps = Awaited<
  ReturnType<typeof getAccountMiniAppsQuery>
>;
