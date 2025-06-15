import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, Zap, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [motorcycleLeft, setMotorcycleLeft] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    
    // Start motorcycle leaving animation after 3 seconds
    const timer2 = setTimeout(() => setMotorcycleLeft(true), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Road */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-800 to-transparent">
          {/* Road lines */}
          <div className="absolute bottom-16 left-0 right-0 h-1 bg-yellow-400 animate-pulse"></div>
          <div className="absolute bottom-12 left-0 right-0 flex space-x-8">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-12 h-1 bg-white animate-road-lines"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>

        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* 404 Text with glitch effect */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-glitch relative">
              404
              <span className="absolute inset-0 text-red-500 animate-glitch-1">404</span>
              <span className="absolute inset-0 text-blue-500 animate-glitch-2">404</span>
            </h1>
          </div>

          {/* Motorcycle Animation */}
          <div className={`relative mb-12 h-32 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Motorcycle SVG */}
              <div className="relative animate-motorcycle-bounce">
                <svg width="120" height="60" viewBox="0 0 120 60" className="text-purple-400">
                  {/* Motorcycle body */}
                  <rect x="30" y="25" width="50" height="15" rx="5" fill="currentColor" />
                  
                  {/* Wheels - Fixed positioning with proper rotation */}
                  <g>
                    {/* Front wheel */}
                    <circle cx="20" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '20px 45px' }}>
                      <line x1="20" y1="33" x2="20" y2="57" stroke="currentColor" strokeWidth="2" />
                      <line x1="8" y1="45" x2="32" y2="45" stroke="currentColor" strokeWidth="2" />
                      <line x1="12.5" y1="36.5" x2="27.5" y2="53.5" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="12.5" y1="53.5" x2="27.5" y2="36.5" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                    
                    {/* Rear wheel */}
                    <circle cx="90" cy="45" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '90px 45px' }}>
                      <line x1="90" y1="33" x2="90" y2="57" stroke="currentColor" strokeWidth="2" />
                      <line x1="78" y1="45" x2="102" y2="45" stroke="currentColor" strokeWidth="2" />
                      <line x1="82.5" y1="36.5" x2="97.5" y2="53.5" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="82.5" y1="53.5" x2="97.5" y2="36.5" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                  </g>
                  
                  {/* Handlebars */}
                  <line x1="25" y1="20" x2="35" y2="25" stroke="currentColor" strokeWidth="2" />
                  <line x1="20" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="2" />
                  
                  {/* Exhaust */}
                  <rect x="75" y="35" width="20" height="3" rx="1" fill="currentColor" />
                  
                  {/* Rider silhouette */}
                  <circle cx="45" cy="15" r="8" fill="currentColor" opacity="0.8" />
                  <rect x="40" y="20" width="10" height="15" rx="2" fill="currentColor" opacity="0.8" />
                </svg>

                {/* Exhaust smoke */}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gray-400/50 rounded-full animate-exhaust-smoke"
                      style={{
                        left: `${i * 8}px`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Speed lines */}
                <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 bg-cyan-400/60 animate-speed-lines"
                      style={{
                        width: `${20 + i * 5}px`,
                        top: `${i * 4 - 8}px`,
                        left: `-${i * 10}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ground dust effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-600/40 rounded-full animate-dust-cloud"
                  style={{
                    left: `${i * 8 - 24}px`,
                    animationDelay: `${i * 0.2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Error message */}
          <div className={`mb-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Seite nicht gefunden!
            </h2>
            <p className="text-xl text-white/80 mb-2">
              Das Motorrad ist mit der gesuchten Seite davongefahren...
            </p>
            <p className="text-lg text-white/60">
              Aber keine Sorge, wir bringen Sie sicher zurück!
            </p>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link
              to="/"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 animate-pulse-glow"
            >
              <Home className="h-5 w-5" />
              <span>Zur Startseite</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück</span>
            </button>
          </div>

          {/* Fun fact */}
          <div className={`mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-semibold">Fun Fact</span>
            </div>
            <p className="text-white/70 text-sm">
              404-Fehler entstanden ursprünglich, als Tim Berners-Lee am CERN 
              Raum 404 für den ersten Webserver nutzte. Wenn der Server offline war, 
              bekam man die Nachricht "Room 404: File Not Found"!
            </p>
          </div>
        </div>
      </div>

      {/* Wind effect */}
      <div className="absolute top-1/4 right-8 text-white/20 animate-wind-sway">
        <Wind className="h-8 w-8" />
      </div>
      <div className="absolute top-1/3 left-8 text-white/20 animate-wind-sway" style={{ animationDelay: '1s' }}>
        <Wind className="h-6 w-6" />
      </div>
    </div>
  );
};

export default NotFound;