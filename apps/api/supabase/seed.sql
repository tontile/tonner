DO $$
BEGIN
  IF NOT EXISTS(
    SELECT
      1
    FROM
      vault.decrypted_secrets
    WHERE
      name = 'WEBHOOK_ENDPOINT') THEN
  PERFORM
    vault.create_secret('http://127.0.0.1:3001/api', 'WEBHOOK_ENDPOINT', 'Webhook endpoint URL');
  PERFORM
    vault.create_secret(app.generate_token(32), 'WEBHOOK_SECRET', 'Webhook secret key');
END IF;
END;
$$;

INSERT INTO auth.users(instance_id, id, aud, "role", email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_sso_user)
  VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'hitasp@outlook.com', app.generate_token(), now(), '{"provider": "email", "providers": ["email"]}', '{"account_name": "hitasp", "display_name": "Hitasp", "bio": "Tonner Staff"}', FALSE);

INSERT INTO public.account_registry(account_name, is_organization)
-- Reserved account_names
  VALUES ('owner', FALSE),
('administrator', FALSE),
('superuser', FALSE),
('superadmin', FALSE),
('root', FALSE),
('user', FALSE),
('guest', FALSE),
('anon', FALSE),
('authenticated', FALSE),
('sysadmin', FALSE),
('support', FALSE),
('manager', FALSE),
('default', FALSE),
('staff', FALSE),
('help', FALSE),
('helpdesk', FALSE),
('test', FALSE),
('password', FALSE),
('demo', FALSE),
('service', FALSE),
('info', FALSE),
('webmaster', FALSE),
('security', FALSE),
('installer', FALSE);

BEGIN;
SELECT
  app.simulate_login('hitasp@outlook.com');
INSERT INTO public.organizations(account_name, display_name, bio)
  VALUES ('tontile', 'tontile', 'Build in a weekend, scale to millions');
INSERT INTO public.projects(account_name, partial_name, display_name, bio, public)
  VALUES ('tontile', 'tonner', 'Tonner Project', 'Build in a weekend, scale to millions', TRUE);
INSERT INTO public.teams(account_name, partial_name, display_name, bio)
  VALUES ('tontile', 'database', 'Tonner Database team', 'Build in a weekend, scale to millions');
END;
INSERT INTO public.users_on_organization(organization_id, user_id, membership_role)
SELECT
  org.id,
  u.id,
  'read'
FROM
  public.organizations org,
  public.users u
WHERE
  -- hitasp is already a member because that user created it
  u.account_name <> 'hitasp';
BEGIN;
SELECT
  app.simulate_login('hitasp@outlook.com');
INSERT INTO public.organizations(account_name, display_name, bio)
  VALUES ('ton', 'TON', 'The Open Network');
END;
DROP FUNCTION app.simulate_login(citext);
