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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          messages: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          acted_on: boolean
          content: Json
          created_at: string
          dismissed: boolean
          id: string
          suggestion_type: string
          user_id: string
        }
        Insert: {
          acted_on?: boolean
          content?: Json
          created_at?: string
          dismissed?: boolean
          id?: string
          suggestion_type: string
          user_id: string
        }
        Update: {
          acted_on?: boolean
          content?: Json
          created_at?: string
          dismissed?: boolean
          id?: string
          suggestion_type?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_engagement: {
        Row: {
          blog_id: string
          comment_text: string | null
          created_at: string
          engagement_type: string
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          comment_text?: string | null
          created_at?: string
          engagement_type: string
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          comment_text?: string | null
          created_at?: string
          engagement_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_engagement_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "weekly_blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          translations: Json | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          translations?: Json | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          translations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          intro_data: Json | null
          post_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          intro_data?: Json | null
          post_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          intro_data?: Json | null
          post_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      course_prerequisites: {
        Row: {
          course_id: string
          created_at: string
          id: string
          prerequisite_course_id: string
          prerequisite_group: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          prerequisite_course_id: string
          prerequisite_group?: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          prerequisite_course_id?: string
          prerequisite_group?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_prerequisites_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_prerequisites_prerequisite_course_id_fkey"
            columns: ["prerequisite_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_waitlist: {
        Row: {
          course_interest: string
          created_at: string
          email: string
          full_name: string
          id: string
        }
        Insert: {
          course_interest?: string
          created_at?: string
          email: string
          full_name: string
          id?: string
        }
        Update: {
          course_interest?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          title: string
          translations: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          title: string
          translations?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          title?: string
          translations?: Json | null
        }
        Relationships: []
      }
      points_redemptions: {
        Row: {
          created_at: string
          id: string
          points_spent: number
          reward_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_spent: number
          reward_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_spent?: number
          reward_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          has_completed_intro: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          has_completed_intro?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          has_completed_intro?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id: string
          score?: number
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer_index: number
          created_at: string
          explanation: string | null
          id: string
          options: Json
          order_index: number
          question_text: string
          quiz_id: string
          scenario_context: string | null
        }
        Insert: {
          correct_answer_index: number
          created_at?: string
          explanation?: string | null
          id?: string
          options: Json
          order_index?: number
          question_text: string
          quiz_id: string
          scenario_context?: string | null
        }
        Update: {
          correct_answer_index?: number
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json
          order_index?: number
          question_text?: string
          quiz_id?: string
          scenario_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          passing_score: number
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          video_id: string | null
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          passing_score?: number
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          video_id?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          passing_score?: number
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          program_type: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          program_type: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          program_type?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_tracking: {
        Row: {
          created_at: string
          id: string
          referral_code_id: string
          referred_email: string | null
          referred_user_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          referral_code_id: string
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          referral_code_id?: string
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_tracking_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards_catalog: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          points_cost: number
          reward_type: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          points_cost: number
          reward_type: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          points_cost?: number
          reward_type?: string
          title?: string
        }
        Relationships: []
      }
      scrum_simulations: {
        Row: {
          completed_at: string | null
          created_at: string
          current_day: number
          id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          id?: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_day?: number
          id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      simulation_messages: {
        Row: {
          ceremony: string | null
          content: string
          created_at: string
          day: number
          id: string
          role: string
          simulation_id: string
          speaker: string | null
        }
        Insert: {
          ceremony?: string | null
          content: string
          created_at?: string
          day: number
          id?: string
          role: string
          simulation_id: string
          speaker?: string | null
        }
        Update: {
          ceremony?: string | null
          content?: string
          created_at?: string
          day?: number
          id?: string
          role?: string
          simulation_id?: string
          speaker?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_messages_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "scrum_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulation_scores: {
        Row: {
          artifact_score: number
          communication_score: number
          created_at: string
          day: number
          decision_score: number
          facilitation_score: number
          feedback: string | null
          id: string
          simulation_id: string
          total_score: number
        }
        Insert: {
          artifact_score?: number
          communication_score?: number
          created_at?: string
          day: number
          decision_score?: number
          facilitation_score?: number
          feedback?: string | null
          id?: string
          simulation_id: string
          total_score?: number
        }
        Update: {
          artifact_score?: number
          communication_score?: number
          created_at?: string
          day?: number
          decision_score?: number
          facilitation_score?: number
          feedback?: string | null
          id?: string
          simulation_id?: string
          total_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "simulation_scores_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "scrum_simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      student_analytics: {
        Row: {
          course_id: string | null
          created_at: string
          duration_seconds: number | null
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_analytics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_labs: {
        Row: {
          ai_assessment: Json | null
          chapter_id: string
          completed: boolean
          course_id: string
          created_at: string
          difficulty_level: string
          id: string
          lab_content: Json
          score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_assessment?: Json | null
          chapter_id: string
          completed?: boolean
          course_id: string
          created_at?: string
          difficulty_level?: string
          id?: string
          lab_content?: Json
          score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_assessment?: Json | null
          chapter_id?: string
          completed?: boolean
          course_id?: string
          created_at?: string
          difficulty_level?: string
          id?: string
          lab_content?: Json
          score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_labs_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_labs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_learning_profiles: {
        Row: {
          avg_time_per_lesson: number
          consecutive_failures: number
          course_id: string | null
          created_at: string
          engagement_score: number
          id: string
          lab_completion_rate: number
          last_review_at: string | null
          last_struggle_topic: string | null
          learning_style: string
          needs_intervention: boolean
          preferred_difficulty: string
          quiz_accuracy_trend: Json
          review_queue: Json
          strong_areas: Json
          struggle_events: Json
          total_questions_asked: number
          updated_at: string
          user_id: string
          video_rewatch_count: number
          weak_areas: Json
        }
        Insert: {
          avg_time_per_lesson?: number
          consecutive_failures?: number
          course_id?: string | null
          created_at?: string
          engagement_score?: number
          id?: string
          lab_completion_rate?: number
          last_review_at?: string | null
          last_struggle_topic?: string | null
          learning_style?: string
          needs_intervention?: boolean
          preferred_difficulty?: string
          quiz_accuracy_trend?: Json
          review_queue?: Json
          strong_areas?: Json
          struggle_events?: Json
          total_questions_asked?: number
          updated_at?: string
          user_id: string
          video_rewatch_count?: number
          weak_areas?: Json
        }
        Update: {
          avg_time_per_lesson?: number
          consecutive_failures?: number
          course_id?: string | null
          created_at?: string
          engagement_score?: number
          id?: string
          lab_completion_rate?: number
          last_review_at?: string | null
          last_struggle_topic?: string | null
          learning_style?: string
          needs_intervention?: boolean
          preferred_difficulty?: string
          quiz_accuracy_trend?: Json
          review_queue?: Json
          strong_areas?: Json
          struggle_events?: Json
          total_questions_asked?: number
          updated_at?: string
          user_id?: string
          video_rewatch_count?: number
          weak_areas?: Json
        }
        Relationships: [
          {
            foreignKeyName: "student_learning_profiles_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_points: {
        Row: {
          created_at: string
          id: string
          points: number
          reason: string
          reference_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          reason: string
          reference_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reason?: string
          reference_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          chapter_id: string | null
          completed_at: string
          course_id: string
          id: string
          quiz_id: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          completed_at?: string
          course_id: string
          id?: string
          quiz_id?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          completed_at?: string
          course_id?: string
          id?: string
          quiz_id?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          order_index: number
          title: string
          translations: Json | null
          video_url: string | null
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          order_index?: number
          title: string
          translations?: Json | null
          video_url?: string | null
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          order_index?: number
          title?: string
          translations?: Json | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_blogs: {
        Row: {
          content: string
          created_at: string
          id: string
          published: boolean
          summary: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          published?: boolean
          summary?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          summary?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      quiz_questions_public: {
        Row: {
          created_at: string | null
          explanation: string | null
          id: string | null
          options: Json | null
          order_index: number | null
          question_text: string | null
          quiz_id: string | null
          scenario_context: string | null
        }
        Insert: {
          created_at?: string | null
          explanation?: string | null
          id?: string | null
          options?: Json | null
          order_index?: number | null
          question_text?: string | null
          quiz_id?: string | null
          scenario_context?: string | null
        }
        Update: {
          created_at?: string | null
          explanation?: string | null
          id?: string | null
          options?: Json | null
          order_index?: number | null
          question_text?: string | null
          quiz_id?: string | null
          scenario_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_video: {
        Args: { p_user_id: string; p_video_id: string }
        Returns: boolean
      }
      generate_referral_code: { Args: never; Returns: string }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
      is_owner_profile: { Args: { profile_user_id: string }; Returns: boolean }
      user_passed_quiz: {
        Args: { p_quiz_id: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      quiz_type: "mini_video" | "chapter_end"
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
      app_role: ["admin", "moderator", "user"],
      quiz_type: ["mini_video", "chapter_end"],
    },
  },
} as const
