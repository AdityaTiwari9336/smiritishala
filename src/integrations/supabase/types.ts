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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audios: {
        Row: {
          chapter_id: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          file_name: string | null
          id: string
          is_premium: boolean | null
          mime_type: string
          play_count: number | null
          size: number | null
          subject: string
          subject_id: string | null
          title: string
          topic: string
          topic_id: string | null
          uploaded_by: string | null
          url: string
          user_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_name?: string | null
          id?: string
          is_premium?: boolean | null
          mime_type: string
          play_count?: number | null
          size?: number | null
          subject: string
          subject_id?: string | null
          title: string
          topic: string
          topic_id?: string | null
          uploaded_by?: string | null
          url: string
          user_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_name?: string | null
          id?: string
          is_premium?: boolean | null
          mime_type?: string
          play_count?: number | null
          size?: number | null
          subject?: string
          subject_id?: string | null
          title?: string
          topic?: string
          topic_id?: string | null
          uploaded_by?: string | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audios_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audios_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audios_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          audio_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          audio_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          audio_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          created_at: string | null
          id: string
          name: string
          order_index: number | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          order_index?: number | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          audio_id: string | null
          downloaded_at: string | null
          file_size: number | null
          id: string
          user_id: string | null
        }
        Insert: {
          audio_id?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          user_id?: string | null
        }
        Update: {
          audio_id?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
            referencedColumns: ["id"]
          },
        ]
      }
      listening_history: {
        Row: {
          audio_id: string | null
          completed: boolean | null
          current_position: number | null
          id: string
          last_played: string | null
          total_listening_time: number | null
          user_id: string | null
        }
        Insert: {
          audio_id?: string | null
          completed?: boolean | null
          current_position?: number | null
          id?: string
          last_played?: string | null
          total_listening_time?: number | null
          user_id?: string | null
        }
        Update: {
          audio_id?: string | null
          completed?: boolean | null
          current_position?: number | null
          id?: string
          last_played?: string | null
          total_listening_time?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listening_history_audio_id_fkey"
            columns: ["audio_id"]
            isOneToOne: false
            referencedRelation: "audios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          last_listening_date: string | null
          listening_streak: number | null
          preferred_language: string | null
          total_audios_completed: number | null
          total_listening_time: number | null
          updated_at: string | null
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          last_listening_date?: string | null
          listening_streak?: number | null
          preferred_language?: string | null
          total_audios_completed?: number | null
          total_listening_time?: number | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          last_listening_date?: string | null
          listening_streak?: number | null
          preferred_language?: string | null
          total_audios_completed?: number | null
          total_listening_time?: number | null
          updated_at?: string | null
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          chapter_id: string | null
          created_at: string | null
          id: string
          name: string
          order_index: number | null
          subject_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          order_index?: number | null
          subject_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      health_check: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      increment_play_count: {
        Args: { audio_id: string }
        Returns: undefined
      }
      is_authenticated: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      table_exists: {
        Args: { table_name: string }
        Returns: boolean
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
