-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS(
        SELECT
            1
        FROM
            pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE
            t.typname = 'task_priority'
            AND n.nspname = 'app') THEN
    CREATE TYPE app.task_priority AS ENUM(
        'low',
        'medium',
        'high',
        'urgent',
        'none'
);
END IF;
END;
$$;

DO $$
BEGIN
    IF NOT EXISTS(
        SELECT
            1
        FROM
            pg_type t
            JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE
            t.typname = 'task_status'
            AND n.nspname = 'app') THEN
    CREATE TYPE app.task_status AS ENUM(
        'backlog',
        'todo',
        'in_progress',
        'completed',
        'canceled'
);
END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.trackers(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    project_name text NOT NULL,
    project_status app.project_status NOT NULL,
    estimate bigint,
    rate numeric,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- EXTRA PROPERTIES
    private_metadata jsonb DEFAULT '{}' ::jsonb,
    public_metadata jsonb DEFAULT '{}' ::jsonb,
    -- KEYS
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tasks(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title text CHECK (LENGTH(description) <= 450),
    description text CHECK (LENGTH(description) <= 1024),
    task_status app.task_status DEFAULT 'backlog' ::app.task_status,
    task_priority app.task_priority DEFAULT 'none' ::app.task_priority,
    assigned_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    due_date timestamp without time zone,
    -- TRACKERS
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- EXTRA PROPERTIES
    private_metadata jsonb DEFAULT '{}' ::jsonb,
    public_metadata jsonb DEFAULT '{}' ::jsonb,
    -- KEYS
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tracker_entries(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    tracker_id uuid NOT NULL REFERENCES public.trackers(id) ON DELETE CASCADE,
    task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
    team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
    assigned_id uuid REFERENCES public.users(id),
    project_id uuid NOT NULL,
    closed_at timestamp without time zone DEFAULT now(),
    start_time timestamp without time zone,
    stop_time timestamp without time zone,
    description text CHECK (LENGTH(description) <= 1024),
    duration bigint,
    rate numeric,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- EXTRA PROPERTIES
    private_metadata jsonb DEFAULT '{}' ::jsonb,
    public_metadata jsonb DEFAULT '{}' ::jsonb,
    -- KEYS
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tracker_reports(
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    -- COLUMNS
    link_id text,
    short_link text,
    team_id uuid REFERENCES public.trackers(id) ON DELETE SET NULL,
    tracker_id uuid REFERENCES public.trackers(id) ON DELETE SET NULL,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- KEYS
    PRIMARY KEY (id)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_trackers_project_name ON public.trackers(project_name);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_id ON public.tasks(assigned_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_tracker_id ON public.tracker_entries(tracker_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_task_id ON public.tracker_entries(task_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_team_id ON public.tracker_entries(team_id);

CREATE INDEX IF NOT EXISTS idx_tracker_entries_assigned_id ON public.tracker_entries(assigned_id);

CREATE INDEX IF NOT EXISTS idx_tracker_reports_tracker_id ON public.tracker_reports(tracker_id);

CREATE INDEX IF NOT EXISTS idx_tracker_reports_team_id ON public.tracker_reports(team_id);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_trackers_on_tracker_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
BEGIN
    NEW.project_name =(
        SELECT
            project_name
        FROM
            public.projects
        WHERE
            id = NEW.project_id);
    NEW.project_status =(
        SELECT
            project_status
        FROM
            public.projects
        WHERE
            project_name = NEW.project_name);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_tracker_entries_on_tracker_entry_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
BEGIN
    NEW.project_id =(
        SELECT
            project_id
        FROM
            public.trackers
        WHERE
            id = NEW.tracker_id);
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER set_trackers_timestamp
    BEFORE INSERT OR UPDATE ON public.trackers
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_trackers_update_tracking
    BEFORE INSERT OR UPDATE ON public.trackers
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER set_tasks_timestamp
    BEFORE INSERT OR UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_tasks_update_tracking
    BEFORE INSERT OR UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER set_tracker_entries_timestamp
    BEFORE INSERT OR UPDATE ON public.tracker_entries
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_tracker_entries_update_tracking
    BEFORE INSERT OR UPDATE ON public.tracker_entries
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_trackers_on_tracker_creating
    BEFORE INSERT ON public.trackers
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_trackers_on_tracker_creating();

CREATE TRIGGER app_tracker_entries_on_tracker_entry_creating
    BEFORE INSERT ON public.tracker_entries
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_tracker_entries_on_tracker_entry_creating();

CREATE TRIGGER set_tracker_reports_timestamp
    BEFORE INSERT OR UPDATE ON public.tracker_reports
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_tracker_reports_update_tracking
    BEFORE INSERT OR UPDATE ON public.tracker_reports
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.get_project_collaborators(project_id uuid)
    RETURNS SETOF UUID
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT DISTINCT
        te.assigned_id
    FROM
        public.trackers t
        JOIN public.tracker_entries te ON te.tracker_id = t.id
    WHERE
        t.project_id = get_project_collaborators.project_id;
$$;

GRANT EXECUTE ON FUNCTION app.get_project_collaborators(UUID) TO authenticated, service_role;

-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.trackers ENABLE ROW LEVEL SECURITY;

GRANT INSERT (project_id, project_status, estimate, public_metadata) ON public.trackers TO authenticated;

GRANT UPDATE (project_status, rate, estimate, public_metadata) ON public.trackers TO authenticated;

GRANT DELETE ON public.trackers TO authenticated;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

GRANT INSERT (project_id, title, description, task_status, task_priority, assigned_id, due_date, public_metadata) ON public.tasks TO authenticated;

GRANT UPDATE (title, description, task_status, task_priority, assigned_id, due_date, public_metadata) ON public.tasks TO authenticated;

GRANT DELETE ON public.tasks TO authenticated;

ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;

GRANT INSERT (tracker_id, team_id, assigned_id, description, duration, rate, closed_at, start_time, stop_time, public_metadata) ON public.tracker_entries TO authenticated;

GRANT UPDATE (assigned_id, description, duration, rate, closed_at, start_time, stop_time, public_metadata) ON public.tracker_entries TO authenticated;

GRANT DELETE ON public.tracker_entries TO authenticated;

ALTER TABLE public.tracker_reports ENABLE ROW LEVEL SECURITY;

GRANT INSERT (link_id, short_link, team_id, tracker_id) ON public.tracker_reports TO authenticated;

GRANT UPDATE (link_id, short_link) ON public.tracker_reports TO authenticated;

GRANT DELETE ON public.tracker_reports TO authenticated;

CREATE POLICY trackers_insert_policy ON public.trackers AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY trackers_update_policy ON public.trackers AS permissive
    FOR UPDATE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY trackers_delete_policy ON public.trackers AS permissive
    FOR DELETE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY trackers_select_policy ON public.trackers AS permissive
    FOR SELECT TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid())));

CREATE POLICY tasks_insert_policy ON public.tasks AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tasks_update_policy ON public.tasks AS permissive
    FOR UPDATE TO authenticated
        USING (auth.uid() = assigned_id
            OR project_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tasks_delete_policy ON public.tasks AS permissive
    FOR DELETE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tasks_select_policy ON public.tasks AS permissive
    FOR SELECT TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid())));

CREATE POLICY tracker_entries_insert_policy ON public.tracker_entries AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tracker_entries_update_policy ON public.tracker_entries AS permissive
    FOR UPDATE TO authenticated
        USING (auth.uid() = assigned_id
            OR tracker_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tracker_entries_delete_policy ON public.tracker_entries AS permissive
    FOR DELETE TO authenticated
        USING (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY tracker_entries_select_policy ON public.tracker_entries AS permissive
    FOR SELECT TO authenticated
        USING (app.is_public_project(id)
            OR (tracker_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid()))));

CREATE POLICY tracker_reports_insert_policy ON public.tracker_reports AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tracker_reports_update_policy ON public.tracker_reports AS permissive
    FOR UPDATE TO authenticated
        USING (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY tracker_reports_delete_policy ON public.tracker_reports AS permissive
    FOR DELETE TO authenticated
        USING (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY tracker_reports_select_policy ON public.tracker_reports AS permissive
    FOR SELECT TO authenticated
        USING (tracker_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid())));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_trackers WITH ( security_invoker = TRUE
) AS
SELECT
    tr.rate,
    tr.estimate,
    tr.project_status,
    tr.public_metadata AS tracker_metadata,
    p.*
FROM
    public.trackers tr
    JOIN public.projects p ON p.id = tr.id;

CREATE OR REPLACE VIEW public.v_tracker_entries WITH ( security_invoker = TRUE
) AS
SELECT
    trn.id,
    trn.tracker_id,
    trn.team_id,
    trn.assigned_id,
    trn.closed_at,
    trn.description,
    trn.duration,
    trn.rate,
    trn.created_at,
    trn.public_metadata
FROM
    public.tracker_entries trn;

CREATE OR REPLACE VIEW public.v_tasks WITH ( security_invoker = TRUE
) AS
SELECT
    t.id,
    t.project_id,
    t.title,
    t.description,
    t.task_status,
    t.task_priority,
    t.assigned_id,
    u.account_name,
    u.avatar_url,
    t.due_date,
    t.created_at,
    t.public_metadata,
    t.created_by
FROM
    public.tasks t
    LEFT JOIN public.users u ON t.assigned_id = u.id;

CREATE OR REPLACE VIEW public.v_tracker_reports WITH ( security_invoker = TRUE
) AS
SELECT
    trn.id,
    trn.link_id,
    trn.short_link,
    trn.team_id,
    trn.tracker_id,
    trn.created_at,
    trn.created_by
FROM
    public.tracker_reports trn;

CREATE OR REPLACE FUNCTION public.project_collaborators(public.tracker_entries)
    RETURNS TABLE(
        id uuid,
        avatar_url text,
        display_name text)
    LANGUAGE sql
    AS $$
    SELECT DISTINCT ON(u.id)
        u.id,
        u.avatar_url,
        u.display_name
    FROM
        tracker_entries te
        JOIN users u ON te.assigned_id = u.id
    WHERE
        te.tracker_id = $1.tracker_id;
$$;

CREATE OR REPLACE FUNCTION public.project_collaborators(public.trackers)
    RETURNS TABLE(
        id uuid,
        avatar_url text,
        display_name text)
    LANGUAGE sql
    AS $$
    SELECT DISTINCT ON(u.id)
        u.id,
        u.avatar_url,
        u.display_name
    FROM
        trackers t
    LEFT JOIN tracker_entries te ON t.id = te.tracker_id
    LEFT JOIN users u ON te.assigned_id = u.id;
$$;

CREATE OR REPLACE FUNCTION public.total_duration(public.trackers)
    RETURNS integer
    LANGUAGE sql
    AS $$
    SELECT
        sum(tracker_entries.duration) AS total_duration
    FROM
        trackers
        JOIN tracker_entries ON trackers.id = tracker_entries.tracker_id
    WHERE
        trackers.id = $1.id
    GROUP BY
        trackers.id;
$$;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
