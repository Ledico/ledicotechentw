/*
  # Add user deletion function

  1. New Functions
    - `delete_user()` - Safely deletes the current user's account
    - Removes profile data and auth user
    
  2. Security
    - Function runs with SECURITY DEFINER to access auth schema
    - Only allows users to delete their own account
    - Proper error handling and logging
*/

-- Function to delete the current user's account
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to delete account';
  END IF;
  
  -- Log the deletion attempt
  RAISE NOTICE 'Deleting account for user: %', current_user_id;
  
  -- Delete from profiles table first (this should cascade properly)
  DELETE FROM public.profiles WHERE id = current_user_id;
  
  -- Delete from auth.users (this requires SECURITY DEFINER)
  DELETE FROM auth.users WHERE id = current_user_id;
  
  -- Log successful deletion
  RAISE NOTICE 'Account deleted successfully for user: %', current_user_id;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't expose internal details
    RAISE NOTICE 'Error deleting account for user %: %', current_user_id, SQLERRM;
    RAISE EXCEPTION 'Failed to delete account. Please contact support.';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.delete_user() IS 'Allows authenticated users to delete their own account and all associated data';