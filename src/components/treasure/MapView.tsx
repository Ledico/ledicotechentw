import React, { useState, useEffect } from 'react';
import { X, MapPin, Heart, Navigation } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Photo {
  id: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
  location_name: string | null;
  location_lat: number | null;
  location_lng: number | null;
}

interface MapViewProps {
  onClose: () => void;
}

const MapView: React.FC<MapViewProps> = ({ onClose }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotosWithLocations();
  }, []);

  const fetchPhotosWithLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_photos')
        .select('*')
        .not('location_name', 'is', null)
        .order('date', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="text-pink-500 animate-bounce mx-auto mb-4" size={64} />
          <p className="text-2xl text-gray-700 animate-pulse">Lade Standort...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 md:top-8 md:right-8 p-3 bg-white/80 backdrop-blur-md hover:bg-pink-100 rounded-full transition-all hover:scale-110 shadow-lg z-50"
        >
          <X className="text-gray-700" size={24} />
        </button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12 animate-fade-in-down">
            <div className="inline-flex items-center gap-3 mb-4">
              <MapPin className="text-pink-500 animate-bounce" size={40} />
              <Heart className="text-rose-400 animate-pulse" size={32} fill="currentColor" />
              <Navigation className="text-pink-500 animate-bounce" size={40} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent mb-4">
              Üseri Reis zäme
            </h1>
            <p className="text-lg md:text-xl text-gray-700">
              All Ort wo mir zäme gsi sind
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="text-gray-400 mx-auto mb-4" size={64} />
              <p className="text-xl text-gray-500">
                Kei Standort-Informatione verfüegbar
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all animate-fade-in-up border-2 border-pink-200/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      className="md:w-1/3 cursor-pointer"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="md:w-2/3 flex flex-col justify-center">
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin className="text-pink-500 mt-1 flex-shrink-0" size={24} />
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            {photo.title}
                          </h3>
                          <p className="text-lg font-semibold text-pink-600 mb-2">
                            {photo.location_name}
                          </p>
                        </div>
                      </div>

                      {photo.description && (
                        <p className="text-gray-700 mb-3 text-lg">
                          {photo.description}
                        </p>
                      )}

                      {photo.date && (
                        <p className="text-sm text-gray-600">
                          {new Date(photo.date).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}

                      {photo.location_lat && photo.location_lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${photo.location_lat},${photo.location_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:shadow-lg transition-all hover:scale-105 w-fit"
                        >
                          <Navigation size={18} />
                          <span>Uf Google Maps azeige</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 bg-pink-500/20 hover:bg-pink-500/40 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-pink-300/30"
          >
            <X className="text-white" size={24} />
          </button>

          <div
            className="max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl border-4 border-pink-500/30"
            />

            <div className="mt-6 text-center text-white">
              <div className="inline-flex items-center gap-2 mb-2">
                <Heart className="text-pink-400 animate-heartbeat" size={24} fill="currentColor" />
                <h2 className="text-2xl md:text-3xl font-bold">{selectedPhoto.title}</h2>
              </div>
              <p className="text-lg text-pink-300 mb-2">{selectedPhoto.location_name}</p>
              {selectedPhoto.description && (
                <p className="text-base opacity-90 mb-2">{selectedPhoto.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
