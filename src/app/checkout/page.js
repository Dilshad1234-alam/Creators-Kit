'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';

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

  const finalTotal = Math.max(0, cartTotal - (appliedCoupon?.discountAmount || 0));

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
        quantity: item.quantity
      })),
      totalAmount: finalTotal,
      status: 'Processing' 
    };
  };

  const saveOrderToDb = async (paymentOrderId) => {
    try {
      const orderData = { ...getOrderData(), orderId: paymentOrderId || `COD-${Date.now()}` };
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
    } catch (err) {
      console.error('Failed to save order to DB', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError('');

    try {
      if (paymentMethod === 'cod') {
        // Mock successful COD checkout
        setTimeout(async () => {
          await saveOrderToDb();
          clearCart();
          router.push('/order-success');
        }, 1000);
        return;
      }

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

      // If keys are missing and the server returned a mock order, simulate a successful payment for testing
      if (order.id && order.id.startsWith('order_mock_')) {
        setTimeout(async () => {
          await saveOrderToDb('mock_payment_' + Date.now());
          clearCart();
          router.push('/order-success');
        }, 1000);
        return;
      }

      // 3. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use the live key loaded from env
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
          color: '#FF3B14',
        },
        handler: async function (response) {
          // Payment Successful, verify signature securely on backend
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
              router.push('/order-success');
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



  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D0E] text-zinc-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No items in checkout.</h1>
          <Link href="/product" className="text-[#FF3B14] hover:underline font-medium">Return to store</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-[#0B0D0E] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#FF3B14]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 pt-4">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left side: Checkout Form */}
          <div className="w-full lg:flex-1 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-zinc-100">Contact Information</h2>
                <div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                </div>
              </section>

              {/* Shipping */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-zinc-100">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Street address"
                    value={formData.address}
                    onChange={handleChange}
                    className="col-span-2 w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                  <input
                    type="text"
                    name="zip"
                    required
                    placeholder="ZIP code"
                    value={formData.zip}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0D0E] border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14] transition-colors shadow-inner"
                  />
                </div>
              </section>

              {/* Payment */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-zinc-100">Payment Method</h2>
                  <div className="flex items-center text-[10px] text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full border border-green-400/20">
                    <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H9V7a1 1 0 012 0v2h2V7a3 3 0 00-3-3z" clipRule="evenodd"></path>
                    </svg>
                    Secure Checkout
                  </div>
                </div>
                
                <div className="space-y-3">
                  {/* Online Payment Option */}
                  <label className={`block p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'online' ? 'bg-[#FF3B14]/10 border-[#FF3B14] shadow-[0_0_15px_rgba(252,29,0,0.1)]' : 'bg-[#0B0D0E]/50 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-[#FF3B14]' : 'border-zinc-600'}`}>
                        {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B14]" />}
                      </div>
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#3395FF]">
                          <path d="M250 500c138.071 0 250-111.929 250-250S388.071 0 250 0 0 111.929 0 250s111.929 250 250 250z" fill="currentColor"/>
                          <path d="M150.313 189.688L297.813 135c10.312-3.75 20 4.688 15 14.688L270 235c-2.188 4.688-2.188 10 0 14.688l42.813 85.312c5 10-4.688 18.438-15 14.688L150.313 295c-10.313-3.75-10.313-18.438 0-22.188l55.937-20c4.375-1.562 7.188-5.937 6.875-10.625l-6-63.75c-.625-5.312-5.312-9.062-10.625-8.437l-46.187 6c-11.25 1.562-17.5-12.813-9.375-20.312l49.062-42.5c4-3.438 4.375-9.688.938-13.75-2.813-3.125-7.5-4.062-11.25-2.188l-29.375 14.062c-9.688 4.688-19.376-3.437-14.063-12.5z" fill="#fff"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm ${paymentMethod === 'online' ? 'text-white' : 'text-zinc-300'}`}>Pay Online (Razorpay)</h3>
                        <p className="text-zinc-500 text-xs mt-0.5">Credit/Debit, UPI & Netbanking</p>
                      </div>
                    </div>
                    <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="hidden" />
                  </label>

                  {/* Cash on Delivery Option */}
                  <label className={`block p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'bg-[#FF3B14]/10 border-[#FF3B14] shadow-[0_0_15px_rgba(252,29,0,0.1)]' : 'bg-[#0B0D0E]/50 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#FF3B14]' : 'border-zinc-600'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B14]" />}
                      </div>
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center p-2 shrink-0">
                        <span className="text-xl">🚚</span>
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm ${paymentMethod === 'cod' ? 'text-white' : 'text-zinc-300'}`}>Cash on Delivery (COD)</h3>
                        <p className="text-zinc-500 text-xs mt-0.5">Pay when you receive your order</p>
                      </div>
                    </div>
                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  </label>
                </div>
              </section>

              {checkoutError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-start gap-2">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FF3B14] text-white rounded-xl font-bold text-lg hover:bg-[#E01900] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-[#FF3B14]/40 hover:-translate-y-1 flex justify-center items-center mt-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : paymentMethod === 'online' ? (
                  `Pay ₹${finalTotal.toLocaleString()} with Razorpay`
                ) : (
                  `Place Order (COD)`
                )}
              </button>
            </form>
          </div>

          {/* Right side: Order Summary */}
          <div className="w-full lg:w-[420px] lg:sticky lg:top-24">
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-zinc-100">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center mb-6">
                    <div className="relative shrink-0">
                      <div className="grid grid-cols-3 gap-1.5 w-[140px]">
                        {item.images && item.images.length > 0 ? (
                          item.images.map((img, idx) => (
                            <div key={idx} className="relative w-10 h-10 bg-[#0B0D0E] rounded-lg flex items-center justify-center border border-zinc-800 overflow-hidden shadow-inner">
                              <Image src={img.src} alt={`${item.name} part ${idx + 1}`} fill className="object-contain p-1" />
                            </div>
                          ))
                        ) : (
                          <div className="w-16 h-16 bg-[#0B0D0E] border border-zinc-800 rounded-xl flex items-center justify-center text-3xl shadow-inner col-span-3">
                            📦
                          </div>
                        )}
                      </div>
                      <span className="absolute -top-2 -right-2 bg-[#FF3B14] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-[#FF3B14]/50 z-10 ring-2 ring-zinc-900">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-zinc-100 truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Complete bundle</p>
                    </div>
                    <div className="font-semibold text-sm text-zinc-100">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-6 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white uppercase placeholder:normal-case placeholder-zinc-500 focus:outline-none focus:border-[#FF3B14]"
                    disabled={appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || couponLoading}
                      className="px-4 py-2.5 bg-[#FF3B14] hover:bg-[#E01900] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  )}
                </div>
                {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                {appliedCoupon && <p className="text-emerald-400 text-xs mt-2">Discount applied: -₹{appliedCoupon.discountAmount.toLocaleString()}</p>}
              </div>

              <div className="border-t border-zinc-800/80 pt-6 space-y-3 text-sm text-zinc-400 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-100">₹{cartTotal.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#FF3B14]">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-medium">-₹{appliedCoupon.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-400">Free</span>
                </div>
              </div>
              
              <div className="border-t border-zinc-800/80 pt-6 flex justify-between items-center">
                <span className="text-lg font-bold text-zinc-100">Total</span>
                <div className="text-right">
                  <span className="text-xs text-zinc-500 mr-2 font-medium">INR</span>
                  <span className="text-2xl font-black text-zinc-100 tracking-tight">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    </>
  );
}
