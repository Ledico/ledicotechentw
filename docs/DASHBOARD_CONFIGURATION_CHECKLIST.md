# 📋 Supabase Dashboard Configuration Checklist

## 🚨 Critical Security Settings (Manual Configuration Required)

### Authentication Settings
Navigate to: **Authentication** → **Settings**

#### Email Provider Configuration
- [ ] **OTP Expiry**: Set to `600` seconds (10 minutes)
- [ ] **Rate Limiting**: Enable
- [ ] **Max OTP attempts per hour**: Set to `5`
- [ ] **Email confirmation**: Configure as needed
- [ ] **Double confirm password**: Enable

#### Security Features
- [ ] **Leaked Password Protection**: ⚠️ **ENABLE THIS** (Critical!)
- [ ] **Password strength**: Set minimum requirements
- [ ] **Session timeout**: Configure appropriate timeout

#### Rate Limiting
- [ ] **Enable rate limiting**: Yes
- [ ] **Requests per second**: 10-20 (recommended)
- [ ] **Requests per minute**: 100-200 (recommended)

### Database Settings
Navigate to: **Settings** → **Database**

#### Security
- [ ] **SSL enforcement**: Enable
- [ ] **Connection pooling**: Configure if needed
- [ ] **Read replicas**: Set up if required

### API Settings
Navigate to: **Settings** → **API**

#### CORS Configuration
- [ ] **Allowed origins**: Configure for your domain
- [ ] **Allowed methods**: GET, POST, PUT, DELETE, OPTIONS
- [ ] **Allowed headers**: Content-Type, Authorization

### Project Settings
Navigate to: **Settings** → **General**

#### Security
- [ ] **Two-factor authentication**: Enable for your account
- [ ] **Project access**: Review team member permissions
- [ ] **API keys**: Rotate if compromised

## 🔍 Verification Steps

After configuration:

1. **Test OTP Flow**:
   ```
   - Request OTP
   - Wait 10 minutes
   - Try to use expired OTP (should fail)
   ```

2. **Test Rate Limiting**:
   ```
   - Request multiple OTPs quickly
   - Should be blocked after 5 attempts
   ```

3. **Test Password Protection**:
   ```
   - Try common passwords (should be rejected)
   - Use strong passwords (should be accepted)
   ```

4. **Monitor Logs**:
   ```sql
   SELECT * FROM otp_attempts 
   WHERE attempted_at > now() - interval '1 hour';
   ```

## 📊 Security Monitoring

Use these SQL queries to monitor security:

```sql
-- Check security configuration status
SELECT * FROM check_security_configuration();

-- Run security audit
SELECT * FROM security_audit();

-- View security dashboard
SELECT * FROM security_dashboard;

-- Check recent failed attempts
SELECT email, COUNT(*) as failed_attempts
FROM otp_attempts 
WHERE success = false 
  AND attempted_at > now() - interval '24 hours'
GROUP BY email
ORDER BY failed_attempts DESC;
```

## 🚨 Priority Actions

**Immediate (Critical)**:
1. Set OTP expiry to 600 seconds
2. Enable leaked password protection
3. Enable rate limiting

**High Priority**:
1. Configure CORS properly
2. Enable SSL enforcement
3. Set up monitoring

**Medium Priority**:
1. Configure session timeouts
2. Set up read replicas
3. Review team permissions

## 📞 Support

If you encounter issues:
1. Check Supabase documentation
2. Verify your project permissions
3. Contact Supabase support
4. Check community forums

**Remember: These settings cannot be configured via SQL - they must be set in the dashboard!**