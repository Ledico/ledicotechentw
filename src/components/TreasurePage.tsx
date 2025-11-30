import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TerminalIntro from './treasure/TerminalIntro';
import WelcomeSection from './treasure/WelcomeSection';
import PhotoGallery from './treasure/PhotoGallery';
import MemoryGame from './treasure/MemoryGame';
import Quiz from './treasure/Quiz';
import BirthdayFacts from './treasure/BirthdayFacts';
import GiftVouchers from './treasure/GiftVouchers';
import EasterEggs from './treasure/EasterEggs';

interface StepCompletion {
  welcome: boolean;
  photos: boolean;
  memory: boolean;
  quiz: boolean;
  birthday: boolean;
  gifts: boolean;
}

const TreasurePage: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [slideTransition, setSlideTransition] = useState<'fade' | 'slide-up' | 'slide-down' | 'zoom'>('fade');
  const [showControls, setShowControls] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<StepCompletion>({
    welcome: false,
    photos: false,
    memory: false,
    quiz: false,
    birthday: false,
    gifts: false,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [easterEggsFound, setEasterEggsFound] = useState(0);
  const [hasShownFinalMessage, setHasShownFinalMessage] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    { id: 'welcome', title: 'Willkommen', component: WelcomeSection },
    { id: 'photos', title: 'Foto Galerie', component: PhotoGallery },
    { id: 'memory', title: 'Memory Spiel', component: MemoryGame },
    { id: 'quiz', title: 'Liebes Quiz', component: Quiz },
    { id: 'birthday', title: 'Din Geburtstag', component: BirthdayFacts },
    { id: 'gifts', title: 'Geschenke', component: GiftVouchers },
  ];

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    const allCompleted = Object.values(completedSteps).every((v) => v);
    if (allCompleted && !hasShownFinalMessage) {
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

  const getRandomTransition = () => {
    const transitions: Array<'fade' | 'slide-up' | 'slide-down' | 'zoom'> = ['fade', 'slide-up', 'slide-down', 'zoom'];
    return transitions[Math.floor(Math.random() * transitions.length)];
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
      setSlideTransition(getRandomTransition());
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
      setSlideTransition(getRandomTransition());
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setSlideDirection(index > currentSlide ? 'forward' : 'backward');
    setSlideTransition(getRandomTransition());
    setCurrentSlide(index);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPreviousSlide();
      } else {
        goToNextSlide();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousSlide();
    } else if (e.key === 'Escape') {
      setShowControls(!showControls);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  if (showTerminal) {
    return <TerminalIntro onComplete={handleTerminalComplete} />;
  }

  const CurrentSlideComponent = slides[currentSlide].component;
  const progress = ((currentSlide + 1) / slides.length) * 100;

  const getTransitionClass = () => {
    const base = slideDirection === 'forward' ? '' : 'reverse-';
    switch (slideTransition) {
      case 'fade':
        return 'animate-cinematic-fade';
      case 'slide-up':
        return `animate-cinematic-${base}slide-up`;
      case 'slide-down':
        return `animate-cinematic-${base}slide-down`;
      case 'zoom':
        return `animate-cinematic-${base}zoom`;
      default:
        return 'animate-cinematic-fade';
    }
  };

  return (
    <div
      className="min-h-screen relative bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 cursor-none"
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-rose-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      <div
        className="fixed pointer-events-none z-[100] transition-transform duration-100"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-6 h-6 border-2 border-pink-600 rounded-full animate-pulse-soft shadow-lg"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-700 rounded-full shadow-md"></div>
      </div>

      <EasterEggs onEggFound={(count) => setEasterEggsFound(count)} />

      {showConfetti && <Confetti />}

      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>

        <div className="absolute top-4 left-4 text-white/80 text-sm font-semibold backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
          {currentSlide + 1} / {slides.length}
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-6'
                  : index < currentSlide
                  ? 'bg-green-400'
                  : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {easterEggsFound > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-yellow-300 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full">
            <Sparkles size={14} />
            <span className="text-sm font-semibold">{easterEggsFound}/6</span>
          </div>
        )}
      </div>

      <div className="fixed inset-0 overflow-y-auto">
        <div
          className={`min-h-screen ${getTransitionClass()}`}
          key={currentSlide}
        >
          <CurrentSlideComponent onBack={goToNextSlide} />
        </div>
      </div>

      <div
        className={`fixed bottom-8 left-0 right-0 z-50 flex justify-center gap-6 px-4 transition-all duration-500 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        {currentSlide > 0 && (
          <button
            onClick={goToPreviousSlide}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300"
          >
            ← Zurück
          </button>
        )}

        <button
          onClick={goToNextSlide}
          className="px-8 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-full border border-white/30 hover:bg-white/30 hover:scale-110 transition-all duration-300"
        >
          {currentSlide === slides.length - 1 ? 'Finale →' : 'Weiter →'}
        </button>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs text-center">
        <p>Pfeiltasten, Leertaste oder Wischen zum Navigieren • ESC für Kontrollen</p>
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
