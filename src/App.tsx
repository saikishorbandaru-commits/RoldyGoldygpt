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
  Navigation,
  House,
  Gem
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
import { HomeRedesign } from './components/HomeRedesign';

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

  // Featured Boutique Banners
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
    <div className="rg-page min-h-screen text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* Animated Designed Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
            // App Features always follows Splash, as requested. Authentication is checked only after the tour.
            setShowIntroSlides(true);
          }}
        />
      )}

      {/* Feature Intro & Onboarding Slides (Displayed before Login Screen) */}
      {showIntroSlides && (
        <IntroBannerSlides
          onComplete={() => {
            localStorage.setItem('roldygoldy_intro_seen', 'true');
            setShowIntroSlides(false);
            // Logged-in users continue straight into the app; guests see the OTP/login screen.
            if (!localStorage.getItem('roldygoldy_auth_user')) {
              setShowLoginScreen(true);
            }
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

              {/* Account action: authenticated users go to Account; guests are invited to sign in. */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  if (isAuthenticated) {
                    setSelectedProduct(null);
                    setActiveTab('account');
                  } else {
                    setShowLoginScreen(true);
                  }
                }}
                className="bg-stone-900 hover:bg-stone-800 text-stone-200 px-2.5 py-1.5 rounded-xl border border-stone-800 hover:border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title={isAuthenticated ? "Open Account" : "Sign In or Register"}
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isAuthenticated ? (userProfile.name ? userProfile.name.split(' ')[0] : 'Account') : 'Sign In'}</span>
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
          <HomeRedesign
            products={products}
            filteredProducts={filteredProducts}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            trialOnlyFilter={trialOnlyFilter}
            locationLabel={`${currentLocation.city} · ${currentLocation.pincode}`}
            trialAvailable={currentLocation.trialAtHomeAvailable}
            wishlist={wishlist}
            onSearch={setSearchQuery}
            onCategory={(category) => { setSelectedCategory(category); setSelectedArtisanFilter(null); }}
            onToggleTrial={() => setTrialOnlyFilter(prev => !prev)}
            onOpenLocation={() => setIsLocationModalOpen(true)}
            onSelectProduct={setSelectedProduct}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={(product) => handleAddToCart(product, false)}
            onOpenTrial={() => { setTrialTargetProduct(products.find(p => p.trialEligible) || products[0]); setIsTrialModalOpen(true); }}
            onOpenExchange={() => setIsLivePhotoModalOpen(true)}
            onOpenBargain={() => setIsBargainPickerOpen(true)}
          />
        )}

        {/* Persistent premium app navigation */}
        {!selectedProduct && (
          <nav className="rg-app-dock" aria-label="Primary navigation">
            <div className="rg-app-dock-inner">
              <button onClick={() => { setSelectedProduct(null); setActiveTab('home'); }} className={`rg-dock-item ${activeTab === 'home' ? 'is-active' : ''}`} aria-label="Home">
                <House className="w-5 h-5" strokeWidth={activeTab === 'home' ? 2.6 : 2} /><span>Home</span>
              </button>
              <button onClick={() => { setSelectedProduct(null); setActiveTab('boutique'); }} className={`rg-dock-item ${activeTab === 'boutique' ? 'is-active' : ''}`} aria-label="Boutique">
                <Gem className="w-5 h-5" strokeWidth={activeTab === 'boutique' ? 2.6 : 2} /><span>Boutique</span>
              </button>
              <button onClick={() => setIsWishlistOpen(true)} className="rg-dock-item" aria-label="Saved">
                <span className="relative"><Heart className="w-5 h-5" />{wishlist.length > 0 && <span className="rg-nav-count">{wishlist.length}</span>}</span><span>Saved</span>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="rg-dock-item" aria-label="Cart">
                <span className="relative"><ShoppingBag className="w-5 h-5" />{cartItemsCount > 0 && <span className="rg-nav-count">{cartItemsCount}</span>}</span><span>Cart</span>
              </button>
              <button onClick={() => { setSelectedProduct(null); setActiveTab('account'); }} className={`rg-dock-item ${activeTab === 'account' ? 'is-active' : ''}`} aria-label="Account">
                <User className="w-5 h-5" strokeWidth={activeTab === 'account' ? 2.6 : 2} /><span>Account</span>
              </button>
            </div>
          </nav>
        )}}

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

      {/* 10. Boutique Promotion Portal Modal */}
      <SellerAdBookingModal
        isOpen={isSellerAdModalOpen}
        onClose={() => setIsSellerAdModalOpen(false)}
        defaultCity={currentLocation.city}
        defaultPincode={currentLocation.pincode}
        onAdBooked={(booking, banner) => {
          setSellerAdBookings((prev) => [booking, ...prev]);
          setAdBanners((prev) => [banner, ...prev]);
          showToast(`📢 Featured collection updated! "${banner.title}" is now live.`);
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
