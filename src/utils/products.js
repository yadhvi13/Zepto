export const products = [
  // Dairy, Bread & Eggs
  {
    id: "p1",
    name: "Organic Whole Milk (1L)",
    price: 2.99,
    originalPrice: 3.49,
    category: "Dairy & Bread",
    rating: 4.8,
    reviews: 120,
    badge: "Best Seller",
    emoji: "🥛",
    fridgeStock: 80, // percentage for scanner
    fridgeQuantityText: "800ml left"
  },
  {
    id: "p2",
    name: "Farm Fresh Eggs (12 pcs)",
    price: 3.99,
    originalPrice: 4.49,
    category: "Dairy & Bread",
    rating: 4.9,
    reviews: 240,
    badge: "Low Stock",
    emoji: "🥚",
    fridgeStock: 8, // critically low
    fridgeQuantityText: "1 egg left"
  },
  {
    id: "p3",
    name: "Amul Salted Butter (100g)",
    price: 3.49,
    originalPrice: 3.99,
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
    price: 2.49,
    originalPrice: 2.99,
    category: "Dairy & Bread",
    rating: 4.6,
    reviews: 85,
    emoji: "🍞",
    fridgeStock: 0,
    fridgeQuantityText: "Out of stock"
  },

  // Fruits & Veggies
  {
    id: "p5",
    name: "Red Vine Tomatoes (500g)",
    price: 1.99,
    originalPrice: 2.49,
    category: "Fruits & Veggies",
    rating: 4.5,
    reviews: 150,
    badge: "Low Stock",
    emoji: "🍅",
    fridgeStock: 15, // low stock
    fridgeQuantityText: "2 tomatoes left"
  },
  {
    id: "p6",
    name: "Fresh Potatoes (1kg)",
    price: 1.49,
    originalPrice: 1.99,
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
    price: 1.29,
    originalPrice: 1.59,
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
    price: 3.99,
    originalPrice: 4.99,
    category: "Fruits & Veggies",
    rating: 4.7,
    reviews: 115,
    emoji: "🍎",
    fridgeStock: 60,
    fridgeQuantityText: "3 apples left"
  },

  // Munchies & Snacks
  {
    id: "p9",
    name: "Maggi 2-Min Noodles (6-Pack)",
    price: 4.49,
    originalPrice: 4.99,
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
    price: 1.79,
    originalPrice: 1.99,
    category: "Munchies",
    rating: 4.6,
    reviews: 320,
    emoji: "🥔",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },

  // Meats & Fish
  {
    id: "p11",
    name: "Tender Chicken Breast (500g)",
    price: 7.99,
    originalPrice: 9.99,
    category: "Meats & Seafood",
    rating: 4.8,
    reviews: 190,
    badge: "Freshly Cut",
    emoji: "🍗",
    fridgeStock: 0,
    fridgeQuantityText: "None"
  },

  // Pantry & Spices
  {
    id: "p12",
    name: "Tomato Puree & Cream Mix",
    price: 3.49,
    originalPrice: 3.99,
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
    price: 1.99,
    originalPrice: 2.49,
    category: "Pantry",
    rating: 4.9,
    reviews: 80,
    emoji: "🌶️",
    fridgeStock: 100,
    fridgeQuantityText: "Full packet"
  }
];

export const categories = [
  { 
    name: "Fruits & Veggies", 
    emoji: "🥦", 
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&h=120&q=80",
    color: "from-green-500/20 to-emerald-500/20" 
  },
  { 
    name: "Dairy & Bread", 
    emoji: "🥛", 
    image: "https://images.unsplash.com/photo-1528498033973-180a4df4e8a4?auto=format&fit=crop&w=120&h=120&q=80",
    color: "from-blue-500/20 to-sky-500/20" 
  },
  { 
    name: "Munchies", 
    emoji: "🍟", 
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?auto=format&fit=crop&w=120&h=120&q=80",
    color: "from-yellow-500/20 to-amber-500/20" 
  },
  { 
    name: "Meats & Seafood", 
    emoji: "🥩", 
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=120&h=120&q=80",
    color: "from-red-500/20 to-rose-500/20" 
  },
  { 
    name: "Pantry", 
    emoji: "🧂", 
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=120&h=120&q=80",
    color: "from-purple-500/20 to-indigo-500/20" 
  }
];
