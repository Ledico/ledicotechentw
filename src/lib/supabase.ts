import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ayqitipxqhbubhtjiewb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cWl0aXB4cWhidWJodGppZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDE2OTgsImV4cCI6MjA2NjI3NzY5OH0.0XVqzzFDFR_iAQHRMM46fbY_N8PhzpHGSUoYUt4KZlg';

// Check if we're in production and missing environment variables
const isProduction = import.meta.env.PROD;
const hasMissingEnvVars = !supabaseUrl.includes('ayqitipxqhbubhtjiewb') || !supabaseAnonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

if (isProduction && hasMissingEnvVars) {
  console.error('❌ Missing Supabase environment variables in production!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

if (!isProduction && hasMissingEnvVars) {
  console.warn('⚠️ Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Always use the correct values in production
const finalUrl = isProduction ? 'https://ayqitipxqhbubhtjiewb.supabase.co' : supabaseUrl;
const finalKey = isProduction ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cWl0aXB4cWhidWJodGppZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDE2OTgsImV4cCI6MjA2NjI3NzY5OH0.0XVqzzFDFR_iAQHRMM46fbY_N8PhzpHGSUoYUt4KZlg' : supabaseAnonKey;

export const supabase = createClient(finalUrl, finalKey);

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
  url: finalUrl,
  key: finalKey.substring(0, 20) + '...', // Only show first 20 chars for security
  hasValidConfig: true, // Always true now with fallbacks
  isProduction,
};

// Debug logging (only in development)
if (!isProduction) {
  console.log('🔧 Supabase Config:', {
    url: finalUrl,
    keyPreview: finalKey.substring(0, 20) + '...',
    isProduction,
  });
}