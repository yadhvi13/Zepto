import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, ShoppingCart, Sparkles, Check, Plus, Minus, Search, Trash2, X } from 'lucide-react';
import { sfx } from '../utils/sfx';

const recentlyUsed = [
  { name: 'Milk', emoji: '🥛' },
  { name: 'Eggs', emoji: '🥚' },
  { name: 'Tomato', emoji: '🍅' },
  { name: 'Onion', emoji: '🧅' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Green Chilli', emoji: '🌶' },
  { name: 'Salt', emoji: '🧂' },
  { name: 'Oil', emoji: '🫒' }
];

const recipeDatabase = [
  {
    id: "r1",
    name: "Classic Masala Egg Bhurji (Scrambled Eggs)",
    time: 15,
    emoji: "🍳",
    description: "Spicy Indian style scrambled eggs cooked with diced onions, tomatoes, garlic, and fresh green chilies.",
    ingredients: [
      { name: "Eggs", emoji: "🥚", qty: "3 units" },
      { name: "Tomato", emoji: "🍅", qty: "1 medium" },
      { name: "Onion", emoji: "🧅", qty: "1 medium" },
      { name: "Garlic", emoji: "🧄", qty: "2 cloves" },
      { name: "Green Chilli", emoji: "🌶", qty: "1 unit" },
      { name: "Salt", emoji: "🧂", qty: "1 pinch" },
      { name: "Oil", emoji: "🫒", qty: "1 tbsp" }
    ]
  },
  {
    id: "r2",
    name: "Express French Omelette",
    time: 10,
    emoji: "🍳",
    description: "Fluffy and buttery French style omelette seasoned simply with salt.",
    ingredients: [
      { name: "Eggs", emoji: "🥚", qty: "2 units" },
      { name: "Butter", emoji: "🧈", qty: "15 g" },
      { name: "Salt", emoji: "🧂", qty: "1 pinch" }
    ]
  },
  {
    id: "r3",
    name: "Spiced Tomato Onion Salad (Kachumber)",
    time: 5,
    emoji: "🥗",
    description: "A super refreshing crunchy side salad dressed with green chillies, oil, and salt.",
    ingredients: [
      { name: "Tomato", emoji: "🍅", qty: "2 units" },
      { name: "Onion", emoji: "🧅", qty: "1 unit" },
      { name: "Green Chilli", emoji: "🌶", qty: "1 unit" },
      { name: "Salt", emoji: "🧂", qty: "to taste" },
      { name: "Oil", emoji: "🫒", qty: "1 tsp" }
    ]
  },
  {
    id: "r4",
    name: "Creamy Garlic Milk Mash",
    time: 20,
    emoji: "🥔",
    description: "Rich potato mash cooked in fresh milk with butter, garlic cloves, and salt.",
    ingredients: [
      { name: "Milk", emoji: "🥛", qty: "100 ml" },
      { name: "Butter", emoji: "🧈", qty: "20 g" },
      { name: "Garlic", emoji: "🧄", qty: "3 cloves" },
      { name: "Salt", emoji: "🧂", qty: "1/2 tsp" }
    ]
  },
  {
    id: "r5",
    name: "Gourmet French Toast",
    time: 15,
    emoji: "🍞",
    description: "Pan-fried egg-soaked white bread slices fried in butter, served with sliced bananas.",
    ingredients: [
      { name: "Eggs", emoji: "🥚", qty: "2 units" },
      { name: "Milk", emoji: "🥛", qty: "50 ml" },
      { name: "Bread", emoji: "🍞", qty: "3 slices" },
      { name: "Butter", emoji: "🧈", qty: "20 g" }
    ]
  },
  {
    id: "r6",
    name: "Fresh Strawberry Milkshake",
    time: 10,
    emoji: "🍓",
    description: "A creamy and sweet classic strawberry milkshake made with fresh strawberries and milk.",
    ingredients: [
      { name: "Strawberry", emoji: "🍓", qty: "100 g" },
      { name: "Milk", emoji: "🥛", qty: "250 ml" }
    ]
  },
  {
    id: "r7",
    name: "Strawberry Banana Yogurt Smoothie",
    time: 15,
    emoji: "🥣",
    description: "Thick and healthy breakfast smoothie bowl with fresh strawberries, banana wheels, yogurt, and milk.",
    ingredients: [
      { name: "Strawberry", emoji: "🍓", qty: "150 g" },
      { name: "Banana", emoji: "🍌", qty: "1 unit" },
      { name: "Milk", emoji: "🥛", qty: "100 ml" },
      { name: "Yogurt", emoji: "🥣", qty: "150 g" }
    ]
  },
  {
    id: "r8",
    name: "Strawberry Spinach Salad",
    time: 10,
    emoji: "🥗",
    description: "Fresh spinach leaves and sweet sliced strawberries tossed with olive oil and a pinch of salt.",
    ingredients: [
      { name: "Strawberry", emoji: "🍓", qty: "100 g" },
      { name: "Spinach", emoji: "🥬", qty: "100 g" },
      { name: "Oil", emoji: "🫒", qty: "1 tbsp" },
      { name: "Salt", emoji: "🧂", qty: "1 pinch" }
    ]
  }
];

export default function InstantCooking({ 
  products = [], 
  addToCart, 
  soundEnabled, 
  onClose 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([
    { name: 'Milk', emoji: '🥛' },
    { name: 'Eggs', emoji: '🥚' },
    { name: 'Tomato', emoji: '🍅' }
  ]);
  const [recipes, setRecipes] = useState([]);
  const [searching, setSearching] = useState(false);

  // Play Sound helper
  const playSound = (type) => {
    if (soundEnabled) sfx.play(type);
  };

  // Maps custom ingredient names to emojis dynamically
  const getIngredientEmoji = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('milk')) return '🥛';
    if (lower.includes('egg')) return '🥚';
    if (lower.includes('tomato')) return '🍅';
    if (lower.includes('onion')) return '🧅';
    if (lower.includes('garlic')) return '🧄';
    if (lower.includes('chilli') || lower.includes('chili') || lower.includes('pepper')) return '🌶';
    if (lower.includes('salt')) return '🧂';
    if (lower.includes('oil')) return '🫒';
    if (lower.includes('butter')) return '🧈';
    if (lower.includes('bread') || lower.includes('toast')) return '🍞';
    if (lower.includes('potato')) return '🥔';
    if (lower.includes('banana')) return '🍌';
    if (lower.includes('strawberry')) return '🍓';
    if (lower.includes('yogurt')) return '🥣';
    if (lower.includes('cashew')) return '🥜';
    if (lower.includes('cheese') || lower.includes('paneer')) return '🧀';
    return '🌱';
  };

  // Find actual store product mapping to sync with cart
  const getStoreProduct = (ingName) => {
    const lower = ingName.toLowerCase();
    
    // Explicit mappings for common recipe ingredients
    if (lower.includes('milk')) {
      return products.find(p => p.id === 'p28') || 
             products.find(p => p.name.toLowerCase().includes('toned milk')) ||
             products.find(p => p.name.toLowerCase().includes('whole milk')) ||
             products.find(p => p.name.toLowerCase().includes('milk'));
    }
    if (lower.includes('egg')) {
      return products.find(p => p.id === 'p31') || 
             products.find(p => p.name.toLowerCase().includes('egg'));
    }
    if (lower.includes('tomato')) {
      return products.find(p => p.id === 'p26') || 
             products.find(p => p.name.toLowerCase().includes('tomato'));
    }
    if (lower.includes('butter')) {
      return products.find(p => p.id === 'p30') || 
             products.find(p => p.name.toLowerCase().includes('butter'));
    }
    if (lower.includes('bread') || lower.includes('toast')) {
      return products.find(p => p.id === 'p29') || 
             products.find(p => p.name.toLowerCase().includes('bread'));
    }
    if (lower.includes('yogurt')) {
      return products.find(p => p.id === 'p32') || 
             products.find(p => p.name.toLowerCase().includes('yogurt'));
    }
    if (lower.includes('cashew')) {
      return products.find(p => p.id === 'p40') || 
             products.find(p => p.name.toLowerCase().includes('cashew'));
    }
    if (lower.includes('cookie')) {
      return products.find(p => p.id === 'p38') || 
             products.find(p => p.name.toLowerCase().includes('cookie'));
    }
    if (lower.includes('strawberry') || lower.includes('strawberries')) {
      return products.find(p => p.id === 'p8') || 
             products.find(p => p.name.toLowerCase().includes('strawberry'));
    }
    if (lower.includes('banana') || lower.includes('bananas')) {
      return products.find(p => p.id === 'p25') || 
             products.find(p => p.name.toLowerCase().includes('banana'));
    }
    if (lower.includes('spinach')) {
      return products.find(p => p.id === 'p10') || 
             products.find(p => p.name.toLowerCase().includes('spinach'));
    }
    if (lower === 'salt' || lower.includes('salt')) {
      return products.find(p => p.id === 'p309') ||
             products.find(p => p.name.toLowerCase().includes('tata salt')) ||
             products.find(p => p.name.toLowerCase().includes('table salt')) ||
             products.find(p => p.name.toLowerCase().includes('iodized salt')) ||
             products.find(p => p.name.toLowerCase().includes('salt') && 
                            !p.name.toLowerCase().includes('popcorn') && 
                            !p.name.toLowerCase().includes('peanut') && 
                            !p.name.toLowerCase().includes('chip') && 
                            !p.name.toLowerCase().includes('butter'));
    }
    if (lower === 'oil' || lower.includes('oil')) {
      return products.find(p => p.id === 'p310') ||
             products.find(p => p.name.toLowerCase().includes('refined oil')) ||
             products.find(p => p.name.toLowerCase().includes('mustard oil')) ||
             products.find(p => p.name.toLowerCase().includes('cooking oil')) ||
             products.find(p => p.name.toLowerCase().includes('olive oil')) ||
             products.find(p => p.name.toLowerCase().includes('oil') && 
                            !p.name.toLowerCase().includes('toilet') && 
                            !p.name.toLowerCase().includes('baby oil') && 
                            !p.name.toLowerCase().includes('hair oil'));
    }
    
    // Generic match
    return products.find(p => p.name.toLowerCase().includes(lower) && !p.name.toLowerCase().includes('toilet'));
  };

  // Handle adding custom ingredient
  const handleAddIngredient = (nameString) => {
    const cleanName = nameString.trim();
    if (!cleanName) return;

    // Avoid duplicates
    if (selectedIngredients.some(x => x.name.toLowerCase() === cleanName.toLowerCase())) {
      playSound('remove');
      return;
    }

    const newIng = {
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      emoji: getIngredientEmoji(cleanName)
    };

    setSelectedIngredients(prev => [...prev, newIng]);
    setSearchQuery('');
    playSound('add');
  };

  // Toggle ingredient selection
  const handleToggleIngredient = (item) => {
    const isSelected = selectedIngredients.some(x => x.name.toLowerCase() === item.name.toLowerCase());
    if (isSelected) {
      setSelectedIngredients(prev => prev.filter(x => x.name.toLowerCase() !== item.name.toLowerCase()));
      playSound('remove');
    } else {
      setSelectedIngredients(prev => [...prev, { name: item.name, emoji: item.emoji }]);
      playSound('add');
    }
  };

  // Remove a selected chip
  const handleRemoveChip = (name) => {
    setSelectedIngredients(prev => prev.filter(x => x.name.toLowerCase() !== name.toLowerCase()));
    playSound('remove');
  };

  // Generate recipes based on selected ingredients
  const handleGenerateRecipes = () => {
    if (selectedIngredients.length === 0) {
      playSound('remove');
      return;
    }

    playSound('refresh');
    setSearching(true);
    setRecipes([]);

    setTimeout(() => {
      // Score and rank recipes by the number of matching ingredients
      const scored = recipeDatabase.map(recipe => {
        const matching = recipe.ingredients.filter(ing => 
          selectedIngredients.some(sel => sel.name.toLowerCase() === ing.name.toLowerCase())
        );
        const missing = recipe.ingredients.filter(ing => 
          !selectedIngredients.some(sel => sel.name.toLowerCase() === ing.name.toLowerCase())
        );
        const matchPercentage = Math.round((matching.length / recipe.ingredients.length) * 100);
        return {
          ...recipe,
          matching,
          missing,
          matchPercentage
        };
      })
      .filter(r => r.matching.length > 0) // Only return recipes that match at least 1 ingredient
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort by highest matching rate

      setRecipes(scored);
      playSound('bubble');
      setSearching(false);
    }, 800);
  };

  // Add missing ingredients to cart
  const handleAddMissingItems = (recipe) => {
    const missingItems = recipe.missing;
    if (missingItems.length === 0) return;

    playSound('payment');
    missingItems.forEach(ing => {
      const match = getStoreProduct(ing.name);
      if (match) {
        addToCart(match, 1);
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in select-none">
      
      {/* Back to shop */}
      <button 
        onClick={() => {
          playSound('click');
          onClose();
        }}
        className="text-xs font-bold text-accent-violet hover:underline cursor-pointer mb-6"
      >
        &larr; Back to Shop
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <ChefHat className="w-7 h-7 text-amber-500" />
          AI Instant Kitchen Mode
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
          Tell AI what ingredients you have, search ingredients manually, or choose from recently used. We'll instantly match recipes and add missing items directly to your cart.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input, Selected, and Recently Used (Mobile-first full, desktop 5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Ingredients Input & Search Panel */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/50 shadow-md flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider">
              Add Kitchen Ingredients
            </h3>

            {/* Search + Add input row */}
            <div className="flex gap-2 w-full">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search ingredients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddIngredient(searchQuery);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
              <button
                onClick={() => handleAddIngredient(searchQuery)}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md shadow-purple-600/10 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shrink-0"
              >
                + Add ingredient
              </button>
            </div>

            {/* Selected Ingredient Chips */}
            {selectedIngredients.length > 0 && (
              <div className="space-y-2 mt-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Selected Ingredients</span>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1">
                  {selectedIngredients.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 font-extrabold text-xs"
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                      <button 
                        onClick={() => handleRemoveChip(item.name)}
                        className="p-0.5 hover:bg-purple-100 rounded-full cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5 text-purple-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateRecipes}
              disabled={selectedIngredients.length === 0 || searching}
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent-violet text-white font-extrabold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50 select-none"
            >
              Generate Recipes
            </button>
          </div>

          {/* RECENTLY USED SECTION */}
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200/50 shadow-md">
            <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
              Recently Used
            </h3>
            <span className="text-[10px] text-slate-400 font-bold block mb-4 border-b border-slate-100 pb-2">
              Quick-select pantry ingredients
            </span>

            <div className="grid grid-cols-2 gap-2">
              {recentlyUsed.map((item) => {
                const isSelected = selectedIngredients.some(x => x.name.toLowerCase() === item.name.toLowerCase());
                return (
                  <button
                    key={item.name}
                    onClick={() => handleToggleIngredient(item)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-purple-100/60 border-purple-200 text-purple-700 font-black scale-[0.98]' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Matching Recipe Results (Mobile-first full, desktop 7 columns) */}
        <div className="lg:col-span-7">
          {searching ? (
            <div className="w-full glass-panel rounded-3xl p-12 border border-slate-200/50 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-100 rounded-full animate-spin mb-4"></div>
              <h3 className="text-base font-bold text-slate-900 mb-1">AI Chef is cooking...</h3>
              <p className="text-xs text-slate-400 font-bold">Matching instructions against your available kitchen items</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="space-y-6">
              
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-100 text-xs font-bold text-purple-700 rounded-full w-max shadow-sm">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Found {recipes.length} Matching Recipes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map((recipe) => {
                  const missingCount = recipe.missing.length;
                  return (
                    <div 
                      key={recipe.id}
                      className="glass-panel rounded-3xl p-5 border border-slate-200/50 flex flex-col justify-between hover:border-slate-350 hover:shadow-xl transition-all duration-300 shadow-md group relative overflow-hidden"
                    >
                      <div>
                        {/* Emoji & Time */}
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-4xl p-1.5 bg-slate-50 border border-slate-100 rounded-2xl block">{recipe.emoji}</span>
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/5 border border-slate-950/10 text-[10px] font-black text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-purple-600" />
                            {recipe.time} Mins
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm md:text-base font-black text-slate-900 mb-2 leading-tight group-hover:text-purple-600 transition-colors">
                          {recipe.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">
                          {recipe.description}
                        </p>

                        {/* Ingredients check */}
                        <div className="space-y-2 border-t border-slate-50 pt-3 mb-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Ingredients check</span>
                          
                          <div className="space-y-1.5">
                            {recipe.ingredients.map((ing, iIdx) => {
                              const match = getStoreProduct(ing.name);
                              const hasItem = selectedIngredients.some(sel => sel.name.toLowerCase() === ing.name.toLowerCase());
                              return (
                                <div key={iIdx} className="flex items-center justify-between text-xs py-0.5">
                                  <span className="text-slate-700 font-bold">
                                    {ing.emoji} {ing.name} <span className="text-slate-400 font-normal font-sans">({ing.qty})</span>
                                  </span>
                                  {hasItem ? (
                                    <span className="flex items-center gap-1 text-[9px] font-black text-green-600 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                      In Stock
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[9px] font-black text-purple-600 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                                      + Buy ₹{match ? match.price : "30"}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Add missing to cart action */}
                      <button 
                        onClick={() => handleAddMissingItems(recipe)}
                        className={`w-full py-3 mt-4 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 select-none uppercase tracking-wider ${
                          missingCount === 0
                            ? 'bg-green-50 border border-green-150 text-green-600 cursor-not-allowed shadow-none'
                            : 'bg-slate-950/5 border border-slate-950/10 hover:bg-purple-600 hover:border-transparent text-slate-700 hover:text-white shadow-sm'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 animate-pulse" />
                        {missingCount === 0 ? "Ready to Cook!" : `Add ${missingCount} items to cart`}
                      </button>

                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full glass-panel rounded-3xl p-16 border border-slate-200/50 flex flex-col items-center justify-center text-center text-slate-500 shadow-sm">
              <ChefHat className="w-16 h-16 stroke-[1.2] text-slate-350 mb-4 animate-bounce" />
              <h3 className="text-base font-extrabold text-slate-800">No Recipes Recommended Yet</h3>
              <p className="text-xs max-w-sm mt-1 mb-6 text-slate-400 font-bold leading-normal">
                Add ingredients using the search bar or choose from the recently used panel on the left, then click "Generate Recipes" to discover dishes.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
