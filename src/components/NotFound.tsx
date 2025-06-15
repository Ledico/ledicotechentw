import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, MapPin, Compass, Map, Navigation, Plane, Camera, Backpack } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [compassRotation, setCompassRotation] = useState(0);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    
    // Rotate compass continuously
    const compassInterval = setInterval(() => {
      setCompassRotation(prev => (prev + 5) % 360);
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearInterval(compassInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-teal-800 to-green-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating clouds */}
        <div className="absolute top-10 left-10 w-20 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-16 h-8 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-32 left-1/3 w-24 h-14 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Mountain silhouettes */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 300" className="w-full h-64 text-slate-800/50">
            <path d="M0,300 L0,200 L200,100 L400,150 L600,80 L800,120 L1000,60 L1200,100 L1200,300 Z" fill="currentColor" />
          </svg>
        </div>
        
        {/* Second mountain layer */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 250" className="w-full h-48 text-slate-700/30">
            <path d="M0,250 L0,180 L150,120 L350,160 L550,90 L750,130 L950,70 L1200,110 L1200,250 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Floating travel icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Plane className="absolute top-1/4 left-1/4 w-8 h-8 text-white/20 animate-float" style={{ animationDelay: '0.5s' }} />
          <Camera className="absolute top-1/3 right-1/3 w-6 h-6 text-white/20 animate-float" style={{ animationDelay: '1.5s' }} />
          <Backpack className="absolute bottom-1/3 left-1/5 w-7 h-7 text-white/20 animate-float" style={{ animationDelay: '2.5s' }} />
        </div>

        {/* Twinkling stars */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
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
          {/* 404 Text with travel theme */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-gradient-x relative">
              404
            </h1>
          </div>

          {/* Large Compass Animation */}
          <div className={`relative mb-12 h-40 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Compass outer ring */}
                <div className="w-32 h-32 border-4 border-yellow-400 rounded-full bg-gradient-to-br from-yellow-100/20 to-orange-200/20 backdrop-blur-sm shadow-2xl">
                  {/* Compass needle */}
                  <div 
                    className="absolute inset-4 transition-transform duration-300 ease-out"
                    style={{ transform: `rotate(${compassRotation}deg)` }}
                  >
                    <div className="relative w-full h-full">
                      {/* North pointer (red) */}
                      <div className="absolute top-0 left-1/2 w-1 h-10 bg-red-500 transform -translate-x-1/2 origin-bottom"></div>
                      {/* South pointer (white) */}
                      <div className="absolute bottom-0 left-1/2 w-1 h-10 bg-white transform -translate-x-1/2 origin-top"></div>
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                    </div>
                  </div>
                  
                  {/* Cardinal directions */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">N</div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white font-bold text-lg">S</div>
                  <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-white font-bold text-lg">W</div>
                  <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-white font-bold text-lg">E</div>
                </div>

                {/* Compass glow effect */}
                <div className="absolute inset-0 w-32 h-32 border-2 border-yellow-300/50 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>

          {/* Travel-themed error message */}
          <div className={`mb-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <MapPin className="h-8 w-8 text-red-500 animate-bounce" />
              <span>Falsche Route genommen!</span>
            </h2>
            <p className="text-xl text-white/80 mb-2">
              Ihr Kompass zeigt in die falsche Richtung...
            </p>
            <p className="text-lg text-white/60">
              Aber keine Sorge, wir navigieren Sie zurück zum richtigen Pfad!
            </p>
          </div>

          {/* Corrected Route visualization */}
          <div className={`mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Map className="h-6 w-6 text-green-400" />
                <span className="text-white font-semibold">Routenkorrektur</span>
              </div>
              
              {/* Clean route visualization */}
              <div className="flex items-center justify-center space-x-6">
                {/* Start point */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-white/60 text-xs mt-1">Start</span>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  <div className="w-0 h-0 border-l-[6px] border-l-blue-500 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent"></div>
                </div>
                
                {/* Destination */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full relative flex items-center justify-center">
                    <Home className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-white/60 text-xs mt-1">Ziel</span>
                </div>
              </div>
              
              <p className="text-white/70 text-sm mt-4 text-center">
                Route wird neu berechnet...
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link
              to="/"
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 animate-pulse-glow"
            >
              <Home className="h-5 w-5" />
              <span>Zur Startseite navigieren</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Navigation className="h-5 w-5" />
              <span>Zurück zur letzten Position</span>
            </button>
          </div>

          {/* CERN Server Room 404 Legend */}
          <div className={`mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all duration-1000 delay-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Fun Fact: Die CERN 404-Legende</span>
            </div>
            <div className="text-white/70 text-sm space-y-3">
              <p>
                <strong className="text-white">Die berühmte Geschichte:</strong> Es wird oft erzählt, dass der HTTP-Fehlercode "404" 
                daher stammt, dass am CERN der Server im Raum 404 stand und dieser oft nicht erreichbar war.
              </p>
              <p>
                <strong className="text-white">Die Wahrheit:</strong> Das ist leider nur eine urbane Legende! Der Code "404" bedeutet 
                einfach "Not Found" und wurde als Teil des HTTP-Standards definiert. Die Zahl hat keine Verbindung zu einem Raum.
              </p>
              <p>
                <strong className="text-white">Warum die Geschichte so beliebt ist:</strong> Sie klingt plausibel und macht den 
                abstrakten Fehlercode menschlicher und greifbarer. Manchmal sind die schönsten Geschichten eben nicht wahr!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating compass indicators */}
      <div className="absolute top-1/4 right-8 text-white/20 animate-float">
        <Compass className="h-8 w-8" />
      </div>
      <div className="absolute top-1/3 left-8 text-white/20 animate-float" style={{ animationDelay: '1s' }}>
        <MapPin className="h-6 w-6" />
      </div>
    </div>
  );
};

export default NotFound;