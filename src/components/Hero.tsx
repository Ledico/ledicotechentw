import { Suspense, lazy } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const Notebook3D = lazy(() => import('./Notebook3D'));

function NotebookFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <div className="w-48 h-32 md:w-64 md:h-44 border border-cyan-500/30 rounded-lg bg-slate-800/50 backdrop-blur-sm flex items-center justify-center">
          <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="absolute -inset-4 bg-cyan-500/5 rounded-2xl blur-xl" />
      </div>
    </div>
  );
}

const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-move 25s linear infinite'
          }} />
        </div>
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 bg-cyan-300/30 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[35%] left-[35%] w-1 h-1 bg-sky-400/35 rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-[60%] right-[15%] w-1 h-1 bg-cyan-400/25 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">

          <div className="w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] mb-2 md:mb-0 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80 z-10 pointer-events-none" />
            <Suspense fallback={<NotebookFallback />}>
              <Notebook3D />
            </Suspense>
          </div>

          <div className="text-center relative z-20 -mt-8 md:-mt-12">
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-cyan-400 mr-2" />
              <span className="text-cyan-400 font-medium text-xs md:text-sm lg:text-base tracking-widest uppercase">System Engineer & Cloud-Spezialist</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-5 leading-tight">
              Leonardo
              <span className="block bg-gradient-to-r from-cyan-400 to-sky-400 bg-clip-text text-transparent">
                Dias Costa
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-400 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Spezialisiert auf Microsoft Intune, Cloud-Native Lösungen und Enterprise-Systemtechnik
              für digitale Transformation und operative Exzellenz.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <button
                onClick={scrollToAbout}
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-cyan-600 to-sky-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-cyan-500 hover:to-sky-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/20"
              >
                Meine Expertise entdecken
              </button>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-3.5 border border-slate-600 text-slate-300 text-sm md:text-base font-semibold rounded-lg hover:bg-white/5 hover:border-cyan-500/50 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                Kontakt aufnehmen
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button
          onClick={scrollToAbout}
          className="animate-bounce text-white/60 hover:text-cyan-400 transition-colors duration-300"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
