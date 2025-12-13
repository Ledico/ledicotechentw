import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gift, Check } from 'lucide-react';
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

  const handleRedeem = async (voucherId: string) => {
    try {
      await supabase
        .from('treasure_gifts')
        .update({ is_redeemed: true })
        .eq('id', voucherId);

      setVouchers((prev) =>
        prev.map((v) => (v.id === voucherId ? { ...v, is_redeemed: true } : v))
      );
    } catch (error) {
      console.error('Error redeeming voucher:', error);
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Geschenk-Gutscheine
          </h1>
          <p className="text-xl text-gray-600">
            Besondere Überraschungen nur für dich! 🎁
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Klicke auf die Karten um sie aufzudecken
          </p>
        </div>

        {vouchers.length === 0 ? (
          <div className="text-center py-20">
            <Gift className="text-gray-400 mx-auto mb-4" size={64} />
            <p className="text-xl text-gray-500">
              Noch keine Gutscheine hinzugefügt. Füge Gutscheine über die Datenbank hinzu!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                isScratched={scratchedVouchers.has(voucher.id)}
                onScratch={handleScratch}
                onRedeem={handleRedeem}
              />
            ))}
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
  onRedeem: (id: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  isScratched,
  onScratch,
  onRedeem,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scratchPercentage, setScratchPercentage] = useState(0);

  useEffect(() => {
    if (!isScratched && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FCD34D';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#F59E0B';
        for (let i = 0; i < 50; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 3 + 1,
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
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    const percentage = (transparent / (pixels.length / 4)) * 100;
    setScratchPercentage(percentage);

    if (percentage > 60) {
      onScratch(voucher.id);
    }
  };

  return (
    <div className="group perspective-1000">
      <div
        className={`relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${
          isScratched ? 'transform rotate-y-5' : ''
        }`}
      >
        <div className="relative aspect-[3/4] p-6 flex flex-col">
          {!isScratched && (
            <canvas
              ref={canvasRef}
              width={300}
              height={400}
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

          <div className={`flex-1 flex flex-col justify-between ${!isScratched ? 'blur-sm' : ''}`}>
            <div>
              {voucher.image_url ? (
                <div className="mb-4 rounded-xl overflow-hidden shadow-md">
                  <img
                    src={voucher.image_url}
                    alt={voucher.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                    <Gift className="text-white" size={40} />
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                {voucher.title}
              </h3>

              <p className="text-gray-700 text-center leading-relaxed">
                {voucher.description}
              </p>
            </div>

            <div className="mt-6">
              {voucher.is_redeemed ? (
                <div className="flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 font-semibold rounded-full">
                  <Check size={20} />
                  <span>Eingelöst</span>
                </div>
              ) : isScratched ? (
                <button
                  onClick={() => onRedeem(voucher.id)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
                >
                  Als eingelöst markieren
                </button>
              ) : (
                <div className="text-center text-sm text-gray-500">
                  Rubbel mich frei!
                </div>
              )}
            </div>
          </div>

          {!isScratched && scratchPercentage > 0 && scratchPercentage < 60 && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-white/90 rounded-full text-sm font-semibold text-orange-600">
              {Math.round(scratchPercentage)}%
            </div>
          )}
        </div>

        {voucher.is_redeemed && (
          <div className="absolute top-4 left-4">
            <div className="px-4 py-2 bg-green-500 text-white font-bold rounded-full transform -rotate-12 shadow-lg">
              EINGELÖST
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftVouchers;
