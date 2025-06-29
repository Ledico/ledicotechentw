import { createClient } from '@supabase/supabase-js';

// Production Supabase configuration
const PRODUCTION_SUPABASE_URL = 'https://ayqitipxqhbubhtjiewb.supabase.co';
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cWl0aXB4cWhidWJodGppZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDE2OTgsImV4cCI6MjA2NjI3NzY5OH0.0XVqzzFDFR_iAQHRMM46fbY_N8PhzpHGSUoYUt4KZlg';

// Check if we're in production
const isProduction = import.meta.env.PROD;

// Use environment variables if available, otherwise use production values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PRODUCTION_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || PRODUCTION_SUPABASE_ANON_KEY;

// Validate configuration
const hasValidUrl = supabaseUrl && supabaseUrl.includes('supabase.co');
const hasValidKey = supabaseAnonKey && supabaseAnonKey.startsWith('eyJ');

if (!hasValidUrl || !hasValidKey) {
  console.error('❌ Invalid Supabase configuration detected!');
  console.error('URL valid:', hasValidUrl);
  console.error('Key valid:', hasValidKey);
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminUserView = Profile;

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  keyPreview: supabaseAnonKey.substring(0, 20) + '...',
  hasValidConfig: hasValidUrl && hasValidKey,
  isProduction,
  environment: isProduction ? 'production' : 'development'
};

// Debug logging
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl,
  keyPreview: supabaseAnonKey.substring(0, 20) + '...',
  isProduction,
  hasValidConfig: hasValidUrl && hasValidKey,
  environment: isProduction ? 'production' : 'development'
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message);
  } else {
    console.log('✅ Supabase connection successful');
  }
}).catch((error) => {
  console.error('❌ Supabase connection error:', error);
});