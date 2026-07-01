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
        aiResponse = {
          sender: 'ai',
          text: "I've fetched the recipe for Classic Butter Chicken! Here are the details and ingredients:",
          recipe: {
            name: "Classic Butter Chicken",
            servings: "Serves 3 people",
            prepTime: "Prep: 15 mins",
            cookTime: "Cook: 20 mins",
            steps: "1. Marinate chicken breast pieces in yogurt and spices for 30 minutes.\n2. Heat a pan, melt butter block, and sauté chicken pieces until browned.\n3. Add tomato cream mix or chopped fresh tomatoes and milk.\n4. Simmer on medium-low for 15 minutes, serve warm!",
            items: [
              { id: 'p30', name: 'Butter Block (100g)', price: 295, required: true },
              { id: 'p26', name: 'Tomatoes (500g)', price: 195, required: true },
              { id: 'p28', name: 'Whole Milk (1L)', price: 420, required: true }
            ]
          }
        };
      } else if (query.includes('milk shake') || query.includes('milkshake') || query.includes('shake')) {
        aiResponse = {
          sender: 'ai',
          text: "Here is the recipe for a fresh strawberry milkshake! Cold, thick, and delicious:",
          recipe: {
            name: "Fresh Strawberry Milkshake",
            servings: "Serves 2 people",
            prepTime: "Prep: 5 mins",
            cookTime: "Cook: 0 mins",
            steps: "1. Rinse and hull the fresh organic strawberries.\n2. Blend them with cold whole milk and two scoops of vanilla ice cream.\n3. Blend on high speed until completely smooth and frothy.\n4. Pour into serving glasses and garnish with strawberry slices!",
            items: [
              { id: 'p28', name: 'Whole Milk (1L)', price: 420, required: true },
              { id: 'p8', name: 'Organic Strawberries', price: 380, required: true }
            ]
          }
        };
      } else if (query.includes('omelette') || query.includes('egg') || query.includes('bhurji')) {
        aiResponse = {
          sender: 'ai',
          text: "Here is the recipe for Masala Egg Omelette! A high-protein breakfast recipe:",
          recipe: {
            name: "Masala Egg Omelette",
            servings: "Serves 1 person",
            prepTime: "Prep: 5 mins",
            cookTime: "Cook: 5 mins",
            steps: "1. Whisk eggs in a bowl with chopped onions, tomatoes, and a pinch of salt.\n2. Melt butter in a heated skillet.\n3. Pour in egg mixture and cook until bottom is set.\n4. Flip and cook other side for 1-2 minutes, serve hot!",
            items: [
              { id: 'p31', name: 'Brown Eggs (6 units)', price: 340, required: true },
              { id: 'p30', name: 'Butter Block (100g)', price: 295, required: true },
              { id: 'p26', name: 'Tomatoes (500g)', price: 195, required: false }
            ]
          }
        };
      } else if (query.includes('toast') || query.includes('french toast')) {
        aiResponse = {
          sender: 'ai',
          text: "I've loaded the recipe for Gourmet French Toast! Sweet and buttery breakfast delight:",
          recipe: {
            name: "Gourmet French Toast",
            servings: "Serves 2 people",
            prepTime: "Prep: 5 mins",
            cookTime: "Cook: 10 mins",
            steps: "1. Whisk eggs, milk, and sugar together in a shallow dish.\n2. Dip sandwich bread slices to coat well.\n3. Melt butter in a skillet over medium heat.\n4. Fry bread slices for 2-3 mins on each side until golden, serve hot!",
            items: [
              { id: 'p29', name: 'White Sandwich Bread', price: 185, required: true },
              { id: 'p31', name: 'Brown Eggs (6 units)', price: 340, required: true },
              { id: 'p28', name: 'Whole Milk (1L)', price: 420, required: true }
            ]
          }
        };
      } else if (query.includes('salad') || query.includes('spinach')) {
        aiResponse = {
          sender: 'ai',
          text: "Here is the recipe for a super healthy Fresh Strawberry & Spinach Salad:",
          recipe: {
            name: "Strawberry Spinach Salad",
            servings: "Serves 2 people",
            prepTime: "Prep: 8 mins",
            cookTime: "Cook: 0 mins",
            steps: "1. Rinse spinach leaves and strawberries thoroughly.\n2. Slice strawberries and place them over a bed of baby spinach.\n3. Drizzle with olive oil and top with roasted cashews.\n4. Serve fresh!",
            items: [
              { id: 'p8', name: 'Organic Strawberries', price: 380, required: true },
              { id: 'p10', name: 'Pre-Washed Baby Spinach', price: 250, required: true },
              { id: 'p40', name: 'Cashews', price: 590, required: false }
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
        // Dynamic Recipe Synthesis
        let searchDish = "";
        const patterns = [
          /how to make\s+(.+)/i, 
          /recipe for\s+(.+)/i, 
          /i want\s+(.+)/i, 
          /want\s+(.+)/i, 
          /make\s+(.+)/i,
          /show\s+(.+)/i
        ];
        
        for (let regex of patterns) {
          const match = query.match(regex);
          if (match && match[1]) {
            searchDish = match[1].trim();
            break;
          }
        }
        
        // If not matching pattern but query is longer than 3 characters, use query directly
        if (!searchDish && query.length > 3) {
          searchDish = query.trim();
        }

        if (searchDish) {
          const capitalizedDish = searchDish.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const matchWords = searchDish.split(' ');
          let suggestedItems = [];
          
          matchWords.forEach(word => {
            if (word.length > 2) {
              const matched = products.filter(p => p.name.toLowerCase().includes(word) || p.category.toLowerCase().includes(word));
              matched.forEach(p => {
                if (!suggestedItems.some(item => item.id === p.id) && suggestedItems.length < 3) {
                  suggestedItems.push({ id: p.id, name: p.name, price: p.price, required: true });
                }
              });
            }
          });
          
          if (suggestedItems.length === 0) {
            // Default essential ingredients
            suggestedItems.push({ id: 'p28', name: 'Whole Milk (1L)', price: 420, required: true });
            suggestedItems.push({ id: 'p30', name: 'Butter Block (100g)', price: 295, required: false });
          }

          aiResponse = {
            sender: 'ai',
            text: `Sure! I have generated the cooking recipe details for "${capitalizedDish}":`,
            recipe: {
              name: capitalizedDish,
              servings: "Serves 2 people",
              prepTime: "Prep: 10 mins",
              cookTime: "Cook: 15 mins",
              steps: `1. Prep and measure ingredients.\n2. Gently blend or cook the mixture in a heated saucepan.\n3. Stir continuously on medium heat until smooth and ready.\n4. Plate nicely, serve warm, and enjoy!`,
              items: suggestedItems
            }
          };
        } else {
          aiResponse = {
            sender: 'ai',
            text: `I can help you shop or cook! Try saying: \n1. "I want Butter Chicken" (instantly adds ingredients to cart)\n2. "I want Strawberry Milkshake" (shows milkshake instructions)\n3. "Scan my fridge" (opens scanner)`
          };
        }
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);

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
                        {/* Servings & Duration details */}
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 text-[10px] text-slate-500 font-extrabold">
                          <span>👥 {msg.recipe.servings || 'Serves 2 people'}</span>
                          <span>⏱️ {msg.recipe.prepTime || 'Prep: 5m'} | {msg.recipe.cookTime || 'Cook: 10m'}</span>
                        </div>

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

                        {/* Step-by-step preparation steps */}
                        {msg.recipe.steps && (
                          <div className="pt-2 border-t border-slate-200/50 space-y-1.5">
                            <span className="text-[10px] font-black text-pink-accent uppercase tracking-wider block">How to Prepare</span>
                            <p className="text-[10px] text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                              {msg.recipe.steps}
                            </p>
                          </div>
                        )}

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
