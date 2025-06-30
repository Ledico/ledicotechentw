/*
  # Add SUISA Group System

  1. New Features
    - Add group_name column to profiles table
    - Create inventory table for SUISA equipment management
    - Create accessories table for the generator
    - Add functions for SUISA group management
    - Set up proper RLS policies

  2. Security
    - Enable RLS on all new tables
    - Add policies for SUISA members and admins only
    - Create secure functions for group management

  3. Sample Data
    - Add sample inventory items
    - Add sample accessories for the generator
*/

-- Add group_name column to profiles table if it doesn't exist
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

CREATE POLICY "SUISA members can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (is_suisa_member());

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

-- Create updated_at trigger for inventory
CREATE OR REPLACE FUNCTION handle_inventory_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS handle_inventory_updated_at ON inventory;
CREATE TRIGGER handle_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_inventory_updated_at();

-- Create updated_at trigger for accessories
CREATE OR REPLACE FUNCTION handle_accessories_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS handle_accessories_updated_at ON accessories;
CREATE TRIGGER handle_accessories_updated_at
  BEFORE UPDATE ON accessories
  FOR EACH ROW
  EXECUTE FUNCTION handle_accessories_updated_at();

-- Insert sample inventory data (only if table is empty)
INSERT INTO inventory (name, category, description, quantity, unit, location, status)
SELECT * FROM (VALUES
  ('MacBook Pro 16"', 'Computer', 'Apple MacBook Pro 16 Zoll, M2 Pro Chip', 5, 'Stück', 'Büro A', 'verfügbar'),
  ('iPhone 14 Pro', 'Mobile', 'Apple iPhone 14 Pro, 256GB', 10, 'Stück', 'Lager', 'verfügbar'),
  ('iPad Air', 'Tablet', 'Apple iPad Air, 64GB, WiFi', 8, 'Stück', 'Büro B', 'verfügbar'),
  ('USB-C Kabel', 'Zubehör', 'USB-C zu USB-C Kabel, 2m', 50, 'Stück', 'Lager', 'verfügbar'),
  ('Wireless Maus', 'Zubehör', 'Logitech MX Master 3', 15, 'Stück', 'Lager', 'verfügbar'),
  ('Monitor 27"', 'Display', 'Dell UltraSharp 27" 4K Monitor', 12, 'Stück', 'Büro A', 'verfügbar'),
  ('Webcam HD', 'Zubehör', 'Logitech C920 HD Webcam', 20, 'Stück', 'Lager', 'verfügbar'),
  ('Headset', 'Audio', 'Sony WH-1000XM4 Noise Cancelling', 8, 'Stück', 'Büro B', 'verfügbar')
) AS v(name, category, description, quantity, unit, location, status)
WHERE NOT EXISTS (SELECT 1 FROM inventory LIMIT 1);

-- Insert sample accessories data (only if table is empty)
INSERT INTO accessories (name, category, description, compatibility, price, supplier, part_number)
SELECT * FROM (VALUES
  ('USB-C Hub', 'Adapter', 'Multi-Port USB-C Hub mit HDMI', ARRAY['MacBook', 'iPad'], 89.90, 'Anker', 'A8346'),
  ('Lightning Kabel', 'Kabel', 'Lightning zu USB-A Kabel, 1m', ARRAY['iPhone', 'iPad'], 19.90, 'Apple', 'MXLY2ZM/A'),
  ('AirPods Pro', 'Audio', 'Apple AirPods Pro (2. Generation)', ARRAY['iPhone', 'iPad', 'MacBook'], 279.00, 'Apple', 'MQD83ZM/A'),
  ('Magic Mouse', 'Eingabe', 'Apple Magic Mouse', ARRAY['MacBook', 'iMac'], 89.00, 'Apple', 'MK2E3ZM/A'),
  ('USB-C Ladegerät', 'Ladegerät', '67W USB-C Power Adapter', ARRAY['MacBook', 'iPad'], 79.00, 'Apple', 'MLYU3ZM/A'),
  ('Thunderbolt Kabel', 'Kabel', 'Thunderbolt 4 Kabel, 0.8m', ARRAY['MacBook', 'Monitor'], 149.00, 'Apple', 'MWP02ZM/A'),
  ('Wireless Tastatur', 'Eingabe', 'Apple Magic Keyboard', ARRAY['MacBook', 'iMac', 'iPad'], 119.00, 'Apple', 'MK2A3D/A'),
  ('Externe SSD', 'Speicher', 'Samsung T7 Portable SSD 1TB', ARRAY['MacBook', 'PC'], 159.00, 'Samsung', 'MU-PC1T0T/WW'),
  ('HDMI Adapter', 'Adapter', 'USB-C zu HDMI Adapter', ARRAY['MacBook', 'iPad'], 69.00, 'Apple', 'MUF82ZM/A'),
  ('Docking Station', 'Adapter', 'CalDigit TS3 Plus Thunderbolt 3 Dock', ARRAY['MacBook'], 299.00, 'CalDigit', 'TS3-PLUS')
) AS v(name, category, description, compatibility, price, supplier, part_number)
WHERE NOT EXISTS (SELECT 1 FROM accessories LIMIT 1);