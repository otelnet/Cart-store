import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Truck,
  Sparkles,
  ShoppingBag,
  Phone,
  MessageSquare,
  MapPin,
  Star,
} from 'lucide-react';

export const OrdersListView: React.FC = () => {
  const {
    orders,
    openOrderTracker,
    reorder,
    setCurrentTab,
    openDriverContact,
    openUpdateOrderAddress,
    formatPrice,
  } = useShop();

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const pastOrders = orders.filter((o) => o.status === 'delivered');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white">
            My Orders & Van Dispatch Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track live dispatch vans, contact drivers directly, and send drop-off address updates.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('discover')}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          Shop More
        </button>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Active Van Dispatches ({activeOrders.length})
            </h3>
          </div>

          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                id={`active-order-${order.id}`}
                className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-500/40 dark:border-orange-500/30 p-4 sm:p-5 shadow-md hover:border-orange-600 transition-all space-y-4"
              >
                <div
                  onClick={() => openOrderTracker(order.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white">
                          Order #{order.orderNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        Placed {order.createdAt} • {order.items.reduce((s, i) => s + i.quantity, 0)} items • ETA: ~{order.driver?.etaMinutes || 25} mins
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white text-xs font-bold shadow-xs">
                      <Sparkles className="w-3 h-3" /> Live Tracking
                    </span>
                    <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white block mt-1">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Driver Summary & Direct Contact Row */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={order.driver.avatar}
                      alt={order.driver.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {order.driver.name}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {order.driver.rating}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {order.driver.vanModel || order.driver.vehicle} ({order.driver.plateNumber})
                      </span>
                    </div>
                  </div>

                  {/* Driver Contact & Send Address Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => openDriverContact(order.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Call Driver</span>
                    </button>

                    <button
                      onClick={() => openDriverContact(order.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat with Driver</span>
                    </button>

                    <button
                      onClick={() => openUpdateOrderAddress(order.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Send Address</span>
                    </button>
                  </div>
                </div>

                {/* Items preview thumbnails & Live Radar Link */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.items.slice(0, 4).map((i) => (
                      <img
                        key={i.product.id}
                        src={i.product.image}
                        alt={i.product.name}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {order.items.length > 4 && (
                      <span className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center">
                        +{order.items.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => openOrderTracker(order.id)}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    Open Live Radar Map <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Orders Section */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
          Past Delivered Orders
        </h3>

        {pastOrders.length === 0 && activeOrders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No orders yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
              When you purchase items on CartNova, you can track dispatch van drivers and update addresses here.
            </p>
            <button
              onClick={() => setCurrentTab('discover')}
              className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        Order #{order.orderNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        Delivered
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {order.createdAt} • {order.items.length} items • {formatPrice(order.total)}
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {order.items.slice(0, 3).map((item) => (
                        <span
                          key={item.product.id}
                          className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 truncate max-w-[140px]"
                        >
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => openOrderTracker(order.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => reorder(order)}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Re-Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
