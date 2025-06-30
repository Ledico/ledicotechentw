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
      console.log('🔄 Initializing auth...');
      
      try {
        // Get initial session with timeout
        console.log('📡 Getting session...');
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 10000)
        );
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (mounted) {
            setError('Fehler beim Laden der Sitzung: ' + error.message);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        console.log('✅ Session loaded:', session ? 'Active' : 'None');

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setError(null);
          
          if (session?.user) {
            console.log('👤 User found, fetching profile...');
            await fetchProfile(session.user.id);
          } else {
            console.log('👤 No user session');
            setProfile(null);
            setLoading(false);
          }
          setInitialized(true);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setError('Verbindungsfehler beim Initialisieren');
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up auth listener
    console.log('👂 Setting up auth listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      setError(null);
      
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
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('📡 Fetching profile for user:', userId);
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 15000)
      );
      
      const { data, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('❌ Error fetching profile:', error);
        if (error.code === 'PGRST116') {
          console.log('ℹ️ Profile not found, will be created by trigger');
          // Wait a bit and try again
          setTimeout(() => fetchProfile(userId), 2000);
        } else {
          setError('Fehler beim Laden des Profils');
        }
      } else {
        console.log('✅ Profile loaded:', data);
        setProfile(data);
        setError(null);
      }
    } catch (error) {
      console.error('❌ Profile fetch error:', error);
      setError('Timeout beim Laden des Profils');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('📝 Signing up user:', email);
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
        console.error('❌ Sign up error:', error);
        setError('Registrierungsfehler: ' + error.message);
      } else {
        console.log('✅ Sign up successful');
      }
      
      return { data, error };
    } catch (error) {
      console.error('❌ Sign up exception:', error);
      const errorMsg = 'Verbindungsfehler bei der Registrierung';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Signing in user:', email);
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        setError('Anmeldefehler: ' + error.message);
      } else {
        console.log('✅ Sign in successful');
      }
      
      return { data, error };
    } catch (error) {
      console.error('❌ Sign in exception:', error);
      const errorMsg = 'Verbindungsfehler bei der Anmeldung';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setUser(null);
        setProfile(null);
        setSession(null);
        console.log('✅ Sign out successful');
      } else {
        console.error('❌ Sign out error:', error);
        setError('Abmeldefehler: ' + error.message);
      }
      return { error };
    } catch (error) {
      console.error('❌ Sign out exception:', error);
      const errorMsg = 'Verbindungsfehler bei der Abmeldung';
      setError(errorMsg);
      return { error: new Error(errorMsg) };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    console.log('🔄 Updating profile:', updates);

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
        console.log('✅ Profile updated successfully:', data);
        setProfile(data);
        setError(null);
        
        // Force a re-fetch to ensure we have the latest data
        setTimeout(() => {
          fetchProfile(user.id);
        }, 500);
      } else if (error) {
        console.error('❌ Profile update error:', error);
        setError('Fehler beim Aktualisieren des Profils: ' + error.message);
      }

      return { data, error };
    } catch (error) {
      console.error('❌ Profile update exception:', error);
      const errorMsg = 'Verbindungsfehler beim Aktualisieren des Profils';
      setError(errorMsg);
      return { data: null, error: new Error(errorMsg) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    console.log('🔐 Updating password for user:', user.email);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Password update error:', error);
        return { error };
      } else {
        console.log('✅ Password updated successfully');
        return { data, error: null };
      }
    } catch (error) {
      console.error('❌ Password update exception:', error);
      const errorMsg = 'Verbindungsfehler beim Ändern des Passworts';
      return { data: null, error: new Error(errorMsg) };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { error: new Error('Kein Benutzer angemeldet') };

    console.log('🗑️ Deleting account for user:', user.email);

    try {
      // First delete the profile from our database
      console.log('🗑️ Deleting profile from database...');
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('❌ Profile deletion error:', profileError);
        return { error: new Error('Fehler beim Löschen des Profils: ' + profileError.message) };
      }

      console.log('✅ Profile deleted from database');

      // Then delete the user from Supabase Auth
      console.log('🗑️ Deleting user from auth...');
      const { error: authError } = await supabase.rpc('delete_user');

      if (authError) {
        console.error('❌ Auth user deletion error:', authError);
        // Even if auth deletion fails, we've already deleted the profile
        // So we should still sign out the user
      } else {
        console.log('✅ User deleted from auth');
      }

      // Clear local state regardless of auth deletion result
      setUser(null);
      setProfile(null);
      setSession(null);
      setError(null);

      console.log('✅ Account deletion completed');
      return { error: null };

    } catch (error) {
      console.error('❌ Account deletion exception:', error);
      const errorMsg = 'Verbindungsfehler beim Löschen des Kontos';
      return { error: new Error(errorMsg) };
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return profile?.is_admin || false;
  };

  // Check if current user is SUISA member (temporary implementation)
  const isSuisaMember = () => {
    // Temporary: Check if group_name exists and equals 'SUISA', or if user is admin
    return (profile as any)?.group_name === 'SUISA' || profile?.is_admin || false;
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