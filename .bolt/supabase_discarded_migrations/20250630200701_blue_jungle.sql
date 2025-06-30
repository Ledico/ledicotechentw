/*
  # Fix Low Stock Notification System

  1. Database Functions
    - Update the low stock notification trigger function
    - Ensure proper error handling and logging
    - Fix the Edge Function call

  2. Testing
    - Add test functions to verify the system works
    - Ensure triggers are properly attached

  3. Debugging
    - Add logging to track function execution
    - Improve error messages
*/

-- Drop existing function and recreate with better error handling
DROP FUNCTION IF EXISTS handle_low_stock_notification();

-- Create improved low stock notification function
CREATE OR REPLACE FUNCTION handle_low_stock_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_status INTEGER;
  response_body TEXT;
  function_url TEXT;
BEGIN
  -- Only process if quantity is 2 or less and status is 'verfügbar'
  IF NEW.quantity <= 2 AND NEW.status = 'verfügbar' THEN
    
    -- Log the attempt
    RAISE LOG 'Low stock detected for item: % (quantity: %)', NEW.name, NEW.quantity;
    
    -- Construct the Edge Function URL
    function_url := 'https://ayqitipxqhbubhtjiewb.supabase.co/functions/v1/send-low-stock-alert';
    
    -- Call the Edge Function using pg_net
    SELECT status, body INTO response_status, response_body
    FROM net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'record', jsonb_build_object(
          'id', NEW.id,
          'name', NEW.name,
          'category', NEW.category,
          'description', NEW.description,
          'quantity', NEW.quantity,
          'unit', NEW.unit,
          'status', NEW.status
        )
      )
    );
    
    -- Log the response
    IF response_status = 200 THEN
      RAISE LOG 'Low stock alert sent successfully for item: %', NEW.name;
    ELSE
      RAISE LOG 'Failed to send low stock alert for item: % (status: %, body: %)', NEW.name, response_status, response_body;
    END IF;
    
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE LOG 'Error in low stock notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the triggers exist and are properly configured
DROP TRIGGER IF EXISTS low_stock_notification_trigger ON inventory;
DROP TRIGGER IF EXISTS low_stock_notification_insert_trigger ON inventory;

-- Create triggers for both INSERT and UPDATE
CREATE TRIGGER low_stock_notification_trigger
  AFTER UPDATE OF quantity ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_low_stock_notification();

CREATE TRIGGER low_stock_notification_insert_trigger
  AFTER INSERT ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION handle_low_stock_notification();

-- Create a test function to manually trigger low stock alerts
CREATE OR REPLACE FUNCTION test_low_stock_alert(item_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item_record RECORD;
  response_status INTEGER;
  response_body TEXT;
  function_url TEXT;
BEGIN
  -- Get the item
  SELECT * INTO item_record FROM inventory WHERE id = item_id;
  
  IF NOT FOUND THEN
    RETURN 'Item not found';
  END IF;
  
  -- Construct the Edge Function URL
  function_url := 'https://ayqitipxqhbubhtjiewb.supabase.co/functions/v1/send-low-stock-alert';
  
  -- Call the Edge Function
  SELECT status, body INTO response_status, response_body
  FROM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', item_record.id,
        'name', item_record.name,
        'category', item_record.category,
        'description', item_record.description,
        'quantity', item_record.quantity,
        'unit', item_record.unit,
        'status', item_record.status
      )
    )
  );
  
  RETURN format('Status: %s, Body: %s', response_status, response_body);
END;
$$;

-- Create a function to check if pg_net extension is available
CREATE OR REPLACE FUNCTION check_pg_net_status()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  extension_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM pg_extension WHERE extname = 'pg_net'
  ) INTO extension_exists;
  
  IF extension_exists THEN
    RETURN 'pg_net extension is installed and available';
  ELSE
    RETURN 'pg_net extension is NOT installed - low stock alerts will not work';
  END IF;
END;
$$;

-- Add a comment to the function for documentation
COMMENT ON FUNCTION handle_low_stock_notification() IS 
'Automatically sends email notifications when inventory items reach low stock levels (≤2 units). 
Requires Edge Function "send-low-stock-alert" to be deployed and pg_net extension enabled.
Updated to use proper error handling and logging.';

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION test_low_stock_alert(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_pg_net_status() TO authenticated;