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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          currency_pair: string
          expires_at: string
          id: string
          prediction_data: Json
          prediction_type: string | null
          time_horizon: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          currency_pair: string
          expires_at: string
          id?: string
          prediction_data: Json
          prediction_type?: string | null
          time_horizon?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          currency_pair?: string
          expires_at?: string
          id?: string
          prediction_data?: Json
          prediction_type?: string | null
          time_horizon?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversion_history: {
        Row: {
          amount: number | null
          created_at: string
          exchange_rate: number | null
          from_currency: string
          id: string
          result: number | null
          session_id: string | null
          to_currency: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          exchange_rate?: number | null
          from_currency: string
          id?: string
          result?: number | null
          session_id?: string | null
          to_currency: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          exchange_rate?: number | null
          from_currency?: string
          id?: string
          result?: number | null
          session_id?: string | null
          to_currency?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cost_of_living: {
        Row: {
          category: string | null
          city: string | null
          country_code: string
          id: string
          item_name: string
          local_currency: string | null
          local_price: number | null
          price_usd: number | null
          quality_rating: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          country_code: string
          id?: string
          item_name: string
          local_currency?: string | null
          local_price?: number | null
          price_usd?: number | null
          quality_rating?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          city?: string | null
          country_code?: string
          id?: string
          item_name?: string
          local_currency?: string | null
          local_price?: number | null
          price_usd?: number | null
          quality_rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      currency_insights: {
        Row: {
          actual_rate: number | null
          created_at: string
          currency_pair: string
          downvotes: number | null
          id: string
          location: string | null
          notes: string | null
          official_rate: number | null
          spread_percentage: number | null
          upvotes: number | null
          user_id: string
          venue_type: string | null
          verification_hash: string | null
          verified_by_blockchain: boolean | null
        }
        Insert: {
          actual_rate?: number | null
          created_at?: string
          currency_pair: string
          downvotes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          official_rate?: number | null
          spread_percentage?: number | null
          upvotes?: number | null
          user_id: string
          venue_type?: string | null
          verification_hash?: string | null
          verified_by_blockchain?: boolean | null
        }
        Update: {
          actual_rate?: number | null
          created_at?: string
          currency_pair?: string
          downvotes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          official_rate?: number | null
          spread_percentage?: number | null
          upvotes?: number | null
          user_id?: string
          venue_type?: string | null
          verification_hash?: string | null
          verified_by_blockchain?: boolean | null
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          notes: string | null
          purchase_date: string
          purchase_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_rate: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          purchase_date?: string
          purchase_rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          investment_experience: string | null
          location_country: string | null
          preferred_cities: string[] | null
          preferred_currencies: string[] | null
          updated_at: string
          user_id: string
          user_type: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          location_country?: string | null
          preferred_cities?: string[] | null
          preferred_currencies?: string[] | null
          updated_at?: string
          user_id: string
          user_type?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          investment_experience?: string | null
          location_country?: string | null
          preferred_cities?: string[] | null
          preferred_currencies?: string[] | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_watchlist: {
        Row: {
          alert_type: string | null
          created_at: string
          currency_pair: string
          id: string
          is_active: boolean | null
          target_rate: number | null
          user_id: string
        }
        Insert: {
          alert_type?: string | null
          created_at?: string
          currency_pair: string
          id?: string
          is_active?: boolean | null
          target_rate?: number | null
          user_id: string
        }
        Update: {
          alert_type?: string | null
          created_at?: string
          currency_pair?: string
          id?: string
          is_active?: boolean | null
          target_rate?: number | null
          user_id?: string
        }
        Relationships: []
      }
      what_if_scenarios: {
        Row: {
          created_at: string
          id: string
          results: Json | null
          scenario_data: Json
          scenario_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          results?: Json | null
          scenario_data: Json
          scenario_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          results?: Json | null
          scenario_data?: Json
          scenario_name?: string
          user_id?: string
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
    Enums: {},
  },
} as const
