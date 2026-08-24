import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Shield,
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  DollarSign,
  Search,
  Filter,
  Save,
  X,
  Sparkles,
  Layers,
  MapPin,
  Clock,
} from 'lucide-react';
import { Product, OrderStatus } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    allProducts,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    adminUpdateOrderStatus,
    orders,
    formatPrice,
    user,
    regionConfig,
    sourcingRequests,
    updateSourcingRequestStatus,
    t,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'sourcing' | 'analytics'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [addMode, setAddMode] = useState<'link' | 'manual'>('link');
  const [importLinkUrl, setImportLinkUrl] = useState('');
  const [isImportingLink, setIsImportingLink] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState('electronics');
  const [newPrice, setNewPrice] = useState('12.99');
  const [newOriginalPrice, setNewOriginalPrice] = useState('45.00');
  const [newStock, setNewStock] = useState('50');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBadge, setNewBadge] = useState('⚡ Flash Deal');

  const handleAutoFetchLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importLinkUrl.trim()) return;

    setIsImportingLink(true);
    try {
      const res = await fetch('/api/gemini/parse-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrQuery: importLinkUrl }),
      });
      const data = await res.json();
      if (data) {
        if (data.name) setNewName(data.name);
        if (data.tagline) setNewTagline(data.tagline);
        if (data.category) setNewCategory(data.category);
        if (data.price) setNewPrice(String(data.price));
        if (data.originalPrice) setNewOriginalPrice(String(data.originalPrice));
        if (data.image) setNewImage(data.image);
        if (data.description) setNewDescription(data.description);
        if (data.stockCount) setNewStock(String(data.stockCount));
        if (data.badge) setNewBadge(data.badge);
      }
    } catch (err) {
      console.error('Failed to parse link:', err);
    } finally {
      setIsImportingLink(false);
    }
  };

  // Calculate high-level analytics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;
  const totalItemsSold = orders.reduce(
    (acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.address.title.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.address.city.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) return;

    adminAddProduct({
      name: newName,
      tagline: newTagline || 'Super Saver Mega Deal',
      category: newCategory,
      subcategory: 'Hot Deals',
      price: parseFloat(newPrice) || 9.99,
      originalPrice: newOriginalPrice ? parseFloat(newOriginalPrice) : undefined,
      unit: '1 unit',
      image:
        newImage.trim() ||
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviewsCount: 1,
      soldCount: 15,
      isTrending: true,
      badge: newBadge || undefined,
      stockCount: parseInt(newStock) || 50,
      dietary: ['non-gmo'],
      description: newDescription || 'Premium high quality item verified by store administrator.',
      origin: 'CartNova Global Logistics Hub',
      farmStory: 'Inspected for international retail quality standards.',
      nutrition: { calories: 0, protein: '0g', carbs: '0g', fat: '0g', fiber: '0g' },
      allergens: ['None'],
      storageTips: 'Store in dry place.',
      ingredients: 'Durable retail composite materials',
    });

    // Reset Form
    setNewName('');
    setNewTagline('');
    setNewPrice('12.99');
    setNewOriginalPrice('45.00');
    setNewStock('50');
    setNewImage('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Admin Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator Management Console</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white">
              Store Control Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Logged in as <strong className="text-white">{user?.name || 'Store Administrator'}</strong>. Manage product inventory, review incoming customer shipments, and monitor live store metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowAddForm(true);
                setActiveTab('products');
              }}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 block">Total Gross Sales</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-display">
              {formatPrice(totalRevenue)}
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 block">Active Orders</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-display">
              {activeOrdersCount} in progress
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 block">Catalog Products</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400 font-display">
              {allProducts.length} Items
            </span>
          </div>
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-bold text-slate-400 block">Total Items Sold</span>
            <span className="text-xl sm:text-2xl font-black text-purple-300 font-display">
              {totalItemsSold} Units
            </span>
          </div>
        </div>
      </div>

      {/* Admin Sub Nav */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Stock ({allProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Fulfillment ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sourcing')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'sourcing'
              ? 'bg-orange-600 text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-orange-600'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Jumia Sourcing ({sourcingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Store Analytics</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Add Product Modal / Collapsible Form */}
          {showAddForm && (
            <div className="bg-white rounded-3xl p-6 border-2 border-orange-500 shadow-xl space-y-4">
              {/* Mode Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => setAddMode('link')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    addMode === 'link'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Paste Product Link & Auto-Fetch (AI)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('manual')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    addMode === 'manual'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Input Form</span>
                </button>
              </div>

              {/* Link Parser Input */}
              {addMode === 'link' && (
                <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-black text-orange-950">
                    Paste Jumia, Amazon, AliExpress or Direct Product URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={importLinkUrl}
                      onChange={(e) => setImportLinkUrl(e.target.value)}
                      placeholder="e.g. https://www.jumia.com.ng/oraimo-freepods... or 'Apple M3 Pro MacBook'"
                      className="flex-1 text-xs p-2.5 rounded-xl border border-orange-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      disabled={isImportingLink || !importLinkUrl.trim()}
                      onClick={handleAutoFetchLink}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      {isImportingLink ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Extracting Details with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Auto-Fetch Details</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-orange-800/80">
                    Our AI automatically extracts the title, HD image, description, wholesale price, and high-impact badges.
                  </p>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 4K Solar Security Camera"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Short Tagline / Features
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Night vision + 360 rotation"
                      value={newTagline}
                      onChange={(e) => setNewTagline(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="electronics">Smart Electronics</option>
                      <option value="fashion">Fashion & Apparel</option>
                      <option value="home">Home & Living</option>
                      <option value="kitchen">Kitchen Gadgets</option>
                      <option value="beauty">Beauty & Health</option>
                      <option value="nigeria">Nigeria Favorites 🇳🇬</option>
                      <option value="produce">Fresh Foods</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Sale Price (USD $)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Original Price (USD $)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="45.00"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                      Highlight Badge
                    </label>
                    <input
                      type="text"
                      placeholder="⚡ Flash Deal (-75%)"
                      value={newBadge}
                      onChange={(e) => setNewBadge(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Product specifications, features, contents..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Publish to Store
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search bar for items */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search catalog items..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} of {allProducts.length} items
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Sold / Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {prod.tagline}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px] uppercase">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        <div>
                          <span>{formatPrice(prod.price)}</span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                              {formatPrice(prod.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-bold text-xs ${
                            prod.stockCount < 10
                              ? 'text-rose-600'
                              : prod.stockCount < 30
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {prod.stockCount} units
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div>
                          <span className="font-bold text-slate-900">
                            {prod.soldCount || 0} sold
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            ★ {prod.rating} ({prod.reviewsCount})
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const newP = prompt('Update Price (USD):', prod.price.toString());
                              if (newP && !isNaN(parseFloat(newP))) {
                                adminUpdateProduct(prod.id, { price: parseFloat(newP) });
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              const newStk = prompt('Update Stock Quantity:', prod.stockCount.toString());
                              if (newStk && !isNaN(parseInt(newStk))) {
                                adminUpdateProduct(prod.id, { stockCount: parseInt(newStk) });
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer text-[10px] font-bold"
                            title="Quick Stock Update"
                          >
                            +Stock
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                adminDeleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders, recipient or city..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-slate-800"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredOrders.length} customer shipments
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs font-mono">
                      {ord.orderNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{ord.address.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'on_the_way'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {ord.createdAt} • {ord.timeSlot}
                      </p>
                    </div>
                  </div>

                  {/* Status Control Switcher */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) =>
                        adminUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                      }
                      className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="picking">Inspection & Sourcing</option>
                      <option value="packed">Packed & Sealed</option>
                      <option value="on_the_way">On The Way (Dispatched)</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Delivery Destination
                    </span>
                    <p className="font-semibold text-slate-800">{ord.address.street}</p>
                    <p className="text-slate-500">{ord.address.city}, {ord.address.postalCode}</p>
                    {ord.address.instructions && (
                      <p className="text-[10px] text-orange-800 bg-orange-50 px-2 py-0.5 rounded mt-1">
                        Note: {ord.address.instructions}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Ordered Items ({ord.items.length})
                    </span>
                    <div className="space-y-1">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700">
                          <span className="truncate max-w-[180px]">
                            {it.quantity}x {it.product.name}
                          </span>
                          <span className="font-mono text-slate-900 font-semibold">
                            {formatPrice(it.product.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Payment & Total
                    </span>
                    <p className="font-bold text-base text-slate-900 font-display">
                      {formatPrice(ord.total)}
                    </p>
                    <p className="text-[11px] text-slate-500">{ord.paymentMethod}</p>
                    {ord.promoCodeApplied && (
                      <span className="text-[10px] text-emerald-700 font-bold">
                        Coupon {ord.promoCodeApplied} applied
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2.5: JUMIA NIGERIA & CUSTOM SOURCING REQUESTS */}
      {activeTab === 'sourcing' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">
                Jumia Nigeria & Global Custom Sourcing Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Customer-requested items from jumia.com.ng and global suppliers awaiting procurement & dispatch.
              </p>
            </div>

            <div className="text-xs font-bold text-orange-600 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200">
              {sourcingRequests.length} Total Sourcing Tickets
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Ticket & Product</th>
                    <th className="p-3.5">Customer & Origin</th>
                    <th className="p-3.5">Target Budget & Sourced Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {sourcingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.imageUrl}
                            alt={req.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block font-bold">
                              #{req.id.slice(-6)} • Qty: {req.quantity}
                            </span>
                            <span className="font-bold text-slate-900 block max-w-xs truncate">
                              {req.productName}
                            </span>
                            {req.sourceUrl && (
                              <a
                                href={req.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-600 hover:underline block truncate max-w-xs font-mono"
                              >
                                {req.sourceUrl}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-800 block">{req.userName || 'Customer'}</span>
                        <span className="text-[11px] text-slate-500 block">{req.userEmail}</span>
                        <span className="text-[10px] text-orange-700 font-bold block mt-0.5">
                          {req.sourceOrigin}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-black text-slate-900 font-display text-sm block">
                          {formatPrice(req.estimatedPrice * req.quantity)}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through block">
                          Market: {formatPrice((req.originalMarketPrice || req.estimatedPrice * 1.3) * req.quantity)}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          ETA: {req.estimatedDeliveryDays}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-block ${
                            req.status === 'dispatched'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'in_procurement'
                              ? 'bg-blue-100 text-blue-800'
                              : req.status === 'approved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <select
                          value={req.status}
                          onChange={(e) => updateSourcingRequestStatus(req.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-xs cursor-pointer focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                          <option value="quoted">Quoted</option>
                          <option value="approved">Approved</option>
                          <option value="in_procurement">In Procurement</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STORE ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Regional Revenue Breakdown</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50/50">
                  <span className="font-medium text-slate-800">🇳🇬 Nigeria & West Africa Hub</span>
                  <span className="font-bold text-orange-900 font-mono">68% of volume</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-800">🇺🇸 United States & North America</span>
                  <span className="font-bold text-slate-900 font-mono">18% of volume</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-800">🇪🇺 Europe & UK Express</span>
                  <span className="font-bold text-slate-900 font-mono">14% of volume</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Category Popularity</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50">
                  <span className="font-medium text-slate-800">⚡ Smart Tech, Audio & Solar Lights</span>
                  <span className="font-bold text-emerald-900 font-mono">42%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-800">👟 Fashion & Sneakers</span>
                  <span className="font-bold text-slate-900 font-mono">26%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-800">🍳 Kitchen & Home Organizers</span>
                  <span className="font-bold text-slate-900 font-mono">19%</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-800">🥑 Fresh Produce & Artisanal Bakery</span>
                  <span className="font-bold text-slate-900 font-mono">13%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
