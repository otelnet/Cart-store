import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with User-Agent header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Shopping Assistant Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], catalogContext = '', userContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Graceful fallback if GEMINI_API_KEY is not set yet
      return res.json({
        reply: `Hello! I'm your CartNova AI Shopping Assistant. I can help you find products, compare prices, source items from Jumia Nigeria or global suppliers, and track your orders. How can I help you today?`,
        suggestedProducts: [],
      });
    }

    const systemInstruction = `You are "Nova", the expert AI Shopping Assistant for CartNova — a modern multi-region e-commerce marketplace and global sourcing platform offering factory-direct prices, free express shipping to Nigeria and worldwide, and custom product sourcing for items not found in the standard catalog.

Catalog Information & Available Products Context:
${catalogContext || 'Wide variety of electronics, solar generators, smartphones, laptops, fashion, kitchen appliances, and developer kits.'}

User Context:
- Current Region: ${userContext?.region || 'Nigeria (NG)'}
- Current Currency: ${userContext?.currency || 'NGN'}
- User Name: ${userContext?.userName || 'Valued Customer'}
- User Role: ${userContext?.role || 'customer'}

Your capabilities:
1. Recommend products from the catalog that match the user's inquiry, budget, or specifications.
2. If the user asks for an item NOT in the catalog (e.g. specific phone models, designer shoes, car parts, industrial gear, Jumia or Amazon links), enthusiastically explain how CartNova can source it directly with factory savings and doorstep delivery.
3. Answer questions regarding shipping times (3-5 days in Nigeria, 5-8 days international), payment options (Cards, Bank Transfer, Paystack, Escrow), returns, and order tracking.
4. Always be friendly, concise, and helpful. Format responses with clean Markdown bullet points and bold highlights. Keep answers easy to read on mobile.`;

    const contents: any[] = [];

    // Add conversation history
    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory.slice(-8)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant' || item.sender === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }

    // Add current user prompt
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am here to help you shop! What are you looking for today?';

    res.json({
      reply,
    });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error.message || String(error),
      fallbackReply: `I am currently experiencing high demand, but I'm ready to help you search our store catalog or source any custom product from Jumia / global suppliers!`,
    });
  }
});

// AI Product Link Parser Endpoint (for Admin adding products or customers sourcing items)
app.post('/api/gemini/parse-link', async (req, res) => {
  const urlOrQuery = typeof req.body?.urlOrQuery === 'string' ? req.body.urlOrQuery : '';
  try {
    if (!urlOrQuery) {
      return res.status(400).json({ error: 'URL or product query is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Smart algorithmic parsing fallback
      const clean = urlOrQuery.replace(/^https?:\/\//, '').replace(/^www\./, '');
      const slug = clean.split('/')[1] || clean;
      const cleanTitle = slug.replace(/[-_]/g, ' ').replace(/\.html?$/, '').slice(0, 60);
      const title = cleanTitle ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1) : urlOrQuery;

      return res.json({
        name: title || 'Custom Sourced Product',
        tagline: 'Direct Factory & Marketplace Deal',
        category: 'electronics',
        price: 39.99,
        originalPrice: 89.0,
        image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        description: `Imported directly via CartNova verified suppliers. Premium quality assured.`,
        stockCount: 45,
        badge: '⚡ Verified Source',
      });
    }

    const prompt = `Analyze the following product URL or query and extract structured e-commerce product details in valid JSON:
Input: "${urlOrQuery}"

Return JSON matching this exact structure:
{
  "name": "Clean short product title (under 50 chars)",
  "tagline": "Catchy benefit or model summary (under 40 chars)",
  "category": "one of: electronics, solar_energy, smartphones, computers, fashion, home_living, developer_tools",
  "price": number (estimated wholesale/factory price in USD),
  "originalPrice": number (estimated standard market/retail price in USD, usually 2x price),
  "image": "a realistic Unsplash image URL related to the item type",
  "description": "2-3 sentence engaging product summary highlighting key specs and durability",
  "stockCount": number (e.g. between 20 and 100),
  "badge": "e.g. 🔥 Direct Factory, ⚡ Flash Deal, 🇳🇬 Jumia Match, or 🏆 Top Rated"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    res.json(parsedJson);
  } catch (error: any) {
    console.error('Link Parser Error:', error);
    res.json({
      name: urlOrQuery.slice(0, 50),
      tagline: 'Direct Sourced Product',
      category: 'electronics',
      price: 29.99,
      originalPrice: 65.0,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      description: 'High performance verified item sourced via global wholesale channels.',
      stockCount: 30,
      badge: '⚡ Verified',
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CartNova server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
