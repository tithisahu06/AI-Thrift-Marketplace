const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Multer setup for image uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'), false);
  }
});

// @route GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, condition, search, type, limit = 50, page = 1 } = req.query;
    const query = { status: 'active' };
    if (category && category !== 'All') query.category = category;
    if (condition) query.condition = condition;
    if (type) query.type = type;
    if (search) query.$text = { $search: search };

    const products = await Product.find(query)
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name avatar email');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.views += 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/products
router.post('/', protect, upload.array('images', 8), async (req, res) => {
  try {
    const { title, description, brand, category, condition, size, price, tags, type } = req.body;
    if (!title || !brand || !category || !price)
      return res.status(400).json({ message: 'title, brand, category, price are required' });

    const imagePaths = (req.files || []).map(f => `/uploads/${f.filename}`);
    const product = await Product.create({
      title, description, brand, category, condition, size,
      price: Number(price),
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      images: imagePaths,
      seller: req.user._id,
      type: type || 'sell',
      aiListed: req.body.aiListed === 'true'
    });
    await product.populate('seller', 'name avatar');
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
