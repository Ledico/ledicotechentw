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

          {/* Simple Motorcycle Animation */}
          <div className={`relative mb-12 h-32 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Ultra-Simple Motorcycle */}
              <div className="relative animate-motorcycle-bounce">
                <svg width="200" height="80" viewBox="0 0 200 80" className="text-purple-400">
                  <g fill="currentColor" stroke="currentColor">
                    {/* WHEELS - Simple circles */}
                    {/* Front wheel */}
                    <circle cx="40" cy="60" r="18" fill="none" strokeWidth="4" className="animate-spin-wheel" style={{ transformOrigin: '40px 60px' }} />
                    <circle cx="40" cy="60" r="12" fill="none" strokeWidth="2" opacity="0.7" className="animate-spin-wheel" style={{ transformOrigin: '40px 60px' }} />
                    <circle cx="40" cy="60" r="6" fill="currentColor" opacity="0.8" />
                    
                    {/* Rear wheel */}
                    <circle cx="160" cy="60" r="18" fill="none" strokeWidth="4" className="animate-spin-wheel" style={{ transformOrigin: '160px 60px' }} />
                    <circle cx="160" cy="60" r="12" fill="none" strokeWidth="2" opacity="0.7" className="animate-spin-wheel" style={{ transformOrigin: '160px 60px' }} />
                    <circle cx="160" cy="60" r="6" fill="currentColor" opacity="0.8" />

                    {/* FRAME - Simple lines */}
                    <line x1="40" y1="60" x2="100" y2="45" strokeWidth="4" strokeLinecap="round" />
                    <line x1="100" y1="45" x2="160" y2="60" strokeWidth="4" strokeLinecap="round" />
                    <line x1="100" y1="45" x2="100" y2="30" strokeWidth="4" strokeLinecap="round" />

                    {/* SEAT */}
                    <ellipse cx="130" cy="35" rx="25" ry="8" fill="currentColor" opacity="0.8" />

                    {/* HANDLEBARS */}
                    <line x1="85" y1="25" x2="115" y2="25" strokeWidth="3" strokeLinecap="round" />
                    <line x1="100" y1="30" x2="100" y2="25" strokeWidth="3" strokeLinecap="round" />

                    {/* RIDER - Very simple */}
                    {/* Head */}
                    <circle cx="110" cy="15" r="8" fill="currentColor" opacity="0.9" />
                    {/* Body */}
                    <ellipse cx="120" cy="30" rx="12" ry="8" fill="currentColor" opacity="0.8" />
                    {/* Arms */}
                    <line x1="110" y1="25" x2="95" y2="25" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    <line x1="110" y1="25" x2="105" y2="25" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    {/* Legs */}
                    <line x1="125" y1="35" x2="135" y2="50" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                    <line x1="125" y1="35" x2="140" y2="50" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

                    {/* EXHAUST - Simple line */}
                    <line x1="120" y1="50" x2="180" y2="45" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                    <circle cx="180" cy="45" r="4" fill="currentColor" opacity="0.9" />
                  </g>
                </svg>

                {/* Simple exhaust smoke */}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gray-400/50 rounded-full animate-exhaust-smoke"
                      style={{
                        width: `${4 + i * 2}px`,
                        height: `${4 + i * 2}px`,
                        left: `${i * 10}px`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Simple speed lines */}
                <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-cyan-400/60 animate-speed-lines"
                      style={{
                        width: `${20 + i * 8}px`,
                        height: '2px',
                        top: `${i * 4 - 12}px`,
                        left: `-${i * 15}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
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