'use client';

import { getImageUrl } from '@/lib/imagekit';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Lock, 
  Award, 
  CheckCircle2 
} from 'lucide-react';

const loadScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    country: 'IN',
  });

  // Verify that customer is logged in before allowing checkout
  useEffect(() => {
    const userInfoStr = typeof window !== 'undefined' ? localStorage.getItem('creatorsKitUserInfo') : null;
    const storedRole = typeof window !== 'undefined' ? (sessionStorage.getItem('userRole') || localStorage.getItem('userRole')) : null;
    const sessionEmail = typeof window !== 'undefined' ? (sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail')) : null;
    let user = null;
    if (userInfoStr) {
      try {
        user = JSON.parse(userInfoStr);
      } catch (e) {}
    }

    const isLoggedIn = (user?.email || sessionEmail) && storedRole !== 'admin' && user?.role !== 'admin';

    if (!isLoggedIn) {
      router.replace('/login?redirect=/checkout');
      return;
    }

    const email = user?.email || sessionEmail || '';
    const name = user?.name || (sessionStorage.getItem('userName') || localStorage.getItem('userName')) || '';
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData((prev) => ({
      ...prev,
      email: prev.email || email,
      firstName: prev.firstName || firstName,
      lastName: prev.lastName || lastName,
    }));
  }, [router]);

  const finalTotal = Math.max(0, cartTotal - (appliedCoupon?.discountAmount || 0));
  const cartItemCount = cart ? cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0) : 0;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartItems: cart }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getOrderData = () => {
    return {
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: '', 
        zipCode: formData.zip,
        country: formData.country
      },
      items: cart.map(item => ({
        productId: item._id || item.id || 'unknown',
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.img || ((item.images && item.images.length > 0) ? (item.images[0].src || item.images[0]) : null)
      })),
      bundledCourses: [
        { id: 'instagram-mastery', title: 'Instagram Mastery', status: 'Granted' },
        { id: 'youtube-mastery', title: 'YouTube Mastery', status: 'Granted' },
        { id: 'filmora-mastery', title: 'Filmora Mastery', status: 'Granted' },
      ],
      totalAmount: finalTotal,
      status: 'Processing' 
    };
  };

  const saveOrderToDb = async (paymentOrderId) => {
    try {
      const orderId = paymentOrderId || `COD-${Date.now()}`;
      const orderData = { ...getOrderData(), orderId };
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('Failed to save order:', errData.error);
        setCheckoutError('Failed to save order: ' + errData.error);
      }
      return orderId;
    } catch (err) {
      console.error('Failed to save order to DB', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError('');

    try {
      // 1. Create Razorpay order via our API route
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          customer: formData,
          discountAmount: appliedCoupon?.discountAmount || 0,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await res.json();

      // 2. Load Razorpay Script
      const isScriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!isScriptLoaded || !window.Razorpay) {
        setCheckoutError('Razorpay SDK failed to load. Please check your connection.');
        setLoading(false);
        return;
      }

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Creators Kit',
        description: 'Complete Creators Kit Bundle',
        order_id: order.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: '#900606',
        },
        handler: async function (response) {
          try {
            const verificationRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: getOrderData()
              })
            });
            const verifyData = await verificationRes.json();
            
            if (verifyData.success) {
              clearCart();
              if (typeof window !== 'undefined') {
                localStorage.setItem('creatorskit_courses_unlocked', 'true');
                try {
                  const bc = new BroadcastChannel('creatorskit_masterclasses_channel');
                  bc.postMessage({ type: 'updated' });
                  bc.close();
                } catch (e) {}
                window.dispatchEvent(new Event('masterclasses-updated'));
              }
              const savedOrderId = verifyData.order?.orderId || verifyData.order?._id;
              router.push(`/order-success?orderId=${savedOrderId}`);
            } else {
              setCheckoutError('Payment Verification Failed: ' + verifyData.error);
              setLoading(false);
            }
          } catch (err) {
            console.error(err);
            setCheckoutError('Failed to verify payment with server.');
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setCheckoutError('Payment Failed: ' + response.error.description);
        setLoading(false);
      });
      
      rzp.open();

    } catch (error) {
      setCheckoutError(error.message);
      setLoading(false);
    }
  };

  // 1. EMPTY CHECKOUT STATE
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-[#900606] selection:text-white relative overflow-hidden flex flex-col justify-center items-center px-4 py-24 transition-colors duration-300">
        {/* Subtle Signature Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#900606]/10 blur-[140px] rounded-full pointer-events-none -z-0"></div>

        <div className="relative z-10 max-w-lg w-full bg-white dark:bg-[#131C2E] rounded-3xl sm:rounded-[2.5rem] border border-neutral-200/90 dark:border-neutral-800 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 sm:p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center mb-6 shadow-inner border border-red-100/80 dark:border-red-900/50">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.75]" />
          </div>

          <span className="text-xs font-bold tracking-[0.2em] text-[#900606] uppercase mb-2">
            NO ITEMS IN CHECKOUT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-white tracking-tight mb-3">
            Your cart is currently empty
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-sm">
            Please select your creator bundle or equipment gear before proceeding to checkout.
          </p>

          <Link
            href="/product"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#900606] hover:bg-[#7a0505] text-white rounded-full font-bold text-sm shadow-[0_4px_16px_rgba(144,6,6,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <span>Explore Studio Gear</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    );
  }

  // 2. ACTIVE CHECKOUT STATE
  return (
    <div className="min-h-[100svh] bg-[#FDFBF7] dark:bg-[#0B0F19] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-[#900606] selection:text-white relative overflow-x-hidden pb-16 transition-colors duration-300">
      
      {/* Subtle Signature Ambient Glow Matching Product, Cart & Contact */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] bg-[#900606]/10 blur-[120px] rounded-full pointer-events-none -z-0"></div>

      <main className="max-w-[1750px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 sm:pt-32 relative z-10">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 font-medium mb-5">
          <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</Link>
          <span className="text-neutral-300 dark:text-neutral-700">›</span>
          <Link href="/product" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Studio Gear</Link>
          <span className="text-neutral-300 dark:text-neutral-700">›</span>
          <Link href="/cart" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Your Cart</Link>
          <span className="text-neutral-300 dark:text-neutral-700">›</span>
          <span className="text-[#900606] font-semibold">Secure Checkout</span>
        </nav>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-3 sm:mb-5 pb-5 border-b border-neutral-200/80 dark:border-neutral-800">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#111827] dark:text-white tracking-tight">
              Complete Your <span className="text-[#900606] whitespace-nowrap">Order</span>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm font-medium mt-1.5 leading-relaxed">
              Provide your delivery details and complete your payment safely with Razorpay 256-bit encryption.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-full px-4 py-1.5 shadow-2xs text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        {/* 12-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT: CHECKOUT FORM (7 Columns) */}
          <div className="lg:col-span-7 w-full bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl sm:rounded-[1rem] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-7 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {/* Section 1: Contact Information */}
              <section>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white tracking-tight">
                      Contact <span className="text-[#900606]">Information</span>
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#900606] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-100 dark:border-red-900/40">Step 1</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Email Address <span className="text-[#900606]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                  />
                </div>
              </section>

              {/* Section 2: Shipping Address */}
              <section>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white tracking-tight">
                      Shipping <span className="text-[#900606]">Address</span>
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#900606] bg-red-50 dark:bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-100 dark:border-red-900/40">Step 2</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      First Name <span className="text-[#900606]">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="e.g. Rahul"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Last Name <span className="text-[#900606]">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="e.g. Sharma"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Street Address <span className="text-[#900606]">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Flat, House no., Building, Apartment, Street name"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      City <span className="text-[#900606]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      PIN / ZIP Code <span className="text-[#900606]">*</span>
                    </label>
                    <input
                      type="text"
                      name="zip"
                      required
                      placeholder="e.g. 400001"
                      value={formData.zip}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] dark:bg-[#0B0F19] border border-neutral-200/90 dark:border-neutral-700/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium text-sm focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/20 transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Payment Method */}
              <section>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white tracking-tight">
                      Payment <span className="text-[#900606]">Method</span>
                    </h2>
                  </div>
                  <div className="flex items-center text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/40">
                    <Lock className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                    Secure
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`block p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'online' ? 'bg-[#900606]/5 border-[#900606] ring-1 ring-[#900606]/30 shadow-[0_2px_12px_rgba(144,6,6,0.06)]' : 'bg-[#FDFBF7] dark:bg-[#0B0F19] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'online' ? 'border-[#900606]' : 'border-neutral-400 dark:border-neutral-600'}`}>
                          {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-[#900606]" />}
                        </div>
                        <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-neutral-200/80 dark:border-neutral-700 shadow-2xs">
                          <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#3395FF]">
                            <path d="M250 500c138.071 0 250-111.929 250-250S388.071 0 250 0 0 111.929 0 250s111.929 250 250 250z" fill="currentColor"/>
                            <path d="M150.313 189.688L297.813 135c10.312-3.75 20 4.688 15 14.688L270 235c-2.188 4.688-2.188 10 0 14.688l42.813 85.312c5 10-4.688 18.438-15 14.688L150.313 295c-10.313-3.75-10.313-18.438 0-22.188l55.937-20c4.375-1.562 7.188-5.937 6.875-10.625l-6-63.75c-.625-5.312-5.312-9.062-10.625-8.437l-46.187 6c-11.25 1.562-17.5-12.813-9.375-20.312l49.062-42.5c4-3.438 4.375-9.688.938-13.75-2.813-3.125-7.5-4.062-11.25-2.188l-29.375 14.062c-9.688 4.688-19.376-3.437-14.063-12.5z" fill="#fff"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${paymentMethod === 'online' ? 'text-[#900606] dark:text-red-400' : 'text-neutral-800 dark:text-neutral-200'}`}>Pay Online (Razorpay)</h3>
                          <p className="text-neutral-500 text-xs mt-0.5 font-medium">Credit/Debit Cards, UPI, Netbanking & Wallets</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                        Instant Confirmation
                      </span>
                    </div>
                    <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                  </label>
                </div>
              </section>

              {/* Error Message */}
              {checkoutError && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-2.5">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-base overflow-hidden group/btn transition-all duration-300 shadow-sm flex justify-center items-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2.5">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Secure Payment...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay ₹{finalTotal.toLocaleString()} with Razorpay</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                <Link href="/cart" className="hover:text-[#900606] font-semibold transition-colors flex items-center gap-1">
                  <span>←</span> Return to Cart
                </Link>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Protected</span>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY (5 Columns) */}
          <div className="lg:col-span-5 w-full lg:sticky lg:top-32">
            <div className="bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-800 rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6 transition-colors duration-300 w-full">
              
              {/* Summary Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white tracking-tight">
                    Order <span className="text-[#900606]">Summary</span>
                  </h2>
                </div>
                <span className="bg-red-50 dark:bg-red-950/40 text-[#900606] text-xs font-bold px-3 py-1 rounded-full border border-red-100 dark:border-red-900/40">
                  {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const defaultKitImages = [
                    { src: '/ring5.png', title: 'Studio RGB Ring Light' },
                    { src: '/tripod6.png', title: 'ApexPro Heavy-Duty Tripod' },
                    { src: '/chorma2.png', title: 'ChromaKey Green Screen' },
                    { src: '/wireless-mic4.png', title: 'Rode Wireless GO II' }
                  ];
                  const isKitProduct = String(item.id).startsWith('rode-wireless-go-2') || String(item.id).startsWith('creators-kit');
                  const allImages = (item.images && item.images.length > 1) 
                    ? item.images 
                    : (isKitProduct ? defaultKitImages : (item.images || []));

                  const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);

                  return (
                    <div key={item.id} className="flex gap-3.5 items-start p-3 bg-[#FDFBF7] dark:bg-[#0B0F19] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
                      {/* Image Thumbnail with Item Count Badge */}
                      <div className="relative shrink-0">
                        {allImages && allImages.length > 1 ? (
                          <div className="relative w-16 h-16 bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-700/80 rounded-xl p-1 overflow-hidden shadow-inner grid grid-cols-2 gap-1">
                            {allImages.slice(0, 4).map((img, idx) => {
                              const imgSrc = typeof img === 'string' ? img : (img.src || img.image);
                              const imgTitle = typeof img === 'object' ? (img.title || img.name) : `Item ${idx + 1}`;
                              return (
                                <div key={idx} className="relative w-full h-full bg-neutral-50 dark:bg-neutral-800 rounded flex items-center justify-center border border-neutral-100 dark:border-neutral-700 overflow-hidden" title={imgTitle}>
                                  <Image
                                    src={getImageUrl(imgSrc)}
                                    alt={imgTitle}
                                    fill
                                    className="object-contain p-0.5 mix-blend-multiply"
                                    sizes="32px"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="relative w-16 h-16 bg-white dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-700/80 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                            <Image 
                              src={getImageUrl(item.img || item.image || (item.images && item.images.length > 0 ? (item.images[0].src || item.images[0]) : '/placeholder.png'))} 
                              alt={item.name} 
                              fill 
                              className="object-contain p-1.5 mix-blend-multiply" 
                              sizes="64px" 
                            />
                          </div>
                        )}
                        <span className="absolute -top-1.5 -right-1.5 bg-[#900606] text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10 ring-2 ring-white dark:ring-[#131C2E]">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-[#111827] dark:text-white truncate">{item.name}</h4>
                          <span className="font-extrabold text-sm text-[#900606] shrink-0">
                            ₹{itemTotal.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">{item.subtitle || 'Complete creator bundle.'}</p>

                        {allImages && allImages.length > 1 && (
                          <div className="flex flex-wrap items-center gap-1 mt-2">
                            {allImages.map((img, idx) => {
                              const imgSrc = typeof img === 'string' ? img : (img.src || img.image);
                              const imgTitle = typeof img === 'object' ? (img.title || img.name) : `Item ${idx + 1}`;
                              return (
                                <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-[#131C2E] border border-neutral-200/70 dark:border-neutral-700/70 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300 rounded px-1.5 py-0.5 shadow-2xs" title={imgTitle}>
                                  <span className="relative w-2.5 h-2.5 inline-block shrink-0">
                                    <Image src={getImageUrl(imgSrc)} alt={imgTitle} fill className="object-contain" sizes="10px" />
                                  </span>
                                  <span className="truncate max-w-[80px]">{imgTitle}</span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Section */}
              <div className="bg-[#FDFBF7] dark:bg-[#0B0F19] p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800">
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-white dark:bg-[#131C2E] border border-neutral-200/90 dark:border-neutral-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white uppercase placeholder:normal-case placeholder:text-neutral-400 font-semibold focus:outline-none focus:border-[#900606] focus:ring-2 focus:ring-[#900606]/15 transition-all"
                    disabled={appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                      className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || couponLoading}
                      className="relative px-5 py-2.5 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl text-xs sm:text-sm font-bold overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                      <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                      <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-1.5">
                        {couponLoading ? '...' : 'Apply'}
                      </span>
                    </button>
                  )}
                </div>
                {couponError && <p className="text-red-600 text-xs mt-2 font-medium">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon applied: -₹{appliedCoupon.discountAmount.toLocaleString()} savings!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-5 space-y-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-500">Subtotal</span>
                  <span className="font-bold text-[#111827] dark:text-white">₹{cartTotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-500">Standard Shipping</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    FREE
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-500">Estimated Taxes</span>
                  <span className="font-medium text-neutral-500">Calculated at checkout</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-base font-bold text-[#111827] dark:text-white">Estimated Total</span>
                  <div className="text-right">
                    <span className="text-xs text-neutral-400 mr-1.5 font-medium">INR</span>
                    <span className="text-3xl sm:text-4xl font-black text-[#900606] tracking-tight">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal text-right">
                  Inclusive of all applicable GST taxes
                </p>
              </div>

              {/* Trust Badges Inside Summary */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100/80 dark:border-emerald-900/40 rounded-xl px-3 py-2">
                  <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-semibold">256-bit SSL Encrypted Checkout</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>7-Day Replacement</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Official Warranty</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM TRUST & GUARANTEES ROW (Strictly Matching Product, Cart & About) */}
        <div className="mt-8 sm:mt-10 pt-10 border-t border-neutral-200/80 dark:border-neutral-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 sm:p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">Free Delivery</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">Nationwide 3-5 days</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 sm:p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">7 Days Replacement</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">Hassle-free doorstep pickup</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 sm:p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">Secure Payments</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">100% verified gateway</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#131C2E] rounded-2xl p-4 sm:p-5 border border-neutral-200/90 dark:border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:border-neutral-300 transition-all duration-300 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 text-[#900606] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">Genuine Products</h4>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">Official brand warranty</p>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
