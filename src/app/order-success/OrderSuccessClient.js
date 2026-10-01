'use client';

import { useEffect, useState} from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

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
 const intervalId = setInterval(fetchOrder, 3000);
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
 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
 <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </div>
 <h2 className="text-3xl font-extrabold text-[#900606] mb-3">Oops! Something went wrong.</h2>
 <p className="text-neutral-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">{error}</p>
 <button
 onClick={() => router.push('/')}
 className="bg-neutral-100 text-[#900606] px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-200 transition-all"
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
 <div className="w-16 h-16 bg-[#900606] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#900606]/30">
 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <h1 className="text-2xl font-bold text-[#900606] mb-1">Order placed, thank you!</h1>
 <p className="text-neutral-600 text-sm">
 Confirmation will be sent to <span className="font-semibold text-[#900606]">{order.customerEmail}</span>
 </p>
 </div>
 
 <div className="flex flex-col sm:flex-row justify-between p-4 sm:p-5 gap-3 border-b border-neutral-200 bg-[#FDFBF7]">
 <div>
 <p className="text-sm text-neutral-500 mb-1">Order Number</p>
 <p className="font-mono font-bold text-lg text-[#900606]">{displayOrderId}</p>
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
 <h2 className="text-lg font-bold text-[#900606] mb-5">Track Shipment</h2>
 
 <div className="relative">
 {/* Progress Line */}
 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full"></div>
  {/* Active Progress Line */}
  <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full ${order.status === 'Cancelled' ? 'bg-red-500' : 'bg-[#900606]'} transition-all duration-700`} style={{ width: `${progressPercentage}%` }}></div>
  
  <div className="relative flex justify-between">
  {uiLabels.map((label, index) => {
    const isCompleted = order.status !== 'Cancelled' && index <= currentStepIndex;
    const isCurrent = order.status !== 'Cancelled' && index === currentStepIndex;
    
    return (
      <div key={label} className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 z-10 transition-colors duration-500 ${isCompleted ? 'bg-[#900606] border-white' : 'bg-[#FDFBF7] border-neutral-200'}`}>
          {isCompleted ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
          )}
        </div>
        <p className={`text-xs sm:text-sm mt-3 text-center transition-colors duration-500 ${isCurrent ? 'font-bold text-[#900606]' : isCompleted ? 'font-semibold text-[#900606]' : 'font-medium text-neutral-500'}`}>
          {label}
        </p>
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
 <Image src={item.image || item.img || item.images[0].src} alt={item.name} fill className="object-contain p-2 mix-blend-multiply" />
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
 href="/dashboard/orders"
 className="w-full py-2.5 sm:py-3 bg-[#900606] text-white rounded-xl font-bold text-sm sm:text-base text-center hover:bg-neutral-800 transition-colors shadow-md"
 >
 View All Orders
 </Link>
 <Link
 href="/product"
 className="w-full py-2.5 sm:py-3 bg-[#FDFBF7] border border-neutral-200 text-[#900606] rounded-xl font-bold text-sm sm:text-base text-center hover:bg-[#F9F6EE] transition-colors"
 >
 Continue Shopping
 </Link>
 </div>

 </div>
 </div>
 </div>
 );
}




