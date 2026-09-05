import React from 'react';
import {
  Search, MapPin, Heart, ShoppingBag, Crown, Recycle, Handshake,
  ChevronRight, SlidersHorizontal, Grid2X2, Sparkles, ArrowRight
} from 'lucide-react';
import { Product } from '../types';

type Props = {
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  searchQuery: string;
  trialOnlyFilter: boolean;
  locationLabel: string;
  trialAvailable: boolean;
  wishlist: Product[];
  onSearch:(v:string)=>void;
  onCategory:(v:string)=>void;
  onToggleTrial:()=>void;
  onOpenLocation:()=>void;
  onSelectProduct:(p:Product)=>void;
  onToggleWishlist:(p:Product)=>void;
  onAddToCart:(p:Product)=>void;
  onOpenTrial:()=>void;
  onOpenExchange:()=>void;
  onOpenBargain:()=>void;
};

const categoryLabels = ['Daily Wear','Korean','Temple','Bridal','Necklaces','Earrings','Bangles','Rings','Anklets','Accessories'];

export function HomeRedesign(p: Props) {
  const hero = p.products.find(x => x.trialEligible) || p.products[0];
  const categoryProduct = (label:string) => {
    const key = label === 'Necklaces' ? 'Necklace' : label;
    return p.products.find(x =>
      x.category.toLowerCase().includes(key.toLowerCase()) ||
      x.name.toLowerCase().includes(key.toLowerCase())
    ) || p.products[(categoryLabels.indexOf(label) + 1) % Math.max(p.products.length, 1)];
  };
  const bestSellers = p.filteredProducts.slice(0, 8);

  return (
    <main className="rg-showcase-home flex-1 pb-28">
      <div className="rg-showcase-home-inner">
        <header className="rg-showcase-home-header">
          <div>
            <h1>RoldyGoldy</h1>
            <button onClick={p.onOpenLocation} className="rg-showcase-location">
              <MapPin size={13} />
              <span>{p.locationLabel}</span>
              <ChevronRight size={13} />
            </button>
          </div>
          <div className="rg-showcase-header-actions">
            <button onClick={p.onToggleTrial} className={p.trialOnlyFilter ? 'is-active' : ''} aria-label="Trial eligible filter">
              <SlidersHorizontal size={18} />
            </button>
            <button onClick={p.onOpenExchange} aria-label="Exchange jewellery">
              <Recycle size={18} />
            </button>
          </div>
        </header>

        <section className="rg-showcase-search">
          <Search size={19} />
          <input
            value={p.searchQuery}
            onChange={e => p.onSearch(e.target.value)}
            placeholder="Search jewellery"
          />
          <button aria-label="Search filters"><SlidersHorizontal size={17}/></button>
        </section>

        <section className="rg-showcase-trial-banner">
          <div className="rg-showcase-trial-copy">
            <span>Trial @Home</span>
            <h2>Try before you buy</h2>
            <p>{p.trialAvailable ? 'Curated pieces at your doorstep' : 'Check serviceability for your PIN'}</p>
            <button onClick={p.onOpenTrial}>BOOK NOW <ArrowRight size={14}/></button>
          </div>
          {hero && <button onClick={() => p.onSelectProduct(hero)} className="rg-showcase-trial-image">
            <img src={hero.image} alt={hero.name}/>
          </button>}
          <Sparkles className="rg-showcase-trial-sparkle" size={20}/>
        </section>

        <section id="shop-by-category-section" className="rg-showcase-section">
          <div className="rg-showcase-section-heading">
            <div><span>SHOP YOUR WAY</span><h2>Categories</h2></div>
            <button onClick={() => p.onCategory('All')}>View all <ChevronRight size={15}/></button>
          </div>
          <div className="rg-showcase-category-grid">
            {categoryLabels.map((label) => {
              const product = categoryProduct(label);
              return (
                <button
                  key={label}
                  onClick={() => p.onCategory(label === 'Necklaces' ? 'All' : label)}
                  className={p.selectedCategory === label ? 'is-selected' : ''}
                >
                  {product && <img src={product.image} alt="" />}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rg-showcase-feature-row">
          <button onClick={p.onOpenTrial}>
            <span className="rg-showcase-feature-icon"><Crown size={18}/></span>
            <span><small>DOORSTEP</small><strong>Trial @Home</strong></span>
            <ChevronRight size={17}/>
          </button>
          <button onClick={p.onOpenExchange}>
            <span className="rg-showcase-feature-icon"><Recycle size={18}/></span>
            <span><small>CIRCULAR</small><strong>Exchange & Save</strong></span>
            <ChevronRight size={17}/>
          </button>
          <button onClick={p.onOpenBargain}>
            <span className="rg-showcase-feature-icon"><Handshake size={18}/></span>
            <span><small>YOUR PRICE</small><strong>Bargain</strong></span>
            <ChevronRight size={17}/>
          </button>
        </section>

        <section id="product-catalog-section" className="rg-showcase-section">
          <div className="rg-showcase-section-heading">
            <div><span>CURATED FOR YOU</span><h2>Best Sellers</h2></div>
            <button onClick={() => p.onCategory('All')}>See All <ChevronRight size={15}/></button>
          </div>

          {bestSellers.length === 0 ? (
            <div className="rg-showcase-empty"><Grid2X2 size={28}/><p>No pieces found for this filter.</p></div>
          ) : (
            <div className="rg-showcase-product-grid">
              {bestSellers.map(product => {
                const saved = p.wishlist.some(w => w.id === product.id);
                const price = product.bargainedPrice || product.price;
                return (
                  <article key={product.id} className="rg-showcase-product-card">
                    <button onClick={() => p.onSelectProduct(product)} className="rg-showcase-product-image">
                      <img src={product.image} alt={product.name}/>
                      {product.trialEligible && <span>TRIAL</span>}
                    </button>
                    <button
                      onClick={() => p.onToggleWishlist(product)}
                      className={saved ? 'rg-showcase-save is-saved' : 'rg-showcase-save'}
                      aria-label="Save item"
                    >
                      <Heart size={17} fill={saved ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => p.onSelectProduct(product)} className="rg-showcase-product-info">
                      <small>{product.category}</small>
                      <h3>{product.name}</h3>
                      <strong>₹{price.toLocaleString('en-IN')}</strong>
                    </button>
                    <button onClick={() => p.onAddToCart(product)} className="rg-showcase-add" aria-label="Add to cart">
                      <ShoppingBag size={16}/>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
