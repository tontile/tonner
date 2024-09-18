-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.navigations(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    account_name app.valid_name NOT NULL,
    partial_name text,
    host_name text NOT NULL GENERATED ALWAYS AS (app.generate_name(account_name, partial_name)) STORED,
    name app.valid_name NOT NULL,
    display_name text CHECK (LENGTH(display_name) <= 128),
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
    UNIQUE (host_name, name),
    CONSTRAINT fk_account_registry FOREIGN KEY (account_name) REFERENCES public.account_registry(account_name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.navigation_options(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    navigation_id uuid NOT NULL REFERENCES public.navigations(id) ON DELETE CASCADE,
    host_name text NOT NULL,
    name app.valid_name NOT NULL,
    display_name text CHECK (LENGTH(display_name) <= 128),
    display_order int,
    link text,
    icon text,
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
    UNIQUE (navigation_id, name)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_navigations_account_name ON public.navigations USING gin(account_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_navigations_partial_name ON public.navigations USING gin(partial_name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_navigation_options_navigation_id ON public.navigation_options(navigation_id);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_navigation_options_on_navigation_option_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
BEGIN
    NEW.host_name =(
        SELECT
            host_name
        FROM
            public.navigations
        WHERE
            id = NEW.navigation_id);
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER set_navigations_timestamp
    BEFORE INSERT OR UPDATE ON public.navigations
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_navigations_update_tracking
    BEFORE INSERT OR UPDATE ON public.navigations
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER set_navigation_options_timestamp
    BEFORE INSERT OR UPDATE ON public.navigation_options
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_timestamps();

CREATE TRIGGER set_navigation_options_update_tracking
    BEFORE INSERT OR UPDATE ON public.navigation_options
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_set_update_tracking();

CREATE TRIGGER app_navigation_options_on_navigation_option_creating
    BEFORE INSERT OR UPDATE ON public.navigation_options
    FOR EACH ROW
    EXECUTE PROCEDURE app.trigger_navigation_options_on_navigation_option_creating();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.navigations ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, partial_name, display_name, public_metadata) ON public.navigations TO authenticated;

GRANT UPDATE (display_name, public_metadata) ON public.navigations TO authenticated;

GRANT DELETE ON public.navigations TO authenticated;

ALTER TABLE public.navigation_options ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, partial_name, host_name, name, display_name, public_metadata) ON public.navigations TO authenticated;

GRANT UPDATE (display_name, public_metadata) ON public.navigations TO authenticated;

GRANT DELETE ON public.navigation_options TO authenticated;

CREATE POLICY navigations_select_policy ON public.navigations AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY navigations_update_policy ON public.navigations AS permissive
    FOR UPDATE TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name)
            OR (host_name IN (
                SELECT
                    app.get_team_names_with_role(auth.uid(), 'owner')) OR host_name IN (
                        SELECT
                            app.get_project_names_with_role(auth.uid(), 'write'))));

CREATE POLICY navigations_insert_policy ON public.navigations AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (app.is_account_owner(auth.uid(), account_name)
        OR (host_name IN (
            SELECT
                app.get_team_names_with_role(auth.uid(), 'owner')) OR host_name IN (
                    SELECT
                        app.get_project_names_with_role(auth.uid(), 'write'))));

CREATE POLICY navigations_delete_policy ON public.navigations AS permissive
    FOR DELETE TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name)
            OR (host_name IN (
                SELECT
                    app.get_team_names_with_role(auth.uid(), 'owner')) OR host_name IN (
                        SELECT
                            app.get_project_names_with_role(auth.uid(), 'write'))));

CREATE POLICY navigation_options_select_policy ON public.navigation_options AS permissive
    FOR SELECT TO authenticated
        USING (TRUE);

CREATE POLICY navigation_options_update_policy ON public.navigation_options AS permissive
    FOR UPDATE TO authenticated
        USING (host_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner'))
                OR host_name IN (
                    SELECT
                        app.get_team_names_with_role(auth.uid(), 'owner'))
                        OR host_name IN (
                            SELECT
                                app.get_project_names_with_role(auth.uid(), 'write')));

CREATE POLICY navigation_options_insert_policy ON public.navigation_options AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (host_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner'))
                OR host_name IN (
                    SELECT
                        app.get_team_names_with_role(auth.uid(), 'owner'))
                        OR host_name IN (
                            SELECT
                                app.get_project_names_with_role(auth.uid(), 'write')));

CREATE POLICY navigation_options_delete_policy ON public.navigation_options AS permissive
    FOR DELETE TO authenticated
        USING (host_name IN (
            SELECT
                app.get_organization_names_with_role(auth.uid(), 'owner'))
                OR host_name IN (
                    SELECT
                        app.get_team_names_with_role(auth.uid(), 'owner'))
                        OR host_name IN (
                            SELECT
                                app.get_project_names_with_role(auth.uid(), 'write')));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
