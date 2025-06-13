import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2025/03/09/263695.mov" type="video/mp4" />
        </video>
        {/* Darker overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
        {/* Additional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cyan-300/30 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Sparkles className="h-8 w-8 text-cyan-400 mr-2 animate-spin-slow" />
            <span className="text-cyan-400 font-medium text-lg">System Engineer & Cloud Specialist</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Modern IT
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Infrastructure
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Specializing in Microsoft Intune, Cloud-Native solutions, and enterprise system engineering 
            that drives digital transformation and operational excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <button 
              onClick={scrollToAbout}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow"
            >
              Explore My Expertise
            </button>
            <button 
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-lg hover:bg-white/20 hover:border-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
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