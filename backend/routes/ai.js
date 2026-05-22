const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const fs = require('fs');
const router = express.Router();

let genAI;
try {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
} catch (e) {
  console.log('Gemini AI not initialized:', e.message);
}

// Helper: mock response when no API key
const mockListing = (hint = '') => ({
  title: hint || 'Vintage Oversized Denim Jacket — 90s Style',
  description: 'A beautifully aged vintage denim jacket with authentic distressing. Features classic button-front closure, chest pockets, and a relaxed silhouette perfect for layering. Ideal for streetwear or casual everyday looks.',
  category: 'Outerwear',
  brand: "Levi's",
  tags: ['#vintage', '#denim', '#90s', '#streetwear', '#oversized', '#jacket'],
  suggestedPrice: { min: 750, max: 1100, recommended: 899 },
  condition: 'Good'
});

// @route POST /api/ai/generate-listing
router.post('/generate-listing', protect, async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', brand, category, condition } = req.body;

    if (!genAI) {
      // Graceful fallback — return mock data
      return res.json({ success: true, data: mockListing(), mock: true });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert fashion marketplace listing assistant. Analyze this clothing image and return a JSON object with:
- title: compelling product title (max 60 chars)
- description: detailed seller description (2-3 sentences)
- category: one of [Tops, Bottoms, Dresses, Outerwear, Sneakers, Bags, Accessories, Vintage]
- brand: detected or inferred brand name (use "Unknown" if unclear)
- tags: array of 5-6 relevant hashtags for discoverability
- suggestedPrice: { min, max, recommended } in Indian Rupees (₹) based on brand, condition, and market value
- condition: one of [Like New, Good, Fair]
Hints: brand=${brand || 'unknown'}, category=${category || 'unknown'}, condition=${condition || 'unknown'}
Return ONLY valid JSON, no markdown.`;

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();
    const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(jsonStr);

    res.json({ success: true, data });
  } catch (err) {
    console.error('AI generate-listing error:', err.message);
    res.json({ success: true, data: mockListing(), mock: true, error: err.message });
  }
});

// @route POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!genAI) {
      const replies = [
        "I'd love to help with that! Try pairing it with some straight-cut jeans and white sneakers for a clean, effortless look. 🤍",
        "For that vibe, try earthy tones — terracotta, sage, or beige. These colors are everywhere this season! 🍂",
        "Based on current trends, I'd recommend a casual-chic look with an oversized blazer and wide-leg trousers. ✨",
        "That's a classic combination! Add a chunky belt to define the waist and you're set. 💫",
        "I found several matching pieces in the marketplace. Want me to curate a complete outfit board for you?"
      ];
      return res.json({ reply: replies[Math.floor(Math.random() * replies.length)], mock: true });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const systemPrompt = `You are Aria, a friendly and knowledgeable AI fashion stylist for WearAI, a sustainable thrift marketplace. 
You help users find great outfits, give styling advice, suggest color combinations, and recommend items from the marketplace.
Keep responses concise (2-4 sentences), warm, and include relevant emojis. 
Always encourage sustainable/thrift fashion choices.`;

    const formattedHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "I'm Aria, your AI fashion stylist! I'm here to help you find amazing outfits and styling advice. What can I help you with today? ✨" }] },
        ...formattedHistory
      ]
    });

    const result = await chat.sendMessage(message);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.json({ reply: "I'm having a moment — try again shortly! Meanwhile, check out our trending picks. ✨", mock: true });
  }
});

// @route POST /api/ai/price-predict
router.post('/price-predict', async (req, res) => {
  try {
    const { brand, category, condition, size } = req.body;

    if (!genAI) {
      const base = { 'Like New': 1.2, 'Good': 1.0, 'Fair': 0.7 }[condition] || 1.0;
      const catBase = { Outerwear: 900, Dresses: 650, Sneakers: 1100, Bags: 1800, Tops: 400, Bottoms: 600, Accessories: 300 }[category] || 500;
      const recommended = Math.round(catBase * base);
      return res.json({ min: Math.round(recommended * 0.85), max: Math.round(recommended * 1.15), recommended, mock: true });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a pricing expert for a second-hand clothing marketplace in India.
Estimate a fair resale price in Indian Rupees (₹) for:
- Brand: ${brand}
- Category: ${category}
- Condition: ${condition}
- Size: ${size}
Return ONLY a JSON: { "min": number, "max": number, "recommended": number }
No markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/```json\n?|\n?```/g, '').trim();
    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error('Price predict error:', err.message);
    res.json({ min: 400, max: 900, recommended: 650, mock: true });
  }
});

module.exports = router;
