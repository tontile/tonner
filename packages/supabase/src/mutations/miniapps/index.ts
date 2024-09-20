import { logger } from "@tonner/logger";
import type { Client, Json } from "../../types";

type CreateMiniAppParams = {
  account_name: string;
  partial_name: string;
  display_name?: string;
  bio?: string;
  content?: Json;
};

export async function createMiniApp(
  params: CreateMiniAppParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("create_miniapp", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type CreateMiniApp = Awaited<ReturnType<typeof createMiniApp>>;

type UpdateMiniAppParams = {
  miniapp_id: string;
  display_name?: string;
  bio?: string;
  content?: Json;
  published?: boolean;
  public_metadata?: Json;
  replace_metadata?: boolean;
};

export async function updateMiniApp(
  params: UpdateMiniAppParams,
  supabase: Client,
) {
  const { error, data } = await supabase.rpc("update_miniapp", params);

  if (error) {
    logger.error(error);
    return;
  }

  if (data) return data;
}

export type UpdateMiniApp = Awaited<ReturnType<typeof updateMiniApp>>;

type DeleteMiniAppParams = {
  miniapp_id: string;
};

export async function deleteMiniApp(
  params: DeleteMiniAppParams,
  supabase: Client,
) {
  return supabase.from("miniapps").delete().eq("id", params.miniapp_id);
}
