import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Heart, Sparkles, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import MapView from './MapView';

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

const FloatingFlower = ({ delay = 0, x = 0, y = 0, size = 60, type = 1 }) => {
  const flowers = {
    1: (
      <svg width={size} height={size} viewBox="0 0 100 100" className="animate-float-soft">
        <g style={{ animationDelay: `${delay}s` }}>
          <ellipse cx="50" cy="50" rx="8" ry="18" fill="#ec4899" opacity="0.8" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="18" fill="#f472b6" opacity="0.8" transform="rotate(72 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="18" fill="#ec4899" opacity="0.8" transform="rotate(144 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="18" fill="#f472b6" opacity="0.8" transform="rotate(216 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="18" fill="#ec4899" opacity="0.8" transform="rotate(288 50 50)" />
          <circle cx="50" cy="50" r="6" fill="#fbbf24" />
        </g>
      </svg>
    ),
    2: (
      <svg width={size} height={size} viewBox="0 0 100 100" className="animate-float-gentle">
        <g style={{ animationDelay: `${delay}s` }}>
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#db2777" opacity="0.7" />
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#ec4899" opacity="0.7" transform="rotate(60 50 55)" />
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#f472b6" opacity="0.7" transform="rotate(120 50 55)" />
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#db2777" opacity="0.7" transform="rotate(180 50 55)" />
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#ec4899" opacity="0.7" transform="rotate(240 50 55)" />
          <path d="M50 70 Q40 55 50 40 Q60 55 50 70" fill="#f472b6" opacity="0.7" transform="rotate(300 50 55)" />
          <circle cx="50" cy="55" r="5" fill="#fcd34d" />
        </g>
      </svg>
    ),
    3: (
      <svg width={size} height={size} viewBox="0 0 100 100" className="animate-float-slow">
        <g style={{ animationDelay: `${delay}s` }}>
          <circle cx="50" cy="50" r="12" fill="#f472b6" opacity="0.8" />
          <circle cx="62" cy="45" r="10" fill="#ec4899" opacity="0.8" />
          <circle cx="38" cy="45" r="10" fill="#ec4899" opacity="0.8" />
          <circle cx="58" cy="58" r="10" fill="#db2777" opacity="0.8" />
          <circle cx="42" cy="58" r="10" fill="#db2777" opacity="0.8" />
          <circle cx="50" cy="50" r="7" fill="#fde047" />
        </g>
      </svg>
    ),
  };

  return (
    <div
      className="fixed pointer-events-none z-5"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: 0.3,
      }}
    >
      {flowers[type as keyof typeof flowers]}
    </div>
  );
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onBack }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMapView, setShowMapView] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 relative overflow-hidden">
        <FloatingFlower x={10} y={15} size={80} type={1} delay={0} />
        <FloatingFlower x={85} y={20} size={70} type={2} delay={1} />
        <FloatingFlower x={15} y={75} size={90} type={3} delay={2} />
        <div className="text-center relative z-10">
          <Heart className="text-pink-500 animate-heartbeat mx-auto mb-4" size={64} fill="currentColor" />
          <p className="text-2xl text-gray-700 animate-pulse">Ich lade üseri Erinnerige...</p>
          <Sparkles className="text-pink-400 animate-spin-slow mx-auto mt-4" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 pb-12">
      {/* Animated Background Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-radial from-transparent via-pink-100/20 to-purple-100/30 animate-gradient-shift pointer-events-none" />

      {/* Floating Flowers Everywhere */}
      <FloatingFlower x={5} y={10} size={70} type={1} delay={0} />
      <FloatingFlower x={15} y={25} size={50} type={3} delay={2.5} />
      <FloatingFlower x={8} y={50} size={60} type={2} delay={4} />
      <FloatingFlower x={12} y={75} size={80} type={1} delay={1.5} />
      <FloatingFlower x={6} y={90} size={65} type={3} delay={3} />

      <FloatingFlower x={88} y={8} size={75} type={2} delay={1} />
      <FloatingFlower x={92} y={30} size={55} type={1} delay={3.5} />
      <FloatingFlower x={85} y={55} size={70} type={3} delay={2} />
      <FloatingFlower x={90} y={78} size={60} type={2} delay={4.5} />
      <FloatingFlower x={94} y={92} size={80} type={1} delay={0.5} />

      <FloatingFlower x={30} y={5} size={45} type={2} delay={2.8} />
      <FloatingFlower x={50} y={3} size={55} type={3} delay={1.3} />
      <FloatingFlower x={70} y={7} size={50} type={1} delay={3.8} />

      <FloatingFlower x={25} y={95} size={60} type={1} delay={2.2} />
      <FloatingFlower x={48} y={98} size={50} type={2} delay={4.2} />
      <FloatingFlower x={75} y={94} size={70} type={3} delay={1.8} />

      {/* Floating Sparkles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="fixed w-1 h-1 bg-pink-400 rounded-full animate-sparkle pointer-events-none z-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div className="w-full flex flex-col relative z-10 py-4 md:py-8 lg:py-12 min-h-full">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-10">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all group text-sm md:text-base backdrop-blur-sm border border-pink-300/50 hover:scale-105 animate-slide-in-left"
            >
              <span className="hidden sm:inline">Witer zum nächste Schritt</span>
              <span className="sm:hidden">Witer</span>
              <ArrowLeft className="group-hover:translate-x-1 transition-transform rotate-180" size={20} />
            </button>

            <button
              onClick={() => setShowMapView(true)}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all group text-sm md:text-base backdrop-blur-sm border border-blue-300/50 hover:scale-105 animate-slide-in-right"
            >
              <MapPin size={20} />
              <span className="hidden sm:inline">Standort azeige</span>
              <span className="sm:hidden">Map</span>
            </button>
          </div>

          <div className="text-center mb-8 md:mb-10 lg:mb-16 animate-fade-in-down">
            <div className="inline-flex items-center gap-3 mb-4">
              <Heart className="text-pink-500 animate-heartbeat" size={40} fill="currentColor" />
              <Sparkles className="text-rose-400 animate-pulse" size={32} />
              <Heart className="text-pink-500 animate-heartbeat" size={40} fill="currentColor" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent mb-3 md:mb-5 animate-text-shimmer">
              Üseri schönste Moment
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
              Jedes Föteli verzellt es Gschichtli vo üs 💕
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20 px-4 animate-fade-in">
            <Heart className="text-gray-400 mx-auto mb-4 animate-pulse" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Fotos hochgeladen. Füge Fotos über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
            {/* Mobile: 2 columns */}
            <div className="flex gap-3 sm:gap-4 md:hidden">
              {[0, 1].map((colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 flex flex-col gap-3 sm:gap-4"
                  style={{
                    marginTop: [0, 30][colIndex] + 'px'
                  }}
                >
                  {photos
                    .filter((_, index) => index % 2 === colIndex)
                    .map((photo) => {
                      const originalIndex = photos.findIndex(p => p.id === photo.id);
                      return (
                <div
                  key={photo.id}
                  className="group relative cursor-pointer overflow-visible animate-fade-in-up"
                  onClick={() => openLightbox(photo, originalIndex)}
                  style={{
                    animationDelay: `${originalIndex * 0.08}s`
                  }}
                >
                  {/* Floating Hearts on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none z-20">
                    <Heart className="text-pink-500 animate-bounce" size={20} fill="currentColor" />
                  </div>

                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white p-2 border-2 border-pink-200/50 group-hover:border-pink-400/80">
                    <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Sparkle Effect on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-0.5 md:mb-1 line-clamp-2 animate-slide-in-up">
                            {photo.title}
                          </h3>
                          {photo.date && (
                            <p className="text-xs md:text-sm opacity-90 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
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

                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-110 z-30">
                      <div className="relative">
                        <Heart className="text-pink-500 drop-shadow-2xl animate-heartbeat" size={24} fill="currentColor" />
                        <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Tablet: 3 columns */}
            <div className="hidden md:flex lg:hidden gap-5">
              {[0, 1, 2].map((colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 flex flex-col gap-5"
                  style={{
                    marginTop: [0, 30, 50][colIndex] + 'px'
                  }}
                >
                  {photos
                    .filter((_, index) => index % 3 === colIndex)
                    .map((photo) => {
                      const originalIndex = photos.findIndex(p => p.id === photo.id);
                      return (
                <div
                  key={photo.id}
                  className="group relative cursor-pointer overflow-visible animate-fade-in-up"
                  onClick={() => openLightbox(photo, originalIndex)}
                  style={{
                    animationDelay: `${originalIndex * 0.08}s`
                  }}
                >
                  {/* Floating Hearts on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none z-20">
                    <Heart className="text-pink-500 animate-bounce" size={20} fill="currentColor" />
                  </div>

                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white p-2 border-2 border-pink-200/50 group-hover:border-pink-400/80">
                    <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Sparkle Effect on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-0.5 md:mb-1 line-clamp-2 animate-slide-in-up">
                            {photo.title}
                          </h3>
                          {photo.date && (
                            <p className="text-xs md:text-sm opacity-90 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
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

                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-110 z-30">
                      <div className="relative">
                        <Heart className="text-pink-500 drop-shadow-2xl animate-heartbeat" size={24} fill="currentColor" />
                        <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Desktop: 4-5 columns */}
            <div className="hidden lg:flex gap-6">
              {[0, 1, 2, 3, 4].map((colIndex) => (
                <div
                  key={colIndex}
                  className="flex-1 flex flex-col gap-6"
                  style={{
                    marginTop: [0, 40, 20, 60, 30][colIndex] + 'px'
                  }}
                >
                  {photos
                    .filter((_, index) => index % 5 === colIndex)
                    .map((photo) => {
                      const originalIndex = photos.findIndex(p => p.id === photo.id);
                      return (
                <div
                  key={photo.id}
                  className="group relative cursor-pointer overflow-visible animate-fade-in-up"
                  onClick={() => openLightbox(photo, originalIndex)}
                  style={{
                    animationDelay: `${originalIndex * 0.08}s`
                  }}
                >
                  {/* Floating Hearts on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none z-20">
                    <Heart className="text-pink-500 animate-bounce" size={20} fill="currentColor" />
                  </div>

                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white p-2 border-2 border-pink-200/50 group-hover:border-pink-400/80">
                    <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-br from-pink-100 to-purple-100">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Sparkle Effect on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold mb-0.5 md:mb-1 line-clamp-2 animate-slide-in-up">
                            {photo.title}
                          </h3>
                          {photo.date && (
                            <p className="text-xs md:text-sm opacity-90 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
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

                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-110 z-30">
                      <div className="relative">
                        <Heart className="text-pink-500 drop-shadow-2xl animate-heartbeat" size={24} fill="currentColor" />
                        <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in overflow-hidden"
          onClick={closeLightbox}
        >
          {/* Floating Flowers in Lightbox */}
          <FloatingFlower x={10} y={10} size={60} type={1} delay={0} />
          <FloatingFlower x={85} y={15} size={70} type={2} delay={1.5} />
          <FloatingFlower x={15} y={85} size={65} type={3} delay={2.5} />
          <FloatingFlower x={90} y={80} size={55} type={1} delay={3} />

          <button
            onClick={closeLightbox}
            className="fixed top-3 right-3 sm:top-6 sm:right-6 p-2 sm:p-3 bg-pink-500/20 hover:bg-pink-500/40 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-pink-300/30 z-60 animate-fade-in"
          >
            <X className="text-white" size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-pink-500/20 hover:bg-pink-500/40 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-pink-300/30 z-60 animate-slide-in-left"
          >
            <ChevronLeft className="text-white" size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-pink-500/20 hover:bg-pink-500/40 backdrop-blur-md rounded-full transition-all hover:scale-110 border border-pink-300/30 z-60 animate-slide-in-right"
          >
            <ChevronRight className="text-white" size={28} />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center animate-scale-in">
              <img
                src={selectedPhoto.image_url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border-4 border-pink-500/30"
              />

              {/* Decorative corners */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-pink-400 rounded-tl-lg animate-pulse" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-4 border-r-4 border-pink-400 rounded-tr-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-4 border-l-4 border-pink-400 rounded-bl-lg animate-pulse" style={{ animationDelay: '0.4s' }} />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-pink-400 rounded-br-lg animate-pulse" style={{ animationDelay: '0.6s' }} />

              {/* Text Overlay at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-4 px-4 text-center text-white animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="inline-flex items-center gap-2 mb-1">
                  <Heart className="text-pink-400 animate-heartbeat" size={16} fill="currentColor" />
                  <h2 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1">{selectedPhoto.title}</h2>
                  <Heart className="text-pink-400 animate-heartbeat" size={16} fill="currentColor" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="flex items-center justify-center gap-2 text-xs opacity-75">
                  {selectedPhoto.date && (
                    <>
                      <span>
                        {new Date(selectedPhoto.date).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span className="opacity-60 font-semibold">
                    {currentIndex + 1} / {photos.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMapView && <MapView onClose={() => setShowMapView(false)} />}
    </div>
  );
};

export default PhotoGallery;
