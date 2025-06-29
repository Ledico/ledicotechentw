# User Profile Troubleshooting Guide

## Problem: User logged in but not visible in profiles table

### Diagnosis Steps

1. **Check if user exists in auth.users:**
   ```sql
   SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
   ```

2. **Check if profile exists:**
   ```sql
   SELECT id, email, full_name, is_admin, created_at FROM profiles ORDER BY created_at DESC;
   ```

3. **Check user status:**
   ```sql
   SELECT * FROM check_user_status();
   ```

4. **Check for specific user:**
   ```sql
   SELECT * FROM check_user_status('your-email@example.com');
   ```

### Common Causes & Solutions

#### 1. Profile Not Created (Trigger Failed)
**Symptoms**: User in `auth.users` but not in `profiles`

**Solution**: Run the sync function
```sql
SELECT sync_auth_users_to_profiles();
```

#### 2. RLS Blocking Visibility
**Symptoms**: Profile exists but not visible to current user

**Solution**: Check RLS policies and ensure you're admin
```sql
-- Check if you're admin
SELECT is_admin();

-- Make yourself admin (replace email)
SELECT make_user_admin('your-email@example.com');
```

#### 3. Wrong Table
**Symptoms**: Looking in wrong place

**Solution**: 
- User authentication data: `auth.users` (managed by Supabase)
- User profile data: `public.profiles` (your custom table)

### Quick Fixes

#### Fix 1: Sync Missing Profiles
```sql
SELECT sync_auth_users_to_profiles();
```

#### Fix 2: Make Yourself Admin
```sql
-- Replace with your actual email
SELECT make_user_admin('leonardo@dias-costa.ch');
```

#### Fix 3: Check Everything
```sql
-- See all users and their status
SELECT * FROM check_user_status();

-- See security dashboard
SELECT * FROM security_dashboard;
```

### Verification

After fixes, verify:

1. **Profile exists:**
   ```sql
   SELECT * FROM profiles WHERE email = 'your-email@example.com';
   ```

2. **Admin access works:**
   ```sql
   SELECT is_admin();
   ```

3. **Can see other users (if admin):**
   ```sql
   SELECT email, full_name, is_admin FROM profiles ORDER BY created_at DESC;
   ```

### Prevention

To prevent this in the future:

1. **Trigger is working**: The `handle_new_user()` trigger should create profiles automatically
2. **Error handling**: The trigger now has proper error handling
3. **Sync function**: Run `sync_auth_users_to_profiles()` periodically if needed

### Support

If issues persist:
1. Check Supabase logs for trigger errors
2. Verify RLS policies are correct
3. Ensure database permissions are set up properly
4. Contact support with specific error messages