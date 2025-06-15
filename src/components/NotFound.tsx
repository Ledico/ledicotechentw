import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, MapPin, Compass, Map, Navigation, Plane, Camera, Backpack, Zap, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [compassRotation, setCompassRotation] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Trigger animations after component mounts
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    
    // Rotate compass continuously
    const compassInterval = setInterval(() => {
      setCompassRotation(prev => (prev + 5) % 360);
    }, 100);

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000 + Math.random() * 2000);

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearInterval(compassInterval);
      clearInterval(glitchInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated grid background */}
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

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400/30 rotate-45 animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-40 w-3 h-3 bg-pink-400/30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 right-20 w-5 h-5 bg-yellow-400/30 rotate-12 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Glitch overlay */}
      {glitchActive && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute inset-0 bg-red-500/10 animate-glitch-1"></div>
          <div className="absolute inset-0 bg-cyan-500/10 animate-glitch-2"></div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">
          
          {/* Status bar */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-red-500/30 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <WifiOff className="h-4 w-4 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-mono">CONNECTION LOST</span>
                </div>
                <div className="text-white/60 font-mono">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Giant 404 with multiple effects */}
          <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Main 404 text */}
              <h1 className={`text-9xl sm:text-[12rem] lg:text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-cyan-500 animate-gradient-x relative select-none ${glitchActive ? 'animate-glitch' : ''}`}>
                404
              </h1>
              
              {/* Glitch duplicates */}
              <h1 className={`absolute inset-0 text-9xl sm:text-[12rem] lg:text-[15rem] font-black text-red-500/30 ${glitchActive ? 'animate-glitch-1' : 'opacity-0'} select-none`}>
                404
              </h1>
              <h1 className={`absolute inset-0 text-9xl sm:text-[12rem] lg:text-[15rem] font-black text-cyan-500/30 ${glitchActive ? 'animate-glitch-2' : 'opacity-0'} select-none`}>
                404
              </h1>
              
              {/* Neon glow effect */}
              <div className="absolute inset-0 text-9xl sm:text-[12rem] lg:text-[15rem] font-black text-purple-500/20 blur-xl animate-pulse select-none">
                404
              </div>
              
              {/* Electric sparks */}
              <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Error message with terminal style */}
          <div className={`mb-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-8 border border-red-500/30 max-w-2xl mx-auto font-mono text-left">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-white/60 text-sm ml-4">system_error.log</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="text-red-400">
                  <span className="text-white/40">[ERROR]</span> Page not found at requested location
                </div>
                <div className="text-yellow-400">
                  <span className="text-white/40">[WARN]</span> Navigation system recalibrating...
                </div>
                <div className="text-green-400">
                  <span className="text-white/40">[INFO]</span> Alternative routes available
                </div>
                <div className="text-cyan-400">
                  <span className="text-white/40">[DEBUG]</span> Compass pointing to safe harbor
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Compass with holographic effect */}
          <div className={`relative mb-12 h-48 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Holographic rings */}
                <div className="absolute inset-0 w-40 h-40 border border-cyan-400/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 w-36 h-36 border border-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-4 w-32 h-32 border border-pink-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                
                {/* Main compass */}
                <div className="w-36 h-36 border-4 border-gradient-to-r from-cyan-400 to-purple-500 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                  {/* Inner glow */}
                  <div className="absolute inset-2 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full"></div>
                  
                  {/* Compass needle with enhanced animation */}
                  <div 
                    className="absolute inset-6 transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                  >
                    <div className="relative w-full h-full">
                      {/* North pointer (glowing red) */}
                      <div className="absolute top-0 left-1/2 w-1.5 h-12 bg-gradient-to-t from-red-600 to-red-400 transform -translate-x-1/2 origin-bottom rounded-full shadow-lg shadow-red-500/50"></div>
                      {/* South pointer (glowing white) */}
                      <div className="absolute bottom-0 left-1/2 w-1.5 h-12 bg-gradient-to-b from-white to-slate-300 transform -translate-x-1/2 origin-top rounded-full shadow-lg shadow-white/50"></div>
                      {/* Center orb */}
                      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Cardinal directions with enhanced styling */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl bg-red-500/20 px-2 py-1 rounded backdrop-blur-sm">N</div>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl bg-slate-500/20 px-2 py-1 rounded backdrop-blur-sm">S</div>
                  <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-white font-bold text-xl bg-slate-500/20 px-2 py-1 rounded backdrop-blur-sm">W</div>
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-white font-bold text-xl bg-slate-500/20 px-2 py-1 rounded backdrop-blur-sm">E</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern error message */}
          <div className={`mb-12 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <AlertTriangle className="h-8 w-8 text-yellow-400 animate-bounce" />
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Route nicht gefunden!
                </h2>
              </div>
              
              <p className="text-xl text-white/80 mb-4">
                Ihr digitaler Kompass hat Sie in unbekanntes Terrain geführt.
              </p>
              <p className="text-lg text-white/60">
                Keine Sorge - wir navigieren Sie sicher zurück zur Zivilisation!
              </p>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center mb-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link
              to="/"
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <Home className="h-6 w-6 relative z-10" />
              <span className="relative z-10">Zur Startseite navigieren</span>
              <Zap className="h-5 w-5 relative z-10 animate-pulse" />
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group flex items-center space-x-3 px-8 py-4 border-2 border-cyan-400/50 text-white font-semibold rounded-xl hover:bg-cyan-400/10 hover:border-cyan-400/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              <Navigation className="h-6 w-6 relative z-10" />
              <span className="relative z-10">Zurück zur letzten Position</span>
            </button>
          </div>

          {/* Enhanced CERN legend with modern styling */}
          <div className={`p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-white font-bold text-xl">Die CERN 404-Legende</span>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-400 font-semibold mb-2">🏢 Die Legende</h4>
                <p className="text-white/70">
                  Der HTTP-Fehlercode "404" stammt angeblich vom CERN-Server im Raum 404, 
                  der oft nicht erreichbar war.
                </p>
              </div>
              
              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <h4 className="text-red-400 font-semibold mb-2">🔍 Die Wahrheit</h4>
                <p className="text-white/70">
                  Das ist nur eine urbane Legende! "404" bedeutet einfach "Not Found" 
                  und wurde als HTTP-Standard definiert.
                </p>
              </div>
              
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                <h4 className="text-green-400 font-semibold mb-2">💡 Warum so beliebt?</h4>
                <p className="text-white/70">
                  Die Geschichte macht den abstrakten Fehlercode menschlicher und greifbarer. 
                  Manchmal sind die schönsten Geschichten eben nicht wahr!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating tech elements */}
      <div className="absolute top-1/4 right-8 text-cyan-400/30 animate-float">
        <Compass className="h-12 w-12" />
      </div>
      <div className="absolute top-1/3 left-8 text-purple-400/30 animate-float" style={{ animationDelay: '1s' }}>
        <MapPin className="h-10 w-10" />
      </div>
      <div className="absolute bottom-1/4 right-16 text-pink-400/30 animate-float" style={{ animationDelay: '2s' }}>
        <Zap className="h-8 w-8" />
      </div>
    </div>
  );
};

export default NotFound;