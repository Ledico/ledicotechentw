import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Globe, 
  Trash2,
  Settings,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileEditProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ isOpen, onClose }) => {
  const { user, profile, updateProfile, updatePassword, deleteAccount } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form state - sync with actual profile data
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
  });

  // Sync form data with profile when profile changes or modal opens
  useEffect(() => {
    if (isOpen && profile) {
      console.log('🔄 Syncing form data with profile:', profile);
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
      });
      // Clear any previous messages
      setError('');
      setSuccess('');
    }
  }, [isOpen, profile]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Settings state (simplified - removed email notifications and 2FA)
  const [settings, setSettings] = useState({
    language: 'de',
    theme: 'light',
  });

  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('💾 Submitting profile update:', formData);
      const { error } = await updateProfile(formData);
      if (error) {
        console.error('❌ Profile update failed:', error);
        setError(error.message);
      } else {
        console.log('✅ Profile update successful');
        setSuccess('Profil erfolgreich aktualisiert!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Profile update exception:', err);
      setError('Fehler beim Aktualisieren des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔐 Submitting password change');
      const { error } = await updatePassword(passwordData.newPassword);
      
      if (error) {
        console.error('❌ Password change failed:', error);
        setError('Fehler beim Ändern des Passworts: ' + error.message);
      } else {
        console.log('✅ Password change successful');
        setSuccess('Passwort erfolgreich geändert!');
        setPasswordData({ newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('❌ Password change exception:', err);
      setError('Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Datei ist zu groß. Maximale Größe: 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Nur Bilddateien sind erlaubt');
        return;
      }

      console.log('📷 Processing image upload:', file.name);
      
      // In a real app, you'd upload to Supabase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target?.result as string;
        console.log('✅ Image processed, updating form data');
        setFormData(prev => ({
          ...prev,
          avatar_url: newAvatarUrl
        }));
        setError(''); // Clear any previous errors
      };
      reader.onerror = () => {
        setError('Fehler beim Laden des Bildes');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🗑️ Initiating account deletion...');
      const { error } = await deleteAccount();
      
      if (error) {
        console.error('❌ Account deletion failed:', error);
        setError('Fehler beim Löschen des Kontos: ' + error.message);
        setShowDeleteConfirm(false);
      } else {
        console.log('✅ Account deletion successful');
        // Account deleted successfully, user will be signed out automatically
        // Close the modal
        onClose();
        // Optionally show a success message or redirect
        window.location.href = '/';
      }
    } catch (err) {
      console.error('❌ Account deletion exception:', err);
      setError('Fehler beim Löschen des Kontos');
      setShowDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Reset form when modal closes
  const handleClose = () => {
    setError('');
    setSuccess('');
    setActiveTab('profile');
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  // Removed Activity tab from tabs array
  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'security', label: 'Sicherheit', icon: Lock },
    { id: 'settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold">Profil bearbeiten</h2>
              {/* Show current profile info in header */}
              <div className="flex items-center space-x-2 text-white/80">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(formData.full_name)}
                  </div>
                )}
                <span className="text-sm font-medium">
                  {formData.full_name || user?.email?.split('@')[0] || 'Benutzer'}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in-up">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in-up">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Profil-Informationen</h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                          {getInitials(formData.full_name)}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:scale-110"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">Profilbild</h4>
                      <p className="text-slate-600 text-sm">JPG, PNG oder GIF. Max. 2MB.</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-200 hover:scale-105"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Bild hochladen</span>
                      </button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Name Field */}
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-2">
                      Vollständiger Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Ihr vollständiger Name"
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-Mail-Adresse
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">E-Mail-Adresse kann nicht geändert werden</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Wird gespeichert...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Änderungen speichern</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Sicherheitseinstellungen</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      Neues Passwort
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Neues Passwort"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      Passwort bestätigen
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                        placeholder="Passwort bestätigen"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Wird geändert...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Passwort ändern</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Security Info */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Sicherheitshinweise</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Verwenden Sie ein starkes, einzigartiges Passwort</li>
                    <li>• Passwort sollte mindestens 6 Zeichen lang sein</li>
                    <li>• Kombinieren Sie Groß- und Kleinbuchstaben, Zahlen und Symbole</li>
                    <li>• Teilen Sie Ihr Passwort niemals mit anderen</li>
                  </ul>
                </div>

                {/* Danger Zone - Moved to Security Tab */}
                <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <h4 className="text-lg font-semibold text-red-900">Gefahrenbereich</h4>
                  </div>
                  <p className="text-red-700 text-sm mb-4">
                    Das Löschen Ihres Kontos ist unwiderruflich. Alle Ihre Daten werden permanent entfernt.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Konto löschen</span>
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-800 font-medium mb-2">
                          ⚠️ Sind Sie sicher, dass Sie Ihr Konto löschen möchten?
                        </p>
                        <p className="text-red-700 text-sm">
                          Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten, 
                          einschließlich Profil und Einstellungen, werden permanent gelöscht.
                        </p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={loading}
                          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader className="h-4 w-4 animate-spin" />
                              <span>Wird gelöscht...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              <span>Endgültig löschen</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="animate-fade-in-up">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Einstellungen</h3>
                
                <div className="space-y-6">
                  {/* Language */}
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="h-5 w-5 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Sprache</h4>
                    </div>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Settings className="h-5 w-5 text-slate-600" />
                      <h4 className="text-lg font-semibold text-slate-900">Design</h4>
                    </div>
                    <select
                      value={settings.theme}
                      onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="light">Hell</option>
                      <option value="dark">Dunkel</option>
                      <option value="auto">Automatisch</option>
                    </select>
                  </div>

                  {/* Privacy Info */}
                  <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-lg font-semibold text-green-900 mb-2">Datenschutz</h4>
                    <p className="text-green-800 text-sm">
                      Ihre Daten werden sicher gespeichert und niemals an Dritte weitergegeben. 
                      Wir verwenden moderne Verschlüsselungstechnologien zum Schutz Ihrer Informationen.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;