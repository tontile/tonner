import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetNavigationsParams = {
  account_name?: string;
  partial_name?: string;
};

export async function getNavigationsQuery(
  { account_name, partial_name }: GetNavigationsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!account_name) {
    throw new Error("account_name is required");
  }

  let query = supabase
    .from("navigations")
    .select("*")
    .eq("account_name", account_name);

  if (partial_name) {
    query = query.eq("partial_name", partial_name);
  }

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      logger.error(error);
      return null;
    }

    return data ?? [];
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export type Navigations = Awaited<ReturnType<typeof getNavigationsQuery>>;

export type GetNavigationParams = {
  account_name: string;
  partial_name?: string;
  nav_name: string;
};

export async function getNavigationQuery(
  { account_name, partial_name, nav_name }: GetNavigationParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!account_name || !nav_name) {
    throw new Error("nav_name and account_name is required");
  }

  let query = supabase
    .from("navigations")
    .select("*")
    .eq("account_name", account_name)
    .eq("name", nav_name);

  if (partial_name) {
    query = query.eq("partial_name", partial_name);
  }

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.maybeSingle();

    if (error) {
      logger.error(error);
      return null;
    }

    return data;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

export type Navigation = Awaited<ReturnType<typeof getNavigationQuery>>;
