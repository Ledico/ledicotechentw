/*
  # Performance Optimierung für Inventory Abfragen

  1. Änderungen
    - Indizes für häufig verwendete Spalten hinzufügen
    - Inventory-Funktion für bessere Performance optimieren
    - Nur notwendige Daten laden

  2. Performance-Verbesserungen
    - Index auf inventory_transactions(inventory_id, created_at DESC)
    - Index auf inventory(updated_at DESC)
    - Index auf inventory(last_modified_by)
    - Vereinfachte Funktion ohne unnötige JOINs für den Generator-Tab
*/

-- Erstelle Indizes für bessere Query Performance
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id_created_at 
ON inventory_transactions(inventory_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_updated_at 
ON inventory(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_inventory_last_modified_by 
ON inventory(last_modified_by);

CREATE INDEX IF NOT EXISTS idx_accessories_category 
ON accessories(category);

-- Optimierte Version der Funktion
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
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;
