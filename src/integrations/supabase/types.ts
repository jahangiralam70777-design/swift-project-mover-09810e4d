export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_action_log: {
        Row: {
          action: string | null
          allowed: boolean
          created_at: string
          id: string
          metadata: Json | null
          permission: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          allowed?: boolean
          created_at?: string
          id?: string
          metadata?: Json | null
          permission?: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          allowed?: boolean
          created_at?: string
          id?: string
          metadata?: Json | null
          permission?: string
          user_id?: string | null
        }
        Relationships: []
      }
      app_pages: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          group: string
          key: string
          label: string
          route: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          group?: string
          key: string
          label: string
          route: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          group?: string
          key?: string
          label?: string
          route?: string
          updated_at?: string
        }
        Relationships: []
      }
      auth_access_controls: {
        Row: {
          created_at: string
          id: number
          login_auto_enable_at: string | null
          login_enabled: boolean
          login_message_description: string
          login_message_footer: string
          login_message_subtitle: string
          login_message_title: string
          signup_auto_enable_at: string | null
          signup_enabled: boolean
          signup_message_description: string
          signup_message_footer: string
          signup_message_subtitle: string
          signup_message_title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          login_auto_enable_at?: string | null
          login_enabled?: boolean
          login_message_description?: string
          login_message_footer?: string
          login_message_subtitle?: string
          login_message_title?: string
          signup_auto_enable_at?: string | null
          signup_enabled?: boolean
          signup_message_description?: string
          signup_message_footer?: string
          signup_message_subtitle?: string
          signup_message_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          login_auto_enable_at?: string | null
          login_enabled?: boolean
          login_message_description?: string
          login_message_footer?: string
          login_message_subtitle?: string
          login_message_title?: string
          signup_auto_enable_at?: string | null
          signup_enabled?: boolean
          signup_message_description?: string
          signup_message_footer?: string
          signup_message_subtitle?: string
          signup_message_title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      page_access: {
        Row: {
          created_at: string
          page_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          page_key: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          page_key?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "page_access_page_key_fkey"
            columns: ["page_key"]
            isOneToOne: false
            referencedRelation: "app_pages"
            referencedColumns: ["key"]
          },
        ]
      }
      permission_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          target_page: string | null
          target_permission: string | null
          target_role: Database["public"]["Enums"]["app_role"] | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_page?: string | null
          target_permission?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          target_page?: string | null
          target_permission?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          permission?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_controls_can_bypass_student_gate: {
        Args: { _user_id: string }
        Returns: boolean
      }
      auth_controls_can_manage: { Args: { _user_id: string }; Returns: boolean }
      get_auth_access_controls: {
        Args: never
        Returns: {
          created_at: string
          id: number
          login_auto_enable_at: string | null
          login_enabled: boolean
          login_message_description: string
          login_message_footer: string
          login_message_subtitle: string
          login_message_title: string
          signup_auto_enable_at: string | null
          signup_enabled: boolean
          signup_message_description: string
          signup_message_footer: string
          signup_message_subtitle: string
          signup_message_title: string
          updated_at: string
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "auth_access_controls"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_page_access: {
        Args: { _page_key: string; _user_id: string }
        Returns: boolean
      }
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hook_before_user_created: { Args: { event: Json }; Returns: Json }
      hook_password_verification_attempt: {
        Args: { event: Json }
        Returns: Json
      }
      list_my_pages: {
        Args: never
        Returns: {
          page_key: string
        }[]
      }
      list_my_permissions: {
        Args: never
        Returns: {
          permission: string
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      update_auth_access_controls: {
        Args: { _payload: Json }
        Returns: {
          created_at: string
          id: number
          login_auto_enable_at: string | null
          login_enabled: boolean
          login_message_description: string
          login_message_footer: string
          login_message_subtitle: string
          login_message_title: string
          signup_auto_enable_at: string | null
          signup_enabled: boolean
          signup_message_description: string
          signup_message_footer: string
          signup_message_subtitle: string
          signup_message_title: string
          updated_at: string
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "auth_access_controls"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "student" | "user" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "student", "user", "super_admin"],
    },
  },
} as const
