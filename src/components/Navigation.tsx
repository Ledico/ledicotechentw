import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogIn, AlertTriangle, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '#home', label: 'Start' },
    { href: '#about', label: 'Über mich' },
    { href: '#services', label: 'Leistungen' },
    { href: '#portfolio', label: 'Projekte' },
    { href: '#certifications', label: 'Zertifikate' },
    { href: '#contact', label: 'Kontakt' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <User className={`h-6 w-6 md:h-8 md:w-8 ${
                scrolled 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-white'
              }`} />
              <span className={`text-base md:text-lg lg:text-xl font-bold ${
                scrolled 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-white'
              }`}>
                Leonardo Dias Costa
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`transition-colors duration-200 hover:text-purple-500 ${
                    scrolled 
                      ? 'text-slate-700 dark:text-slate-300' 
                      : 'text-white/90'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                onClick={toggleTheme}
                className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  scrolled
                    ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    : 'text-white/90 hover:bg-white/10'
                }`}
                aria-label={theme === 'dark' ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* Auth Section */}
              <div className="flex items-center">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                    <span className={`text-sm ${
                      scrolled 
                        ? 'text-slate-600 dark:text-slate-400' 
                        : 'text-white/80'
                    }`}>
                      Lädt...
                    </span>
                  </div>
                ) : error ? (
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Verbindungsfehler</span>
                  </div>
                ) : user ? (
                  <UserMenu />
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                      scrolled 
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700' 
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="font-medium">Anmelden</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden ${
                scrolled 
                  ? 'text-slate-900 dark:text-white' 
                  : 'text-white'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-800 shadow-lg transition-colors duration-300 max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-3 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-purple-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                
                <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5 mr-3" />
                    ) : (
                      <Moon className="h-5 w-5 mr-3" />
                    )}
                    {theme === 'dark' ? 'Hellmodus' : 'Dunkelmodus'}
                  </button>
                </div>

                {/* Mobile Auth Section */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                  {loading ? (
                    <div className="px-3 py-2 flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                      <span className="text-slate-600 dark:text-slate-400">Lädt...</span>
                    </div>
                  ) : error ? (
                    <div className="px-3 py-2 text-red-600 text-sm flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Verbindungsfehler</span>
                    </div>
                  ) : user ? (
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {user.email?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-white bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 mx-3 my-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="font-medium">Anmelden</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navigation;