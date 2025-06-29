-- Security Verification Script
-- Run this after configuring dashboard settings

-- 1. Check if all security functions are working
SELECT 'Testing security functions...' as status;

-- Test security configuration check
SELECT * FROM check_security_configuration();

-- Test security audit
SELECT * FROM security_audit();

-- Test security dashboard
SELECT * FROM security_dashboard;

-- 2. Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ DISABLED - SECURITY RISK!'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'otp_attempts')
ORDER BY tablename;

-- 3. Check admin users
SELECT 
  '👑 Admin Users' as category,
  email,
  full_name,
  created_at,
  CASE 
    WHEN is_admin THEN '✅ Admin'
    ELSE '👤 User'
  END as role
FROM profiles 
WHERE is_admin = true
ORDER BY created_at;

-- 4. Check recent OTP attempts
SELECT 
  '🔐 Recent OTP Attempts (Last 24h)' as category,
  email,
  attempted_at,
  success,
  ip_address,
  CASE 
    WHEN success THEN '✅ Success'
    ELSE '❌ Failed'
  END as result
FROM otp_attempts 
WHERE attempted_at > now() - interval '24 hours'
ORDER BY attempted_at DESC
LIMIT 20;

-- 5. Check for suspicious activity
SELECT 
  '⚠️ Suspicious Activity' as category,
  email,
  COUNT(*) as failed_attempts,
  MIN(attempted_at) as first_attempt,
  MAX(attempted_at) as last_attempt
FROM otp_attempts 
WHERE success = false 
  AND attempted_at > now() - interval '24 hours'
GROUP BY email
HAVING COUNT(*) > 3
ORDER BY failed_attempts DESC;

-- 6. Test OTP expiry function
SELECT 
  '⏰ OTP Expiry Test' as category,
  is_otp_expired(now() - interval '5 minutes', 600) as should_be_false,
  is_otp_expired(now() - interval '15 minutes', 600) as should_be_true,
  CASE 
    WHEN is_otp_expired(now() - interval '5 minutes', 600) = false 
     AND is_otp_expired(now() - interval '15 minutes', 600) = true
    THEN '✅ OTP expiry function working correctly'
    ELSE '❌ OTP expiry function has issues'
  END as test_result;

-- 7. Test rate limiting function
SELECT 
  '🚦 Rate Limiting Test' as category,
  check_otp_rate_limit('test@example.com', 5, 60) as should_be_false,
  CASE 
    WHEN check_otp_rate_limit('test@example.com', 5, 60) = false
    THEN '✅ Rate limiting function working'
    ELSE '⚠️ Rate limiting function may have issues'
  END as test_result;

-- 8. Summary
SELECT 
  '📊 Security Summary' as category,
  (SELECT COUNT(*) FROM profiles) as total_users,
  (SELECT COUNT(*) FROM profiles WHERE is_admin = true) as admin_users,
  (SELECT COUNT(*) FROM otp_attempts WHERE attempted_at > now() - interval '24 hours') as otp_attempts_24h,
  (SELECT COUNT(*) FROM otp_attempts WHERE success = false AND attempted_at > now() - interval '24 hours') as failed_attempts_24h;

-- Instructions for manual verification
SELECT '📋 Manual Verification Required:' as instructions
UNION ALL
SELECT '1. Go to Supabase Dashboard → Authentication → Settings'
UNION ALL
SELECT '2. Verify OTP Expiry is set to 600 seconds'
UNION ALL
SELECT '3. Verify Rate Limiting is enabled (5 attempts/hour)'
UNION ALL
SELECT '4. Verify Leaked Password Protection is enabled'
UNION ALL
SELECT '5. Test OTP flow with 10-minute expiry'
UNION ALL
SELECT '6. Test rate limiting by making multiple requests'
UNION ALL
SELECT '7. Monitor this dashboard regularly for security issues';