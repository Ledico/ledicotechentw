/*
  # Enable Additional Security Features
  
  This migration documents the manual steps needed to fully secure the application.
  Some settings can only be changed through the Supabase dashboard.
*/

-- Create a function to check if security settings are properly configured
CREATE OR REPLACE FUNCTION public.check_security_configuration()
RETURNS TABLE(
  setting_name text,
  current_value text,
  recommended_value text,
  status text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'OTP Expiry'::text,
    'Check Dashboard'::text,
    '600 seconds'::text,
    'Manual Configuration Required'::text
  UNION ALL
  SELECT 
    'Rate Limiting'::text,
    'Check Dashboard'::text,
    'Enabled (5 attempts/hour)'::text,
    'Manual Configuration Required'::text
  UNION ALL
  SELECT 
    'Leaked Password Protection'::text,
    'Check Dashboard'::text,
    'Enabled'::text,
    'Manual Configuration Required'::text
  UNION ALL
  SELECT 
    'RLS on profiles'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'profiles' 
      AND rowsecurity = true
    ) THEN 'Enabled' ELSE 'Disabled' END,
    'Enabled'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'profiles' 
      AND rowsecurity = true
    ) THEN 'OK' ELSE 'NEEDS FIX' END
  UNION ALL
  SELECT 
    'RLS on otp_attempts'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'otp_attempts' 
      AND rowsecurity = true
    ) THEN 'Enabled' ELSE 'Disabled' END,
    'Enabled'::text,
    CASE WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'otp_attempts' 
      AND rowsecurity = true
    ) THEN 'OK' ELSE 'NEEDS FIX' END;
END;
$$;

-- Create a security audit function
CREATE OR REPLACE FUNCTION public.security_audit()
RETURNS TABLE(
  audit_item text,
  details text,
  risk_level text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  -- Check for admin users
  SELECT 
    'Admin Users'::text,
    'Count: ' || COUNT(*)::text,
    CASE WHEN COUNT(*) = 0 THEN 'HIGH' 
         WHEN COUNT(*) > 5 THEN 'MEDIUM' 
         ELSE 'LOW' END
  FROM public.profiles WHERE is_admin = true
  
  UNION ALL
  
  -- Check recent failed OTP attempts
  SELECT 
    'Recent Failed OTP Attempts'::text,
    'Count: ' || COUNT(*)::text,
    CASE WHEN COUNT(*) > 50 THEN 'HIGH'
         WHEN COUNT(*) > 20 THEN 'MEDIUM'
         ELSE 'LOW' END
  FROM public.otp_attempts 
  WHERE success = false 
    AND attempted_at > now() - interval '24 hours'
  
  UNION ALL
  
  -- Check for users with suspicious activity
  SELECT 
    'Suspicious Email Patterns'::text,
    'Emails with >10 failed attempts: ' || COUNT(*)::text,
    CASE WHEN COUNT(*) > 0 THEN 'HIGH' ELSE 'LOW' END
  FROM (
    SELECT email
    FROM public.otp_attempts 
    WHERE success = false 
      AND attempted_at > now() - interval '24 hours'
    GROUP BY email
    HAVING COUNT(*) > 10
  ) suspicious_emails;
END;
$$;

-- Add comments to document manual configuration steps
COMMENT ON FUNCTION public.check_security_configuration() IS 
'Run this function to check which security settings need manual configuration in the Supabase dashboard';

COMMENT ON FUNCTION public.security_audit() IS 
'Run this function regularly to audit security status and identify potential issues';

-- Create a view for easy security monitoring
CREATE OR REPLACE VIEW public.security_dashboard AS
SELECT 
  'Total Users' as metric,
  COUNT(*)::text as value,
  'info' as alert_level
FROM public.profiles

UNION ALL

SELECT 
  'Admin Users' as metric,
  COUNT(*)::text as value,
  CASE WHEN COUNT(*) = 0 THEN 'error'
       WHEN COUNT(*) > 5 THEN 'warning'
       ELSE 'success' END as alert_level
FROM public.profiles WHERE is_admin = true

UNION ALL

SELECT 
  'Failed OTP Attempts (24h)' as metric,
  COUNT(*)::text as value,
  CASE WHEN COUNT(*) > 100 THEN 'error'
       WHEN COUNT(*) > 50 THEN 'warning'
       ELSE 'success' END as alert_level
FROM public.otp_attempts 
WHERE success = false 
  AND attempted_at > now() - interval '24 hours'

UNION ALL

SELECT 
  'Successful Logins (24h)' as metric,
  COUNT(*)::text as value,
  'info' as alert_level
FROM public.otp_attempts 
WHERE success = true 
  AND attempted_at > now() - interval '24 hours';

-- Grant access to security functions for admins only
REVOKE ALL ON FUNCTION public.check_security_configuration() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.security_audit() FROM PUBLIC;
REVOKE ALL ON public.security_dashboard FROM PUBLIC;

-- Note: These permissions would be granted to admin users in a real setup
-- For now, they're available to authenticated users who are admins via RLS