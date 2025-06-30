/*
  # Enhanced Inventory System

  1. Changes to inventory table
    - Remove 'wartung' status option
    - Add stock tracking fields
    - Add last modified user tracking

  2. New table: inventory_transactions
    - Track all stock changes (additions, removals, restocks)
    - Record user who made the change
    - Record timestamp and reason

  3. Functions
    - Functions to handle stock adjustments
    - Functions to track inventory transactions
*/

-- First, update the inventory table constraint to remove 'wartung'
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_status_check;
ALTER TABLE inventory ADD CONSTRAINT inventory_status_check 
  CHECK (status IN ('verfügbar', 'ausgeliehen', 'defekt'));

-- Add fields for tracking last modifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'last_modified_by'
  ) THEN
    ALTER TABLE inventory ADD COLUMN last_modified_by uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'last_modified_at'
  ) THEN
    ALTER TABLE inventory ADD COLUMN last_modified_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create inventory transactions table for tracking all changes
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('adjustment', 'restock', 'usage', 'correction')),
  quantity_change integer NOT NULL, -- Positive for additions, negative for removals
  quantity_before integer NOT NULL,
  quantity_after integer NOT NULL,
  reason text,
  restock_date date, -- For restock transactions
  restock_quantity integer, -- Original restock amount (might be different from quantity_change)
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on transactions table
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policy for inventory transactions
CREATE POLICY "SUISA members and admins can view inventory transactions"
  ON inventory_transactions
  FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can insert inventory transactions"
  ON inventory_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin());

-- Update the inventory updated_at trigger to also update last_modified fields
CREATE OR REPLACE FUNCTION handle_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_modified_at = now();
  NEW.last_modified_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Function to adjust inventory quantity with transaction logging
CREATE OR REPLACE FUNCTION adjust_inventory_quantity(
  item_id uuid,
  quantity_change integer,
  transaction_type text DEFAULT 'adjustment',
  reason text DEFAULT NULL,
  restock_date date DEFAULT NULL,
  restock_quantity integer DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  current_quantity integer;
  new_quantity integer;
  user_id uuid;
BEGIN
  -- Check if user has permission
  IF NOT is_suisa_member_or_admin() THEN
    RAISE EXCEPTION 'Only SUISA members and admins can adjust inventory';
  END IF;

  -- Get current user
  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Get current quantity
  SELECT quantity INTO current_quantity
  FROM inventory
  WHERE id = item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found';
  END IF;

  -- Calculate new quantity
  new_quantity := current_quantity + quantity_change;

  -- Ensure quantity doesn't go below 0
  IF new_quantity < 0 THEN
    RAISE EXCEPTION 'Quantity cannot be negative. Current: %, Change: %', current_quantity, quantity_change;
  END IF;

  -- Update inventory
  UPDATE inventory 
  SET 
    quantity = new_quantity,
    updated_at = now(),
    last_modified_by = user_id,
    last_modified_at = now()
  WHERE id = item_id;

  -- Log transaction
  INSERT INTO inventory_transactions (
    inventory_id,
    transaction_type,
    quantity_change,
    quantity_before,
    quantity_after,
    reason,
    restock_date,
    restock_quantity,
    created_by
  ) VALUES (
    item_id,
    transaction_type,
    quantity_change,
    current_quantity,
    new_quantity,
    reason,
    restock_date,
    restock_quantity,
    user_id
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Function to get inventory with last transaction info
CREATE OR REPLACE FUNCTION get_inventory_with_last_transaction()
RETURNS TABLE(
  id uuid,
  name text,
  category text,
  description text,
  quantity integer,
  unit text,
  location text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  created_by uuid,
  last_modified_by uuid,
  last_modified_at timestamptz,
  last_transaction_type text,
  last_transaction_date timestamptz,
  last_modified_user_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.name,
    i.category,
    i.description,
    i.quantity,
    i.unit,
    i.location,
    i.status,
    i.created_at,
    i.updated_at,
    i.created_by,
    i.last_modified_by,
    i.last_modified_at,
    lt.transaction_type as last_transaction_type,
    lt.created_at as last_transaction_date,
    p.full_name as last_modified_user_name
  FROM inventory i
  LEFT JOIN (
    SELECT DISTINCT ON (inventory_id) 
      inventory_id,
      transaction_type,
      created_at
    FROM inventory_transactions
    ORDER BY inventory_id, created_at DESC
  ) lt ON i.id = lt.inventory_id
  LEFT JOIN profiles p ON i.last_modified_by = p.id
  ORDER BY i.updated_at DESC;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_by ON inventory(last_modified_by);
CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_at ON inventory(last_modified_at DESC);

-- Update existing inventory items to have last_modified fields
UPDATE inventory 
SET 
  last_modified_by = created_by,
  last_modified_at = updated_at
WHERE last_modified_by IS NULL;