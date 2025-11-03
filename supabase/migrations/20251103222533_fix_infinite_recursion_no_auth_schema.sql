/*
  # Fix Infinite Recursion in Profiles RLS Policies

  1. Problem
    - Profiles policies check is_admin by querying profiles table
    - This creates infinite recursion: policy → profiles → policy → profiles...
    
  2. Solution
    - Create SECURITY DEFINER function in public schema
    - Use separate policies for users and admins
    - Avoid self-referencing in RLS policies
    
  3. Important
    - SECURITY DEFINER is necessary here to break recursion
    - Function runs with definer privileges, bypassing RLS
    - This is the correct pattern for this use case
*/

-- ============================================================================
-- 1. Drop Problematic Policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view OTP attempts" ON otp_attempts;

-- ============================================================================
-- 2. Create Helper Function (SECURITY DEFINER to Avoid Recursion)
-- ============================================================================

CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_is_admin() TO authenticated;

-- ============================================================================
-- 3. Create Non-Recursive Policies for Profiles
-- ============================================================================

-- Users can read own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (check_is_admin() = true);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (check_is_admin() = true)
  WITH CHECK (check_is_admin() = true);

-- ============================================================================
-- 4. Fix OTP Attempts Policies
-- ============================================================================

-- Users can view own OTP attempts
CREATE POLICY "Users can view own OTP attempts"
  ON otp_attempts FOR SELECT
  TO authenticated
  USING (email = (select auth.email()));

-- Admins can view all OTP attempts
CREATE POLICY "Admins can view all OTP attempts"
  ON otp_attempts FOR SELECT
  TO authenticated
  USING (check_is_admin() = true);

-- ============================================================================
-- 5. Update Existing Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION is_suisa_member_or_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  SELECT is_admin, group_name INTO user_profile
  FROM profiles
  WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  RETURN user_profile.is_admin = true 
    OR user_profile.group_name = 'suisa';
END;
$$;

GRANT EXECUTE ON FUNCTION is_suisa_member_or_admin() TO authenticated;
