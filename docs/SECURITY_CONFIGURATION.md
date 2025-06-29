# Security Configuration Guide

## OTP (One-Time Password) Security Settings

### Current Issue
The OTP expiry is currently set to more than 1 hour, which poses a security risk.

### Recommended Configuration

#### 1. Supabase Dashboard Settings
Navigate to your Supabase project dashboard and configure the following:

**Authentication > Settings:**
- **OTP Expiry**: Set to `600` seconds (10 minutes)
- **Rate Limiting**: Enable with maximum 5 attempts per hour
- **Email Templates**: Ensure they mention the 10-minute expiry

#### 2. Environment Variables
Add these to your production environment:
```bash
# Supabase Auth Settings (configured in dashboard)
SUPABASE_AUTH_OTP_EXPIRY=600
SUPABASE_AUTH_RATE_LIMIT_EMAIL=5
SUPABASE_AUTH_RATE_LIMIT_WINDOW=3600
```

#### 3. Additional Security Measures

**Email Configuration:**
- Use a secure SMTP provider
- Enable SPF, DKIM, and DMARC records
- Use a dedicated sending domain

**Rate Limiting:**
- Maximum 5 OTP requests per email per hour
- IP-based rate limiting for additional protection
- Progressive delays for repeated failed attempts

**Monitoring:**
- Log all OTP attempts
- Monitor for suspicious patterns
- Alert on excessive failed attempts

### Implementation Steps

1. **Update Supabase Dashboard:**
   ```
   1. Go to Authentication > Settings
   2. Set "OTP Expiry" to 600 seconds
   3. Enable "Rate Limiting"
   4. Set "Max attempts per hour" to 5
   ```

2. **Update Email Templates:**
   - Mention the 10-minute expiry time
   - Include security warnings about not sharing codes
   - Add instructions for requesting new codes

3. **Monitor and Alert:**
   - Set up monitoring for failed OTP attempts
   - Create alerts for suspicious activity
   - Regular security audits

### Database Functions

The migration includes several security functions:

- `is_otp_expired()`: Check if OTP has expired
- `log_otp_attempt()`: Log authentication attempts
- `check_otp_rate_limit()`: Prevent brute force attacks
- `cleanup_old_otp_attempts()`: Maintain database hygiene

### Best Practices

1. **Short Expiry Times**: 10 minutes maximum for OTPs
2. **Rate Limiting**: Prevent brute force attacks
3. **Logging**: Track all authentication attempts
4. **Monitoring**: Alert on suspicious patterns
5. **Clean Up**: Remove old attempt logs regularly

### Testing

After implementing these changes:

1. Test OTP expiry (should expire after 10 minutes)
2. Test rate limiting (should block after 5 failed attempts)
3. Verify logging is working correctly
4. Test cleanup function

### Compliance

These settings help meet security standards:
- **OWASP**: Authentication security guidelines
- **NIST**: Digital identity guidelines
- **GDPR**: Data protection requirements
- **SOC 2**: Security controls