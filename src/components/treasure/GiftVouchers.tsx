import React, { useState, useEffect, useRef } from 'react';
import { Gift } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GiftVoucher {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_redeemed: boolean;
  order_index: number;
}

interface GiftVouchersProps {
  onBack: () => void;
}

const GiftVouchers: React.FC<GiftVouchersProps> = ({ onBack }) => {
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [scratchedVouchers, setScratchedVouchers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from('treasure_gifts')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScratch = (voucherId: string) => {
    setScratchedVouchers((prev) => new Set(prev).add(voucherId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gift className="text-yellow-500 animate-pulse mx-auto mb-4" size={48} />
          <p className="text-xl text-gray-600">Lade Geschenke...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl">
              <Gift className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-rose-500 bg-clip-text text-transparent mb-6">
            Dein Geschenk-Gutschein
          </h1>
          <p className="text-2xl text-gray-700 font-medium mb-3">
            Eine besondere Überraschung wartet auf dich
          </p>
          <p className="text-base text-gray-600 max-w-md mx-auto">
            Rubbel die goldene Schicht weg, um deinen Gutschein freizuschalten
          </p>
        </div>

        {vouchers.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <Gift className="text-gray-400 mx-auto" size={64} />
            </div>
            <p className="text-xl text-gray-500">
              Noch keine Gutscheine hinzugefügt
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              {vouchers.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  isScratched={scratchedVouchers.has(voucher.id)}
                  onScratch={handleScratch}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface VoucherCardProps {
  voucher: GiftVoucher;
  isScratched: boolean;
  onScratch: (id: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  isScratched,
  onScratch,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    if (!isScratched && canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FCD34D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#F59E0B';
        for (let i = 0; i < 100; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 4 + 2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }, [isScratched]);

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isScratched || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 50) {
      onScratch(voucher.id);
    }
  };

  return (
    <div className="perspective-1000">
      <div
        ref={containerRef}
        className={`relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden ${
          isScratched ? 'shadow-3xl scale-[1.02]' : ''
        }`}
      >
        <div className="relative p-8">
          {!isScratched && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-pointer z-10"
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseMove={(e) => isDrawing && scratch(e)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={() => setIsDrawing(true)}
              onTouchEnd={() => setIsDrawing(false)}
              onTouchMove={(e) => isDrawing && scratch(e)}
            />
          )}

          <div className={`${!isScratched ? 'blur-sm select-none' : ''}`}>
            {voucher.image_url ? (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={voucher.image_url}
                  alt={voucher.title}
                  className="w-full h-96 object-contain bg-white"
                />
              </div>
            ) : (
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg">
                  <Gift className="text-white" size={64} />
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-gray-800">
                {voucher.title}
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed max-w-lg mx-auto">
                {voucher.description}
              </p>
            </div>

            {!isScratched && (
              <div className="mt-8 text-center">
                <p className="text-lg text-gray-700 leading-relaxed max-w-lg mx-auto">
                  75 Franke gutschii für din starbucks sucht!
                </p>
              </div>
            )}
          </div>

          {!isScratched && scratchPercentage > 0 && scratchPercentage < 50 && (
            <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-white/95 rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                    style={{ width: `${scratchPercentage * 2}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {Math.round(scratchPercentage)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftVouchers;
