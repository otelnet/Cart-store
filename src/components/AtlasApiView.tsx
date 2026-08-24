import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { Product } from '../types';
import {
  Globe,
  Terminal,
  Play,
  Copy,
  Check,
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
  Search,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Server,
  Share2,
  Bookmark,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const AtlasApiView: React.FC = () => {
  const {
    products,
    addToCart,
    showToast,
    formatPrice,
    openProductDetail,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setCurrentTab,
  } = useShop();

  const defaultAtlasProduct = PRODUCTS.find((p) => p.id === 'atlas-api') || PRODUCTS[0];
  const atlasProduct = products.find((p) => p.id === 'atlas-api') || defaultAtlasProduct;

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

  const endpoints = (atlasProduct?.apiDetails?.endpoints?.length
    ? atlasProduct.apiDetails.endpoints
    : defaultAtlasProduct?.apiDetails?.endpoints?.length
    ? defaultAtlasProduct.apiDetails.endpoints
    : [fallbackEndpoint]);

  const [selectedEndpointIdx, setSelectedEndpointIdx] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'sandbox' | 'docs' | 'curl' | 'related'>('sandbox');

  const currentEp = endpoints[selectedEndpointIdx] || endpoints[0] || fallbackEndpoint;

  // Related APIs (e.g. Atlas FGO, MongoDB Atlas, Open-Meteo, Stripe)
  const relatedApis = products.filter(
    (p) => p.id !== 'atlas-api' && (p.itemType === 'api' || p.category === 'atlas' || p.category === 'data-access')
  );

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      showToast(`200 OK • Live Atlas API response received!`, 'success');
    }, 450);
  };

  const curlString = `curl -X ${currentEp?.method || 'GET'} "https://api.onatlas.com${currentEp?.path || '/unit'}" \\
  -H "Authorization: Bearer YOUR_ATLAS_TOKEN" \\
  -H "Accept: application/json"`;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Strip */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setCurrentTab('shop')}
          className="hover:text-slate-900 cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => {
            setSelectedCategory('development');
            setCurrentTab('shop');
          }}
          className="hover:text-slate-900 cursor-pointer"
        >
          API Directory
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">Atlas API (Curriculum & Assessment)</span>
      </div>

      {/* Main Atlas API Detail Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center shrink-0 p-3 shadow-inner">
                <Globe className="w-12 h-12 text-indigo-300" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
                    Atlas API
                  </h1>
                  <span className="px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 text-xs font-black tracking-tight">
                    ⭐ PUBLICAPIS.IO VERIFIED
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-mono">
                    v2.4 REST
                  </span>
                </div>

                <p className="text-slate-300 text-sm max-w-3xl leading-relaxed mb-4">
                  The Atlas API allows educational institutions, software architects, and EdTech platforms to programmatically extract and synchronize curriculum maps, educational unit timelines, assessment rubrics, and academic standards alignment with ultra-low latency JSON endpoints.
                </p>

                {/* Badges / Specs Row */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium">
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 font-mono border border-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    HTTPS: Yes (TLS 1.3)
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-blue-300 font-mono border border-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Auth: Bearer Token
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-purple-300 font-mono border border-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    CORS: Enabled
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-slate-800 text-amber-300 font-bold border border-slate-700 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    4.95 / 5.0 (1,840 votes)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => {
                  addToCart(atlasProduct, 1);
                  showToast('Atlas API Developer Tier added to Cart/Procurement!', 'success');
                }}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Get API Access Key</span>
              </button>

              <button
                onClick={() => handleCopy('https://api.onatlas.com', 'Base URL')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-colors"
              >
                {copiedKey === 'Base URL' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy Base URL</span>
              </button>

              <a
                href="https://publicapis.io/atlas-api"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>View on PublicAPIs.io</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 sm:px-10 flex items-center gap-4 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Live Endpoint Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'docs'
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>API Specs & Parameters</span>
          </button>

          <button
            onClick={() => setActiveTab('curl')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'curl'
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Integration Code Snippets</span>
          </button>

          <button
            onClick={() => setActiveTab('related')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'related'
                ? 'border-indigo-600 text-indigo-700 font-black'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Related Public APIs ({relatedApis.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-10">
          {activeTab === 'sandbox' && (
            <div className="space-y-6">
              {/* Endpoint selection grid */}
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                  Select Endpoint To Test:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {endpoints.map((ep, index) => {
                    const isSelected = index === selectedEndpointIdx;
                    return (
                      <button
                        key={ep.path}
                        onClick={() => setSelectedEndpointIdx(index)}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800 font-mono">
                            {ep.method}
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-900 truncate">
                            {ep.path}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {ep.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Request Execution Bar */}
              <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30 shrink-0 flex items-center justify-center">
                  {currentEp?.method || 'GET'}
                </div>

                <div className="flex-1 font-mono text-xs text-slate-200 overflow-x-auto px-2">
                  <span className="text-slate-400">https://api.onatlas.com</span>
                  <span className="text-emerald-400 font-bold">{currentEp?.path || '/unit'}</span>
                </div>

                <button
                  onClick={handleRun}
                  disabled={isExecuting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isExecuting ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>{isExecuting ? 'Executing Request...' : 'Send Live Request'}</span>
                </button>
              </div>

              {/* JSON Live Viewer */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner font-mono text-xs">
                <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      200 OK
                    </span>
                    <span>34ms Latency</span>
                    <span>JSON Schema Validated</span>
                  </div>

                  <button
                    onClick={() => handleCopy(JSON.stringify(currentEp?.sampleResponse || fallbackEndpoint.sampleResponse, null, 2), 'JSON Data')}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === 'JSON Data' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <div className="p-6 max-h-96 overflow-x-auto text-emerald-300 leading-relaxed">
                  <pre>{JSON.stringify(currentEp?.sampleResponse || fallbackEndpoint.sampleResponse, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Header Authentication Specifications</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All HTTP requests must include the Bearer authentication token in the request headers along with standard JSON acceptance flags.
                  </p>
                  <pre className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
{`Authorization: Bearer YOUR_ATLAS_TOKEN
Accept: application/json
Content-Type: application/json`}
                  </pre>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span>Endpoints & Entity Coverage</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Atlas API covers all foundational educational entities defined in academic curriculum maps:
                  </p>
                  <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                    <li>• <code className="font-mono text-indigo-700">/unit</code>: Unit IDs, titles, start dates, essential questions</li>
                    <li>• <code className="font-mono text-indigo-700">/assessment</code>: Rubrics, formative assessments, scoring scales</li>
                    <li>• <code className="font-mono text-indigo-700">/curriculummap</code>: Course mappings, sequences, grade scopes</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curl' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>cURL Terminal Command:</span>
                <button
                  onClick={() => handleCopy(curlString, 'cURL command')}
                  className="text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy cURL</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                {curlString}
              </pre>
            </div>
          )}

          {activeTab === 'related' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedApis.map((api) => (
                <ProductCard key={api.id} product={api} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Search & Other Items Explorer Bar */}
      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Search 1,400+ Public APIs, Hardware & Global Items
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Find weather APIs, payment gateways, developer kits, gaming datasets, or source custom products from Jumia Nigeria.
          </p>

          <div className="flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search APIs, datasets, gadgets, or enter Jumia link..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>
            <button
              onClick={() => setCurrentTab('shop')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl cursor-pointer shadow-sm transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
