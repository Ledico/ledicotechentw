/*
  # Sync User Deletion Between Auth and Profiles

  This migration ensures that when a user is deleted from either:
  1. The profiles table (via admin console or profile settings)
  2. The auth.users table (via Supabase dashboard)
  
  The deletion is synchronized across both tables to maintain data consistency.
*/

-- Function to delete user from both auth and profiles
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
  
  -- Prevent admin from deleting themselves if they're the only admin
  IF user_to_delete = current_user_id THEN
    DECLARE
      admin_count integer;
    BEGIN
      SELECT COUNT(*) INTO admin_count 
      FROM public.profiles 
      WHERE is_admin = true AND id != user_to_delete;
      
      IF admin_count = 0 THEN
        RAISE EXCEPTION 'Cannot delete the last administrator account';
      END IF;
    END;
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
    RAISE EXCEPTION 'Failed to completely delete account: %', SQLERRM;
END;
$$;

-- Update the existing delete_user function to use the new complete deletion
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the complete deletion function for current user
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

-- Create trigger to sync deletions from auth.users to profiles
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a user is deleted from auth.users, also delete from profiles
  DELETE FROM public.profiles WHERE id = OLD.id;
  RAISE NOTICE 'Synced deletion: removed profile for auth user %', OLD.id;
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth deletion
    RAISE WARNING 'Failed to sync profile deletion for user %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create the trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_deleted();

-- Create trigger to sync deletions from profiles to auth.users
CREATE OR REPLACE FUNCTION public.handle_profile_deleted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When a profile is deleted, also delete from auth.users
  -- But only if the deletion wasn't initiated by the complete deletion function
  -- (to avoid infinite recursion)
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = OLD.id
  ) THEN
    -- Auth user already deleted, no need to sync
    RAISE NOTICE 'Profile deleted but auth user already gone for %', OLD.id;
    RETURN OLD;
  END IF;
  
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = OLD.id;
  RAISE NOTICE 'Synced deletion: removed auth user for profile %', OLD.id;
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the profile deletion
    RAISE WARNING 'Failed to sync auth deletion for profile %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create the trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_profile_deleted ON public.profiles;
CREATE TRIGGER on_profile_deleted
  AFTER DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_deleted();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(uuid) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.delete_user_completely(uuid) IS 'Completely deletes a user from both auth.users and profiles tables. Admins can specify target_user_id, regular users can only delete themselves.';
COMMENT ON FUNCTION public.delete_user() IS 'Allows authenticated users to delete their own account completely';
COMMENT ON FUNCTION public.admin_delete_user(uuid) IS 'Allows administrators to delete other users accounts completely';
COMMENT ON FUNCTION public.handle_auth_user_deleted() IS 'Trigger function to sync profile deletion when auth user is deleted';
COMMENT ON FUNCTION public.handle_profile_deleted() IS 'Trigger function to sync auth user deletion when profile is deleted';

-- Test the sync status
SELECT simple_user_check();