import React, { useState } from 'react';
import { Gift, Image as ImageIcon, Mail, Calendar, Gamepad2, HelpCircle, Star, Heart } from 'lucide-react';

interface TreasureBoxesProps {
  onOpenBox: (boxType: any) => void;
  easterEggsFound: number;
}

interface Box {
  id: string;
  type: any;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const boxes: Box[] = [
  {
    id: '1',
    type: 'photos',
    icon: ImageIcon,
    title: 'Foto Galerie',
    description: 'Unsere schönsten Momente',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-200',
  },
  {
    id: '2',
    type: 'letters',
    icon: Mail,
    title: 'Liebesbriefe',
    description: 'Worte aus meinem Herzen',
    color: 'from-rose-400 to-red-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-red-200',
  },
  {
    id: '3',
    type: 'timeline',
    icon: Calendar,
    title: 'Unsere Reise',
    description: 'Timeline unserer gemeinsamen Zeit',
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-200',
  },
  {
    id: '4',
    type: 'memory',
    icon: Gamepad2,
    title: 'Memory Spiel',
    description: 'Finde die passenden Paare',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-200',
  },
  {
    id: '5',
    type: 'quiz',
    icon: HelpCircle,
    title: 'Liebes Quiz',
    description: 'Wie gut kennst du mich?',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-200',
  },
  {
    id: '6',
    type: 'gifts',
    icon: Gift,
    title: 'Geschenke',
    description: 'Besondere Überraschungen für dich',
    color: 'from-yellow-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-orange-200',
  },
];

const TreasureBoxes: React.FC<TreasureBoxesProps> = ({ onOpenBox, easterEggsFound }) => {
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Wähle eine Schatztruhe
          </h1>
          <p className="text-xl text-gray-600">
            Jede Truhe enthält eine besondere Überraschung für dich 💝
          </p>
          {easterEggsFound > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-yellow-100 border-2 border-yellow-400 rounded-full">
              <Star className="text-yellow-600" fill="currentColor" size={24} />
              <span className="text-lg font-semibold text-yellow-800">
                {easterEggsFound} versteckte Herzchen gefunden!
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boxes.map((box) => {
            const Icon = box.icon;
            return (
              <div
                key={box.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredBox(box.id)}
                onMouseLeave={() => setHoveredBox(null)}
                onClick={() => onOpenBox(box.type)}
              >
                <div
                  className={`
                    relative p-8 rounded-3xl shadow-2xl
                    transform transition-all duration-500
                    ${hoveredBox === box.id ? 'scale-110 -translate-y-4 rotate-2' : 'scale-100'}
                    ${box.gradient}
                  `}
                >
                  <div className="absolute -top-2 -right-2">
                    {hoveredBox === box.id && (
                      <>
                        <Heart
                          className="text-pink-500 animate-ping absolute"
                          size={24}
                          fill="currentColor"
                        />
                        <Heart
                          className="text-pink-500 relative"
                          size={24}
                          fill="currentColor"
                        />
                      </>
                    )}
                  </div>

                  <div className="flex flex-col items-center text-center space-y-4">
                    <div
                      className={`
                        p-6 rounded-2xl bg-gradient-to-br ${box.color}
                        transform transition-transform duration-500
                        ${hoveredBox === box.id ? 'rotate-12 scale-110' : 'rotate-0'}
                      `}
                    >
                      <Icon className="text-white" size={48} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800">{box.title}</h3>
                    <p className="text-gray-600">{box.description}</p>

                    <div
                      className={`
                        mt-4 px-6 py-2 bg-white/50 rounded-full
                        transform transition-all duration-300
                        ${hoveredBox === box.id ? 'scale-110 bg-white' : 'scale-100'}
                      `}
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        Klick zum Öffnen
                      </span>
                    </div>
                  </div>

                  {hoveredBox === box.id && (
                    <div className="absolute inset-0 rounded-3xl border-4 border-pink-400 animate-pulse pointer-events-none"></div>
                  )}
                </div>

                {hoveredBox === box.id && (
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-3xl opacity-20 blur-xl -z-10 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-purple-100 rounded-full">
            <Star className="text-purple-600" size={20} />
            <span className="text-gray-700">
              Psst... Es gibt {6 - easterEggsFound} versteckte Herzchen auf der Seite! 🔍
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasureBoxes;
