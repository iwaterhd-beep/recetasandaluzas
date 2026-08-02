export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relationships = [];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "user" | "admin";
          updated_at?: string;
        };
        Relationships: Relationships;
      };
      recipe_stats: {
        Row: {
          recipe_id: string;
          views: number;
          avg_rating: number;
          ratings_count: number;
          updated_at: string;
        };
        Insert: {
          recipe_id: string;
          views?: number;
          avg_rating?: number;
          ratings_count?: number;
          updated_at?: string;
        };
        Update: {
          views?: number;
          avg_rating?: number;
          ratings_count?: number;
          updated_at?: string;
        };
        Relationships: Relationships;
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          stars: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id: string;
          stars: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stars?: number;
          updated_at?: string;
        };
        Relationships: Relationships;
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string;
          body: string;
          hidden: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id: string;
          body: string;
          hidden?: boolean;
          created_at?: string;
        };
        Update: {
          body?: string;
          hidden?: boolean;
        };
        Relationships: Relationships;
      };
      favorites: {
        Row: {
          user_id: string;
          recipe_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          recipe_id: string;
          created_at?: string;
        };
        Update: {
          recipe_id?: string;
        };
        Relationships: Relationships;
      };
      recipe_events: {
        Row: {
          id: string;
          user_id: string | null;
          recipe_id: string;
          event_type: "view" | "cook_start" | "cook_complete";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          recipe_id: string;
          event_type: "view" | "cook_start" | "cook_complete";
          created_at?: string;
        };
        Update: {
          event_type?: "view" | "cook_start" | "cook_complete";
        };
        Relationships: Relationships;
      };
    };
    Views: Record<string, never>;
    Functions: {
      track_recipe_event: {
        Args: { p_recipe_id: string; p_event_type: string };
        Returns: undefined;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      admin_dashboard_metrics: {
        Args: Record<string, never>;
        Returns: {
          users: number;
          views: number;
          views_week: number;
          cook_starts: number;
          cook_completes: number;
          ratings: number;
          comments: number;
          comments_hidden: number;
          favorites: number;
        };
      };
      weekly_top_recipes: {
        Args: { p_limit?: number };
        Returns: { recipe_id: string; views: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
