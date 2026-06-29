import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, Product } from './models.js';
import { authMiddleware } from './authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'zepto_ai_secret_token_123';

app.use(cors());
app.use(express.json());

// In-memory OTP store (phone -> otp)
const otpStore = new Map();

// Local memory fallbacks if MongoDB connection fails
let mongoConnected = false;
let mockUsers = [];
let mockProducts = [];

// Default Catalog Seed Items
// Default Catalog Seed Items
const initialProducts = [
  {
    id: "p1",
    name: "Artisanal Cold Brew Coffee (250ml)",
    price: 3.99,
    originalPrice: 4.49,
    category: "Cafe",
    rating: 4.8,
    reviews: 120,
    badge: "Best Seller",
    emoji: "☕",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 80,
    fridgeQuantityText: "200ml left"
  },
  {
    id: "p2",
    name: "Warm Chocolate Croissant",
    price: 2.49,
    originalPrice: 2.99,
    category: "Cafe",
    rating: 4.9,
    reviews: 240,
    emoji: "🥐",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p3",
    name: "Hot Matcha Latte (12oz)",
    price: 4.49,
    originalPrice: 4.99,
    category: "Cafe",
    rating: 4.7,
    reviews: 88,
    emoji: "🍵",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 100,
    fridgeQuantityText: "Full cup"
  },
  {
    id: "p4",
    name: "Scented Soy Wax Candle",
    price: 8.99,
    originalPrice: 10.99,
    category: "Home",
    rating: 4.6,
    reviews: 154,
    badge: "Hot Deal",
    emoji: "🕯️",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p5",
    name: "Microfiber Cleaning Cloths (5pk)",
    price: 4.99,
    originalPrice: 5.99,
    category: "Home",
    rating: 4.5,
    reviews: 98,
    emoji: "🧹",
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 100,
    fridgeQuantityText: "5 cloths left"
  },
  {
    id: "p6",
    name: "Soft Teddy Bear Plush Toy",
    price: 12.99,
    originalPrice: 14.99,
    category: "Toys",
    rating: 4.9,
    reviews: 310,
    badge: "New Arrival",
    emoji: "🧸",
    image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p7",
    name: "Rubik's Speed Cube 3x3",
    price: 6.99,
    originalPrice: 7.99,
    category: "Toys",
    rating: 4.7,
    reviews: 145,
    emoji: "🎲",
    image: "https://images.unsplash.com/photo-1591290619616-43e9900c7b3c?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p8",
    name: "Organic Strawberries (250g)",
    price: 4.49,
    originalPrice: 4.99,
    category: "Fresh",
    rating: 4.8,
    reviews: 210,
    badge: "Freshly Picked",
    emoji: "🍓",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 40,
    fridgeQuantityText: "100g left"
  },
  {
    id: "p9",
    name: "Fresh Hass Avocado (2pk)",
    price: 3.49,
    originalPrice: 3.99,
    category: "Fresh",
    rating: 4.7,
    reviews: 180,
    badge: "Low Stock",
    emoji: "🥑",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 8,
    fridgeQuantityText: "1 avocado left"
  },
  {
    id: "p10",
    name: "Pre-Washed Baby Spinach (150g)",
    price: 2.99,
    originalPrice: 3.49,
    category: "Fresh",
    rating: 4.6,
    reviews: 125,
    emoji: "🥬",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 60,
    fridgeQuantityText: "90g left"
  },
  {
    id: "p11",
    name: "Anker USB-C Fast Charger 30W",
    price: 14.99,
    originalPrice: 17.99,
    category: "Electronics",
    rating: 4.8,
    reviews: 420,
    emoji: "🔌",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p12",
    name: "Wireless Bluetooth Earbuds",
    price: 24.99,
    originalPrice: 29.99,
    category: "Electronics",
    rating: 4.5,
    reviews: 320,
    badge: "Best Value",
    emoji: "🎧",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p13",
    name: "Silicon Clear Shockproof Phone Case",
    price: 9.99,
    originalPrice: 12.99,
    category: "Mobiles",
    rating: 4.6,
    reviews: 185,
    emoji: "📱",
    image: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p14",
    name: "Tempered Glass Screen Protector",
    price: 5.99,
    originalPrice: 7.99,
    category: "Mobiles",
    rating: 4.7,
    reviews: 290,
    badge: "Trending",
    emoji: "💎",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p15",
    name: "Hydrating Aloe Vera Skin Gel (200ml)",
    price: 6.49,
    originalPrice: 7.99,
    category: "Beauty",
    rating: 4.8,
    reviews: 340,
    emoji: "🧴",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 90,
    fridgeQuantityText: "Almost full"
  },
  {
    id: "p16",
    name: "Organic Coconut Butter Lip Balm",
    price: 2.99,
    originalPrice: 3.49,
    category: "Beauty",
    rating: 4.7,
    reviews: 112,
    emoji: "💄",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 50,
    fridgeQuantityText: "Half used"
  },
  {
    id: "p17",
    name: "Classic White Cotton Crew Tee",
    price: 15.99,
    originalPrice: 19.99,
    category: "Fashion",
    rating: 4.8,
    reviews: 580,
    badge: "Must Have",
    emoji: "👕",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p18",
    name: "Cosy Woolen Socks (2-Pack)",
    price: 6.99,
    originalPrice: 8.99,
    category: "Fashion",
    rating: 4.9,
    reviews: 230,
    emoji: "🧦",
    image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=300&h=300&q=80",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  }
];

// Initialize and seed MongoDB database
const initDb = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zepto_clone';
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    // Connect with a 4s timeout to trigger mock fallback quickly if MongoDB is not running
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000
    });
    mongoConnected = true;
    console.log("Connected to MongoDB successfully!");

    // Seed products (always clean and sync to refresh prices to dollars)
    console.log("Seeding products to database...");
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log("Product seeding completed.");
  } catch (err) {
    console.warn("MongoDB connection failed! Falling back to safe In-Memory mode.");
    console.warn(`Reason: ${err.message}`);
    mongoConnected = false;
    mockProducts = [...initialProducts];
  }
};

initDb();

// ----------------------------------------
// API ENDPOINTS
// ----------------------------------------

// 1. Send OTP route (Generates 4-digit code)
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Generate 4-digit OTP code (e.g. 4829)
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(phone, otp);

  console.log(`[SMS OTP Simulator] To: ${phone} | Verification Code: ${otp}`);
  
  // Return code in response for client toast simulation
  return res.json({ 
    message: 'OTP sent successfully',
    demoOtp: otp 
  });
});

// 2. Verify OTP route (Login or register user)
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP code are required' });
  }

  const storedOtp = otpStore.get(phone);
  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).json({ message: 'Invalid or expired OTP verification code' });
  }

  // Clear OTP code once verified
  otpStore.delete(phone);

  let userId;
  let userObj;

  if (mongoConnected) {
    try {
      let user = await User.findOne({ phone });
      if (!user) {
        // Sign up new user
        user = new User({ phone, cart: [] });
        await user.save();
        console.log(`Registered new user in MongoDB: ${phone}`);
      } else {
        console.log(`Logged in existing user from MongoDB: ${phone}`);
      }
      userId = user._id;
      userObj = user;
    } catch (err) {
      return res.status(500).json({ message: 'Database error during authentication', error: err.message });
    }
  } else {
    // In-memory mock authentication fallback
    let user = mockUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        _id: `mock_user_${Math.random().toString(36).substr(2, 9)}`,
        phone,
        cart: [],
        createdAt: new Date()
      };
      mockUsers.push(user);
      console.log(`Registered mock user in memory: ${phone}`);
    }
    userId = user._id;
    userObj = user;
  }

  // Sign JWT token
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    message: 'Authentication successful',
    token,
    user: {
      id: userId,
      phone: userObj.phone,
      cart: userObj.cart
    }
  });
});

// Helper middleware for mock authorization when mongo is offline
const checkAuth = async (req, res, next) => {
  if (mongoConnected) {
    return authMiddleware(req, res, next);
  }
  
  // Mock auth check
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = mockUsers.find(u => u._id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Session user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token session' });
  }
};

// 3. Get currently logged-in user profile
app.get('/api/auth/me', checkAuth, (req, res) => {
  return res.json({
    user: {
      id: req.user._id || req.user.id,
      phone: req.user.phone,
      cart: req.user.cart
    }
  });
});

// 4. Get catalog products list
app.get('/api/products', async (req, res) => {
  if (mongoConnected) {
    try {
      const items = await Product.find();
      return res.json(items);
    } catch (err) {
      return res.status(500).json({ message: 'Error retrieving products catalog' });
    }
  } else {
    return res.json(mockProducts);
  }
});

// 5. Get user cart
app.get('/api/cart', checkAuth, (req, res) => {
  return res.json({ cart: req.user.cart });
});

// 6. Update/Sync user cart
app.post('/api/cart', checkAuth, async (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart)) {
    return res.status(400).json({ message: 'Cart list must be an array' });
  }

  req.user.cart = cart;

  if (mongoConnected) {
    try {
      await User.findByIdAndUpdate(req.user._id, { cart });
      return res.json({ message: 'Cart synced to MongoDB', cart });
    } catch (err) {
      return res.status(500).json({ message: 'Error syncing cart to database' });
    }
  } else {
    // In-memory update
    const idx = mockUsers.findIndex(u => u._id === req.user._id);
    if (idx !== -1) {
      mockUsers[idx].cart = cart;
    }
    return res.json({ message: 'Cart synced to memory', cart });
  }
});

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(` Zepto MERN Backend server is running! `);
  console.log(` Port: http://localhost:${PORT} `);
  console.log(`========================================`);
});
