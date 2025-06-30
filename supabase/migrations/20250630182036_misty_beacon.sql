/*
  # Fix inventory function overloading conflict

  1. Problem
    - Two functions with same name `adjust_inventory_quantity` exist
    - Both have same parameter count but different last parameter types
    - PostgreSQL cannot resolve which function to call

  2. Solution
    - Drop the conflicting function with `restock_quantity` parameter
    - Keep only the function with `restock_notes` parameter
    - This maintains compatibility with the frontend code

  3. Security
    - Function maintains existing security policies
    - Only authenticated SUISA members can call this function
*/

-- Drop the conflicting function that uses restock_quantity parameter
DROP FUNCTION IF EXISTS adjust_inventory_quantity(
  item_id uuid,
  quantity_change integer,
  transaction_type text,
  reason text,
  restock_date date,
  restock_quantity integer
);

-- Ensure the correct function exists with restock_notes parameter
CREATE OR REPLACE FUNCTION adjust_inventory_quantity(
  item_id uuid,
  quantity_change integer,
  transaction_type text,
  reason text,
  restock_date date DEFAULT NULL,
  restock_notes text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_quantity integer;
  new_quantity integer;
BEGIN
  -- Check if user is SUISA member or admin
  IF NOT is_suisa_member_or_admin() THEN
    RAISE EXCEPTION 'Access denied. Only SUISA members and admins can adjust inventory.';
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
    RAISE EXCEPTION 'Insufficient inventory. Current quantity: %, requested change: %', current_quantity, quantity_change;
  END IF;

  -- Update inventory quantity and tracking fields
  UPDATE inventory
  SET 
    quantity = new_quantity,
    last_modified_by = auth.uid(),
    last_modified_at = now(),
    restock_date = COALESCE(adjust_inventory_quantity.restock_date, inventory.restock_date),
    restock_notes = COALESCE(adjust_inventory_quantity.restock_notes, inventory.restock_notes)
  WHERE id = item_id;

  -- Record transaction
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
    adjust_inventory_quantity.restock_date,
    CASE WHEN transaction_type = 'restock' THEN quantity_change ELSE NULL END,
    auth.uid()
  );
END;
$$;