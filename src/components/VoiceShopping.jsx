import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, ShoppingCart, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function VoiceShopping({ 
  products, 
  addToCart, 
  soundEnabled, 
  onClose 
}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedItems, setDetectedItems] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [typedInput, setTypedInput] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setListening(true);
        setTranscript('');
        setDetectedItems([]);
        setErrorMessage('');
      };

      rec.onerror = (event) => {
        console.error("Speech recognition error", event);
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone permission denied. Feel free to type your command below.");
        } else {
          setErrorMessage(`Error: ${event.error}. Try again or type below.`);
        }
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
      };

      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        parseVoiceCommand(text);
      };

      recognitionRef.current = rec;
    } else {
      setErrorMessage("Speech Recognition is not supported by your browser. Please type your speech command below.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListen = () => {
    if (listening) {
      recognitionRef.current?.stop();
      if (soundEnabled) sfx.play('click');
    } else {
      setErrorMessage('');
      setTranscript('');
      setDetectedItems([]);
      try {
        recognitionRef.current?.start();
        if (soundEnabled) sfx.play('refresh');
      } catch (e) {
        console.error(e);
        setErrorMessage("Speech recognition engine busy. Try typing below.");
      }
    }
  };

  // Mock speech typist for testing/VM setups
  const handleTypedSubmit = (e) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    
    if (soundEnabled) sfx.play('click');
    setTranscript(typedInput);
    parseVoiceCommand(typedInput);
    setTypedInput('');
  };

  // Parse items from speech (e.g. "Buy Maggi, Milk and Bread")
  const parseVoiceCommand = (text) => {
    const textLower = text.toLowerCase();
    const matches = [];

    // Simple keyword mapping with correct DB ids
    const keywordMap = [
      { keywords: ['milk'], id: 'p28' },
      { keywords: ['egg', 'eggs'], id: 'p31' },
      { keywords: ['butter'], id: 'p30' },
      { keywords: ['bread', 'sourdough'], id: 'p29' },
      { keywords: ['tomato', 'tomatoes'], id: 'p26' },
      { keywords: ['banana', 'bananas'], id: 'p25' },
      { keywords: ['maggi', 'noodle', 'noodles', 'maggie'], id: 'p99' },
      { keywords: ['chips', 'lay'], id: 'p37' },
      { keywords: ['cookie', 'cookies'], id: 'p38' },
      { keywords: ['cashew', 'cashews'], id: 'p40' },
      { keywords: ['strawberry', 'strawberries'], id: 'p8' },
      { keywords: ['avocado', 'avocados'], id: 'p9' },
      { keywords: ['spinach'], id: 'p10' }
    ];

    keywordMap.forEach(map => {
      const matchFound = map.keywords.some(kw => textLower.includes(kw));
      if (matchFound) {
        const prod = products.find(p => p.id === map.id);
        if (prod && !matches.some(m => m.id === prod.id)) {
          matches.push(prod);
        }
      }
    });

    // Also do fallback dynamic word matching for any other spoken terms
    const words = textLower.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/);
    words.forEach(word => {
      if (word.length > 2 && !['buy', 'and', 'the', 'for', 'with', 'please', 'need', 'want', 'some', 'give'].includes(word)) {
        const matchedProds = products.filter(p => 
          p.name.toLowerCase().includes(word) || 
          p.category.toLowerCase().includes(word)
        );
        matchedProds.forEach(prod => {
          if (!matches.some(m => m.id === prod.id) && matches.length < 5) {
            matches.push(prod);
          }
        });
      }
    });

    setDetectedItems(matches);
    if (soundEnabled) {
      if (matches.length > 0) sfx.play('bell');
      else sfx.play('remove');
    }
  };

  // Add all detected items to cart
  const handleAddAll = () => {
    if (detectedItems.length === 0) return;

    if (soundEnabled) sfx.play('payment');
    detectedItems.forEach(item => {
      addToCart(item, 1);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAD7B5]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/50 relative shadow-2xl flex flex-col justify-between max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Close */}
        <button 
          onClick={() => {
            if (soundEnabled) sfx.play('click');
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-950/5 border border-slate-950/10 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-xs font-bold text-accent-violet rounded-full mb-6">
            <Sparkles className="w-3 h-3 text-pink-accent animate-pulse" />
            <span>AI Voice Shopper</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">Speak Your Shopping List</h2>
          <p className="text-xs md:text-sm text-slate-655 font-semibold max-w-sm mb-10">
            Tap the microphone and say something like:<br/>
            <span className="text-accent-violet font-bold">"Buy Maggi, Milk, and Bread"</span>
          </p>

          {/* Voice Orb */}
          <div className="relative mb-10">
            {listening && (
              <>
                {/* Ripples */}
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-150 animate-ping opacity-60"></div>
                <div className="absolute inset-0 rounded-full bg-pink-500/10 scale-200 animate-ping opacity-30"></div>
              </>
            )}

            <button 
              onClick={toggleListen}
              className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer ${
                listening 
                  ? 'bg-gradient-to-tr from-rose-500 to-pink-500 border-pink-400 shadow-xl shadow-pink-500/20' 
                  : 'bg-gradient-to-tr from-primary to-accent-violet border-primary/30 hover:scale-105 shadow-xl shadow-primary/25'
              }`}
            >
              {listening ? (
                <Mic className="w-10 h-10 text-white animate-pulse" />
              ) : (
                <Mic className="w-10 h-10 text-white" />
              )}
            </button>
            
            {listening && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-extrabold text-pink-accent animate-pulse">
                LISTENING...
              </span>
            )}
          </div>

          {/* Sound Waves simulation when listening */}
          {listening && (
            <div className="flex gap-1 h-8 items-center mb-8 justify-center">
              <span className="w-1 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 h-7 bg-accent-violet rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-1 h-5 bg-pink-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 h-8 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span className="w-1 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
            </div>
          )}

          {/* Transcript Output */}
          {transcript && (
            <div className="w-full bg-slate-950/5 border border-slate-950/5 rounded-2xl p-4 mb-6 text-left">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block mb-1">Live Transcript</span>
              <p className="text-sm font-bold text-slate-900">"{transcript}"</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="w-full p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex gap-2.5 items-start text-left mb-6 text-xs text-rose-700 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Fallback Keyboard Input */}
          <form onSubmit={handleTypedSubmit} className="w-full flex gap-2 mb-6">
            <input 
              type="text" 
              placeholder="Or type voice command, e.g. Add eggs and tomato..." 
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-semibold focus:outline-none focus:border-primary/50"
            />
            <button 
              type="submit" 
              className="px-4 py-2.5 bg-slate-950/5 border border-slate-950/10 text-xs font-bold rounded-xl text-slate-700 hover:bg-slate-950/10 hover:text-slate-950 cursor-pointer shadow-sm"
            >
              Simulate
            </button>
          </form>

          {/* Detected Items Cart Adder */}
          {detectedItems.length > 0 && (
            <div className="w-full border-t border-slate-200/50 pt-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">AI Detected Items</span>
                <span className="text-xs text-green-600 font-bold">{detectedItems.length} found</span>
              </div>
              
              <div className="space-y-2 mb-6">
                {detectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-100 border border-slate-200/50 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-700">₹{item.price}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleAddAll}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent-violet hover:opacity-90 font-extrabold text-white text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <ShoppingCart className="w-4 h-4" />
                Add All Detected Items to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
