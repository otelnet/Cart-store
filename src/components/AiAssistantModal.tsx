import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Zap,
  HelpCircle,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  isSourcingSuggestion?: boolean;
  sourcedData?: {
    title: string;
    price: number;
    marketPrice: number;
    image: string;
    sourceUrl?: string;
  };
}

export const AiAssistantModal: React.FC = () => {
  const {
    allProducts,
    addToCart,
    openProductDetail,
    formatPrice,
    currency,
    regionConfig,
    user,
    openSourcingModalWithQuery,
    addSourcedProductToCart,
    showToast,
  } = useShop();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! 👋 I am **Nova**, your CartNova AI Shopping & Sourcing Assistant.\n\nI can help you find products, compare prices, or source any unlisted item from **Jumia Nigeria** or global suppliers. What can I help you find today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '🔥 What are the best flash deals today?',
    '⚡ Find solar power stations & inverters',
    '🇳🇬 Can you source an item from Jumia Nigeria for me?',
    '💻 Recommend a developer laptop or gadgets',
    '📦 How fast is delivery to Nigeria and worldwide?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Build catalog context for AI
    const catalogSummary = allProducts
      .slice(0, 30)
      .map(
        (p) =>
          `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} (Original: $${p.originalPrice || p.price}) | Stock: ${p.stockCount}`
      )
      .join('\n');

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
          catalogContext: catalogSummary,
          userContext: {
            region: `${regionConfig.flag} ${regionConfig.name}`,
            currency,
            userName: user?.name || 'Customer',
            role: user?.role || 'customer',
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.fallbackReply || 'I found some great options for you!';

      // Identify if any product was mentioned in the text
      const mentionedProducts = allProducts.filter((p) =>
        query.toLowerCase().includes(p.name.toLowerCase().slice(0, 8)) ||
        replyText.toLowerCase().includes(p.name.toLowerCase())
      ).slice(0, 3);

      // Check if query is asking to source an unfound product
      const isSourcingQuery =
        query.toLowerCase().includes('jumia') ||
        query.toLowerCase().includes('source') ||
        query.toLowerCase().includes('http') ||
        query.toLowerCase().includes('can not find') ||
        query.toLowerCase().includes("can't find") ||
        mentionedProducts.length === 0 && (query.toLowerCase().includes('buy') || query.toLowerCase().includes('find'));

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: mentionedProducts.map((p) => p.id),
        isSourcingSuggestion: isSourcingQuery,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `I'm here to help! You can browse our store catalog, search any keyword above, or use our **Custom Sourcing Hub** to get items from Jumia Nigeria or international suppliers at factory prices.`,
          timestamp: 'Just now',
          isSourcingSuggestion: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductCardAddToCart = (prod: Product) => {
    addToCart(prod, 1);
    showToast(`Added "${prod.name}" to cart!`, 'success');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          id="open-ai-chat-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-white/20"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-900 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-black tracking-wide block leading-none">Nova AI</span>
            <span className="text-[10px] text-indigo-100 font-medium leading-none">Ask or Source Any Item</span>
          </div>
        </button>
      </div>

      {/* Expandable Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              className="w-full sm:max-w-lg h-[92vh] sm:h-[650px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-4 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
                    <Bot className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base text-white">Nova AI Shopping Assistant</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Product advice, Jumia Nigeria sourcing & instant estimates
                    </p>
                  </div>
                </div>

                <button
                  id="close-ai-chat-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>

                      {/* Product Recommendations inside Chat */}
                      {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Recommended Products from Catalog:
                          </p>
                          <div className="space-y-2">
                            {msg.suggestedProductIds.map((pid) => {
                              const product = allProducts.find((p) => p.id === pid);
                              if (!product) return null;
                              return (
                                <div
                                  key={pid}
                                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 hover:border-indigo-400 transition-all"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-xs text-slate-900 truncate">
                                      {product.name}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="font-black text-orange-600 font-display text-xs">
                                        {formatPrice(product.price)}
                                      </span>
                                      {product.originalPrice && (
                                        <span className="text-[10px] text-slate-400 line-through">
                                          {formatPrice(product.originalPrice)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => openProductDetail(product)}
                                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold cursor-pointer"
                                    >
                                      View
                                    </button>
                                    <button
                                      onClick={() => handleProductCardAddToCart(product)}
                                      className="p-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                                    >
                                      <ShoppingBag className="w-3 h-3" />
                                      <span>Add</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Sourcing Unfound Item Prompt inside Chat */}
                      {msg.isSourcingSuggestion && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs">
                              <Zap className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                              <span>Item not in warehouse catalog?</span>
                            </div>
                            <p className="text-[11px] text-amber-800">
                              Paste any product link or name from Jumia Nigeria, Amazon, or international stores. We will source it with factory savings!
                            </p>
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                openSourcingModalWithQuery(inputText || 'Tecno Camon 30');
                              }}
                              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>Open Sourcing Hub & Get Quote</span>
                              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                            </button>
                          </div>
                        </div>
                      )}

                      <span
                        className={`text-[9px] mt-1.5 block ${
                          msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 p-3 rounded-2xl w-fit">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span>Nova AI is searching store catalog & calculating estimates...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3.5 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask about products, prices, shipping, or paste a product link..."
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
