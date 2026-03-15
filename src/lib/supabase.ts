import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  featured_image?: string;
  category_id?: string;
  status: string;
  order_index: number;
  meta_title?: string;
  meta_description?: string;
  slug_enabled?: boolean;
  created_by?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface ProjectTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ProjectWithRelations extends Project {
  category?: ProjectCategory;
  tags?: ProjectTag[];
  category_name?: string;
}
