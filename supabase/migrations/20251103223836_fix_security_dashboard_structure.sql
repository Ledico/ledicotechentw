/*
  # Fix Security Dashboard View Structure

  1. Problem
    - AdminConsole expects security_dashboard to return rows with columns: metric, value, alert_level
    - Current view returns a single row with multiple columns
    
  2. Solution
    - Restructure view to return multiple rows (one per metric)
    - Each row has: metric (name), value (number), alert_level (success/warning/error)
    
  3. Changes
    - Drop and recreate security_dashboard view with correct structure
    - Add proper alert levels based on thresholds
*/

-- Drop existing view
DROP VIEW IF EXISTS security_dashboard;

-- Create new view with proper structure for AdminConsole
CREATE OR REPLACE VIEW security_dashboard AS
SELECT 
  'Gesamt Benutzer' as metric,
  (SELECT COUNT(*)::text FROM profiles) as value,
  'info' as alert_level
UNION ALL
SELECT 
  'Administratoren' as metric,
  (SELECT COUNT(*)::text FROM profiles WHERE is_admin = true) as value,
  'info' as alert_level
UNION ALL
SELECT 
  'SUISA Mitglieder' as metric,
  (SELECT COUNT(*)::text FROM profiles WHERE group_name = 'suisa') as value,
  'info' as alert_level
UNION ALL
SELECT 
  'Normale Benutzer' as metric,
  (SELECT COUNT(*)::text FROM profiles WHERE group_name = 'user' OR group_name IS NULL) as value,
  'info' as alert_level
UNION ALL
SELECT 
  'Aktive Sitzungen (1h)' as metric,
  (SELECT COUNT(*)::text 
   FROM profiles 
   WHERE updated_at > NOW() - INTERVAL '1 hour') as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM profiles WHERE updated_at > NOW() - INTERVAL '1 hour') > 5 
    THEN 'success'
    ELSE 'info'
  END as alert_level
UNION ALL
SELECT 
  'Fehlgeschlagene OTP (24h)' as metric,
  (SELECT COUNT(*)::text 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '24 hours'
   AND success = false) as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM otp_attempts WHERE attempted_at > NOW() - INTERVAL '24 hours' AND success = false) > 10 
    THEN 'error'
    WHEN (SELECT COUNT(*) FROM otp_attempts WHERE attempted_at > NOW() - INTERVAL '24 hours' AND success = false) > 5 
    THEN 'warning'
    ELSE 'success'
  END as alert_level
UNION ALL
SELECT 
  'Betroffene Benutzer (24h)' as metric,
  (SELECT COUNT(DISTINCT email)::text 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '24 hours'
   AND success = false) as value,
  CASE 
    WHEN (SELECT COUNT(DISTINCT email) FROM otp_attempts WHERE attempted_at > NOW() - INTERVAL '24 hours' AND success = false) > 5 
    THEN 'error'
    WHEN (SELECT COUNT(DISTINCT email) FROM otp_attempts WHERE attempted_at > NOW() - INTERVAL '24 hours' AND success = false) > 2 
    THEN 'warning'
    ELSE 'success'
  END as alert_level
UNION ALL
SELECT 
  'OTP-Versuche (1h)' as metric,
  (SELECT COUNT(*)::text 
   FROM otp_attempts 
   WHERE attempted_at > NOW() - INTERVAL '1 hour') as value,
  CASE 
    WHEN (SELECT COUNT(*) FROM otp_attempts WHERE attempted_at > NOW() - INTERVAL '1 hour') > 20 
    THEN 'warning'
    ELSE 'info'
  END as alert_level;

-- Grant access to authenticated users (RLS will control who can view)
GRANT SELECT ON security_dashboard TO authenticated;

-- Add RLS policy for security_dashboard
ALTER VIEW security_dashboard SET (security_invoker = on);

-- Add comment
COMMENT ON VIEW security_dashboard IS 
'Security metrics dashboard - returns rows with metric, value, and alert_level columns';
