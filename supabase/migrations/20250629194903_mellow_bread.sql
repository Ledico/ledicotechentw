/*
  # Fix OTP Expiry Security Settings

  1. Security Improvements
    - Set OTP expiry to 10 minutes (600 seconds) for better security
    - Configure secure email authentication settings
    - Ensure proper rate limiting for OTP requests

  2. Changes
    - Update auth configuration for shorter OTP expiry
    - Set secure defaults for email authentication
*/

-- Update auth configuration to set OTP expiry to 10 minutes (600 seconds)
-- This needs to be done through the Supabase dashboard or API, but we can document it here

-- Note: The following settings should be configured in your Supabase dashboard:
-- 1. Go to Authentication > Settings
-- 2. Set "OTP Expiry" to 600 seconds (10 minutes)
-- 3. Enable rate limiting for OTP requests
-- 4. Set maximum OTP attempts per hour

-- Create a function to validate OTP expiry times for custom implementations
CREATE OR REPLACE FUNCTION public.is_otp_expired(created_at timestamptz, expiry_seconds integer DEFAULT 600)
RETURNS boolean AS $$
BEGIN
  RETURN (EXTRACT(EPOCH FROM (now() - created_at)) > expiry_seconds);
END;
$$ LANGUAGE plpgsql;

-- Create a table to track OTP attempts for additional security
CREATE TABLE IF NOT EXISTS public.otp_attempts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  ip_address inet,
  attempted_at timestamptz DEFAULT now(),
  success boolean DEFAULT false,
  user_agent text
);

-- Enable RLS on otp_attempts table
ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own OTP attempts
CREATE POLICY "Users can view own OTP attempts"
  ON public.otp_attempts
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

-- Policy for admins to view all OTP attempts
CREATE POLICY "Admins can view all OTP attempts"
  ON public.otp_attempts
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Function to log OTP attempts
CREATE OR REPLACE FUNCTION public.log_otp_attempt(
  user_email text,
  client_ip inet DEFAULT NULL,
  attempt_success boolean DEFAULT false,
  client_user_agent text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  attempt_id uuid;
BEGIN
  INSERT INTO public.otp_attempts (email, ip_address, success, user_agent)
  VALUES (user_email, client_ip, attempt_success, client_user_agent)
  RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has exceeded OTP attempts
CREATE OR REPLACE FUNCTION public.check_otp_rate_limit(
  user_email text,
  max_attempts integer DEFAULT 5,
  time_window_minutes integer DEFAULT 60
)
RETURNS boolean AS $$
DECLARE
  attempt_count integer;
BEGIN
  SELECT COUNT(*)
  INTO attempt_count
  FROM public.otp_attempts
  WHERE email = user_email
    AND attempted_at > (now() - (time_window_minutes || ' minutes')::interval)
    AND success = false;
  
  RETURN attempt_count >= max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_otp_attempts_email_time 
ON public.otp_attempts (email, attempted_at DESC);

-- Clean up old OTP attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_otp_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM public.otp_attempts
  WHERE attempted_at < (now() - interval '24 hours');
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up old OTP attempts
-- Note: This would typically be set up as a cron job or scheduled function
-- For now, we'll create the function and document the need for scheduling

COMMENT ON FUNCTION public.cleanup_old_otp_attempts() IS 
'This function should be scheduled to run daily to clean up old OTP attempts. 
Set up a cron job or use pg_cron extension to run: SELECT cleanup_old_otp_attempts();';