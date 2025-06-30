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

  const assignToSuisa = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    const { data, error } = await supabase.rpc('assign_to_suisa', {
      user_id: userId
    });

    if (error) {
      throw new Error(error.message);
    }

    // Refresh users list
    await fetchUsers();
    return data;
  };

  const removeFromSuisa = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Keine Berechtigung für Admin-Funktionen');
    }

    const { data, error } = await supabase.rpc('remove_from_suisa', {
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

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    // Refresh users list
    await fetchUsers();
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
    assignToSuisa,
    removeFromSuisa,
    updateUser,
    deleteUser,
  };
}