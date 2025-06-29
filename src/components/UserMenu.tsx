import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Shield, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileEditTab, setProfileEditTab] = useState('profile');
  const { user, profile, signOut, isAdmin } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleProfileEdit = () => {
    setProfileEditTab('profile');
    setShowProfileEdit(true);
    setIsOpen(false);
  };

  const handleSettings = () => {
    setProfileEditTab('settings');
    setShowProfileEdit(true);
    setIsOpen(false);
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

  const getDisplayName = () => {
    return profile?.full_name || user?.email?.split('@')[0] || 'Benutzer';
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 group"
        >
          {/* Avatar */}
          <div className="relative">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-all duration-200"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20 group-hover:border-white/40 transition-all duration-200 group-hover:scale-110">
                {getInitials(profile?.full_name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            {/* Admin Crown */}
            {isAdmin && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown className="h-2 w-2 text-yellow-800" />
              </div>
            )}
          </div>

          {/* Name and chevron */}
          <div className="hidden sm:flex items-center space-x-1 text-white">
            <span className="text-sm font-medium">{getDisplayName()}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-bounce-in">
            {/* User Info Header */}
            <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3 text-white">
              <div className="flex items-center space-x-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(profile?.full_name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold truncate">{getDisplayName()}</p>
                    {isAdmin && (
                      <Crown className="h-4 w-4 text-yellow-300 flex-shrink-0" title="Administrator" />
                    )}
                  </div>
                  <p className="text-sm text-white/80 truncate">{user?.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-yellow-200 font-medium">Administrator</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button 
                onClick={handleProfileEdit}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors duration-200 group"
              >
                <User className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors duration-200" />
                <span className="font-medium">Profil bearbeiten</span>
              </button>
              
              <button 
                onClick={handleSettings}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors duration-200 group"
              >
                <Settings className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors duration-200" />
                <span className="font-medium">Einstellungen</span>
              </button>

              {/* Admin Console Link */}
              {isAdmin && (
                <>
                  <hr className="my-2 border-slate-200" />
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-purple-700 hover:bg-purple-50 transition-colors duration-200 group"
                  >
                    <Shield className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Admin-Konsole</span>
                  </Link>
                </>
              )}

              <hr className="my-2 border-slate-200" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 group"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Abmelden</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <ProfileEdit 
        isOpen={showProfileEdit} 
        onClose={() => setShowProfileEdit(false)}
        initialTab={profileEditTab}
      />
    </>
  );
};

export default UserMenu;