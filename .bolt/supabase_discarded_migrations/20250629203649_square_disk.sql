/*
  # User Profile Sync and Management Functions

  1. Functions
    - `sync_auth_users_to_profiles()` - Sync existing auth users to profiles
    - `handle_new_user()` - Trigger function for new user creation
    - `check_user_status()` - Debug function to check user status
    - `make_user_admin()` - Function to promote users to admin
    - `check_profile_sync_status()` - Check sync status between auth and profiles

  2. Triggers
    - Recreate the user creation trigger with proper error handling

  3. Data Sync
    - Sync any existing auth users to profiles table
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
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email),
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
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
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

-- Create a function to check user status (for debugging) - FIXED TYPE ISSUE
CREATE OR REPLACE FUNCTION public.check_user_status(user_email text DEFAULT NULL)
RETURNS TABLE(
  source text,
  user_id uuid,
  email character varying(255), -- Fixed: Use actual column type
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
    au.email, -- This is character varying(255)
    (p.id IS NOT NULL) as has_profile,
    COALESCE(p.is_admin, false) as is_admin,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE (user_email IS NULL OR au.email = user_email)
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

-- Alternative simpler check function that avoids type issues
CREATE OR REPLACE FUNCTION public.simple_user_check()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  auth_count integer;
  profile_count integer;
  missing_count integer;
BEGIN
  -- Get counts
  SELECT COUNT(*) INTO auth_count FROM auth.users;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO missing_count 
  FROM auth.users au 
  LEFT JOIN public.profiles p ON au.id = p.id 
  WHERE p.id IS NULL;
  
  -- Log results
  RAISE NOTICE 'Auth users: %, Profiles: %, Missing profiles: %', 
    auth_count, profile_count, missing_count;
END;
$$;

-- Run the simple check
SELECT simple_user_check();

-- Show basic profile information without type conflicts
DO $$
DECLARE
  rec RECORD;
BEGIN
  RAISE NOTICE 'Current profiles in database:';
  FOR rec IN 
    SELECT email, is_admin, created_at 
    FROM public.profiles 
    ORDER BY created_at DESC 
    LIMIT 10
  LOOP
    RAISE NOTICE 'Email: %, Admin: %, Created: %', rec.email, rec.is_admin, rec.created_at;
  END LOOP;
END;
$$;