-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.miniapps(
    id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    -- COLUMNS
    miniapp_name text UNIQUE NOT NULL GENERATED ALWAYS AS (app.generate_name(account_name, partial_name)) STORED,
    account_name app.valid_name NOT NULL,
    partial_name app.valid_name NOT NULL,
    display_name text CHECK (LENGTH(display_name) <= 128),
    bio text CHECK (LENGTH(bio) <= 512),
    published boolean NOT NULL DEFAULT FALSE,
    favicon_url text,
    content jsonb DEFAULT '{}' ::jsonb,
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

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_miniapps_account_name_partial_name ON public.miniapps(account_name, partial_name);

CREATE INDEX IF NOT EXISTS idx_miniapps_partial_name_search ON public.miniapps USING gin(partial_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_miniapps_account_name_search ON public.miniapps USING gin(account_name extensions.gin_trgm_ops);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_miniapps_on_miniapp_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
BEGIN
    SELECT
        account_name,
        partial_name INTO NEW.account_name,
        NEW.partial_name
    FROM
        public.projects
    WHERE
        id = NEW.id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_miniapps_on_storage_object_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
DECLARE
    v_miniapp_name text;
BEGIN
    SELECT
        (string_to_array(NEW.name, '/'::text))[1]::text INTO v_miniapp_name;
    UPDATE
        public.miniapps
    SET
        favicon_url = NEW.name
    WHERE
        miniapp_name = v_miniapp_name;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_miniapps_timestamp
    BEFORE INSERT OR UPDATE ON public.miniapps
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_miniapps_update_tracking
    BEFORE INSERT OR UPDATE ON public.miniapps
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_miniapps_on_miniapp_creating
    AFTER INSERT ON public.miniapps
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_miniapps_on_miniapp_creating();

CREATE TRIGGER app_miniapps_on_storage_object_created
    AFTER INSERT ON STORAGE.objects
    FOR EACH ROW
    WHEN(NEW.bucket_id = 'avatars')
    EXECUTE PROCEDURE app.trigger_miniapps_on_storage_object_created();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.miniapps ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, partial_name, display_name, bio, published, favicon_url, content, public_metadata) ON public.miniapps TO authenticated;

GRANT UPDATE (display_name, bio, published, content, public_metadata) ON public.miniapps TO authenticated;

GRANT DELETE ON public.miniapps TO authenticated;

CREATE POLICY miniapps_insert_policy ON public.miniapps AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY miniapps_update_policy ON public.miniapps AS permissive
    FOR UPDATE TO authenticated
        USING (id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'write')));

CREATE POLICY miniapps_delete_policy ON public.miniapps AS permissive
    FOR DELETE TO authenticated
        USING (id IN (
            SELECT
                app.get_project_ids_with_role(auth.uid(), 'owner')));

CREATE POLICY miniapps_select_policy ON public.miniapps AS permissive
    FOR SELECT TO authenticated, anon
        USING (published = TRUE);

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_miniapps WITH ( security_invoker = TRUE
) AS
SELECT
    t.id,
    t.miniapp_name,
    t.account_name,
    t.partial_name,
    t.favicon_url,
    t.display_name,
    t.bio,
    t.created_at,
    t.public_metadata
FROM
    public.miniapps t;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_account_miniapps(account_name app.valid_name)
    RETURNS SETOF public.miniapps
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
        public.miniapps t
    WHERE
        t.account_name = get_account_miniapps.account_name;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_miniapp_id(miniapp_name text)
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
            miniapps t
        WHERE
            t.miniapp_name = $1);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_miniapp_id(text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_miniapp_by_id(miniapp_id uuid)
    RETURNS public.miniapps
    SECURITY DEFINER
    SET search_path = public
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN t
FROM
    miniapps t
WHERE
    t.id = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_miniapp_by_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_miniapp_by_name(miniapp_name text)
    RETURNS public.miniapps
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN t
FROM
    miniapps t
WHERE
    t.miniapp_name = $1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_miniapp_by_name(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_miniapp(account_name app.valid_name, partial_name app.valid_name, display_name text DEFAULT NULL, bio text DEFAULT NULL, content jsonb DEFAULT '{}' ::jsonb)
    RETURNS public.miniapps
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_miniapp_id uuid;
BEGIN
    INSERT INTO public.miniapps(account_name, partial_name, display_name, bio, content)
        VALUES ($1, $2, $3, $4, $5)
    RETURNING
        id INTO new_miniapp_id;
    RETURN get_miniapp_by_id(new_miniapp_id);
EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'An account with that unique ID already exists';
END;

$$;

GRANT EXECUTE ON FUNCTION public.create_miniapp(app.valid_name, app.valid_name, text, text, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_miniapp(miniapp_id uuid, display_name text DEFAULT NULL, bio text DEFAULT NULL, content jsonb DEFAULT NULL, published boolean DEFAULT NULL, public_metadata jsonb DEFAULT NULL, replace_metadata boolean DEFAULT FALSE)
    RETURNS public.miniapps
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.miniapps t
    SET
        display_name = coalesce(update_miniapp.display_name, t.display_name),
        bio = coalesce(update_miniapp.bio, t.bio),
        content = coalesce(update_miniapp.content, t.content),
        published = coalesce(update_miniapp.published, t.published),
        public_metadata = CASE WHEN update_miniapp.public_metadata IS NULL THEN
            t.public_metadata -- do nothing
        WHEN t.public_metadata IS NULL THEN
            update_miniapp.public_metadata -- set metadata
        WHEN update_miniapp.replace_metadata THEN
            update_miniapp.public_metadata -- replace metadata
        ELSE
            t.public_metadata || update_miniapp.public_metadata
        END -- merge metadata
    WHERE
        t.id = update_miniapp.miniapp_id;
    RETURN get_miniapp_by_id(update_miniapp.miniapp_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_miniapp(uuid, text, text, jsonb, boolean, jsonb, boolean) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_miniapp(miniapp_id uuid)
    RETURNS boolean
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.miniapps
    WHERE id = delete_miniapp.miniapp_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_miniapp(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.search_miniapps(account_name citext DEFAULT NULL, partial_name citext DEFAULT NULL)
    RETURNS SETOF public.miniapps STABLE
    LANGUAGE sql
    AS $$
    SELECT
        *
    FROM
        public.miniapps
    WHERE($1 IS NULL
        OR account_name <% search_miniapps.account_name
        OR account_name ~ search_miniapps.account_name)
    AND($2 IS NULL
        OR partial_name <% search_miniapps.partial_name
        OR partial_name ~ search_miniapps.partial_name)
ORDER BY
    coalesce(extensions.similarity(search_miniapps.account_name, account_name), 0) + coalesce(extensions.similarity(search_miniapps.partial_name, partial_name), 0) DESC,
    created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.search_miniapps(citext, citext) TO anon, authenticated, service_role;

