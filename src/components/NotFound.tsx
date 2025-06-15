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
          <div className={`relative mb-12 h-40 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Realistic Sportbike Silhouette */}
              <div className="relative animate-motorcycle-bounce">
                <svg width="200" height="100" viewBox="0 0 200 100" className="text-purple-400">
                  {/* Main motorcycle body - Sportbike silhouette */}
                  <g fill="currentColor">
                    {/* Front wheel */}
                    <circle cx="35" cy="75" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '35px 75px' }}>
                      <circle cx="35" cy="75" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                      <circle cx="35" cy="75" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <circle cx="35" cy="75" r="6" fill="currentColor" opacity="0.8" />
                      {/* Spokes */}
                      <line x1="35" y1="57" x2="35" y2="93" stroke="currentColor" strokeWidth="2" />
                      <line x1="17" y1="75" x2="53" y2="75" stroke="currentColor" strokeWidth="2" />
                      <line x1="22.3" y1="62.3" x2="47.7" y2="87.7" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="22.3" y1="87.7" x2="47.7" y2="62.3" stroke="currentColor" strokeWidth="1.5" />
                    </g>
                    
                    {/* Rear wheel */}
                    <circle cx="155" cy="75" r="18" fill="none" stroke="currentColor" strokeWidth="4" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '155px 75px' }}>
                      <circle cx="155" cy="75" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                      <circle cx="155" cy="75" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <circle cx="155" cy="75" r="6" fill="currentColor" opacity="0.8" />
                      {/* Spokes */}
                      <line x1="155" y1="57" x2="155" y2="93" stroke="currentColor" strokeWidth="2" />
                      <line x1="137" y1="75" x2="173" y2="75" stroke="currentColor" strokeWidth="2" />
                      <line x1="142.3" y1="62.3" x2="167.7" y2="87.7" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="142.3" y1="87.7" x2="167.7" y2="62.3" stroke="currentColor" strokeWidth="1.5" />
                    </g>

                    {/* Main frame and body - Sportbike shape */}
                    <path d="M35 75 L50 60 L70 55 L90 50 L120 52 L140 55 L155 75" 
                          fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Engine block */}
                    <rect x="60" y="60" width="40" height="20" rx="4" fill="currentColor" opacity="0.9" />
                    
                    {/* Fuel tank - sleek sportbike tank */}
                    <ellipse cx="85" cy="45" rx="25" ry="12" fill="currentColor" opacity="0.8" />
                    
                    {/* Seat - racing seat */}
                    <path d="M105 40 Q125 38 135 42 Q140 45 135 48 Q115 50 105 48 Z" fill="currentColor" opacity="0.7" />
                    
                    {/* Tail section - pointed sportbike tail */}
                    <path d="M135 42 L160 38 L165 45 L155 50 L135 48 Z" fill="currentColor" opacity="0.8" />
                    
                    {/* Front fairing - aerodynamic nose */}
                    <path d="M35 60 L25 50 L20 45 L25 40 L40 45 L50 55 Z" fill="currentColor" opacity="0.9" />
                    
                    {/* Windscreen */}
                    <path d="M40 45 L35 30 L45 25 L55 35 L50 45 Z" fill="currentColor" opacity="0.3" />
                    
                    {/* Front fork */}
                    <line x1="35" y1="60" x2="35" y2="75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    
                    {/* Rear swingarm */}
                    <line x1="120" y1="55" x2="155" y2="75" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                    
                    {/* Handlebars - clip-ons */}
                    <line x1="30" y1="35" x2="45" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Exhaust system */}
                    <path d="M100 70 Q130 72 160 65" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <ellipse cx="160" cy="65" rx="8" ry="4" fill="currentColor" opacity="0.8" />
                    
                    {/* Rider in racing position */}
                    {/* Helmet */}
                    <circle cx="75" cy="25" r="12" fill="currentColor" opacity="0.9" />
                    <path d="M70 20 Q75 15 80 20 Q85 25 80 30 Q75 35 70 30 Z" fill="currentColor" opacity="0.6" />
                    
                    {/* Body - leaning forward racing position */}
                    <ellipse cx="80" cy="40" rx="12" ry="8" fill="currentColor" opacity="0.8" />
                    
                    {/* Arms - reaching forward to handlebars */}
                    <ellipse cx="65" cy="35" rx="8" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-20 65 35)" />
                    <ellipse cx="50" cy="38" rx="6" ry="3" fill="currentColor" opacity="0.7" transform="rotate(-30 50 38)" />
                    
                    {/* Legs - tucked up racing position */}
                    <ellipse cx="95" cy="50" rx="6" ry="10" fill="currentColor" opacity="0.7" transform="rotate(15 95 50)" />
                    <ellipse cx="105" cy="55" rx="5" ry="8" fill="currentColor" opacity="0.7" transform="rotate(25 105 55)" />
                    
                    {/* Headlight */}
                    <ellipse cx="22" cy="45" rx="8" ry="6" fill="yellow" opacity="0.9" />
                    <ellipse cx="22" cy="45" rx="6" ry="4" fill="white" opacity="1" />
                    
                    {/* Taillight */}
                    <ellipse cx="165" cy="42" rx="4" ry="3" fill="red" opacity="0.9" />
                    
                    {/* Brake discs */}
                    <circle cx="35" cy="75" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    <circle cx="155" cy="75" r="10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  </g>
                </svg>

                {/* Enhanced exhaust smoke */}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-gray-400/60 rounded-full animate-exhaust-smoke"
                      style={{
                        left: `${i * 12}px`,
                        top: `${Math.sin(i) * 6}px`,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: `${1.2 + i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Enhanced speed lines */}
                <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 bg-cyan-400/70 animate-speed-lines"
                      style={{
                        width: `${30 + i * 10}px`,
                        top: `${i * 4 - 16}px`,
                        left: `-${i * 20}px`,
                        animationDelay: `${i * 0.06}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Headlight beam */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-32 h-12 bg-yellow-300/25 rounded-r-full animate-pulse"
                    style={{ clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Enhanced ground dust effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-600/50 rounded-full animate-dust-cloud"
                  style={{
                    left: `${i * 8 - 48}px`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: `${1.8 + Math.random() * 0.8}s`
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
              Das Sportmotorrad ist mit der gesuchten Seite davongerast...
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