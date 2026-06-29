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
const initialProducts = [
  {
    id: "p1",
    name: "Organic Whole Milk (1L)",
    price: 49,
    originalPrice: 59,
    category: "Dairy & Bread",
    rating: 4.8,
    reviews: 120,
    badge: "Best Seller",
    emoji: "🥛",
    fridgeStock: 80,
    fridgeQuantityText: "800ml left"
  },
  {
    id: "p2",
    name: "Farm Fresh Eggs (12 pcs)",
    price: 85,
    originalPrice: 95,
    category: "Dairy & Bread",
    rating: 4.9,
    reviews: 240,
    badge: "Low Stock",
    emoji: "🥚",
    fridgeStock: 8,
    fridgeQuantityText: "1 egg left"
  },
  {
    id: "p3",
    name: "Amul Salted Butter (100g)",
    price: 56,
    originalPrice: 60,
    category: "Dairy & Bread",
    rating: 4.7,
    reviews: 310,
    emoji: "🧈",
    fridgeStock: 75,
    fridgeQuantityText: "75g left"
  },
  {
    id: "p4",
    name: "Fresh Sourdough Bread (400g)",
    price: 65,
    originalPrice: 80,
    category: "Dairy & Bread",
    rating: 4.6,
    reviews: 85,
    emoji: "🍞",
    fridgeStock: 0,
    fridgeQuantityText: "Out of stock"
  },
  {
    id: "p5",
    name: "Red Vine Tomatoes (500g)",
    price: 35,
    originalPrice: 45,
    category: "Fruits & Veggies",
    rating: 4.5,
    reviews: 150,
    badge: "Low Stock",
    emoji: "🍅",
    fridgeStock: 15,
    fridgeQuantityText: "2 tomatoes left"
  },
  {
    id: "p6",
    name: "Fresh Potatoes (1kg)",
    price: 28,
    originalPrice: 38,
    category: "Fruits & Veggies",
    rating: 4.4,
    reviews: 98,
    emoji: "🥔",
    fridgeStock: 90,
    fridgeQuantityText: "5 potatoes left"
  },
  {
    id: "p7",
    name: "Sweet Bananas (6 pcs)",
    price: 45,
    originalPrice: 55,
    category: "Fruits & Veggies",
    rating: 4.8,
    reviews: 180,
    emoji: "🍌",
    fridgeStock: 0,
    fridgeQuantityText: "Out of stock"
  },
  {
    id: "p8",
    name: "Fresh Apples (4 pcs)",
    price: 120,
    originalPrice: 140,
    category: "Fruits & Veggies",
    rating: 4.7,
    reviews: 115,
    emoji: "🍎",
    fridgeStock: 60,
    fridgeQuantityText: "3 apples left"
  },
  {
    id: "p9",
    name: "Maggi 2-Min Noodles (6-Pack)",
    price: 84,
    originalPrice: 96,
    category: "Munchies",
    rating: 4.9,
    reviews: 512,
    badge: "Hot Deal",
    emoji: "🍜",
    fridgeStock: 50,
    fridgeQuantityText: "3 packets left"
  },
  {
    id: "p10",
    name: "Lay's Classic Salted Chips",
    price: 20,
    originalPrice: 20,
    category: "Munchies",
    rating: 4.6,
    reviews: 320,
    emoji: "🥔",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p11",
    name: "Tender Chicken Breast (500g)",
    price: 180,
    originalPrice: 220,
    category: "Meats & Seafood",
    rating: 4.8,
    reviews: 190,
    badge: "Freshly Cut",
    emoji: "🍗",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p12",
    name: "Tomato Puree & Cream Mix",
    price: 90,
    originalPrice: 110,
    category: "Pantry",
    rating: 4.5,
    reviews: 40,
    emoji: "🥫",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },
  {
    id: "p13",
    name: "Indian Butter Chicken Spices",
    price: 45,
    originalPrice: 50,
    category: "Pantry",
    rating: 4.9,
    reviews: 80,
    emoji: "🌶️",
    fridgeStock: 100,
    fridgeQuantityText: "Full packet"
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

    // Seed products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("Seeding products to database...");
      await Product.insertMany(initialProducts);
      console.log("Product seeding completed.");
    }
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
