-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    notification text NOT NULL,
    object_id uuid NOT NULL,
    subject_id uuid,
    membership_role app.membership_role NOT NULL DEFAULT 'read',
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    created_by uuid REFERENCES auth.users(id),
    public_metadata jsonb DEFAULT '{}' ::jsonb,
    -- KEYS
    PRIMARY KEY (id)
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

GRANT INSERT (notification, object_id, subject_id, membership_role, public_metadata) ON public.notifications TO authenticated;

GRANT UPDATE (public_metadata) ON public.notifications TO authenticated;

CREATE POLICY notifications_insert_policy ON public.notifications AS permissive
    FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = object_id
        OR (object_id IN (
            SELECT
                app.get_organization_ids_with_role(auth.uid())) OR (object_id IN (
                    SELECT
                        app.get_team_ids_with_role(auth.uid())) OR (object_id IN (
                            SELECT
                                app.get_project_ids_with_role(auth.uid()))))));

CREATE POLICY notifications_select_policy ON public.notifications AS permissive
    FOR SELECT TO authenticated
        USING (auth.uid() = subject_id
            OR (subject_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                        SELECT
                            app.get_team_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                                SELECT
                                    app.get_project_ids_with_role(auth.uid(), membership_role))))));

CREATE POLICY notifications_update_policy ON public.notifications AS permissive
    FOR UPDATE TO authenticated
        USING (auth.uid() = subject_id
            OR (subject_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                        SELECT
                            app.get_team_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                                SELECT
                                    app.get_project_ids_with_role(auth.uid(), membership_role))))));

CREATE POLICY notifications_delete_policy ON public.notifications AS permissive
    FOR DELETE TO authenticated
        USING (auth.uid() = subject_id
            OR (subject_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                        SELECT
                            app.get_team_ids_with_role(auth.uid(), membership_role)) OR (subject_id IN (
                                SELECT
                                    app.get_project_ids_with_role(auth.uid(), membership_role))))));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
