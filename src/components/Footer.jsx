import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { sfx } from '../utils/sfx';
import zeptoLogo from '../assets/zepto.png';

export default function Footer({ soundEnabled }) {
  
  const handleLinkClick = () => {
    if (soundEnabled) sfx.play('click');
  };

  return (
    <footer className="w-full border-t border-slate-200/50 bg-slate-100/80 backdrop-blur px-6 py-12 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm flex items-center justify-center bg-white border border-slate-100 p-1">
              <img src={zeptoLogo} alt="Zepto Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">zepto<span className="text-primary font-black">AI</span></span>
          </div>
          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
            Delivering groceries, dairy, munchies and custom recipes in under 10 minutes. Powered by computer vision and conversational AI.
          </p>
        </div>

        {/* Categories Links */}
        <div>
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4">Groceries</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-bold">
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Fruits & Vegetables</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Dairy, Bread & Eggs</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Cold Drinks & Juices</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Munchies & Snacks</a></li>
          </ul>
        </div>

        {/* AI Capabilities Links */}
        <div>
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4">Smart Tech</h4>
          <ul className="space-y-2 text-xs text-slate-600 font-bold">
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Refrigerator Scanner</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Voice Shopping Engine</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Instant Cooking Engine</a></li>
            <li><a href="#" onClick={handleLinkClick} className="hover:text-slate-950 transition-colors">Shared Collaborative Session</a></li>
          </ul>
        </div>

        {/* Security / Info */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-4">Trust & Security</h4>
          <div className="flex items-start gap-2.5 text-xs text-slate-600 font-bold leading-snug">
            <Shield className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
            <p>Your audio permissions, webcam access, and transaction histories are secured locally in-browser.</p>
          </div>
        </div>

      </div>

      {/* Under footer */}
      <div className="max-w-7xl mx-auto border-t border-slate-200/50 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-650 font-bold gap-4">
        <p>&copy; {new Date().getFullYear()} Zepto AI Systems. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Advanced Web AI Integration
        </p>
      </div>
    </footer>
  );
}
