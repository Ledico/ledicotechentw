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
              {/* Realistic Motorcycle SVG */}
              <div className="relative animate-motorcycle-bounce">
                <svg width="160" height="80" viewBox="0 0 160 80" className="text-purple-400">
                  {/* Main frame */}
                  <path d="M25 50 L45 35 L85 35 L105 45 L120 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Engine block */}
                  <rect x="45" y="40" width="35" height="20" rx="3" fill="currentColor" opacity="0.8" />
                  
                  {/* Fuel tank */}
                  <ellipse cx="65" cy="30" rx="20" ry="8" fill="currentColor" opacity="0.9" />
                  
                  {/* Seat */}
                  <ellipse cx="90" cy="32" rx="15" ry="5" fill="currentColor" opacity="0.7" />
                  
                  {/* Front fork */}
                  <line x1="25" y1="50" x2="25" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <line x1="23" y1="50" x2="27" y2="50" stroke="currentColor" strokeWidth="2" />
                  
                  {/* Rear suspension */}
                  <line x1="120" y1="50" x2="120" y2="65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Handlebars */}
                  <line x1="20" y1="25" x2="30" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <line x1="25" y1="25" x2="25" y2="35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Windshield */}
                  <path d="M25 25 L35 15 L40 20 L30 30 Z" fill="currentColor" opacity="0.3" />
                  
                  {/* Exhaust system */}
                  <path d="M80 55 Q100 58 125 52" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="125" cy="52" r="3" fill="currentColor" />
                  
                  {/* Front wheel with detailed spokes */}
                  <circle cx="25" cy="65" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="25" cy="65" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <g className="animate-spin-wheel" style={{ transformOrigin: '25px 65px' }}>
                    {/* Spokes */}
                    <line x1="25" y1="50" x2="25" y2="80" stroke="currentColor" strokeWidth="2" />
                    <line x1="10" y1="65" x2="40" y2="65" stroke="currentColor" strokeWidth="2" />
                    <line x1="14.4" y1="54.4" x2="35.6" y2="75.6" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="14.4" y1="75.6" x2="35.6" y2="54.4" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="18.8" y1="52.2" x2="31.2" y2="77.8" stroke="currentColor" strokeWidth="1" />
                    <line x1="18.8" y1="77.8" x2="31.2" y2="52.2" stroke="currentColor" strokeWidth="1" />
                    {/* Hub */}
                    <circle cx="25" cy="65" r="4" fill="currentColor" />
                  </g>
                  
                  {/* Rear wheel with detailed spokes */}
                  <circle cx="120" cy="65" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
                  <circle cx="120" cy="65" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <g className="animate-spin-wheel" style={{ transformOrigin: '120px 65px' }}>
                    {/* Spokes */}
                    <line x1="120" y1="50" x2="120" y2="80" stroke="currentColor" strokeWidth="2" />
                    <line x1="105" y1="65" x2="135" y2="65" stroke="currentColor" strokeWidth="2" />
                    <line x1="109.4" y1="54.4" x2="130.6" y2="75.6" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="109.4" y1="75.6" x2="130.6" y2="54.4" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="113.8" y1="52.2" x2="126.2" y2="77.8" stroke="currentColor" strokeWidth="1" />
                    <line x1="113.8" y1="77.8" x2="126.2" y2="52.2" stroke="currentColor" strokeWidth="1" />
                    {/* Hub */}
                    <circle cx="120" cy="65" r="4" fill="currentColor" />
                  </g>
                  
                  {/* Brake discs */}
                  <circle cx="25" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <circle cx="120" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  
                  {/* Rider silhouette */}
                  <circle cx="75" cy="20" r="8" fill="currentColor" opacity="0.8" />
                  <ellipse cx="75" cy="32" rx="8" ry="12" fill="currentColor" opacity="0.8" />
                  <ellipse cx="70" cy="45" rx="6" ry="8" fill="currentColor" opacity="0.8" />
                  <ellipse cx="80" cy="45" rx="6" ry="8" fill="currentColor" opacity="0.8" />
                  
                  {/* Helmet */}
                  <circle cx="75" cy="18" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                  
                  {/* Headlight */}
                  <circle cx="15" cy="35" r="6" fill="yellow" opacity="0.8" />
                  <circle cx="15" cy="35" r="4" fill="white" opacity="0.9" />
                  
                  {/* Taillight */}
                  <circle cx="130" cy="45" r="3" fill="red" opacity="0.8" />
                </svg>

                {/* Enhanced exhaust smoke */}
                <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-gray-400/60 rounded-full animate-exhaust-smoke"
                      style={{
                        left: `${i * 10}px`,
                        top: `${Math.sin(i) * 5}px`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: `${1.5 + i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Enhanced speed lines */}
                <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 bg-cyan-400/70 animate-speed-lines"
                      style={{
                        width: `${25 + i * 8}px`,
                        top: `${i * 3 - 12}px`,
                        left: `-${i * 15}px`,
                        animationDelay: `${i * 0.08}s`
                      }}
                    ></div>
                  ))}
                </div>

                {/* Headlight beam */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <div 
                    className="w-20 h-8 bg-yellow-300/20 rounded-r-full animate-pulse"
                    style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 75%, 0 100%)' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Enhanced ground dust effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-600/50 rounded-full animate-dust-cloud"
                  style={{
                    left: `${i * 6 - 30}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: `${2 + Math.random()}s`
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