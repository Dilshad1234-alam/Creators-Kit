'use client';

import { useEffect, useState} from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';

export default function OrderSuccessClient({ orderId}) {
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
 setError((prev) => prev ? prev : err.message);
} finally {
 setLoading(false);
}
};

  fetchOrder();
  // Poll for tracking updates gently (every 15s when tab is active)
  const intervalId = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      fetchOrder();
    }
  }, 15000);
  return () => clearInterval(intervalId);
}, [orderId]);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh]">
 <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-green-500 animate-spin mb-4"></div>
 <p className="text-neutral-600 font-medium tracking-wide">Retrieving your order details...</p>
 </div>
 );
}

 if (error) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 max-w-xl mx-auto">
 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
 <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </div>
 <h2 className="text-2xl sm:text-3xl font-black text-[#900606] mb-3">Oops! Something went wrong.</h2>
 <p className="text-neutral-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">{error}</p>
 <button
 onClick={() => router.push('/')}
 className="bg-neutral-100 text-[#900606] px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-200 transition-all w-full sm:w-auto"
 >
 Return Home
 </button>
 </div>
 );
}

 if (!order) return null;

 // Calculate estimated delivery date (e.g., 3 days from now)
 const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
 const deliveryDate = new Date(orderDate);
 deliveryDate.setDate(deliveryDate.getDate() + 3);
 
 const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'});
 const displayOrderId = order._id;

  const timelineSteps = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const uiLabels = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
  let currentStepIndex = timelineSteps.indexOf(order.status);
  if (currentStepIndex === -1 && order.status !== 'Cancelled') currentStepIndex = 0;
  const progressPercentage = order.status === 'Cancelled' ? 0 : (currentStepIndex / (timelineSteps.length - 1)) * 100;

  return (
 <div className="max-w-[90rem] mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 py-2">
 {/* Top Banner */}
 <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-neutral-200 overflow-hidden mb-4">
 <div className="p-4 sm:p-6 text-center bg-green-50 border-b border-green-100">
 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#900606] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md shadow-[#900606]/30">
 <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h1 className="text-2xl sm:text-3xl font-black text-[#900606] mb-1 sm:mb-2">Order placed, thank you!</h1>
 <p className="text-neutral-600 text-sm">
 Confirmation will be sent to <span className="font-semibold text-[#900606] break-all">{order.customerEmail}</span>
 </p>
 </div>
 
 <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-5 gap-3 border-b border-neutral-200 bg-[#FDFBF7]">
 <div>
 <p className="text-sm text-neutral-500 mb-1">Order Number</p>
 <p className="font-mono font-bold text-base sm:text-lg text-[#900606] break-all select-all">{displayOrderId}</p>
 </div>
 <div className="sm:text-right">
 <p className="text-sm text-neutral-500 mb-1">Estimated Delivery</p>
 <p className="font-bold text-lg text-[#900606]">{formattedDeliveryDate}</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
 {/* Left Column: Tracking & Items */}
 <div className="lg:col-span-2 space-y-4">
 
 {/* Order Tracking Progress */}
 <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-neutral-200 p-4 sm:p-5">
 <div className="flex items-center justify-between mb-4">
   <h2 className="text-base sm:text-lg font-bold text-[#900606]">Track Shipment</h2>
   <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-[#900606] border border-red-100">
     {order.status || 'Confirmed'}
   </span>
 </div>
 
   {/* Stepper Container: Zero-overlap layout on all mobile viewports */}
  <div className="w-full relative py-2">
    {/* Background Progress Line connecting center of 1st to 5th node (10% to 90%) */}
    <div className="absolute left-[10%] right-[10%] top-[20px] sm:top-[22px] -translate-y-1/2 h-1 bg-neutral-200 rounded-full -z-0"></div>
    {/* Active Progress Line */}
    <div 
      className={`absolute left-[10%] top-[20px] sm:top-[22px] -translate-y-1/2 h-1 rounded-full ${order.status === 'Cancelled' ? 'bg-red-500' : 'bg-[#900606]'} transition-all duration-700 -z-0`} 
      style={{ width: `calc(${progressPercentage}% * 0.8)` }}
    ></div>
    
    <div className="relative flex justify-between z-10 w-full">
      {uiLabels.map((label, index) => {
        const isCompleted = order.status !== 'Cancelled' && index <= currentStepIndex;
        const isCurrent = order.status !== 'Cancelled' && index === currentStepIndex;
        
        return (
          <div key={label} className="flex flex-col items-center flex-1 min-w-0 px-0.5">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 sm:border-4 transition-colors duration-500 shrink-0 ${isCompleted ? 'bg-[#900606] border-white ring-2 ring-[#900606]/20' : 'bg-[#FDFBF7] border-neutral-200'}`}>
              {isCompleted ? (
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-neutral-300"></div>
              )}
            </div>
            <div className={`w-full text-center mt-2 leading-[1.15] transition-colors duration-500 ${isCurrent ? 'font-bold text-[#900606]' : isCompleted ? 'font-semibold text-[#900606]' : 'font-medium text-neutral-500'}`}>
              <span className="block text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-sm break-words">
                {label === 'Out for Delivery' ? (
                  <>
                    <span className="block min-[480px]:inline">Out for </span>
                    <span className="block min-[480px]:inline">Delivery</span>
                  </>
                ) : (
                  label
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {order.deliveryOtp && (
 <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
 <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 </div>
 <div>
 <p className="text-sm font-semibold text-blue-900">Delivery PIN: <span className="text-base tracking-wider ml-1">{order.deliveryOtp}</span></p>
 <p className="text-[10px] sm:text-xs text-blue-700 mt-0.5">Share this PIN with the delivery executive.</p>
 </div>
 </div>
 )}
 </div>

 {/* Purchased Items */}
 <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-neutral-200 p-4 sm:p-5">
 <h2 className="text-lg font-bold text-[#900606] mb-4">Items in this Order</h2>
 <div className="space-y-4">
 {order.items?.map((item, idx) => (
 <div key={idx} className="flex gap-3 sm:gap-4 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-xl border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden relative">
 {(item.image || item.img || (item.images && item.images.length > 0)) ? (
 <Image src={getImageUrl(item.image || item.img || item.images[0].src)} alt={item.name} fill className="object-contain p-2 mix-blend-multiply" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
 ) : (
 <span className="text-3xl">📦</span>
 )}
 </div>
 <div className="flex-1 min-w-0 flex flex-col justify-center">
 <div>
 <h4 className="font-bold text-[#900606] text-sm sm:text-base truncate mb-0.5">{item.name}</h4>
 <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
 </div>
 <div className="font-bold text-sm sm:text-base text-[#900606] mt-1">
 ₹{item.price?.toLocaleString('en-IN')}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 {/* Right Column: Address, Payment & Actions */}
 <div className="space-y-4">
 
 {/* Order Details Panel */}
 <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-neutral-200 p-4 sm:p-5">
 <h3 className="font-bold text-[#900606] mb-3 pb-3 border-b border-neutral-100">Order Summary</h3>
 
 <div className="space-y-2 text-xs sm:text-sm mb-4 pb-4 border-b border-neutral-100">
 <div className="flex justify-between">
 <span className="text-neutral-500">Subtotal</span>
 <span className="font-medium text-[#900606]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-neutral-500">Shipping</span>
 <span className="font-medium text-[#900606]">Free</span>
 </div>
 <div className="flex justify-between items-center pt-3 mt-3 border-t border-neutral-100">
 <span className="font-bold text-base text-[#900606]">Total Paid</span>
 <span className="font-black text-xl text-[#900606]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
 </div>
 </div>

 <div className="space-y-4 text-xs sm:text-sm">
 <div>
 <h4 className="font-semibold text-[#900606] mb-1">Shipping Address</h4>
 <p className="text-neutral-600 font-medium">
 {order.customerName}
 </p>
 {order.shippingAddress && (
 <p className="text-neutral-600 leading-snug mt-0.5">
 {order.shippingAddress.street}<br/>
 {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
 </p>
 )}
 </div>
 
 <div>
 <h4 className="font-semibold text-[#900606] mb-1">Payment Status</h4>
 <div className="flex items-center gap-1.5">
 <div className="w-1.5 h-1.5 rounded-full bg-[#900606]"></div>
 <span className="font-medium text-neutral-700">Paid via {order.paymentMode || 'Online'}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col gap-2.5">
 <Link
  href="/account?tab=orders"
  className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center"
  >
  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
    View All Orders
  </span>
  </Link>
  <Link
  href="/product"
  className="relative w-full py-3 bg-white text-[#111827] border-2 border-neutral-200 rounded-xl font-bold text-sm overflow-hidden group/btn transition-all duration-300 shadow-sm flex items-center justify-center"
  >
  <span className="absolute inset-0 bg-[#900606] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
  <span className="relative z-10 text-[#111827] group-hover/btn:text-white transition-colors duration-300 flex items-center justify-center gap-2">
    Continue Shopping
  </span>
  </Link>
 </div>

 </div>
 </div>
 </div>
 );
}




