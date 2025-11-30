import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Card {
  id: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onBack: () => void;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (startTime > 0 && !gameWon) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, gameWon]);

  const initializeGame = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_photos')
        .select('image_url')
        .limit(8);

      if (error) throw error;

      if (data && data.length >= 4) {
        const selectedPhotos = data.slice(0, 6);
        const cardPairs = [
          ...selectedPhotos.map((photo, i) => ({
            id: `${i}-a`,
            imageUrl: photo.image_url,
            isFlipped: false,
            isMatched: false,
          })),
          ...selectedPhotos.map((photo, i) => ({
            id: `${i}-b`,
            imageUrl: photo.image_url,
            isFlipped: false,
            isMatched: false,
          })),
        ];

        setCards(shuffleArray(cardPairs));
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      checkMatch(newFlippedCards);
    }
  };

  const checkMatch = (flipped: string[]) => {
    const [first, second] = flipped;
    const firstCard = cards.find((c) => c.id === first);
    const secondCard = cards.find((c) => c.id === second);

    if (firstCard && secondCard && firstCard.imageUrl === secondCard.imageUrl) {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, isMatched: true } : c
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);

        if (matches + 1 === cards.length / 2) {
          setGameWon(true);
        }
      }, 600);
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, isFlipped: false } : c
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setElapsedTime(0);
    setLoading(true);
    initializeGame();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="text-purple-500 animate-pulse mx-auto mb-4" size={48} fill="currentColor" />
          <p className="text-xl text-gray-600">Machä s'Spiil parat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <span>Wiiter zum nöchste Schritt</span>
          <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Memory Spiel
          </h1>
          <p className="text-xl text-gray-600">
            Find dis passende Foti-Pärli! 🎮
          </p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="px-6 py-3 bg-white rounded-full shadow-lg">
            <p className="text-sm text-gray-600">Züüg</p>
            <p className="text-2xl font-bold text-purple-600">{moves}</p>
          </div>
          <div className="px-6 py-3 bg-white rounded-full shadow-lg">
            <p className="text-sm text-gray-600">Pärli</p>
            <p className="text-2xl font-bold text-pink-600">
              {matches} / {cards.length / 2}
            </p>
          </div>
          <div className="px-6 py-3 bg-white rounded-full shadow-lg">
            <p className="text-sm text-gray-600">Ziit</p>
            <p className="text-2xl font-bold text-indigo-600">
              {formatTime(elapsedTime)}
            </p>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Neu ahfange
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-square cursor-pointer perspective-1000"
              onClick={() => handleCardClick(card.id)}
            >
              <div
                className={`relative w-full h-full transition-all duration-500 transform-style-3d ${
                  card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                }`}
              >
                <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="text-white" size={48} fill="currentColor" />
                </div>

                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={card.imageUrl}
                    alt="Memory card"
                    className="w-full h-full object-cover"
                  />
                  {card.isMatched && (
                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                      <Heart className="text-white animate-pulse" size={48} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {gameWon && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scale-in">
            <Trophy className="text-yellow-500 mx-auto mb-4" size={64} />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Glückwunsch! 🎉
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Du häsch alli Pärli gfunde!
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">
                <span className="font-bold">Züüg:</span> {moves}
              </p>
              <p className="text-gray-700">
                <span className="font-bold">Ziit:</span> {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all"
              >
                Nomal spiele
              </button>
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all"
              >
                Wiiter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
