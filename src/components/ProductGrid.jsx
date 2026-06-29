import React from 'react';
import { Star, Plus, Minus, Check } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function ProductGrid({ 
  products, 
  selectedCategory, 
  cart, 
  addToCart, 
  updateQuantity, 
  soundEnabled 
}) {

  // Play sounds
  const handleAdd = (item) => {
    if (soundEnabled) sfx.play('add');
    addToCart(item);
  };

  const handleQtyChange = (productId, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (soundEnabled) {
      if (nextQty <= 0) sfx.play('remove');
      else sfx.play('add');
    }
    updateQuantity(productId, nextQty);
  };

  const handleHover = () => {
    if (soundEnabled) sfx.play('hover');
  };

  // Get item qty in cart
  const getCartQty = (productId) => {
    const item = cart.find(c => c.id === productId);
    return item ? item.quantity : 0;
  };

  // Filtered Products
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products;

  // Split into categories for default view
  const deals = products.filter(p => p.originalPrice > p.price && p.category !== "Pantry");
  const trending = products.filter(p => p.rating >= 4.8 && p.category !== "Pantry");
  const recommended = products.filter(p => p.reviews > 100 && p.category !== "Pantry");

  const renderProductCard = (product) => {
    const qty = getCartQty(product.id);
    return (
      <div 
        key={product.id}
        onMouseEnter={handleHover}
        className="glass-card rounded-2xl p-4 flex flex-col justify-between h-full relative"
      >
        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
            product.badge.includes('Deal') || product.badge.includes('Low')
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' 
              : 'bg-primary/10 border-primary/20 text-primary'
          }`}>
            {product.badge}
          </span>
        )}

        {/* Product Image Placeholder / Emoji */}
        <div className="w-full h-32 rounded-xl bg-slate-100 flex items-center justify-center text-4xl mb-4 select-none relative group overflow-hidden border border-slate-200/30">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-pink-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">{product.rating}</span>
              <span className="text-[10px] text-slate-500">({product.reviews})</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{product.name}</h4>
          </div>

          {/* Pricing & Cart Action */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-extrabold text-slate-900">${product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider block">10 Min Delivery</span>
            </div>

            {qty > 0 ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-primary to-accent-violet rounded-xl p-0.5 border border-white/10 shadow-lg shadow-primary/10">
                <button 
                  onClick={() => handleQtyChange(product.id, qty, -1)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="text-xs font-bold text-white px-1">{qty}</span>
                <button 
                  onClick={() => handleQtyChange(product.id, qty, 1)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleAdd(product)}
                className="flex items-center justify-center p-2 rounded-xl bg-slate-950/5 border border-slate-950/10 hover:bg-primary hover:border-transparent text-slate-755 hover:text-white transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title, items, subtitle) => {
    if (items.length === 0) return null;
    return (
      <div className="w-full max-w-7xl mx-auto px-6 mb-12">
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {title}
            <span className="w-1.5 h-1.5 bg-pink-accent rounded-full animate-ping"></span>
          </h3>
          {subtitle && <p className="text-xs text-slate-600 font-semibold">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(renderProductCard)}
        </div>
      </div>
    );
  };

  if (selectedCategory) {
    return (
      <div className="w-full">
        {renderSection(
          selectedCategory, 
          filteredProducts, 
          `Showing items matching "${selectedCategory}"`
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderSection("Personalized for You", recommended, "Based on your purchase history and behavior")}
      {renderSection("Trending Now", trending, "Popular choices in your neighborhood")}
      {renderSection("Hot Deals", deals, "Limited time discounts on top quality items")}
    </div>
  );
}
