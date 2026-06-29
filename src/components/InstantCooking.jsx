import React, { useState } from 'react';
import { ChefHat, Clock, AlertCircle, ShoppingCart, Sparkles, Check, Plus } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function InstantCooking({ 
  products, 
  addToCart, 
  soundEnabled, 
  onClose 
}) {
  const [timeLimit, setTimeLimit] = useState(20);
  const [selectedIngredients, setSelectedIngredients] = useState(['p1', 'p2', 'p3', 'p5', 'p13']); // Milk, Eggs, Butter, Tomatoes, Spices
  const [recipes, setRecipes] = useState([]);
  const [searching, setSearching] = useState(false);

  // Available ingredients checklist from products
  const pantryOptions = [
    { id: 'p1', name: 'Whole Milk', emoji: '🥛' },
    { id: 'p2', name: 'Eggs', emoji: '🥚' },
    { id: 'p3', name: 'Butter', emoji: '🧈' },
    { id: 'p5', name: 'Tomatoes', emoji: '🍅' },
    { id: 'p6', name: 'Potatoes', emoji: '🥔' },
    { id: 'p13', name: 'Butter Chicken Spices', emoji: '🌶️' }
  ];

  // Recipe Database
  const recipeDatabase = [
    {
      name: "15-Min Quick Garlic Butter Scrambled Eggs",
      time: 15,
      description: "Creamy, fluffy scrambled eggs cooked in rich salted butter with pantry spices.",
      ingredients: [
        { id: 'p2', qty: '3' }, // Eggs
        { id: 'p3', qty: '20g' }, // Butter
        { id: 'p13', qty: '1 tsp' } // Spices
      ],
      emoji: "🍳"
    },
    {
      name: "20-Min Creamy Tomato Egg Skillet (Shakshuka)",
      time: 20,
      description: "Poached eggs cooked in a simmering savory tomato puree with light butter and garlic spices.",
      ingredients: [
        { id: 'p2', qty: '3' }, // Eggs
        { id: 'p3', qty: '15g' }, // Butter
        { id: 'p5', qty: '250g' }, // Tomatoes
        { id: 'p13', qty: '1 tbsp' } // Spices
      ],
      emoji: "🍅"
    },
    {
      name: "20-Min Express Butter Chicken",
      time: 20,
      description: "A super-fast version of the classic Butter Chicken using pre-cut breast and cream mix.",
      ingredients: [
        { id: 'p11', qty: '500g' }, // Chicken Breast (need to buy)
        { id: 'p3', qty: '50g' }, // Butter
        { id: 'p12', qty: '1 pack' }, // Tomato Cream Mix (need to buy)
        { id: 'p13', qty: '1.5 tbsp' } // Spices
      ],
      emoji: "🥘"
    },
    {
      name: "30-Min Hearty Potato Tomato Bake",
      time: 30,
      description: "Slow-baked sliced potatoes and tomatoes, topped with melted butter glaze and mixed herbs.",
      ingredients: [
        { id: 'p6', qty: '500g' }, // Potatoes
        { id: 'p5', qty: '300g' }, // Tomatoes
        { id: 'p3', qty: '30g' }, // Butter
        { id: 'p13', qty: '1 tbsp' } // Spices
      ],
      emoji: "🥔"
    }
  ];

  const handleToggleIngredient = (id) => {
    if (soundEnabled) sfx.play('hover');
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const handleSearchRecipes = () => {
    if (soundEnabled) sfx.play('refresh');
    setSearching(true);
    setRecipes([]);

    setTimeout(() => {
      // Filter recipes based on time limit and prioritize recipes that have matching ingredients
      const filtered = recipeDatabase.filter(recipe => recipe.time <= timeLimit);
      setRecipes(filtered);
      if (soundEnabled) sfx.play('bubble');
      setSearching(false);
    }, 800);
  };

  const handleAddRecipeMissingItems = (recipe) => {
    // Collect all ingredients that are NOT checked in selectedIngredients
    const missingItems = recipe.ingredients.filter(ing => !selectedIngredients.includes(ing.id));
    
    if (missingItems.length === 0) {
      alert("You already have all the ingredients for this recipe in your kitchen!");
      return;
    }

    if (soundEnabled) sfx.play('payment');
    missingItems.forEach(ing => {
      const match = products.find(p => p.id === ing.id);
      if (match) {
        addToCart(match, 1);
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      {/* Back to shop */}
      <button 
        onClick={() => {
          if (soundEnabled) sfx.play('click');
          onClose();
        }}
        className="text-xs font-bold text-accent-violet hover:underline cursor-pointer mb-6 animate-fade-in"
      >
        &larr; Back to Shop
      </button>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <ChefHat className="w-6 h-6 text-amber-500" />
          AI Instant Kitchen Mode
        </h2>
        <p className="text-sm text-slate-655 font-semibold">
          Tight on time? Select what ingredients you have and your timeframe. AI creates custom recipe listings and updates your cart.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Filters */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Time Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 shadow-md">
            <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Available Time
            </h3>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-black text-slate-900">{timeLimit} mins</span>
              <span className="text-xs text-slate-500 uppercase font-bold">Max cooking limit</span>
            </div>

            <input 
              type="range" 
              min="15" 
              max="45" 
              step="5"
              value={timeLimit} 
              onChange={(e) => {
                if (soundEnabled) sfx.play('hover');
                setTimeLimit(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-2">
              <span>15 MINS</span>
              <span>30 MINS</span>
              <span>45 MINS</span>
            </div>
          </div>

          {/* Fridge Ingredients Checklist */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-200/50 shadow-md">
            <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider mb-4">
              My Available Ingredients
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold">Select items already present in your refrigerator drawer</p>
            
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {pantryOptions.map((item) => {
                const isSelected = selectedIngredients.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleIngredient(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary/20 border-primary/40 text-primary' 
                        : 'bg-slate-950/5 border-slate-950/10 text-slate-600 hover:bg-slate-950/10 hover:text-slate-950'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <button 
              onClick={handleSearchRecipes}
              disabled={searching}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent-violet text-white font-extrabold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50"
            >
              Generate Instant Recipes
            </button>
          </div>
        </div>

        {/* Right column: Recipes */}
        <div className="lg:col-span-8">
          {searching ? (
            <div className="w-full glass-panel rounded-3xl p-12 border border-slate-200/50 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">AI Chef is cooking...</h3>
              <p className="text-xs text-slate-550 font-semibold">Filtering recipes fitting your {timeLimit} minute deadline</p>
            </div>
          ) : recipes.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 rounded-full w-max">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Found {recipes.length} Recipe Recommendations</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map((recipe, idx) => {
                  // Count missing items
                  const missingList = recipe.ingredients.filter(i => !selectedIngredients.includes(i.id));
                  const missingCount = missingList.length;

                  return (
                    <div 
                      key={idx}
                      className="glass-panel rounded-3xl p-6 border border-slate-200/50 flex flex-col justify-between hover:border-slate-300 transition-all shadow-md group relative overflow-hidden"
                    >
                      <div>
                        {/* Upper row */}
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-4xl">{recipe.emoji}</span>
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/5 border border-slate-950/10 text-xs font-bold text-slate-655">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {recipe.time} Mins
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                          {recipe.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-6">
                          {recipe.description}
                        </p>

                        {/* Ingredients audit */}
                        <div className="space-y-2 mb-6">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ingredient Check</span>
                          {recipe.ingredients.map((ing, iIdx) => {
                            const match = products.find(p => p.id === ing.id);
                            const hasItem = selectedIngredients.includes(ing.id);
                            if (!match) return null;
                            return (
                              <div key={iIdx} className="flex items-center justify-between text-xs py-1">
                                <span className="text-slate-700 font-bold">
                                  {match.emoji} {match.name} <span className="text-slate-400 font-normal">({ing.qty})</span>
                                </span>
                                {hasItem ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-550/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                    <Check className="w-2.5 h-2.5" /> In Stock
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                                    <Plus className="w-2.5 h-2.5" /> Buy - ${match.price}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Add missing to cart action */}
                      <button 
                        onClick={() => handleAddRecipeMissingItems(recipe)}
                        className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          missingCount === 0
                            ? 'bg-green-500/10 border border-green-500/20 text-green-600 cursor-not-allowed'
                            : 'bg-slate-950/5 border border-slate-950/10 hover:bg-primary hover:border-transparent text-slate-755 hover:text-white shadow-sm'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {missingCount === 0 ? "You're Ready to Cook!" : `Add ${missingCount} Missing Items to Cart`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="w-full glass-panel rounded-3xl p-16 border border-slate-200/50 flex flex-col items-center justify-center text-center text-slate-500">
              <ChefHat className="w-16 h-16 stroke-[1.2] text-slate-400 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-slate-700">Ready to Cook?</h3>
              <p className="text-xs max-w-sm mt-1 mb-6 text-slate-500 font-semibold">
                Adjust your timeframe slider on the left and select which ingredients you currently own, then hit "Generate Instant Recipes".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
