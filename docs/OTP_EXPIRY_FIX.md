# 🔒 OTP Expiry Fix - Manual Configuration Required

## Problem
**Auth OTP Long Expiry**: OTP expiry exceeds recommended threshold (currently > 1 hour)

## ⚠️ CRITICAL: Manual Action Required

This setting **CANNOT** be changed via SQL migrations. You **MUST** configure it manually in the Supabase Dashboard.

## Step-by-Step Fix

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `ayqitipxqhbubhtjiewb`
3. Navigate to **Authentication** → **Settings**

### 2. Configure OTP Settings
Find the **Email** section and update:

```
✅ OTP Expiry: 600 seconds (10 minutes)
✅ Rate Limiting: Enable
✅ Max attempts per hour: 5
```

### 3. Additional Security Settings
While you're there, also configure:

```
⚠️ Leaked Password Protection: ENABLE
✅ Email confirmation: Keep as configured
✅ Double confirm password: Enable
```

### 4. Save Changes
Click **Save** to apply the changes.

## Verification

After making these changes, you can verify by:

1. **Testing OTP expiry**: Request an OTP and wait 10 minutes - it should expire
2. **Rate limiting**: Try requesting multiple OTPs quickly - should be limited
3. **Check logs**: Monitor the `otp_attempts` table for tracking

## Why This Must Be Done Manually

- OTP expiry is an **authentication provider setting**
- It's stored in Supabase's internal configuration
- SQL migrations cannot access these settings
- Only the dashboard/API can modify auth provider configs

## Database Support Functions

The migrations have created supporting functions:

```sql
-- Check if OTP is expired (for custom implementations)
SELECT is_otp_expired(created_at, 600);

-- Check rate limiting
SELECT check_otp_rate_limit('user@example.com');

-- View security status
SELECT * FROM check_security_configuration();
```

## Monitoring

After configuration, monitor with:

```sql
-- Recent OTP attempts
SELECT * FROM otp_attempts 
WHERE attempted_at > now() - interval '1 hour'
ORDER BY attempted_at DESC;

-- Security dashboard
SELECT * FROM security_dashboard;
```

## ✅ Action Items

- [ ] Go to Supabase Dashboard
- [ ] Set OTP Expiry to 600 seconds
- [ ] Enable Rate Limiting (5 attempts/hour)
- [ ] Enable Leaked Password Protection
- [ ] Test OTP functionality
- [ ] Monitor security logs

## Support

If you need help accessing the dashboard or finding these settings:
1. Check your Supabase project URL: `https://ayqitipxqhbubhtjiewb.supabase.co`
2. Ensure you have admin access to the project
3. Contact Supabase support if settings are not visible

**This is the ONLY way to fix the OTP expiry warning!**