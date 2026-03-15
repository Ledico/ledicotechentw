import { useState, useEffect } from 'react';
import { ChevronDown, Download, Mail } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = 'ICT-Fachmann & Junior-ICT-Supporter';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isVisible]);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full p-8">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="bg-cyan-400 rounded-sm h-2 self-center"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Verfügbar für neue Möglichkeiten
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
            Leonardo
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Costa
            </span>
          </h1>

          <div className="h-8 mb-8">
            <p className="text-xl sm:text-2xl text-slate-300 font-light">
              {typedText}
              <span className="animate-pulse text-cyan-400">|</span>
            </p>
          </div>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Leidenschaftlicher IT-Profi mit Fokus auf Cloud-Infrastruktur, Microsoft 365 und modernes Device Management.
            Basierend in der Schweiz.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToContact}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Kontakt aufnehmen
            </button>
            <button
              onClick={scrollToAbout}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
            >
              <Download className="h-5 w-5" />
              Mehr erfahren
            </button>
          </div>
        </div>

        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5 animate-bounce group-hover:text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
