export const accountKeys = {
  list: () => ["accounts"] as const,
  userAccounts: (user_id?: string) => ["users", user_id, "accounts"] as const,
};

export const invitationKeys = {
  organizationInvites: (organization_id?: string) =>
    ["organizations", organization_id, "invitations"] as const,
  teamInvites: (team_id?: string) => ["team", team_id, "invitations"] as const,
  projectInvites: (project_id?: string) =>
    ["projects", project_id, "invitations"] as const,
  userInvites: (user_id?: string) => ["users", user_id, "invitations"] as const,
};

export const navigationKeys = {
  list: (account_name?: string, partial_name?: string) =>
    ["accounts", account_name, partial_name, "navigations"] as const,
  navigation: (
    account_name?: string,
    partial_name?: string,
    nav_name?: string,
  ) => [...navigationKeys.list(account_name, partial_name), nav_name] as const,
};

export const organizationKeys = {
  list: () => ["organizations"] as const,
  organization: (organization_id?: string) =>
    ["organizations", organization_id] as const,
  members: (organization_id?: string) =>
    ["organizations", organization_id, "members"] as const,
  userOrganizations: (user_id?: string) =>
    ["users", user_id, "organizations"] as const,
  membership: (organization_id?: string, user_id?: string) =>
    [...organizationKeys.userOrganizations(user_id), organization_id] as const,
};

export const projectKeys = {
  list: () => ["projects"] as const,
  project: (project_id?: string) => ["projects", project_id] as const,
  members: (project_id?: string) =>
    ["projects", project_id, "members"] as const,
  teams: (project_id?: string) => ["projects", project_id, "teams"] as const,
  userProjects: (user_id?: string) => ["users", user_id, "projects"] as const,
  membership: (project_id?: string, user_id?: string) =>
    [...projectKeys.userProjects(user_id), project_id] as const,
  teamProjects: (team_id?: string) => ["teams", team_id, "projects"] as const,
};

export const teamKeys = {
  list: () => ["teams"] as const,
  team: (team_id?: string) => ["teams", team_id] as const,
  members: (team_id?: string) => ["teams", team_id, "members"] as const,
  userTeams: (user_id?: string) => ["users", user_id, "teams"] as const,
  membership: (team_id?: string, user_id?: string) =>
    [...teamKeys.userTeams(user_id), team_id] as const,
};

export const trackerKeys = {
  list: (project_id?: string) => ["projects", project_id, "trackers"] as const,
  records: (project_id?: string, tracker_id?: string, params?: string) =>
    [...trackerKeys.list(project_id), tracker_id, params] as const,
};

export const userKeys = {
  user: (user_id?: string) => ["users", user_id] as const,
};
