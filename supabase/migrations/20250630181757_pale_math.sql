/*
  # Fix Ambiguous Column Reference in Inventory Functions

  1. Problem
    - Multiple tables have 'created_at' columns causing ambiguous references
    - Function get_inventory_with_last_transaction() has ambiguous column references

  2. Solution
    - Make all column references explicit with table aliases
    - Fix the DISTINCT ON clause to be more specific
    - Ensure all column references are unambiguous

  3. Changes
    - Update get_inventory_with_last_transaction() function
    - Fix column aliasing in subqueries
    - Make all references explicit
*/

-- Drop and recreate the function with explicit column references
DROP FUNCTION IF EXISTS get_inventory_with_last_transaction();

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
    i.created_at,  -- Explicitly reference inventory.created_at
    i.updated_at,  -- Explicitly reference inventory.updated_at
    i.created_by,
    i.last_modified_by,
    i.last_modified_at,
    lt.transaction_type as last_transaction_type,
    lt.transaction_created_at as last_transaction_date,  -- Use aliased column
    p.full_name as last_modified_user_name
  FROM inventory i
  LEFT JOIN (
    SELECT DISTINCT ON (it.inventory_id) 
      it.inventory_id,
      it.transaction_type,
      it.created_at as transaction_created_at  -- Alias to avoid ambiguity
    FROM inventory_transactions it
    ORDER BY it.inventory_id, it.created_at DESC
  ) lt ON i.id = lt.inventory_id
  LEFT JOIN profiles p ON i.last_modified_by = p.id
  ORDER BY i.updated_at DESC;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;