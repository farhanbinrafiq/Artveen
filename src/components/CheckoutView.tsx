/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem, Order } from '../types';
import { trackCheckoutBegin, trackPurchase } from '../lib/analytics';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Check, 
  Lock, 
  Truck, 
  Printer, 
  CreditCard, 
  ChevronRight, 
  AlertCircle, 
  ShoppingBag, 
  Trash2, 
  FileText, 
  Award,
  Globe,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    placeOrder, 
    setRoute, 
    currentUser 
  } = useApp();

  // Step Tracker: 1 = Cart Review, 2 = Logistics (Address), 3 = Settlement (Payment), 4 = Registry Success
  const [activeStep, setActiveStep] = useState<number>(1);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<Order | null>(null);

  // Form Field States
  const [custName, setCustName] = useState(currentUser.role !== 'guest' ? currentUser.name : '');
  const [custEmail, setCustEmail] = useState(currentUser.role !== 'guest' ? currentUser.email : '');
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [wireAcknowledged, setWireAcknowledged] = useState(false);

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate order metrics
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // High-end fine art packing and courier details
  const packingPrice = 350; // Valued at $350 but free
  const shippingPrice = 180; // Valued at $180 but free
  const totalInvestment = cartSubtotal; // All luxury shipping is complimentary

  // Auto scroll to top on step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  // Track beginning of checkout funnel
  useEffect(() => {
    if (cart.length > 0) {
      trackCheckoutBegin(cart, totalInvestment);
    }
  }, []);

  // Sync user details if role is changed mid-session
  useEffect(() => {
    if (currentUser.role !== 'guest') {
      if (!custName) setCustName(currentUser.name);
      if (!custEmail) setCustEmail(currentUser.email);
    }
  }, [currentUser]);

  // Form Validations
  const validateLogistics = () => {
    const newErrors: Record<string, string> = {};
    if (!custName.trim()) newErrors.custName = "Collector's full name is required for certificate registry.";
    if (!custEmail.trim()) {
      newErrors.custEmail = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(custEmail)) {
      newErrors.custEmail = "Please provide a valid email format.";
    }
    if (!street.trim()) newErrors.street = "Delivery street address is required.";
    if (!city.trim()) newErrors.city = "Delivery city is required.";
    if (!state.trim()) newErrors.state = "State / Province is required.";
    if (!zip.trim()) newErrors.zip = "Postal / Zip code is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSettlement = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'card') {
      const sanitizedCard = cardNumber.replace(/\s+/g, '');
      if (sanitizedCard.length < 15 || sanitizedCard.length > 16) {
        newErrors.cardNumber = "Please provide a valid 15 or 16 digit card number.";
      }
      if (!cardName.trim()) {
        newErrors.cardName = "Cardholder name is required.";
      }
      if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        newErrors.cardExpiry = "Expiry date must be in MM/YY format.";
      }
      if (cardCvv.length < 3 || cardCvv.length > 4) {
        newErrors.cardCvv = "Provide a valid 3 or 4-digit security code (CVV).";
      }
    } else {
      if (!wireAcknowledged) {
        newErrors.wire = "Please acknowledge the bank wire instructions before continuing.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Card formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(v);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) {
      v = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    setCardExpiry(v);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4));
  };

  // Handle Acquisition Submission
  const handleAcquisitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSettlement()) return;

    setIsSubmitting(true);

    // Simulate standard secure authorization delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const shippingAddress = {
      street: suite ? `${street}, ${suite}` : street,
      city,
      state,
      zipCode: zip,
      country
    };

    // Place the order using the context helper with autoRoute set to false so we can present step 4
    const orderResult = placeOrder(custName, custEmail, shippingAddress, false);

    setIsSubmitting(false);
    if (orderResult) {
      setPlacedOrderDetails(orderResult);
      trackPurchase(orderResult);
      setActiveStep(4);
    }
  };

  // Browser printing handler for the Certificate of Authenticity
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <section className="relative w-full min-h-screen bg-canvas-white paper-texture pt-32 pb-24 text-left" id="checkout-view-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 print:p-0">
        
        {/* Editorial Heading Panel */}
        <div className="border-b border-soft-border pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-signature-carmine font-bold font-sans block">
              Direct Fine Art Acquisition
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-charcoal-ink tracking-tight">
              Secured Checkout
            </h2>
            <p className="text-xs md:text-sm text-slate-gray max-w-xl font-sans font-light leading-relaxed">
              Finalize registration details to transfer official ownership titles and coordinate white-glove, temperature-controlled delivery.
            </p>
          </div>
          
          <button
            onClick={() => setRoute(cart.length > 0 ? 'shop' : 'shop')}
            className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-slate-gray hover:text-signature-carmine transition-premium focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Discovering</span>
          </button>
        </div>

        {/* Elegant Progress Indicator (Steps 1 to 4) */}
        {activeStep <= 3 && (
          <div className="mb-12 max-w-3xl mx-auto print:hidden">
            <div className="relative flex items-center justify-between font-sans">
              
              {/* Connection Line */}
              <div className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-soft-border -translate-y-1/2 z-0" />
              <div 
                className="absolute left-0 top-1/2 h-[1.5px] bg-signature-carmine -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${((activeStep - 1) / 2) * 100}%` }}
              />

              {[
                { step: 1, title: "Curator's Cart", desc: "Review Items" },
                { step: 2, title: "Secure Logistics", desc: "Delivery Details" },
                { step: 3, title: "Acquisition Settlement", desc: "Secure Settlement" }
              ].map((s) => {
                const isCompleted = activeStep > s.step;
                const isActive = activeStep === s.step;

                return (
                  <button
                    key={s.step}
                    onClick={() => {
                      if (s.step < activeStep) {
                        setActiveStep(s.step);
                      }
                    }}
                    disabled={s.step >= activeStep}
                    className="relative z-10 flex flex-col items-center group focus:outline-none disabled:cursor-not-allowed"
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-signature-carmine border-signature-carmine text-canvas-white shadow-xs' 
                        : isActive
                          ? 'bg-charcoal-ink border-charcoal-ink text-canvas-white font-bold scale-110 shadow-md'
                          : 'bg-pure-white border-soft-border text-slate-gray/70'
                    }`}>
                      {isCompleted ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : s.step}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 transition-all ${
                      isActive ? 'text-charcoal-ink' : 'text-slate-gray/60 group-hover:text-charcoal-ink'
                    }`}>
                      {s.title}
                    </span>
                    <span className="hidden sm:inline text-[9px] text-slate-gray/50 mt-0.5">
                      {s.desc}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        )}

        {/* Outer Split Layout */}
        {cart.length === 0 && activeStep < 4 ? (
          /* Empty Checkout Fallback */
          <div className="flex flex-col justify-center items-center text-center py-20 bg-pure-white border border-soft-border rounded-xs p-8 max-w-xl mx-auto shadow-xs">
            <ShoppingBag className="w-12 h-12 text-gallery-blue stroke-[1] mb-4" />
            <h4 className="font-serif text-xl font-light text-charcoal-ink mb-2">No Acquisitions Selected</h4>
            <p className="text-xs text-slate-gray max-w-sm mb-6 leading-relaxed">
              Your curator cart is currently empty. Fine art selections represent highly personal connections; explore our sea-salt textured canvases to begin.
            </p>
            <button
              onClick={() => setRoute('shop')}
              className="px-8 py-3.5 bg-charcoal-ink text-canvas-white text-[10px] uppercase tracking-widest font-bold rounded-xs hover:bg-signature-carmine transition-premium cursor-pointer focus:outline-none"
            >
              Explore Active Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ACTIVE STEP FORM CONTROLS */}
            {activeStep < 4 && (
              <div className="lg:col-span-7 space-y-8 print:hidden">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: CART REVIEW */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-pure-white border border-soft-border rounded-xs p-6 md:p-8 shadow-xs space-y-6"
                    >
                      <div className="border-b border-soft-border/50 pb-4 flex justify-between items-baseline">
                        <h3 className="font-serif text-2xl font-light text-charcoal-ink">Collector Cart Review</h3>
                        <span className="text-[10px] text-slate-gray font-mono tracking-wider">
                          {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'} Registered
                        </span>
                      </div>

                      {/* Cart List */}
                      <div className="divide-y divide-soft-border/50">
                        {cart.map((item) => (
                          <div 
                            key={item.cartItemId} 
                            className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                          >
                            <div className="flex gap-4 items-center flex-1 min-w-0">
                              <div className="w-20 h-20 bg-[#FAF9F5]/70 border border-soft-border rounded-xs overflow-hidden shrink-0 flex items-center justify-center p-2">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="max-h-full max-w-full object-contain shadow-xs"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-serif text-sm font-semibold text-charcoal-ink truncate">
                                  "{item.title}"
                                </h4>
                                <p className="text-[10px] text-signature-carmine uppercase tracking-wider font-bold mt-1">
                                  {item.optionType.replace('_', ' ')}
                                </p>
                                <p className="text-[10px] text-slate-gray mt-0.5">
                                  Dimensions: {item.size}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                              {/* Quantity Editor */}
                              <div className="flex items-center border border-soft-border rounded-xs overflow-hidden bg-pure-white text-xs">
                                <button
                                  type="button"
                                  onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                                  className="px-2.5 py-1.5 hover:bg-gallery-blue/20 text-charcoal-ink font-bold transition-colors"
                                  title="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="px-3 font-semibold font-mono text-xs">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (item.optionType === 'original') return; // Locked at 1
                                    updateCartQuantity(item.cartItemId, item.quantity + 1);
                                  }}
                                  disabled={item.optionType === 'original'}
                                  className={`px-2.5 py-1.5 hover:bg-gallery-blue/20 text-charcoal-ink font-bold transition-colors ${
                                    item.optionType === 'original' ? 'opacity-30 cursor-not-allowed' : ''
                                  }`}
                                  title={item.optionType === 'original' ? 'Original Paintings are unique single creations' : 'Increase quantity'}
                                >
                                  +
                                </button>
                              </div>

                              {/* Price and Delete block */}
                              <div className="flex items-center gap-4">
                                <div className="text-right font-sans">
                                  <p className="font-serif font-bold text-sm text-charcoal-ink">
                                    ${(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-[9px] text-[#777777] font-mono">
                                      (${item.price.toLocaleString()} each)
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="p-1.5 text-slate-gray hover:text-signature-carmine hover:bg-signature-carmine/5 rounded-xs transition-premium focus:outline-none"
                                  title="Remove artwork from selection"
                                >
                                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Proceed button */}
                      <div className="pt-4 border-t border-soft-border/50 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="px-8 py-4 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-xs uppercase tracking-widest font-bold rounded-xs flex items-center space-x-2 shadow-md transition-all duration-300"
                        >
                          <span>Proceed to Logistics</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: LOGISTICS (ADDRESS FORM) */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-pure-white border border-soft-border rounded-xs p-6 md:p-8 shadow-xs space-y-6"
                    >
                      <div className="border-b border-soft-border/50 pb-4">
                        <h3 className="font-serif text-2xl font-light text-charcoal-ink">Conservation Logistics</h3>
                        <p className="text-xs text-slate-gray font-sans mt-1 leading-normal">
                          Provide exact delivery instructions and the registered owner's name for Certificate archival recording.
                        </p>
                      </div>

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (validateLogistics()) {
                            setActiveStep(3);
                          }
                        }} 
                        className="space-y-6"
                      >
                        
                        {/* PROFILE SECTION */}
                        <div className="space-y-4 text-left">
                          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-gray font-bold border-b border-soft-border/30 pb-1 font-mono">
                            1. Ownership & Profile Registry
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                Collector's Full Name <span className="text-signature-carmine">*</span>
                              </label>
                              <input
                                type="text"
                                value={custName}
                                onChange={(e) => {
                                  setCustName(e.target.value);
                                  if (errors.custName) setErrors({...errors, custName: ''});
                                }}
                                placeholder="e.g. Sarah Jenkins"
                                className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                  errors.custName ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                }`}
                              />
                              {errors.custName && (
                                <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{errors.custName}</span>
                                </p>
                              )}
                              <span className="text-[9px] text-[#777777] italic block mt-1 font-sans">
                                Printed exactly as written on physical Certificate of Authenticity.
                              </span>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                Email Address <span className="text-signature-carmine">*</span>
                              </label>
                              <input
                                type="email"
                                value={custEmail}
                                onChange={(e) => {
                                  setCustEmail(e.target.value);
                                  if (errors.custEmail) setErrors({...errors, custEmail: ''});
                                }}
                                placeholder="sarah.jenkins@gmail.com"
                                className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                  errors.custEmail ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                }`}
                              />
                              {errors.custEmail && (
                                <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{errors.custEmail}</span>
                                </p>
                              )}
                              <span className="text-[9px] text-[#777777] italic block mt-1 font-sans">
                                For secure order registry codes, digital receipts, and tracking links.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* SHIPPING DESTINATION */}
                        <div className="space-y-4 text-left">
                          <h4 className="text-[10px] uppercase tracking-[0.25em] text-slate-gray font-bold border-b border-soft-border/30 pb-1 font-mono">
                            2. Museum Transit Destination
                          </h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-3">
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Street Address <span className="text-signature-carmine">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={street}
                                  onChange={(e) => {
                                    setStreet(e.target.value);
                                    if (errors.street) setErrors({...errors, street: ''});
                                  }}
                                  placeholder="e.g. 742 Evergreen Terrace"
                                  className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                    errors.street ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                  }`}
                                />
                                {errors.street && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{errors.street}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Apt / Suite
                                </label>
                                <input
                                  type="text"
                                  value={suite}
                                  onChange={(e) => setSuite(e.target.value)}
                                  placeholder="e.g. Penthouse B"
                                  className="w-full p-3.5 border border-soft-border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none focus:border-signature-carmine transition-colors"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  City <span className="text-signature-carmine">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={city}
                                  onChange={(e) => {
                                    setCity(e.target.value);
                                    if (errors.city) setErrors({...errors, city: ''});
                                  }}
                                  placeholder="Springfield"
                                  className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                    errors.city ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                  }`}
                                />
                                {errors.city && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{errors.city}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  State / Province <span className="text-signature-carmine">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={state}
                                  onChange={(e) => {
                                    setState(e.target.value);
                                    if (errors.state) setErrors({...errors, state: ''});
                                  }}
                                  placeholder="Illinois"
                                  className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                    errors.state ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                  }`}
                                />
                                {errors.state && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{errors.state}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Postal / Zip Code <span className="text-signature-carmine">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={zip}
                                  onChange={(e) => {
                                    setZip(e.target.value);
                                    if (errors.zip) setErrors({...errors, zip: ''});
                                  }}
                                  placeholder="62704"
                                  className={`w-full p-3.5 border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none transition-colors ${
                                    errors.zip ? 'border-signature-carmine focus:border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                  }`}
                                />
                                {errors.zip && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{errors.zip}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Country
                                </label>
                                <select
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  className="w-full p-3.5 border border-soft-border rounded-xs text-xs bg-pure-white focus:outline-none focus:border-signature-carmine transition-premium cursor-pointer font-sans"
                                >
                                  <option value="United States">United States</option>
                                  <option value="Canada">Canada</option>
                                  <option value="United Kingdom">United Kingdom</option>
                                  <option value="Australia">Australia</option>
                                  <option value="Germany">Germany</option>
                                  <option value="France">France</option>
                                  <option value="Japan">Japan</option>
                                  <option value="Singapore">Singapore</option>
                                  <option value="Bangladesh">Bangladesh (Artveen Headquarters)</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Special Handling Instructions
                                </label>
                                <input
                                  type="text"
                                  value={deliveryNote}
                                  onChange={(e) => setDeliveryNote(e.target.value)}
                                  placeholder="e.g. Ring gate bell first, leave crate covered"
                                  className="w-full p-3.5 border border-soft-border rounded-xs text-base md:text-xs bg-[#FAFBFB]/50 focus:outline-none focus:border-signature-carmine transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* International Transit Trust Indicators */}
                        <div className="p-4 bg-[#FAF9F5]/40 border border-soft-border/60 rounded-xs space-y-3">
                          <div className="flex gap-2.5 items-center text-signature-carmine">
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <h5 className="text-[10px] uppercase tracking-[0.15em] font-bold font-mono">Premium Gallery Shipping Standards</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="space-y-1">
                              <h6 className="text-[10px] font-bold text-charcoal-ink uppercase font-sans">Custom Timber Crate</h6>
                              <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light">
                                Originals are sealed in bespoke solid pine wood crates lined with shock-absorbent museum foam.
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h6 className="text-[10px] font-bold text-charcoal-ink uppercase font-sans">Comprehensive Insurance</h6>
                              <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light">
                                Every acquisition includes complete worldwide transit insurance covering 100% of the artwork valuation.
                              </p>
                            </div>
                            <div className="space-y-1">
                              <h6 className="text-[10px] font-bold text-charcoal-ink uppercase font-sans">Customs & Delivery Assurance</h6>
                              <p className="text-[10px] text-slate-gray/80 leading-relaxed font-light">
                                We handle all export paperwork. Packages are shipped with priority air courier and require signature upon delivery.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Navigation back and forth */}
                        <div className="pt-4 border-t border-soft-border/50 flex justify-between items-center">
                          <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className="text-xs font-bold font-sans uppercase tracking-widest text-[#777777] hover:text-charcoal-ink hover:underline focus:outline-none py-2"
                          >
                            Back to Cart
                          </button>

                          <button
                            type="submit"
                            className="px-8 py-4 bg-charcoal-ink text-canvas-white hover:bg-signature-carmine text-xs uppercase tracking-widest font-bold rounded-xs flex items-center space-x-2 shadow-md transition-all duration-300"
                          >
                            <span>Proceed to Settlement</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                      </form>
                    </motion.div>
                  )}

                  {/* STEP 3: SETTLEMENT (PAYMENT & SUBMIT) */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-pure-white border border-soft-border rounded-xs p-6 md:p-8 shadow-xs space-y-6"
                    >
                      <div className="border-b border-soft-border/50 pb-4">
                        <h3 className="font-serif text-2xl font-light text-charcoal-ink">Acquisition Settlement</h3>
                        <p className="text-xs text-slate-gray font-sans mt-1 leading-normal">
                          Complete settlement details to authorize the fine-art acquisition and register ownership in our global archives.
                        </p>
                      </div>

                      <form onSubmit={handleAcquisitionSubmit} className="space-y-6">
                        
                        {/* PAYMENT TYPE SELECTOR */}
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('card');
                              setErrors({});
                            }}
                            className={`p-4 rounded-xs border text-center transition-premium flex flex-col items-center justify-center gap-2 ${
                              paymentMethod === 'card'
                                ? 'border-signature-carmine bg-[#FFFAFA] shadow-xs'
                                : 'border-soft-border bg-pure-white hover:border-gallery-blue'
                            }`}
                          >
                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-signature-carmine' : 'text-slate-gray'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Secured Credit Card</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPaymentMethod('wire');
                              setErrors({});
                            }}
                            className={`p-4 rounded-xs border text-center transition-premium flex flex-col items-center justify-center gap-2 ${
                              paymentMethod === 'wire'
                                ? 'border-signature-carmine bg-[#FFFAFA] shadow-xs'
                                : 'border-soft-border bg-pure-white hover:border-gallery-blue'
                            }`}
                          >
                            <Award className={`w-5 h-5 ${paymentMethod === 'wire' ? 'text-signature-carmine' : 'text-slate-gray'}`} />
                            <span className="text-xs font-bold uppercase tracking-wider">Bank Wire / Check</span>
                          </button>
                        </div>

                        {/* INTERACTIVE CREDIT CARD OPTION */}
                        {paymentMethod === 'card' ? (
                          <div className="space-y-6 animate-fade-in text-left">
                            
                            {/* Premium Credit Card Mockup Container */}
                            <div className="relative w-full max-w-sm h-48 bg-gradient-to-br from-charcoal-ink to-[#2D3135] rounded-lg p-6 text-canvas-white shadow-xl overflow-hidden font-mono text-left mx-auto mb-6">
                              <div className="absolute right-6 top-6 opacity-25">
                                <Sparkles className="w-16 h-16 text-canvas-white stroke-[1]" />
                              </div>
                              <div className="flex justify-between items-start h-full flex-col">
                                <div className="w-full flex justify-between items-center">
                                  {/* Simulated metal microchip */}
                                  <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-600 rounded-xs" />
                                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60">Fine Art Escape card</span>
                                </div>
                                <div className="space-y-4 w-full">
                                  {/* Card Number */}
                                  <p className="text-lg tracking-[0.15em] font-medium leading-none min-h-[22px]">
                                    {cardNumber || '•••• •••• •••• ••••'}
                                  </p>
                                  <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                      <p className="text-[7px] uppercase tracking-widest opacity-55">Collector Signature</p>
                                      <p className="text-[11px] tracking-wider uppercase truncate max-w-[200px] font-sans">
                                        {cardName || 'SARAH JENKINS'}
                                      </p>
                                    </div>
                                    <div className="flex gap-4">
                                      <div>
                                        <p className="text-[7px] uppercase tracking-widest opacity-55">Expiry</p>
                                        <p className="text-[11px] tracking-widest">
                                          {cardExpiry || 'MM/YY'}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-[7px] uppercase tracking-widest opacity-55">CVV</p>
                                        <p className="text-[11px] tracking-widest">
                                          {cardCvv || '•••'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Card Entry Fields */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Cardholder Name <span className="text-signature-carmine">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={cardName}
                                  onChange={(e) => {
                                    setCardName(e.target.value);
                                    if (errors.cardName) setErrors({...errors, cardName: ''});
                                  }}
                                  placeholder="SARAH JENKINS"
                                  className={`w-full p-3.5 border rounded-xs text-base md:text-xs font-mono bg-[#FAFBFB]/50 focus:outline-none uppercase ${
                                    errors.cardName ? 'border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                  }`}
                                />
                                {errors.cardName && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1 font-sans">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.cardName}</span>
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                  Card Number <span className="text-signature-carmine">*</span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => {
                                      handleCardNumberChange(e);
                                      if (errors.cardNumber) setErrors({...errors, cardNumber: ''});
                                    }}
                                    placeholder="4111 2222 3333 4444"
                                    className={`w-full p-3.5 pl-11 border rounded-xs text-base md:text-xs font-mono bg-[#FAFBFB]/50 focus:outline-none ${
                                      errors.cardNumber ? 'border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                    }`}
                                  />
                                  <CreditCard className="w-4 h-4 text-slate-gray absolute left-4 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                                </div>
                                {errors.cardNumber && (
                                  <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1 font-sans">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.cardNumber}</span>
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                    Expiry Date (MM/YY) <span className="text-signature-carmine">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={cardExpiry}
                                    onChange={(e) => {
                                      handleExpiryChange(e);
                                      if (errors.cardExpiry) setErrors({...errors, cardExpiry: ''});
                                    }}
                                    placeholder="12/28"
                                    className={`w-full p-3.5 border rounded-xs text-base md:text-xs font-mono bg-[#FAFBFB]/50 focus:outline-none text-center ${
                                      errors.cardExpiry ? 'border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                    }`}
                                  />
                                  {errors.cardExpiry && (
                                    <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1 font-sans">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{errors.cardExpiry}</span>
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="text-[10px] text-slate-gray uppercase tracking-wider font-semibold block mb-1.5 font-sans">
                                    Security CVV <span className="text-signature-carmine">*</span>
                                  </label>
                                  <input
                                    type="password"
                                    value={cardCvv}
                                    onChange={(e) => {
                                      handleCvvChange(e);
                                      if (errors.cardCvv) setErrors({...errors, cardCvv: ''});
                                    }}
                                    placeholder="•••"
                                    className={`w-full p-3.5 border rounded-xs text-base md:text-xs font-mono bg-[#FAFBFB]/50 focus:outline-none text-center ${
                                      errors.cardCvv ? 'border-signature-carmine' : 'border-soft-border focus:border-signature-carmine'
                                    }`}
                                  />
                                  {errors.cardCvv && (
                                    <p className="text-[10px] text-signature-carmine mt-1.5 flex items-center gap-1 font-sans">
                                      <AlertCircle className="w-3 h-3" />
                                      <span>{errors.cardCvv}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        ) : (
                          /* BANK WIRE INSTRUCTIONS */
                          <div className="bg-[#FAF9F5] p-6 rounded-xs border border-soft-border text-xs text-slate-gray space-y-4 animate-fade-in text-left">
                            <p className="font-semibold text-charcoal-ink flex items-center gap-2">
                              <Award className="w-4 h-4 text-signature-carmine" />
                              <span>Private Art Advisory Settlement</span>
                            </p>
                            <p className="leading-relaxed font-light">
                              For acquisition values of this tier, we accommodate custom wire transfers. Upon complete checkout submit, the artworks will be temporarily marked as <span className="text-signature-carmine font-semibold">Reserved / Private Collection</span> in our gallery, pending settlement within 48 hours.
                            </p>
                            <div className="p-4 bg-pure-white border border-soft-border/60 rounded-xs space-y-2 font-mono text-[11px] text-slate-gray/90 leading-normal">
                              <p><span className="text-[#777777] font-sans">Beneficiary:</span> Tanveen Art Escape Private Limited</p>
                              <p><span className="text-[#777777] font-sans">Reference:</span> COA-RESERVE-{Date.now().toString().slice(-4)}</p>
                              <p><span className="text-[#777777] font-sans">Adviser Hotline:</span> advisory@escape.com</p>
                              <p className="text-[10px] text-signature-carmine italic pt-1 font-sans">
                                Exact IBAN and routing instructions will be generated instantly in your order success ledger.
                              </p>
                            </div>

                            <label className="flex items-center space-x-3 pt-2 text-charcoal-ink font-semibold select-none cursor-pointer">
                              <input
                                type="checkbox"
                                checked={wireAcknowledged}
                                onChange={(e) => {
                                  setWireAcknowledged(e.target.checked);
                                  if (errors.wire) setErrors({});
                                }}
                                className="rounded-sm border-soft-border focus:ring-signature-carmine text-signature-carmine cursor-pointer w-4 h-4"
                              />
                              <span>I acknowledge wire settlement coordinates.</span>
                            </label>
                            {errors.wire && (
                              <p className="text-[10px] text-signature-carmine flex items-center gap-1 font-sans">
                                <AlertCircle className="w-3 h-3" />
                                <span>{errors.wire}</span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* REASSURING CRYPTOGRAPHIC TRUST LOGO */}
                        <div className="bg-gallery-blue/5 rounded-xs p-4 flex items-center gap-3.5 border border-soft-border text-slate-gray/80 text-xs">
                          <Lock className="w-6 h-6 text-signature-carmine shrink-0" />
                          <div className="leading-normal font-sans">
                            <p className="font-semibold text-charcoal-ink text-[11px]">256-Bit SSL Encrypted Connection</p>
                            <p className="text-[10px] font-light">Your identity is confidential. Financial channels are secure and protected with banking-grade encryption keys.</p>
                          </div>
                        </div>

                        {/* SUBMIT OR CANCEL BAR */}
                        <div className="pt-4 border-t border-soft-border/50 flex justify-between items-center font-sans">
                          <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="text-xs font-bold uppercase tracking-widest text-[#777777] hover:text-charcoal-ink hover:underline focus:outline-none py-2"
                          >
                            Back to Logistics
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-10 py-4 text-xs font-sans font-bold uppercase tracking-widest text-canvas-white rounded-xs shadow-md transition-all duration-300 flex items-center space-x-2.5 focus:outline-none ${
                              isSubmitting ? 'bg-slate-gray/40 cursor-wait' : 'bg-signature-carmine hover:brightness-110'
                            }`}
                            id="settlement-submit-btn"
                          >
                            {isSubmitting ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Authorizing...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Complete Acquisition</span>
                              </>
                            )}
                          </button>
                        </div>

                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            )}

            {/* RIGHT COLUMN: DETAILED ORDER SUMMARY & TRUST BADGES (STAYS STICKY IN DESKTOP) */}
            {activeStep < 4 && (
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 print:hidden">
                
                {/* 1. ORDER SUMMARY CARD */}
                <div className="bg-pure-white border border-soft-border rounded-xs p-6 md:p-8 shadow-xs text-left">
                  <h3 className="font-serif text-lg font-bold border-b border-soft-border pb-3 mb-5">
                    Order Summary
                  </h3>

                  {/* Artwork Summary Mini list */}
                  <div className="space-y-4 mb-6 max-h-[220px] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="flex gap-3 text-xs items-center justify-between font-sans">
                        <div className="flex gap-2.5 items-center flex-1 min-w-0">
                          <div className="w-10 h-10 bg-[#FAF9F5]/70 border border-soft-border rounded-xs overflow-hidden shrink-0 flex items-center justify-center p-1">
                            <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 leading-normal">
                            <p className="font-serif font-semibold text-charcoal-ink truncate">"{item.title}"</p>
                            <p className="text-[9px] text-[#777777] uppercase font-mono tracking-wider mt-0.5">
                              Qty: {item.quantity} • {item.optionType.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-medium text-charcoal-ink/90">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculation Details */}
                  <div className="border-t border-soft-border/40 pt-4 space-y-2.5 text-xs font-sans text-slate-gray">
                    <div className="flex justify-between items-center">
                      <span>Artwork Subtotal</span>
                      <span className="font-semibold text-charcoal-ink">${cartSubtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span>Fine Art Wooden Crating</span>
                        <span className="text-[8px] bg-signature-carmine/10 text-signature-carmine font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm">Complimentary</span>
                      </div>
                      <span className="text-slate-gray/50 line-through">${packingPrice}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span>Climate-Controlled Courier</span>
                        <span className="text-[8px] bg-signature-carmine/10 text-signature-carmine font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm">Complimentary</span>
                      </div>
                      <span className="text-slate-gray/50 line-through">${shippingPrice}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Archival Certificate Registration</span>
                      <span className="text-[9px] font-bold uppercase text-signature-carmine font-mono tracking-widest">Included</span>
                    </div>

                    <div className="border-t border-soft-border pt-4 mt-2 flex justify-between items-end font-sans">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#777777] font-mono leading-none">Total Investment</p>
                        <p className="text-[10px] text-slate-gray/70 italic mt-1 font-light">Custom duty duties included</p>
                      </div>
                      <span className="font-serif font-extrabold text-2xl text-charcoal-ink">
                        ${totalInvestment.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. REASSURING TRUST BADGES PLAQUE */}
                <div className="bg-pure-white border border-soft-border rounded-xs p-6 md:p-8 shadow-xs space-y-4 text-left font-sans">
                  <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#777777] font-bold border-b border-soft-border/30 pb-2">
                    Acquisition Assurances
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <Award className="w-5 h-5 text-signature-carmine shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-charcoal-ink">Physical Certificate of Authenticity (COA)</p>
                        <p className="text-slate-gray/80 text-[11px] font-light mt-0.5">
                          Every unique original and limited print is issued a wax-sealed, physical Certificate hand-signed by Tanveen, registered in the gallery ledger.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <Truck className="w-5 h-5 text-signature-carmine shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-charcoal-ink">Climate-Controlled Wooden Crate Packing</p>
                        <p className="text-slate-gray/80 text-[11px] font-light mt-0.5">
                          Wrapped carefully in archival, acid-free glassine sheets and secured inside a shockproof wooden frame constructed to museum transit standards.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-xs leading-normal">
                      <Globe className="w-5 h-5 text-signature-carmine shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-charcoal-ink">Fully Insured Transit Guarantee</p>
                        <p className="text-slate-gray/80 text-[11px] font-light mt-0.5">
                          In the exceedingly rare occurrence of delivery delay or transit damage, our high-value Lloyd's policy guarantees complete replacement or investment refund.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* STEP 4: GORGEOUS REGISTRY SUCCESS VIEW (CERTIFICATE CELEBRATION) */}
            {/* ========================================================================= */}
            {activeStep === 4 && placedOrderDetails && (
              <div className="lg:col-span-12 max-w-4xl mx-auto space-y-10 py-4 text-center print:p-0 font-sans animate-fade-in">
                
                {/* Visual Checkmark Celebration */}
                <div className="space-y-3 print:hidden">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xs border border-green-500/20">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="font-serif text-3xl font-light text-charcoal-ink">
                    Thank you for becoming a collector.
                  </h3>
                  <p className="text-xs md:text-sm text-slate-gray max-w-lg mx-auto leading-relaxed font-light">
                    Your artwork is now being carefully prepared. Below is a secure replica of the physical Certificate of Authenticity currently registered in our historical archives.
                  </p>
                </div>

                {/* MUSEUM GRADE PHYSICAL REPRESENTATION OF THE CERTIFICATE */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative w-full max-w-3xl mx-auto bg-[#FDFCF7] border-8 border-double border-[#A59580] p-8 md:p-12 shadow-2xl text-left font-serif text-[#3E382F] overflow-hidden select-none print:shadow-none print:border-4 print:p-6"
                  style={{ backgroundImage: 'radial-gradient(rgba(165,149,128,0.03) 1px, transparent 0)', backgroundSize: '16px 16px' }}
                >
                  
                  {/* Ornate Corner Accents */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#A59580]" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#A59580]" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#A59580]" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#A59580]" />

                  {/* Header */}
                  <div className="text-center space-y-2 border-b-2 border-[#E3DEC9] pb-6 mb-8">
                    <h4 className="font-sans text-[10px] tracking-[0.45em] uppercase text-[#736453] font-bold">
                      Tanveen Editorial Fine Art Escape
                    </h4>
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[#332A1F]">
                      Certificate of Authenticity
                    </h2>
                    <p className="text-[10px] italic font-sans text-slate-gray">
                      Permanent Registration Registry of ownership titles
                    </p>
                  </div>

                  {/* Main certificate narrative details */}
                  <div className="space-y-6 text-sm leading-relaxed md:text-base font-light text-[#4A4235]">
                    <p className="text-center font-sans text-xs uppercase tracking-widest text-[#736453] font-bold">
                      This Document Confirms That
                    </p>
                    
                    <p className="text-center text-xl md:text-2xl font-serif tracking-wide border-b border-[#F0ECD8] pb-1 font-semibold max-w-md mx-auto italic text-signature-carmine">
                      {placedOrderDetails.customerName}
                    </p>
                    
                    <p className="text-center font-sans text-xs uppercase tracking-widest text-[#736453] mt-4 font-bold">
                      Is Registered as the Legal Curator and Owner of
                    </p>

                    {/* Art Itemized display inside certificate */}
                    <div className="space-y-4 my-6">
                      {placedOrderDetails.items.map((item) => (
                        <div key={item.cartItemId} className="p-4 bg-[#F8F6EF]/60 border border-[#EBE7D3] rounded-xs space-y-1 max-w-xl mx-auto">
                          <h4 className="font-serif text-base italic text-center font-medium">
                            "{item.title}"
                          </h4>
                          <p className="text-center font-sans text-[10px] uppercase tracking-wider text-slate-gray font-semibold">
                            Edition: {item.optionType.replace('_', ' ')} • Format: {item.size}
                          </p>
                          <p className="text-center font-mono text-[9px] text-[#A59580]">
                            Certificate Code: {placedOrderDetails.certificateCode || 'COA-REG-PENDING'}
                          </p>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-center font-sans leading-relaxed text-[#736453]/90 font-light max-w-lg mx-auto">
                      Each unique canvas has been hand-stretched, registered with natural Cox’s Bazar sea salt, and processed at Tanveen's Private Studio. This certificate guarantees the authentic provenance and artistic registry of these curated works.
                    </p>
                  </div>

                  {/* Footer Seal, Date & Signatures */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-t border-[#E3DEC9] pt-8 mt-10 print:mt-6">
                    
                    {/* Left: Registration coordinates */}
                    <div className="text-left font-mono text-[10px] text-[#8C7A6B] space-y-1 leading-normal order-3 md:order-1">
                      <p className="font-sans uppercase text-[8px] tracking-widest font-bold text-slate-gray">Ledger Metadata</p>
                      <p>Registry ID: <span className="font-bold text-charcoal-ink">{placedOrderDetails.id}</span></p>
                      <p>Date Filed: {placedOrderDetails.date}</p>
                      <p>Status: <span className="text-green-600 font-bold">Provenance Secured</span></p>
                    </div>

                    {/* Middle: Physical red wax seal visual */}
                    <div className="flex justify-center order-1 md:order-2">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-red-700 to-[#990000] rounded-full border-4 border-[#7A0000] shadow-lg flex items-center justify-center text-center font-serif text-canvas-white select-none scale-105 transform hover:scale-110 transition-transform cursor-help" title="Cryptographically Sealed Registry Certificate">
                        <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-red-300/40 opacity-50" />
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight font-sans text-red-100">
                          SEALED<br />2026
                        </span>
                        <div className="absolute -inset-2 bg-radial-gradient from-transparent via-transparent to-red-950/20 pointer-events-none rounded-full" />
                      </div>
                    </div>

                    {/* Right: Artist Signature visual */}
                    <div className="text-center md:text-right font-serif order-2 md:order-3 space-y-1">
                      <div className="h-10 flex items-end justify-center md:justify-end">
                        <span className="text-2xl font-serif italic text-signature-carmine tracking-wider font-light select-none">
                          Tanveen
                        </span>
                      </div>
                      <p className="border-t border-[#CFCAB1] pt-1.5 font-sans text-[9px] uppercase tracking-widest font-bold text-[#736453]">
                        Artist Signature
                      </p>
                    </div>

                  </div>

                </motion.div>

                {/* Print and Route actions */}
                <div className="pt-6 border-t border-soft-border/50 max-w-xl mx-auto flex flex-col sm:flex-row gap-4 justify-center items-center print:hidden">
                  
                  <button
                    onClick={handlePrintCertificate}
                    className="w-full sm:w-auto px-6 py-3.5 border border-soft-border rounded-xs text-[#777777] hover:text-charcoal-ink hover:border-charcoal-ink font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 bg-pure-white shadow-xs focus:outline-none transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Ownership Receipt</span>
                  </button>

                  <button
                    onClick={() => setRoute('portal')}
                    className="w-full sm:w-auto px-10 py-3.5 bg-signature-carmine text-canvas-white hover:brightness-110 font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 shadow-md focus:outline-none transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Go To Collector Portal</span>
                  </button>
                  
                </div>

                {/* Helpful Advisory block */}
                <div className="max-w-xl mx-auto bg-studio-mist/40 p-5 rounded-xs border border-soft-border/70 text-xs text-slate-gray/90 leading-relaxed font-sans print:hidden">
                  <p className="font-semibold text-charcoal-ink text-left mb-1">Logistics Coordinate Trace</p>
                  <p className="text-left font-light">
                    A verification receipt with secure order coordinates has been dispatched to <span className="font-medium text-charcoal-ink">{placedOrderDetails.customerEmail}</span>. White-glove art couriers will call you directly to schedule delivery and temperature verification.
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
