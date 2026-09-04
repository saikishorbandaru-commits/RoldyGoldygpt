import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  PlusCircle, 
  Store, 
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { AdBanner } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface AdBannerSliderProps {
  banners: AdBanner[];
  onSelectArtisan: (businessName: string) => void;
  onOpenArtisanGuild: () => void;
  onOpenSellerPortal: () => void;
}

export const AdBannerSlider: React.FC<AdBannerSliderProps> = ({
  banners,
  onSelectArtisan,
  onOpenArtisanGuild,
  onOpenSellerPortal,
}) => {
  const activeBanners = banners.filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 5 seconds when not paused
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    triggerHaptic('light');
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    triggerHaptic('light');
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <div 
      className="space-y-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Top Banner Control Bar with Seller Post Action */}
      <div className="flex items-center justify-between px-1 text-xs">
        <div className="flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-stone-300 text-[11px] uppercase tracking-wider">
            Verified Artisan Showcase
          </span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
            {currentIndex + 1}/{activeBanners.length}
          </span>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSellerPortal();
          }}
          className="text-amber-400 hover:text-amber-300 font-medium text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900 border border-amber-500/40 hover:bg-stone-800 transition-colors shadow-sm"
          title="Sellers can book and upload banner ads"
        >
          <PlusCircle className="w-3 h-3 text-amber-400" />
          <span>Upload Seller Ad</span>
        </button>
      </div>

      {/* Main Slider Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/50 rounded-2xl p-4 shadow-xl group transition-all">
        
        {/* Slide Content */}
        <div 
          className="flex items-center justify-between gap-4 cursor-pointer"
          onClick={() => {
            triggerHaptic('light');
            onSelectArtisan(currentBanner.businessName);
          }}
        >
          <div className="space-y-1.5 flex-1 z-10 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9.5px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                {currentBanner.tag || 'Verified Artisan'}
              </span>
              <span className="text-[11px] text-stone-400 truncate">
                {currentBanner.businessName} ({currentBanner.city} · {currentBanner.pincode})
              </span>
            </div>

            <h3 className="font-serif font-bold text-stone-100 text-sm sm:text-base leading-snug line-clamp-1">
              {currentBanner.title}
            </h3>

            <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
              {currentBanner.subtitle}
            </p>

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <span className="text-amber-400 text-xs font-bold flex items-center gap-1 group-hover:underline">
                <span>{currentBanner.ctaText || 'Explore Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic('light');
                  onOpenArtisanGuild();
                }}
                className="text-[10.5px] text-stone-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <Store className="w-3 h-3 text-amber-400 inline" />
                <span>Artisan Guild Info</span>
              </button>
            </div>
          </div>

          {/* Banner Thumbnail */}
          <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-stone-800 shadow-md relative bg-stone-950">
            <img 
              src={currentBanner.imageUrl} 
              alt={currentBanner.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-950/80 border border-stone-700 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
              title="Previous Seller Ad"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-950/80 border border-stone-700 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
              title="Next Seller Ad"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Pagination */}
        {activeBanners.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('light');
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-5 bg-amber-400'
                    : 'w-1.5 bg-stone-700 hover:bg-stone-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
