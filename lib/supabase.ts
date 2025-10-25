import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: string;
  folder_id: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  last_edited_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  document_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  auto_save: boolean;
  auto_complete_enabled: boolean;
  api_key_encrypted: string | null;
  use_company_key: boolean;
  editor_font_size: number;
  editor_line_height: number;
  show_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  user_id: string;
  content: string;
  version_number: number;
  created_at: string;
}
