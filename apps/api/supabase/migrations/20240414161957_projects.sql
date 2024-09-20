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
            t.typname = 'project_status'
            AND n.nspname = 'app') THEN
    CREATE TYPE app.project_status AS ENUM(
        'backlog',
        'todo',
        'in_progress',
        'paused',
        'completed',
        'closed',
        'canceled'
);
END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.projects(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    project_name text UNIQUE NOT NULL GENERATED ALWAYS AS (app.generate_name(account_name, partial_name)) STORED,
    account_name app.valid_name NOT NULL, -- ex: hitasp
    partial_name app.valid_name NOT NULL, -- ex: tonner
    display_name text CHECK (LENGTH(display_name) <= 128),
    bio text CHECK (LENGTH(bio) <= 512),
    avatar_url text,
    public boolean NOT NULL DEFAULT FALSE,
    archived boolean NOT NULL DEFAULT FALSE,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- EXTRA PROPERTIES
    private_metadata jsonb DEFAULT '{}' ::jsonb,
    public_metadata jsonb DEFAULT '{}' ::jsonb,
    -- KEYS
    PRIMARY KEY (id),
    UNIQUE (account_name, partial_name),
    CONSTRAINT fk_account_registry FOREIGN KEY (account_name) REFERENCES public.account_registry(account_name)
);

CREATE TABLE IF NOT EXISTS public.teams_on_project(
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT NOW(),
    -- KEYS
    PRIMARY KEY (team_id, project_id)
);

CREATE TABLE IF NOT EXISTS public.users_on_project(
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
    membership_role app.membership_role NOT NULL DEFAULT 'read' ::app.membership_role,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    -- KEYS
    PRIMARY KEY (project_id, user_id)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_partial_name_search ON public.projects USING gin(partial_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_projects_account_name_search ON public.projects USING gin(account_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_teams_on_project_team_id ON public.teams_on_project(team_id);

CREATE INDEX IF NOT EXISTS idx_teams_on_project_project_id ON public.teams_on_project(project_id);

CREATE INDEX IF NOT EXISTS idx_users_on_project_team_id ON public.users_on_project(team_id);

CREATE INDEX IF NOT EXISTS idx_users_on_project_project_id ON public.users_on_project(project_id);

CREATE INDEX IF NOT EXISTS idx_users_on_project_user_id ON public.users_on_project(user_id);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_users_on_project_on_teams_on_project_created()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.users_on_project(team_id, project_id, user_id, membership_role)
    SELECT
        NEW.team_id,
        NEW.project_id,
        ut.user_id,
        'read'::app.membership_role
    FROM
        public.users_on_team ut
    WHERE
        ut.team_id = NEW.team_id
    ON CONFLICT(project_id,
        user_id)
        DO UPDATE SET
            team_id = NEW.team_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_users_on_project_on_users_on_team_created()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.users_on_project(team_id, project_id, user_id, membership_role)
    SELECT
        NEW.team_id,
        project_id,
        NEW.user_id,
        'read'::app.membership_role
    FROM
        public.teams_on_project
    WHERE
        team_id = NEW.team_id
    ON CONFLICT(project_id,
        user_id)
        DO UPDATE SET
            team_id = NEW.team_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_users_on_project_on_users_on_organization_created()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.users_on_project(project_id, user_id, membership_role)
    SELECT
        p.id,
        NEW.user_id,
        'owner'::app.membership_role
    FROM
        public.projects p
        JOIN public.organizations o ON o.account_name = p.account_name
    WHERE
        o.id = NEW.organization_id
    ON CONFLICT(project_id,
        user_id)
        DO UPDATE SET
            membership_role = 'owner';
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_projects_on_project_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.users_on_project(project_id, user_id, membership_role)
        VALUES(NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_projects_on_storage_object_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
DECLARE
    v_project_name text;
BEGIN
    SELECT
        (string_to_array(NEW.name, '/'::text))[1]::text INTO v_project_name;
    UPDATE
        public.projects
    SET
        avatar_url = NEW.name
    WHERE
        project_name = v_project_name;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_users_on_project_timestamp
    BEFORE INSERT OR UPDATE ON public.users_on_project
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_projects_timestamp
    BEFORE INSERT OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_projects_update_tracking
    BEFORE INSERT OR UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_users_on_project_on_users_on_organization_created
    AFTER INSERT OR UPDATE ON public.users_on_organization
    FOR EACH ROW
    WHEN(NEW.membership_role = 'owner')
    EXECUTE FUNCTION app.trigger_users_on_project_on_users_on_organization_created();

CREATE TRIGGER app_users_on_project_on_teams_on_project_created
    AFTER INSERT ON public.teams_on_project
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_users_on_project_on_teams_on_project_created();

CREATE TRIGGER app_users_on_project_on_users_on_team_created
    AFTER INSERT ON public.users_on_team
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_users_on_project_on_users_on_team_created();

CREATE TRIGGER app_projects_on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_projects_on_project_created();

CREATE TRIGGER app_projects_on_storage_object_created
    AFTER INSERT ON STORAGE.objects
    FOR EACH ROW
    WHEN(NEW.bucket_id = 'avatars')
    EXECUTE PROCEDURE app.trigger_projects_on_storage_object_created();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.is_public_project(project_id uuid)
    RETURNS boolean
    LANGUAGE SQL
    STABLE
    AS $$
    SELECT
        EXISTS(
            SELECT
                1
            FROM
                public.projects o
            WHERE
                o.id = is_public_project.project_id
                AND o.public IS TRUE)
$$;

GRANT EXECUTE ON FUNCTION app.is_public_project(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_project_users_with_role(project_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF UUID
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        up.user_id
    FROM
        public.users_on_project up
    WHERE
        up.project_id = get_project_users_with_role.project_id
        AND(up.membership_role = get_project_users_with_role.passed_in_role
            OR up.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_project_users_with_role(uuid, app.membership_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_project_ids_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF UUID
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        up.project_id
    FROM
        public.users_on_project up
    WHERE
        up.user_id = get_project_ids_with_role.user_id
        AND(up.membership_role = get_project_ids_with_role.passed_in_role
            OR up.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_project_ids_with_role(uuid, app.membership_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_project_names_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF text
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        p.project_name
    FROM
        public.users_on_project up
        JOIN public.projects p ON p.id = up.project_id
    WHERE
        up.user_id = get_project_names_with_role.user_id
        AND(up.membership_role = get_project_names_with_role.passed_in_role
            OR up.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_project_ids_with_role(uuid, app.membership_role) TO authenticated, service_role;

-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, partial_name, display_name, bio, public, archived, public_metadata) ON public.projects TO authenticated;

GRANT UPDATE (display_name, bio, archived, public_metadata) ON public.projects TO authenticated;

GRANT DELETE ON public.projects TO authenticated;

ALTER TABLE public.teams_on_project ENABLE ROW LEVEL SECURITY;

GRANT INSERT (team_id, project_id) ON public.teams_on_project TO authenticated;

GRANT DELETE ON public.teams_on_project TO authenticated;

ALTER TABLE public.users_on_project ENABLE ROW LEVEL SECURITY;

GRANT INSERT (team_id, project_id, user_id, membership_role) ON public.users_on_project TO authenticated;

GRANT UPDATE (membership_role) ON public.users_on_project TO authenticated;

GRANT DELETE ON public.users_on_project TO authenticated;

CREATE POLICY projects_insert_policy ON public.projects AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner')));

CREATE POLICY projects_update_policy ON public.projects AS permissive
    FOR UPDATE TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner')));

CREATE POLICY projects_delete_policy ON public.projects AS permissive
    FOR DELETE TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner')));

CREATE POLICY projects_select_policy ON public.projects AS permissive
    FOR SELECT TO authenticated
        USING (public IS TRUE
            OR (id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid()))));

CREATE POLICY users_on_project_delete_policy ON public.users_on_project AS permissive
    FOR DELETE TO authenticated
        USING (user_id = auth.uid()
            OR project_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY users_on_project_update_policy ON public.users_on_project AS permissive
    FOR UPDATE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY users_on_project_insert_policy ON public.users_on_project AS permissive
    FOR SELECT TO authenticated
        USING (membership_role = 'read');

CREATE POLICY users_on_project_select_policy ON public.users_on_project AS permissive
    FOR SELECT TO authenticated
        USING (app.is_public_project(project_id)
            OR (project_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid()))));

CREATE POLICY teams_on_project_insert_policy ON public.teams_on_project AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY teams_on_project_delete_policy ON public.teams_on_project AS permissive
    FOR DELETE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY teams_on_project_update_policy ON public.teams_on_project AS permissive
    FOR UPDATE TO authenticated
        USING (project_id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY teams_on_project_select_policy ON public.teams_on_project AS permissive
    FOR SELECT TO authenticated
        USING (app.is_public_project(project_id)
            OR project_id IN (
                SELECT
                    app.get_project_ids_with_role(auth.uid())));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_projects WITH ( security_invoker = TRUE
) AS
SELECT
    p.id,
    p.project_name,
    p.account_name,
    p.partial_name,
    p.avatar_url,
    p.display_name,
    p.bio,
    p.archived,
    p.created_at,
    p.public_metadata
FROM
    public.projects p
WHERE
    p.public IS TRUE;

CREATE OR REPLACE VIEW public.v_user_projects WITH ( security_invoker = TRUE
) AS
SELECT
    p.id AS project_id,
    u.id AS user_id,
    p.account_name,
    p.partial_name,
    p.project_name,
    p.display_name,
    p.avatar_url,
    up.membership_role,
    up.created_at,
    count(
        *) OVER (PARTITION BY u.id) AS total_projects
FROM
    public.users_on_project up
    JOIN projects p ON p.id = up.project_id
    JOIN users u ON u.id = up.user_id;

CREATE OR REPLACE VIEW public.v_project_members WITH ( security_invoker = TRUE
) AS
SELECT
    u.id AS user_id,
    p.id AS project_id,
    u.account_name,
    u.display_name,
    u.avatar_url,
    up.membership_role,
    up.created_at,
    count(
        *) OVER (PARTITION BY p.id) AS total_members
FROM
    public.users_on_project up
    JOIN projects p ON p.id = up.project_id
    JOIN users u ON u.id = up.user_id;

CREATE OR REPLACE VIEW public.v_team_projects WITH ( security_invoker = TRUE
) AS
SELECT
    p.id AS project_id,
    t.id AS team_id,
    p.account_name,
    p.partial_name,
    p.project_name,
    p.display_name,
    p.avatar_url,
    tp.created_at,
    count(
        *) OVER (PARTITION BY t.id) AS total_projects
FROM
    public.teams_on_project tp
    JOIN projects p ON p.id = tp.project_id
    JOIN teams t ON t.id = tp.team_id;

CREATE OR REPLACE VIEW public.v_project_teams WITH ( security_invoker = TRUE
) AS
SELECT
    t.id AS team_id,
    p.id AS project_id,
    p.project_name,
    t.account_name,
    t.partial_name,
    t.team_name,
    t.display_name,
    t.avatar_url,
    tp.created_at,
    count(
        *) OVER (PARTITION BY p.id) AS total_teams
FROM
    public.teams_on_project tp
    JOIN projects p ON p.id = tp.project_id
    JOIN teams t ON t.id = tp.team_id;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_project_teams(project_name text)
    RETURNS SETOF public.v_project_teams
    LANGUAGE plpgsql
    SET search_path = public
    SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.project_teams pt
    WHERE
        pt.project_name = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_teams(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_project_id(project_name text)
    RETURNS uuid
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN(
        SELECT
            p.id
        FROM
            projects p
        WHERE
            p.project_name = $1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_id(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_project_by_id(project_id uuid)
    RETURNS public.projects
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN p
FROM
    projects p
WHERE
    p.id = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_by_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_project_by_name(project_name text)
    RETURNS public.projects
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN p
FROM
    projects p
WHERE
    p.project_name = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_by_name(text) TO authenticated;

CREATE FUNCTION public.create_project(account_name app.valid_name, partial_name app.valid_name, display_name text = NULL, bio text = NULL, public boolean = FALSE, archived boolean = FALSE)
    RETURNS json
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_project_id uuid;
BEGIN
    INSERT INTO public.projects(account_name, partial_name, display_name, bio, public, archived)
        VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
        id INTO new_project_id;
    RETURN get_project_by_id(new_project_id);
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'An account with that unique ID already exists';
END;

$$;

GRANT EXECUTE ON FUNCTION public.create_project(app.valid_name, app.valid_name, text, text, boolean, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_project(project_id uuid, display_name text DEFAULT NULL, bio text DEFAULT NULL, archived boolean DEFAULT NULL, public_metadata jsonb DEFAULT NULL, replace_metadata boolean DEFAULT FALSE)
    RETURNS json
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.projects p
    SET
        display_name = coalesce($2, p.display_name),
        bio = coalesce($3, p.bio),
        archived = coalesce($4, p.archived),
        public_metadata = CASE WHEN $5 IS NULL THEN
            p.public_metadata -- do nothing
        WHEN p.public_metadata IS NULL THEN
            $5 -- set metadata
        WHEN $6 THEN
            $5 -- replace metadata
        ELSE
            p.public_metadata || $5
        END -- merge metadata
    WHERE
        p.id = $1;
    RETURN get_project_by_id($1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_project(uuid, text, text, boolean, jsonb, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_project(project_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.projects
    WHERE id = $1;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_project(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_on_project(project_id uuid, user_id uuid)
    RETURNS public.users_on_project
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN up
FROM
    users_on_project up
WHERE
    up.project_id = $1
        AND up.user_id = $2;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_on_project(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_user_on_project(project_id uuid, user_id uuid, new_membership_role app.membership_role)
    RETURNS public.users_on_project
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.users_on_project up
    SET
        membership_role = $3
    WHERE
        up.project_id = $1
        AND up.user_id = $2;
    RETURN get_user_on_project($1, $2);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_on_project(uuid, uuid, app.membership_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_current_user_projects()
    RETURNS SETOF public.v_user_projects
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.v_user_projects um
    WHERE
        um.user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_projects() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_project_users(project_id uuid, results_limit integer DEFAULT 50, results_offset integer DEFAULT 0)
    RETURNS SETOF public.v_project_members
    SET search_path = public
    LANGUAGE plpgsql
    SECURITY DEFINER STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.project_members um
    WHERE
        um.project_id = $1
    LIMIT coalesce($2, 50) offset coalesce($3, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_users(uuid, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_project_user(project_id uuid, user_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.users_on_project up
    WHERE up.project_id = remove_project_user.project_id
        AND up.user_id = remove_project_user.user_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_project_user(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_project_teams(project_id uuid, results_limit integer DEFAULT 50, results_offset integer DEFAULT 0)
    RETURNS SETOF public.v_project_teams
    SET search_path = public
    LANGUAGE plpgsql
    STABLE
    SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.project_teams um
    WHERE
        um.project_id = $1
    LIMIT coalesce($2, 50) offset coalesce($3, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_project_teams(uuid, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_project_team(project_id uuid, team_id uuid)
    RETURNS boolean
    SET search_path = public
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.teams_on_project up
    WHERE up.project_id = $1
        AND up.team_id = remove_project_team.team_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_project_team(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_projects(account_name citext DEFAULT NULL, partial_name citext DEFAULT NULL)
    RETURNS SETOF public.v_projects STABLE
    LANGUAGE sql
    AS $$
    SELECT
        *
    FROM
        public.v_projects
    WHERE($1 IS NULL
        OR account_name <% $1
        OR account_name ~ $1)
    AND($2 IS NULL
        OR partial_name <% $2
        OR partial_name ~ $2)
ORDER BY
    coalesce(extensions.similarity($1, account_name), 0) + coalesce(extensions.similarity($2, partial_name), 0) DESC,
    created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.search_projects(citext, citext) TO anon, authenticated, service_role;

