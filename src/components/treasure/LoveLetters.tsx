import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Letter {
  id: string;
  title: string;
  content: string;
  order_index: number;
  is_opened: boolean;
}

interface LoveLettersProps {
  onBack: () => void;
}

const LoveLetters: React.FC<LoveLettersProps> = ({ onBack }) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetchLetters();
  }, []);

  useEffect(() => {
    if (selectedLetter && !isTyping) {
      setIsTyping(true);
      setTypingText('');
      let currentIndex = 0;
      const text = selectedLetter.content;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypingText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [selectedLetter]);

  const fetchLetters = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_letters')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLetter = async (letter: Letter) => {
    setSelectedLetter(letter);

    if (!letter.is_opened) {
      try {
        await supabase
          .from('treasure_letters')
          .update({ is_opened: true })
          .eq('id', letter.id);

        setLetters((prev) =>
          prev.map((l) => (l.id === letter.id ? { ...l, is_opened: true } : l))
        );
      } catch (error) {
        console.error('Error updating letter status:', error);
      }
    }
  };

  const closeLetter = () => {
    setSelectedLetter(null);
    setTypingText('');
    setIsTyping(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Mail className="text-rose-500 animate-pulse mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-600">Lade Liebesbriefe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
          <span>Zurück zu den Truhen</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Liebesbriefe für dich
          </h1>
          <p className="text-xl text-gray-600">
            Worte aus meinem Herzen, nur für dich geschrieben 💌
          </p>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-20">
            <Mail className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Briefe geschrieben. Füge Briefe über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {letters.map((letter, index) => (
              <div
                key={letter.id}
                className="group relative cursor-pointer"
                onClick={() => openLetter(letter)}
              >
                <div className="relative transform hover:scale-105 transition-all duration-300">
                  <div className="bg-gradient-to-br from-rose-100 to-pink-200 rounded-lg shadow-xl hover:shadow-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200 rounded-full -mr-16 -mt-16 opacity-50"></div>

                    <div className="relative z-10">
                      <Mail
                        className={`mx-auto mb-4 transition-all duration-300 ${
                          letter.is_opened
                            ? 'text-rose-400'
                            : 'text-rose-600 group-hover:scale-110'
                        }`}
                        size={48}
                        fill={letter.is_opened ? 'currentColor' : 'none'}
                      />

                      <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                        Brief {index + 1}
                      </h3>
                      <p className="text-center text-gray-600 font-serif italic">
                        {letter.title}
                      </p>

                      {letter.is_opened && (
                        <div className="mt-4 flex justify-center">
                          <span className="px-3 py-1 bg-rose-200 text-rose-700 text-xs rounded-full">
                            Gelesen ✓
                          </span>
                        </div>
                      )}

                      {!letter.is_opened && (
                        <div className="mt-4 text-center">
                          <span className="text-sm text-gray-500">
                            Klick zum Öffnen
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>

                  {!letter.is_opened && (
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      <Heart className="text-pink-500" size={24} fill="currentColor" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedLetter && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeLetter}
        >
          <div
            className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8 md:p-12 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 30px,
                rgba(219, 39, 119, 0.1) 30px,
                rgba(219, 39, 119, 0.1) 31px
              )`,
            }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={closeLetter}
                className="p-2 hover:bg-rose-100 rounded-full transition-colors"
              >
                <Heart className="text-rose-500" size={24} />
              </button>
            </div>

            <div className="font-serif">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                {selectedLetter.title}
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {typingText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-rose-200 text-center">
                <p className="text-gray-600 italic">Mit all meiner Liebe ❤️</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-amber-50 to-transparent"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveLetters;
