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

          {/* Motorcycle Silhouette - EXACT like your image */}
          <div className={`relative mb-12 h-32 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative animate-motorcycle-bounce">
                <svg width="240" height="120" viewBox="0 0 240 120" className="text-white">
                  <g fill="currentColor">
                    {/* EXACT MOTORCYCLE SILHOUETTE */}
                    
                    {/* Front Wheel */}
                    <circle cx="50" cy="85" r="25" fill="currentColor" className="animate-spin-wheel" style={{ transformOrigin: '50px 85px' }}>
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 85"
                        to="360 50 85"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="50" cy="85" r="15" fill="white" />
                    
                    {/* Rear Wheel */}
                    <circle cx="190" cy="85" r="25" fill="currentColor" className="animate-spin-wheel" style={{ transformOrigin: '190px 85px' }}>
                      <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 190 85"
                        to="360 190 85"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx="190" cy="85" r="15" fill="white" />

                    {/* Main Body/Frame - Solid silhouette like your image */}
                    <path d="M 75 85 
                             Q 85 75 100 70
                             L 120 65
                             Q 130 60 140 55
                             L 160 50
                             Q 170 45 180 50
                             L 185 55
                             Q 190 60 185 65
                             L 180 70
                             Q 175 75 170 80
                             L 165 85
                             L 75 85 Z" 
                          fill="currentColor" />

                    {/* Seat area */}
                    <ellipse cx="140" cy="45" rx="35" ry="12" fill="currentColor" />

                    {/* Handlebars */}
                    <rect x="95" y="35" width="25" height="8" rx="4" fill="currentColor" />
                    <rect x="105" y="30" width="5" height="15" fill="currentColor" />

                    {/* Front fairing/windscreen */}
                    <path d="M 85 50 
                             Q 95 35 110 40
                             L 115 45
                             Q 110 55 100 60
                             L 85 50 Z" 
                          fill="currentColor" />

                    {/* Rider silhouette */}
                    {/* Head with helmet */}
                    <circle cx="125" cy="25" r="12" fill="currentColor" />
                    <path d="M 115 20 
                             Q 125 15 135 20
                             Q 140 25 135 30
                             Q 125 35 115 30
                             Q 110 25 115 20 Z" 
                          fill="currentColor" />

                    {/* Body */}
                    <ellipse cx="135" cy="40" rx="18" ry="15" fill="currentColor" />

                    {/* Arms */}
                    <ellipse cx="120" cy="35" rx="8" ry="20" fill="currentColor" transform="rotate(-20 120 35)" />
                    <ellipse cx="110" cy="40" rx="6" ry="15" fill="currentColor" transform="rotate(-45 110 40)" />

                    {/* Legs */}
                    <ellipse cx="145" cy="55" rx="8" ry="18" fill="currentColor" transform="rotate(15 145 55)" />
                    <ellipse cx="155" cy="65" rx="6" ry="15" fill="currentColor" transform="rotate(30 155 65)" />

                    {/* Exhaust pipe */}
                    <rect x="170" y="75" width="25" height="6" rx="3" fill="currentColor" />
                    <circle cx="195" cy="78" r="4" fill="currentColor" />
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
            </Link>
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