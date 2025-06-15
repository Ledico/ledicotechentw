import React, { useEffect, useState } from 'react';
import { Home, ArrowLeft, Zap, Wind, Wrench, Search, MapPin } from 'lucide-react';
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

          {/* Improved Motorcycle Silhouette - More accurate to your reference */}
          <div className={`relative mb-12 h-32 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative animate-motorcycle-bounce">
                <svg width="280" height="140" viewBox="0 0 280 140" className="text-white">
                  <g fill="currentColor">
                    {/* IMPROVED MOTORCYCLE SILHOUETTE - More like your reference image */}
                    
                    {/* Front Wheel */}
                    <circle cx="60" cy="100" r="30" fill="currentColor" className="animate-spin-wheel" style={{ transformOrigin: '60px 100px' }}>
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 60 100"
                        to="360 60 100"
                        dur="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="60" cy="100" r="18" fill="white" />
                    <circle cx="60" cy="100" r="8" fill="currentColor" />
                    
                    {/* Rear Wheel */}
                    <circle cx="220" cy="100" r="30" fill="currentColor" className="animate-spin-wheel" style={{ transformOrigin: '220px 100px' }}>
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 220 100"
                        to="360 220 100"
                        dur="0.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="220" cy="100" r="18" fill="white" />
                    <circle cx="220" cy="100" r="8" fill="currentColor" />

                    {/* Main motorcycle body - simplified solid shape like your reference */}
                    <path d="M 90 100 
                             L 100 85
                             L 120 75
                             L 140 70
                             L 160 65
                             L 180 70
                             L 190 80
                             L 190 100
                             L 90 100 Z" 
                          fill="currentColor" />

                    {/* Fuel tank */}
                    <ellipse cx="140" cy="65" rx="25" ry="15" fill="currentColor" />

                    {/* Seat */}
                    <ellipse cx="170" cy="60" rx="20" ry="8" fill="currentColor" />

                    {/* Front fork and handlebars */}
                    <rect x="85" y="70" width="4" height="30" fill="currentColor" />
                    <rect x="75" y="45" width="25" height="6" rx="3" fill="currentColor" />
                    <circle cx="77" cy="48" r="3" fill="currentColor" />
                    <circle cx="101" cy="48" r="3" fill="currentColor" />

                    {/* Windscreen/fairing */}
                    <path d="M 95 55 
                             Q 105 35 120 40
                             L 125 50
                             Q 115 65 105 70
                             L 95 55 Z" 
                          fill="currentColor" />

                    {/* Rider silhouette - more accurate proportions */}
                    {/* Helmet */}
                    <circle cx="145" cy="35" r="15" fill="currentColor" />
                    <path d="M 135 25 
                             Q 145 20 155 25
                             Q 160 30 155 35
                             Q 145 40 135 35
                             Q 130 30 135 25 Z" 
                          fill="currentColor" />
                    
                    {/* Visor reflection */}
                    <ellipse cx="148" cy="32" rx="8" ry="6" fill="rgba(255,255,255,0.3)" />

                    {/* Body/torso */}
                    <ellipse cx="155" cy="55" rx="15" ry="18" fill="currentColor" />

                    {/* Left arm (visible) */}
                    <ellipse cx="135" cy="50" rx="6" ry="18" fill="currentColor" transform="rotate(-25 135 50)" />
                    <ellipse cx="125" cy="58" rx="4" ry="12" fill="currentColor" transform="rotate(-45 125 58)" />

                    {/* Right arm (partially visible) */}
                    <ellipse cx="165" cy="52" rx="5" ry="15" fill="currentColor" transform="rotate(20 165 52)" />

                    {/* Legs */}
                    <ellipse cx="165" cy="75" rx="8" ry="20" fill="currentColor" transform="rotate(10 165 75)" />
                    <ellipse cx="175" cy="85" rx="6" ry="15" fill="currentColor" transform="rotate(25 175 85)" />

                    {/* Exhaust pipe */}
                    <rect x="190" y="85" width="30" height="8" rx="4" fill="currentColor" />
                    <ellipse cx="220" cy="89" rx="6" ry="4" fill="currentColor" />

                    {/* Additional details */}
                    {/* Rear light */}
                    <circle cx="185" cy="75" r="2" fill="#ff4444" />
                    
                    {/* Front headlight */}
                    <circle cx="95" cy="60" r="4" fill="#ffffaa" />
                  </g>
                </svg>

                {/* Exhaust smoke */}
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

                {/* Speed lines */}
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

          {/* Alternative design suggestions */}
          <div className={`mt-16 transition-all duration-1000 delay-2000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-bold text-white mb-6">Alternative Ideen für die 404-Seite:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Wrench className="h-5 w-5 text-purple-400" />
                  <span className="text-white font-semibold">Werkstatt-Theme</span>
                </div>
                <p className="text-white/70 text-sm">
                  "Seite in der Werkstatt" - mit animierten Werkzeugen und Reparatur-Effekten
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="h-5 w-5 text-cyan-400" />
                  <span className="text-white font-semibold">Detektiv-Theme</span>
                </div>
                <p className="text-white/70 text-sm">
                  "Seite verschwunden" - mit Lupe, Fußspuren und Suchanimationen
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <span className="text-white font-semibold">Reise-Theme</span>
                </div>
                <p className="text-white/70 text-sm">
                  "Falsche Route genommen" - mit Karte, Kompass und Wegweiser-Animationen
                </p>
              </div>
            </div>
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