-------------------------------------------------------
-- Section - Tables
-------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitations(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    -- COLUMNS
    account_name app.valid_name NOT NULL,
    organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
    team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    membership_role app.membership_role NOT NULL,
    token text UNIQUE NOT NULL DEFAULT app.generate_token(30),
    invited_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
    organization_name app.valid_name,
    team_name app.valid_name,
    project_name app.valid_name,
    -- TRACKER
    created_at timestamp with time zone DEFAULT NOW(),
    updated_at timestamp with time zone DEFAULT NOW(),
    invitation_type app.invitation_type NOT NULL,
    -- KEYS
    PRIMARY KEY (id),
    UNIQUE NULLS NOT DISTINCT (account_name, organization_id, team_id, project_id),
    CONSTRAINT fk_account_registry FOREIGN KEY (account_name) REFERENCES public.account_registry(account_name) ON DELETE CASCADE
);

-------------------------------------------------------
-- Section - Indexs
-------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_invitations_account_name ON public.invitations(account_name);

CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON public.invitations(invited_by);

CREATE INDEX IF NOT EXISTS idx_invitations_organization_id ON public.invitations(organization_id);

CREATE INDEX IF NOT EXISTS idx_invitations_team_id ON public.invitations(team_id);

CREATE INDEX IF NOT EXISTS idx_invitations_project_id ON public.invitations(project_id);

CREATE INDEX IF NOT EXISTS idx_invitations_created_at ON public.invitations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_invitations_invitation_type ON public.invitations(invitation_type);

-------------------------------------------------------
-- Section - TRIGGER Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION app.trigger_invitations_on_invitation_creating()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
DECLARE
    user_role app.membership_role;
BEGIN
    NEW.invited_by = auth.uid();
    IF NOT NEW.organization_id IS NULL THEN
        NEW.organization_name =(
            SELECT
                account_name
            FROM
                public.organizations
            WHERE
                id = NEW.organization_id);
    END IF;
    IF NOT NEW.team_id IS NULL THEN
        NEW.team_name =(
            SELECT
                team_name
            FROM
                public.teams
            WHERE
                id = NEW.team_id);
    END IF;
    IF NOT NEW.project_id IS NULL THEN
        NEW.project_name =(
            SELECT
                project_name
            FROM
                public.projects
            WHERE
                id = NEW.project_id);
    END IF;
    RETURN NEW;
END;
$$;

-------------------------------------------------------
-- Section - TRIGGERS
-------------------------------------------------------
CREATE TRIGGER app_set_invitations_timestamp
    BEFORE INSERT OR UPDATE ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_set_timestamps();

CREATE TRIGGER app_invitations_on_invitation_creating
    BEFORE INSERT ON public.invitations
    FOR EACH ROW
    EXECUTE FUNCTION app.trigger_invitations_on_invitation_creating();

-------------------------------------------------------
-- Section - domain Functions
-------------------------------------------------------
-------------------------------------------------------
-- Section - Security
-------------------------------------------------------
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

GRANT INSERT (account_name, organization_id, team_id, project_id, membership_role, token, invitation_type) ON public.invitations TO authenticated;

GRANT UPDATE (membership_role, invitation_type) ON public.invitations TO authenticated;

GRANT DELETE ON public.invitations TO authenticated;

CREATE POLICY invitations_insert_policy ON public.invitations AS permissive
    FOR INSERT TO authenticated
        WITH CHECK ((organization_id IS NOT NULL OR team_id IS NOT NULL OR project_id IS NOT NULL)
        AND (organization_id IN (
            SELECT
                app.get_organization_ids_with_role(auth.uid(), 'owner')) OR organization_id IS NULL AND (team_id IN (
                    SELECT
                        app.get_team_ids_with_role(auth.uid(), 'owner')) OR team_id IS NULL AND (project_id IN (
                            SELECT
                                app.get_project_ids_with_role(auth.uid(), 'owner')) OR project_id IS NULL))));

CREATE POLICY invitations_delete_policy ON public.invitations AS permissive
    FOR DELETE TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name)
            OR auth.uid() = invited_by
            OR (organization_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), 'owner')) OR organization_id IS NULL AND (team_id IN (
                        SELECT
                            app.get_team_ids_with_role(auth.uid(), 'owner')) OR team_id IS NULL AND (project_id IN (
                                SELECT
                                    app.get_project_ids_with_role(auth.uid(), 'owner')) OR project_id IS NULL))));

CREATE POLICY invitations_update_policy ON public.invitations AS permissive
    FOR UPDATE TO authenticated
        USING (auth.uid() = invited_by);

CREATE POLICY invitations_select_policy ON public.invitations AS permissive
    FOR SELECT TO authenticated
        USING (app.is_account_owner(auth.uid(), account_name)
            OR (organization_id IN (
                SELECT
                    app.get_organization_ids_with_role(auth.uid(), 'owner')) OR organization_id IS NULL AND (team_id IN (
                        SELECT
                            app.get_team_ids_with_role(auth.uid(), 'owner')) OR team_id IS NULL AND (project_id IN (
                                SELECT
                                    app.get_project_ids_with_role(auth.uid(), 'owner')) OR project_id IS NULL))));

-------------------------------------------------------
-- Section - Views
-------------------------------------------------------
CREATE OR REPLACE VIEW public.v_invitations WITH ( security_invoker = TRUE
) AS
SELECT
    inv.id,
    inv.account_name,
    o.id AS organization_id,
    o.account_name AS organization_name,
    t.id AS team_id,
    t.team_name,
    p.id AS project_id,
    p.project_name,
    inv.invitation_type,
    u.account_name AS invited_by,
    u.id AS invited_by_by,
    inv.created_at
FROM
    public.invitations inv
    JOIN public.users u ON inv.invited_by = u.id
    LEFT JOIN public.organizations o ON inv.organization_id = o.id
    LEFT JOIN public.teams t ON inv.team_id = t.id
    LEFT JOIN public.projects p ON inv.project_id = p.id;

CREATE OR REPLACE VIEW public.v_organization_invites AS
SELECT
    *
FROM
    v_invitations
WHERE
    organization_id IS NOT NULL;

CREATE OR REPLACE VIEW public.v_team_invites AS
SELECT
    *
FROM
    v_invitations
WHERE
    team_id IS NOT NULL;

CREATE OR REPLACE VIEW public.v_project_invites AS
SELECT
    *
FROM
    v_invitations
WHERE
    project_id IS NOT NULL;

-------------------------------------------------------
-- Section - RPC Functions
-------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_account_invitations(account_name app.valid_name)
    RETURNS SETOF public.invitations
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        *
    FROM
        public.invitations i
    WHERE
        i.account_name = get_account_invitations.account_name
        AND i.created_at > now() - interval '24 hours';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_account_invitations(app.valid_name) TO authenticated;

CREATE OR REPLACE FUNCTION public.accept_invitation(lookup_invitation_token text)
    RETURNS TABLE(
        membership_role app.membership_role,
        account_name app.valid_name,
        partial_name app.valid_name)
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public,
    app
    AS $$
DECLARE
    lookup_account_name app.valid_name;
    lookup_organization_name app.valid_name;
    lookup_organization_id uuid;
    lookup_team_partial_name app.valid_name;
    lookup_team_account_name app.valid_name;
    lookup_team_id uuid;
    lookup_project_partial_name app.valid_name;
    lookup_project_account_name app.valid_name;
    lookup_project_id uuid;
    new_member_role app.membership_role;
    target_account_name app.valid_name;
    target_partial_name app.valid_name;
BEGIN
    -- Fetch invitation details
    SELECT
        i.account_name,
        i.membership_role,
        i.organization_id,
        o.account_name,
        i.team_id,
        t.partial_name,
        t.account_name,
        i.project_id,
        p.partial_name,
        p.account_name INTO lookup_account_name,
        new_member_role,
        lookup_organization_id,
        lookup_organization_name,
        lookup_team_id,
        lookup_team_partial_name,
        lookup_team_account_name,
        lookup_project_id,
        lookup_project_partial_name,
        lookup_project_account_name
    FROM
        public.invitations i
    LEFT JOIN public.teams t ON t.id = i.team_id
    LEFT JOIN public.organizations o ON o.id = i.organization_id
    LEFT JOIN public.projects p ON p.id = i.project_id
WHERE
    i.token = lookup_invitation_token
        AND i.created_at > now() - interval '24 hours';
    IF app.is_account_owner(auth.uid(), lookup_account_name) <> TRUE THEN
        RAISE EXCEPTION 'Only account owners can accept invitations';
    END IF;
    -- Grant access to organization
    IF lookup_organization_id IS NOT NULL THEN
        target_account_name = lookup_organization_name;
        INSERT INTO public.users_on_organization(organization_id, user_id, membership_role)
            VALUES (lookup_organization_id, auth.uid(), new_member_role)
        ON CONFLICT
            DO NOTHING;
    END IF;
    -- Grant access to team
    IF lookup_team_id IS NOT NULL THEN
        target_account_name = lookup_team_account_name;
        target_partial_name = lookup_team_partial_name;
        INSERT INTO public.users_on_team(team_id, user_id, membership_role)
            VALUES (lookup_team_id, auth.uid(), new_member_role)
        ON CONFLICT
            DO NOTHING;
    END IF;
    -- Grant access to project
    IF lookup_project_id IS NOT NULL THEN
        target_account_name = lookup_project_account_name;
        target_partial_name = lookup_project_partial_name;
        INSERT INTO public.users_on_project(project_id, user_id, membership_role)
            VALUES (lookup_project_id, auth.uid(), new_member_role)
        ON CONFLICT
            DO NOTHING;
    END IF;
    IF lookup_organization_id IS NOT NULL OR lookup_team_id IS NOT NULL OR lookup_project_id IS NOT NULL THEN
        DELETE FROM public.invitations
        WHERE token = lookup_invitation_token
            AND invitation_type = 'one_time';
        RETURN QUERY
        SELECT
            new_member_role,
            target_account_name,
            target_partial_name;
    ELSE
        RAISE EXCEPTION 'Invalid token';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.accept_invitation(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.lookup_invitation(lookup_invitation_token text)
    RETURNS json
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
DECLARE
    user_name text;
    invitation_active boolean;
BEGIN
    SELECT
        account_name,
        CASE WHEN id IS NOT NULL THEN
            TRUE
        ELSE
            FALSE
        END AS active INTO user_name,
        invitation_active
    FROM
        public.invitations
    WHERE
        token = lookup_invitation_token
        AND created_at > now() - interval '24 hours'
    LIMIT 1;
    RETURN json_build_object('active', coalesce(invitation_active, FALSE), 'account_name', user_name);
END;
$$;

GRANT EXECUTE ON FUNCTION public.lookup_invitation(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.create_invitation(account_name app.valid_name, membership_role app.membership_role, invitation_type app.invitation_type, organization_id uuid DEFAULT NULL, team_id uuid DEFAULT NULL, project_id uuid DEFAULT NULL)
    RETURNS text
    SECURITY DEFINER
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_invitation_token text;
BEGIN
    INSERT INTO public.invitations(account_name, membership_role, invitation_type, invited_by, organization_id, team_id, project_id)
        VALUES (account_name, membership_role, invitation_type, auth.uid(), organization_id, team_id, project_id)
    RETURNING
        token INTO new_invitation_token;
    RETURN new_invitation_token;
END
$$;

GRANT EXECUTE ON FUNCTION public.create_invitation(app.valid_name, app.membership_role, app.invitation_type, uuid, uuid, uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_invitation(invitation_id uuid)
    RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM public.invitations
    WHERE id = delete_invitation.invitation_id;
    RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_invitation(uuid) TO authenticated;

