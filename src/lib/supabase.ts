import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if we're in production and missing environment variables
const isProduction = import.meta.env.PROD;
const hasMissingEnvVars = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

if (isProduction && hasMissingEnvVars) {
  console.error('❌ Missing Supabase environment variables in production!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

if (!isProduction && hasMissingEnvVars) {
  console.warn('⚠️ Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

// Remove AdminUserView type since we're using Profile directly
export type AdminUserView = Profile;

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  hasValidConfig: !hasMissingEnvVars,
  isProduction,
};