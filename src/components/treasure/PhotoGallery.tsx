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
    <div className="min-h-screen flex flex-col py-4 md:py-8 lg:py-12 relative overflow-hidden">
      {/* Decorative Flowers - Top Left */}
      <div className="fixed top-0 left-0 pointer-events-none z-0 opacity-20 md:opacity-30">
        <svg width="200" height="200" viewBox="0 0 200 200" className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48">
          <g className="animate-float">
            <ellipse cx="100" cy="80" rx="15" ry="35" fill="#ec4899" opacity="0.8" transform="rotate(0 100 80)" />
            <ellipse cx="100" cy="80" rx="15" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(72 100 80)" />
            <ellipse cx="100" cy="80" rx="15" ry="35" fill="#ec4899" opacity="0.8" transform="rotate(144 100 80)" />
            <ellipse cx="100" cy="80" rx="15" ry="35" fill="#f472b6" opacity="0.8" transform="rotate(216 100 80)" />
            <ellipse cx="100" cy="80" rx="15" ry="35" fill="#ec4899" opacity="0.8" transform="rotate(288 100 80)" />
            <circle cx="100" cy="80" r="12" fill="#fbbf24" />
          </g>
        </svg>
      </div>

      {/* Decorative Lilies - Top Right */}
      <div className="fixed top-0 right-0 pointer-events-none z-0 opacity-20 md:opacity-30">
        <svg width="180" height="180" viewBox="0 0 180 180" className="w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40">
          <g className="animate-float-delayed">
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#db2777" opacity="0.7" />
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#ec4899" opacity="0.7" transform="rotate(60 90 100)" />
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#f472b6" opacity="0.7" transform="rotate(120 90 100)" />
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#db2777" opacity="0.7" transform="rotate(180 90 100)" />
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#ec4899" opacity="0.7" transform="rotate(240 90 100)" />
            <path d="M90 140 Q70 100 90 60 Q110 100 90 140" fill="#f472b6" opacity="0.7" transform="rotate(300 90 100)" />
            <circle cx="90" cy="100" r="10" fill="#fcd34d" />
          </g>
        </svg>
      </div>

      {/* Decorative Flowers - Bottom Left */}
      <div className="fixed bottom-10 left-5 pointer-events-none z-0 opacity-20 md:opacity-25">
        <svg width="150" height="150" viewBox="0 0 150 150" className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32">
          <g className="animate-float">
            <circle cx="75" cy="75" r="20" fill="#f472b6" opacity="0.8" />
            <circle cx="95" cy="65" r="18" fill="#ec4899" opacity="0.8" />
            <circle cx="55" cy="65" r="18" fill="#ec4899" opacity="0.8" />
            <circle cx="85" cy="90" r="18" fill="#db2777" opacity="0.8" />
            <circle cx="65" cy="90" r="18" fill="#db2777" opacity="0.8" />
            <circle cx="75" cy="75" r="12" fill="#fde047" />
          </g>
        </svg>
      </div>

      {/* Decorative Flowers - Bottom Right */}
      <div className="fixed bottom-5 right-10 pointer-events-none z-0 opacity-20 md:opacity-25">
        <svg width="160" height="160" viewBox="0 0 160 160" className="w-18 h-18 md:w-26 md:h-26 lg:w-36 lg:h-36">
          <g className="animate-float-delayed">
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#f472b6" opacity="0.9" transform="rotate(0 80 60)" />
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#ec4899" opacity="0.9" transform="rotate(60 80 60)" />
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#f472b6" opacity="0.9" transform="rotate(120 80 60)" />
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#ec4899" opacity="0.9" transform="rotate(180 80 60)" />
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#f472b6" opacity="0.9" transform="rotate(240 80 60)" />
            <ellipse cx="80" cy="60" rx="12" ry="30" fill="#ec4899" opacity="0.9" transform="rotate(300 80 60)" />
            <circle cx="80" cy="60" r="10" fill="#fde68a" />
          </g>
        </svg>
      </div>

      <div className="w-full flex flex-col flex-1 relative z-10">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all mb-4 md:mb-6 lg:mb-8 group text-sm md:text-base"
          >
            <span className="hidden sm:inline">Weiter zum nächsten Schritt</span>
            <span className="sm:hidden">Weiter</span>
            <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
          </button>

          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
              Unsere schönsten Momente
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600">
              Jedes Foto erzählt eine Geschichte von uns 💕
            </p>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-12 md:py-20 px-4">
            <Heart className="text-gray-400 mx-auto mb-4" size={48} />
            <p className="text-lg md:text-xl text-gray-500">
              Noch keine Fotos hochgeladen. Füge Fotos über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
            <div className="columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
                  onClick={() => openLightbox(photo, index)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-0.5 md:mb-1 line-clamp-2">{photo.title}</h3>
                        {photo.date && (
                          <p className="text-xs md:text-sm opacity-90">
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
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="text-pink-500 drop-shadow-lg" size={16} fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="text-white" size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-2 sm:left-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-2 sm:right-6 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.image_url}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
            />
            <div className="mt-3 sm:mt-6 text-center text-white px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{selectedPhoto.title}</h2>
              {selectedPhoto.description && (
                <p className="text-sm sm:text-base md:text-lg opacity-90 mb-2">{selectedPhoto.description}</p>
              )}
              {selectedPhoto.date && (
                <p className="text-xs sm:text-sm opacity-75">
                  {new Date(selectedPhoto.date).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
              <p className="text-xs sm:text-sm opacity-60 mt-2 sm:mt-4">
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
