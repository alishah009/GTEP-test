export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string | null;
          role: "customer" | "manager" | "admin";
          created_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "customer" | "manager" | "admin";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "customer" | "manager" | "admin";
          created_at?: string | null;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_at?: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          video_url: string;
          order: number;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          video_url: string;
          order: number;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          video_url?: string;
          order?: number;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          completed_at?: string | null;
        };
      };
    };
    // Views: {};
    // Functions: {};
    // Enums: {};
    // CompositeTypes: {};
  };
}
