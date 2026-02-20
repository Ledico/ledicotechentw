import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (mounted) {
            setError('Fehler beim Laden der Sitzung: ' + error.message);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);

          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
          setInitialized(true);
        }
      } catch (error) {
        if (mounted) {
          setError('Verbindungsfehler beim Initialisieren');
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, retryCount = 0) => {
    const maxRetries = 3;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        setError('Fehler beim Laden des Profils');
        setLoading(false);
        return;
      }

      if (!data && retryCount < maxRetries) {
        setTimeout(() => fetchProfile(userId, retryCount + 1), 1000);
        return;
      }

      if (!data) {
        setError('Profil konnte nicht geladen werden');
        setLoading(false);
        return;
      }

      setProfile(data);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError('Fehler beim Laden des Profils');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setError('Registrierungsfehler: ' + error.message);
      }

      return { data, error };
    } catch (error) {
      const errorMsg = 'Verbindungsfehler bei der Registrierung';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('Anmeldefehler: ' + error.message);
      }

      return { data, error };
    } catch (error) {
      const errorMsg = 'Verbindungsfehler bei der Anmeldung';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
      } else {
        setError('Abmeldefehler: ' + error.message);
      }
      return { error };
    } catch (error) {
      const errorMsg = 'Verbindungsfehler bei der Abmeldung';
      setError(errorMsg);
      return { error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        setError(null);

        setTimeout(() => {
          fetchProfile(user.id);
        }, 500);
      } else if (error) {
        setError('Fehler beim Aktualisieren des Profils: ' + error.message);
      }

      return { data, error };
    } catch (error) {
      const errorMsg = 'Verbindungsfehler beim Aktualisieren des Profils';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { error };
      } else {
        return { data, error: null };
      }
    } catch (error) {
      const errorMsg = 'Verbindungsfehler beim Ändern des Passworts';
      return { data: null, error: new Error(errorMsg) };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        return { error: new Error('Fehler beim Löschen des Profils: ' + profileError.message) };
      }

      await supabase.rpc('delete_user');

      setUser(null);
      setProfile(null);
      setSession(null);
      setError(null);

      return { error: null };
    } catch (error) {
      const errorMsg = 'Verbindungsfehler beim Löschen des Kontos';
      return { error: new Error(errorMsg) };
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return profile?.is_admin || false;
  };

  // Check if current user is SUISA member
  const isSuisaMember = () => {
    return profile?.group_name === 'SUISA' || profile?.is_admin || false;
  };

  return {
    user,
    profile,
    session,
    loading: loading || !initialized,
    error,
    isAdmin: isAdmin(),
    isSuisaMember: isSuisaMember(),
    signUp,
    signIn,
    signOut,
    updateProfile,
    updatePassword,
    deleteAccount,
    hasValidConfig: true, // Always true now
  };
}