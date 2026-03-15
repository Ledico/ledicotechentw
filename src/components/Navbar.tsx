import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'Über mich' },
    { href: '#skills', label: 'Skills' },
    { href: '#career', label: 'Werdegang' },
    { href: '#certifications', label: 'Zertifikate' },
    { href: '#portfolio', label: 'Projekte' },
    { href: '#contact', label: 'Kontakt' },
  ];

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    if (!isHome) {
      window.location.href = `/${id}`;
      return;
    }
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-200/50 dark:border-slate-700/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            LC
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isScrolled
                    ? 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Dark mode toggle"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link
              to="/admin/projects"
              className={`hidden md:flex p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/10'
              }`}
              title="Admin"
            >
              <Shield className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-200 ${
                isScrolled
                  ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
