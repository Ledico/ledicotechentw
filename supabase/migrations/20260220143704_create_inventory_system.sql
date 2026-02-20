/*
  # Create Inventory Management System for SUISA Portal

  1. New Tables
    - `inventory`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Item name
      - `category` (text, not null) - Category label
      - `description` (text) - Optional description
      - `quantity` (integer, default 0) - Current stock
      - `unit` (text, default 'Stück') - Unit of measurement
      - `restock_date` (date) - Next/last restock date
      - `restock_notes` (text) - Restock notes
      - `status` (text) - verfügbar | ausgeliehen | defekt
      - `created_by` (uuid FK -> profiles.id)
      - `last_modified_by` (uuid FK -> profiles.id)
      - `last_modified_at` (timestamptz)
      - `created_at` / `updated_at` (timestamptz)

    - `inventory_transactions`
      - `id` (uuid, primary key)
      - `inventory_id` (uuid FK -> inventory.id, CASCADE)
      - `transaction_type` (text) - adjustment | restock | usage | correction
      - `quantity_change` (integer) - positive or negative
      - `quantity_before` / `quantity_after` (integer)
      - `reason` (text)
      - `restock_date` (date)
      - `restock_quantity` (integer)
      - `created_by` (uuid FK -> profiles.id)
      - `created_at` (timestamptz)

    - `accessories`
      - `id` (uuid, primary key)
      - `name` (text, not null) - Accessory name
      - `category` (text, not null) - Category label
      - `description` (text)
      - `compatibility` (text[]) - Compatible devices
      - `price` (decimal)
      - `supplier` (text)
      - `part_number` (text)
      - `created_at` / `updated_at` (timestamptz)

  2. Functions
    - `is_suisa_member_or_admin()` - Check if user is SUISA member or admin
    - `adjust_inventory_quantity()` - Safely adjust inventory with transaction logging
    - `get_inventory_with_last_transaction()` - Get inventory with joined transaction info

  3. Views
    - `low_stock_items` - Items with quantity < 10

  4. Security
    - RLS enabled on all tables
    - Only SUISA members and admins can access inventory data
    - Policies for SELECT, INSERT, UPDATE, DELETE on each table

  5. Triggers
    - Auto-update `updated_at` on inventory and accessories changes

  6. Indexes
    - Composite index on inventory_transactions for efficient queries
    - Foreign key indexes for joins
*/

-- Helper function: is_suisa_member_or_admin
CREATE OR REPLACE FUNCTION is_suisa_member_or_admin()
RETURNS boolean LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, pg_temp
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

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'Stück',
  restock_date date,
  restock_notes text,
  status text NOT NULL DEFAULT 'verfügbar' CHECK (status IN ('verfügbar', 'ausgeliehen', 'defekt')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  last_modified_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  last_modified_at timestamptz DEFAULT now()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SUISA members and admins can view inventory"
  ON inventory FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can insert inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can update inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (is_suisa_member_or_admin())
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can delete inventory"
  ON inventory FOR DELETE
  TO authenticated
  USING (is_suisa_member_or_admin());

-- Inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_id uuid NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('adjustment', 'restock', 'usage', 'correction')),
  quantity_change integer NOT NULL,
  quantity_before integer NOT NULL,
  quantity_after integer NOT NULL,
  reason text,
  restock_date date,
  restock_quantity integer,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SUISA members and admins can view inventory transactions"
  ON inventory_transactions FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can insert inventory transactions"
  ON inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin());

-- Accessories table
CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  compatibility text[] NOT NULL DEFAULT '{}',
  price decimal(10,2),
  supplier text,
  part_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SUISA members can view accessories"
  ON accessories FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "SUISA members can insert accessories"
  ON accessories FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members can update accessories"
  ON accessories FOR UPDATE
  TO authenticated
  USING (is_suisa_member_or_admin())
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members can delete accessories"
  ON accessories FOR DELETE
  TO authenticated
  USING (is_suisa_member_or_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id_created_at 
  ON inventory_transactions(inventory_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory(created_by);
CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_by ON inventory(last_modified_by);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_by ON inventory_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);

-- Triggers
CREATE TRIGGER handle_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_accessories_updated_at
  BEFORE UPDATE ON accessories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function: adjust_inventory_quantity
CREATE OR REPLACE FUNCTION adjust_inventory_quantity(
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
  IF NOT is_suisa_member_or_admin() THEN
    RAISE EXCEPTION 'Only SUISA members and admins can adjust inventory';
  END IF;

  user_id := auth.uid();
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  SELECT quantity INTO current_quantity
  FROM inventory
  WHERE id = item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Inventory item not found';
  END IF;

  new_quantity := current_quantity + quantity_change;

  IF new_quantity < 0 THEN
    RAISE EXCEPTION 'Quantity cannot be negative. Current: %, Change: %', current_quantity, quantity_change;
  END IF;

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

-- Function: get_inventory_with_last_transaction
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
) LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    (
      SELECT it.transaction_type 
      FROM inventory_transactions it 
      WHERE it.inventory_id = i.id 
      ORDER BY it.created_at DESC 
      LIMIT 1
    ) as last_transaction_type,
    (
      SELECT it.created_at 
      FROM inventory_transactions it 
      WHERE it.inventory_id = i.id 
      ORDER BY it.created_at DESC 
      LIMIT 1
    ) as last_transaction_date,
    p.full_name as last_modified_user_name
  FROM inventory i
  LEFT JOIN profiles p ON i.last_modified_by = p.id
  ORDER BY i.updated_at DESC;
END;
$$;

-- View: low_stock_items
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

GRANT SELECT ON low_stock_items TO authenticated;