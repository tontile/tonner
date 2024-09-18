-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    team_name text UNIQUE NOT NULL GENERATED ALWAYS AS (app.generate_name(account_name, partial_name)) STORED,
    account_name app.valid_name NOT NULL, -- ex: tonner
    partial_name app.valid_name NOT NULL, -- ex: design
    display_name text CHECK (LENGTH(display_name) <= 128),
    bio text CHECK (LENGTH(bio) <= 512),
    avatar_url text,
    parent_team_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
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

CREATE TABLE IF NOT EXISTS public.users_on_team(
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    membership_role app.membership_role NOT NULL,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    -- KEYS
    PRIMARY KEY (team_id, user_id)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_teams_account_name_partial_name ON public.teams(account_name, partial_name);

CREATE INDEX IF NOT EXISTS idx_teams_partial_name_search ON public.teams USING gin(partial_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_teams_account_name_search ON public.teams USING gin(account_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_teams_parent_team_id ON public.teams(parent_team_id);

CREATE INDEX IF NOT EXISTS idx_users_on_team_user_id ON public.users_on_team(user_id);

CREATE INDEX IF NOT EXISTS idx_users_on_team_team_id ON public.users_on_team(team_id);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_teams_on_team_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.users_on_team(team_id, user_id, membership_role)
        VALUES(NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_teams_on_storage_object_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
DECLARE
    v_team_name text;
BEGIN
    SELECT
        (string_to_array(NEW.name, '/'::text))[1]::text INTO v_team_name;
    UPDATE
        public.teams
    SET
        avatar_url = NEW.name
    WHERE
        team_name = v_team_name;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_users_on_team_timestamp
    BEFORE INSERT OR UPDATE ON public.users_on_team
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_teams_timestamp
    BEFORE INSERT OR UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_teams_update_tracking
    BEFORE INSERT OR UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_teams_on_team_created
    AFTER INSERT ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_teams_on_team_created();

CREATE TRIGGER app_teams_on_storage_object_created
    AFTER INSERT ON STORAGE.objects
    FOR EACH ROW
    WHEN(NEW.bucket_id = 'avatars')
    EXECUTE PROCEDURE app.trigger_teams_on_storage_object_created();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.get_parent_team_id(team_id uuid)
    RETURNS uuid
    LANGUAGE SQL
    SECURITY DEFINER
    AS $$
    SELECT
        t.parent_team_id
    FROM
        public.teams t
    WHERE
        t.id = get_parent_team_id.team_id;
$$;

GRANT EXECUTE ON FUNCTION app.get_parent_team_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_account_team_ids(account_name app.valid_name)
    RETURNS SETOF UUID
    LANGUAGE SQL
    SECURITY DEFINER
    AS $$
    SELECT
        t.id
    FROM
        public.teams t
    WHERE
        t.account_name = get_account_team_ids.account_name;
$$;

GRANT EXECUTE ON FUNCTION app.get_account_team_ids(app.valid_name) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_team_users_with_role(team_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF UUID
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        ut.user_id
    FROM
        public.users_on_team ut
    WHERE
        ut.team_id = get_team_users_with_role.team_id
        AND(ut.membership_role = passed_in_role
            OR ut.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_team_users_with_role(uuid, app.membership_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_team_ids_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF uuid
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        ut.team_id
    FROM
        public.users_on_team ut
    WHERE
        ut.user_id = get_team_ids_with_role.user_id
        AND(ut.membership_role = get_team_ids_with_role.passed_in_role
            OR ut.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_team_ids_with_role(uuid, app.membership_role) TO authenticated;

CREATE OR REPLACE FUNCTION app.get_team_names_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF text
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        t.team_name
    FROM
        public.users_on_team ut
        JOIN public.teams t ON t.id = ut.team_id
    WHERE
        ut.user_id = get_team_names_with_role.user_id
        AND(ut.membership_role = passed_in_role
            OR ut.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_team_ids_with_role(uuid, app.membership_role) TO authenticated;

-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.users_on_team ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, partial_name, display_name, bio, parent_team_id, public_metadata) ON public.teams TO authenticated;

GRANT UPDATE (display_name, bio, public_metadata) ON public.teams TO authenticated;

GRANT DELETE ON public.teams TO authenticated;

GRANT INSERT (team_id, user_id, membership_role) ON public.users_on_team TO authenticated;

GRANT UPDATE (membership_role) ON public.users_on_team TO authenticated;

GRANT DELETE ON public.users_on_team TO authenticated;

CREATE POLICY teams_insert_policy ON public.teams AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner'))
                AND (parent_team_id IS NULL OR parent_team_id IN (
                    SELECT
                        app.get_account_team_ids(account_name))));

CREATE POLICY teams_update_policy ON public.teams AS permissive
    FOR UPDATE TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner')));

CREATE POLICY teams_delete_policy ON public.teams AS permissive
    FOR DELETE TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner')));

CREATE POLICY teams_select_policy ON public.teams AS permissive
    FOR SELECT TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid())));

CREATE POLICY users_on_team_delete_policy ON public.users_on_team AS permissive
    FOR DELETE TO authenticated
        USING (user_id = auth.uid()
            OR team_id IN (
                SELECT
                    app.get_team_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY users_on_team_select_policy ON public.users_on_team AS permissive
    FOR SELECT TO authenticated
        USING (team_id IN (
            SELECT
                app.get_team_ids_with_role(auth.uid())));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_teams WITH ( security_invoker = TRUE
) AS
SELECT
    t.id,
    t.team_name,
    t.account_name,
    t.partial_name,
    t.avatar_url,
    t.display_name,
    t.bio,
    t.created_at,
    t.public_metadata,
    t.parent_team_id
FROM
    public.teams t;

CREATE OR REPLACE VIEW public.v_user_teams WITH ( security_invoker = TRUE
) AS
SELECT
    t.id AS team_id,
    u.id AS user_id,
    t.account_name,
    t.partial_name,
    t.team_name,
    t.display_name,
    t.avatar_url,
    ut.membership_role,
    ut.created_at,
    count(
        *) OVER (PARTITION BY u.id) AS total_teams
FROM
    public.users_on_team ut
    JOIN teams t ON t.id = ut.team_id
    JOIN users u ON u.id = ut.user_id;

CREATE OR REPLACE VIEW public.v_team_members WITH ( security_invoker = TRUE
) AS
SELECT
    u.id AS user_id,
    t.id AS team_id,
    u.account_name,
    u.display_name,
    u.avatar_url,
    ut.membership_role,
    ut.created_at,
    count(
        *) OVER (PARTITION BY t.id) AS total_members
FROM
    public.users_on_team ut
    JOIN teams t ON t.id = ut.team_id
    JOIN users u ON u.id = ut.user_id;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_account_teams(account_name app.valid_name)
    RETURNS SETOF public.teams
    LANGUAGE "plpgsql"
    STABLE
    SET search_path = public
    SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.teams t
    WHERE
        t.account_name = get_account_teams.account_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_team_id(team_name text)
    RETURNS uuid
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN(
        SELECT
            t.id
        FROM
            teams t
        WHERE
            t.team_name = $1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_id(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_team_by_id(team_id uuid)
    RETURNS public.teams
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN t
FROM
    teams t
WHERE
    t.id = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_by_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_team_by_name(team_name text)
    RETURNS public.teams
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN t
FROM
    teams t
WHERE
    t.team_name = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_by_name(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_team(account_name app.valid_name, partial_name app.valid_name, display_name text DEFAULT NULL, bio text DEFAULT NULL, parent_team_id uuid DEFAULT NULL)
    RETURNS public.teams
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_team_id uuid;
BEGIN
    INSERT INTO public.teams(account_name, partial_name, display_name, bio, parent_team_id)
        VALUES ($1, $2, $3, $4, $5)
    RETURNING
        id INTO new_team_id;
    RETURN get_team_by_id(new_team_id);
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'An account with that unique ID already exists';
END;

$$;

GRANT EXECUTE ON FUNCTION public.create_team(app.valid_name, app.valid_name, text, text, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_team(team_id uuid, display_name text DEFAULT NULL, bio text DEFAULT NULL, public_metadata jsonb DEFAULT NULL, replace_metadata boolean DEFAULT FALSE)
    RETURNS public.teams
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.teams t
    SET
        display_name = coalesce($2, t.display_name),
        bio = coalesce($3, t.bio),
        public_metadata = CASE WHEN $4 IS NULL THEN
            t.public_metadata -- do nothing
        WHEN t.public_metadata IS NULL THEN
            $4 -- set metadata
        WHEN $5 THEN
            $4 -- replace metadata
        ELSE
            t.public_metadata || $4
        END -- merge metadata
    WHERE
        t.id = $1;
    RETURN get_team_by_id($1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_team(uuid, text, text, jsonb, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_team(team_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.teams
    WHERE id = delete_team.team_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_team(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_on_team(team_id uuid, user_id uuid)
    RETURNS public.users_on_team
    SET search_path = public
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN ut
FROM
    users_on_team ut
WHERE
    ut.team_id = $1
        AND ut.user_id = $2;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_on_team(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_user_on_team(team_id uuid, user_id uuid, new_membership_role app.membership_role)
    RETURNS public.users_on_team
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.users_on_team ut
    SET
        membership_role = $3
    WHERE
        ut.team_id = $1
        AND ut.user_id = $2;
    RETURN get_user_on_team($1, $2);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_on_team(uuid, uuid, app.membership_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_current_user_teams()
    RETURNS SETOF public.v_user_teams
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.v_user_teams um
    WHERE
        um.user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_teams() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_team_users(team_id uuid, results_limit integer DEFAULT 50, results_offset integer DEFAULT 0)
    RETURNS SETOF public.v_team_members
    SET search_path = public
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = app
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.v_team_members um
    WHERE
        um.team_id = $1
    LIMIT coalesce($2, 50) offset coalesce($3, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_team_users(uuid, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_team_user(team_id uuid, user_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.users_on_team ut
    WHERE ut.team_id = remove_team_user.team_id
        AND ut.user_id = remove_team_user.user_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_team_user(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_teams(account_name citext DEFAULT NULL, partial_name citext DEFAULT NULL)
    RETURNS SETOF public.teams STABLE
    LANGUAGE sql
    AS $$
    SELECT
        *
    FROM
        public.teams
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

GRANT EXECUTE ON FUNCTION public.search_teams(citext, citext) TO anon, authenticated, service_role;

