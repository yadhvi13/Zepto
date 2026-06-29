import React from 'react';
import { categories } from '../utils/products';
import { sfx } from '../utils/sfx';

export default function Categories({ selectedCategory, setSelectedCategory, soundEnabled }) {
  
  const handleCategorySelect = (categoryName) => {
    if (soundEnabled) sfx.play('click');
    if (selectedCategory === categoryName) {
      setSelectedCategory(null); // toggle reset
    } else {
      setSelectedCategory(categoryName);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Browse Categories</h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold">Fresh items delivered in minutes</p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => handleCategorySelect(null)}
            className="text-xs font-bold text-accent-violet hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none no-scrollbar">
        {/* All Category Pill */}
        <button
          onClick={() => handleCategorySelect(null)}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl border text-sm font-bold shrink-0 cursor-pointer transition-all duration-300 ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-primary to-accent-violet border-transparent text-white shadow-lg shadow-primary/20 scale-102'
              : 'bg-slate-950/5 border-slate-950/10 text-slate-750 hover:bg-slate-950/10 hover:text-slate-950'
          }`}
        >
          <span>🔥</span>
          <span>All Items</span>
        </button>

        {/* Categories from products list */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border text-sm font-bold shrink-0 cursor-pointer transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-r from-primary to-pink-accent border-transparent text-white shadow-lg shadow-primary/20 scale-102`
                  : `bg-slate-950/5 border-slate-950/10 text-slate-750 hover:bg-slate-950/10 hover:text-slate-950`
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
