'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessClient({ orderId }) {
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided. We could not find your order.');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-800 border-t-green-500 animate-spin mb-4"></div>
        <p className="text-neutral-400 font-medium tracking-wide">Retrieving your order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-neutral-100 mb-3">Oops! Something went wrong.</h2>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto text-lg leading-relaxed">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-neutral-100 text-neutral-900 px-8 py-3.5 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="premium-glow-card rounded-[2rem]">
        
        {/* Header Section */}
        <div className="px-8 pt-12 pb-10 text-center border-b border-neutral-800/80 bg-neutral-900/50 relative overflow-hidden">
          {/* Confetti / Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-secondary/20 blur-[80px] pointer-events-none rounded-b-full"></div>
          
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/20 shadow-[0_0_40px_rgba(56,189,248,0.3)] relative z-10 animate-bounce-slow">
            <svg className="w-12 h-12 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-neutral-100 tracking-tight mb-3 relative z-10">Order Confirmed!</h1>
          <p className="text-neutral-400 text-lg relative z-10 max-w-lg mx-auto">Thank you for your purchase. Your creator journey has officially begun.</p>
        </div>

        {/* Order Details Body */}
        <div className="p-8 sm:p-10 space-y-10">
          
          {/* Order ID & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-background rounded-2xl border border-neutral-800">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1.5">Order Number</p>
              <p className="text-neutral-100 font-mono font-medium text-xl">
                {order.orderId || order._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-secondary/10 px-5 py-2.5 rounded-full border border-secondary/20 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-sm font-black text-secondary tracking-wider uppercase mt-0.5">Payment Successful</span>
            </div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Customer & Delivery */}
              <div className="space-y-6">
                
                {/* Delivery OTP Box */}
                {order.deliveryOtp && (
                  <div className="bg-primary/10 p-6 rounded-2xl border border-primary/30 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px] pointer-events-none"></div>
                    <h3 className="text-sm text-primary uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Secure Delivery PIN
                    </h3>
                    <p className="text-neutral-300 text-sm mb-4">Please provide this 6-digit PIN to the delivery executive to receive your package securely.</p>
                    <div className="flex items-center justify-center gap-3 bg-background border border-primary/20 py-4 rounded-xl shadow-inner">
                      {order.deliveryOtp.split('').map((digit, i) => (
                        <div key={i} className="w-10 h-12 flex items-center justify-center bg-neutral-900 border border-neutral-700 rounded-lg text-2xl font-black text-primary tracking-widest shadow-md">
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Details */}
                <div className="bg-neutral-800/20 p-6 rounded-2xl border border-neutral-800/50">
                  <h3 className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-5 border-b border-neutral-800 pb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Customer Details
                  </h3>
                  <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-neutral-100 font-semibold text-lg">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-neutral-100 font-medium break-all">{order.customerEmail}</p>
                </div>
                {order.shippingAddress && (
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1 mt-2">Shipping Address</p>
                    <p className="text-neutral-300 font-medium leading-relaxed">
                      {order.shippingAddress.street}<br/>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                )}
              </div>
              </div>
            </div>
            </div>

            {/* Order Summary */}
            <div className="bg-neutral-800/20 p-6 rounded-2xl border border-neutral-800/50 flex flex-col justify-between">
              <div>
                <h3 className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-5 border-b border-neutral-800 pb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Order Summary
                </h3>
                <div className="space-y-5">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <p className="text-neutral-100 font-semibold text-lg leading-tight mb-1">{item.name}</p>
                        <p className="text-sm text-neutral-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-neutral-100 font-mono font-bold text-lg whitespace-nowrap">₹{item.price?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-neutral-800">
                <div className="flex justify-between items-end">
                  <p className="text-neutral-400 font-bold uppercase tracking-wider text-sm mb-1">Total Paid</p>
                  <p className="text-3xl font-black text-neutral-100 tracking-tight">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 sm:px-10 pb-10 pt-2">
          <Link
            href="/dashboard"
            className="block w-full text-center bg-primary text-neutral-950 px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] transform duration-300"
          >
            Access Your Products
          </Link>
          <div className="mt-8 flex justify-center gap-6">
            <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-100 transition-colors">
              Return Home
            </Link>
            <span className="text-neutral-700">•</span>
            <Link href="/contact" className="text-sm font-medium text-neutral-500 hover:text-neutral-100 transition-colors">
              Need Help? Support
            </Link>
          </div>
      </div>
    </div>
  );
}
