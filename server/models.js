import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cart: [
    {
      productId: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, default: "" },
  weight: { type: String, default: "" },
  discountPercent: { type: Number, default: 0 },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  badge: { type: String, default: null },
  emoji: { type: String, required: true },
  image: { type: String, required: true },
  fridgeStock: { type: Number, default: 0 },
  fridgeQuantityText: { type: String, default: "" }
});

export const User = mongoose.model('User', UserSchema);
export const Product = mongoose.model('Product', ProductSchema);
