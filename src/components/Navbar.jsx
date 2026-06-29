import React, { useState } from 'react';
import { ShoppingCart, Camera, Mic, Zap, Users, Volume2, VolumeX, User, LogOut } from 'lucide-react';
import { sfx } from '../utils/sfx';
import zeptoLogo from '../assets/zepto.png';

export default function Navbar({ 
  cart, 
  setCartOpen, 
  setScannerActive, 
  setCookingActive, 
  voiceActive, 
  setVoiceActive,
  soundEnabled,
  setSoundEnabled,
  userPhone,
  onLogout,
  searchQuery,
  setSearchQuery,
  handleSearchRecipe
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleNavClick = (action) => {
    if (soundEnabled) sfx.play('click');
    action();
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div 
        onClick={() => handleNavClick(() => {
          setScannerActive(false);
          setCookingActive(false);
        })} 
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center bg-white border border-slate-100 p-1.5">
          <img src={zeptoLogo} alt="Zepto Logo" className="w-full h-full object-contain" />
        </div>
        <div className="hidden sm:block text-left">
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-primary to-pink-accent bg-clip-text text-transparent">
            zepto<span className="text-primary font-black">AI</span>
          </span>
          <span className="block text-[9px] text-accent-violet tracking-widest uppercase font-semibold">Instant & Smart</span>
        </div>
      </div>

      {/* Search Bar in Navbar */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (soundEnabled) sfx.play('click');
          handleSearchRecipe(searchQuery);
        }}
        className="flex-grow max-w-xs md:max-w-sm lg:max-w-md mx-2 md:mx-6 relative"
      >
        <div className="relative flex items-center bg-slate-950/5 border border-slate-200/40 rounded-full px-3 py-1.5 focus-within:bg-white focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm">
          {/* Z logo icon inside the search bar on the left (hidden on mobile viewports) */}
          <div className="hidden sm:flex w-6 h-6 rounded-md bg-white border border-slate-200/50 shadow-sm items-center justify-center p-0.5 mr-2 shrink-0 select-none">
            <img src={zeptoLogo} alt="Z" className="w-full h-full object-contain" />
          </div>
          <input 
            type="text" 
            placeholder='Search "milk", "eggs", "chicken"...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-850 placeholder-slate-400 text-xs md:text-sm font-semibold pr-6"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => {
                if (soundEnabled) sfx.play('click');
                setSearchQuery('');
              }}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Nav Actions */}
      <div className="hidden md:flex items-center gap-6">
        <button 
          onClick={() => handleNavClick(() => {
            setScannerActive(false);
            setCookingActive(false);
          })}
          className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors py-1 cursor-pointer"
        >
          Shop
        </button>
        <button 
          onClick={() => handleNavClick(() => {
            setScannerActive(true);
            setCookingActive(false);
          })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors bg-slate-950/5 hover:bg-slate-950/10 px-4 py-2 rounded-full border border-slate-950/10 cursor-pointer"
        >
          <Camera className="w-4 h-4 text-pink-accent" />
          Fridge Scanner
        </button>
        <button 
          onClick={() => handleNavClick(() => {
            setCookingActive(true);
            setScannerActive(false);
          })}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors bg-slate-950/5 hover:bg-slate-950/10 px-4 py-2 rounded-full border border-slate-950/10 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-amber-500" />
          Instant Kitchen
        </button>
      </div>

      {/* Profile and Controls */}
      <div className="flex items-center gap-4">
        {/* Sound Toggle */}
        <button 
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) sfx.play('click');
          }}
          className="p-2 rounded-full bg-slate-950/5 hover:bg-slate-950/10 border border-slate-950/10 text-slate-600 hover:text-slate-950 cursor-pointer"
          title={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Voice Trigger */}
        <button 
          onClick={() => handleNavClick(() => setVoiceActive(true))}
          className="p-2.5 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary cursor-pointer animate-pulse relative"
          title="Voice Shopping"
        >
          <Mic className="w-4 h-4 text-primary fill-primary/10" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-accent rounded-full animate-ping"></span>
        </button>

        {/* Cart Trigger (Hidden on small mobile viewports) */}
        <button 
          onClick={() => handleNavClick(() => setCartOpen(true))}
          className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-accent-violet hover:opacity-90 px-4 py-2 rounded-full text-white font-semibold transition-all shadow-lg shadow-primary/15 cursor-pointer relative animate-fade-in"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">₹{totalPrice.toFixed(0)}</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-pink-accent text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce">
              {totalItems}
            </span>
          )}
        </button>

        {/* User Profile Dropdown (Shifted to Far Right) */}
        {userPhone && (
          <div className="relative">
            <button 
              onClick={() => {
                if (soundEnabled) sfx.play('click');
                setProfileOpen(!profileOpen);
              }}
              className="p-2.5 rounded-full bg-slate-950/5 hover:bg-slate-950/10 border border-slate-950/10 text-slate-700 hover:text-slate-950 cursor-pointer flex items-center justify-center relative shadow-sm"
              title="My Account"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <>
                {/* Click outside backdrop close */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setProfileOpen(false)} 
                />
                
                <div className="absolute right-0 mt-2.5 w-48 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 shadow-xl z-40 flex flex-col gap-2.5 animate-fade-in text-left">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Logged In As</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">{userPhone}</span>
                  </div>
                  
                  <div className="h-px bg-slate-200/60 my-0.5"></div>

                  {/* Mobile-Only Shopping Bag Link inside Profile */}
                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      setCartOpen(true);
                    }}
                    className="sm:hidden w-full flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer hover:bg-slate-950/5 py-1.5 px-2 rounded-lg transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                    <span>My Bag ({totalItems})</span>
                  </button>

                  <div className="sm:hidden h-px bg-slate-200/60 my-0.5"></div>

                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer hover:bg-rose-500/5 py-1.5 px-2 rounded-lg transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
