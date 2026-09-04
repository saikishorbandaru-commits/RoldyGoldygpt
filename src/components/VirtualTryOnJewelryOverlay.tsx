import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { apiUrl } from '../utils/api';
import { Sparkles } from 'lucide-react';

interface VirtualTryOnJewelryOverlayProps {
  product: Product;
  activeImage?: string;
  itemType: 'choker' | 'earrings' | 'tikka' | 'necklace' | 'bangles';
  scale: number;
  rotation: number;
  opacity: number;
  skinWarmth?: { r: number; g: number; b: number; warmthFactor: number };
  goldFinish?: '22k_yellow' | 'antique_matte' | 'rose_gold';
  sparkleActive?: boolean;
  tryOnMode?: 'wearable_ar' | 'transparent_cutout';
  earringMode?: 'both' | 'left' | 'right';
  earringSpread?: number;
}

export const VirtualTryOnJewelryOverlay: React.FC<VirtualTryOnJewelryOverlayProps> = ({
  product,
  activeImage,
  itemType,
  opacity,
  goldFinish = '22k_yellow',
  sparkleActive = true,
  tryOnMode = 'wearable_ar',
  earringMode = 'both',
  earringSpread = 0,
}) => {
  // Always prioritize genuine transparent PNG cutout
  const pngUrl = product.tryOnTransparentImage || `/assets/tryon/${product.id}.png`;
  const [currentSrc, setCurrentSrc] = useState<string>(pngUrl);

  // Dynamic finish colors and photometric filters applied to real jewellery photo
  const getFinishFilters = () => {
    switch (goldFinish) {
      case 'antique_matte':
        return {
          filter: 'sepia(0.25) contrast(1.15) brightness(0.96) saturate(1.12)',
          glowColor: 'rgba(197, 154, 63, 0.45)',
          badgeLabel: 'Antique 22K Matte Finish',
        };
      case 'rose_gold':
        return {
          filter: 'hue-rotate(-16deg) saturate(1.2) contrast(1.12) brightness(1.02)',
          glowColor: 'rgba(224, 160, 128, 0.45)',
          badgeLabel: 'Rose Gold Polish',
        };
      case '22k_yellow':
      default:
        return {
          filter: 'saturate(1.22) contrast(1.14) brightness(1.03)',
          glowColor: 'rgba(255, 215, 0, 0.45)',
          badgeLabel: '22K Micro-Plated Gold',
        };
    }
  };

  const finishConfig = getFinishFilters();

  useEffect(() => {
    if (product.tryOnTransparentImage) {
      setCurrentSrc(product.tryOnTransparentImage);
    } else {
      setCurrentSrc(apiUrl(`/api/tryon/cutout?id=${product.id}&url=${encodeURIComponent(product.image)}`));
    }
  }, [product.id, product.tryOnTransparentImage, product.image]);

  const handleImageError = () => {
    // If local PNG fails, fallback to API cutout route
    if (!currentSrc.includes('/api/tryon/cutout')) {
      setCurrentSrc(apiUrl(`/api/tryon/cutout?id=${product.id}&url=${encodeURIComponent(product.image)}`));
    }
  };

  // =========================================================================
  // 1. EARRINGS CATEGORY: Dual / Single Ear with User-Interactive Spacing
  // =========================================================================
  if (itemType === 'earrings') {
    const baseWidth = 340 + earringSpread * 2;
    return (
      <div 
        style={{ 
          opacity,
          width: `${baseWidth}px`,
          filter: `${finishConfig.filter} drop-shadow(0 14px 24px rgba(0,0,0,0.85))` 
        }}
        className="relative flex items-start justify-between px-2 pointer-events-none select-none transition-all duration-100"
      >
        {/* Left Earring */}
        {(earringMode === 'both' || earringMode === 'left') ? (
          <div className="relative flex flex-col items-center group">
            <img
              src={currentSrc}
              alt={`${product.name} Left Earring`}
              onError={handleImageError}
              className="w-24 sm:w-28 h-36 sm:h-44 object-contain transition-transform"
              style={{
                filter: `drop-shadow(0 6px 14px ${finishConfig.glowColor})`,
              }}
            />
            {sparkleActive && (
              <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
            )}
          </div>
        ) : (
          <div className="w-24 sm:w-28 h-36 sm:h-44" />
        )}

        {/* Center Minimal Alignment Reticle */}
        <div className="flex-1 text-center pt-2">
          <span className="inline-flex items-center gap-1 bg-stone-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/40 text-[9.5px] text-amber-300 font-semibold shadow-xl">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>{earringMode === 'both' ? 'Dual Ears' : earringMode === 'left' ? 'Left Ear' : 'Right Ear'}</span>
          </span>
        </div>

        {/* Right Earring (Symmetrically Mirrored for natural ear fit) */}
        {(earringMode === 'both' || earringMode === 'right') ? (
          <div className="relative flex flex-col items-center group -scale-x-100">
            <img
              src={currentSrc}
              alt={`${product.name} Right Earring`}
              onError={handleImageError}
              className="w-24 sm:w-28 h-36 sm:h-44 object-contain transition-transform"
              style={{
                filter: `drop-shadow(0 6px 14px ${finishConfig.glowColor})`,
              }}
            />
            {sparkleActive && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
            )}
          </div>
        ) : (
          <div className="w-24 sm:w-28 h-36 sm:h-44" />
        )}
      </div>
    );
  }

  // =========================================================================
  // 2. MAANG TIKKA CATEGORY: Centered Forehead Placement
  // =========================================================================
  if (itemType === 'tikka') {
    return (
      <div 
        style={{ 
          opacity,
          filter: `${finishConfig.filter} drop-shadow(0 16px 28px rgba(0,0,0,0.85))` 
        }}
        className="relative flex flex-col items-center pointer-events-none select-none"
      >
        <img
          src={currentSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-32 sm:w-40 h-44 sm:h-52 object-contain"
          style={{
            filter: `drop-shadow(0 8px 18px ${finishConfig.glowColor})`,
          }}
        />
        {sparkleActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. BANGLES & KADAS CATEGORY: Sized for Wrist
  // =========================================================================
  if (itemType === 'bangles') {
    return (
      <div 
        style={{ 
          opacity,
          filter: `${finishConfig.filter} drop-shadow(0 16px 28px rgba(0,0,0,0.85))` 
        }}
        className="relative flex flex-col items-center pointer-events-none select-none"
      >
        <img
          src={currentSrc}
          alt={product.name}
          onError={handleImageError}
          className="w-48 sm:w-60 h-44 sm:h-52 object-contain"
          style={{
            filter: `drop-shadow(0 8px 18px ${finishConfig.glowColor})`,
          }}
        />
        {sparkleActive && (
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-200 rounded-full blur-[0.5px] animate-ping" />
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. NECKLACES & CHOKERS (Default): Clean Isolated Transparent PNG Draping
  // =========================================================================
  return (
    <div 
      style={{ 
        opacity,
        filter: `${finishConfig.filter} drop-shadow(0 18px 32px rgba(0,0,0,0.88))` 
      }}
      className="relative flex flex-col items-center pointer-events-none select-none"
    >
      <img
        src={currentSrc}
        alt={product.name}
        onError={handleImageError}
        className="max-w-[300px] max-h-[300px] sm:max-w-[380px] sm:max-h-[360px] object-contain transition-all"
        style={{
          filter: `drop-shadow(0 10px 22px ${finishConfig.glowColor})`,
        }}
      />
      {sparkleActive && (
        <>
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-emerald-200 rounded-full blur-[0.5px] animate-ping" />
        </>
      )}
    </div>
  );
};
