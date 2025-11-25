import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Photo {
  id: string;
  image_url: string;
  title: string;
  description: string;
  date: string;
}

interface PhotoGalleryProps {
  onBack: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_photos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const newIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const prevPhoto = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="text-pink-500 animate-pulse mx-auto mb-4" size={48} fill="currentColor" />
          <p className="text-xl text-gray-600">Lade Erinnerungen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all mb-8 group"
        >
          <span>Weiter zum nächsten Schritt</span>
          <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
        </button>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Unsere schönsten Momente
          </h1>
          <p className="text-xl text-gray-600">
            Jedes Foto erzählt eine Geschichte von uns 💕
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Fotos hochgeladen. Füge Fotos über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => openLightbox(photo, index)}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                      {photo.date && (
                        <p className="text-sm opacity-90">
                          {new Date(photo.date).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="text-pink-500 animate-pulse" size={32} fill="currentColor" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="text-white" size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="text-white" size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="text-white" size={32} />
          </button>

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-6 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">{selectedPhoto.title}</h2>
              {selectedPhoto.description && (
                <p className="text-lg opacity-90 mb-2">{selectedPhoto.description}</p>
              )}
              {selectedPhoto.date && (
                <p className="text-sm opacity-75">
                  {new Date(selectedPhoto.date).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
              <p className="text-sm opacity-60 mt-4">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
