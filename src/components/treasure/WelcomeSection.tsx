import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface WelcomeSectionProps {
  onBack: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onBack }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 300);
    setTimeout(() => setShowSubtitle(true), 1000);
    setTimeout(() => setShowButton(true), 1800);

    const heartArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setHearts(heartArray);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-float-up opacity-30"
          style={{
            left: `${heart.x}%`,
            bottom: '-5%',
            animationDelay: `${heart.delay}s`,
          }}
        >
          <Heart className="text-pink-400" size={24} fill="currentColor" />
        </div>
      ))}

      <div className="text-center space-y-8 px-4 relative z-10">
        <div
          className={`transform transition-all duration-1000 ${
            showTitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex justify-center mb-4">
            <Sparkles className="text-yellow-400 animate-pulse" size={48} />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
            Alles Gute zum Geburtstag
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-rose-500 mt-4 font-serif">
            Louisa
          </h2>
        </div>

        <div
          className={`transform transition-all duration-1000 delay-300 ${
            showSubtitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-2xl md:text-3xl text-gray-700 font-light italic">
            Eine Schatzkiste voller Erinnerungen, Liebe und Überraschungen
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Heart className="text-pink-500 animate-pulse" size={32} fill="currentColor" />
            <Heart className="text-rose-500 animate-pulse delay-100" size={32} fill="currentColor" />
            <Heart className="text-purple-500 animate-pulse delay-200" size={32} fill="currentColor" />
          </div>
        </div>

        <div
          className={`transform transition-all duration-1000 delay-500 ${
            showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'
          }`}
        >
          <button
            onClick={onBack}
            className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-2xl font-semibold rounded-full shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 transition-all duration-300 animate-pulse-slow"
          >
            <span className="relative z-10 flex items-center gap-3">
              Starte dein Abenteuer
              <Sparkles className="group-hover:rotate-180 transition-transform duration-500" size={28} />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
          </button>
          <p className="text-sm text-gray-600 mt-4 animate-bounce">
            Klicke hier um die Schatztruhen zu öffnen ↑
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
