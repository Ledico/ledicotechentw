import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Erfolgreich angemeldet!');
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1000);
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail.');
          setTimeout(() => {
            setIsLogin(true);
            setSuccess('');
          }, 2000);
        }
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-bounce-in transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm animate-fade-in-up">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm animate-fade-in-up">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-slide-in-left">
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vollständiger Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Ihr vollständiger Name"
                  />
                </div>
              </div>
            )}

            <div className="animate-slide-in-left" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="ihre@email.com"
                />
              </div>
            </div>

            <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Ihr Passwort"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-bounce-in"
              style={{ animationDelay: '0.3s' }}
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Wird verarbeitet...</span>
                </>
              ) : (
                <span>{isLogin ? 'Anmelden' : 'Registrieren'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-slate-600 dark:text-slate-400">
              {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}
            </p>
            <button
              onClick={switchMode}
              className="mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors duration-200 hover:underline"
            >
              {isLogin ? 'Jetzt registrieren' : 'Hier anmelden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;