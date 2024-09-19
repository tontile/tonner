import { logger } from "@tonner/logger";
import type { Client } from "../../types";

export type GetTrackersParams = {
  project_id: string;
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
};

export async function getTrackersQuery(
  params: GetTrackersParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  const { from = 0, to = 10, filter, sort, project_id, search } = params;
  const { status } = filter || {};

  let query = supabase
    .from("trackers")
    .select("*, total_duration", { count: "exact" })
    .eq("id", project_id);

  if (status) {
    query.eq("status", status);
  }

  if (search?.query && search?.fuzzy) {
    query.ilike("project_name", `%${search.query}%`);
  }

  if (sort) {
    const { column, value } = sort;
    if (column === "time") {
      query.order("total_duration", { ascending: value === "asc" });
    } else {
      query.order(column, { ascending: value === "asc" });
    }
  } else {
    query.order("created_at", { ascending: false });
  }

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, count, error } = await query.range(from, to);

    if (error) {
      logger.error(error);
      return null;
    }

    return {
      meta: {
        count,
      },
      data,
    };
  } catch (error) {
    logger.error(error);
  }
}

export type Trackers = Awaited<ReturnType<typeof getTrackersQuery>>;

export type GetTrackerRecordsParams = {
  project_id: string;
  team_id?: string;
  tracker_id?: string;
  from: string;
  to: string;
};

export async function getTrackerRecordsQuery(
  params: GetTrackerRecordsParams,
  supabase: Client,
  signal?: AbortSignal,
) {
  if (!params.project_id) {
    throw new Error("project_id is required");
  }

  let query = supabase
    .from("tracker_entries")
    .select("*, assigned:users(*), tracker:trackers(*)")
    .eq("project_id", params.project_id)

    .gte("start_time", params.from)
    .lte("stop_time", params.to);

  if (params.team_id) {
    query.eq("team_id", params.team_id);
  }

  if (params.tracker_id) {
    query.eq("tracker_id", params.tracker_id);
  }

  if (signal) {
    query = query.abortSignal(signal);
  }

  try {
    const { data, error } = await query.order("created_at");

    if (error) {
      logger.error(error);
      return null;
    }

    const result = data?.reduce<{ [key: string]: (typeof data)[0][] }>(
      (acc, item) => {
        const key = new Date(item.closed_at!).toISOString().split("T")[0]!;

        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      },
      {},
    );

    const totalDuration = data?.reduce(
      (duration, item) => item.duration! + duration,
      0,
    );

    return {
      meta: {
        totalDuration,
        from: params.from,
        to: params.to,
      },
      data: result,
    };
  } catch (error) {
    logger.error(error);
  }
}

export type TrackerRecords = Awaited<ReturnType<typeof getTrackerRecordsQuery>>;
