import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email?: string;
  is_admin?: boolean;
}

interface AuthState {
  profile: Profile | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setProfile({
          id: session.user.id,
          email: session.user.email,
          is_admin: session.user.app_metadata?.is_admin ?? false,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setProfile({
          id: session.user.id,
          email: session.user.email,
          is_admin: session.user.app_metadata?.is_admin ?? false,
        });
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { profile, loading };
}
