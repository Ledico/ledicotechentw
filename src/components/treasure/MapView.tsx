import React, { useState, useEffect } from 'react';
import { X, MapPin, Heart, Navigation, Image as ImageIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 16px;
          transform: rotate(45deg);
        ">❤</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

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
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null)
        .order('date', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMapCenter = (): [number, number] => {
    return [50.0, 10.0];
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
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 z-50 overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 p-3 bg-white/90 backdrop-blur-md hover:bg-pink-100 rounded-full transition-all hover:scale-110 shadow-lg z-[1000]"
      >
        <X className="text-gray-700" size={24} />
      </button>

      <div className="h-full flex flex-col">
        <div className="text-center pt-6 pb-4 px-4 bg-white/80 backdrop-blur-md shadow-lg animate-fade-in-down">
          <div className="inline-flex items-center gap-3 mb-3">
            <MapPin className="text-pink-500 animate-bounce" size={32} />
            <Heart className="text-rose-400 animate-pulse" size={28} fill="currentColor" />
            <Navigation className="text-pink-500 animate-bounce" size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent mb-2">
            Üseri Reis zäme
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            All Ort wo mir zäme gsi sind - uf de Weltkarte! 🗺️
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="text-gray-400 mx-auto mb-4" size={64} />
              <p className="text-xl text-gray-500">
                Kei Standort-Informatione verfüegbar
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 relative">
            <MapContainer
              center={getMapCenter()}
              zoom={4}
              className="h-full w-full"
              style={{ zIndex: 1 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {photos.map((photo, index) => {
                if (!photo.location_lat || !photo.location_lng) return null;

                const colors = ['#ec4899', '#f472b6', '#db2777', '#be185d'];
                const color = colors[index % colors.length];

                return (
                  <Marker
                    key={photo.id}
                    position={[photo.location_lat, photo.location_lng]}
                    icon={createCustomIcon(color)}
                    eventHandlers={{
                      click: () => setSelectedPhoto(photo),
                    }}
                  >
                    <Popup maxWidth={300}>
                      <div className="text-center">
                        <img
                          src={photo.image_url}
                          alt={photo.title}
                          className="w-full h-40 object-cover rounded-lg mb-2 cursor-pointer"
                          onClick={() => setSelectedPhoto(photo)}
                        />
                        <h3 className="font-bold text-lg text-gray-800 mb-1">
                          {photo.title}
                        </h3>
                        <p className="text-sm font-semibold text-pink-600 mb-1">
                          {photo.location_name}
                        </p>
                        {photo.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {photo.description}
                          </p>
                        )}
                        <button
                          onClick={() => setSelectedPhoto(photo)}
                          className="mt-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs hover:shadow-lg transition-all"
                        >
                          <ImageIcon size={12} className="inline mr-1" />
                          Föteli aluege
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}
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
