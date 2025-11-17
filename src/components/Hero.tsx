import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Animated Background Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        {/* Moving gradient orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-float"></div>
      </div>

      {/* Enhanced gradient background overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/50 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyan-300/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
        {/* Additional floating elements */}
        <div className="absolute top-1/5 right-1/5 w-3 h-3 bg-yellow-400/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-4 md:mb-6" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mr-2" />
            <span className="text-cyan-400 font-medium text-sm md:text-base lg:text-lg">System Engineer & Cloud-Spezialist</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-lg" style={{ animationDelay: '0.4s' }}>
            Leonardo
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Dias Costa
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md" style={{ animationDelay: '0.6s' }}>
            Spezialisiert auf Microsoft Intune, Cloud-Native Lösungen und Enterprise-Systemtechnik 
            für digitale Transformation und operative Exzellenz.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center" style={{ animationDelay: '0.8s' }}>
            <button
              onClick={scrollToAbout}
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Meine Expertise entdecken
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 border-2 border-white/50 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Kontakt aufnehmen
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <button 
          onClick={scrollToAbout}
          className="animate-bounce text-white/80 hover:text-white transition-colors drop-shadow-lg hover:scale-110 duration-300"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
};

export default Hero;