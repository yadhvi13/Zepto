import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import RefrigeratorScanner from './components/RefrigeratorScanner';
import VoiceShopping from './components/VoiceShopping';
import InstantCooking from './components/InstantCooking';
import Cart from './components/Cart';
import AiAssistant from './components/AiAssistant';
import Footer from './components/Footer';
import Auth from './components/Auth';
import { products as localProducts } from './utils/products';
import { sfx } from './utils/sfx';

export default function App() {
  const [productsList, setProductsList] = useState(localProducts);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const [cookingActive, setCookingActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // MERN Auth & Profile states
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Inflate user cart helper
  const inflateCart = (dbCart, currentProducts) => {
    const inflated = [];
    dbCart.forEach(dbItem => {
      const match = currentProducts.find(p => p.id === dbItem.productId);
      if (match) {
        inflated.push({ ...match, quantity: dbItem.quantity });
      }
    });
    return inflated;
  };

  // Fetch products from database & restore user token session on mount
  useEffect(() => {
    const initApp = async () => {
      let currentProducts = localProducts;
      
      // 1. Fetch catalog
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProductsList(data);
          currentProducts = data;
        }
      } catch (err) {
        console.warn("Using offline fallback catalog products list:", err.message);
      }

      // 2. Authenticate session token
      const token = localStorage.getItem('zepto_token');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user.cart) {
            const inflated = inflateCart(data.user.cart, currentProducts);
            setCart(inflated);
          }
        } else {
          // Token expired or invalid
          localStorage.removeItem('zepto_token');
        }
      } catch (err) {
        console.warn("Failed session sync with backend server:", err.message);
      } finally {
        setAuthLoading(false);
      }
    };

    initApp();
  }, []);

  // Sync cart mutations to MongoDB
  const syncCartToBackend = async (newCart) => {
    const token = localStorage.getItem('zepto_token');
    if (!token) return;

    try {
      const payload = newCart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: payload })
      });
    } catch (err) {
      console.warn("Failed to sync cart update to backend database:", err.message);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const match = prev.find(item => item.id === product.id);
      let nextCart;
      if (match) {
        nextCart = prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        nextCart = [...prev, { ...product, quantity }];
      }
      syncCartToBackend(nextCart);
      return nextCart;
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    setCart(prev => {
      let nextCart;
      if (quantity <= 0) {
        nextCart = prev.filter(item => item.id !== productId);
      } else {
        nextCart = prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
      }
      syncCartToBackend(nextCart);
      return nextCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    syncCartToBackend([]);
  };

  // Handle recipe search inside hero (Recipe -> Cart helper)
  const handleSearchRecipe = (query) => {
    const lower = query.toLowerCase();
    if (lower.includes('butter chicken') || lower.includes('chicken')) {
      if (soundEnabled) sfx.play('bell');
      
      const recipeIngredients = [
        { id: 'p11', name: 'Chicken Breast (500g)', price: 180 },
        { id: 'p3', name: 'Amul Salted Butter', price: 56 },
        { id: 'p12', name: 'Tomato Cream Mix', price: 90 }
      ];

      // Add each recipe item directly to the cart
      recipeIngredients.forEach(item => {
        const match = productsList.find(p => p.id === item.id);
        if (match) addToCart(match, 1);
      });

      if (soundEnabled) sfx.play('payment');
      
      // Auto open cart panel to show items added directly
      setCartOpen(true);
    } else {
      // Normal search: filter category
      const foundCat = productsList.find(p => p.name.toLowerCase().includes(lower) || p.category.toLowerCase().includes(lower));
      if (foundCat) {
        setSelectedCategory(foundCat.category);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      } else {
        // Open the chatbot assistant instead of a blocking native alert
        const chatOrb = document.getElementById('orb');
        if (chatOrb) chatOrb.click();
      }
    }
  };

  const handleLoginSuccess = (token, userObj) => {
    localStorage.setItem('zepto_token', token);
    setUser(userObj);
    if (userObj.cart) {
      const inflated = inflateCart(userObj.cart, productsList);
      setCart(inflated);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zepto_token');
    setUser(null);
    setCart([]);
    if (soundEnabled) sfx.play('remove');
  };

  // Prevent flash loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-pink-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display authentication overlay if not logged in
  if (!user) {
    return (
      <Auth 
        onLoginSuccess={handleLoginSuccess} 
        soundEnabled={soundEnabled} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 relative overflow-x-hidden pb-28 md:pb-12 selection:bg-primary/20 selection:text-primary">
      
      {/* Animated Glowing blobs in background */}
      <div className="absolute top-12 left-10 md:left-1/4 w-80 md:w-[500px] h-80 md:h-[500px] rounded-full bg-primary/12 blur-[130px] pointer-events-none animate-blob-purple z-0"></div>
      <div className="absolute top-1/3 right-10 md:right-1/4 w-72 md:w-[450px] h-72 md:h-[450px] rounded-full bg-pink-accent/10 blur-[140px] pointer-events-none animate-blob-pink z-0"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 md:w-[400px] h-64 md:h-[400px] rounded-full bg-blue-500/8 blur-[120px] pointer-events-none animate-blob-blue z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation header */}
        <Navbar 
          cart={cart} 
          setCartOpen={setCartOpen}
          setScannerActive={setScannerActive}
          setCookingActive={setCookingActive}
          voiceActive={voiceActive}
          setVoiceActive={setVoiceActive}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          userPhone={user.phone}
          onLogout={handleLogout}
        />

        {/* Dynamic Views routing */}
        <main className="flex-grow">
          {scannerActive ? (
            <RefrigeratorScanner 
              products={productsList}
              addToCart={addToCart}
              soundEnabled={soundEnabled}
              onClose={() => setScannerActive(false)}
            />
          ) : cookingActive ? (
            <InstantCooking 
              products={productsList}
              addToCart={addToCart}
              soundEnabled={soundEnabled}
              onClose={() => setCookingActive(false)}
            />
          ) : (
            /* Home Page layout */
            <>
              <Hero 
                setScannerActive={setScannerActive}
                setCookingActive={setCookingActive}
                setVoiceActive={setVoiceActive}
                soundEnabled={soundEnabled}
                onSearchRecipe={handleSearchRecipe}
              />
              
              <Categories 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                soundEnabled={soundEnabled}
              />

              <ProductGrid 
                products={productsList}
                selectedCategory={selectedCategory}
                cart={cart}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                soundEnabled={soundEnabled}
              />
            </>
          )}
        </main>

        <Footer soundEnabled={soundEnabled} />
      </div>

      {/* Floating morphing AI Chat assistant */}
      <AiAssistant 
        products={productsList}
        addToCart={addToCart}
        soundEnabled={soundEnabled}
        setCookingActive={setCookingActive}
        setScannerActive={setScannerActive}
      />

      {/* Sliding Collaborative Cart */}
      <Cart 
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
        soundEnabled={soundEnabled}
      />

      {/* Voice Assistant Modal Overlay */}
      {voiceActive && (
        <VoiceShopping 
          products={productsList}
          addToCart={addToCart}
          soundEnabled={soundEnabled}
          onClose={() => setVoiceActive(false)}
        />
      )}

      {/* Mobile Floating Bottom Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden glass-panel rounded-2xl flex items-center justify-around py-3 px-2 shadow-2xl border border-slate-200/50 backdrop-blur-md">
        <button 
          onClick={() => {
            if (soundEnabled) sfx.play('click');
            setScannerActive(false);
            setCookingActive(false);
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            !scannerActive && !cookingActive ? 'text-primary' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🛍️</span>
          <span>Shop</span>
        </button>
        <button 
          onClick={() => {
            if (soundEnabled) sfx.play('click');
            setScannerActive(true);
            setCookingActive(false);
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            scannerActive ? 'text-primary' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">📷</span>
          <span>Scanner</span>
        </button>
        <button 
          onClick={() => {
            if (soundEnabled) sfx.play('click');
            setCookingActive(true);
            setScannerActive(false);
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold cursor-pointer ${
            cookingActive ? 'text-primary' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🍳</span>
          <span>Kitchen</span>
        </button>
        <button 
          onClick={() => {
            if (soundEnabled) sfx.play('click');
            setCartOpen(true);
          }}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 cursor-pointer relative"
        >
          <span className="text-lg">🛒</span>
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-pink-accent text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
