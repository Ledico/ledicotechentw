/*
  # Sync Auth Users with Profiles and Add Admin Functions

  1. Functions
    - sync_auth_users_to_profiles: Syncs existing auth users to profiles table
    - handle_new_user: Updated trigger function with better error handling
    - check_user_status: Debug function to check user status (fixed type issues)
    - make_user_admin: Function to promote users to admin
    - check_profile_sync_status: Function to check sync status

  2. Triggers
    - Recreate on_auth_user_created trigger with improved error handling

  3. Data Sync
    - Sync existing auth users to profiles table
    - Show current status for debugging
*/

-- First, let's check if there are users in auth.users but not in profiles
-- and create missing profiles

-- Function to sync auth users with profiles
CREATE OR REPLACE FUNCTION public.sync_auth_users_to_profiles()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert missing profiles for existing auth users
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  SELECT 
    au.id,
    au.email::text,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email::text),
    false -- Default to non-admin
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL
    AND au.email IS NOT NULL;
    
  -- Log the sync
  RAISE NOTICE 'Synced users from auth.users to profiles';
END;
$$;

-- Run the sync function
SELECT sync_auth_users_to_profiles();

-- Recreate the trigger to ensure it works properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    NEW.id, 
    NEW.email::text, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email::text),
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, just return
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to check user status (for debugging) - Fixed type issues
CREATE OR REPLACE FUNCTION public.check_user_status(user_email text DEFAULT NULL)
RETURNS TABLE(
  source text,
  user_id uuid,
  email text,
  has_profile boolean,
  is_admin boolean,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'auth.users'::text as source,
    au.id as user_id,
    au.email::text as email,  -- Cast to text to match return type
    (p.id IS NOT NULL) as has_profile,
    COALESCE(p.is_admin, false) as is_admin,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE (user_email IS NULL OR au.email::text = user_email)
  ORDER BY au.created_at DESC;
END;
$$;

-- Create a function to make a user admin (for initial setup)
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Update user to admin
  UPDATE public.profiles 
  SET is_admin = true, updated_at = now()
  WHERE email = user_email;
  
  -- Check if any rows were affected
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  IF affected_rows = 0 THEN
    RAISE EXCEPTION 'User with email % not found in profiles table', user_email;
  END IF;
  
  RETURN true;
END;
$$;

-- Create a function to check if profiles exist for all auth users
CREATE OR REPLACE FUNCTION public.check_profile_sync_status()
RETURNS TABLE(
  total_auth_users bigint,
  total_profiles bigint,
  missing_profiles bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    (SELECT COUNT(*) 
     FROM auth.users au 
     LEFT JOIN public.profiles p ON au.id = p.id 
     WHERE p.id IS NULL) as missing_profiles;
END;
$$;

-- Create a simple function to list all users (for debugging)
CREATE OR REPLACE FUNCTION public.list_all_users()
RETURNS TABLE(
  user_id uuid,
  email text,
  full_name text,
  is_admin boolean,
  has_auth_record boolean,
  profile_created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    p.is_admin,
    (au.id IS NOT NULL) as has_auth_record,
    p.created_at as profile_created_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY p.created_at DESC;
END;
$$;

-- Show sync status using a simple query instead of function calls to avoid display issues
DO $$
DECLARE
  auth_count bigint;
  profile_count bigint;
  missing_count bigint;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO missing_count 
  FROM auth.users au 
  LEFT JOIN public.profiles p ON au.id = p.id 
  WHERE p.id IS NULL;
  
  RAISE NOTICE 'Profile sync status:';
  RAISE NOTICE 'Total auth users: %', auth_count;
  RAISE NOTICE 'Total profiles: %', profile_count;
  RAISE NOTICE 'Missing profiles: %', missing_count;
END;
$$;