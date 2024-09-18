-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    account_name app.valid_name NOT NULL UNIQUE,
    is_organization boolean NOT NULL GENERATED ALWAYS AS (TRUE) STORED,
    display_name text CHECK (LENGTH(display_name) <= 128),
    bio text CHECK (LENGTH(bio) <= 512),
    avatar_url text,
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
    CONSTRAINT fk_account_registry FOREIGN KEY (account_name, is_organization) REFERENCES public.account_registry(account_name, is_organization)
);

CREATE TABLE IF NOT EXISTS public.users_on_organization(
    -- COLUMNS
    organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    membership_role app.membership_role NOT NULL,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    -- KEYS
    PRIMARY KEY (organization_id, user_id)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_organizations_account_registry ON public.users(account_name, is_organization);

CREATE INDEX IF NOT EXISTS idx_users_on_organization_user_id ON public.users_on_organization(user_id);

CREATE INDEX IF NOT EXISTS idx_users_on_organization_organization_id ON public.users_on_organization(organization_id);

CREATE INDEX IF NOT EXISTS idx_organizations_account_name_search ON public.organizations USING gin(account_name extensions.gin_trgm_ops);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_organizations_on_organization_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.account_registry(account_name, is_organization)
        VALUES(NEW.account_name, TRUE);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_organizations_on_organization_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
BEGIN
    INSERT INTO public.users_on_organization(organization_id, user_id, membership_role)
        VALUES(NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_organizations_on_storage_object_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
DECLARE
    v_account_name app.valid_name;
BEGIN
    SELECT
        (string_to_array(NEW.name, '/'::text))[1]::app.valid_name INTO v_account_name;
    UPDATE
        public.organizations
    SET
        avatar_url = NEW.name
    WHERE
        account_name = v_account_name;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_users_on_organization_timestamp
    BEFORE INSERT OR UPDATE ON public.users_on_organization
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_organizations_timestamp
    BEFORE INSERT OR UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_organizations_update_tracking
    BEFORE INSERT OR UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_organizations_on_organization_creating
    BEFORE INSERT ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_organizations_on_organization_creating();

CREATE TRIGGER app_organizations_on_organization_created
    AFTER INSERT ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_organizations_on_organization_created();

CREATE TRIGGER app_organizations_on_storage_object_created
    AFTER INSERT ON STORAGE.objects
    FOR EACH ROW
    WHEN(NEW.bucket_id = 'avatars')
    EXECUTE PROCEDURE app.trigger_organizations_on_storage_object_created();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.get_organization_users_with_role(organization_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF UUID
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        uo.user_id
    FROM
        public.users_on_organization uo
    WHERE
        uo.organization_id = get_organization_users_with_role.organization_id
        AND(uo.membership_role = passed_in_role
            OR uo.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_organization_users_with_role(uuid, app.membership_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app.get_organization_names_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF app.valid_name
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        o.account_name
    FROM
        public.users_on_organization uo
        JOIN public.organizations o ON uo.organization_id = o.id
    WHERE
        uo.user_id = get_organization_names_with_role.user_id
        AND(uo.membership_role = passed_in_role
            OR uo.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_organization_names_with_role(uuid, app.membership_role) TO authenticated;

CREATE OR REPLACE FUNCTION app.get_organization_ids_with_role(user_id uuid, passed_in_role app.membership_role DEFAULT NULL)
    RETURNS SETOF uuid
    LANGUAGE SQL
    STABLE
    SECURITY DEFINER
    AS $$
    SELECT
        uo.organization_id
    FROM
        public.users_on_organization uo
    WHERE
        uo.user_id = get_organization_ids_with_role.user_id
        AND(membership_role = passed_in_role
            OR uo.membership_role = 'owner'
            OR passed_in_role IS NULL);
$$;

GRANT EXECUTE ON FUNCTION app.get_organization_ids_with_role(uuid, app.membership_role) TO authenticated;

-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.users_on_organization ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, display_name, bio) ON public.organizations TO authenticated;

GRANT UPDATE (display_name, bio, public_metadata) ON public.organizations TO authenticated;

GRANT INSERT (organization_id, user_id, membership_role) ON public.users_on_organization TO authenticated, service_role;

GRANT UPDATE (membership_role) ON public.users_on_organization TO authenticated;

GRANT DELETE ON public.users_on_organization TO authenticated;

CREATE POLICY organizations_insert_policy ON public.organizations AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (TRUE);

CREATE POLICY organizations_update_policy ON public.organizations AS permissive
    FOR UPDATE TO authenticated
        USING (id IN (
            SELECT
                app.get_organization_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY organizations_delete_policy ON public.organizations AS permissive
    FOR DELETE TO authenticated
        USING (created_by = auth.uid()
            AND id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY organizations_select_policy ON public.organizations AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY users_on_organization_delete_policy ON public.users_on_organization AS permissive
    FOR DELETE TO authenticated
        USING (user_id = auth.uid()
            OR organization_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY users_on_organization_update_policy ON public.users_on_organization AS permissive
    FOR UPDATE TO authenticated
        USING (organization_id IN (
            SELECT
                app.get_organization_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY users_on_organization_select_policy ON public.users_on_organization AS permissive
    FOR SELECT TO authenticated
        USING (organization_id IN (
            SELECT
                app.get_organization_ids_with_role(auth.uid())));

CREATE POLICY organizations_account_registry_select_policy ON public.account_registry AS permissive
    FOR SELECT TO authenticated
        USING (account_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid())));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_organizations WITH ( security_invoker = TRUE
) AS
SELECT
    o.id,
    o.account_name,
    o.avatar_url,
    o.display_name,
    o.bio,
    o.created_at,
    o.public_metadata
FROM
    public.organizations o;

CREATE OR REPLACE VIEW public.v_user_organizations WITH ( security_invoker = TRUE
) AS
SELECT
    o.id AS organization_id,
    u.id AS user_id,
    o.account_name AS organization_name,
    o.display_name,
    o.avatar_url,
    uo.membership_role,
    uo.created_at,
    count(
        *) OVER (PARTITION BY u.id) AS total_organizations
FROM
    public.users_on_organization uo
    JOIN organizations o ON o.id = uo.organization_id
    JOIN users u ON u.id = uo.user_id;

CREATE OR REPLACE VIEW public.v_organization_members WITH ( security_invoker = TRUE
) AS
SELECT
    u.id AS user_id,
    o.id AS organization_id,
    u.account_name AS user_name,
    u.display_name,
    u.avatar_url,
    uo.membership_role,
    uo.created_at,
    count(
        *) OVER (PARTITION BY o.id) AS total_members
FROM
    public.users_on_organization uo
    JOIN organizations o ON o.id = uo.organization_id
    JOIN users u ON u.id = uo.user_id;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_organization_id(account_name app.valid_name)
    RETURNS uuid
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN(
        SELECT
            o.id
        FROM
            organizations o
        WHERE
            o.account_name = get_organization_id.account_name);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_organization_id(app.valid_name) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_organization_by_id(organization_id uuid)
    RETURNS public.organizations
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN o
FROM
    organizations o
WHERE
    o.id = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_organization_by_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_organization_by_name(account_name app.valid_name)
    RETURNS public.organizations
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN o
FROM
    organizations o
WHERE
    o.account_name = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_organization_by_name(app.valid_name) TO authenticated;

CREATE FUNCTION public.create_organization(account_name app.valid_name, display_name text = NULL, bio text = NULL)
    RETURNS public.organizations
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public.organizations(account_name, display_name, bio)
        VALUES($1, $2, $3);
    RETURN get_organization_by_name(create_organization.account_name);
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'An account with that unique ID already exists';
END;

$$;

GRANT EXECUTE ON FUNCTION public.create_organization(app.valid_name, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_organization(organization_id uuid, display_name text DEFAULT NULL, bio text DEFAULT NULL, public_metadata jsonb DEFAULT NULL, replace_metadata boolean DEFAULT FALSE)
    RETURNS public.organizations
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.organizations o
    SET
        display_name = coalesce($2, o.display_name),
        bio = coalesce($3, o.bio),
        public_metadata = CASE WHEN $4 IS NULL THEN
            o.public_metadata -- do nothing
        WHEN o.public_metadata IS NULL THEN
            $4 -- set metadata
        WHEN $5 THEN
            $4 -- replace metadata
        ELSE
            o.public_metadata || $4
        END -- merge metadata
    WHERE
        o.id = $1;
    RETURN get_organization_by_id($1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_organization(uuid, text, text, jsonb, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_organization(organization_id uuid)
    RETURNS boolean
    SET search_path = public
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.organizations
    WHERE id = $1;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_organization(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_on_organization(organization_id uuid, user_id uuid)
    RETURNS public.users_on_organization
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN uo
FROM
    users_on_organization uo
WHERE
    uo.organization_id = $1
        AND uo.user_id = $2;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_on_organization(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_user_on_organization(organization_id uuid, user_id uuid, new_membership_role app.membership_role)
    RETURNS public.users_on_organization
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.users_on_organization uo
    SET
        membership_role = $3
    WHERE
        uo.organization_id = $1
        AND uo.user_id = $2;
    RETURN get_user_on_organization($1, $2);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_on_organization(uuid, uuid, app.membership_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_current_user_organizations()
    RETURNS SETOF public.v_user_organizations
    SET search_path = public
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.v_user_organizations uo
    WHERE
        uo.user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_organizations() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_organization_users(organization_id uuid, results_limit integer DEFAULT 50, results_offset integer DEFAULT 0)
    RETURNS SETOF public.v_organization_members
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    SET search_path = app
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.v_organization_members uo
    WHERE
        uo.organization_id = get_organization_users.organization_id
    LIMIT coalesce(results_limit, 50) offset coalesce(results_offset, 0);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_organization_users(uuid, integer, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.remove_organization_user(organization_id uuid, user_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.users_on_organization uo
    WHERE uo.organization_id = remove_organization_user.organization_id
        AND uo.user_id = remove_organization_user.user_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_organization_user(uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_organizations(account_name citext DEFAULT NULL)
    RETURNS SETOF public.v_organizations STABLE
    LANGUAGE sql
    AS $$
    SELECT
        *
    FROM
        public.v_organizations
    WHERE(search_organizations.account_name IS NULL
        OR account_name <% search_organizations.account_name
        OR account_name ~ search_organizations.account_name)
ORDER BY
    coalesce(extensions.similarity(search_organizations.account_name, account_name), 0) DESC,
    created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.search_organizations(citext) TO authenticated, service_role;

