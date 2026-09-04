import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  ShieldCheck, 
  RotateCw, 
  Gem, 
  Clock, 
  Scale, 
  Store,
  ChevronRight
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface IntroBannerSlidesProps {
  onComplete: () => void;
}

interface SlideItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ElementType;
  accent: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 'trial-concierge',
    badge: 'Hyperlocal Trial @Home',
    title: 'Choose it. Try it. Decide at Home.',
    subtitle: 'Selected local bridal & occasion pieces delivered for your trial slot',
    description: 'Choose up to 3–4 eligible pieces, pick a convenient slot and pay a nominal booking fee. If you buy, the fee can be adjusted against your order; if not, it covers local logistics.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90',
    icon: Clock,
    accent: 'from-amber-500/30 to-yellow-600/10'
  },
  {
    id: 'scrap-exchange',
    badge: 'Exchange & Save',
    title: 'Turn Old Imitation Jewellery into Savings',
    subtitle: 'Verify eligible jewellery images, receive an estimate and apply exchange value',
    description: 'Upload a clear image of eligible imitation jewellery. After successful image verification and valuation, you can review the estimated exchange value. Final value follows the applicable verification process.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=90',
    icon: Scale,
    accent: 'from-emerald-500/30 to-teal-600/10'
  },
  {
    id: 'hallmark-guarantee',
    badge: 'Premium Imitation Jewellery',
    title: 'Made to Look Beautiful. Designed for Real Life.',
    subtitle: 'From daily wear to statement bridal collections',
    description: 'Discover brass, alloy, oxidised and premium fashion jewellery across Kundan, Polki, AD and micro-plated styles — with clear product details and care guidance.',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=1200&q=90',
    icon: ShieldCheck,
    accent: 'from-amber-500/30 to-yellow-600/10'
  },
  {
    id: 'artisan-bargain',
    badge: 'Direct Guild Heritage',
    title: 'Boutique Network & Jeweller Bargain',
    subtitle: 'Discover collections from multiple jewellery craft centres',
    description: 'Use the Bargain with Jeweller experience to submit an offer on eligible products. Browse collection details and negotiate only when the product and jeweller workflow support it.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=90',
    icon: Store,
    accent: 'from-purple-500/30 to-amber-600/10'
  }
];

export const IntroBannerSlides: React.FC<IntroBannerSlidesProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleNext = () => {
    triggerHaptic('light');
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="fixed inset-0 z-[95] rg-page flex flex-col justify-between p-5 select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Background Opulent Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
      </div>

      {/* Top Controls: Brand & Skip */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Crown className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-stone-100 text-sm tracking-wider">
            RoldyGoldy
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs text-stone-400 hover:text-amber-300 px-3 py-1.5 rounded-full bg-stone-900 border border-stone-800 transition-colors flex items-center gap-1"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Slide Card */}
      <div className="my-auto z-10 w-full max-w-md mx-auto space-y-5">
        {/* Slide Visual Presentation */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/40 bg-stone-900 shadow-2xl aspect-[4/3] group">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          {/* Slide Top Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 rg-glass px-3 py-1 rounded-full border border-amber-500/40 text-[11px] text-amber-300 font-bold shadow-lg">
              <IconComponent className="w-3.5 h-3.5 text-amber-400" />
              <span>{slide.badge}</span>
            </span>
          </div>

          {/* Overlay Tagline inside image */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h2 className="font-serif font-bold text-white text-lg sm:text-xl drop-shadow-md leading-tight">
              {slide.title}
            </h2>
            <p className="text-amber-300 font-semibold text-xs mt-0.5">
              {slide.subtitle}
            </p>
          </div>
        </div>

        {/* Slide Detailed Copy */}
        <div className="rg-surface rounded-2xl p-4 space-y-2 text-center backdrop-blur-md">
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {slide.description}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Product Details</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>Artisan Direct</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Dots & Next/Get Started */}
      <div className="w-full max-w-md mx-auto z-10 space-y-4 pb-2">
        {/* Dot Pagination */}
        <div className="flex items-center justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('light');
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? 'w-8 bg-amber-400' 
                  : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Get Started Action Button */}
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-bold text-sm py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>{currentSlide === SLIDES.length - 1 ? 'Continue' : 'Explore next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
