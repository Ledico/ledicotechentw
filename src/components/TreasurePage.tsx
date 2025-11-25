import React, { useState, useEffect } from 'react';
import { Heart, Gift, Image as ImageIcon, Mail, Calendar, Gamepad2, HelpCircle, Star, Sparkles, Music } from 'lucide-react';
import WelcomeSection from './treasure/WelcomeSection';
import TreasureBoxes from './treasure/TreasureBoxes';
import PhotoGallery from './treasure/PhotoGallery';
import LoveLetters from './treasure/LoveLetters';
import Timeline from './treasure/Timeline';
import MemoryGame from './treasure/MemoryGame';
import Quiz from './treasure/Quiz';
import GiftVouchers from './treasure/GiftVouchers';
import EasterEggs from './treasure/EasterEggs';
import MusicPlayer from './treasure/MusicPlayer';

type Section = 'welcome' | 'boxes' | 'photos' | 'letters' | 'timeline' | 'memory' | 'quiz' | 'gifts';

const TreasurePage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('welcome');
  const [showConfetti, setShowConfetti] = useState(false);
  const [easterEggsFound, setEasterEggsFound] = useState(0);

  useEffect(() => {
    document.body.style.overflow = currentSection === 'welcome' ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [currentSection]);

  const handleStartAdventure = () => {
    setCurrentSection('boxes');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleOpenBox = (boxType: Section) => {
    setCurrentSection(boxType);
  };

  const handleBackToBoxes = () => {
    setCurrentSection('boxes');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-rose-300 rounded-full opacity-20 blur-3xl animate-pulse delay-500"></div>
      </div>

      <MusicPlayer />
      <EasterEggs onEggFound={(count) => setEasterEggsFound(count)} />

      {showConfetti && <Confetti />}

      <div className="relative z-10">
        {currentSection === 'welcome' && (
          <WelcomeSection onStart={handleStartAdventure} />
        )}

        {currentSection === 'boxes' && (
          <TreasureBoxes onOpenBox={handleOpenBox} easterEggsFound={easterEggsFound} />
        )}

        {currentSection === 'photos' && (
          <PhotoGallery onBack={handleBackToBoxes} />
        )}

        {currentSection === 'letters' && (
          <LoveLetters onBack={handleBackToBoxes} />
        )}

        {currentSection === 'timeline' && (
          <Timeline onBack={handleBackToBoxes} />
        )}

        {currentSection === 'memory' && (
          <MemoryGame onBack={handleBackToBoxes} />
        )}

        {currentSection === 'quiz' && (
          <Quiz onBack={handleBackToBoxes} />
        )}

        {currentSection === 'gifts' && (
          <GiftVouchers onBack={handleBackToBoxes} />
        )}
      </div>
    </div>
  );
};

const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-fall"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        >
          {Math.random() > 0.5 ? (
            <Heart className="text-pink-500" size={16} fill="currentColor" />
          ) : (
            <Sparkles className="text-yellow-500" size={16} />
          )}
        </div>
      ))}
    </div>
  );
};

export default TreasurePage;
