import { useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from './useAuth';

// Use Profile type instead of AdminUserView since we removed the view
export type AdminUserView = Profile;

export function useAdmin() {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    if (!isAdmin) {
      setError('Keine Berechtigung für Admin-Funktionen');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Query profiles table directly instead of using the view
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      setError('Fehler beim Laden der Benutzer');
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    const { data, error } = await supabase.rpc('promote_to_admin', {
      user_id: userId
    });

    if (error) {
      throw new Error(error.message);
    }

    // Refresh users list
    await fetchUsers();
    return data;
  };

  const revokeAdmin = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    const { data, error } = await supabase.rpc('revoke_admin', {
      user_id: userId
    });

    if (error) {
      throw new Error(error.message);
    }

    // Refresh users list
    await fetchUsers();
    return data;
  };

  const updateUser = async (userId: string, updates: Partial<AdminUserView>) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Refresh users list
    await fetchUsers();
    return data;
  };

  const deleteUser = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    console.log('🗑️ Admin deleting user:', userId);

    try {
      // Use the new admin_delete_user function that handles both auth and profile deletion
      const { error } = await supabase.rpc('admin_delete_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('❌ Admin user deletion failed:', error);
        throw new Error(error.message);
      }

      console.log('✅ Admin user deletion successful');
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('❌ Admin user deletion exception:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    promoteToAdmin,
    revokeAdmin,
    updateUser,
    deleteUser,
  };
}