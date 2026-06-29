import React, { useState } from 'react';
import { Search, Camera, Mic, ChefHat, Sparkles } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function Hero({ 
  setScannerActive, 
  setCookingActive, 
  setVoiceActive, 
  soundEnabled,
  onSearchRecipe 
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (soundEnabled) sfx.play('click');
    onSearchRecipe(query);
  };

  const handleQuickAction = (action) => {
    if (soundEnabled) sfx.play('click');
    action();
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center text-center overflow-hidden">
      {/* Decorative Blur Blobs inside Hero */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-pink-accent/5 blur-[120px] pointer-events-none"></div>

      {/* Floating Sparkles Badge */}
      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-accent-violet mb-6 animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Next-Gen Smart Delivery Experience</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6 text-slate-900">
        Grocery shopping,{' '}
        <span className="bg-gradient-to-r from-primary via-accent-violet to-pink-accent bg-clip-text text-transparent drop-shadow-sm">
          reimagined with AI
        </span>
      </h1>

      <p className="text-slate-600 text-base md:text-xl font-medium max-w-2xl mb-10 leading-relaxed">
        Deliver in 10 minutes. Scan your fridge, speak your shopping list, or get personalized recipes based on what's in your kitchen.
      </p>

      {/* Main Smart Search Bar */}
      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-3xl glass-panel p-2 rounded-2xl md:rounded-full border border-slate-200/50 shadow-2xl flex flex-col md:flex-row items-center gap-2 mb-12 hover:border-slate-350 transition-colors"
      >
        <div className="flex items-center gap-3 w-full px-4 py-2">
          <Search className="w-5 h-5 text-slate-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Type 'I want Butter Chicken' or what you need..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-500 text-sm md:text-base font-semibold"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end px-2">
          {/* Quick Mic Button */}
          <button 
            type="button"
            onClick={() => handleQuickAction(() => setVoiceActive(true))}
            className="p-3 rounded-full hover:bg-slate-950/5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Voice Search"
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <button 
            type="submit"
            className="w-full md:w-auto bg-gradient-to-r from-primary to-pink-accent hover:opacity-90 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-primary/20 transition-all cursor-pointer text-sm tracking-wide"
          >
            Ask AI
          </button>
        </div>
      </form>

      {/* Smart Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-4">
        {/* Refrigerator Scanner */}
        <div 
          onClick={() => handleQuickAction(() => setScannerActive(true))}
          className="glass-card p-6 rounded-2xl text-left cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-pink-accent" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Fridge Scanner</h3>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed">
              Open camera, detect milk, eggs, or butter, and get alerts for items running low.
            </p>
          </div>
          <span className="text-xs font-bold text-pink-accent mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Try scanning now &rarr;
          </span>
        </div>

        {/* Voice Shopping */}
        <div 
          onClick={() => handleQuickAction(() => setVoiceActive(true))}
          className="glass-card p-6 rounded-2xl text-left cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-accent-violet" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Voice Assistant</h3>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed">
              Speak naturally, e.g. "Buy Maggi, Milk and Bread". AI parses and adds everything instantly.
            </p>
          </div>
          <span className="text-xs font-bold text-accent-violet mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Try speaking &rarr;
          </span>
        </div>

        {/* Instant Kitchen */}
        <div 
          onClick={() => handleQuickAction(() => setCookingActive(true))}
          className="glass-card p-6 rounded-2xl text-left cursor-pointer flex flex-col justify-between group"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ChefHat className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Instant Cooking</h3>
            <p className="text-sm text-slate-600 font-semibold leading-relaxed">
              Input how many minutes you have, and get recipes tailored to ingredients in your fridge.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-500 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Open Kitchen &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
