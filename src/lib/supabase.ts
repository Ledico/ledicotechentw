import { createClient } from '@supabase/supabase-js';

// Production Supabase configuration - these are the correct values
const PRODUCTION_SUPABASE_URL = 'https://ayqitipxqhbubhtjiewb.supabase.co';
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cWl0aXB4cWhidWJodGppZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDE2OTgsImV4cCI6MjA2NjI3NzY5OH0.0XVqzzFDFR_iAQHRMM46fbY_N8PhzpHGSUoYUt4KZlg';

// Always use production values for now to ensure connection works
const supabaseUrl = PRODUCTION_SUPABASE_URL;
const supabaseAnonKey = PRODUCTION_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Configuration Debug:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyStart: supabaseAnonKey.substring(0, 10),
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
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

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  keyPreview: supabaseAnonKey.substring(0, 20) + '...',
  hasValidConfig: true, // Always true since we're using hardcoded values
  isProduction: import.meta.env.PROD,
  environment: import.meta.env.MODE
};

// Immediate connection test
console.log('🔄 Testing Supabase connection...');

// Test the connection immediately
const testConnection = async () => {
  try {
    console.log('🔄 Starting connection test...');
    
    // Simple health check
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('📊 Profiles count:', data);
    }
  } catch (error) {
    console.error('❌ Connection test error:', error);
  }
};

// Run test immediately
testConnection();

// Also test auth
const testAuth = async () => {
  try {
    console.log('🔄 Testing auth connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth test failed:', error);
    } else {
      console.log('✅ Auth connection successful');
      console.log('👤 Current session:', data.session ? 'Active' : 'None');
    }
  } catch (error) {
    console.error('❌ Auth test error:', error);
  }
};

testAuth();