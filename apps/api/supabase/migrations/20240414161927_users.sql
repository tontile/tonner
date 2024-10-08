-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users(
    id uuid NOT NULL REFERENCES auth.users(id),
    -- COLUMNS
    account_name app.valid_name NOT NULL UNIQUE,
    is_organization boolean NOT NULL GENERATED ALWAYS AS (FALSE) STORED,
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

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_on_account_registry ON public.users(account_name, is_organization);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_users_on_auth_user_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
BEGIN
    -- first we add the account_name to the registry
    INSERT INTO public.account_registry(account_name, is_organization)
        VALUES(NEW.raw_app_meta_data ->> 'account_name', FALSE);
    -- create new user
    INSERT INTO public.users(id, account_name, display_name, bio, public_metadata)
        VALUES(NEW.id, NEW.raw_app_meta_data ->> 'account_name', NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'bio', jsonb_build_object('locale', 'en', 'week_starts_on_monday', TRUE));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION app.trigger_users_on_storage_object_created()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    SECURITY DEFINER
    AS $$
DECLARE
    v_account_name app.valid_name;
    v_affected_user public.users := NULL;
BEGIN
    SELECT
        (string_to_array(NEW.name, '/'::text))[1]::app.valid_name INTO v_account_name;
    UPDATE
        public.users
    SET
        avatar_url = NEW.name
    WHERE
        account_name = v_account_name
    RETURNING
        * INTO v_affected_user;
    IF NOT v_affected_user IS NULL THEN
        UPDATE
            auth.users u
        SET
            "raw_user_meta_data" = u.raw_user_meta_data || jsonb_build_object('avatar_url', NEW.name)
        WHERE
            u.id = v_affected_user.id;
    END IF;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_users_timestamp
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER app_set_users_update_tracking
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_users_on_auth_user_creating
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_users_on_auth_user_creating();

CREATE TRIGGER app_users_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_users_on_auth_user_created();

CREATE TRIGGER app_users_on_storage_object_created
    AFTER INSERT ON STORAGE.objects
    FOR EACH ROW
    WHEN(NEW.bucket_id = 'avatars')
    EXECUTE PROCEDURE app.trigger_users_on_storage_object_created();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.is_account_owner(user_id uuid, account_name app.valid_name)
    RETURNS boolean
    LANGUAGE sql
    STABLE
    AS $$
    SELECT
        EXISTS(
            SELECT
                1
            FROM
                public.users u
            WHERE
                u.id = is_account_owner.user_id
                AND u.account_name = is_account_owner.account_name)
$$;

GRANT EXECUTE ON FUNCTION app.is_account_owner(uuid, app.valid_name) TO authenticated, service_role;

-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

GRANT UPDATE (display_name, bio, public_metadata) ON public.users TO authenticated;

CREATE POLICY users_delete_policy ON public.users AS permissive
    FOR DELETE TO authenticated
        USING (id = auth.uid());

CREATE POLICY users_update_policy ON public.users AS permissive
    FOR UPDATE TO authenticated
        USING (id = auth.uid());

CREATE POLICY users_select_policy ON public.users AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY users_account_registry_select_policy ON public.account_registry AS permissive
    FOR SELECT TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_users WITH ( security_invoker = TRUE
) AS
SELECT
    acc.id,
    acc.account_name,
    acc.avatar_url,
    acc.display_name,
    acc.bio,
    acc.created_at,
    acc.public_metadata
FROM
    public.users acc;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_id(account_name app.valid_name)
    RETURNS uuid
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN(
        SELECT
            u.id
        FROM
            users u
        WHERE
            u.account_name = get_user_id.account_name);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_id(app.valid_name) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id uuid)
    RETURNS public.users
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN u
FROM
    users u
WHERE
    u.id = get_user_by_id.user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_by_id(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_user_by_name(account_name app.valid_name)
    RETURNS public.users
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN u
FROM
    users u
WHERE
    u.account_name = get_user_by_name.account_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_by_name(app.valid_name) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_me()
    RETURNS public.users
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    STABLE
    AS $$
BEGIN
    RETURN u
FROM
    users u
WHERE
    u.id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_me() TO authenticated;

CREATE OR REPLACE FUNCTION public.update_user(user_id uuid, display_name text DEFAULT NULL, bio text DEFAULT NULL, public_metadata jsonb DEFAULT NULL, replace_metadata boolean DEFAULT FALSE)
    RETURNS public.users
    SET search_path = public
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE
        public.users u
    SET
        display_name = coalesce(update_user.display_name, u.display_name),
        bio = coalesce(update_user.bio, u.bio),
        public_metadata = CASE WHEN update_user.public_metadata IS NULL THEN
            u.public_metadata -- do nothing
        WHEN u.public_metadata IS NULL THEN
            update_user.public_metadata -- set metadata
        WHEN update_user.replace_metadata THEN
            update_user.public_metadata -- replace metadata
        ELSE
            u.public_metadata || update_user.public_metadata
        END -- merge metadata
    WHERE
        u.id = update_user.user_id;
    RETURN get_user_by_id(update_user.user_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user(uuid, text, text, jsonb, boolean) TO authenticated, service_role;

