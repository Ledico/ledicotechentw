import React, { useState, useEffect } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EasterEgg {
  id: string;
  position_id: string;
  message: string;
  is_found: boolean;
}

interface EasterEggsProps {
  onEggFound: (count: number) => void;
}

const positions = [
  { id: 'egg1', top: '10%', left: '5%' },
  { id: 'egg2', top: '25%', right: '8%' },
  { id: 'egg3', bottom: '15%', left: '12%' },
  { id: 'egg4', top: '50%', right: '15%' },
  { id: 'egg5', bottom: '30%', right: '5%' },
  { id: 'egg6', top: '70%', left: '8%' },
];

const EasterEggs: React.FC<EasterEggsProps> = ({ onEggFound }) => {
  const [eggs, setEggs] = useState<EasterEgg[]>([]);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEggs();
  }, []);

  useEffect(() => {
    const foundCount = eggs.filter((e) => e.is_found).length;
    onEggFound(foundCount);
  }, [eggs, onEggFound]);

  const fetchEggs = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_easter_eggs')
        .select('*');

      if (error) {
        console.log('Easter eggs table not available, using local state');
        const localEggs = positions.map((pos, index) => ({
          id: pos.id,
          position_id: pos.id,
          message: getDefaultMessage(index),
          is_found: false,
        }));
        setEggs(localEggs);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        const newEggs = positions.map((pos, index) => ({
          position_id: pos.id,
          message: getDefaultMessage(index),
          is_found: false,
        }));

        for (const egg of newEggs) {
          await supabase.from('treasure_easter_eggs').insert(egg);
        }

        const { data: refreshedData } = await supabase
          .from('treasure_easter_eggs')
          .select('*');
        setEggs(refreshedData || []);
      } else {
        setEggs(data);
      }
    } catch (error) {
      console.error('Error fetching easter eggs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMessage = (index: number) => {
    const messages = [
      'Du hast mich gefunden! 💕 Du bist so aufmerksam!',
      'Wow! 🌟 Du hast ein verstecktes Herzchen entdeckt!',
      'Super! ✨ Ich liebe deine Neugier!',
      '🎉 Geschafft! Du bist die Beste!',
      '💖 Gefunden! Genau wie du mein Herz gefunden hast!',
      '🌸 Das letzte Herzchen! Du bist einfach perfekt!',
    ];
    return messages[index] || 'Du hast ein Herzchen gefunden! 💕';
  };

  const handleEggClick = async (egg: EasterEgg) => {
    if (egg.is_found) return;

    try {
      setEggs((prev) =>
        prev.map((e) => (e.id === egg.id ? { ...e, is_found: true } : e))
      );

      setShowMessage(egg.message);
      setTimeout(() => setShowMessage(null), 3000);

      await supabase
        .from('treasure_easter_eggs')
        .update({ is_found: true })
        .eq('id', egg.id)
        .then(({ error }) => {
          if (error) {
            console.log('Could not save to database, using local state only');
          }
        });
    } catch (error) {
      console.error('Error updating easter egg:', error);
    }
  };

  if (loading) return null;

  return (
    <>
      {eggs.map((egg) => {
        const position = positions.find((p) => p.id === egg.position_id);
        if (!position || egg.is_found) return null;

        return (
          <div
            key={egg.id}
            className="fixed z-40 cursor-pointer animate-bounce-slow"
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              bottom: position.bottom,
            }}
            onClick={() => handleEggClick(egg)}
          >
            <div className="relative group">
              <Heart
                className="text-pink-400 opacity-60 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"
                size={32}
                fill="currentColor"
              />
              <Sparkles
                className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 animate-pulse"
                size={16}
              />
            </div>
          </div>
        );
      })}

      {showMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-scale-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md border-4 border-pink-300">
            <div className="text-center">
              <Star className="text-yellow-400 mx-auto mb-4 animate-spin-slow" size={48} fill="currentColor" />
              <p className="text-2xl font-bold text-gray-800">{showMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EasterEggs;
