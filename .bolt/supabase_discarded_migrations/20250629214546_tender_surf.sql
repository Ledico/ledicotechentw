/*
  # Fix admin_delete_user function parameter issue

  1. Fix function parameter naming
  2. Ensure proper function signatures
  3. Test function accessibility
*/

-- Drop existing functions to recreate them with correct signatures
DROP FUNCTION IF EXISTS public.admin_delete_user(uuid);
DROP FUNCTION IF EXISTS public.delete_user_completely(uuid);

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

-- Function for admins to delete other users - FIXED PARAMETER NAME
CREATE OR REPLACE FUNCTION public.admin_delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the complete deletion function with the user_id parameter
  PERFORM delete_user_completely(user_id);
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.delete_user_completely(uuid) IS 'Internal function to completely delete a user from both auth.users and profiles tables';
COMMENT ON FUNCTION public.admin_delete_user(uuid) IS 'Allows administrators to delete other users accounts completely - parameter: user_id';

-- Verify the functions exist with correct signatures
DO $$
BEGIN
  -- Check admin_delete_user function
  IF EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname = 'admin_delete_user' 
    AND p.pronargs = 1
  ) THEN
    RAISE NOTICE '✅ Function public.admin_delete_user(uuid) created successfully';
  ELSE
    RAISE NOTICE '❌ Function public.admin_delete_user(uuid) NOT found';
  END IF;
  
  -- Check delete_user_completely function
  IF EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' 
    AND p.proname = 'delete_user_completely' 
    AND p.pronargs = 1
  ) THEN
    RAISE NOTICE '✅ Function public.delete_user_completely(uuid) created successfully';
  ELSE
    RAISE NOTICE '❌ Function public.delete_user_completely(uuid) NOT found';
  END IF;
END;
$$;

-- Show function signatures for verification
SELECT 
  p.proname as function_name,
  p.pronargs as num_args,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as return_type
FROM pg_proc p 
JOIN pg_namespace n ON p.pronamespace = n.oid 
WHERE n.nspname = 'public' 
AND p.proname IN ('delete_user', 'admin_delete_user', 'delete_user_completely')
ORDER BY p.proname, p.pronargs;