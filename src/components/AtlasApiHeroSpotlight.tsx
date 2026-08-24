import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Globe,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Play,
  ExternalLink,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  ArrowRight,
  Database,
  Code2,
  Lock,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../data/mockData';

export const AtlasApiHeroSpotlight: React.FC = () => {
  const { addToCart, showToast, formatPrice, openProductDetail, setSelectedCategory, setSearchQuery } = useShop();

  const defaultAtlasProduct = PRODUCTS.find((p) => p.id === 'atlas-api') || PRODUCTS[0];
  const atlasProduct = defaultAtlasProduct;

  const fallbackEndpoint = {
    method: 'GET' as const,
    path: '/unit',
    description: 'Retrieve a complete list of all academic curriculum units published on the Atlas site.',
    sampleParams: { page: '1', limit: '10' },
    sampleResponse: {
      status: 200,
      success: true,
      total_units: 142,
      results: [
        { id: 'unit_101', title: 'Grade 10 - Intro to Algorithms & Computational Logic', time_frame: 'Semester 1', start_date: '2026-09-01', last_updated: '2026-08-16' },
        { id: 'unit_102', title: 'AP Chemistry - Molecular Thermodynamics & Equilibrium', time_frame: 'Quarter 2', start_date: '2026-10-15', last_updated: '2026-08-14' },
        { id: 'unit_103', title: 'World Literature - Post-Colonial Narratives & Semiotics', time_frame: 'Semester 1', start_date: '2026-09-08', last_updated: '2026-08-10' }
      ]
    }
  };

  const endpoints = atlasProduct?.apiDetails?.endpoints?.length ? atlasProduct.apiDetails.endpoints : [fallbackEndpoint];

  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [selectedParamId, setSelectedParamId] = useState('unit_101');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'docs' | 'curl'>('sandbox');

  const currentEndpoint = endpoints[selectedEndpointIndex] || endpoints[0] || fallbackEndpoint;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRunRequest = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
      showToast(`200 OK • Response retrieved in 34ms`, 'success');
    }, 400);
  };

  const curlSnippet = `curl -X ${currentEndpoint?.method || 'GET'} "${atlasProduct?.apiDetails?.baseUrl || 'https://api.onatlas.com'}${currentEndpoint?.path || '/unit'}" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Accept: application/json"`;

  const jsFetchSnippet = `const response = await fetch("${atlasProduct?.apiDetails?.baseUrl || 'https://api.onatlas.com'}${currentEndpoint?.path || '/unit'}", {
  method: "${currentEndpoint?.method || 'GET'}",
  headers: {
    "Authorization": "Bearer YOUR_API_TOKEN",
    "Accept": "application/json"
  }
});
const data = await response.json();
console.log(data);`;

  return (
    <div id="atlas-api-spotlight" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8 transition-all">
      {/* Top Banner & PublicAPIs.io Atlas API Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
            <span>PublicAPIs.io</span>
            <span>/</span>
            <button 
              onClick={() => setSelectedCategory('development')}
              className="hover:underline text-indigo-200 cursor-pointer"
            >
              Development
            </button>
            <span>/</span>
            <span className="text-white font-bold">Atlas API</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% Uptime
            </span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-xs font-bold">
              Latency: 34ms
            </span>
          </div>
        </div>

        {/* Main API Info Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-inner overflow-hidden p-2">
              <Globe className="w-10 h-10 text-indigo-300" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                  Atlas API
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[11px] font-black tracking-tight">
                  ⭐ PUBLICAPIS.IO VERIFIED
                </span>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-3">
                Official REST API for school curriculum maps, instructional units, assessment rubrics, and academic standards alignment.
              </p>

              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  HTTPS: Yes
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  Auth: Bearer Token
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  CORS: Supported
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-bold text-[11px] border border-slate-700 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  4.95 (1,840 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                addToCart(atlasProduct, 1);
                showToast('Atlas API developer access added to your cart/procurement!', 'success');
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Get API Key • Free Tier</span>
            </button>

            <button
              onClick={() => openProductDetail(atlasProduct)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/20 cursor-pointer transition-colors"
            >
              <span>Full API Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Base URL Quick Copy Strip */}
      <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono text-slate-700">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Base URL:</span>
          <code className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-900 font-bold">
            https://api.onatlas.com
          </code>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleCopy('https://api.onatlas.com', 'Base URL')}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            {copiedField === 'Base URL' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Base URL</span>
          </button>

          <a
            href="https://publicapis.io/atlas-api"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
          >
            <span>View on PublicAPIs.io</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Sandbox & Endpoint Explorer */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>Interactive Atlas API Endpoint Explorer & Sandbox</span>
            </h3>
            <p className="text-xs text-slate-500">
              Test real API endpoints, customize parameters, and preview structured JSON outputs in real-time.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'sandbox' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Playground
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'curl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              cURL & Fetch
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'docs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Schema & Specs
            </button>
          </div>
        </div>

        {/* Endpoints Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {endpoints.map((ep, idx) => {
            const isSelected = idx === selectedEndpointIndex;
            return (
              <button
                key={ep.path}
                onClick={() => {
                  setSelectedEndpointIndex(idx);
                  setHasExecuted(true);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 font-mono">
                    {ep.method}
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-800 truncate">
                    {ep.path}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {ep.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === 'sandbox' && (
          <div className="space-y-4">
            {/* Request Bar */}
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-xl text-xs font-mono text-emerald-400 font-bold shrink-0">
                <span>{currentEndpoint?.method || 'GET'}</span>
              </div>

              <div className="flex-1 flex items-center px-3 py-1 font-mono text-xs text-slate-200 overflow-x-auto">
                <span className="text-slate-400">https://api.onatlas.com</span>
                <span className="text-white font-bold">{currentEndpoint?.path || '/unit'}</span>
              </div>

              <button
                onClick={handleRunRequest}
                disabled={isExecuting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                {isExecuting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isExecuting ? 'Sending...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Response Area */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    STATUS: 200 OK
                  </span>
                  <span>TIME: 34ms</span>
                  <span>SIZE: 1.2 KB</span>
                  <span>CONTENT-TYPE: application/json</span>
                </div>

                <button
                  onClick={() => handleCopy(JSON.stringify(currentEndpoint?.sampleResponse || fallbackEndpoint.sampleResponse, null, 2), 'JSON Response')}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedField === 'JSON Response' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy JSON</span>
                </button>
              </div>

              <div className="p-4 overflow-x-auto max-h-72 text-slate-200 leading-relaxed">
                <pre className="text-emerald-300">
                  {JSON.stringify(currentEndpoint.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'curl' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1.5">
                <span>cURL Terminal Command:</span>
                <button
                  onClick={() => handleCopy(curlSnippet, 'cURL command')}
                  className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                {curlSnippet}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1.5">
                <span>JavaScript / TypeScript Fetch snippet:</span>
                <button
                  onClick={() => handleCopy(jsFetchSnippet, 'Fetch snippet')}
                  className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JS</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-emerald-300 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                {jsFetchSnippet}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-black text-slate-900 mb-1">Authentication Specs</h4>
                <p className="text-slate-600 leading-relaxed">
                  All requests must provide an active Bearer token in the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono">Authorization</code> header:
                </p>
                <div className="mt-2 bg-slate-900 text-amber-300 p-2.5 rounded-lg font-mono text-[11px]">
                  Authorization: Bearer atlas_sec_8923a109f...
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-black text-slate-900 mb-1">Rate Limits & Quota</h4>
                <p className="text-slate-600 leading-relaxed">
                  Free tiers include 10,000 requests/month with up to 60 requests/minute burst capacity. Pro plans support unbounded throughput.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                    X-RateLimit-Limit: 10000
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold font-mono text-[10px]">
                    X-RateLimit-Remaining: 9940
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Quick Search for Other Items */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 flex items-center gap-2">
            <span className="font-bold text-slate-900">Looking for other APIs & Products?</span>
            <span>Search thousands of public datasets, developer boards, and global goods.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('API');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
            >
              Browse All 1,400+ APIs
            </button>
            <button
              onClick={() => setSelectedCategory('electronics')}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs cursor-pointer transition-colors"
            >
              Developer Hardware & Gadgets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
