import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              LC
            </Link>
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Leonardo Costa. Alle Rechte vorbehalten.
            </p>
          </div>

          <button
            onClick={scrollTop}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-200 group"
            aria-label="Nach oben scrollen"
          >
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
