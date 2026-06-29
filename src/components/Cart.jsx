import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, Navigation, Bike, CheckCircle, Sparkles } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function Cart({ 
  cart, 
  isOpen, 
  onClose, 
  updateQuantity, 
  clearCart, 
  soundEnabled 
}) {
  const [checkoutStep, setCheckoutStep] = useState('idle'); // idle -> paying -> success -> tracking
  const [deliveryProgress, setDeliveryProgress] = useState(0);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Play hover tick
  const handleHover = () => {
    if (soundEnabled) sfx.play('hover');
  };

  // Adjust quantities
  const handleQtyChange = (productId, currentQty, amount) => {
    const nextQty = currentQty + amount;
    if (soundEnabled) {
      if (nextQty <= 0) sfx.play('remove');
      else sfx.play('add');
    }
    updateQuantity(productId, nextQty);
  };

  const handleRemove = (productId) => {
    if (soundEnabled) sfx.play('remove');
    updateQuantity(productId, 0);
  };

  // Run checkout simulator
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    if (soundEnabled) sfx.play('payment');
    setCheckoutStep('paying');

    setTimeout(() => {
      if (soundEnabled) sfx.play('success');
      setCheckoutStep('success');

      // Shift to tracking after 2s
      setTimeout(() => {
        setCheckoutStep('tracking');
        setDeliveryProgress(0);
        setCountdown(600);
      }, 2000);
    }, 2000);
  };

  // Delivery tracker ticker
  useEffect(() => {
    if (checkoutStep !== 'tracking') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      setDeliveryProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 0.5; // increments slowly
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkoutStep]);

  // Format countdown seconds into MM:SS
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#FAD7B5]/85 backdrop-blur-md flex justify-end">
      {/* Click outside to close */}
      <div 
        onClick={() => {
          if (soundEnabled) sfx.play('click');
          onClose();
        }}
        className="flex-grow"
      />

      {/* Cart Panel */}
      <div className="w-full max-w-md glass-panel border-l border-slate-200/50 flex flex-col justify-between shadow-2xl relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200/50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              My Shopping Bag
            </h2>
            <p className="text-[10px] text-accent-violet font-semibold uppercase tracking-wider">10-Min Delivery</p>
          </div>
          <button 
            onClick={() => {
              if (soundEnabled) sfx.play('click');
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-950/5 text-slate-550 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic checkout panels */}
        {checkoutStep === 'idle' && (
          /* Normal Cart List */
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none">
            
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 text-slate-550">
                <span className="text-5xl mb-4 select-none">🛒</span>
                <h3 className="text-sm font-bold text-slate-700">Your cart is empty</h3>
                <p className="text-xs max-w-xs mt-1 text-slate-500 font-semibold">Items added from shop, fridge scanner or voice command will compile here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    onMouseEnter={handleHover}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 border border-slate-200/50 hover:border-slate-350 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200/50 shrink-0 shadow-sm">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-2xl select-none shrink-0">{item.emoji}</span>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">₹{item.price} each</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-slate-950/5 border border-slate-950/10 rounded-xl p-0.5">
                        <button 
                          onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                          className="p-1 hover:bg-slate-950/10 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-1">{item.quantity}</span>
                        <button 
                          onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                          className="p-1 hover:bg-slate-950/10 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      
                      {/* Trash */}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'paying' && (
          /* Processing Loader */
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-primary border-t-pink-accent animate-spin mb-6"></div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Simulating Secure Payment</h3>
            <p className="text-xs text-slate-655 font-semibold max-w-xs leading-relaxed">
              Charging shared ledger card... Synthesizing digital transaction receipt.
            </p>
          </div>
        )}

        {checkoutStep === 'success' && (
          /* Payment success chime screen */
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-600 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Order Confirmed!</h3>
            <p className="text-xs text-slate-655 font-semibold max-w-xs leading-relaxed mb-6">
              Payment authorized successfully. Driver Rahul has picked up your bag from the dark store!
            </p>
            <div className="px-4 py-2 bg-slate-100 border border-slate-200/50 rounded-full text-xs font-bold text-accent-violet">
              EST. DELIVERY: 10 MINS
            </div>
          </div>
        )}

        {checkoutStep === 'tracking' && (
          /* Delivery Route Map Tracking Screen */
          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            <div className="text-center">
              <span className="text-[10px] font-black uppercase text-pink-accent tracking-widest block mb-1">Live Tracking</span>
              <h3 className="text-3xl font-black text-slate-900 animate-pulse">{formatTime(countdown)}</h3>
              <p className="text-xs text-slate-655 font-semibold mt-1">Your driver Rahul is riding to your location</p>
            </div>

            {/* Simulated Map Path */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/50 relative overflow-hidden h-44 flex flex-col justify-between">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Map Pins */}
              <div className="flex justify-between items-center relative z-10">
                {/* Store Pin */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-xs">🏬</div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">Dark Store</span>
                </div>
                {/* Dotted path */}
                <div className="flex-grow h-0.5 border-t-2 border-dashed border-slate-350 mx-2 relative">
                  {/* Delivery Bike Icon moving */}
                  <div 
                    className="absolute -top-3 w-6 h-6 rounded-full bg-pink-accent text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-all duration-1000"
                    style={{ left: `${deliveryProgress}%`, transform: 'translateX(-50%)' }}
                  >
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                </div>
                {/* Home Pin */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xs">🏠</div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">Home</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="flex justify-between text-[10px] text-slate-600 font-bold border-t border-slate-200/50 pt-4">
                <span>SPEED: 28 km/h</span>
                <span className="text-pink-accent font-extrabold uppercase animate-pulse">On Time</span>
              </div>
            </div>

            {/* Rider profile */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-200/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold border border-slate-200 shadow-sm">🚴</div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">Rahul Kumar</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Delivery Hero &bull; 5.0 ★ (1.2k orders)</span>
                </div>
              </div>
              <a href="tel:123" className="px-3 py-1.5 rounded-full bg-slate-950/5 border border-slate-950/10 text-xs font-bold text-slate-655 hover:text-slate-900 cursor-pointer">Call</a>
            </div>

            {/* Cancel Order */}
            <button 
              onClick={() => {
                if (soundEnabled) sfx.play('click');
                setCheckoutStep('idle');
                clearCart();
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Simulate Delivery Finish (Empty Cart)
            </button>
          </div>
        )}

        {/* Footer Checkout Panel */}
        {checkoutStep === 'idle' && (
          <div className="p-6 border-t border-slate-200/50 bg-slate-100/50 space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Bag Total</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-semibold">
                <span>Delivery Charge</span>
                <span className="text-green-600 font-extrabold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200/50">
                <span>Total Amount</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-pink-accent hover:opacity-90 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout & Pay ${totalPrice}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-violet" />
              <span>100% Encrypted Transactions &bull; Safe Grocery Delivery</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
