import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, AlertTriangle, CheckCircle, ShoppingCart, VideoOff, Eye } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function RefrigeratorScanner({ 
  products, 
  addToCart, 
  soundEnabled, 
  onClose 
}) {
  const [useWebcam, setUseWebcam] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detectedItems, setDetectedItems] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Preset Fridge Mock Stocks for Scanner
  const fridgePresets = {
    standard: [
      { name: "Farm Fresh Eggs", level: 8, label: "Eggs (1 left)", reorder: true, id: "p2" },
      { name: "Red Vine Tomatoes", level: 15, label: "Tomatoes (2 left)", reorder: true, id: "p5" },
      { name: "Organic Whole Milk", level: 80, label: "Whole Milk (80%)", reorder: false, id: "p1" },
      { name: "Amul Salted Butter", level: 75, label: "Salted Butter (75%)", reorder: false, id: "p3" }
    ],
    empty: [
      { name: "Farm Fresh Eggs", level: 0, label: "Eggs (Empty)", reorder: true, id: "p2" },
      { name: "Organic Whole Milk", level: 5, label: "Milk (Empty)", reorder: true, id: "p1" },
      { name: "Red Vine Tomatoes", level: 0, label: "Tomatoes (Empty)", reorder: true, id: "p5" }
    ]
  };

  const [currentPreset, setCurrentPreset] = useState("standard");

  // Play hover tick
  const handleHover = () => {
    if (soundEnabled) sfx.play('hover');
  };

  // Toggle Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseWebcam(true);
      if (soundEnabled) sfx.play('click');
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError("Camera access denied or unavailable. Using preset simulator.");
      setUseWebcam(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setUseWebcam(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  // Run mock scanner detection loops
  const runScan = () => {
    if (soundEnabled) sfx.play('refresh');
    setScanning(true);
    setProgress(0);
    setDetectedItems([]);
    
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    const step = 2;
    scanIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(scanIntervalRef.current);
          setScanning(false);
          // Finish scanning and reveal items
          setDetectedItems(fridgePresets[currentPreset]);
          if (soundEnabled) sfx.play('bell');
          return 100;
        }
        return prev + step;
      });
    }, 40);
  };

  // Draw YOLO-style bounding boxes on canvas over video or preset
  useEffect(() => {
    if (!scanning && detectedItems.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw active scanning line if scanning
    if (scanning) {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
      ctx.lineWidth = 3;
      const y = (progress / 100) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Draw random digital noise/boxes to look like YOLO search
      if (progress % 10 < 5) {
        ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)';
        ctx.fillStyle = 'rgba(124, 58, 237, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 40, 120, 160);
        ctx.fillRect(30, 40, 120, 160);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
        ctx.strokeRect(180, 80, 100, 120);
        ctx.fillRect(180, 80, 100, 120);
      }
    } else {
      // Draw detected items bounding boxes
      detectedItems.forEach((item, idx) => {
        const boxes = [
          { x: 30, y: 40, w: 100, h: 180 }, // Milk/Eggs
          { x: 160, y: 120, w: 110, h: 80 }, // Tomatoes
          { x: 20, y: 240, w: 130, h: 100 }, // Butter
          { x: 180, y: 230, w: 100, h: 110 }
        ];
        
        const box = boxes[idx % boxes.length];
        const isLow = item.level <= 20;

        ctx.strokeStyle = isLow ? 'rgba(239, 68, 68, 0.85)' : 'rgba(34, 197, 94, 0.85)';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.w, box.h);

        // Box Label background
        ctx.fillStyle = isLow ? 'rgba(239, 68, 68, 0.9)' : 'rgba(34, 197, 94, 0.9)';
        ctx.fillRect(box.x, box.y - 20, box.w, 20);

        // Box label text
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(`${item.name} (${item.level}%)`, box.x + 5, box.y - 6);

        // Fill background translucency
        ctx.fillStyle = isLow ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)';
        ctx.fillRect(box.x, box.y, box.w, box.h);
      });
    }
  }, [scanning, progress, detectedItems, currentPreset]);

  // Reorder items in bulk
  const handleBulkReorder = () => {
    const lowItems = detectedItems.filter(item => item.reorder);
    if (lowItems.length === 0) return;

    if (soundEnabled) sfx.play('payment');
    lowItems.forEach(item => {
      const match = products.find(p => p.id === item.id);
      if (match) {
        addToCart(match, 1);
      }
    });
  };

  const lowItems = detectedItems.filter(item => item.reorder);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-6">
      {/* Back to shop */}
      <button 
        onClick={() => {
          if (soundEnabled) sfx.play('click');
          onClose();
        }}
        className="text-xs font-semibold text-accent-violet hover:underline cursor-pointer mb-6"
      >
        &larr; Back to Shop
      </button>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Camera className="w-6 h-6 text-pink-accent" />
          AI Refrigerator Scanner
        </h2>
        <p className="text-sm text-slate-600 font-semibold">
          Scan the inside of your fridge. AI detects your stock and lets you reorder low items instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Viewfinder */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full aspect-[4/3] max-w-2xl bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/50 relative shadow-lg">
            {/* Webcam video stream */}
            {useWebcam ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              /* Simulated Fridge Graphics */
              <div className="w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,40,217,0.08),transparent)] pointer-events-none"></div>
                <div className="w-44 h-56 bg-white rounded-2xl border border-slate-200 shadow-inner flex flex-col p-4 justify-between relative overflow-hidden">
                  <div className="h-0.5 w-full bg-slate-200"></div>
                  {/* Mock items inside illustrated fridge drawer */}
                  <div className="flex justify-around items-end">
                    <span className="text-3xl filter drop-shadow">🥛</span>
                    <span className="text-2xl opacity-60 animate-bounce">🥚</span>
                    <span className="text-2xl filter drop-shadow">🧈</span>
                    <span className="text-3xl filter drop-shadow">🍅</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-semibold mt-4">Simulating camera viewfinder</span>
              </div>
            )}

            {/* Canvas Overlay for YOLO Bounding Boxes */}
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={480}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
            />

            {/* Scanning Overlay (Overlay gradient and scanner text) */}
            {scanning && (
              <div className="absolute inset-0 bg-pink-500/5 flex items-center justify-center pointer-events-none z-20">
                <div className="glass-panel px-4 py-2 rounded-full text-xs font-bold text-pink-accent animate-pulse border border-pink-500/30 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI OBJECT AUDIT IN PROGRESS ({progress}%)</span>
                </div>
              </div>
            )}
          </div>

          {/* Camera controls */}
          <div className="flex flex-wrap gap-3 mt-4 w-full max-w-2xl justify-center">
            {useWebcam ? (
              <button 
                onClick={() => {
                  if (soundEnabled) sfx.play('click');
                  stopCamera();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 transition-all font-bold text-sm cursor-pointer"
              >
                <VideoOff className="w-4 h-4" />
                Turn Camera Off
              </button>
            ) : (
              <button 
                onClick={startCamera}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-bold text-sm cursor-pointer"
              >
                <Camera className="w-4 h-4 text-pink-accent" />
                Use Live Camera
              </button>
            )}

            <button 
              onClick={runScan}
              disabled={scanning}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-pink-accent text-white hover:opacity-90 font-extrabold text-sm cursor-pointer shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              {detectedItems.length > 0 ? "Re-scan Fridge" : "Start Audit"}
            </button>

            {/* Preset Toggle */}
            <select
              value={currentPreset}
              onChange={(e) => {
                if (soundEnabled) sfx.play('click');
                setCurrentPreset(e.target.value);
                setDetectedItems([]);
              }}
              className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="standard">Preset: Standard Fridge</option>
              <option value="empty">Preset: Empty Fridge</option>
            </select>
          </div>

          {cameraError && (
            <p className="text-xs text-rose-500 mt-2 text-center font-bold">{cameraError}</p>
          )}
        </div>

        {/* Right column: Audit logs */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="glass-panel rounded-3xl p-6 flex-grow flex flex-col justify-between border border-slate-200/50 shadow-md min-h-[350px]">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Stock Detection Log</h3>
              
              {scanning ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 border-4 border-pink-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-semibold text-slate-755">Auditing refrigerator shelf compartments...</p>
                  <p className="text-xs text-slate-500 mt-1">YOLOv8 vision scanning running</p>
                </div>
              ) : detectedItems.length > 0 ? (
                <div className="space-y-4">
                  {detectedItems.map((item, idx) => {
                    const isLow = item.level <= 20;
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          isLow 
                            ? 'bg-rose-500/5 border-rose-500/20' 
                            : 'bg-slate-100/50 border-slate-200/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isLow ? (
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <div>
                            <span className="text-sm font-bold text-slate-900 block leading-tight">{item.name}</span>
                            <span className="text-xs text-slate-655 font-medium">{item.label}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black ${isLow ? 'text-rose-600' : 'text-green-600'}`}>
                            {item.level}%
                          </span>
                          <span className="block text-[10px] text-slate-500 uppercase font-bold">Stock Level</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                  <Eye className="w-12 h-12 stroke-[1.5] mb-3 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">No scan completed yet</p>
                  <p className="text-xs max-w-xs mt-1 text-slate-500">Click "Start Audit" to run the computer vision mock model over the compartments.</p>
                </div>
              )}
            </div>

            {/* Warning and Bulk Reorder button */}
            {detectedItems.length > 0 && !scanning && (
              <div className="mt-8 pt-6 border-t border-slate-200/50">
                {lowItems.length > 0 ? (
                  <div>
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 mb-4 text-xs flex gap-3 text-rose-700 font-semibold">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                      <div>
                        <span className="font-extrabold text-slate-900 block mb-0.5">Critical Depletions Spotted</span>
                        You are almost out of {lowItems.map(i => i.name.toLowerCase().replace('farm fresh ', '').replace('red vine ', '')).join(' and ')}. Would you like to reorder?
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleBulkReorder}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-accent hover:opacity-90 font-extrabold text-white text-sm transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Reorder Low Stock Items (${lowItems.length === 1 ? '85' : '120'})
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-xs flex gap-3 text-green-700 font-semibold">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <span className="font-extrabold text-slate-900 block mb-0.5">Stock Healthy</span>
                      Your refrigerator compartments look fully stocked. No depletions detected.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
