/*
  # SUISA Portal Database Schema

  1. New Tables
    - `inventory` - Inventarverwaltung für SUISA-Mitglieder
      - `id` (uuid, primary key)
      - `name` (text, required) - Name des Artikels
      - `category` (text, required) - Kategorie
      - `description` (text, optional) - Beschreibung
      - `quantity` (integer, required) - Anzahl
      - `unit` (text, required) - Einheit (Stück, Meter, etc.)
      - `location` (text, optional) - Standort
      - `status` (text, required) - Status (verfügbar, ausgeliehen, wartung, defekt)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, foreign key to profiles)

    - `accessories` - Zubehörteile für den Generator
      - `id` (uuid, primary key)
      - `name` (text, required) - Name des Zubehörs
      - `category` (text, required) - Kategorie
      - `description` (text, optional) - Beschreibung
      - `compatibility` (text[], required) - Kompatible Geräte/Systeme
      - `price` (decimal, optional) - Preis in CHF
      - `supplier` (text, optional) - Lieferant
      - `part_number` (text, optional) - Artikelnummer
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for SUISA members and admins
    - Create functions for group management

  3. Sample Data
    - Add some sample accessories for the generator
*/

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  quantity integer NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'Stück',
  location text,
  status text NOT NULL DEFAULT 'verfügbar' CHECK (status IN ('verfügbar', 'ausgeliehen', 'wartung', 'defekt')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Create accessories table
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

-- Enable RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER handle_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_accessories_updated_at
  BEFORE UPDATE ON accessories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to check if user is SUISA member or admin
CREATE OR REPLACE FUNCTION is_suisa_member_or_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT (is_admin = true OR group_name = 'SUISA')
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- RLS Policies for inventory
CREATE POLICY "SUISA members and admins can view inventory"
  ON inventory
  FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can insert inventory"
  ON inventory
  FOR INSERT
  TO authenticated
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can update inventory"
  ON inventory
  FOR UPDATE
  TO authenticated
  USING (is_suisa_member_or_admin())
  WITH CHECK (is_suisa_member_or_admin());

CREATE POLICY "SUISA members and admins can delete inventory"
  ON inventory
  FOR DELETE
  TO authenticated
  USING (is_suisa_member_or_admin());

-- RLS Policies for accessories
CREATE POLICY "SUISA members and admins can view accessories"
  ON accessories
  FOR SELECT
  TO authenticated
  USING (is_suisa_member_or_admin());

CREATE POLICY "Admins can manage accessories"
  ON accessories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create functions for SUISA group management
CREATE OR REPLACE FUNCTION assign_to_suisa(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can assign users to SUISA group';
  END IF;

  -- Update user's group
  UPDATE profiles 
  SET group_name = 'SUISA', updated_at = now()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

CREATE OR REPLACE FUNCTION remove_from_suisa(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can remove users from SUISA group';
  END IF;

  -- Update user's group
  UPDATE profiles 
  SET group_name = NULL, updated_at = now()
  WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Insert sample accessories data
INSERT INTO accessories (name, category, description, compatibility, price, supplier, part_number) VALUES
  ('USB-C Kabel 2m', 'Kabel', 'Hochwertiges USB-C Kabel für Datenübertragung und Laden', ARRAY['Laptop', 'Smartphone', 'Tablet'], 29.90, 'TechSupply AG', 'USB-C-2M-001'),
  ('HDMI Adapter', 'Adapter', 'USB-C zu HDMI Adapter für externe Monitore', ARRAY['Laptop', 'Tablet'], 49.90, 'TechSupply AG', 'HDMI-ADP-002'),
  ('Wireless Maus', 'Eingabegeräte', 'Ergonomische kabellose Maus mit 2.4GHz Verbindung', ARRAY['Laptop', 'Desktop'], 39.90, 'PeriphTech', 'WM-2024-003'),
  ('Bluetooth Tastatur', 'Eingabegeräte', 'Kompakte Bluetooth Tastatur für mobile Arbeitsplätze', ARRAY['Laptop', 'Tablet', 'Smartphone'], 79.90, 'PeriphTech', 'BT-KB-004'),
  ('Laptop Ständer', 'Zubehör', 'Verstellbarer Aluminium Laptop Ständer für bessere Ergonomie', ARRAY['Laptop'], 59.90, 'ErgoTech', 'LS-ALU-005'),
  ('USB Hub 4-Port', 'Hub', '4-Port USB 3.0 Hub mit LED-Anzeige', ARRAY['Laptop', 'Desktop'], 34.90, 'TechSupply AG', 'USB-HUB-006'),
  ('Webcam HD', 'Kamera', '1080p HD Webcam mit Autofokus und Mikrofon', ARRAY['Laptop', 'Desktop'], 89.90, 'VideoTech', 'WC-HD-007'),
  ('Kopfhörer Noise-Cancelling', 'Audio', 'Over-Ear Kopfhörer mit aktiver Geräuschunterdrückung', ARRAY['Laptop', 'Smartphone', 'Tablet'], 199.90, 'AudioPro', 'NC-HP-008'),
  ('Externe SSD 1TB', 'Speicher', 'Portable SSD mit USB 3.1 für schnelle Datenübertragung', ARRAY['Laptop', 'Desktop'], 149.90, 'StorageTech', 'SSD-1TB-009'),
  ('Docking Station', 'Docking', 'Universal Docking Station mit mehreren Anschlüssen', ARRAY['Laptop'], 299.90, 'TechSupply AG', 'DOCK-UNI-010'),
  ('Monitor 24 Zoll', 'Monitor', '24 Zoll Full HD Monitor mit IPS Panel', ARRAY['Laptop', 'Desktop'], 249.90, 'DisplayTech', 'MON-24-011'),
  ('Drucker Multifunktion', 'Drucker', 'Tintenstrahl-Multifunktionsdrucker mit WLAN', ARRAY['Laptop', 'Desktop'], 179.90, 'PrintTech', 'MFP-INK-012'),
  ('Netzwerkkabel Cat6', 'Netzwerk', '5m Cat6 Ethernet Kabel für stabile Internetverbindung', ARRAY['Laptop', 'Desktop'], 19.90, 'NetTech', 'CAT6-5M-013'),
  ('WLAN Router', 'Netzwerk', 'Dual-Band WLAN Router mit Wi-Fi 6 Standard', ARRAY['Laptop', 'Desktop', 'Smartphone', 'Tablet'], 149.90, 'NetTech', 'WIFI6-RTR-014'),
  ('Powerbank 20000mAh', 'Energie', 'Hochkapazitäts Powerbank mit USB-C und Wireless Charging', ARRAY['Smartphone', 'Tablet'], 69.90, 'PowerTech', 'PB-20K-015');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_created_by ON inventory(created_by);
CREATE INDEX IF NOT EXISTS idx_accessories_category ON accessories(category);
CREATE INDEX IF NOT EXISTS idx_profiles_group_name ON profiles(group_name);