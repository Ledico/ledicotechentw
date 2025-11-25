import React, { useState, useEffect } from 'react';
import { Check, Lock, Star, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Step {
  id: string;
  title: string;
  icon: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

interface LabyrinthNavigationProps {
  currentStep: number;
  onStepSelect: (step: number) => void;
  steps: Step[];
}

const LabyrinthNavigation: React.FC<LabyrinthNavigationProps> = ({
  currentStep,
  onStepSelect,
  steps,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/95 via-black/90 to-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-400" size={24} fill="currentColor" />
            <span className="text-white font-bold text-lg">
              Deine Reise: {steps.filter((s) => s.completed).length} / {steps.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => !step.locked && onStepSelect(index)}
                disabled={step.locked}
                className={`
                  relative flex-shrink-0 group
                  ${step.locked ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div
                  className={`
                    w-16 h-16 rounded-xl flex items-center justify-center text-2xl
                    transition-all duration-300 transform
                    ${
                      step.completed
                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                        : currentStep === index
                        ? 'bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg shadow-pink-500/50 scale-110 animate-pulse'
                        : step.locked
                        ? 'bg-gray-700 opacity-50'
                        : 'bg-gray-600 hover:bg-gray-500 hover:scale-105'
                    }
                  `}
                >
                  {step.completed ? (
                    <Check className="text-white" size={32} />
                  ) : step.locked ? (
                    <Lock className="text-gray-400" size={24} />
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>

                {currentStep === index && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                  </div>
                )}

                {!step.locked && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/90 px-3 py-1 rounded text-white text-xs">
                      {step.title}
                    </div>
                  </div>
                )}
              </button>

              {index < steps.length - 1 && (
                <div className="flex-shrink-0">
                  <ArrowRight
                    className={`
                      ${step.completed ? 'text-green-500' : 'text-gray-600'}
                      transition-colors duration-300
                    `}
                    size={20}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabyrinthNavigation;
