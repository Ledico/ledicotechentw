-- Add new restock fields to inventory table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'restock_date'
  ) THEN
    ALTER TABLE inventory ADD COLUMN restock_date date;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'restock_notes'
  ) THEN
    ALTER TABLE inventory ADD COLUMN restock_notes text;
  END IF;
END $$;

-- Remove location column (after adding new fields)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory' AND column_name = 'location'
  ) THEN
    ALTER TABLE inventory DROP COLUMN location;
  END IF;
END $$;

-- Drop the existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS get_inventory_with_last_transaction();

-- Recreate the function with updated return type including new fields
CREATE OR REPLACE FUNCTION get_inventory_with_last_transaction()
RETURNS TABLE(
  id uuid,
  name text,
  category text,
  description text,
  quantity integer,
  unit text,
  restock_date date,
  restock_notes text,
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
    i.restock_date,
    i.restock_notes,
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

-- Drop and recreate the adjust_inventory_quantity function to handle restock information
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text, text);
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text, text, date, text);

CREATE OR REPLACE FUNCTION adjust_inventory_quantity(
  item_id uuid,
  quantity_change integer,
  transaction_type text DEFAULT 'adjustment',
  reason text DEFAULT NULL,
  restock_date date DEFAULT NULL,
  restock_notes text DEFAULT NULL
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

  -- Update inventory (including restock info if this is a restock)
  UPDATE inventory 
  SET 
    quantity = new_quantity,
    updated_at = now(),
    last_modified_by = user_id,
    last_modified_at = now(),
    restock_date = CASE 
      WHEN transaction_type = 'restock' AND restock_date IS NOT NULL 
      THEN restock_date 
      ELSE inventory.restock_date 
    END,
    restock_notes = CASE 
      WHEN transaction_type = 'restock' AND restock_notes IS NOT NULL 
      THEN restock_notes 
      ELSE inventory.restock_notes 
    END
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
    CASE WHEN transaction_type = 'restock' THEN restock_date ELSE NULL END,
    CASE WHEN transaction_type = 'restock' THEN quantity_change ELSE NULL END,
    user_id
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Add indexes for the new columns for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_restock_date ON inventory(restock_date);
CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_at ON inventory(last_modified_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_by ON inventory(last_modified_by);

-- Add indexes for inventory_transactions table
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);