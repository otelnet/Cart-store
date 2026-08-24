import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  MapPin,
  Truck,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Key,
  Package,
  Car,
  CheckCircle2,
  Heart,
  Navigation,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DriverContactModal: React.FC = () => {
  const {
    isDriverContactModalOpen,
    closeDriverContact,
    activeDriverContactOrderId,
    orders,
    driverMessages,
    sendDriverMessage,
    openUpdateOrderAddress,
    showToast,
    formatPrice,
  } = useShop();

  const [inputMessage, setInputMessage] = useState('');
  const [copiedPlate, setCopiedPlate] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'call' | 'van_info'>('chat');
  const [tipSent, setTipSent] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  // Simulated Voice Call State
  const [isCalling, setIsCalling] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === activeDriverContactOrderId) || orders.find((o) => o.status !== 'delivered') || orders[0];

  const orderId = order?.id || 'ord-10293';
  const messages = driverMessages[orderId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  if (!isDriverContactModalOpen || !order) return null;

  const driver = order.driver;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendDriverMessage(order.id, inputMessage.trim(), 'text');
    setInputMessage('');
  };

  const handleQuickSend = (text: string, type: 'location_pin' | 'gate_code' | 'text' = 'text') => {
    sendDriverMessage(order.id, text, type);
  };

  const handleSendCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latStr = latitude.toFixed(4);
          const lngStr = longitude.toFixed(4);
          sendDriverMessage(
            order.id,
            `📍 Exact GPS Coordinates Pin: (${latStr}, ${lngStr}) - Ready for doorstep handover!`,
            'location_pin'
          );
          showToast('Live GPS coordinates sent to dispatch driver!', 'success');
        },
        () => {
          sendDriverMessage(
            order.id,
            `📍 Current Drop-off Address Pin: ${order.address.street}, ${order.address.city}`,
            'location_pin'
          );
          showToast('Address pin transmitted to dispatch driver!', 'success');
        }
      );
    } else {
      sendDriverMessage(
        order.id,
        `📍 Drop-off Pinpoint: ${order.address.street}, ${order.address.city}`,
        'location_pin'
      );
      showToast('Address pin transmitted to driver!', 'success');
    }
  };

  const startVoiceCall = () => {
    setIsCalling(true);
    setActiveTab('call');
    setTimeout(() => {
      setCallConnected(true);
      showToast(`Connected to Dispatch Driver ${driver.name}`, 'success');
    }, 1800);
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setCallConnected(false);
    showToast('Call ended', 'info');
    setActiveTab('chat');
  };

  const copyLicensePlate = () => {
    navigator.clipboard.writeText(driver.plateNumber);
    setCopiedPlate(true);
    showToast(`License plate ${driver.plateNumber} copied!`, 'success');
    setTimeout(() => setCopiedPlate(false), 2000);
  };

  const handleSendTip = (amount: number) => {
    setSelectedTip(amount);
    setTipSent(true);
    sendDriverMessage(
      order.id,
      `💝 Customer sent a $${amount.toFixed(2)} direct driver bonus tip! Thank you for fast, safe delivery.`,
      'text'
    );
    showToast(`$${amount.toFixed(2)} driver tip added!`, 'success');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // WhatsApp link generator
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello ${driver.name}, this is regarding CartNova Order #${order.orderNumber}. Delivery address: ${order.address.street}, ${order.address.city}.`
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800"
        >
          {/* Top Bar / Driver Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md ring-2 ring-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Online & Active">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-display font-black text-lg text-white leading-tight">
                      {driver.name}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-extrabold text-amber-200">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      {driver.rating}
                    </span>
                  </div>

                  <p className="text-xs text-orange-100 font-medium flex items-center gap-1.5 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-amber-300" />
                    <span>{driver.vanModel || driver.vehicle}</span>
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={copyLicensePlate}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/30 hover:bg-black/40 text-[11px] font-mono font-bold text-white transition-colors cursor-pointer"
                      title="Click to copy license plate"
                    >
                      <span>{driver.plateNumber}</span>
                      {copiedPlate ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-orange-200" />}
                    </button>

                    <span className="text-[11px] font-semibold text-orange-200">
                      Order #{order.orderNumber}
                    </span>
                  </div>
                </div>
              </div>

              <button
                id="close-driver-contact-btn"
                onClick={closeDriverContact}
                className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Status Banner */}
            <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-orange-100">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>
                  {order.status === 'delivered'
                    ? 'Delivered'
                    : `ETA: ~${driver.etaMinutes} mins • En Route`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openUpdateOrderAddress(order.id)}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-amber-300" />
                  <span>Update Address</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-4 pt-2 gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Live Van Chat ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('call')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'call'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Voice Dispatch Call</span>
            </button>

            <button
              onClick={() => setActiveTab('van_info')}
              className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'van_info'
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Van Fleet Specs</span>
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Quick Prompt Chips */}
              <div className="p-2.5 bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1 pl-1">
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  Quick:
                </span>

                <button
                  onClick={handleSendCurrentLocation}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <MapPin className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                  <span>Send GPS Pin</span>
                </button>

                <button
                  onClick={() => handleQuickSend('🏢 Gate/Buzzer code is #4012. Please dial when at front gate.', 'gate_code')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Key className="w-3 h-3 text-amber-500" />
                  <span>Send Gate Code</span>
                </button>

                <button
                  onClick={() => handleQuickSend('📦 Please leave safely by the front door or with reception desk.')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Package className="w-3 h-3 text-emerald-500" />
                  <span>Leave at Door</span>
                </button>

                <button
                  onClick={() => handleQuickSend('🚗 Loading zone right outside the main lobby is free to park!')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Car className="w-3 h-3 text-blue-500" />
                  <span>Van Parking Open</span>
                </button>

                <button
                  onClick={() => handleQuickSend('📞 Please call my phone when the dispatch van pulls up.')}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 hover:bg-orange-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Phone className="w-3 h-3 text-purple-500" />
                  <span>Call on Arrival</span>
                </button>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px] max-h-[320px] bg-slate-50/50 dark:bg-slate-950/50">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-40 text-orange-500" />
                    <p>Start a direct conversation with Dispatch Driver {driver.name}</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isAddressUpdate = msg.type === 'address_update';
                    const isLocationPin = msg.type === 'location_pin';

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[84%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs space-y-1 ${
                            isAddressUpdate
                              ? 'bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                              : isLocationPin
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                              : isUser
                              ? 'bg-orange-600 text-white rounded-br-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                          }`}
                        >
                          {!isUser && (
                            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 block">
                              {driver.name} (Van Driver)
                            </span>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <span
                            className={`text-[9px] block text-right ${
                              isUser ? 'text-orange-100' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message ${driver.name.split(' ')[0]} (e.g. gate code, ETA)...`}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Voice Dispatch Call */}
          {activeTab === 'call' && (
            <div className="p-6 space-y-6 flex-1 flex flex-col justify-center items-center text-center bg-slate-50 dark:bg-slate-950">
              <div className="relative">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                {callConnected && (
                  <span className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75" />
                )}
              </div>

              <div>
                <h4 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  {driver.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  CartNova Dispatch Courier • {driver.vanModel || driver.vehicle}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {isCalling
                    ? callConnected
                      ? `In Call • ${formatDuration(callDuration)}`
                      : 'Connecting to van tablet...'
                    : 'Dispatch Line Ready'}
                </span>
              </div>

              {/* Call Controls */}
              {isCalling ? (
                <div className="space-y-4 w-full max-w-xs">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3.5 rounded-full transition-all cursor-pointer ${
                        isMuted
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                      }`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={() => setIsSpeaker(!isSpeaker)}
                      className={`p-3.5 rounded-full transition-all cursor-pointer ${
                        isSpeaker
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                      }`}
                      title="Toggle Speakerphone"
                    >
                      {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={endVoiceCall}
                      className="p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-all cursor-pointer"
                      title="End Call"
                    >
                      <PhoneOff className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    256-bit encrypted VoIP dispatch connection
                  </p>
                </div>
              ) : (
                <div className="space-y-3 w-full max-w-sm">
                  <button
                    onClick={startVoiceCall}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Start In-App Voice Call</span>
                  </button>

                  <a
                    href={`tel:${driver.phone}`}
                    className="w-full py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>Direct Cellular Dial: {driver.phone}</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Open WhatsApp Dispatch Chat</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Van Info & Fleet Specs */}
          {activeTab === 'van_info' && (
            <div className="p-5 space-y-4 overflow-y-auto max-h-[360px] bg-slate-50 dark:bg-slate-950">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Dispatch Vehicle & Courier Credentials</span>
                </h5>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Vehicle Model</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{driver.vanModel || 'Mercedes-Benz Sprinter EV'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">License Plate</span>
                    <span className="font-mono font-black text-orange-600 dark:text-orange-400">{driver.plateNumber}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Van Exterior Color</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{driver.vanColor || 'Silver Metallic'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 text-[10px] block">Dispatch Hub</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{driver.dispatchHub || 'CartNova Hub #12'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                  <span className="font-extrabold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Courier & Temperature Safe
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Driver {driver.name} has passed comprehensive background verification and holds 100% 5-star customer feedback. Van is equipped with certified refrigerated food storage and live telematics.
                  </p>
                </div>
              </div>

              {/* Driver Tip Action */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Send Driver Recognition Tip</span>
                  </h5>
                  {tipSent && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {[2.0, 5.0, 10.0].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSendTip(amt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        selectedTip === amt
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      +${amt.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="p-3 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span className="truncate max-w-[260px] sm:max-w-xs">{order.address.street}, {order.address.city}</span>
            </div>

            <button
              onClick={() => openUpdateOrderAddress(order.id)}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer shrink-0"
            >
              Send New Address
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
