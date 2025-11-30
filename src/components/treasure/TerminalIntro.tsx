import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalIntroProps {
  onComplete: () => void;
}

const TerminalIntro: React.FC<TerminalIntroProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    { text: '> Initialisiere System...', delay: 50, pause: 800 },
    { text: '> Lade Geburtstagsüberraschig für Louisa...', delay: 40, pause: 1000 },
    { text: '> [████████████████████] 100%', delay: 30, pause: 600 },
    { text: '> System bereit.', delay: 50, pause: 800 },
    { text: '', delay: 0, pause: 400 },
    { text: '> Hallo Louisa! 💝', delay: 60, pause: 1000 },
    { text: '> Hüt isch din speziellä Tag...', delay: 50, pause: 1000 },
    { text: '> I ha öppis Bsundärigs für di vorbereitet.', delay: 45, pause: 1200 },
    { text: '', delay: 0, pause: 400 },
    { text: '> Bisch bereit? ✨', delay: 60, pause: 1500 },
    { text: '> Drücke ENTER zum starte...', delay: 50, pause: 0 },
  ];

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setIsComplete(true);
      return;
    }

    const line = terminalLines[currentLine];

    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const newLines = [...prev];
          if (newLines[currentLine] === undefined) {
            newLines[currentLine] = '';
          }
          newLines[currentLine] = line.text.substring(0, currentChar + 1);
          return newLines;
        });
        setCurrentChar((prev) => prev + 1);
      }, line.delay);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
        setCurrentChar(0);
      }, line.pause);

      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isComplete) {
        onComplete();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isComplete, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-500 font-mono text-xs animate-matrix-rain"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          >
            {Array.from({ length: 20 }, () =>
              String.fromCharCode(33 + Math.floor(Math.random() * 94))
            ).join('')}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-4xl mx-4 md:mx-8">
        <div className="bg-gray-900 rounded-lg shadow-2xl border-2 border-pink-500 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-3 flex items-center gap-3">
            <Terminal className="text-white" size={20} />
            <span className="text-white font-mono text-sm">louisa_birthday.exe</span>
            <div className="flex gap-2 ml-auto">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
          </div>

          <div className="p-6 md:p-8 font-mono text-sm md:text-base min-h-[400px] max-h-[600px] overflow-y-auto">
            {lines.map((line, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  line?.includes('💝') || line?.includes('✨')
                    ? 'text-pink-400 font-bold text-lg'
                    : line?.includes('████')
                    ? 'text-green-400'
                    : line?.includes('ENTER')
                    ? 'text-yellow-400 animate-pulse'
                    : 'text-green-500'
                }`}
              >
                {line || ''}
              </div>
            ))}
            {currentLine < terminalLines.length && (
              <span className={`text-green-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
                ▊
              </span>
            )}
            {isComplete && (
              <button
                onClick={onComplete}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-pink-500/50 animate-pulse"
              >
                START DRÜCKEN
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs font-mono">
            {isComplete ? '↑ Drück ENTER oder klick dä Button' : 'System ladet...'}
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pink-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TerminalIntro;
