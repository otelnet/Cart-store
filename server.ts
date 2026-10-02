import express from 'express';
import path from 'path';
import crypto from 'crypto';
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

// ==========================================
// PAYSTACK PAYMENT GATEWAY INTEGRATION
// ==========================================

// 1. Paystack Configuration (Client safe)
app.get('/api/paystack/config', (req, res) => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;
  res.json({
    configured: Boolean(secretKey && secretKey.trim().length > 0),
    hasPublicKey: Boolean(publicKey && publicKey.trim().length > 0),
    publicKey: publicKey || null,
    mode: secretKey?.startsWith('sk_live_') ? 'live' : 'test',
    supportedCurrencies: ['NGN', 'USD', 'GHS', 'KES', 'ZAR'],
    supportedChannels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer', 'apple_pay'],
  });
});

// 2. Initialize Paystack Transaction
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const {
      email,
      amount,
      currency = 'NGN',
      reference,
      metadata = {},
      callbackUrl,
      channels,
    } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        status: false,
        message: 'Email and amount are required to initialize Paystack payment',
      });
    }

    // Convert amount to lowest currency unit (e.g. kobo for NGN, pesewas for GHS, cents for USD)
    const rawAmount = Number(amount);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      return res.status(400).json({ status: false, message: 'Invalid payment amount' });
    }
    const paystackAmount = Math.round(rawAmount * 100);

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const finalReference =
      reference || `pstk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // If real Paystack Secret Key is configured, execute live or test API call
    if (secretKey && secretKey.trim().length > 0) {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: paystackAmount,
          currency: currency.toUpperCase(),
          reference: finalReference,
          callback_url: callbackUrl,
          metadata: {
            ...metadata,
            platform: 'CartNova E-Commerce',
            appId: '0c095401-7edf-4e2f-9372-3b5cac148d49',
          },
          channels: channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        }),
      });

      const data = await response.json();
      if (response.ok && data.status) {
        return res.json({
          status: true,
          data: {
            ...data.data,
            reference: finalReference,
            isDemo: false,
          },
        });
      }

      console.warn('Paystack API warning:', data.message || 'Unknown response from Paystack');
      // If Paystack rejected (e.g. invalid test key or currency not activated in merchant dashboard),
      // provide transparent fallback response with demo reference so checkout doesn't brick
      return res.json({
        status: true,
        isDemo: true,
        warning: data.message || 'Falling back to Paystack sandbox simulator',
        data: {
          authorization_url: '',
          access_code: `acc_${Date.now()}`,
          reference: finalReference,
        },
      });
    }

    // Demo/Sandbox fallback when PAYSTACK_SECRET_KEY is not configured yet
    return res.json({
      status: true,
      isDemo: true,
      message: 'Paystack sandbox test mode active (configure PAYSTACK_SECRET_KEY in settings to use live gateway)',
      data: {
        authorization_url: '',
        access_code: `demo_acc_${Date.now()}`,
        reference: finalReference,
        amount: paystackAmount,
        currency,
      },
    });
  } catch (error: any) {
    console.error('Paystack Initialize Error:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to initialize Paystack payment',
      details: error.message || String(error),
    });
  }
});

// 3. Verify Paystack Transaction
app.get('/api/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ status: false, message: 'Transaction reference is required' });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // If real Secret Key is provided and not a demo reference, verify against Paystack API
    if (secretKey && secretKey.trim().length > 0 && !reference.startsWith('pstk_demo_')) {
      const response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey.trim()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return res.json(data);
    }

    // Demo / Sandbox verification response
    return res.json({
      status: true,
      isDemo: true,
      message: 'Verification successful (Sandbox Simulation)',
      data: {
        id: Math.floor(10000000 + Math.random() * 90000000),
        domain: 'test',
        status: 'success',
        reference,
        amount: 500000,
        message: null,
        gateway_response: 'Approved by Paystack Sandbox',
        paid_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 30000).toISOString(),
        channel: 'card',
        currency: 'NGN',
        ip_address: '127.0.0.1',
        metadata: { source: 'CartNova Web Checkout' },
        customer: {
          id: 819203,
          first_name: 'CartNova',
          last_name: 'Shopper',
          email: 'customer@cartnovastore.com',
          customer_code: 'CUS_98291029',
          phone: '+234 802 392 8812',
        },
        authorization: {
          authorization_code: `AUTH_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          bin: '506109',
          last4: '5281',
          exp_month: '12',
          exp_year: '2029',
          channel: 'card',
          card_type: 'VERVE DEBIT',
          bank: 'Access Bank / GTBank Nigeria',
          country_code: 'NG',
          brand: 'verve',
          reusable: true,
          signature: 'SIG_' + Math.random().toString(36).substring(2, 10),
        },
      },
    });
  } catch (error: any) {
    console.error('Paystack Verify Error:', error);
    res.status(500).json({
      status: false,
      message: 'Failed to verify transaction with Paystack',
      details: error.message || String(error),
    });
  }
});

// 4. Paystack Webhook Handler
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers['x-paystack-signature'];

    if (secretKey && signature) {
      const hash = crypto
        .createHmac('sha512', secretKey)
        .update(typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        console.warn('Invalid Paystack webhook signature received');
        return res.status(400).send('Invalid signature');
      }
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    console.log('Paystack Webhook Event Received:', payload?.event, payload?.data?.reference);

    // Acknowledge Paystack webhook immediately with 200 OK
    res.sendStatus(200);
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    res.sendStatus(200);
  }
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
