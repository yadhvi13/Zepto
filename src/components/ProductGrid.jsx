import React, { useState, useEffect, useRef } from 'react';
import { Star, Plus, Minus, Clock } from 'lucide-react';
import { sfx } from '../utils/sfx';

// 1. Shimmer/Skeleton Card component
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col justify-between h-72 animate-pulse shadow-sm">
      <div>
        <div className="w-full h-32 bg-slate-200 rounded-xl mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
      </div>
    </div>
  );
}

// 2. LazyImage Component with placeholder and fade-in effect
function LazyImage({ src, alt, className }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    let observer;
    if (imgRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = src;
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      observer.observe(imgRef.current);
    }
    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src]);

  return (
    <div className="relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden rounded-2xl">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse flex items-center justify-center text-slate-300">
          <span className="text-xs font-semibold">Loading...</span>
        </div>
      )}
      <img
        ref={imgRef}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-500 rounded-2xl ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default function ProductGrid({
  products,
  selectedCategory,
  cart,
  addToCart,
  updateQuantity,
  soundEnabled,
  searchQuery,
  setSearchQuery
}) {
  // Subcategory management state
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  // Pagination / Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(8);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const loadMoreRef = useRef(null);

  // Sound handlers
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
    const item = cart.find((c) => c.id === productId);
    return item ? item.quantity : 0;
  };

  // Reset pagination and active subcategory when selected category changes
  useEffect(() => {
    setActiveSubcategory(null);
    setVisibleCount(8);
    setIsMoreLoading(false);
  }, [selectedCategory]);

  // Extract products in active category
  const categoryProducts = products.filter((p) =>
    selectedCategory ? p.category === selectedCategory : true
  );

  // Extract subcategories dynamically
  const subcategories = Array.from(
    new Set(categoryProducts.map((p) => p.subcategory).filter(Boolean))
  );

  // Set default active subcategory or reset if switching categories
  useEffect(() => {
    if (subcategories.length > 0) {
      if (!activeSubcategory || !subcategories.includes(activeSubcategory)) {
        setActiveSubcategory(subcategories[0]);
      }
    } else {
      setActiveSubcategory(null);
    }
  }, [selectedCategory, subcategories, activeSubcategory]);

  // Filtered Products based on:
  // - Category (main)
  // - Subcategory (if main category selected)
  // - Search query (if user typed)
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSubcategory =
      selectedCategory && activeSubcategory ? p.subcategory === activeSubcategory : true;
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    let observer;
    if (loadMoreRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && !isMoreLoading && visibleCount < filteredProducts.length) {
            setIsMoreLoading(true);
            // Simulate natural delay for network loading and Skeleton UI presentation
            setTimeout(() => {
              setVisibleCount((prev) => prev + 6);
              setIsMoreLoading(false);
            }, 800);
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (observer && loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef.current, isMoreLoading, visibleCount, filteredProducts.length]);

  const renderProductCard = (product) => {
    const qty = getCartQty(product.id);
    return (
      <div
        key={product.id}
        onMouseEnter={handleHover}
        className="bg-white rounded-2xl p-2.5 sm:p-4 flex flex-col justify-between h-[270px] sm:h-[340px] relative border border-slate-100 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
      >
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-600 text-white z-10 shadow-sm">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Product Image via LazyImage */}
        <div className="w-full h-20 sm:h-36 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl mb-2 sm:mb-3 select-none relative group overflow-hidden border border-slate-100">
          <LazyImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1 sm:p-2 select-none group-hover:scale-105 transition-transform duration-300 rounded-2xl"
          />
        </div>

        {/* Info */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            {/* Delivery time badge */}
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-[#0c831f] mb-1">
              <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-[#0c831f]/10 text-[#0c831f]" />
              <span>15 MINS</span>
            </div>

            {/* Product Name */}
            <h4 className="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-800 leading-tight line-clamp-2 mb-0.5">
              {product.name}
            </h4>

            {/* Weight/Quantity text */}
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold block mb-1">
              {product.weight || "1 unit"}
            </span>
          </div>

          {/* Pricing & Cart Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mt-2 pt-2 border-t border-slate-100">
            <div>
              <div className="flex flex-wrap items-baseline gap-1">
                <span className="text-xs sm:text-sm font-black text-slate-900">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Premium ADD/Inc-Dec buttons */}
            <div className="flex justify-end w-full sm:w-auto">
              {qty > 0 ? (
                <div className="flex items-center justify-between w-full sm:w-[80px] bg-[#0c831f] text-white rounded-lg px-2 py-1 shadow-md shadow-success-green/10 font-black text-[10px] sm:text-xs transition-all select-none">
                  <button
                    onClick={() => handleQtyChange(product.id, qty, -1)}
                    className="hover:scale-125 active:scale-95 transition-transform cursor-pointer font-black text-xs sm:text-sm px-1.5"
                  >
                    -
                  </button>
                  <span className="font-extrabold">{qty}</span>
                  <button
                    onClick={() => handleQtyChange(product.id, qty, 1)}
                    className="hover:scale-125 active:scale-95 transition-transform cursor-pointer font-black text-xs sm:text-sm px-1.5"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAdd(product)}
                  className="w-full sm:w-auto px-3 sm:px-5 py-1 rounded-lg border border-[#0c831f] bg-white text-[#0c831f] font-extrabold text-[10px] sm:text-xs hover:bg-[#0c831f]/5 transition-colors cursor-pointer uppercase shadow-sm select-none"
                >
                  ADD
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper mapping subcategory names to emojis
  const getSubcategoryEmoji = (sub) => {
    const map = {
      Fruits: "🍎",
      Vegetables: "🥦",
      "Coffee & Tea": "☕",
      "Bakery & Breads": "🥐",
      "Dairy & Milk": "🥛",
      "Wellness & Health": "🏥",
      "First Aid & Pain Relief": "🩹",
      "Over The Counter Medicines": "💊",
      "Chips & Crisps": "🥔",
      "Biscuits & Cookies": "🍪",
      "Nuts & Dry Fruits": "🥜",
      "Home Decor & Fragrance": "🕯️",
      "Cleaning Tools": "🧹",
      "Cleaning Liquids": "🧼",
      "Hygiene & Handwash": "🧴",
      "Plush Toys": "🧸",
      "Puzzles & Games": "🎲",
      "Chargers & Cables": "🔌",
      "Audio & Headphones": "🎧",
      "Batteries & Power": "🔋",
      "Mobile Cases": "📱",
      "Screen Guards": "💎",
      "Car Accessories": "🚗",
      "Skin Care": "🧴",
      "Lip Care": "💄",
      "Face Care": "🧼",
      "T-Shirts": "👕",
      Socks: "🧦",
      "Caps & Hats": "🧢",
      "Diverse Pet Food": "🥣",
      "Dog Needs": "🐕",
      "Pet Grooming": "🧼",
      "Accessories & Other Supplies": "🎾",
      "Cat Needs": "🐱",
      "Diapers & More": "👶",
      "Bathing Needs": "🛁",
      "Baby Wipes": "🧻",
      "Baby Food": "🥣",
      Chocolates: "🍫",
      "Indian Sweets": "🥮",
      "Chocolate Gift Pack": "🎁",
      "Ice Cream & Frozen Dessert": "🍦"
    };
    return map[sub] || "🏷️";
  };

  // Render for single sections (e.g. deals/trending on landing page)
  const renderLandingSection = (title, items, subtitle) => {
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
          {items.slice(0, 10).map(renderProductCard)}
        </div>
      </div>
    );
  };

  // IF CATEGORY IS SELECTED -> TWO-COLUMN SIDEBAR BROWSE VIEW
  if (selectedCategory) {
    const visibleProducts = filteredProducts.slice(0, visibleCount);

    return (
      <div className="w-full max-w-7xl mx-auto px-6 mb-16">
        {/* Main Browse Header */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            {selectedCategory}
            <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-md">
              {filteredProducts.length} Products Available
            </span>
          </h2>
        </div>

        {/* Horizontal scrollbar subcategories for mobile/tablet */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-3 mb-4 w-full no-scrollbar scrollbar-none">
          {subcategories.map((sub) => {
            const isActive = activeSubcategory === sub;
            return (
              <button
                key={sub}
                onClick={() => {
                  if (soundEnabled) sfx.play('click');
                  setActiveSubcategory(sub);
                  setVisibleCount(8);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black shrink-0 transition-all select-none border ${
                  isActive
                    ? "bg-[#0c831f] border-transparent text-white shadow-sm"
                    : "bg-white border-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{getSubcategoryEmoji(sub)}</span>
                <span>{sub}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: Subcategories (Vertical panel) - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex md:flex-col w-56 lg:w-64 shrink-0 bg-white/80 backdrop-blur rounded-2xl border border-slate-100 p-3 sticky top-24 shadow-sm gap-1 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar scrollbar-none">
            {subcategories.map((sub) => {
              const isActive = activeSubcategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => {
                    if (soundEnabled) sfx.play('click');
                    setActiveSubcategory(sub);
                    setVisibleCount(8);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl transition-all duration-300 group focus:outline-none relative ${
                    isActive
                      ? "bg-[#0c831f]/10 text-[#0c831f] font-black"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold"
                  }`}
                >
                  {/* Left green active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0c831f] rounded-r-md"></div>
                  )}
                  <span className="text-lg">{getSubcategoryEmoji(sub)}</span>
                  <span className="text-xs leading-tight">{sub}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL: Product Grid with Infinite Scroll */}
          <div className="flex-grow w-full">
            {filteredProducts.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {visibleProducts.map(renderProductCard)}

                  {/* Render pulsing skeletons during infinite scroll */}
                  {isMoreLoading &&
                    Array.from({ length: 4 }).map((_, idx) => <SkeletonCard key={idx} />)}
                </div>

                {/* Target marker for infinite scroll */}
                {visibleCount < filteredProducts.length && (
                  <div
                    ref={loadMoreRef}
                    className="w-full py-8 flex items-center justify-center"
                  >
                    {!isMoreLoading && (
                      <div className="w-6 h-6 border-2 border-t-[#0c831f] border-slate-100 rounded-full animate-spin"></div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full text-center py-16 bg-white/60 backdrop-blur rounded-3xl border border-slate-100 shadow-sm">
                <span className="text-4xl mb-4 block">📦</span>
                <h3 className="text-base font-extrabold text-slate-800 mb-1">
                  No items under this subcategory
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  We are restocking items for this subcategory shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // IF SEARCH QUERY IS PRESENT -> NORMAL SEARCH GRID VIEW
  if (searchQuery) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 mb-12">
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900">
            Search Results for "{searchQuery}"
            <span className="text-xs text-slate-500 font-bold ml-2">
              ({filteredProducts.length} items found)
            </span>
          </h3>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredProducts.map(renderProductCard)}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto text-center py-16 px-6 glass-card rounded-3xl border border-slate-200/50 my-8">
            <span className="text-4xl mb-4 block select-none">🔍</span>
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">No products found</h3>
            <p className="text-xs text-slate-500 font-semibold mb-6">
              We couldn't find anything matching "{searchQuery}". Try searching for milk, eggs, or butter.
            </p>
            <button
              onClick={() => {
                if (soundEnabled) sfx.play('click');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-pink-accent hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT LANDING PAGE: CATEGORIZED LISTS
  const deals = products.filter((p) => p.originalPrice > p.price && p.category !== "Pantry");
  const trending = products.filter((p) => p.rating >= 4.8 && p.category !== "Pantry");
  const recommended = products.filter((p) => p.reviews > 100 && p.category !== "Pantry");

  return (
    <div className="w-full">
      {renderLandingSection(
        "Personalized for You",
        recommended,
        "Based on your purchase history and behavior"
      )}
      {renderLandingSection("Trending Now", trending, "Popular choices in your neighborhood")}
      {renderLandingSection("Hot Deals", deals, "Limited time discounts on top quality items")}
    </div>
  );
}
