import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  MoreVertical,
  Crown,
  User,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Activity,
  TrendingUp,
  TrendingDown,
  Building2,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../hooks/useAuth';
import { AdminUserView } from '../lib/supabase';

const AdminConsole: React.FC = () => {
  const { users, loading, error, promoteToAdmin, revokeAdmin, assignToSuisa, removeFromSuisa, updateUser, deleteUser } = useAdmin();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'suisa' | 'user'>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUserView | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [securityData, setSecurityData] = useState<any[]>([]);
  const [securityLoading, setSecurityLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || 
                         (filterRole === 'admin' && user.is_admin) ||
                         (filterRole === 'suisa' && user.group_name === 'SUISA') ||
                         (filterRole === 'user' && !user.is_admin && user.group_name !== 'SUISA');
    return matchesSearch && matchesFilter;
  });

  // Load security dashboard data (only for admins)
  const loadSecurityData = async () => {
    if (!profile?.is_admin) return;
    
    setSecurityLoading(true);
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('security_dashboard')
        .select('*');
      
      if (error) {
        console.error('Error loading security data:', error);
      } else {
        setSecurityData(data || []);
      }
    } catch (err) {
      console.error('Error loading security dashboard:', err);
    } finally {
      setSecurityLoading(false);
    }
  };

  // Load security data on component mount
  React.useEffect(() => {
    if (profile?.is_admin) {
      loadSecurityData();
    }
  }, [profile?.is_admin]);

  const handlePromoteToAdmin = async (userId: string) => {
    setActionLoading(userId);
    setActionError(null);
    try {
      await promoteToAdmin(userId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Fehler beim Befördern');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    setActionLoading(userId);
    setActionError(null);
    try {
      await revokeAdmin(userId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Fehler beim Entziehen der Admin-Rechte');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignToSuisa = async (userId: string) => {
    setActionLoading(userId);
    setActionError(null);
    try {
      await assignToSuisa(userId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Fehler beim Zuweisen zur SUISA-Gruppe');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromSuisa = async (userId: string) => {
    setActionLoading(userId);
    setActionError(null);
    try {
      await removeFromSuisa(userId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Fehler beim Entfernen aus der SUISA-Gruppe');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(selectedUser.id);
    setActionError(null);
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || 'U';
  };

  const getSecurityMetricIcon = (metric: string, alertLevel: string) => {
    if (metric.includes('Failed')) {
      return alertLevel === 'error' ? TrendingUp : alertLevel === 'warning' ? TrendingUp : TrendingDown;
    }
    return Activity;
  };

  const getSecurityMetricColor = (alertLevel: string) => {
    switch (alertLevel) {
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const getUserRoleBadge = (user: AdminUserView) => {
    if (user.is_admin) {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
          <Crown className="h-3 w-3" />
          <span>Administrator</span>
        </span>
      );
    } else if (user.group_name === 'SUISA') {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
          <Building2 className="h-3 w-3" />
          <span>SUISA</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
          <User className="h-3 w-3" />
          <span>Benutzer</span>
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Lade Benutzerdaten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin-Konsole</h1>
                <p className="text-slate-600 dark:text-slate-400">Benutzerverwaltung und Systemkontrolle</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>Angemeldet als: {profile?.full_name || profile?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {(error || actionError) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span>{error || actionError}</span>
          </div>
        )}

        {/* Security Dashboard */}
        {profile?.is_admin && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sicherheits-Dashboard</h2>
              <button
                onClick={loadSecurityData}
                disabled={securityLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
              >
                {securityLoading ? 'Lädt...' : 'Aktualisieren'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {securityData.map((item, index) => {
                const IconComponent = getSecurityMetricIcon(item.metric, item.alert_level);
                const colorClass = getSecurityMetricColor(item.alert_level);
                
                return (
                  <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.metric}</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Gesamt Benutzer</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Administratoren</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {users.filter(user => user.is_admin).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">SUISA Mitglieder</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {users.filter(user => user.group_name === 'SUISA').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Normale Benutzer</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {users.filter(user => !user.is_admin && user.group_name !== 'SUISA').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Benutzer suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'suisa' | 'user')}
                className="pl-10 pr-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Alle Rollen</option>
                <option value="admin">Nur Admins</option>
                <option value="suisa">Nur SUISA</option>
                <option value="user">Nur Benutzer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Benutzer</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Rolle/Gruppe</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Registriert</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-900 dark:text-white">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-150">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(user.full_name, user.email)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {user.full_name || 'Kein Name'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getUserRoleBadge(user)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {user.id !== profile?.id && (
                          <>
                            {/* Admin Actions */}
                            {user.is_admin ? (
                              <button
                                onClick={() => handleRevokeAdmin(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Admin-Rechte entziehen"
                              >
                                {actionLoading === user.id ? (
                                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handlePromoteToAdmin(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Zum Admin befördern"
                              >
                                {actionLoading === user.id ? (
                                  <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                ) : (
                                  <ShieldCheck className="h-4 w-4" />
                                )}
                              </button>
                            )}

                            {/* SUISA Actions */}
                            {user.group_name === 'SUISA' ? (
                              <button
                                onClick={() => handleRemoveFromSuisa(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Aus SUISA-Gruppe entfernen"
                              >
                                {actionLoading === user.id ? (
                                  <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin"></div>
                                ) : (
                                  <UserMinus className="h-4 w-4" />
                                )}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAssignToSuisa(user.id)}
                                disabled={actionLoading === user.id}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Zur SUISA-Gruppe hinzufügen"
                              >
                                {actionLoading === user.id ? (
                                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                                ) : (
                                  <UserPlus className="h-4 w-4" />
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                              title="Benutzer löschen"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {user.id === profile?.id && (
                          <span className="text-xs text-slate-400 italic">Sie selbst</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">Keine Benutzer gefunden</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Benutzer löschen</h3>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Sind Sie sicher, dass Sie den Benutzer <strong>{selectedUser.full_name || selectedUser.email}</strong> löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading === selectedUser.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {actionLoading === selectedUser.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Löschen...</span>
                  </>
                ) : (
                  <span>Löschen</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;