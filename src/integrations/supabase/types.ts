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
      book_purchases: {
        Row: {
          access_granted: boolean | null
          amount: number
          book_id: string
          buyer_id: string
          id: string
          purchased_at: string | null
          seller_id: string
        }
        Insert: {
          access_granted?: boolean | null
          amount: number
          book_id: string
          buyer_id: string
          id?: string
          purchased_at?: string | null
          seller_id: string
        }
        Update: {
          access_granted?: boolean | null
          amount?: number
          book_id?: string
          buyer_id?: string
          id?: string
          purchased_at?: string | null
          seller_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_purchases_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books_marketplace"
            referencedColumns: ["id"]
          },
        ]
      }
      books_marketplace: {
        Row: {
          book_type: string
          course: string
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          pages: number | null
          price: number
          status: string | null
          subject: string
          title: string
          user_id: string
          website_link: string | null
        }
        Insert: {
          book_type: string
          course: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          pages?: number | null
          price: number
          status?: string | null
          subject: string
          title: string
          user_id: string
          website_link?: string | null
        }
        Update: {
          book_type?: string
          course?: string
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          pages?: number | null
          price?: number
          status?: string | null
          subject?: string
          title?: string
          user_id?: string
          website_link?: string | null
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number
          id: string
          notes: string | null
          participant_id: string
          partner_id: string | null
          session_type: string
          skill_name: string
          trust_earned: number | null
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          participant_id: string
          partner_id?: string | null
          session_type: string
          skill_name: string
          trust_earned?: number | null
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          participant_id?: string
          partner_id?: string | null
          session_type?: string
          skill_name?: string
          trust_earned?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exchange_sessions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_sessions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_tracker: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          id: string
          notes: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      feature_usage: {
        Row: {
          feature_name: string
          id: string
          last_used_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          feature_name: string
          id?: string
          last_used_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          feature_name?: string
          id?: string
          last_used_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      features: {
        Row: {
          created_at: string | null
          description: string
          feature_name: string
          feature_type: string
          gradient_end: string
          gradient_start: string
          icon_name: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string | null
          description: string
          feature_name: string
          feature_type: string
          gradient_end: string
          gradient_start: string
          icon_name: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string
          feature_name?: string
          feature_type?: string
          gradient_end?: string
          gradient_start?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          likes_count: number | null
          replies_count: number | null
          support_tag: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          support_tag?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          support_tag?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          availability: string | null
          category: string
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          listing_type: string
          location: string | null
          skill_level: string | null
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          availability?: string | null
          category: string
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          listing_type: string
          location?: string | null
          skill_level?: string | null
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          availability?: string | null
          category?: string
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          listing_type?: string
          location?: string | null
          skill_level?: string | null
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_challenges: {
        Row: {
          accepted_by: string | null
          completed_at: string | null
          created_at: string | null
          creator_id: string
          description: string
          difficulty: string | null
          expires_at: string | null
          id: string
          skill_required: string
          status: string | null
          time_limit_minutes: number
          title: string
          xp_reward: number | null
        }
        Insert: {
          accepted_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          creator_id: string
          description: string
          difficulty?: string | null
          expires_at?: string | null
          id?: string
          skill_required: string
          status?: string | null
          time_limit_minutes: number
          title: string
          xp_reward?: number | null
        }
        Update: {
          accepted_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string
          difficulty?: string | null
          expires_at?: string | null
          id?: string
          skill_required?: string
          status?: string | null
          time_limit_minutes?: number
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "micro_challenges_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "micro_challenges_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mindfulness_sessions: {
        Row: {
          completed_at: string | null
          duration_minutes: number | null
          id: string
          session_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          session_type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          duration_minutes?: number | null
          id?: string
          session_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mindfulness_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string | null
          id: string
          mood_emoji: string | null
          mood_level: number
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mood_emoji?: string | null
          mood_level: number
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mood_emoji?: string | null
          mood_level?: number
          note?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          level: number | null
          updated_at: string | null
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          level?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          level?: number | null
          updated_at?: string | null
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      skill_vouches: {
        Row: {
          comment: string | null
          created_at: string | null
          decays_at: string | null
          id: string
          skill_id: string
          vouch_strength: number | null
          vouched_user_id: string
          voucher_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          decays_at?: string | null
          id?: string
          skill_id: string
          vouch_strength?: number | null
          vouched_user_id: string
          voucher_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          decays_at?: string | null
          id?: string
          skill_id?: string
          vouch_strength?: number | null
          vouched_user_id?: string
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_vouches_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_vouches_vouched_user_id_fkey"
            columns: ["vouched_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_vouches_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_description: string
          activity_type: string
          created_at: string | null
          id: string
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          activity_description: string
          activity_type: string
          created_at?: string | null
          id?: string
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          activity_description?: string
          activity_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_features: {
        Row: {
          created_at: string | null
          feature_id: string
          id: string
          is_favorite: boolean | null
          last_accessed: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          feature_id: string
          id?: string
          is_favorite?: boolean | null
          last_accessed?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          feature_id?: string
          id?: string
          is_favorite?: boolean | null
          last_accessed?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          liquidity_score: number | null
          proficiency_rating: number | null
          skill_level: string | null
          skill_name: string
          skill_type: string
          trust_points: number | null
          user_id: string
          vouches_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          liquidity_score?: number | null
          proficiency_rating?: number | null
          skill_level?: string | null
          skill_name: string
          skill_type: string
          trust_points?: number | null
          user_id: string
          vouches_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          liquidity_score?: number | null
          proficiency_rating?: number | null
          skill_level?: string | null
          skill_name?: string
          skill_type?: string
          trust_points?: number | null
          user_id?: string
          vouches_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
