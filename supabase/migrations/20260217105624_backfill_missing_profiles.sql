/*
  # Backfill Missing Profiles

  1. Purpose
    - Create profiles for any auth.users that don't have one
    - This is a one-time backfill for existing users
    - Future users will get profiles automatically via trigger

  2. Safety
    - Uses ON CONFLICT DO NOTHING to avoid errors
    - Only creates profiles for users without one
    - Uses COALESCE for null handling
*/

-- Create profiles for any users that don't have one
INSERT INTO public.profiles (id, email, full_name, is_admin)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  false
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;