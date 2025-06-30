/*
  # Fix inventory function conflict

  1. Problem
    - Multiple versions of adjust_inventory_quantity function exist
    - PostgreSQL cannot resolve function overloading
    - Need to drop all versions and recreate the correct one

  2. Solution
    - Drop all existing versions of the function
    - Recreate with the correct signature and return type
    - Ensure only one version exists
*/

-- Drop all existing versions of the adjust_inventory_quantity function
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text, text, date, integer);
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text, text, date, text);
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text, text);
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer, text);
DROP FUNCTION IF EXISTS adjust_inventory_quantity(uuid, integer);

-- Create the correct function with proper signature
CREATE FUNCTION adjust_inventory_quantity(
  item_id uuid,
  quantity_change integer,
  transaction_type text DEFAULT 'adjustment',
  reason text DEFAULT NULL,
  restock_date date DEFAULT NULL,
  restock_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
      WHEN transaction_type = 'restock' AND adjust_inventory_quantity.restock_date IS NOT NULL 
      THEN adjust_inventory_quantity.restock_date 
      ELSE inventory.restock_date 
    END,
    restock_notes = CASE 
      WHEN transaction_type = 'restock' AND adjust_inventory_quantity.restock_notes IS NOT NULL 
      THEN adjust_inventory_quantity.restock_notes 
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
    CASE WHEN transaction_type = 'restock' THEN adjust_inventory_quantity.restock_date ELSE NULL END,
    CASE WHEN transaction_type = 'restock' THEN quantity_change ELSE NULL END,
    user_id
  );

  RETURN true;
END;
$$;