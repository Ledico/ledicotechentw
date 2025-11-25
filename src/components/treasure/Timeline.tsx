import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image_url: string | null;
  order_index: number;
}

interface TimelineProps {
  onBack: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ onBack }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, settingsRes] = await Promise.all([
        supabase
          .from('treasure_timeline')
          .select('*')
          .order('date', { ascending: true }),
        supabase
          .from('treasure_settings')
          .select('*')
          .limit(1)
          .maybeSingle(),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      setEvents(eventsRes.data || []);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysTogether = () => {
    if (!settings?.days_together_start) return 0;
    const start = new Date(settings.days_together_start);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="text-purple-500 animate-pulse mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-600">Lade unsere Reise...</p>
        </div>
      </div>
    );
  }

  const daysTogether = calculateDaysTogether();

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <span>Weiter zum nächsten Schritt</span>
          <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Unsere gemeinsame Reise
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Jeder Moment mit dir ist unvergesslich 💜
          </p>

          {daysTogether > 0 && (
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full shadow-lg">
              <Heart className="text-purple-500 animate-pulse" size={32} fill="currentColor" />
              <div className="text-left">
                <p className="text-3xl font-bold text-gray-800">{daysTogether}</p>
                <p className="text-sm text-gray-600">Tage zusammen</p>
              </div>
            </div>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Ereignisse hinzugefügt. Füge Events über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-300 via-pink-300 to-rose-300"></div>

            {events.map((event, index) => (
              <div
                key={event.id}
                className={`relative mb-16 ${
                  index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                }`}
              >
                <div
                  className={`group cursor-pointer ${
                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:scale-105">
                    <div className="flex items-start gap-4">
                      {index % 2 === 0 && event.image_url && (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      )}
                      <div className={index % 2 === 0 ? 'text-left' : 'text-right flex-1'}>
                        <p className="text-sm text-purple-600 font-semibold mb-2">
                          {new Date(event.date).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      {index % 2 !== 0 && event.image_url && (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-4 border-white shadow-lg group-hover:scale-125 transition-transform">
                  <Heart
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                    size={16}
                    fill="currentColor"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedEvent.image_url && (
              <img
                src={selectedEvent.image_url}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <CalendarIcon size={20} />
              <p className="font-semibold">
                {new Date(selectedEvent.date).toLocaleDateString('de-DE', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedEvent.title}
            </h2>

            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedEvent.description}
            </p>

            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
