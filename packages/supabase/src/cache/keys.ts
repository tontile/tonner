export const accountKeys = {
  list: () => ["accounts"],
  userAccounts: (params: { user_id: string }) => [
    "users",
    params.user_id,
    "accounts",
  ],
};

export const invitationKeys = {
  organizationInvites: (params: { organization_id: string }) => [
    "organizations",
    params.organization_id,
    "invitations",
  ],
  teamInvites: (params: { team_id: string }) => [
    "team",
    params.team_id,
    "invitations",
  ],
  projectInvites: (params: { project_id: string }) => [
    "projects",
    params.project_id,
    "invitations",
  ],
  userInvites: (params: { account_name: string }) => [
    "users",
    params.account_name,
    "invitations",
  ],
};

export const navigationKeys = {
  list: (params: { account_name: string; partial_name: string }) => [
    "accounts",
    params.account_name,
    params.partial_name,
    "navigations",
  ],
  navigation: (params: {
    account_name: string;
    partial_name: string;
    nav_name: string;
  }) => [
    "accounts",
    params.account_name,
    params.partial_name,
    "navigations",
    params.nav_name,
  ],
};

export const organizationKeys = {
  list: () => ["organizations"],
  single: (params: { organization_id: string }) => [
    "organizations",
    params.organization_id,
  ],
  members: (params: { organization_id: string }) => [
    "organizations",
    params.organization_id,
    "members",
  ],
  userOrganizations: (params: { user_id: string }) => [
    "users",
    params.user_id,
    "organizations",
  ],
  membership: (params: { organization_id: string; user_id: string }) => [
    "users",
    params.user_id,
    "organizations",
    params.organization_id,
  ],
};

export const projectKeys = {
  list: () => ["projects"],
  single: (params: { project_id: string }) => ["projects", params.project_id],
  membership: (params: { project_id: string; user_id: string }) => [
    "users",
    params.user_id,
    "projects",
    params.project_id,
  ],
  members: (params: { project_id: string }) => [
    "projects",
    params.project_id,
    "members",
  ],
  teams: (params: { project_id: string }) => [
    "projects",
    params.project_id,
    "teams",
  ],
  accountProjects: (params: { account_name: string }) => [
    "accounts",
    params.account_name,
    "projects",
  ],
  teamProjects: (params: { team_id: string }) => [
    "teams",
    params.team_id,
    "projects",
  ],
  userProjects: (params: { user_id: string }) => [
    "users",
    params.user_id,
    "projects",
  ],
};

export const miniappKeys = {
  list: (params: { account_name: string }) => [
    "accounts",
    params.account_name,
    "miniapps",
  ],
  single: (params: { miniapp_name: string }) => [
    "miniapps",
    params.miniapp_name,
  ],
};

export const teamKeys = {
  list: () => ["teams"],
  single: (params: { team_id: string }) => ["teams", params.team_id],
  members: (params: { team_id: string }) => [
    "teams",
    params.team_id,
    "members",
  ],
  userTeams: (params: { user_id: string }) => [
    "users",
    params.user_id,
    "teams",
  ],
  membership: (params: { team_id: string; user_id: string }) => [
    "users",
    params.user_id,
    "teams",
    params.team_id,
  ],
};

export const trackerKeys = {
  list: (params: { project_id: string; args: string }) => [
    "projects",
    params.project_id,
    "trackers",
    params.args,
  ],
  records: (params: {
    project_id: string;
    tracker_id: string;
    args: string;
  }) => [
    "projects",
    params.project_id,
    "trackers",
    params.tracker_id,
    params.args,
  ],
};

export const userKeys = {
  single: (params: { user_id: string }) => ["users", params.user_id],
};
