const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  brand: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Sneakers', 'Bags', 'Accessories', 'Vintage']
  },
  condition: { type: String, enum: ['Like New', 'Good', 'Fair'], default: 'Good' },
  size: { type: String, default: 'M' },
  price: { type: Number, required: true, min: 0 },
  aiGeneratedPrice: { type: Number, default: null },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['sell', 'swap'], default: 'sell' },
  status: { type: String, enum: ['active', 'sold', 'swapped'], default: 'active' },
  aiListed: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
