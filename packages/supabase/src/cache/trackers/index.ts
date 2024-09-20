import "server-only";

import { createUnstableCache } from "@tonner/cache";
import { createClient } from "../../clients/server";
import {
  type Trackers,
  getTrackerRecordsQuery,
  getTrackersQuery,
} from "../../queries/trackers";
import { trackerKeys } from "../keys";
import { getUser } from "../users";

interface GetTrackersParams {
  to: number;
  from?: number;
  sort?: {
    column: string;
    value: "asc" | "desc";
  };
  search?: {
    query?: string;
    fuzzy?: boolean;
  };
  filter?: {
    status?:
      | "backlog"
      | "todo"
      | "in_progress"
      | "paused"
      | "completed"
      | "closed"
      | "canceled";
  };
}

export const getTrackers = async (params: GetTrackersParams) => {
  const supabase = createClient();
  const user = await getUser();
  const project_id = user?.app?.project_id;

  if (!project_id) {
    return;
  }

  const keyParts = trackerKeys.list({
    project_id,
    args: JSON.stringify(params),
  });

  return createUnstableCache<Trackers>(
    () =>
      getTrackersQuery(
        {
          ...params,
          project_id,
        },
        supabase,
      ),
    keyParts,
  );
};

interface GetTrackerRecordsParams {
  tracker_id: string;
  team_id?: string;
  from: string;
  to: string;
}

export const getTrackerRecords = async (params: GetTrackerRecordsParams) => {
  const supabase = createClient();
  const user = await getUser();
  const project_id = user?.meta?.project_id!;

  if (!project_id) {
    return;
  }

  const { tracker_id: _, ...args } = params;

  const keyParts = trackerKeys.records({
    project_id,
    tracker_id: params.tracker_id,
    args: JSON.stringify(args),
  });

  return createUnstableCache(
    () =>
      getTrackerRecordsQuery(
        {
          ...params,
          project_id,
        },
        supabase,
      ),
    keyParts,
  );
};
