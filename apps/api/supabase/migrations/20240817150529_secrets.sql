-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.secrets(
    secret_id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    account_name app.valid_name NOT NULL,
    secret_name text NOT NULL,
    vault_secret_id uuid NOT NULL, -- this is how we fetch from encrypted storage
    secret_description text,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    updated_at timestamp with time zone DEFAULT NOW(),
    updated_by uuid REFERENCES auth.users(id),
    -- KEYS
    PRIMARY KEY (secret_id),
    UNIQUE (account_name, secret_name)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_secrets_secret_name ON public.secrets(secret_name);

CREATE INDEX IF NOT EXISTS idx_secrets_vault_secret_id ON public.secrets(vault_secret_id);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER set_secret_timestamp
    BEFORE INSERT OR UPDATE ON public.secrets
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_secret_update_tracking
    BEFORE INSERT OR UPDATE ON public.secrets
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY secrets_select_policy ON public.secrets AS permissive
    FOR SELECT TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name)
            OR (account_name IN (
                SELECT
                    app.get_organization_names_with_role(auth.uid(), 'write')) OR account_name IN (
                        SELECT
                            app.get_team_names_with_role(auth.uid(), 'write')) OR account_name IN (
                                SELECT
                                    app.get_project_names_with_role(auth.uid(), 'write'))));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.insert_secret(name text, secret text, description text)
    RETURNS uuid
    LANGUAGE plpgsql
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role') != 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN vault.create_secret(secret, name, description);
END;
$$;

GRANT EXECUTE ON FUNCTION public.insert_secret(text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.update_secret(id uuid, secret text, name text, description text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role') != 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN vault.update_secret(id, secret, name, description);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_secret(uuid, text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.delete_secret(secret_id uuid)
    RETURNS uuid
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
DECLARE
    deleted_secret_id uuid;
BEGIN
    IF current_setting('role') != 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    DELETE FROM vault.decrypted_secrets
    WHERE id = secret_id
    RETURNING
        id INTO deleted_secret_id;
    RETURN deleted_secret_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_secret(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.read_secret(secret_id uuid)
    RETURNS TABLE(
        id uuid,
        name text,
        description text,
        secret text,
        key_id uuid,
        nonce bytea,
        created_at timestamp with time zone,
        updated_at timestamp with time zone)
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role') != 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.description,
        s.secret,
        s.key_id,
        s.nonce,
        s.created_at,
        s.updated_at
    FROM
        vault.decrypted_secrets s
    WHERE
        s.id = secret_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.read_secret(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.get_decrypted_organization_secrets(user_id uuid)
    RETURNS TABLE(
        secret_id uuid,
        secret_name text,
        secret_value text,
        secret_description text)
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role', TRUE) IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN QUERY
    SELECT
        s.secret_id,
        s.secret_name,
        vs.decrypted_secret AS secret_value,
        s.secret_description
    FROM
        public.secrets s
        JOIN vault.decrypted_secrets vs ON s.vault_secret_id = vs.id
    WHERE
        s.account_name IN(
            SELECT
                public.get_organization_names_with_role(user_id, 'owner'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_decrypted_organization_secrets(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.get_decrypted_team_secrets(user_id uuid)
    RETURNS TABLE(
        secret_id uuid,
        secret_name text,
        secret_value text,
        secret_description text)
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role', TRUE) IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN QUERY
    SELECT
        s.secret_id,
        s.secret_name,
        vs.decrypted_secret AS secret_value,
        s.secret_description
    FROM
        public.secrets s
        JOIN vault.decrypted_secrets vs ON s.vault_secret_id = vs.id
    WHERE
        s.account_name IN(
            SELECT
                public.get_team_names_with_role(user_id, 'owner'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_decrypted_team_secrets(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.get_decrypted_project_secrets(user_id uuid)
    RETURNS TABLE(
        secret_id uuid,
        secret_name text,
        secret_value text,
        secret_description text)
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role', TRUE) IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN QUERY
    SELECT
        s.secret_id,
        s.secret_name,
        vs.decrypted_secret AS secret_value,
        s.secret_description
    FROM
        public.secrets s
        JOIN vault.decrypted_secrets vs ON s.vault_secret_id = vs.id
    WHERE
        s.account_name IN(
            SELECT
                public.get_project_names_with_role(user_id, 'owner'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_decrypted_project_secrets(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.get_decrypted_user_secrets(user_id uuid)
    RETURNS TABLE(
        secret_id uuid,
        secret_name text,
        secret_value text,
        secret_description text)
    LANGUAGE PLPGSQL
    SECURITY INVOKER
    AS $$
BEGIN
    IF current_setting('role', TRUE) IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'authentication required';
    END IF;
    RETURN QUERY
    SELECT
        s.secret_id,
        s.secret_name,
        vs.decrypted_secret AS secret_value,
        s.secret_description
    FROM
        public.secrets s
        JOIN vault.decrypted_secrets vs ON s.vault_secret_id = vs.id
    WHERE
        public.is_account_owner(user_id, s.account_name);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_decrypted_user_secrets(uuid) TO service_role;

