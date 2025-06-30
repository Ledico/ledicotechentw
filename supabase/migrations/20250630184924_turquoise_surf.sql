-- Enable pg_net extension for HTTP requests from database functions
-- This is required for the low stock email notifications to work

-- Enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Grant necessary permissions for the extension
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA net TO postgres, anon, authenticated, service_role;

-- Set up the service role key for Edge Function calls
-- Note: This should be set in your Supabase project settings
-- ALTER DATABASE postgres SET "app.settings.service_role_key" TO 'your-service-role-key-here';

-- Create a function to test the notification system manually
CREATE OR REPLACE FUNCTION test_email_notification()
RETURNS boolean AS $$
DECLARE
  payload jsonb;
  response text;
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can test notifications';
  END IF;

  -- Prepare test payload
  payload := jsonb_build_object(
    'record', jsonb_build_object(
      'id', gen_random_uuid(),
      'name', 'Test Artikel',
      'category', 'Test Kategorie',
      'description', 'Dies ist ein Test für das E-Mail-Benachrichtigungssystem',
      'quantity', 1,
      'unit', 'Stück',
      'status', 'verfügbar',
      'updated_at', now()
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
    
    RAISE NOTICE 'Test notification sent successfully';
    RETURN true;
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Failed to send test notification: %', SQLERRM;
    RETURN false;
  END;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

-- Add comment explaining the test function
COMMENT ON FUNCTION test_email_notification() IS 
'Test function for admins to manually trigger a test email notification to verify the system is working.';