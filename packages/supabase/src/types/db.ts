export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_registry: {
        Row: {
          account_name: string
          created_at: string | null
          is_organization: boolean
          updated_at: string | null
        }
        Insert: {
          account_name: string
          created_at?: string | null
          is_organization: boolean
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          created_at?: string | null
          is_organization?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          account_name: string
          created_at: string | null
          id: string
          invitation_type: "one_time" | "24_hour"
          invited_by: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
          token: string
          updated_at: string | null
        }
        Insert: {
          account_name: string
          created_at?: string | null
          id?: string
          invitation_type: "one_time" | "24_hour"
          invited_by?: string | null
          membership_role: "owner" | "write" | "read"
          organization_id?: string | null
          organization_name?: string | null
          project_id?: string | null
          project_name?: string | null
          team_id?: string | null
          team_name?: string | null
          token?: string
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          created_at?: string | null
          id?: string
          invitation_type?: "one_time" | "24_hour"
          invited_by?: string | null
          membership_role?: "owner" | "write" | "read"
          organization_id?: string | null
          organization_name?: string | null
          project_id?: string | null
          project_name?: string | null
          team_id?: string | null
          team_name?: string | null
          token?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      navigation_options: {
        Row: {
          created_at: string | null
          created_by: string | null
          display_name: string | null
          display_order: number | null
          host_name: string
          icon: string | null
          id: string
          link: string | null
          name: string
          navigation_id: string
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          display_order?: number | null
          host_name: string
          icon?: string | null
          id?: string
          link?: string | null
          name: string
          navigation_id: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          display_order?: number | null
          host_name?: string
          icon?: string | null
          id?: string
          link?: string | null
          name?: string
          navigation_id?: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_options_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_options_navigation_id_fkey"
            columns: ["navigation_id"]
            isOneToOne: false
            referencedRelation: "navigations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigation_options_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      navigations: {
        Row: {
          account_name: string
          created_at: string | null
          created_by: string | null
          display_name: string | null
          host_name: string
          id: string
          name: string
          partial_name: string | null
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_name: string
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          host_name?: string
          id?: string
          name: string
          partial_name?: string | null
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          host_name?: string
          id?: string
          name?: string
          partial_name?: string | null
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "navigations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "navigations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          membership_role: "owner" | "write" | "read"
          notification: string
          object_id: string
          public_metadata: Json | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          membership_role?: "owner" | "write" | "read"
          notification: string
          object_id: string
          public_metadata?: Json | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          membership_role?: "owner" | "write" | "read"
          notification?: string
          object_id?: string
          public_metadata?: Json | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          is_organization?: boolean
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          is_organization?: boolean
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name", "is_organization"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name", "is_organization"]
          },
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          account_name: string
          archived: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          partial_name: string
          private_metadata: Json | null
          project_name: string
          public: boolean
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_name: string
          archived?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          partial_name: string
          private_metadata?: Json | null
          project_name?: string
          public?: boolean
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          archived?: boolean
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          partial_name?: string
          private_metadata?: Json | null
          project_name?: string
          public?: boolean
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          account_name: string
          created_at: string | null
          created_by: string | null
          secret_description: string | null
          secret_id: string
          secret_name: string
          updated_at: string | null
          updated_by: string | null
          vault_secret_id: string
        }
        Insert: {
          account_name: string
          created_at?: string | null
          created_by?: string | null
          secret_description?: string | null
          secret_id?: string
          secret_name: string
          updated_at?: string | null
          updated_by?: string | null
          vault_secret_id: string
        }
        Update: {
          account_name?: string
          created_at?: string | null
          created_by?: string | null
          secret_description?: string | null
          secret_id?: string
          secret_name?: string
          updated_at?: string | null
          updated_by?: string | null
          vault_secret_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secrets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secrets_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          private_metadata: Json | null
          project_id: string
          public_metadata: Json | null
          task_priority: "low" | "medium" | "high" | "urgent" | "none" | null
          task_status:
            | "backlog"
            | "todo"
            | "in_progress"
            | "completed"
            | "canceled"
            | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assigned_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          private_metadata?: Json | null
          project_id: string
          public_metadata?: Json | null
          task_priority?: "low" | "medium" | "high" | "urgent" | "none" | null
          task_status?:
            | "backlog"
            | "todo"
            | "in_progress"
            | "completed"
            | "canceled"
            | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assigned_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          private_metadata?: Json | null
          project_id?: string
          public_metadata?: Json | null
          task_priority?: "low" | "medium" | "high" | "urgent" | "none" | null
          task_status?:
            | "backlog"
            | "todo"
            | "in_progress"
            | "completed"
            | "canceled"
            | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          parent_team_id?: string | null
          partial_name: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          team_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          parent_team_id?: string | null
          partial_name?: string
          private_metadata?: Json | null
          public_metadata?: Json | null
          team_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      teams_on_project: {
        Row: {
          created_at: string | null
          project_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      tracker_entries: {
        Row: {
          assigned_id: string | null
          closed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: number | null
          id: string
          private_metadata: Json | null
          project_id: string
          public_metadata: Json | null
          rate: number | null
          start_time: string | null
          stop_time: string | null
          task_id: string | null
          team_id: string | null
          tracker_id: string
          updated_at: string | null
          updated_by: string | null
          project_collaborators: Record<string, unknown> | null
        }
        Insert: {
          assigned_id?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          private_metadata?: Json | null
          project_id: string
          public_metadata?: Json | null
          rate?: number | null
          start_time?: string | null
          stop_time?: string | null
          task_id?: string | null
          team_id?: string | null
          tracker_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assigned_id?: string | null
          closed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          private_metadata?: Json | null
          project_id?: string
          public_metadata?: Json | null
          rate?: number | null
          start_time?: string | null
          stop_time?: string | null
          task_id?: string | null
          team_id?: string | null
          tracker_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trackers: {
        Row: {
          created_at: string | null
          created_by: string | null
          estimate: number | null
          id: string
          private_metadata: Json | null
          project_id: string
          project_name: string
          project_status:
            | "backlog"
            | "todo"
            | "in_progress"
            | "paused"
            | "completed"
            | "closed"
            | "canceled"
          public_metadata: Json | null
          rate: number | null
          updated_at: string | null
          updated_by: string | null
          project_collaborators: Record<string, unknown> | null
          total_duration: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          estimate?: number | null
          id?: string
          private_metadata?: Json | null
          project_id: string
          project_name: string
          project_status:
            | "backlog"
            | "todo"
            | "in_progress"
            | "paused"
            | "completed"
            | "closed"
            | "canceled"
          public_metadata?: Json | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          estimate?: number | null
          id?: string
          private_metadata?: Json | null
          project_id?: string
          project_name?: string
          project_status?:
            | "backlog"
            | "todo"
            | "in_progress"
            | "paused"
            | "completed"
            | "closed"
            | "canceled"
          public_metadata?: Json | null
          rate?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trackers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trackers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "trackers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id: string
          is_organization?: boolean
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string | null
          id?: string
          is_organization?: boolean
          private_metadata?: Json | null
          public_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name", "is_organization"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name", "is_organization"]
          },
          {
            foreignKeyName: "users_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_on_organization: {
        Row: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          membership_role?: "owner" | "write" | "read"
          organization_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_organization_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_on_project: {
        Row: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          project_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          membership_role?: "owner" | "write" | "read"
          project_id: string
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          membership_role?: "owner" | "write" | "read"
          project_id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
        ]
      }
      users_on_team: {
        Row: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          team_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          membership_role: "owner" | "write" | "read"
          team_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          membership_role?: "owner" | "write" | "read"
          team_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_team_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "users_on_team_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_invitations: {
        Row: {
          account_name: string | null
          created_at: string | null
          id: string | null
          invitation_type: "one_time" | "24_hour" | null
          invited_by: string | null
          invited_by_by: string | null
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["invited_by_by"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_organization_invites: {
        Row: {
          account_name: string | null
          created_at: string | null
          id: string | null
          invitation_type: "one_time" | "24_hour" | null
          invited_by: string | null
          invited_by_by: string | null
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["invited_by_by"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_organization_members: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          organization_id: string | null
          total_members: number | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_organizations: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          public_metadata: Json | null
        }
        Insert: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          public_metadata?: Json | null
        }
        Update: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          public_metadata?: Json | null
        }
        Relationships: []
      }
      v_project_invites: {
        Row: {
          account_name: string | null
          created_at: string | null
          id: string | null
          invitation_type: "one_time" | "24_hour" | null
          invited_by: string | null
          invited_by_by: string | null
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["invited_by_by"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_project_members: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          project_id: string | null
          total_members: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_project_teams: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          partial_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
          total_teams: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
        ]
      }
      v_projects: {
        Row: {
          account_name: string | null
          archived: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          partial_name: string | null
          project_name: string | null
          public_metadata: Json | null
        }
        Insert: {
          account_name?: string | null
          archived?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          partial_name?: string | null
          project_name?: string | null
          public_metadata?: Json | null
        }
        Update: {
          account_name?: string | null
          archived?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          partial_name?: string | null
          project_name?: string | null
          public_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
        ]
      }
      v_tasks: {
        Row: {
          account_name: string | null
          assigned_id: string | null
          avatar_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string | null
          project_id: string | null
          public_metadata: Json | null
          task_priority: "low" | "medium" | "high" | "urgent" | "none" | null
          task_status:
            | "backlog"
            | "todo"
            | "in_progress"
            | "completed"
            | "canceled"
            | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tasks_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      v_team_invites: {
        Row: {
          account_name: string | null
          created_at: string | null
          id: string | null
          invitation_type: "one_time" | "24_hour" | null
          invited_by: string | null
          invited_by_by: string | null
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["invited_by_by"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_team_members: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          team_id: string | null
          total_members: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_team_projects: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          partial_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          total_projects: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
        ]
      }
      v_teams: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          parent_team_id: string | null
          partial_name: string | null
          public_metadata: Json | null
          team_name: string | null
        }
        Insert: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          parent_team_id?: string | null
          partial_name?: string | null
          public_metadata?: Json | null
          team_name?: string | null
        }
        Update: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          parent_team_id?: string | null
          partial_name?: string | null
          public_metadata?: Json | null
          team_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
        ]
      }
      v_tracker_entries: {
        Row: {
          assigned_id: string | null
          closed_at: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string | null
          public_metadata: Json | null
          rate: number | null
          team_id: string | null
          tracker_id: string | null
        }
        Insert: {
          assigned_id?: string | null
          closed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string | null
          public_metadata?: Json | null
          rate?: number | null
          team_id?: string | null
          tracker_id?: string | null
        }
        Update: {
          assigned_id?: string | null
          closed_at?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string | null
          public_metadata?: Json | null
          rate?: number | null
          team_id?: string | null
          tracker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_organization_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_project_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["invited_by_by"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_organizations"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_projects"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tracker_entries_assigned_id_fkey"
            columns: ["assigned_id"]
            isOneToOne: false
            referencedRelation: "v_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_invitations"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_organization_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_project_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_invites"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_members"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_team_projects"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "v_user_teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "tracker_entries_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
        ]
      }
      v_tracker_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string | null
          link_id: string | null
          short_link: string | null
          team_id: string | null
          tracker_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string | null
          link_id?: string | null
          short_link?: string | null
          team_id?: string | null
          tracker_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string | null
          link_id?: string | null
          short_link?: string | null
          team_id?: string | null
          tracker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracker_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_reports_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracker_reports_tracker_id_fkey"
            columns: ["tracker_id"]
            isOneToOne: false
            referencedRelation: "trackers"
            referencedColumns: ["id"]
          },
        ]
      }
      v_trackers: {
        Row: {
          account_name: string | null
          archived: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          estimate: number | null
          id: string | null
          partial_name: string | null
          private_metadata: Json | null
          project_name: string | null
          project_status:
            | "backlog"
            | "todo"
            | "in_progress"
            | "paused"
            | "completed"
            | "closed"
            | "canceled"
            | null
          public: boolean | null
          public_metadata: Json | null
          rate: number | null
          tracker_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_organizations: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          organization_id: string | null
          organization_name: string | null
          total_organizations: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_projects: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          partial_name: string | null
          project_id: string | null
          project_name: string | null
          total_projects: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_user_teams: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          partial_name: string | null
          team_id: string | null
          team_name: string | null
          total_teams: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_account_registry"
            columns: ["account_name"]
            isOneToOne: false
            referencedRelation: "account_registry"
            referencedColumns: ["account_name"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      v_users: {
        Row: {
          account_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          public_metadata: Json | null
        }
        Insert: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          public_metadata?: Json | null
        }
        Update: {
          account_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          public_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      create_invitation: {
        Args: {
          account_name: unknown
          membership_role: "owner" | "write" | "read"
          invitation_type: "one_time" | "24_hour"
          organization_id?: string
          team_id?: string
          project_id?: string
        }
        Returns: string
      }
      create_organization: {
        Args: {
          account_name: unknown
          display_name?: string
          bio?: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      create_project: {
        Args: {
          account_name: unknown
          partial_name: unknown
          display_name?: string
          bio?: string
          public?: boolean
          archived?: boolean
        }
        Returns: Json
      }
      create_team: {
        Args: {
          account_name: unknown
          partial_name: unknown
          display_name?: string
          bio?: string
          parent_team_id?: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }
      }
      delete_invitation: {
        Args: {
          invitation_id: string
        }
        Returns: boolean
      }
      delete_organization: {
        Args: {
          organization_id: string
        }
        Returns: boolean
      }
      delete_project: {
        Args: {
          project_id: string
        }
        Returns: boolean
      }
      delete_secret: {
        Args: {
          secret_id: string
        }
        Returns: string
      }
      delete_team: {
        Args: {
          team_id: string
        }
        Returns: boolean
      }
      get_account_invitations: {
        Args: {
          account_name: unknown
        }
        Returns: {
          account_name: string
          created_at: string | null
          id: string
          invitation_type: "one_time" | "24_hour"
          invited_by: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string | null
          organization_name: string | null
          project_id: string | null
          project_name: string | null
          team_id: string | null
          team_name: string | null
          token: string
          updated_at: string | null
        }[]
      }
      get_account_registry_state: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_account_teams: {
        Args: {
          account_name: unknown
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }[]
      }
      get_current_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          organization_id: string | null
          organization_name: string | null
          total_organizations: number | null
          user_id: string | null
        }[]
      }
      get_current_user_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          partial_name: string | null
          project_id: string | null
          project_name: string | null
          total_projects: number | null
          user_id: string | null
        }[]
      }
      get_current_user_teams: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          partial_name: string | null
          team_id: string | null
          team_name: string | null
          total_teams: number | null
          user_id: string | null
        }[]
      }
      get_decrypted_organization_secrets: {
        Args: {
          user_id: string
        }
        Returns: {
          secret_id: string
          secret_name: string
          secret_value: string
          secret_description: string
        }[]
      }
      get_decrypted_project_secrets: {
        Args: {
          user_id: string
        }
        Returns: {
          secret_id: string
          secret_name: string
          secret_value: string
          secret_description: string
        }[]
      }
      get_decrypted_team_secrets: {
        Args: {
          user_id: string
        }
        Returns: {
          secret_id: string
          secret_name: string
          secret_value: string
          secret_description: string
        }[]
      }
      get_decrypted_user_secrets: {
        Args: {
          user_id: string
        }
        Returns: {
          secret_id: string
          secret_name: string
          secret_value: string
          secret_description: string
        }[]
      }
      get_me: {
        Args: Record<PropertyKey, never>
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_organization_by_id: {
        Args: {
          organization_id: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_organization_by_name: {
        Args: {
          account_name: unknown
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_organization_id: {
        Args: {
          account_name: unknown
        }
        Returns: string
      }
      get_organization_users: {
        Args: {
          organization_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          organization_id: string | null
          total_members: number | null
          user_id: string | null
          user_name: string | null
        }[]
      }
      get_project_by_id: {
        Args: {
          project_id: string
        }
        Returns: {
          account_name: string
          archived: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          partial_name: string
          private_metadata: Json | null
          project_name: string
          public: boolean
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_project_by_name: {
        Args: {
          project_name: string
        }
        Returns: {
          account_name: string
          archived: boolean
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          partial_name: string
          private_metadata: Json | null
          project_name: string
          public: boolean
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_project_id: {
        Args: {
          project_name: string
        }
        Returns: string
      }
      get_project_teams:
        | {
            Args: {
              project_id: string
              results_limit?: number
              results_offset?: number
            }
            Returns: {
              account_name: string | null
              avatar_url: string | null
              created_at: string | null
              display_name: string | null
              partial_name: string | null
              project_id: string | null
              project_name: string | null
              team_id: string | null
              team_name: string | null
              total_teams: number | null
            }[]
          }
        | {
            Args: {
              project_name: string
            }
            Returns: {
              account_name: string | null
              avatar_url: string | null
              created_at: string | null
              display_name: string | null
              partial_name: string | null
              project_id: string | null
              project_name: string | null
              team_id: string | null
              team_name: string | null
              total_teams: number | null
            }[]
          }
      get_project_users: {
        Args: {
          project_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          project_id: string | null
          total_members: number | null
          user_id: string | null
        }[]
      }
      get_team_by_id: {
        Args: {
          team_id: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_team_by_name: {
        Args: {
          team_name: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_team_id: {
        Args: {
          team_name: string
        }
        Returns: string
      }
      get_team_users: {
        Args: {
          team_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: {
          account_name: string | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          membership_role: "owner" | "write" | "read" | null
          team_id: string | null
          total_members: number | null
          user_id: string | null
        }[]
      }
      get_user_by_id: {
        Args: {
          user_id: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_user_by_name: {
        Args: {
          account_name: unknown
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      get_user_id: {
        Args: {
          account_name: unknown
        }
        Returns: string
      }
      get_user_on_organization: {
        Args: {
          organization_id: string
          user_id: string
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string
          updated_at: string | null
          user_id: string
        }
      }
      get_user_on_project: {
        Args: {
          project_id: string
          user_id: string
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          project_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
      }
      get_user_on_team: {
        Args: {
          team_id: string
          user_id: string
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          team_id: string
          updated_at: string | null
          user_id: string
        }
      }
      insert_secret: {
        Args: {
          name: string
          secret: string
          description: string
        }
        Returns: string
      }
      lookup_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      project_collaborators:
        | {
            Args: {
              "": unknown
            }
            Returns: {
              id: string
              avatar_url: string
              display_name: string
            }[]
          }
        | {
            Args: {
              "": unknown
            }
            Returns: {
              id: string
              avatar_url: string
              display_name: string
            }[]
          }
      read_secret: {
        Args: {
          secret_id: string
        }
        Returns: {
          id: string
          name: string
          description: string
          secret: string
          key_id: string
          nonce: string
          created_at: string
          updated_at: string
        }[]
      }
      remove_organization_user: {
        Args: {
          organization_id: string
          user_id: string
        }
        Returns: boolean
      }
      remove_project_team: {
        Args: {
          project_id: string
          team_id: string
        }
        Returns: boolean
      }
      remove_project_user: {
        Args: {
          project_id: string
          user_id: string
        }
        Returns: boolean
      }
      remove_team_user: {
        Args: {
          team_id: string
          user_id: string
        }
        Returns: boolean
      }
      search_organizations: {
        Args: {
          account_name?: string
        }
        Returns: {
          account_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          public_metadata: Json | null
        }[]
      }
      search_projects: {
        Args: {
          account_name?: string
          partial_name?: string
        }
        Returns: {
          account_name: string | null
          archived: boolean | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          partial_name: string | null
          project_name: string | null
          public_metadata: Json | null
        }[]
      }
      search_teams: {
        Args: {
          account_name?: string
          partial_name?: string
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }[]
      }
      total_duration: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      update_organization: {
        Args: {
          organization_id: string
          display_name?: string
          bio?: string
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      update_project: {
        Args: {
          project_id: string
          display_name?: string
          bio?: string
          archived?: boolean
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: Json
      }
      update_secret: {
        Args: {
          id: string
          secret: string
          name: string
          description: string
        }
        Returns: string
      }
      update_team: {
        Args: {
          team_id: string
          display_name?: string
          bio?: string
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          parent_team_id: string | null
          partial_name: string
          private_metadata: Json | null
          public_metadata: Json | null
          team_name: string
          updated_at: string | null
          updated_by: string | null
        }
      }
      update_user: {
        Args: {
          user_id: string
          display_name?: string
          bio?: string
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: {
          account_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          created_by: string | null
          display_name: string | null
          id: string
          is_organization: boolean
          private_metadata: Json | null
          public_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
      }
      update_user_on_organization: {
        Args: {
          organization_id: string
          user_id: string
          new_membership_role: "owner" | "write" | "read"
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          organization_id: string
          updated_at: string | null
          user_id: string
        }
      }
      update_user_on_project: {
        Args: {
          project_id: string
          user_id: string
          new_membership_role: "owner" | "write" | "read"
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          project_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
      }
      update_user_on_team: {
        Args: {
          team_id: string
          user_id: string
          new_membership_role: "owner" | "write" | "read"
        }
        Returns: {
          created_at: string | null
          membership_role: "owner" | "write" | "read"
          team_id: string
          updated_at: string | null
          user_id: string
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

