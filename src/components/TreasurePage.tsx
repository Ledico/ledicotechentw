import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import TerminalIntro from './treasure/TerminalIntro';
import LabyrinthNavigation from './treasure/LabyrinthNavigation';
import PhotoGallery from './treasure/PhotoGallery';
import LoveLetters from './treasure/LoveLetters';
import Timeline from './treasure/Timeline';
import MemoryGame from './treasure/MemoryGame';
import Quiz from './treasure/Quiz';
import GiftVouchers from './treasure/GiftVouchers';
import EasterEggs from './treasure/EasterEggs';
import MusicPlayer from './treasure/MusicPlayer';

interface StepCompletion {
  photos: boolean;
  letters: boolean;
  timeline: boolean;
  memory: boolean;
  quiz: boolean;
  gifts: boolean;
}

const TreasurePage: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<StepCompletion>({
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

  const steps = [
    { id: 'photos', title: 'Foto Galerie', icon: '📸', description: 'Unsere schönsten Momente' },
    { id: 'letters', title: 'Liebesbriefe', icon: '💌', description: 'Worte aus meinem Herzen' },
    { id: 'timeline', title: 'Unsere Reise', icon: '📅', description: 'Timeline unserer Zeit' },
    { id: 'memory', title: 'Memory Spiel', icon: '🎮', description: 'Finde die Paare' },
    { id: 'quiz', title: 'Liebes Quiz', icon: '❓', description: 'Wie gut kennst du mich?' },
    { id: 'gifts', title: 'Geschenke', icon: '🎁', description: 'Überraschungen für dich' },
  ];

  const navigationSteps = steps.map((step, index) => ({
    ...step,
    completed: completedSteps[step.id as keyof StepCompletion],
    locked: index > 0 && !completedSteps[steps[index - 1].id as keyof StepCompletion],
  }));

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    const allCompleted = Object.values(completedSteps).every((v) => v);
    if (allCompleted && !showFinalMessage) {
      setShowFinalMessage(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [completedSteps, showFinalMessage]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_progress')
        .select('*')
        .maybeSingle();

      if (data && !error) {
        setCompletedSteps(data.completed_steps || {});
        const lastIncomplete = steps.findIndex(
          (step) => !data.completed_steps[step.id as keyof StepCompletion]
        );
        setCurrentStep(lastIncomplete >= 0 ? lastIncomplete : steps.length - 1);
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

  const handleStepComplete = () => {
    const stepId = steps[currentStep].id as keyof StepCompletion;
    const newCompletedSteps = {
      ...completedSteps,
      [stepId]: true,
    };
    setCompletedSteps(newCompletedSteps);
    saveProgress(newCompletedSteps);

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    if (stepIndex === 0 || completedSteps[steps[stepIndex - 1].id as keyof StepCompletion]) {
      setCurrentStep(stepIndex);
    }
  };

  if (showTerminal) {
    return <TerminalIntro onComplete={handleTerminalComplete} />;
  }

  const currentStepId = steps[currentStep].id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-36 h-36 bg-rose-300 rounded-full opacity-20 blur-3xl animate-pulse delay-500"></div>
      </div>

      <MusicPlayer />
      <EasterEggs onEggFound={(count) => setEasterEggsFound(count)} />
      <LabyrinthNavigation
        currentStep={currentStep}
        onStepSelect={handleStepSelect}
        steps={navigationSteps}
      />

      {showConfetti && <Confetti />}

      <div className="relative z-10">
        <div className="pt-32">
          {currentStepId === 'photos' && (
            <PhotoGallery onBack={handleStepComplete} />
          )}

          {currentStepId === 'letters' && (
            <LoveLetters onBack={handleStepComplete} />
          )}

          {currentStepId === 'timeline' && (
            <Timeline onBack={handleStepComplete} />
          )}

          {currentStepId === 'memory' && (
            <MemoryGame onBack={handleStepComplete} />
          )}

          {currentStepId === 'quiz' && (
            <Quiz onBack={handleStepComplete} />
          )}

          {currentStepId === 'gifts' && (
            <GiftVouchers onBack={handleStepComplete} />
          )}
        </div>
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
    <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 text-center animate-scale-in">
        <div className="mb-6">
          <Heart className="text-pink-500 mx-auto mb-4 animate-pulse" size={80} fill="currentColor" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Du hast es geschafft! 🎉
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Du hast alle Schritte unserer gemeinsamen Reise durchlaufen.
        </p>
        <p className="text-lg text-gray-600 mb-4">
          Jedes Foto, jeder Brief, jeder Moment - sie alle erzählen unsere Geschichte.
        </p>
        {easterEggsFound === 6 && (
          <p className="text-lg text-yellow-600 font-bold mb-6">
            ✨ Und du hast sogar alle versteckten Herzchen gefunden! ✨
          </p>
        )}
        <div className="mt-8 p-6 bg-white/50 rounded-2xl">
          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text">
            Alles Gute zum Geburtstag, Louisa! 💕
          </p>
          <p className="text-gray-600 mt-4">
            Ich liebe dich mehr als Worte es jemals ausdrücken könnten.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

export default TreasurePage;
