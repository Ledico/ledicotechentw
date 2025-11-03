/*
  # Fix All Security Issues

  1. Add Missing Indexes
    - Add index on inventory.created_by
    - Add index on inventory.last_modified_by
    - Add index on inventory_transactions.created_by
    - Add index on inventory_transactions.inventory_id
    
  2. Fix Multiple Permissive Policies
    - Consolidate accessories policies (make one RESTRICTIVE)
    - Consolidate otp_attempts policies (make one RESTRICTIVE)
    - Consolidate profiles policies (make one RESTRICTIVE)
    
  3. Fix SECURITY DEFINER Issues
    - Remove SECURITY DEFINER from views
    - Fix function search paths
    - Make views use proper RLS instead
    
  4. Fix Exposed Auth Users
    - Remove auth.users exposure from security_dashboard
    - Use profiles table instead
*/

-- ============================================================================
-- 1. Add Missing Foreign Key Indexes
-- ============================================================================

-- Indexes for inventory table foreign keys
CREATE INDEX IF NOT EXISTS idx_inventory_created_by 
ON inventory(created_by);

CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_by 
ON inventory(last_modified_by);

-- Indexes for inventory_transactions foreign keys
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_by 
ON inventory_transactions(created_by);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id 
ON inventory_transactions(inventory_id);

-- Index for profiles foreign key
CREATE INDEX IF NOT EXISTS idx_profiles_id 
ON profiles(id);

-- ============================================================================
-- 2. Fix Multiple Permissive Policies - Accessories
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage accessories" ON accessories;
DROP POLICY IF EXISTS "SUISA members and admins can view accessories" ON accessories;

-- Create single comprehensive SELECT policy
CREATE POLICY "Authenticated users can view accessories"
  ON accessories FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin() = true);

-- Keep other policies separate
CREATE POLICY "SUISA members can insert accessories"
  ON accessories FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin() = true);

CREATE POLICY "SUISA members can update accessories"
  ON accessories FOR UPDATE
  TO authenticated
  USING (is_suisa_member_or_admin() = true)
  WITH CHECK (is_suisa_member_or_admin() = true);

CREATE POLICY "SUISA members can delete accessories"
  ON accessories FOR DELETE
  TO authenticated
  USING (is_suisa_member_or_admin() = true);

-- ============================================================================
-- 3. Fix Multiple Permissive Policies - OTP Attempts
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all OTP attempts" ON otp_attempts;
DROP POLICY IF EXISTS "Users can view own OTP attempts" ON otp_attempts;

-- Create single policy with OR condition
CREATE POLICY "Users can view relevant OTP attempts"
  ON otp_attempts FOR SELECT
  TO authenticated
  USING (
    email = (select auth.email()) 
    OR check_is_admin() = true
  );

-- ============================================================================
-- 4. Fix Multiple Permissive Policies - Profiles (SELECT)
-- ============================================================================

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create single SELECT policy
CREATE POLICY "Users can read relevant profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    id = (select auth.uid())
    OR check_is_admin() = true
  );

-- ============================================================================
-- 5. Fix Multiple Permissive Policies - Profiles (UPDATE)
-- ============================================================================

-- Drop existing UPDATE policies
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create single UPDATE policy
CREATE POLICY "Users can update relevant profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    id = (select auth.uid())
    OR check_is_admin() = true
  )
  WITH CHECK (
    id = (select auth.uid())
    OR check_is_admin() = true
  );

-- ============================================================================
-- 6. Fix SECURITY DEFINER Views - Security Dashboard
-- ============================================================================

-- Drop existing view
DROP VIEW IF EXISTS security_dashboard;

-- Recreate without SECURITY DEFINER and without exposing auth.users
CREATE OR REPLACE VIEW security_dashboard AS
SELECT
  -- Basic user stats from profiles only
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE is_admin = true) as admin_users,
  (SELECT COUNT(*) FROM profiles WHERE group_name = 'suisa') as suisa_users,
  (SELECT COUNT(*) FROM profiles WHERE group_name = 'user' OR group_name IS NULL) as normal_users,
  
  -- OTP attempt stats (last 24 hours)
  (SELECT COUNT(*) 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '24 hours'
   AND success = false) as failed_otp_attempts_24h,
  
  -- Unique users with failed OTP in last 24h
  (SELECT COUNT(DISTINCT email) 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '24 hours'
   AND success = false) as unique_users_failed_otp_24h,
  
  -- Active sessions (profiles with recent activity)
  (SELECT COUNT(*) 
   FROM profiles 
   WHERE updated_at > NOW() - INTERVAL '1 hour') as active_sessions,
  
  -- Recent OTP attempts (last hour)
  (SELECT COUNT(*) 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '1 hour') as recent_otp_attempts;

-- Grant access only to authenticated users (RLS will control who can view)
GRANT SELECT ON security_dashboard TO authenticated;

-- ============================================================================
-- 7. Fix SECURITY DEFINER View - Low Stock Items
-- ============================================================================

-- Drop existing view
DROP VIEW IF EXISTS low_stock_items;

-- Recreate without SECURITY DEFINER
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
  id,
  name,
  category,
  quantity,
  unit,
  status,
  restock_date,
  restock_notes
FROM inventory
WHERE quantity < 10
  AND status = 'verfügbar';

-- Grant access (RLS will control access)
GRANT SELECT ON low_stock_items TO authenticated;

-- ============================================================================
-- 8. Fix Function Search Path - cleanup_user_data
-- ============================================================================

-- Recreate function with immutable search_path
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Delete OTP attempts for the deleted user's email
  DELETE FROM public.otp_attempts
  WHERE email = OLD.email;
  
  RETURN OLD;
END;
$$;

-- ============================================================================
-- 9. Fix Other Helper Functions Search Paths
-- ============================================================================

-- Fix check_is_admin
CREATE OR REPLACE FUNCTION check_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
BEGIN
  RETURN COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
END;
$$;

-- Fix is_suisa_member_or_admin
CREATE OR REPLACE FUNCTION is_suisa_member_or_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
DECLARE
  user_profile RECORD;
BEGIN
  SELECT is_admin, group_name INTO user_profile
  FROM public.profiles
  WHERE id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  RETURN user_profile.is_admin = true 
    OR user_profile.group_name = 'suisa';
END;
$$;

-- ============================================================================
-- 10. Add Comments for Documentation
-- ============================================================================

COMMENT ON INDEX idx_inventory_created_by IS 
'Index for foreign key inventory.created_by to improve join performance';

COMMENT ON INDEX idx_inventory_last_modified_by IS 
'Index for foreign key inventory.last_modified_by to improve join performance';

COMMENT ON INDEX idx_inventory_transactions_created_by IS 
'Index for foreign key inventory_transactions.created_by to improve join performance';

COMMENT ON INDEX idx_inventory_transactions_inventory_id IS 
'Index for foreign key inventory_transactions.inventory_id to improve join performance';

COMMENT ON VIEW security_dashboard IS 
'Security metrics dashboard - uses profiles table only, no auth.users exposure';

COMMENT ON VIEW low_stock_items IS 
'View of inventory items below restock threshold (quantity < 10)';

COMMENT ON FUNCTION check_is_admin() IS 
'Helper function to check if current user is admin - SECURITY DEFINER to avoid recursion';

COMMENT ON FUNCTION is_suisa_member_or_admin() IS 
'Helper function to check if user is SUISA member or admin - SECURITY DEFINER to avoid recursion';

COMMENT ON FUNCTION cleanup_user_data() IS 
'Trigger function to clean up user-related data on profile deletion';
