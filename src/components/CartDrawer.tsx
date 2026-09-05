import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  ArrowRight, 
  ArrowLeft, 
  Gift, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Camera,
  Crown,
  Info
} from 'lucide-react';
import { CartItem, ExchangeScrapData, Product } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  exchangeVoucher: ExchangeScrapData | null;
  onRemoveVoucher: () => void;
  onProceedToCheckout: () => void;
  onOpenLiveScrapUpload: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  exchangeVoucher,
  onRemoveVoucher,
  onProceedToCheckout,
  onOpenLiveScrapUpload,
  onSelectProduct,
}) => {
  const [expandedProductIds, setExpandedProductIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const originalTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product.originalPrice || item.product.price) * item.quantity;
  }, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.customPrice || item.product.bargainedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const catalogSavings = Math.max(0, originalTotal - subtotal);
  const discountAmount = exchangeVoucher ? exchangeVoucher.netCredit : 0;
  const netDiscount = catalogSavings + discountAmount;
  const totalPayable = Math.max(0, subtotal - discountAmount);

  const toggleDetails = (productId: string) => {
    triggerHaptic('light');
    setExpandedProductIds((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleProductClick = (product: Product) => {
    triggerHaptic('light');
    if (onSelectProduct) {
      onSelectProduct(product);
      onClose();
    }
  };

  return (
    <div className="rg-drawer-overlay fixed inset-0 z-50 flex justify-end animate-in fade-in">
      <div className="w-full max-w-md rg-commerce-drawer h-full flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header with Back Navigation Button */}
        <div className="rg-commerce-header px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors text-xs font-semibold"
              title="Back to Shopping"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-100 text-xs sm:text-sm">My Jewellery Bag</h3>
                <p className="text-[10px] text-stone-400">{cartItems.length} item(s)</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 rg-page text-xs">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-800/80 border border-stone-700 text-stone-500 flex items-center justify-center mx-auto text-2xl">
                💍
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-200">Your jewellery cart is empty</h4>
                <p className="text-xs text-stone-400 mt-1">Your selected pieces will appear here when you are ready to compare or buy.</p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Exploring</span>
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const activePrice = item.customPrice || item.product.bargainedPrice || item.product.price;
              const isBargained = Boolean(item.isBargained || (item.customPrice && item.customPrice < item.product.price) || (item.product.bargainedPrice && item.product.bargainedPrice < item.product.price));

              return (
                <div 
                  key={item.product.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-3 flex flex-col gap-2 transition-all shadow-sm group"
                >
                  <div className="flex gap-3 items-start">
                    {/* Clickable Product Image */}
                    <div 
                      onClick={() => handleProductClick(item.product)}
                      className="w-18 h-18 rounded-xl overflow-hidden bg-stone-950 border border-amber-500/30 shrink-0 cursor-pointer relative"
                      title="Click to view details & exchange"
                    >
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                      {item.product.trialEligible && (
                        <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[7.5px] font-bold px-1 rounded-sm shadow-xs">
                          Trial
                        </span>
                      )}
                    </div>

                    {/* Product Info & Pricing */}
                    <div className="flex-1 min-w-0">
                      <div 
                        onClick={() => handleProductClick(item.product)}
                        className="font-semibold text-stone-100 truncate cursor-pointer hover:text-amber-300 transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{item.product.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0 ml-1" />
                      </div>

                      {/* Specifications Summary */}
                      <div className="text-[10px] text-stone-400 mt-0.5 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-stone-800 text-amber-300/90 px-1.5 py-0.2 rounded font-medium">
                            {item.product.category}
                          </span>
                          <span>•</span>
                          <span>Net Wt: {item.product.netWeight}</span>
                        </div>
                        <p className="truncate text-stone-400/90 text-[9.5px]">
                          {item.product.metal.split('(')[0].trim()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-extrabold text-sm text-amber-400">
                          ₹{activePrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10.5px] text-stone-500 line-through">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        {isBargained && (
                          <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                            Bargained ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Details & Exchange Action Button / Accordion */}
                  <div className="bg-stone-950/70 rounded-xl p-2.5 border border-stone-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => toggleDetails(item.product.id)}
                        className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors text-left"
                        title="Click to view piece specifications & trade-in details"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>View Piece Specs &amp; Exchange Options</span>
                        {expandedProductIds[item.product.id] ? (
                          <ChevronUp className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
                        )}
                      </button>

                      <button
                        onClick={() => handleProductClick(item.product)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 shrink-0"
                        title="Open full boutique details page"
                      >
                        <span>Full Page</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Detailed Specifications & Exchange Info for this piece */}
                    {expandedProductIds[item.product.id] && (
                      <div className="pt-2 border-t border-stone-800/60 space-y-2 text-[10.5px] text-stone-300 animate-in fade-in duration-150">
                        <div className="grid grid-cols-2 gap-1.5 bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                          <div><span className="text-stone-500">Purity:</span> <strong className="text-stone-200">{item.product.purity || '22K (916) BIS Hallmark'}</strong></div>
                          <div><span className="text-stone-500">Net Wt:</span> <strong className="text-stone-200">{item.product.netWeight}</strong></div>
                          <div><span className="text-stone-500">Gross Wt:</span> <strong className="text-stone-200">{item.product.grossWeight}</strong></div>
                          <div><span className="text-stone-500">Stone:</span> <strong className="text-stone-200">{item.product.stone || 'Natural Gem / Uncut'}</strong></div>
                        </div>

                        {item.product.partnerSeller && (
                          <div className="text-[10px] text-stone-400 bg-stone-900/50 px-2 py-1 rounded flex items-center justify-between">
                            <span>Artisan Guild: <strong className="text-amber-300">{item.product.partnerSeller.businessName}</strong></span>
                            <span className="text-stone-400 text-[9.5px]">📍 {item.product.partnerSeller.city}</span>
                          </div>
                        )}

                        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 space-y-1.5">
                          <div className="flex items-center justify-between text-emerald-300 font-semibold">
                            <span className="flex items-center gap-1">
                              <RefreshCw className="w-3 h-3" />
                              <span>Exchange with Old Scrap Gold</span>
                            </span>
                            <span className="font-bold text-xs">~₹{Math.round((item.product.price) * 0.85).toLocaleString('en-IN')} Trade Value</span>
                          </div>
                          <p className="text-[9.5px] text-emerald-400/80">
                            Upload a clear jewellery image for verification before an exchange estimate can be created.
                          </p>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            <button
                              onClick={() => {
                                triggerHaptic('light');
                                onOpenLiveScrapUpload();
                              }}
                              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold py-1.5 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Start Jewellery Exchange</span>
                            </button>
                            <button
                              onClick={() => handleProductClick(item.product)}
                              className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold py-1.5 px-2.5 rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <span>Boutique Page</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity & Delete Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                    <div className="flex items-center gap-2 bg-stone-950 rounded-lg px-2 py-0.5 border border-stone-800">
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQty(item.product.id, -1);
                        }}
                        className="text-stone-400 hover:text-white"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-stone-200 px-1">{item.quantity}</span>
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          onUpdateQty(item.product.id, 1);
                        }}
                        className="text-stone-400 hover:text-white"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        triggerHaptic('medium');
                        onRemoveItem(item.product.id);
                      }}
                      className="text-stone-500 hover:text-red-400 p-1 flex items-center gap-1 text-[11px]"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Trade-in Scrap Cashback Section in Cart */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              {exchangeVoucher ? (
                <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Old Scrap Cashback: -₹{exchangeVoucher.netCredit.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10.5px] text-emerald-400/90 font-mono">
                      Code: {exchangeVoucher.voucherCode} ({exchangeVoucher.grams}g {exchangeVoucher.metalType})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onRemoveVoucher();
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 bg-red-950/60 rounded-lg border border-red-500/30"
                    title="Remove Voucher"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="bg-stone-900 border border-dashed border-amber-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Have Old Scrap Jewellery?</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Get an exchange estimate after a jewellery image is successfully verified. Random or unrelated images are not eligible for valuation.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      onOpenLiveScrapUpload();
                    }}
                    className="bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition-colors"
                  >
                    Appraise Scrap
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Delivery & Assurance Badges */}
          {cartItems.length > 0 && (
            <div className="rg-surface rounded-2xl p-3 flex items-center justify-between text-stone-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Doorstep Digital Weight Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>20-Min Express Delivery</span>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Bill Breakdown */}
        {cartItems.length > 0 && (
          <div className="rg-glass p-4 border-t border-stone-800 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Items MRP Value:</span>
                <span className="font-mono text-stone-300">₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>

              {catalogSavings > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Store &amp; Bargain Savings:</span>
                  <span className="font-mono">-₹{catalogSavings.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-400">
                <span>Items Subtotal:</span>
                <span className="font-mono text-stone-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {exchangeVoucher && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Scrap Cashback Deduction:</span>
                  </span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {netDiscount > 0 && (
                <div className="flex justify-between text-emerald-300 font-bold bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Applied Net Total Discount:</span>
                  </span>
                  <span className="font-mono">₹{netDiscount.toLocaleString('en-IN')} OFF</span>
                </div>
              )}

              <div className="flex justify-between text-stone-400">
                <span>Express Doorstep Delivery:</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-wider">
                  FREE (Pre-order Concierge)
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-stone-200 text-sm">Total Payable:</span>
                  <p className="text-[10px] text-stone-500">Inclusive of all hallmarks &amp; GST</p>
                </div>
                <span className="font-extrabold text-xl text-amber-400 font-mono">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHaptic('success');
                onProceedToCheckout();
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-extrabold text-sm py-3.5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout (₹{totalPayable.toLocaleString('en-IN')})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
