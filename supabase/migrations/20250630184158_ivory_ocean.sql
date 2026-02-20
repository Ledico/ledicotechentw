/*
  # Low Stock Email Notification System

  1. Functions
    - handle_low_stock_notification: Trigger function that calls Edge Function when stock is low
    - test_low_stock_notification: Manual test function for admins

  2. Triggers
    - low_stock_notification_trigger: Fires on quantity updates
    - low_stock_notification_insert_trigger: Fires on new item inserts

  3. Features
    - Automatic email alerts when quantity ≤ 2 and status = 'verfügbar'
    - Professional HTML email template with German localization
    - Error handling that doesn't break database transactions
    - Test function for debugging
*/

-- Create function to handle low stock notifications
CREATE OR REPLACE FUNCTION handle_low_stock_notification()
RETURNS trigger AS $$
DECLARE
  function_url text;
  payload jsonb;
  response text;
BEGIN
  -- Only trigger on updates where quantity changes to 2 or below
  -- and the item is available (not defekt or ausgeliehen)
  IF (NEW.quantity <= 2 AND NEW.status = 'verfügbar' AND 
      (OLD.quantity IS NULL OR OLD.quantity > 2 OR OLD.quantity != NEW.quantity)) THEN
    
    -- Prepare payload for Edge Function
    payload := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'name', NEW.name,
        'category', NEW.category,
        'description', NEW.description,
        'quantity', NEW.quantity,
        'unit', NEW.unit,
        'status', NEW.status,
        'updated_at', NEW.updated_at
      )
    );

    -- Call Edge Function asynchronously (fire and forget)
    -- Note: This requires the pg_net extension to be enabled
    BEGIN
      -- Try to call the Edge Function
      SELECT net.http_post(
        url := 'https://ojwepowksnbmbcgnokve.supabase.co/functions/v1/send-low-stock-alert',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := payload
      ) INTO response;
      
      -- Log successful notification attempt
      RAISE NOTICE 'Low stock notification sent for item: % (quantity: %)', NEW.name, NEW.quantity;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log error but don't fail the transaction
      RAISE WARNING 'Failed to send low stock notification for item %: %', NEW.name, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Create trigger for low stock notifications on quantity updates
DROP TRIGGER IF EXISTS low_stock_notification_trigger ON inventory;
CREATE TRIGGER low_stock_notification_trigger
  AFTER UPDATE OF quantity ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_low_stock_notification();

-- Also trigger on INSERT for new items that are already low stock
DROP TRIGGER IF EXISTS low_stock_notification_insert_trigger ON inventory;
CREATE TRIGGER low_stock_notification_insert_trigger
  AFTER INSERT ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_low_stock_notification();

-- Create a manual function to test the notification system
CREATE OR REPLACE FUNCTION test_low_stock_notification(item_id uuid)
RETURNS boolean AS $$
DECLARE
  item_record inventory%ROWTYPE;
  payload jsonb;
  response text;
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can test notifications';
  END IF;

  -- Get the item
  SELECT * INTO item_record FROM inventory WHERE id = item_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found';
  END IF;

  -- Prepare payload
  payload := jsonb_build_object(
    'record', jsonb_build_object(
      'id', item_record.id,
      'name', item_record.name,
      'category', item_record.category,
      'description', item_record.description,
      'quantity', item_record.quantity,
      'unit', item_record.unit,
      'status', item_record.status,
      'updated_at', item_record.updated_at
    )
  );

  -- Try to call the Edge Function
  BEGIN
    SELECT net.http_post(
      url := 'https://ojwepowksnbmbcgnokve.supabase.co/functions/v1/send-low-stock-alert',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := payload
    ) INTO response;
    
    RAISE NOTICE 'Test notification sent for item: %', item_record.name;
    RETURN true;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send test notification: %', SQLERRM;
    RETURN false;
  END;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Add comments explaining the notification system
COMMENT ON FUNCTION handle_low_stock_notification() IS 
'Automatically sends email notifications when inventory items reach low stock levels (≤2 units). 
Requires Edge Function "send-low-stock-alert" to be deployed and pg_net extension enabled.';

COMMENT ON FUNCTION test_low_stock_notification(uuid) IS 
'Test function for admins to manually trigger low stock notifications for testing purposes.';

-- Create a view to monitor notification-worthy items
CREATE OR REPLACE VIEW low_stock_items AS
SELECT 
  id,
  name,
  category,
  quantity,
  unit,
  status,
  updated_at,
  CASE 
    WHEN quantity = 0 THEN 'CRITICAL - Ausverkauft'
    WHEN quantity = 1 THEN 'URGENT - Nur 1 Stück'
    WHEN quantity = 2 THEN 'WARNING - Nur 2 Stück'
    ELSE 'OK'
  END as alert_level
FROM inventory 
WHERE quantity <= 2 AND status = 'verfügbar'
ORDER BY quantity ASC, updated_at DESC;

-- Grant access to the view
GRANT SELECT ON low_stock_items TO authenticated;

-- Add RLS policy for the view (inherits from inventory table)
-- No additional policy needed as it inherits from inventory table policies