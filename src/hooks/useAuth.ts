import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile, supabaseConfig } from '../lib/supabase';

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
      // Check if Supabase is properly configured
      if (!supabaseConfig.hasValidConfig) {
        const errorMsg = supabaseConfig.isProduction 
          ? 'Supabase ist nicht konfiguriert. Bitte kontaktieren Sie den Administrator.'
          : 'Supabase Umgebungsvariablen fehlen. Bitte .env Datei konfigurieren.';
        
        if (mounted) {
          setError(errorMsg);
          setLoading(false);
          setInitialized(true);
        }
        return;
      }

      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
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
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError('Verbindungsfehler: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Only set up auth listener if Supabase is configured
    if (supabaseConfig.hasValidConfig) {
      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setError(null); // Clear any previous errors
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will be created by trigger');
        } else {
          setError('Fehler beim Laden des Profils: ' + error.message);
        }
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Verbindungsfehler beim Laden des Profils');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabaseConfig.hasValidConfig) {
      return { data: null, error: new Error('Supabase ist nicht konfiguriert') };
    }

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
    if (!supabaseConfig.hasValidConfig) {
      return { data: null, error: new Error('Supabase ist nicht konfiguriert') };
    }

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
    if (!supabaseConfig.hasValidConfig) {
      return { error: new Error('Supabase ist nicht konfiguriert') };
    }

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
    if (!supabaseConfig.hasValidConfig) {
      return { data: null, error: new Error('Supabase ist nicht konfiguriert') };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        setError(null);
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

  // Check if current user is admin
  const isAdmin = () => {
    return profile?.is_admin || false;
  };

  return {
    user,
    profile,
    session,
    loading: loading || !initialized,
    error,
    isAdmin: isAdmin(),
    signUp,
    signIn,
    signOut,
    updateProfile,
    hasValidConfig: supabaseConfig.hasValidConfig,
  };
}