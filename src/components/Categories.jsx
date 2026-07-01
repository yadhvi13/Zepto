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
    <div id="categories-section" className="w-full max-w-7xl mx-auto px-6 mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">Browse Categories</h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold">Fresh items delivered in 10 minutes</p>
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

      <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none no-scrollbar py-2">
        {/* All Category Bubble */}
        <button
          onClick={() => handleCategorySelect(null)}
          className="flex flex-col items-center gap-2.5 shrink-0 cursor-pointer group text-center focus:outline-none"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300 shadow-sm ${
            selectedCategory === null
              ? 'bg-gradient-to-tr from-primary to-accent-violet border-transparent text-white ring-4 ring-primary/20 scale-105 shadow-md shadow-primary/10'
              : 'bg-white/80 backdrop-blur border-slate-200 text-slate-700 hover:scale-105 hover:border-slate-350'
          }`}>
            <span className="text-3xl select-none">🔥</span>
          </div>
          <span className={`text-xs font-bold transition-colors ${
            selectedCategory === null ? 'text-primary font-black' : 'text-slate-750'
          }`}>
            All Items
          </span>
        </button>

        {/* Categories from products list */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className="flex flex-col items-center gap-2.5 shrink-0 cursor-pointer group text-center focus:outline-none"
            >
              <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border transition-all duration-300 shadow-sm relative ${
                isSelected
                  ? `border-primary ring-4 ring-primary/20 scale-105 shadow-md shadow-primary/10`
                  : `border-slate-200 hover:scale-105 hover:border-slate-350`
              }`}>
                {/* Real Category Image */}
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover select-none" 
                />
                {/* Semi-transparent gradient overlay color theme */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} mix-blend-multiply opacity-35`} />
              </div>
              <span className={`text-xs font-bold transition-colors ${
                isSelected ? 'text-primary font-black' : 'text-slate-750'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
