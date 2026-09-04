import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Camera, 
  MessageSquare, 
  Crown, 
  MapPin, 
  User, 
  Search, 
  Filter, 
  ShieldCheck, 
  Heart, 
  ChevronRight,
  Gift,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  X,
  Navigation
} from 'lucide-react';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, ExchangeScrapData, TrialBooking, Order, UserProfile, AdBanner, SellerAdBooking } from './types';
import { BargainModal } from './components/BargainModal';
import { LivePhotoUploadModal } from './components/LivePhotoUploadModal';
import { AuthModal } from './components/AuthModal';
import { TrialConciergeModal } from './components/TrialConciergeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProfileReportsModal } from './components/ProfileReportsModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailView } from './components/ProductDetailView';
import { BoutiqueView } from './components/BoutiqueView';
import { AccountView } from './components/AccountView';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { SellerAdBookingModal } from './components/SellerAdBookingModal';
import { JewelleryMartTourModal } from './components/JewelleryMartTourModal';
import { detectCurrentLocation, DetectedLocationResult } from './utils/location';
import { triggerHaptic } from './utils/haptics';
import { SplashScreen } from './components/SplashScreen';
import { ArtisanShowcaseModal } from './components/ArtisanShowcaseModal';
import { BargainPickerModal } from './components/BargainPickerModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdBannerSlider } from './components/AdBannerSlider';
import { IntroBannerSlides } from './components/IntroBannerSlides';
import { LoginScreen } from './components/LoginScreen';

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArtisanFilter, setSelectedArtisanFilter] = useState<string | null>(null);
  const [trialOnlyFilter, setTrialOnlyFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'boutique' | 'cart' | 'account'>('home');
  const [isBargainModalOpen, setIsBargainModalOpen] = useState<boolean>(false);
  const [isBargainPickerOpen, setIsBargainPickerOpen] = useState<boolean>(false);
  const [bargainTargetProduct, setBargainTargetProduct] = useState<Product | null>(null);
  const [isLivePhotoModalOpen, setIsLivePhotoModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);
  const [trialTargetProduct, setTrialTargetProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState<boolean>(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [isProfileReportsOpen, setIsProfileReportsOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isSellerAdModalOpen, setIsSellerAdModalOpen] = useState<boolean>(false);
  const [isMartTourModalOpen, setIsMartTourModalOpen] = useState<boolean>(false);
  const [martTourTargetProduct, setMartTourTargetProduct] = useState<Product | null>(null);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showIntroSlides, setShowIntroSlides] = useState<boolean>(false);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('roldygoldy_auth_user');
  });
  const [isArtisanShowcaseOpen, setIsArtisanShowcaseOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('roldygoldy_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  // Active Sponsored Ad Banners
  const [adBanners, setAdBanners] = useState<AdBanner[]>([
    {
      id: 'ad-eluru-1',
      sellerName: 'Srinivas Rao',
      businessName: 'Sri Lakshmi Rold Gold Jewellers',
      city: 'Eluru',
      pincode: '534001',
      title: 'Machilipatnam 1-Gram Pure Polish Mega Mela',
      subtitle: 'Direct from verified artisans of Eluru & Machilipatnam. Up to 40% Off + Free Home Trial',
      tag: 'Verified Artisan Banner',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      ctaText: 'Explore Artisanal Collection',
      targetCategory: 'Bridal',
      slotType: 'home_top',
      active: true,
      clicksCount: 142,
      impressionsCount: 890,
    }
  ]);
  const [sellerAdBookings, setSellerAdBookings] = useState<SellerAdBooking[]>([]);

  // Cart & Exchange State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [exchangeVoucher, setExchangeVoucher] = useState<ExchangeScrapData | null>(null);
  
  // Dynamic Geolocation State
  const [currentLocation, setCurrentLocation] = useState<DetectedLocationResult>({
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    state: 'Telangana',
    pincode: '500101',
    formattedAddress: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad - 500101',
    hubName: 'Banjara & Jubilee Hills Flagship Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '20 mins (Instant Trial & Express)',
    source: 'saved'
  });
  const [userPincode, setUserPincode] = useState<string>('500101');

  // User Data & Records
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('roldygoldy_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      name: 'Sai Kishor',
      phone: '+91 98480 22338',
      email: 'b.saikishor365@gmail.com',
      address: 'Boutique Residence, Main Bazaar, Eluru',
      pincode: '534001',
    };
  });

  // Privacy-first location restore: never request GPS automatically at app startup.
  // Users can explicitly choose location detection from the location workflow.
  useEffect(() => {
    const saved = localStorage.getItem('roldygoldy_detected_location');
    if (!saved) return;
    try {
      const parsed: DetectedLocationResult = JSON.parse(saved);
      setCurrentLocation(parsed);
      setUserPincode(parsed.pincode);
      setUserProfile(prev => ({
        ...prev,
        address: parsed.formattedAddress,
        pincode: parsed.pincode
      }));
    } catch (e) {
      console.warn('Failed to restore saved location', e);
    }
  }, []);

  const handleLocationSelected = (loc: DetectedLocationResult) => {
    setCurrentLocation(loc);
    setUserPincode(loc.pincode);
    setUserProfile(prev => ({
      ...prev,
      address: loc.formattedAddress,
      pincode: loc.pincode
    }));
    showToast(`📍 Location updated: ${loc.city} (${loc.pincode})`);
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'RGORD84920',
      date: '28 May 2026',
      time: '02:45 PM',
      invoiceNumber: 'INV-RG-2026-84920',
      items: [{
        id: INITIAL_PRODUCTS[0].id,
        name: INITIAL_PRODUCTS[0].name,
        price: 3499,
        originalPrice: 4899,
        quantity: 1,
        image: INITIAL_PRODUCTS[0].image,
        category: INITIAL_PRODUCTS[0].category,
        metal: INITIAL_PRODUCTS[0].metal,
        grossWeight: INITIAL_PRODUCTS[0].grossWeight,
        netWeight: INITIAL_PRODUCTS[0].netWeight,
        stone: INITIAL_PRODUCTS[0].stone,
        sku: 'RG-BRI-P101',
        partnerSeller: INITIAL_PRODUCTS[0].partnerSeller,
      }],
      subtotal: 3499,
      exchangeDiscount: 350,
      exchangeVoucherDetails: {
        code: 'EXCH-GOLD-5921',
        grams: 100,
        metalType: '1-Gram Imitation Rold Gold Scrap',
        ratePerGram: 0.35,
      },
      trialAtHomeValue: 0,
      deliveryFee: 0,
      taxGst: 105,
      total: 3254,
      paymentMethod: 'UPI (Instant Netbanking)',
      paymentTransactionId: 'TXN-UPI-98247192847-HDFC',
      paymentStatus: 'Paid via UPI',
      status: 'Out for Delivery',
      deliveryOtp: '4812',
      address: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad - 500101',
      pincode: '500101',
      customerName: 'Meera Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'meera.sharma@example.com',
      trackingHub: 'Hyderabad West Central Atelier Hub (Banjara Hills)',
      courierPartner: 'Roldy Goldy Doorstep Concierge Express (Scale Equipped)',
      estimatedDelivery: 'Today within 2-4 Hours',
      insurancePolicyNumber: 'ICICI-LOMBARD-JWL-84920-TRANSIT',
      returnWindowExpiry: '04 Jun 2026',
    },
    {
      id: 'RGORD79144',
      date: '14 May 2026',
      time: '11:20 AM',
      invoiceNumber: 'INV-RG-2026-79144',
      items: [{
        id: INITIAL_PRODUCTS[1].id,
        name: INITIAL_PRODUCTS[1].name,
        price: 1299,
        originalPrice: 1899,
        quantity: 1,
        image: INITIAL_PRODUCTS[1].image,
        category: INITIAL_PRODUCTS[1].category,
        metal: INITIAL_PRODUCTS[1].metal,
        grossWeight: INITIAL_PRODUCTS[1].grossWeight,
        netWeight: INITIAL_PRODUCTS[1].netWeight,
        stone: INITIAL_PRODUCTS[1].stone,
        sku: 'RG-TMP-P102',
        partnerSeller: INITIAL_PRODUCTS[1].partnerSeller,
      }],
      subtotal: 1299,
      exchangeDiscount: 158,
      exchangeVoucherDetails: {
        code: 'EXCH-GOLD-4421',
        grams: 50,
        metalType: '1-Gram Imitation Rold Gold Scrap',
        ratePerGram: 0.35,
      },
      trialAtHomeValue: 0,
      deliveryFee: 0,
      taxGst: 39,
      total: 1180,
      paymentMethod: 'UPI (Google Pay)',
      paymentTransactionId: 'TXN-UPI-7718291048-SBI',
      paymentStatus: 'Paid via UPI',
      status: 'Delivered',
      deliveryOtp: '6109',
      address: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad - 500101',
      pincode: '500101',
      customerName: 'Meera Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'meera.sharma@example.com',
      trackingHub: 'Hyderabad West Central Atelier Hub (Banjara Hills)',
      courierPartner: 'Roldy Goldy Doorstep Concierge Express',
      estimatedDelivery: 'Delivered on 14 May 2026',
      insurancePolicyNumber: 'ICICI-LOMBARD-JWL-79144-TRANSIT',
      returnWindowExpiry: '21 May 2026',
    }
  ]);

  const [trialBookings, setTrialBookings] = useState<TrialBooking[]>([
    {
      id: 'RGTR59102',
      date: '27 May, Tue',
      timeSlot: 'Evening (04:00 PM - 07:00 PM)',
      items: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]],
      fee: 49,
      overageMins: 0,
      status: 'Scheduled',
      deliveryOtp: '4812',
      returnOtp: '9341',
      pincode: '500101',
    }
  ]);

  const [exchangeSlips, setExchangeSlips] = useState<ExchangeScrapData[]>([]);
  const [bargainHistory, setBargainHistory] = useState<{ item: string; offer: number; counter: number; date: string }[]>([]);

  // Persist wishlist independently from the screen lifecycle.
  useEffect(() => {
    localStorage.setItem('roldygoldy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleOpenBargain = (product: Product) => {
    triggerHaptic('light');
    setBargainTargetProduct(product);
    setIsBargainModalOpen(true);
  };

  const handleDealLocked = (productOrId: Product | string, agreedPrice: number) => {
    const productId = typeof productOrId === 'string' ? productOrId : productOrId.id;
    const baseProd = typeof productOrId === 'object' && productOrId?.id
      ? productOrId
      : products.find((p) => p.id === productId) || null;

    const updatedProduct = baseProd
      ? { ...baseProd, bargainedPrice: agreedPrice }
      : null;

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, bargainedPrice: agreedPrice } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, bargainedPrice: agreedPrice } : null));
    }
    
    if (baseProd && updatedProduct) {
      setBargainHistory((prev) => [
        {
          item: baseProd.name,
          offer: agreedPrice,
          counter: agreedPrice,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        },
        ...prev,
      ]);

      // Automatically add bargained product to cart with custom price & open cart drawer!
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === productId);
        if (existing) {
          return prev.map((item) =>
            item.product.id === productId
              ? { ...item, product: updatedProduct, customPrice: agreedPrice, isBargained: true }
              : item
          );
        }
        return [...prev, { product: updatedProduct, quantity: 1, customPrice: agreedPrice, isBargained: true }];
      });

      setIsCartOpen(true);
    }
    showToast(`🎉 Deal locked at ₹${agreedPrice.toLocaleString('en-IN')}! Added to your Cart.`);
  };

  const handleScrapValued = (data: ExchangeScrapData) => {
    setExchangeSlips((prev) => [data, ...prev]);
    if (!data.isRejected && data.status !== 'Rejected' && data.netCredit > 0) {
      setExchangeVoucher(data);
      showToast(`✨ Scrap valued at ₹${data.netCredit}! Voucher ${data.voucherCode} applied.`);
    } else {
      showToast(`⚠️ Scrap validation failed: ${data.rejectionReason || 'Non-jewellery item detected.'}`);
    }
  };

  const handleAddToCart = (product: Product, openDrawer: boolean = false) => {
    triggerHaptic('success');
    let totalItems = 0;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      totalItems = updated.reduce((sum, item) => sum + item.quantity, 0);
      return updated;
    });

    showToast(`🛍️ Added to Cart (${cartItemsCount + 1} items)! Tap Cart anytime to checkout.`);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        triggerHaptic('light');
        showToast(`🤍 Removed from Wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        triggerHaptic('success');
        showToast(`💖 Saved to Wishlist!`);
        return [...prev, product];
      }
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleConfirmTrial = (booking: TrialBooking) => {
    setTrialBookings((prev) => [booking, ...prev]);
    showToast(`👑 Trial @Home scheduled for ${booking.date} (${booking.timeSlot})!`);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);
    setCart([]);
    setExchangeVoucher(null);
    setIsOrderSuccessOpen(true);
    showToast(`🎉 Order ${newOrder.id} Booked Successfully! Doorstep delivery OTP: ${newOrder.deliveryOtp}`);
  };

  // Filtered Products
  const qLower = (searchQuery || '').toLowerCase().trim();
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesTrial = !trialOnlyFilter || Boolean(p.trialEligible);
    const matchesArtisan = !selectedArtisanFilter || 
      (p.partnerSeller && p.partnerSeller.businessName.toLowerCase().includes(selectedArtisanFilter.toLowerCase())) ||
      (p.partnerSeller && selectedArtisanFilter.toLowerCase().includes(p.partnerSeller.businessName.toLowerCase())) ||
      (selectedArtisanFilter.toLowerCase().includes('lakshmi') && (p.id === 'p-1' || p.id === 'p-2' || p.id === 'p-8'));
    const matchesSearch =
      qLower === '' ||
      (p.name || '').toLowerCase().includes(qLower) ||
      (p.category || '').toLowerCase().includes(qLower) ||
      (p.metal || '').toLowerCase().includes(qLower) ||
      (p.partnerSeller?.businessName || '').toLowerCase().includes(qLower);
    return matchesCat && matchesTrial && matchesArtisan && matchesSearch;
  });

  const totalTrialEligibleCount = products.filter((p) => p.trialEligible).length;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* Animated Designed Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            const hasSeenIntro = localStorage.getItem('roldygoldy_intro_seen');
            if (!hasSeenIntro) {
              setShowIntroSlides(true);
            } else if (!localStorage.getItem('roldygoldy_auth_user')) {
              setShowLoginScreen(true);
            }
          }}
        />
      )}

      {/* Feature Intro & Onboarding Slides (Displayed before Login Screen) */}
      {showIntroSlides && (
        <IntroBannerSlides
          onComplete={() => {
            localStorage.setItem('roldygoldy_intro_seen', 'true');
            setShowIntroSlides(false);
            // After Banner slides complete or are skipped, land directly on dedicated Login Screen
            setShowLoginScreen(true);
          }}
        />
      )}

      {/* Dedicated Login Screen */}
      {showLoginScreen && (
        <LoginScreen
          initialPhone={userProfile.phone.replace('+91', '').trim()}
          onLoginSuccess={(authedUser) => {
            setUserProfile(authedUser);
            setIsAuthenticated(true);
            localStorage.setItem('roldygoldy_auth_user', JSON.stringify(authedUser));
            setShowLoginScreen(false);
            showToast(`👑 Welcome to RoldyGoldy Atelier, ${authedUser.name}!`);
          }}
          onExploreAsGuest={() => {
            setShowLoginScreen(false);
            showToast('✨ Welcome Connoisseur! Exploring boutique collection');
          }}
          onViewBannersAgain={() => {
            setShowLoginScreen(false);
            setShowIntroSlides(true);
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 bg-amber-500 text-stone-950 px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-yellow-300 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Container */}
      <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative bg-stone-950 border-x border-stone-800/60 shadow-2xl">
        
        {/* Top Header */}
        {!selectedProduct && activeTab !== 'account' && (
          <header className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <img src="/roldygoldy-logo.png" alt="RoldyGoldy" className="h-10 w-auto object-contain rounded-xl" />
                <div className="hidden sm:block">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-amber-300/80 block font-semibold">Her Pride · Her Choice · Her Trust</span>
                </div>
              </div>
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsArtisanShowcaseOpen(true);
                }}
                className="hidden sm:flex bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-xl text-xs font-bold items-center gap-1.5 transition-colors"
                title="View Certified Artisan Guilds"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Artisan Guilds</span>
              </button>

              {/* Wishlist Header Button */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsWishlistOpen(true);
                }}
                className="relative bg-stone-900 hover:bg-stone-800 text-stone-200 p-2 rounded-xl border border-stone-800 transition-all"
                title="View Saved Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Header Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-stone-900 hover:bg-stone-800 text-stone-200 p-2 rounded-xl border border-stone-800 transition-all"
                title="View Cart & Checkout"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Sign In / Account Header Button */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setShowLoginScreen(true);
                }}
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 px-2.5 py-1.5 rounded-xl border border-stone-800 hover:border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Sign In or Register"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{userProfile.name ? userProfile.name.split(' ')[0] : 'Sign In'}</span>
              </button>
            </div>
          </header>
        )}

        {/* Dynamic Content View */}
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onOpenBargain={handleOpenBargain}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
            onOpenTrial={(p) => {
              setTrialTargetProduct(p);
              setIsTrialModalOpen(true);
            }}
            onOpenMartTour={(p) => {
              setMartTourTargetProduct(p);
              setIsMartTourModalOpen(true);
            }}
            onAddToCart={(p, isDirectBuy = false) => handleAddToCart(p, isDirectBuy)}
            appliedExchangeVoucher={exchangeVoucher}
            isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
            onToggleWishlist={handleToggleWishlist}
            onOpenWishlist={() => setIsWishlistOpen(true)}
            cartCount={cartItemsCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        ) : activeTab === 'boutique' ? (
          <BoutiqueView
            onOpenTrial={(p) => {
              setTrialTargetProduct(p || products[0]);
              setIsTrialModalOpen(true);
            }}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
            onExploreProducts={() => setActiveTab('home')}
          />
        ) : activeTab === 'account' ? (
          <AccountView
            onBack={() => setActiveTab('home')}
            userProfile={userProfile}
            onUpdateProfile={(updated) => {
              setUserProfile(updated);
              localStorage.setItem('roldygoldy_auth_user', JSON.stringify(updated));
              showToast('Profile updated successfully!');
            }}
            onLogout={() => {
              localStorage.removeItem('roldygoldy_auth_user');
              setIsAuthenticated(false);
              setShowLoginScreen(true);
              showToast('Logged out of boutique session');
            }}
            orders={orders}
            trialBookings={trialBookings}
            exchangeSlips={exchangeSlips}
            bargainHistory={bargainHistory}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
          />
        ) : (
          <main className="flex-1 rg-page pb-28">
            {/* Premium location ribbon */}
            <section className="px-4 pt-4 sm:px-6 max-w-5xl mx-auto w-full">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setIsLocationModalOpen(true);
                }}
                className="rg-location-card w-full text-left flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rg-icon-orb"><MapPin className="w-4 h-4" /></div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] rg-muted font-bold">Delivering to</p>
                    <p className="text-sm font-bold truncate rg-cream">{currentLocation.city} · {currentLocation.pincode}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shrink-0 ${currentLocation.trialAtHomeAvailable ? 'rg-trial-badge' : 'rg-standard-badge'}`}>
                  {currentLocation.trialAtHomeAvailable ? '⚡ Trial Today' : 'Standard Delivery'}
                </span>
              </button>
            </section>

            {/* Brand hero */}
            <section className="px-4 pt-4 sm:px-6 max-w-5xl mx-auto w-full">
              <div className="rg-hero relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_20%,rgba(247,204,106,.38),transparent_24%),radial-gradient(circle_at_12%_90%,rgba(129,14,45,.65),transparent_40%)]" />
                <div className="relative z-10 max-w-xl py-7 sm:py-10">
                  <span className="rg-kicker">NEW EXPERIENCE · MADE FOR EVERY MOMENT</span>
                  <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-bold leading-[1.02] rg-cream">
                    Her choice.<br/><span className="rg-gold-text">Her shine.</span> Her story.
                  </h2>
                  <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-rose-100/75">
                    From everyday minimal pieces to bridal statements — discover jewellery your way, try selected pieces at home, and exchange old imitation jewellery for savings.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => { setTrialTargetProduct(products.find(p => p.trialEligible) || products[0]); setIsTrialModalOpen(true); triggerHaptic('medium'); }}
                      className="rg-primary-btn"
                    >
                      <Crown className="w-4 h-4" /> Try @Home
                    </button>
                    <button
                      onClick={() => { setIsLivePhotoModalOpen(true); triggerHaptic('light'); }}
                      className="rg-secondary-btn"
                    >
                      ♻️ Exchange & Save
                    </button>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 h-full w-[42%] hidden sm:block pointer-events-none">
                  <div className="absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,transparent,rgba(35,7,14,.05)),url('/roldygoldy-logo.png')] bg-contain bg-right-bottom bg-no-repeat opacity-80 mix-blend-screen" />
                </div>
              </div>
            </section>

            {/* Search */}
            <section id="product-catalog-section" className="px-4 pt-4 sm:px-6 max-w-5xl mx-auto w-full space-y-3">
              <div className="rg-search-shell">
                <Search className="w-4 h-4 rg-gold shrink-0" />
                <input
                  type="text"
                  placeholder="Search necklaces, jhumkas, bangles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 min-w-0 text-sm outline-none rg-cream placeholder:text-rose-100/35"
                />
                <button onClick={() => setTrialOnlyFilter(!trialOnlyFilter)} className={`text-[10px] sm:text-xs font-bold px-3 py-2 rounded-xl border transition-all ${trialOnlyFilter ? 'rg-filter-active' : 'rg-filter-idle'}`}>
                  {trialOnlyFilter ? 'Trial Only ✓' : 'Trial @Home'}
                </button>
              </div>
            </section>

            {/* Category cards */}
            <section className="px-4 pt-2 sm:px-6 max-w-5xl mx-auto w-full">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="rg-section-eyebrow">SHOP YOUR MOOD</p>
                  <h3 className="font-serif text-xl font-bold rg-cream">Explore categories</h3>
                </div>
                <button onClick={() => setSelectedCategory('All')} className="text-xs rg-gold font-bold">View all</button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {[
                  ['All', '✨'], ['Bridal', '👑'], ['Temple', '🛕'], ['Daily Wear', '☀️'], ['Korean', '🌸'], ['Polki', '💎']
                ].map(([cat, icon]) => (
                  <button key={cat} onClick={() => { setSelectedCategory(cat); triggerHaptic('light'); }} className={`rg-category-card ${selectedCategory === cat ? 'rg-category-active' : ''}`}>
                    <span className="text-lg">{icon}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Signature service cards */}
            <section className="px-4 pt-5 sm:px-6 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button onClick={() => { setTrialTargetProduct(products.find(p => p.trialEligible) || products[0]); setIsTrialModalOpen(true); }} className="rg-service-card rg-service-trial text-left">
                <span className="text-2xl">🏠</span><div><p className="font-bold rg-cream">Trial @Home</p><p>Choose, try, decide.</p></div><ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              <button onClick={() => setIsLivePhotoModalOpen(true)} className="rg-service-card text-left">
                <span className="text-2xl">♻️</span><div><p className="font-bold rg-cream">Exchange & Save</p><p>Upload old jewellery.</p></div><ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              <button onClick={() => setActiveTab('boutique')} className="rg-service-card text-left">
                <span className="text-2xl">🎀</span><div><p className="font-bold rg-cream">Bridal Studio</p><p>Curated for your day.</p></div><ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </section>

            {/* Offers / artisan banner */}
            <section className="px-4 pt-5 sm:px-6 max-w-5xl mx-auto w-full">
              <AdBannerSlider
                banners={adBanners}
                onSelectArtisan={(businessName) => {
                  setSelectedArtisanFilter(businessName);
                  setSelectedCategory('All');
                  setTrialOnlyFilter(false);
                  showToast(`Showing ${businessName} collections`);
                }}
              />
            </section>

            {/* Collection heading + products */}
            <section className="px-4 pt-5 sm:px-6 max-w-5xl mx-auto w-full">
              <div className="flex items-end justify-between gap-3 mb-4">
                <div>
                  <p className="rg-section-eyebrow">CURATED FOR YOU</p>
                  <h3 className="font-serif text-2xl font-bold rg-cream">{selectedCategory === 'All' ? 'Trending collections' : selectedCategory}</h3>
                  <p className="text-xs rg-muted mt-1">{filteredProducts.length} beautiful pieces waiting for you</p>
                </div>
                {selectedArtisanFilter && (
                  <button onClick={() => setSelectedArtisanFilter(null)} className="text-[11px] rg-gold font-bold border border-amber-400/30 px-2.5 py-1.5 rounded-xl">Clear filter</button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rg-empty-state">
                  <span className="text-4xl">✨</span>
                  <h4>No matching jewellery yet</h4>
                  <p>Try another category or clear the filters.</p>
                  <button onClick={() => { setTrialOnlyFilter(false); setSelectedCategory('All'); setSelectedArtisanFilter(null); setSearchQuery(''); }} className="rg-primary-btn">Show everything</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => {
                    const activePrice = product.bargainedPrice || product.price;
                    const isSaved = wishlist.some((w) => w.id === product.id);
                    return (
                      <article key={product.id} className="rg-product-card group">
                        <div onClick={() => setSelectedProduct(product)} className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#2a0811]">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#24070e]/70 to-transparent pointer-events-none" />
                          {product.trialEligible && <span className="absolute top-2 left-2 rg-product-badge">Try @Home</span>}
                          <button onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }} className={`absolute top-2 right-2 rg-heart-btn ${isSaved ? 'rg-heart-active' : ''}`}><Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /></button>
                        </div>
                        <div className="p-3.5 space-y-2">
                          <button onClick={() => setSelectedProduct(product)} className="text-left w-full">
                            <h4 className="font-bold text-sm rg-cream line-clamp-1">{product.name}</h4>
                            <p className="text-[10px] rg-muted mt-1">{product.category} · {product.metal}</p>
                          </button>
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold rg-gold text-base">₹{activePrice.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] line-through text-rose-100/35">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => handleOpenBargain(product)} className="rg-mini-secondary flex-1"><MessageSquare className="w-3.5 h-3.5"/> Bargain</button>
                            <button onClick={() => handleAddToCart(product, false)} className="rg-mini-primary"><ShoppingBag className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Trust strip */}
            <section className="px-4 pt-6 sm:px-6 max-w-5xl mx-auto w-full pb-3">
              <div className="rg-trust-strip grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><span>🏠</span><b>Trial @Home</b><small>Selected local pieces</small></div>
                <div><span>♻️</span><b>Exchange & Save</b><small>Old jewellery value</small></div>
                <div><span>🔒</span><b>Secure Payments</b><small>Protected checkout</small></div>
                <div><span>↩️</span><b>Easy Returns</b><small>Simple support flow</small></div>
              </div>
            </section>
          </main>
        )}

        {/* Persistent Bottom 5-Tab Navigation */}
        {!selectedProduct && (
          <nav className="fixed bottom-0 inset-x-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 max-w-5xl mx-auto flex justify-around py-2 px-2 sm:px-4 shadow-2xl">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('home');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('boutique');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'boutique' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">💎</span>
              <span>Studio</span>
            </button>

            {/* Wishlist Bottom Tab */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-rose-400 relative transition-colors"
            >
              <div className="relative">
                <span className="text-base">💖</span>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span>Wishlist</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-amber-300 relative transition-colors"
            >
              <div className="relative">
                <span className="text-base">🛒</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-stone-950 font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('account');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'account' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">👤</span>
              <span>Account</span>
            </button>
          </nav>
        )}

      </div>

      {/* MODALS */}

      {/* 1. Bargain with Jeweller Modal */}
      {bargainTargetProduct && (
        <BargainModal
          product={bargainTargetProduct}
          isOpen={isBargainModalOpen}
          onClose={() => {
            setIsBargainModalOpen(false);
            setBargainTargetProduct(null);
          }}
          onDealLocked={handleDealLocked}
        />
      )}

      {/* 1b. Bargain Piece Selector Picker Modal */}
      <BargainPickerModal
        isOpen={isBargainPickerOpen}
        onClose={() => setIsBargainPickerOpen(false)}
        products={products}
        onSelectProductToBargain={(prod) => {
          setIsBargainPickerOpen(false);
          handleOpenBargain(prod);
        }}
        onBrowseAllCatalog={() => {
          setIsBargainPickerOpen(false);
          setSelectedCategory('All');
          const el = document.getElementById('product-catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Live Photo Upload / Camera Scrap Exchange Modal */}
      {isLivePhotoModalOpen && (
        <LivePhotoUploadModal
          isOpen={isLivePhotoModalOpen}
          onClose={() => setIsLivePhotoModalOpen(false)}
          onScrapValued={handleScrapValued}
        />
      )}

      {/* 3. Trial @Home Concierge Modal */}
      {trialTargetProduct && (
        <TrialConciergeModal
          product={trialTargetProduct}
          isOpen={isTrialModalOpen}
          userPincode={userPincode}
          onClose={() => {
            setIsTrialModalOpen(false);
            setTrialTargetProduct(null);
          }}
          onConfirmTrial={handleConfirmTrial}
        />
      )}

      {/* 4. Customer Login / Signup Privilege Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(updatedUser) => {
          setUserProfile(updatedUser);
          showToast(`👑 Welcome, ${updatedUser.name}! Account active.`);
        }}
        initialPhone={userProfile.phone ? userProfile.phone.replace('+91 ', '') : '9876543210'}
      />

      {/* 5. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        exchangeVoucher={exchangeVoucher}
        onRemoveVoucher={() => setExchangeVoucher(null)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsCartOpen(false);
        }}
      />

      {/* 6. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        exchangeVoucher={exchangeVoucher}
        onRemoveVoucher={() => setExchangeVoucher(null)}
        onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
        userProfile={userProfile}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 7. Dedicated Order Booking Confirmation Screen */}
      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        order={latestPlacedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewReports={() => {
          setIsOrderSuccessOpen(false);
          setIsProfileReportsOpen(true);
        }}
      />

      {/* 8. Profile & Reports Modal */}
      <ProfileReportsModal
        isOpen={isProfileReportsOpen}
        onClose={() => setIsProfileReportsOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => {
          setUserProfile(updated);
          showToast('Profile updated successfully!');
        }}
        orders={orders}
        trialBookings={trialBookings}
        exchangeSlips={exchangeSlips}
        bargainHistory={bargainHistory}
      />

      {/* 9. Interactive GPS & Pincode Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleLocationSelected}
      />

      {/* 10. Seller Ad Slot Booking Portal Modal */}
      <SellerAdBookingModal
        isOpen={isSellerAdModalOpen}
        onClose={() => setIsSellerAdModalOpen(false)}
        defaultCity={currentLocation.city}
        defaultPincode={currentLocation.pincode}
        onAdBooked={(booking, banner) => {
          setSellerAdBookings((prev) => [booking, ...prev]);
          setAdBanners((prev) => [banner, ...prev]);
          showToast(`📢 Ad Slot Booked! "${banner.title}" is now live.`);
        }}
      />

      {/* 11. 360° Real-time Jewellery Mart Tour Modal */}
      <JewelleryMartTourModal
        isOpen={isMartTourModalOpen}
        product={martTourTargetProduct}
        onClose={() => {
          setIsMartTourModalOpen(false);
          setMartTourTargetProduct(null);
        }}
        onOpenTrial={(prod) => {
          setMartTourTargetProduct(null);
          setIsMartTourModalOpen(false);
          setTrialTargetProduct(prod);
          setIsTrialModalOpen(true);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* 12. Certified Artisan Guilds & Heritage Showcase Modal */}
      <ArtisanShowcaseModal
        isOpen={isArtisanShowcaseOpen}
        onClose={() => setIsArtisanShowcaseOpen(false)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          showToast(`Filtered by ${cat} collection`);
        }}
        onSelectArtisan={(artisanBusinessName, category) => {
          setSelectedArtisanFilter(artisanBusinessName);
          if (category) {
            setSelectedCategory(category);
          } else {
            setSelectedCategory('All');
          }
          setTrialOnlyFilter(false);
          setSelectedProduct(null);
          setActiveTab('home');
          showToast(`👑 Showing master collection from ${artisanBusinessName}`);
          const el = document.getElementById('product-catalog-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* 13. Customer Saved Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(productId) => {
          setWishlist((prev) => prev.filter((p) => p.id !== productId));
          triggerHaptic('light');
          showToast('Removed item from Wishlist');
        }}
        onAddToCart={(p, isDirectBuy = false) => {
          handleAddToCart(p, isDirectBuy);
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBargain={(p) => {
          setIsWishlistOpen(false);
          handleOpenBargain(p);
        }}
        onSelectProduct={(p) => {
          setIsWishlistOpen(false);
          setSelectedProduct(p);
        }}
        onOpenTrial={(p) => {
          setIsWishlistOpen(false);
          setTrialTargetProduct(p);
          setIsTrialModalOpen(true);
        }}
      />

    </div>
  );
}
