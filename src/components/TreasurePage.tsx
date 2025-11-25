import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TerminalIntro from './treasure/TerminalIntro';
import WelcomeSection from './treasure/WelcomeSection';
import PhotoGallery from './treasure/PhotoGallery';
import LoveLetters from './treasure/LoveLetters';
import Timeline from './treasure/Timeline';
import MemoryGame from './treasure/MemoryGame';
import Quiz from './treasure/Quiz';
import GiftVouchers from './treasure/GiftVouchers';
import EasterEggs from './treasure/EasterEggs';

interface StepCompletion {
  welcome: boolean;
  photos: boolean;
  letters: boolean;
  timeline: boolean;
  memory: boolean;
  quiz: boolean;
  gifts: boolean;
}

const TreasurePage: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [completedSteps, setCompletedSteps] = useState<StepCompletion>({
    welcome: false,
    photos: false,
    letters: false,
    timeline: false,
    memory: false,
    quiz: false,
    gifts: false,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [easterEggsFound, setEasterEggsFound] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [hasShownFinalMessage, setHasShownFinalMessage] = useState(false);

  const slides = [
    { id: 'welcome', title: 'Willkommen', component: WelcomeSection },
    { id: 'photos', title: 'Foto Galerie', component: PhotoGallery },
    { id: 'letters', title: 'Liebesbriefe', component: LoveLetters },
    { id: 'timeline', title: 'Unsere Reise', component: Timeline },
    { id: 'memory', title: 'Memory Spiel', component: MemoryGame },
    { id: 'quiz', title: 'Liebes Quiz', component: Quiz },
    { id: 'gifts', title: 'Geschenke', component: GiftVouchers },
  ];

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    const allCompleted = Object.values(completedSteps).every((v) => v);
    if (allCompleted && !hasShownFinalMessage) {
      setShowFinalMessage(true);
      setHasShownFinalMessage(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [completedSteps, hasShownFinalMessage]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_progress')
        .select('*')
        .maybeSingle();

      if (data && !error) {
        setCompletedSteps(data.completed_steps || {});
        const lastIncomplete = slides.findIndex(
          (slide) => !data.completed_steps[slide.id as keyof StepCompletion]
        );
        setCurrentSlide(lastIncomplete >= 0 ? lastIncomplete : 0);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (newCompletedSteps: StepCompletion) => {
    try {
      const { data: existing } = await supabase
        .from('treasure_progress')
        .select('id')
        .maybeSingle();

      if (existing) {
        await supabase
          .from('treasure_progress')
          .update({ completed_steps: newCompletedSteps })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('treasure_progress')
          .insert({ completed_steps: newCompletedSteps });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleTerminalComplete = () => {
    setShowTerminal(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const goToNextSlide = () => {
    const slideId = slides[currentSlide].id as keyof StepCompletion;
    const newCompletedSteps = {
      ...completedSteps,
      [slideId]: true,
    };
    setCompletedSteps(newCompletedSteps);
    saveProgress(newCompletedSteps);

    if (currentSlide < slides.length - 1) {
      setSlideDirection('forward');
      setShowConfetti(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setShowConfetti(false);
      }, 500);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setSlideDirection('backward');
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setSlideDirection(index > currentSlide ? 'forward' : 'backward');
    setCurrentSlide(index);
  };

  if (showTerminal) {
    return <TerminalIntro onComplete={handleTerminalComplete} />;
  }

  const CurrentSlideComponent = slides[currentSlide].component;
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-rose-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      <EasterEggs onEggFound={(count) => setEasterEggsFound(count)} />

      {showConfetti && <Confetti />}

      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm shadow-lg">
        <div className="h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-500" size={20} fill="currentColor" />
            <span className="text-sm font-semibold text-gray-700">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-pink-500 w-8'
                    : index < currentSlide
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {easterEggsFound > 0 && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Sparkles size={16} />
                <span className="text-sm font-semibold">{easterEggsFound}/6</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative min-h-screen pt-20">
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            slideDirection === 'forward'
              ? 'animate-slide-in-right'
              : 'animate-slide-in-left'
          }`}
          key={currentSlide}
        >
          <CurrentSlideComponent onBack={goToNextSlide} />
        </div>
      </div>

      <div className="fixed bottom-8 left-0 right-0 z-40 flex justify-center gap-4 px-4">
        {currentSlide > 0 && (
          <button
            onClick={goToPreviousSlide}
            className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <ChevronLeft size={20} />
            Zurück
          </button>
        )}

        {currentSlide < slides.length - 1 && (
          <button
            onClick={goToNextSlide}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-soft"
          >
            Weiter
            <ChevronRight size={20} />
          </button>
        )}

        {currentSlide === slides.length - 1 && completedSteps.gifts && (
          <button
            onClick={() => setShowFinalMessage(true)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-bounce-slow"
          >
            Finale 🎉
          </button>
        )}
      </div>

      {showFinalMessage && (
        <FinalMessage easterEggsFound={easterEggsFound} onClose={() => setShowFinalMessage(false)} />
      )}
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

const FinalMessage: React.FC<{ easterEggsFound: number; onClose: () => void }> = ({
  easterEggsFound,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <Heart className="text-pink-500 mx-auto mb-4 animate-pulse" size={80} fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slide-down">
          Du hast es geschafft!
        </h1>
        <p className="text-xl text-gray-700 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Du hast alle Schritte unserer gemeinsamen Reise durchlaufen.
        </p>
        <p className="text-lg text-gray-600 mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Jedes Foto, jeder Brief, jeder Moment - sie alle erzählen unsere Geschichte.
        </p>
        {easterEggsFound === 6 && (
          <p className="text-lg text-yellow-600 font-bold mb-6 animate-bounce">
            Und du hast sogar alle versteckten Herzchen gefunden!
          </p>
        )}
        <div className="mt-8 p-6 bg-white/50 rounded-2xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text mb-4">
            Alles Gute zum Geburtstag, Louisa!
          </p>
          <p className="text-gray-600 mt-4 text-lg">
            Ich liebe dich mehr als Worte es jemals ausdrücken könnten.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

export default TreasurePage;
