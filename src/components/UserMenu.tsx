import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown, Shield, Crown, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileEditTab, setProfileEditTab] = useState('profile');
  const { user, profile, signOut, isAdmin, isSuisaMember } = useAuth();
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

  const getGroupBadge = () => {
    if (isAdmin) return { icon: Crown, label: 'Administrator', color: 'text-yellow-300' };
    if (isSuisaMember) return { icon: Building2, label: 'SUISA', color: 'text-blue-300' };
    return null;
  };

  const groupBadge = getGroupBadge();

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
            {/* Group Badge */}
            {groupBadge && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <groupBadge.icon className="h-2 w-2 text-white" />
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
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-bounce-in transition-colors duration-300">
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
                    {groupBadge && (
                      <groupBadge.icon className={`h-4 w-4 ${groupBadge.color} flex-shrink-0`} title={groupBadge.label} />
                    )}
                  </div>
                  <p className="text-sm text-white/80 truncate">{user?.email}</p>
                  {groupBadge && (
                    <p className="text-xs text-yellow-200 font-medium">{groupBadge.label}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button 
                onClick={handleProfileEdit}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 group"
              >
                <User className="h-5 w-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200" />
                <span className="font-medium">Profil bearbeiten</span>
              </button>
              
              <button 
                onClick={handleSettings}
                className="w-full flex items-center space-x-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 group"
              >
                <Settings className="h-5 w-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200" />
                <span className="font-medium">Einstellungen</span>
              </button>

              {/* SUISA Access */}
              {isSuisaMember && (
                <>
                  <hr className="my-2 border-slate-200 dark:border-slate-600" />
                  <Link
                    to="/suisa"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group"
                  >
                    <Building2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">SUISA Portal</span>
                  </Link>
                </>
              )}

              {/* Admin Console Link */}
              {isAdmin && (
                <>
                  <hr className="my-2 border-slate-200 dark:border-slate-600" />
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 group"
                  >
                    <Shield className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Admin-Konsole</span>
                  </Link>
                </>
              )}

              <hr className="my-2 border-slate-200 dark:border-slate-600" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
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