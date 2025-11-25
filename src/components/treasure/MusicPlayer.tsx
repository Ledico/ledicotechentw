import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log('Audio playback failed:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-white rounded-full shadow-2xl p-4 flex items-center gap-3 border-2 border-pink-200">
        <button
          onClick={togglePlay}
          className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full hover:shadow-lg transition-all group"
        >
          {isPlaying ? (
            <Pause className="text-white" size={20} fill="currentColor" />
          ) : (
            <Play className="text-white group-hover:scale-110 transition-transform" size={20} fill="currentColor" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMuted ? (
              <VolumeX className="text-gray-600" size={20} />
            ) : (
              <Volume2 className="text-gray-600" size={20} />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 accent-pink-500"
          />
        </div>

        <Music className="text-pink-500 animate-pulse" size={20} />
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full">
          Hintergrundmusik
        </p>
      </div>
    </div>
  );
};

export default MusicPlayer;
