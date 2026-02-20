/*
  # Fix Infinite Recursion in Profiles RLS Policies

  The SELECT and UPDATE policies on profiles were using
  EXISTS (SELECT 1 FROM profiles ...) which causes infinite
  recursion. Fix by using the SECURITY DEFINER is_admin()
  function which bypasses RLS.

  Also update is_admin() to use (select auth.uid()) pattern
  for performance.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid()) AND is_admin = true
  );
END;
$$;

DROP POLICY IF EXISTS "Users and admins can read profiles" ON profiles;
CREATE POLICY "Users and admins can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid())
    OR is_admin()
  );

DROP POLICY IF EXISTS "Users and admins can update profiles" ON profiles;
CREATE POLICY "Users and admins can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid())
    OR is_admin()
  )
  WITH CHECK (
    id = (select auth.uid())
    OR is_admin()
  );