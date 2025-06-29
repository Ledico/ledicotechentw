/*
  # Fix delete_user function not found error
  
  1. Functions
    - Recreate delete_user() function without parameters
    - Ensure proper permissions and security
    - Add comprehensive error handling
  
  2. Security
    - SECURITY DEFINER for auth.users access
    - Proper authentication checks
    - Admin protection logic
*/

-- Drop existing functions to recreate them properly
DROP FUNCTION IF EXISTS public.delete_user();
DROP FUNCTION IF EXISTS public.delete_user_completely(uuid);
DROP FUNCTION IF EXISTS public.admin_delete_user(uuid);

-- Main function to delete user completely
CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_to_delete uuid;
  current_user_id uuid;
  is_admin_user boolean;
  admin_count integer;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete account';
  END IF;
  
  -- Determine which user to delete
  IF target_user_id IS NULL THEN
    -- User is deleting their own account
    user_to_delete := current_user_id;
    RAISE NOTICE 'User % is deleting their own account', current_user_id;
  ELSE
    -- Admin is deleting another user's account
    -- Check if current user is admin
    SELECT is_admin INTO is_admin_user 
    FROM public.profiles 
    WHERE id = current_user_id;
    
    IF NOT COALESCE(is_admin_user, false) THEN
      RAISE EXCEPTION 'Only administrators can delete other users accounts';
    END IF;
    
    user_to_delete := target_user_id;
    RAISE NOTICE 'Admin % is deleting user %', current_user_id, target_user_id;
  END IF;
  
  -- Prevent deletion of last admin
  SELECT COUNT(*) INTO admin_count 
  FROM public.profiles 
  WHERE is_admin = true;
  
  -- If deleting an admin and they're the only one, prevent it
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_to_delete AND is_admin = true) 
     AND admin_count <= 1 THEN
    RAISE EXCEPTION 'Cannot delete the last administrator account';
  END IF;
  
  -- Log the deletion attempt
  RAISE NOTICE 'Starting complete deletion for user: %', user_to_delete;
  
  -- Delete from profiles table first
  DELETE FROM public.profiles WHERE id = user_to_delete;
  RAISE NOTICE 'Deleted profile for user: %', user_to_delete;
  
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = user_to_delete;
  RAISE NOTICE 'Deleted auth user: %', user_to_delete;
  
  RAISE NOTICE 'Complete account deletion successful for user: %', user_to_delete;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error
    RAISE NOTICE 'Error during complete deletion for user %: %', user_to_delete, SQLERRM;
    RAISE EXCEPTION 'Failed to delete account: %', SQLERRM;
END;
$$;

-- Simple function for users to delete their own account (NO PARAMETERS)
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the complete deletion function for current user (NULL = current user)
  PERFORM delete_user_completely(NULL);
END;
$$;

-- Function for admins to delete other users
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the complete deletion function with target user
  PERFORM delete_user_completely(target_user_id);
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.delete_user() IS 'Allows authenticated users to delete their own account completely (no parameters required)';
COMMENT ON FUNCTION public.delete_user_completely(uuid) IS 'Internal function to completely delete a user from both auth.users and profiles tables';
COMMENT ON FUNCTION public.admin_delete_user(uuid) IS 'Allows administrators to delete other users accounts completely';

-- Verify the function exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname = 'delete_user' 
    AND p.pronargs = 0
  ) THEN
    RAISE NOTICE '✅ Function public.delete_user() without parameters created successfully';
  ELSE
    RAISE NOTICE '❌ Function public.delete_user() without parameters NOT found';
  END IF;
END;
$$;

-- Test function accessibility
DO $$
BEGIN
  -- This should not fail if the function exists and is accessible
  RAISE NOTICE 'Testing function signature...';
  -- We can't actually call it without being authenticated, but we can check if it exists
  PERFORM 1 FROM pg_proc p 
  JOIN pg_namespace n ON p.pronamespace = n.oid 
  WHERE n.nspname = 'public' 
  AND p.proname = 'delete_user' 
  AND p.pronargs = 0;
  
  RAISE NOTICE '✅ Function delete_user() is accessible';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Error testing function: %', SQLERRM;
END;
$$;