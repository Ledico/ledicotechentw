/*
  # Add CASCADE DELETE for User Deletion

  1. Problem
    - When a user is deleted from auth.users, their profile remains in profiles table
    - Related data in inventory and inventory_transactions becomes orphaned
    - Dashboard shows incorrect user counts (3 in auth.users but only 2 visible profiles)
    
  2. Solution
    - Add CASCADE DELETE on profiles.id foreign key to auth.users
    - Add CASCADE DELETE on all foreign keys referencing profiles
    - When user is deleted from auth.users, everything cascades automatically
    
  3. Tables Affected
    - profiles: CASCADE from auth.users
    - inventory: CASCADE from profiles (created_by, last_modified_by)
    - inventory_transactions: CASCADE from profiles (created_by)
    
  4. Important Notes
    - This ensures data consistency
    - No orphaned records
    - Automatic cleanup across all tables
*/

-- ============================================================================
-- 1. Drop Existing Foreign Key Constraints
-- ============================================================================

-- Drop profiles foreign key to auth.users
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Drop inventory foreign keys to profiles
ALTER TABLE inventory 
DROP CONSTRAINT IF EXISTS inventory_created_by_fkey;

ALTER TABLE inventory 
DROP CONSTRAINT IF EXISTS inventory_last_modified_by_fkey;

-- Drop inventory_transactions foreign key to profiles
ALTER TABLE inventory_transactions 
DROP CONSTRAINT IF EXISTS inventory_transactions_created_by_fkey;

-- ============================================================================
-- 2. Recreate Foreign Keys with CASCADE DELETE
-- ============================================================================

-- Profiles CASCADE from auth.users
-- When user is deleted from auth.users, profile is automatically deleted
ALTER TABLE profiles
ADD CONSTRAINT profiles_id_fkey
FOREIGN KEY (id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Inventory CASCADE from profiles
-- When profile is deleted, set created_by and last_modified_by to NULL
-- (We use SET NULL instead of CASCADE to preserve inventory history)
ALTER TABLE inventory
ADD CONSTRAINT inventory_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES profiles(id)
ON DELETE SET NULL;

ALTER TABLE inventory
ADD CONSTRAINT inventory_last_modified_by_fkey
FOREIGN KEY (last_modified_by)
REFERENCES profiles(id)
ON DELETE SET NULL;

-- Inventory transactions CASCADE from profiles
-- When profile is deleted, we need to keep transaction history
-- but we'll set created_by to NULL to maintain referential integrity
ALTER TABLE inventory_transactions
ADD CONSTRAINT inventory_transactions_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES profiles(id)
ON DELETE SET NULL;

-- ============================================================================
-- 3. Clean Up Orphaned Data (if any exists)
-- ============================================================================

-- Delete profiles that don't have corresponding auth.users
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Clean up inventory records with invalid user references
UPDATE inventory
SET created_by = NULL
WHERE created_by IS NOT NULL 
  AND created_by NOT IN (SELECT id FROM profiles);

UPDATE inventory
SET last_modified_by = NULL
WHERE last_modified_by IS NOT NULL 
  AND last_modified_by NOT IN (SELECT id FROM profiles);

-- Clean up inventory_transactions with invalid user references
UPDATE inventory_transactions
SET created_by = NULL
WHERE created_by NOT IN (SELECT id FROM profiles);

-- ============================================================================
-- 4. Add Trigger to Sync OTP Attempts (Optional Cleanup)
-- ============================================================================

-- Create function to clean up OTP attempts when user is deleted
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete OTP attempts for the deleted user's email
  DELETE FROM otp_attempts
  WHERE email = OLD.email;
  
  RETURN OLD;
END;
$$;

-- Create trigger on profiles deletion
DROP TRIGGER IF EXISTS cleanup_user_data_trigger ON profiles;

CREATE TRIGGER cleanup_user_data_trigger
BEFORE DELETE ON profiles
FOR EACH ROW
EXECUTE FUNCTION cleanup_user_data();
