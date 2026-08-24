import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/mockData';
import {
  X,
  Star,
  Plus,
  Minus,
  Heart,
  MapPin,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Terminal,
  Play,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductDetail,
    addToCart,
    toggleFavorite,
    isFavorite,
    formatPrice,
    getProductReviews,
    addReview,
    getProductRatingSummary,
    user,
    showToast,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [pickerNote, setPickerNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'api_sandbox' | 'reviews' | 'nutrition' | 'origin'>('details');

  // API Sandbox state
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  // New Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Fresh']);

  if (!selectedProduct) return null;

  const favorited = isFavorite(selectedProduct.id);
  const productReviews = getProductReviews(selectedProduct.id);
  const ratingSummary = getProductRatingSummary(selectedProduct.id);
  const isApi = selectedProduct.itemType === 'api' || !!selectedProduct.apiDetails;
  const apiEndpoints = selectedProduct.apiDetails?.endpoints || [];
  const currentEndpoint = apiEndpoints[selectedEndpointIndex] || apiEndpoints[0];

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, pickerNote || undefined);
    closeProductDetail();
  };

  const handleRunApi = () => {
    setIsExecutingApi(true);
    setTimeout(() => {
      setIsExecutingApi(false);
      showToast(`200 OK • Response received in ${selectedProduct.apiDetails?.latency || '34ms'}`, 'success');
    }, 400);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addReview({
      productId: selectedProduct.id,
      userName: user ? user.name : 'Anonymous Foodie',
      userAvatar: user ? user.avatar : undefined,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
      tags: selectedTags,
    });

    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Close Button */}
          <button
            id="close-product-detail-btn"
            onClick={closeProductDetail}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto flex-1 pb-4">
            {/* Header Image / Media Hero */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {selectedProduct.badge && (
                  <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-lg shadow-sm">
                    {selectedProduct.badge}
                  </span>
                )}
                {isApi && (
                  <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-md font-mono flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Public REST API
                  </span>
                )}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider text-orange-400 font-bold">
                    {selectedProduct.category} • {selectedProduct.subcategory}
                  </span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                  {selectedProduct.name}
                </h3>
              </div>
            </div>

            {/* Price & Meta Bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-orange-600 font-display">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{selectedProduct.unit}</span>
              </div>

              {/* Rating & Favorite */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-900 text-xs">{ratingSummary.average}</span>
                  <span className="text-slate-400 text-[11px]">({ratingSummary.count})</span>
                </div>

                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className={`p-2 rounded-xl border shadow-xs transition-colors cursor-pointer ${
                    favorited
                      ? 'bg-rose-50 border-rose-200 text-rose-500'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* API Specs Strip if API */}
            {isApi && selectedProduct.apiDetails && (
              <div className="px-6 py-3 bg-slate-900 text-slate-200 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase">Base URL:</span>
                  <code className="text-emerald-400 font-bold">{selectedProduct.apiDetails.baseUrl}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                    Auth: {selectedProduct.apiDetails.authType}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300">
                    HTTPS: {selectedProduct.apiDetails.https ? 'Yes' : 'No'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                    Latency: {selectedProduct.apiDetails.latency}
                  </span>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-6 text-xs font-bold overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Overview & Description
              </button>

              {isApi && (
                <button
                  onClick={() => setActiveTab('api_sandbox')}
                  className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                    activeTab === 'api_sandbox'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Endpoint Tester</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ratings & Feedback ({ratingSummary.count})</span>
              </button>

              {!isApi && (
                <button
                  onClick={() => setActiveTab('origin')}
                  className={`pb-3 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'origin'
                      ? 'border-b-2 border-orange-600 text-orange-600 font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Source & Origin
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="p-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p>{selectedProduct.description}</p>

                  {selectedProduct.sourceUrl && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">Original Source Reference:</span>
                        <a
                          href={selectedProduct.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-mono truncate max-w-md block mt-0.5"
                        >
                          {selectedProduct.sourceUrl}
                        </a>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-100 text-xs text-orange-950">
                    <span className="font-bold block mb-1">Specs & Packaging</span>
                    <p>{selectedProduct.ingredients}</p>
                  </div>
                </div>
              )}

              {/* API Sandbox Tab */}
              {activeTab === 'api_sandbox' && isApi && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-600">
                    Select an endpoint to test live sample requests against the API server:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {apiEndpoints.map((ep, idx) => (
                      <button
                        key={ep?.path || idx}
                        onClick={() => setSelectedEndpointIndex(idx)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                          idx === selectedEndpointIndex
                            ? 'border-indigo-600 bg-indigo-50/80 font-bold'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 font-mono mr-2">
                          {ep?.method || 'GET'}
                        </span>
                        <span className="font-mono text-xs text-slate-800">{ep?.path || '/'}</span>
                        <p className="text-[10px] text-slate-500 font-normal mt-1 truncate">{ep?.description || 'API Endpoint'}</p>
                      </button>
                    ))}
                  </div>

                  {currentEndpoint && (
                    <div className="space-y-3 pt-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl flex items-center justify-between gap-2">
                        <div className="font-mono text-xs text-emerald-400 truncate px-2">
                          {selectedProduct.apiDetails?.baseUrl}{currentEndpoint?.path || ''}
                        </div>
                        <button
                          onClick={handleRunApi}
                          disabled={isExecutingApi}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isExecutingApi ? 'Running...' : 'Run Endpoint'}</span>
                        </button>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 max-h-60 overflow-x-auto leading-relaxed">
                        <pre>{JSON.stringify(currentEndpoint?.sampleResponse || { status: 'success' }, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <div className="font-display font-black text-2xl text-slate-900">
                        {ratingSummary.average} / 5.0
                      </div>
                      <p className="text-xs text-slate-500">Based on {ratingSummary.count} verified reviews</p>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                      {showReviewForm ? 'Cancel' : 'Write a Review'}
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">Your Rating</label>
                        <div className="flex gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="p-1 cursor-pointer"
                            >
                              <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">Title</label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Incredibly fast integration and clean docs!"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1">Comment</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={3}
                          placeholder="Share your experience with this item..."
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 cursor-pointer shadow-xs"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}

                  <div className="space-y-3">
                    {productReviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <h5 className="font-bold text-slate-800 text-xs">{rev.title}</h5>
                        <p className="text-xs text-slate-600">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Origin Tab */}
              {activeTab === 'origin' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{selectedProduct.origin}</span>
                  </div>
                  <p className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedProduct.farmStory}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Footer with Quantity Stepper and Add To Cart */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
            <div className="flex items-center rounded-xl bg-white border border-slate-300 p-1 shadow-xs shrink-0">
              <button
                id="modal-qty-minus"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-900 font-mono">
                {quantity}
              </span>
              <button
                id="modal-qty-plus"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              id="modal-add-to-cart-btn"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>{isApi ? 'Get API Access / Add Key' : 'Add to Cart / Procurement'}</span>
              </div>
              <span className="font-extrabold font-display">
                {formatPrice(selectedProduct.price * quantity)}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
