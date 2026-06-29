import React from 'react';
import { Search, Camera, Mic, ChefHat, Sparkles } from 'lucide-react';
import { sfx } from '../utils/sfx';
import vectorImage from '../assets/vector.jpg';

export default function Hero({ 
  setScannerActive, 
  setCookingActive, 
  setVoiceActive, 
  soundEnabled,
  onSearchRecipe,
  searchQuery,
  setSearchQuery
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    if (soundEnabled) sfx.play('click');
    onSearchRecipe(searchQuery);
  };

  const handleQuickAction = (action) => {
    if (soundEnabled) sfx.play('click');
    action();
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-6 md:py-10 flex flex-col items-center overflow-hidden">
      {/* Decorative Blur Blobs inside Hero */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-pink-accent/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 mb-12 relative z-10">
        {/* Left Column: Sparkles Badge and Ask AI Search Bar */}
        <div className="w-full lg:w-3/5 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Floating Sparkles Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-semibold text-accent-violet mb-6 w-fit animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Smart Delivery Experience</span>
          </div>

          {/* Main Smart Search Bar */}
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-xl glass-panel p-2 rounded-2xl md:rounded-full border border-slate-200/50 shadow-2xl flex flex-col md:flex-row items-center gap-2 hover:border-slate-350 transition-colors"
          >
            <div className="flex items-center gap-3 w-full px-4 py-2">
              <Search className="w-5 h-5 text-slate-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Type 'I want Butter Chicken' or what you need..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        </div>

        {/* Right Column: Smaller Beautified Vector Image */}
        <div className="w-full lg:w-2/5 flex justify-center lg:justify-end items-center relative z-10">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/3] group">
            {/* Glowing backlights */}
            <div className="absolute -inset-4 rounded-full bg-primary/10 blur-[50px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -inset-6 rounded-full bg-pink-500/5 blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

            {/* Decorative border blur */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-pink-accent/20 rounded-3xl p-1 -m-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-[1px]"></div>

            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 group-hover:scale-102 transition-transform duration-500 bg-white">
              <img 
                src={vectorImage} 
                alt="Zepto Smart Delivery Illustration" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
              />
            </div>
          </div>
        </div>
      </div>

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
