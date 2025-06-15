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

          {/* Ultra-Realistic Motorcycle Animation */}
          <div className={`relative mb-12 h-48 transition-all duration-2000 ${motorcycleLeft ? 'transform translate-x-full opacity-0' : ''}`}>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {/* Ultra-Realistic Sportbike - Based on your reference images */}
              <div className="relative animate-motorcycle-bounce">
                <svg width="280" height="140" viewBox="0 0 280 140" className="text-purple-400">
                  <defs>
                    {/* Gradients for realistic shading */}
                    <linearGradient id="bikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                      <stop offset="50%" stopColor="currentColor" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
                    </linearGradient>
                    <radialGradient id="wheelGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.9"/>
                      <stop offset="70%" stopColor="currentColor" stopOpacity="0.7"/>
                      <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
                    </radialGradient>
                  </defs>
                  
                  <g fill="url(#bikeGradient)">
                    {/* WHEELS - Much more detailed and realistic */}
                    {/* Front wheel */}
                    <circle cx="50" cy="105" r="25" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.9" />
                    <circle cx="50" cy="105" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '50px 105px' }}>
                      {/* Rim */}
                      <circle cx="50" cy="105" r="18" fill="url(#wheelGradient)" opacity="0.8" />
                      <circle cx="50" cy="105" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                      <circle cx="50" cy="105" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <circle cx="50" cy="105" r="8" fill="currentColor" opacity="0.9" />
                      {/* 5-spoke wheel design */}
                      {[...Array(5)].map((_, i) => {
                        const angle = (i * 72) * Math.PI / 180;
                        const x1 = 50 + 8 * Math.cos(angle);
                        const y1 = 105 + 8 * Math.sin(angle);
                        const x2 = 50 + 18 * Math.cos(angle);
                        const y2 = 105 + 18 * Math.sin(angle);
                        return (
                          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
                                stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        );
                      })}
                    </g>
                    {/* Brake disc */}
                    <circle cx="50" cy="105" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                    
                    {/* Rear wheel */}
                    <circle cx="220" cy="105" r="25" fill="none" stroke="currentColor" strokeWidth="6" opacity="0.9" />
                    <circle cx="220" cy="105" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <g className="animate-spin-wheel" style={{ transformOrigin: '220px 105px' }}>
                      {/* Rim */}
                      <circle cx="220" cy="105" r="18" fill="url(#wheelGradient)" opacity="0.8" />
                      <circle cx="220" cy="105" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                      <circle cx="220" cy="105" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <circle cx="220" cy="105" r="8" fill="currentColor" opacity="0.9" />
                      {/* 5-spoke wheel design */}
                      {[...Array(5)].map((_, i) => {
                        const angle = (i * 72) * Math.PI / 180;
                        const x1 = 220 + 8 * Math.cos(angle);
                        const y1 = 105 + 8 * Math.sin(angle);
                        const x2 = 220 + 18 * Math.cos(angle);
                        const y2 = 105 + 18 * Math.sin(angle);
                        return (
                          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} 
                                stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        );
                      })}
                    </g>
                    {/* Brake disc */}
                    <circle cx="220" cy="105" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />

                    {/* MAIN FRAME - Realistic sportbike geometry */}
                    {/* Lower frame rail */}
                    <path d="M50 105 L75 95 L110 85 L150 82 L190 85 L220 105" 
                          fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
                    
                    {/* Upper frame rail */}
                    <path d="M75 95 L90 75 L120 65 L160 62 L190 65" 
                          fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.8" />

                    {/* ENGINE - Detailed V-twin or inline-4 style */}
                    <ellipse cx="120" cy="90" rx="35" ry="18" fill="currentColor" opacity="0.9" />
                    <rect x="100" y="82" width="40" height="16" rx="3" fill="currentColor" opacity="0.8" />
                    {/* Engine fins */}
                    <rect x="105" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />
                    <rect x="110" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />
                    <rect x="115" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />
                    <rect x="120" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />
                    <rect x="125" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />
                    <rect x="130" y="78" width="2" height="8" fill="currentColor" opacity="0.6" />

                    {/* FUEL TANK - Sleek sportbike tank */}
                    <path d="M90 65 Q135 55 160 62 Q165 65 160 70 Q135 75 90 70 Z" 
                          fill="currentColor" opacity="0.85" />
                    {/* Tank knee grips */}
                    <ellipse cx="110" cy="68" rx="8" ry="3" fill="currentColor" opacity="0.6" />
                    <ellipse cx="140" cy="68" rx="8" ry="3" fill="currentColor" opacity="0.6" />

                    {/* SEAT - Racing seat with tail section */}
                    <path d="M160 62 Q180 58 200 60 Q210 62 205 68 Q185 72 160 70 Z" 
                          fill="currentColor" opacity="0.8" />

                    {/* TAIL SECTION - Sharp sportbike tail */}
                    <path d="M200 60 L240 55 L250 58 L245 65 L235 68 L205 68 Z" 
                          fill="currentColor" opacity="0.85" />
                    
                    {/* Tail light */}
                    <ellipse cx="248" cy="60" rx="6" ry="4" fill="#ff4444" opacity="0.9" />
                    <ellipse cx="248" cy="60" rx="4" ry="2" fill="#ff6666" opacity="1" />

                    {/* FRONT FAIRING - Aggressive sportbike nose */}
                    <path d="M50 85 L25 70 L15 60 L12 50 L18 45 L30 50 L45 65 L65 75 Z" 
                          fill="currentColor" opacity="0.9" />
                    
                    {/* Windscreen - Tall racing screen */}
                    <path d="M45 65 L35 35 L25 25 L30 20 L45 30 L60 45 L65 55 Z" 
                          fill="currentColor" opacity="0.25" stroke="currentColor" strokeWidth="1" />

                    {/* HEADLIGHT - Dual LED setup */}
                    <ellipse cx="18" cy="55" rx="12" ry="8" fill="#ffff88" opacity="0.9" />
                    <ellipse cx="18" cy="55" rx="10" ry="6" fill="white" opacity="1" />
                    {/* LED strips */}
                    <rect x="10" y="52" width="16" height="1" fill="white" opacity="0.8" />
                    <rect x="10" y="58" width="16" height="1" fill="white" opacity="0.8" />

                    {/* FRONT FORK - Inverted racing forks */}
                    <line x1="50" y1="85" x2="50" y2="105" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
                    <line x1="45" y1="85" x2="45" y2="105" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
                    <line x1="55" y1="85" x2="55" y2="105" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
                    
                    {/* Triple clamp */}
                    <rect x="40" y="80" width="20" height="8" rx="2" fill="currentColor" opacity="0.8" />

                    {/* SWINGARM - Single-sided or dual */}
                    <path d="M190 85 L220 105" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
                    <path d="M190 85 L215 100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

                    {/* HANDLEBARS - Clip-on racing bars */}
                    <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                    {/* Bar ends */}
                    <circle cx="35" cy="45" r="3" fill="currentColor" opacity="0.9" />
                    <circle cx="65" cy="45" r="3" fill="currentColor" opacity="0.9" />

                    {/* EXHAUST SYSTEM - Under-tail or side-mount */}
                    <path d="M140 95 Q170 98 200 92 Q230 88 250 85" 
                          fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
                    {/* Exhaust tip */}
                    <ellipse cx="250" cy="85" rx="10" ry="5" fill="currentColor" opacity="0.9" />
                    <ellipse cx="250" cy="85" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />

                    {/* RIDER - Aggressive racing position */}
                    {/* Helmet - Full-face racing helmet */}
                    <ellipse cx="105" cy="35" rx="16" ry="14" fill="currentColor" opacity="0.9" />
                    {/* Visor */}
                    <path d="M95 30 Q105 25 115 30 Q118 35 115 40 Q105 45 95 40 Q92 35 95 30 Z" 
                          fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Body - Leaning far forward */}
                    <ellipse cx="125" cy="55" rx="18" ry="12" fill="currentColor" opacity="0.8" transform="rotate(-15 125 55)" />
                    
                    {/* Arms - Stretched to clip-ons */}
                    <ellipse cx="95" cy="50" rx="12" ry="5" fill="currentColor" opacity="0.7" transform="rotate(-25 95 50)" />
                    <ellipse cx="75" cy="48" rx="8" ry="4" fill="currentColor" opacity="0.7" transform="rotate(-35 75 48)" />
                    
                    {/* Legs - Tucked up high */}
                    <ellipse cx="145" cy="65" rx="8" ry="14" fill="currentColor" opacity="0.7" transform="rotate(20 145 65)" />
                    <ellipse cx="160" cy="72" rx="6" ry="12" fill="currentColor" opacity="0.7" transform="rotate(30 160 72)" />
                    
                    {/* Knee sliders */}
                    <ellipse cx="148" cy="75" rx="4" ry="2" fill="#ffff00" opacity="0.8" transform="rotate(25 148 75)" />
                    <ellipse cx="163" cy="80" rx="4" ry="2" fill="#ffff00" opacity="0.8" transform="rotate(35 163 80)" />

                    {/* ADDITIONAL DETAILS */}
                    {/* Mirrors */}
                    <line x1="35" y1="45" x2="28" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <ellipse cx="26" cy="36" rx="4" ry="2" fill="currentColor" opacity="0.4" />
                    <line x1="65" y1="45" x2="72" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <ellipse cx="74" cy="36" rx="4" ry="2" fill="currentColor" opacity="0.4" />
                    
                    {/* Foot pegs */}
                    <rect x="155" y="88" width="8" height="3" rx="1" fill="currentColor" opacity="0.7" />
                    <rect x="170" y="92" width="8" height="3" rx="1" fill="currentColor" opacity="0.7" />
                    
                    {/* Chain */}
                    <path d="M190 85 Q205 90 220 105" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" strokeDasharray="2,2" />
                  </g>
                </svg>

                {/* Enhanced exhaust smoke with heat shimmer effect */}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-gray-400/60 rounded-full animate-exhaust-smoke"
                      style={{
                        width: `${6 + i * 2}px`,
                        height: `${6 + i * 2}px`,
                        left: `${i * 15}px`,
                        top: `${Math.sin(i * 0.5) * 8}px`,
                        animationDelay: `${i * 0.12}s`,
                        animationDuration: `${1.5 + i * 0.15}s`,
                        filter: `blur(${i * 0.5}px)`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Enhanced speed lines with varying opacity */}
                <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-cyan-400/70 animate-speed-lines"
                      style={{
                        width: `${40 + i * 12}px`,
                        height: `${1 + Math.floor(i / 3)}px`,
                        top: `${i * 3 - 20}px`,
                        left: `-${i * 25}px`,
                        animationDelay: `${i * 0.04}s`,
                        opacity: 0.8 - (i * 0.04)
                      }}
                    ></div>
                  ))}
                </div>

                {/* Powerful headlight beam */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-48 h-16 bg-yellow-300/30 rounded-r-full animate-pulse"
                    style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                  ></div>
                  <div 
                    className="w-32 h-8 bg-white/20 rounded-r-full animate-pulse"
                    style={{ 
                      clipPath: 'polygon(0 0, 100% 30%, 100% 70%, 0 100%)',
                      marginTop: '-12px'
                    }}
                  ></div>
                </div>

                {/* Tire smoke and sparks */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full animate-dust-cloud"
                      style={{
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                        backgroundColor: i % 3 === 0 ? '#fbbf24' : '#78716c',
                        opacity: 0.6,
                        left: `${i * 6 - 60}px`,
                        animationDelay: `${i * 0.08}s`,
                        animationDuration: `${2 + Math.random() * 1}s`
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