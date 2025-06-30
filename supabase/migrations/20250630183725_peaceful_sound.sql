/*
  # Add Low Stock Email Notification Trigger

  1. Create trigger function to detect low stock
  2. Add trigger to inventory table
  3. Function calls Edge Function for email notifications
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
    -- Note: In production, you might want to use a queue system
    -- For now, we'll use pg_net extension if available
    BEGIN
      -- Try to call the Edge Function
      -- This requires the pg_net extension to be enabled
      SELECT net.http_post(
        url := 'https://ayqitipxqhbubhtjiewb.supabase.co/functions/v1/send-low-stock-alert',
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

-- Create trigger for low stock notifications
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
      url := 'https://ayqitipxqhbubhtjiewb.supabase.co/functions/v1/send-low-stock-alert',
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

-- Add comment explaining the notification system
COMMENT ON FUNCTION handle_low_stock_notification() IS 
'Automatically sends email notifications when inventory items reach low stock levels (≤2 units). 
Requires Edge Function "send-low-stock-alert" to be deployed and pg_net extension enabled.';

COMMENT ON FUNCTION test_low_stock_notification(uuid) IS 
'Test function for admins to manually trigger low stock notifications for testing purposes.';