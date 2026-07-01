import React from 'react';
import { ArrowRight, ShoppingBag, Heart, Activity, Baby } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function Hero({ 
  setSelectedCategory,
  soundEnabled 
}) {

  const handleAction = (categoryName) => {
    if (soundEnabled) sfx.play('click');
    if (setSelectedCategory) {
      setSelectedCategory(categoryName);
    }
    
    // Smooth scroll down to categories/products section
    const target = document.getElementById('categories-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 480, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex flex-col gap-6 overflow-hidden">
      {/* Decorative Blur Blobs inside Hero */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-teal-500/5 blur-[120px] pointer-events-none"></div>

      {/* Hero Banner: Stock up on daily essentials */}
      <div 
        onClick={() => handleAction('Fresh')}
        className="w-full rounded-3xl overflow-hidden shadow-xl border border-lime-400/30 hover:border-lime-400/50 flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-10 cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 relative z-10"
        style={{
          backgroundColor: '#d0f050',
          backgroundImage: 'linear-gradient(135deg, #d0f050 0%, #bbdb2d 100%)'
        }}
      >
        {/* Left Section: Content */}
        <div className="w-full md:w-3/5 flex flex-col items-start text-left text-emerald-950 relative z-10">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/10 border border-emerald-950/20 text-[10px] md:text-xs font-black uppercase tracking-wider mb-4 animate-pulse">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-900" />
            <span className="text-emerald-900">Premium Grocery Delivery</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4 font-sans text-emerald-950">
            Stock up on daily essentials
          </h1>
          
          <p className="text-sm md:text-base text-emerald-900/90 font-bold mb-6 max-w-lg leading-relaxed">
            Get farm-fresh goodness &amp; a range of exotic fruits, vegetables, eggs &amp; more delivered directly to your doorstep in minutes.
          </p>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleAction('Fresh');
            }}
            className="flex items-center gap-2 bg-emerald-950 hover:bg-emerald-900 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer text-sm"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Section: Fresh Food Photography */}
        <div className="w-full md:w-2/5 flex justify-center md:justify-end items-center relative z-10">
          <div className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[4/3] group/img">
            {/* Soft Glow Behind Image */}
            <div className="absolute -inset-2 rounded-3xl bg-lime-400/30 blur-[30px] opacity-70 group-hover/img:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/95 bg-white transform rotate-1 group-hover/img:rotate-0 transition-all duration-500">
              <img 
                src="/basket.jpg" 
                alt="Fresh Organic Vegetables & Fruits Basket" 
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700 select-none"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
        
        {/* Card 1: Pharmacy */}
        <div 
          onClick={() => handleAction('Pharmacy')}
          className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-5 text-white flex flex-row items-center justify-between gap-4 cursor-pointer group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-cyan-500/15"
        >
          <div className="flex flex-col items-start text-left flex-grow max-w-[65%]">
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-3.5 border border-white/10">
              <Activity className="w-5 h-5 text-cyan-200" />
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight leading-snug mb-1">Pharmacy at your doorstep!</h3>
            <p className="text-xs text-cyan-100 font-semibold mb-4 leading-normal">Cough syrups, pain relief sprays &amp; more</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAction('Pharmacy');
              }}
              className="bg-white text-teal-700 hover:bg-teal-50 font-extrabold text-[10px] md:text-xs px-3.5 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm cursor-pointer"
            >
              Order Now
            </button>
          </div>
          <div className="w-[35%] aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-white/95 shrink-0 rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-white">
            <img 
              src="/pharmacy.png" 
              alt="Pharmacy Products" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Card 2: Pet Care */}
        <div 
          onClick={() => handleAction('Pet Care')}
          className="bg-gradient-to-br from-amber-500 via-amber-500 to-orange-500 rounded-2xl p-5 text-white flex flex-row items-center justify-between gap-4 cursor-pointer group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-400/15"
        >
          <div className="flex flex-col items-start text-left flex-grow max-w-[65%]">
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-3.5 border border-white/10">
              <Heart className="w-5 h-5 text-amber-100" />
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight leading-snug mb-1">Pet care supplies at your door</h3>
            <p className="text-xs text-amber-50 font-semibold mb-4 leading-normal">Food, treats, toys &amp; more</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAction('Pet Care');
              }}
              className="bg-white text-orange-700 hover:bg-amber-50 font-extrabold text-[10px] md:text-xs px-3.5 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm cursor-pointer"
            >
              Order Now
            </button>
          </div>
          <div className="w-[35%] aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-white/95 shrink-0 -rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-white">
            <img 
              src="/petcare.png" 
              alt="Pet Supplies" 
              className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Card 3: Baby Care */}
        <div 
          onClick={() => handleAction('Baby Care')}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white flex flex-row items-center justify-between gap-4 cursor-pointer group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-400/15"
        >
          <div className="flex flex-col items-start text-left flex-grow max-w-[65%]">
            <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center mb-3.5 border border-white/10">
              <Baby className="w-5 h-5 text-blue-200" />
            </div>
            <h3 className="text-base md:text-lg font-black tracking-tight leading-snug mb-1">No time for a diaper run?</h3>
            <p className="text-xs text-blue-50 font-semibold mb-4 leading-normal">Get baby care essentials</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAction('Baby Care');
              }}
              className="bg-white text-indigo-700 hover:bg-blue-50 font-extrabold text-[10px] md:text-xs px-3.5 py-2 rounded-lg transition-transform hover:scale-105 shadow-sm cursor-pointer"
            >
              Order Now
            </button>
          </div>
          <div className="w-[35%] aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-white/95 shrink-0 rotate-2 group-hover:rotate-0 transition-transform duration-300 bg-white">
            <img 
              src="/babycare.png" 
              alt="Baby Care Essentials" 
              className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
