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
      complaints: {
        Row: {
          action_taken: string | null
          client_name: string | null
          complaint: string | null
          complaint_date: string | null
          created_at: string | null
          created_by: string | null
          duration: string | null
          id: number
          project: string | null
          source: string | null
          status: string | null
          ticket_number: string | null
          unit_number: string | null
        }
        Insert: {
          action_taken?: string | null
          client_name?: string | null
          complaint?: string | null
          complaint_date?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: string | null
          id?: number
          project?: string | null
          source?: string | null
          status?: string | null
          ticket_number?: string | null
          unit_number?: string | null
        }
        Update: {
          action_taken?: string | null
          client_name?: string | null
          complaint?: string | null
          complaint_date?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: string | null
          id?: number
          project?: string | null
          source?: string | null
          status?: string | null
          ticket_number?: string | null
          unit_number?: string | null
        }
        Relationships: []
      }
      customer_service_metrics: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          id: number
          metric_name: string | null
          period: string
          value: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          metric_name?: string | null
          period: string
          value?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          metric_name?: string | null
          period?: string
          value?: number | null
        }
        Relationships: []
      }
      maintenance_satisfaction: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          notes: string | null
          percentage: number | null
          period: string
          rating: string | null
          satisfaction_metric: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          notes?: string | null
          percentage?: number | null
          period: string
          rating?: string | null
          satisfaction_metric?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          notes?: string | null
          percentage?: number | null
          period?: string
          rating?: string | null
          satisfaction_metric?: string | null
        }
        Relationships: []
      }
      metrics: {
        Row: {
          _period: string
          change: number
          created_at: string | null
          id: number
          islowerbetter: boolean
          ispositive: boolean
          reachedtarget: boolean
          target: string
          title: string
          value: string
        }
        Insert: {
          _period: string
          change: number
          created_at?: string | null
          id?: number
          islowerbetter: boolean
          ispositive: boolean
          reachedtarget: boolean
          target: string
          title: string
          value: string
        }
        Update: {
          _period?: string
          change?: number
          created_at?: string | null
          id?: number
          islowerbetter?: boolean
          ispositive?: boolean
          reachedtarget?: boolean
          target?: string
          title?: string
          value?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          complaint_id: number | null
          id: number
          message: string | null
          sent_at: string | null
          sent_to: string | null
        }
        Insert: {
          complaint_id?: number | null
          id?: number
          message?: string | null
          sent_at?: string | null
          sent_to?: string | null
        }
        Update: {
          complaint_id?: number | null
          id?: number
          message?: string | null
          sent_at?: string | null
          sent_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      nps_metrics: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          metric_name: string
          period: string
          target: number | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          metric_name: string
          period: string
          target?: number | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          metric_name?: string
          period?: string
          target?: number | null
          value?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          password: string | null
          role: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          password?: string | null
          role?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          password?: string | null
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
