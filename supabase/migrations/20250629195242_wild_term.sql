/*
  # Fix Function Search Path Security Issues

  1. Security Fixes
    - Add explicit search_path to all functions
    - Remove SECURITY DEFINER where not needed
    - Ensure proper function security

  2. Functions Updated
    - handle_new_user
    - handle_updated_at
    - is_admin
    - promote_to_admin
    - revoke_admin
    - is_otp_expired
    - log_otp_attempt
    - check_otp_rate_limit
    - cleanup_old_otp_attempts
*/

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Fix handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$;

-- Fix promote_to_admin function
CREATE OR REPLACE FUNCTION public.promote_to_admin(user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can promote users to admin';
  END IF;
  
  -- Update the user
  UPDATE public.profiles 
  SET is_admin = true, updated_at = now()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$;

-- Fix revoke_admin function
CREATE OR REPLACE FUNCTION public.revoke_admin(user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can revoke admin status';
  END IF;
  
  -- Prevent removing admin status from self
  IF user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot revoke your own admin status';
  END IF;
  
  -- Update the user
  UPDATE public.profiles 
  SET is_admin = false, updated_at = now()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$;

-- Fix is_otp_expired function
CREATE OR REPLACE FUNCTION public.is_otp_expired(created_at timestamptz, expiry_seconds integer DEFAULT 600)
RETURNS boolean 
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN (EXTRACT(EPOCH FROM (now() - created_at)) > expiry_seconds);
END;
$$;

-- Fix log_otp_attempt function
CREATE OR REPLACE FUNCTION public.log_otp_attempt(
  user_email text,
  client_ip inet DEFAULT NULL,
  attempt_success boolean DEFAULT false,
  client_user_agent text DEFAULT NULL
)
RETURNS uuid 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_id uuid;
BEGIN
  INSERT INTO public.otp_attempts (email, ip_address, success, user_agent)
  VALUES (user_email, client_ip, attempt_success, client_user_agent)
  RETURNING id INTO attempt_id;
  
  RETURN attempt_id;
END;
$$;

-- Fix check_otp_rate_limit function
CREATE OR REPLACE FUNCTION public.check_otp_rate_limit(
  user_email text,
  max_attempts integer DEFAULT 5,
  time_window_minutes integer DEFAULT 60
)
RETURNS boolean 
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
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
$$;

-- Fix cleanup_old_otp_attempts function
CREATE OR REPLACE FUNCTION public.cleanup_old_otp_attempts()
RETURNS void 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.otp_attempts
  WHERE attempted_at < (now() - interval '24 hours');
END;
$$;