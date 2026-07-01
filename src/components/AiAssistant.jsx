import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Send, X, ShoppingCart, Check, Plus } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function AiAssistant({ 
  products, 
  addToCart, 
  soundEnabled, 
  setCookingActive,
  setScannerActive
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hey there! 🥦 I am your Zepto AI assistant. Tell me what you want to cook, or ask for a recipe! Try typing "I want Butter Chicken" or "I have 20 minutes, need dinner".'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleToggle = () => {
    if (soundEnabled) sfx.play('click');
    if (isOpen) {
      // Clear/Reset messages and input state when minimized
      setMessages([
        {
          sender: 'ai',
          text: 'Hey there! 🥦 I am your Zepto AI assistant. Tell me what you want to cook, or ask for a recipe! Try typing "I want Butter Chicken" or "I have 20 minutes, need dinner".'
        }
      ]);
      setInput('');
      setIsTyping(false);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    if (soundEnabled) sfx.play('click');
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      if (soundEnabled) sfx.play('bubble');
      
      const query = userText.toLowerCase();
      let aiResponse = {};

      if (query.includes('butter chicken')) {
        // Recipe to Cart trigger
        aiResponse = {
          sender: 'ai',
          text: "I've fetched the recipe for Butter Chicken! Here are the ingredients. Click below to add all missing items to your cart instantly:",
          recipe: {
            name: "Classic Butter Chicken",
            items: [
              { id: 'p11', name: 'Chicken Breast (500g)', price: 180, required: true },
              { id: 'p3', name: 'Amul Salted Butter', price: 56, required: true },
              { id: 'p12', name: 'Tomato Cream Mix', price: 90, required: true },
              { id: 'p13', name: 'Indian Butter Chicken Spices', price: 45, required: false } // already owned
            ]
          }
        };
      } else if (query.includes('minutes') || query.includes('min') || query.includes('dinner') || query.includes('cook')) {
        aiResponse = {
          sender: 'ai',
          text: "No problem! I have loaded our Instant Kitchen dashboard for you. You can adjust your timer and available ingredients to generate perfect 15-to-30 minute dinners.",
          action: () => {
            setCookingActive(true);
            setScannerActive(false);
          }
        };
      } else if (query.includes('scanner') || query.includes('fridge') || query.includes('scan')) {
        aiResponse = {
          sender: 'ai',
          text: "Opening Refrigerator Scanner! Get ready to audit your stock.",
          action: () => {
            setScannerActive(true);
            setCookingActive(false);
          }
        };
      } else {
        // Conversational Fallback
        aiResponse = {
          sender: 'ai',
          text: `I can help you shop or cook! Try saying: \n1. "I want Butter Chicken" (instantly adds ingredients to cart)\n2. "I have 20 minutes, need dinner" (opens recipes builder)\n3. "Scan my fridge" (opens scanner)`
        };
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

      // Run action triggers if any
      if (aiResponse.action) {
        setTimeout(() => aiResponse.action(), 800);
      }
    }, 1200);
  };

  // Add recipe items to cart
  const handleAddRecipeToCart = (recipeItems) => {
    if (soundEnabled) sfx.play('payment');
    
    // Add only required items (simulate adding missing ingredients)
    const addedNames = [];
    recipeItems.forEach(item => {
      if (item.required) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          addToCart(product, 1);
          addedNames.push(product.name);
        }
      }
    });

    setMessages(prev => [...prev, {
      sender: 'ai',
      text: `✓ Added ingredients: ${addedNames.join(', ')} to your cart!`
    }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[calc(100vw-32px)] max-w-[320px] sm:max-w-[380px] h-[400px] sm:h-[500px] glass-panel rounded-3xl border border-slate-200/50 shadow-2xl flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-primary/5 to-pink-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-pink-accent flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Zepto AI Assistant</h4>
                  <span className="block text-[9px] text-green-600 font-bold uppercase tracking-wider animate-pulse">Online</span>
                </div>
              </div>
              <button 
                onClick={handleToggle}
                className="p-1.5 rounded-full hover:bg-slate-950/5 text-slate-550 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-semibold leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-primary to-accent-violet text-white rounded-tr-none shadow-md'
                      : 'bg-slate-100 border border-slate-200/50 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    {/* Message Text */}
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Interactive Recipe Widget */}
                    {msg.recipe && (
                      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/50 space-y-3 text-left shadow-sm">
                        <span className="text-[10px] font-black text-pink-accent uppercase tracking-wider block">Recipe Ingredients</span>
                        
                        <div className="space-y-1.5">
                          {msg.recipe.items.map((item, iIdx) => (
                            <div key={iIdx} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-705 font-bold flex items-center gap-1.5">
                                {item.required ? (
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                )}
                                {item.name}
                              </span>
                              <span className="text-slate-500 font-bold">
                                {item.required ? `₹${item.price}` : 'Fridge'}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => handleAddRecipeToCart(msg.recipe.items)}
                          className="w-full py-2 bg-gradient-to-r from-primary to-pink-accent hover:opacity-90 rounded-lg text-white font-extrabold text-[10px] uppercase tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Add All Ingredients with 1-Click
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 border border-slate-200/50 text-slate-500 rounded-2xl rounded-tl-none p-3 text-xs flex gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200/50 bg-slate-100/50 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask recipes or search ingredients..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:border-primary/50"
              />
              <button 
                type="submit"
                className="p-2.5 bg-primary rounded-2xl hover:bg-dark-purple text-white transition-colors cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Orb Button */}
      <motion.button 
        layoutId="orb"
        onClick={handleToggle}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent-violet border border-primary/30 text-white flex items-center justify-center shadow-lg shadow-primary/30 cursor-pointer animate-orb-pulse z-40 relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 via-pink-accent/20 to-blue-500/20 blur-sm pointer-events-none group-hover:scale-110 transition-transform"></div>
        <Sparkles className="w-6 h-6 text-white fill-white group-hover:rotate-12 transition-transform" />
      </motion.button>
    </div>
  );
}
