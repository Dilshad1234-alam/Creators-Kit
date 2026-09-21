'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-green-500/20 blur-[80px] pointer-events-none rounded-b-full"></div>
          
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.3)] relative z-10 animate-bounce-slow">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {order.orderId || order._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2.5 bg-green-500/10 px-5 py-2.5 rounded-full border border-green-500/20 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-black text-green-500 tracking-wider uppercase mt-0.5">Payment Successful</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                      <p className="text-neutral-100 font-mono font-bold text-lg whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</p>
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
    </div>
  );
}

import OrderSuccessClient from './OrderSuccessClient';

export default async function OrderSuccessPage({ searchParams }) {
  // Await searchParams in Next.js 15+ or just destructure in 13/14
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.orderId || null;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <OrderSuccessClient orderId={orderId} />
    </div>
  );
}
