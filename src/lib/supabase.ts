import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with explicit configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable to prevent URL parsing issues
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'portfolio-app'
    }
  },
  db: {
    schema: 'public'
  }
});

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  group_name?: string;
  created_at: string;
  updated_at: string;
};

export type AdminUserView = Profile;

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit: string;
  location?: string;
  status: 'verfügbar' | 'ausgeliehen' | 'wartung' | 'defekt';
  created_at: string;
  updated_at: string;
  created_by?: string;
};

export type Accessory = {
  id: string;
  name: string;
  category: string;
  description?: string;
  compatibility: string[];
  price?: number;
  supplier?: string;
  part_number?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  featured_image?: string;
  gallery_images: string[];
  category_id?: string;
  status: 'draft' | 'published';
  published_at?: string;
  view_count: number;
  order_index: number;
  meta_title?: string;
  meta_description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export type ProjectWithRelations = Project & {
  category?: ProjectCategory;
  tags?: ProjectTag[];
};

export type CareerTimelineEntry = {
  id: string;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  type: 'education' | 'work' | 'milestone';
  icon?: string | null;
  skills: string[];
  order_index: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

