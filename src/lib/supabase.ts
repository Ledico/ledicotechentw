import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to production values for debugging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ayqitipxqhbubhtjiewb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cWl0aXB4cWhidWJodGppZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDE2OTgsImV4cCI6MjA2NjI3NzY5OH0.0XVqzzFDFR_iAQHRMM46fbY_N8PhzpHGSUoYUt4KZlg';

console.log('🔧 Supabase Configuration Debug:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyStart: supabaseAnonKey.substring(0, 10),
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  hasEnvUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasEnvKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

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

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  keyPreview: supabaseAnonKey.substring(0, 20) + '...',
  hasValidConfig: !!(supabaseUrl && supabaseAnonKey),
  isProduction: import.meta.env.PROD,
  environment: import.meta.env.MODE,
  usingEnvVars: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
};