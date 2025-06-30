/*
  # Add SUISA group support

  1. Schema Changes
    - Add `group_name` column to profiles table
    - Create SUISA-specific functions
    - Add RLS policies for SUISA group access

  2. Security
    - Only admins and SUISA group members can access SUISA features
    - Proper RLS policies for group-based access control

  3. Functions
    - Function to check SUISA group membership
    - Function to assign users to SUISA group
*/

-- Add group_name column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'group_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN group_name text DEFAULT 'user';
  END IF;
END $$;

-- Create index for group_name for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_group_name ON profiles(group_name);

-- Function to check if user is in SUISA group
CREATE OR REPLACE FUNCTION is_suisa_member()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND (group_name = 'SUISA' OR is_admin = true)
  );
END;
$$;

-- Function to assign user to SUISA group (admin only)
CREATE OR REPLACE FUNCTION assign_to_suisa(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Update user's group
  UPDATE profiles
  SET group_name = 'SUISA',
      updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Function to remove user from SUISA group (admin only)
CREATE OR REPLACE FUNCTION remove_from_suisa(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  -- Update user's group back to default
  UPDATE profiles
  SET group_name = 'user',
      updated_at = now()
  WHERE id = user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create inventory table for SUISA
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  quantity integer DEFAULT 0,
  unit text DEFAULT 'Stück',
  location text,
  status text DEFAULT 'verfügbar' CHECK (status IN ('verfügbar', 'ausgeliehen', 'wartung', 'defekt')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS on inventory table
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- RLS policies for inventory (SUISA members and admins only)
CREATE POLICY "SUISA members can view inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (is_suisa_member());

CREATE POLICY "SUISA members can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member());

CREATE POLICY "SUISA members can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (is_suisa_member())
  WITH CHECK (is_suisa_member());

CREATE POLICY "Admins can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create accessories table for generator
CREATE TABLE IF NOT EXISTS accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  compatibility text[], -- Array of compatible device types
  price decimal(10,2),
  supplier text,
  part_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on accessories table
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- RLS policies for accessories (SUISA members and admins only)
CREATE POLICY "SUISA members can view accessories"
  ON accessories
  FOR SELECT
  TO authenticated
  USING (is_suisa_member());

CREATE POLICY "SUISA members can manage accessories"
  ON accessories
  FOR ALL
  TO authenticated
  USING (is_suisa_member())
  WITH CHECK (is_suisa_member());

-- Insert some sample inventory data
INSERT INTO inventory (name, category, description, quantity, unit, location, status) VALUES
  ('MacBook Pro 16"', 'Computer', 'Apple MacBook Pro 16 Zoll, M2 Pro Chip', 5, 'Stück', 'Büro A', 'verfügbar'),
  ('iPhone 14 Pro', 'Mobile', 'Apple iPhone 14 Pro, 256GB', 10, 'Stück', 'Lager', 'verfügbar'),
  ('iPad Air', 'Tablet', 'Apple iPad Air, 64GB, WiFi', 8, 'Stück', 'Büro B', 'verfügbar'),
  ('USB-C Kabel', 'Zubehör', 'USB-C zu USB-C Kabel, 2m', 50, 'Stück', 'Lager', 'verfügbar'),
  ('Wireless Maus', 'Zubehör', 'Logitech MX Master 3', 15, 'Stück', 'Lager', 'verfügbar')
ON CONFLICT DO NOTHING;

-- Insert some sample accessories data
INSERT INTO accessories (name, category, description, compatibility, price, supplier, part_number) VALUES
  ('USB-C Hub', 'Adapter', 'Multi-Port USB-C Hub mit HDMI', ARRAY['MacBook', 'iPad'], 89.90, 'Anker', 'A8346'),
  ('Lightning Kabel', 'Kabel', 'Lightning zu USB-A Kabel, 1m', ARRAY['iPhone', 'iPad'], 19.90, 'Apple', 'MXLY2ZM/A'),
  ('AirPods Pro', 'Audio', 'Apple AirPods Pro (2. Generation)', ARRAY['iPhone', 'iPad', 'MacBook'], 279.00, 'Apple', 'MQD83ZM/A'),
  ('Magic Mouse', 'Eingabe', 'Apple Magic Mouse', ARRAY['MacBook', 'iMac'], 89.00, 'Apple', 'MK2E3ZM/A'),
  ('USB-C Ladegerät', 'Ladegerät', '67W USB-C Power Adapter', ARRAY['MacBook', 'iPad'], 79.00, 'Apple', 'MLYU3ZM/A')
ON CONFLICT DO NOTHING;

-- Create updated_at trigger for inventory
CREATE OR REPLACE FUNCTION handle_inventory_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_inventory_updated_at();

-- Create updated_at trigger for accessories
CREATE OR REPLACE FUNCTION handle_accessories_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_accessories_updated_at
  BEFORE UPDATE ON accessories
  FOR EACH ROW
  EXECUTE FUNCTION handle_accessories_updated_at();