import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Crown,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, isDirectBuy?: boolean) => void;
  onOpenTrial?: (product: Product) => void;
  onOpenBargain: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCart?: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenTrial,
  onOpenBargain,
  onSelectProduct,
  onOpenCart,
}) => {
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [cartAlertProduct, setCartAlertProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleAddToCartWithFeedback = (product: Product) => {
    triggerHaptic('success');
    
    // Mark this product as added
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setCartAlertProduct(product);

    // Call the parent add-to-cart handler
    onAddToCart(product, false);

    // Reset button text after 3 seconds
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <div className="rg-drawer-overlay fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
      <div className="w-full max-w-md rg-commerce-drawer flex flex-col h-full animate-in slide-in-from-right duration-300 relative">
        
        {/* Drawer Header */}
        <div className="rg-commerce-header px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-stone-100 text-sm flex items-center gap-2">
                <span>My Saved Wishlist</span>
                <span className="text-[11px] font-sans font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">Saved pieces, ready whenever you are</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full rg-surface border text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-stone-600">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-200 text-base">Save what catches your eye</h3>
                <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                  Your favourites stay here while you browse. Open any piece, book Trial @Home when eligible, bargain with the jeweller, or add only the pieces you want to cart.
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            wishlist.map((product) => {
              const activePrice = product.bargainedPrice || product.price;
              const isBargained = Boolean(product.bargainedPrice && product.bargainedPrice < product.price);
              const isJustAdded = addedMap[product.id];
              
              return (
                <div
                  key={product.id}
                  className="bg-stone-950 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-3 flex flex-col gap-2.5 transition-all group"
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div 
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="w-20 h-20 rounded-xl overflow-hidden rg-surface border shrink-0 cursor-pointer relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.trialEligible && (
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-sm">
                          Trial
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 
                            onClick={() => {
                              onSelectProduct(product);
                              onClose();
                            }}
                            className="font-medium text-stone-200 text-xs truncate cursor-pointer hover:text-amber-300"
                          >
                            {product.name}
                          </h4>
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              onRemoveFromWishlist(product.id);
                            }}
                            className="text-stone-500 hover:text-rose-400 transition-colors p-1 -mr-1 -mt-1"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-400 block truncate">
                          {product.category} · {product.metal.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-sm font-bold text-amber-400">
                          ₹{activePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10.5px] text-stone-500 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        {isBargained && (
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.5 rounded font-bold">
                            Bargained
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this saved piece */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-stone-800/80">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        if (onOpenTrial && product.trialEligible) {
                          onOpenTrial(product);
                          onClose();
                        } else {
                          onSelectProduct(product);
                          onClose();
                        }
                      }}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-semibold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                      title={product.trialEligible ? "Book Trial @Home" : "View Piece Details"}
                    >
                      <span>{product.trialEligible ? '🏠 Trial @Home' : '🔍 View Details'}</span>
                    </button>

                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        onOpenBargain(product);
                        onClose();
                      }}
                      className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-semibold text-[11px] py-2 rounded-xl flex items-center justify-center gap-1 transition-colors"
                      title="Bargain with Jeweller"
                    >
                      <MessageSquare className="w-3 h-3 text-amber-400" />
                      <span>Bargain</span>
                    </button>

                    {/* Dedicated Add-to-Cart with Instant Visual Feedback */}
                    <button
                      onClick={() => handleAddToCartWithFeedback(product)}
                      className={`py-2 px-3.5 rounded-xl font-extrabold text-[11.5px] flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 ${
                        isJustAdded
                          ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-300'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950'
                      }`}
                      title="Add to Cart"
                    >
                      {isJustAdded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PROMINENT IN-DRAWER ADDED-TO-CART CONFIRMATION MODAL */}
        {cartAlertProduct && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-stone-900 border border-emerald-500/60 rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm">Product Added to Cart!</h4>
                    <p className="text-emerald-400 text-xs font-semibold">Ready for checkout or trial combo</p>
                  </div>
                </div>
                <button
                  onClick={() => setCartAlertProduct(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
                  title="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product Brief */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center gap-3">
                <img
                  src={cartAlertProduct.image}
                  alt={cartAlertProduct.name}
                  className="w-14 h-14 rounded-lg object-cover border border-stone-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-semibold text-stone-200 text-xs truncate">{cartAlertProduct.name}</h5>
                  <p className="text-[11px] text-stone-400">{cartAlertProduct.category} · {cartAlertProduct.metal.split(' ')[0]}</p>
                  <span className="text-amber-400 font-extrabold text-sm font-mono mt-0.5 block">
                    ₹{(cartAlertProduct.bargainedPrice || cartAlertProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setCartAlertProduct(null);
                    onClose();
                    if (onOpenCart) {
                      onOpenCart();
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Cart &amp; Complete Order ↗</span>
                </button>

                <button
                  onClick={() => setCartAlertProduct(null)}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs py-2.5 rounded-xl transition-colors"
                >
                  Continue Browsing Wishlist
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer */}
        {wishlist.length > 0 && (
          <div className="rg-glass p-4 border-t border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>{wishlist.length} saved {wishlist.length === 1 ? 'piece' : 'pieces'}</span>
              <span className="font-medium text-stone-500">Choose what you want to buy</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold text-xs py-3 rounded-xl transition-colors"
              >
                Keep Browsing
              </button>
              <button
                onClick={() => {
                  triggerHaptic('success');
                  onClose();
                  if (onOpenCart) onOpenCart();
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
