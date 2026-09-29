'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    
    setIsSearching(true);
    setTrackingResult(null);
    
    // Simulate API call processing
    setTimeout(() => {
      setIsSearching(false);
      setTrackingResult({
        orderId: trackingInput.startsWith('#') ? trackingInput.toUpperCase() : `#CK-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'shipped',
        estimatedDelivery: 'Oct 03, 2026',
        courier: 'Blue Dart / FedEx Express',
        trackingNumber: 'TRK' + Math.floor(100000000 + Math.random() * 900000000),
        items: [
          { name: 'The Complete Creator Bundle', qty: 1, price: '₹3,999' }
        ],
        timeline: [
          { id: 1, status: 'Order Placed', date: 'Sep 27, 2026', time: '10:30 AM', completed: true },
          { id: 2, status: 'Packed & Processed', date: 'Sep 28, 2026', time: '02:15 PM', completed: true },
          { id: 3, status: 'Shipped', date: 'Sep 29, 2026', time: '09:00 AM', completed: true, current: true },
          { id: 4, status: 'Out for Delivery', date: 'Pending', time: '', completed: false },
          { id: 5, status: 'Delivered', date: 'Pending', time: '', completed: false }
        ]
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0B0F19] text-[#900606] dark:text-neutral-100 font-sans transition-colors duration-300 w-full overflow-hidden pb-16 md:pb-24 pt-32 md:pt-40">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-[#900606] tracking-tighter uppercase mb-4 leading-none">
            Track Order.
          </h1>
          <p className="text-lg md:text-xl font-bold text-neutral-600 dark:text-neutral-400">
            Enter your Order ID or Email address to see real-time shipping updates.
          </p>
        </div>
        
        {/* Search Box */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#131C2E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 mb-12 transition-colors duration-300 relative z-10">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                required
                type="text" 
                placeholder="Order ID (e.g., #CK-12345) or Email"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-[#0f172a] border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#900606] transition-shadow text-lg"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-[#900606] text-white font-bold text-lg rounded-2xl px-8 py-4 hover:bg-[#700505] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Tracking...
                </>
              ) : (
                'Track Package'
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="bg-white dark:bg-[#131C2E] rounded-3xl p-6 sm:p-10 shadow-xl border border-neutral-200 dark:border-neutral-800 transition-colors duration-300 animate-page-enter">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-8">
              <div>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-1">Order Details</p>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white mb-2">{trackingResult.orderId}</h2>
                <div className="flex items-center gap-3 text-sm font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-400">Courier: <span className="text-[#900606]">{trackingResult.courier}</span></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600"></span>
                  <span className="text-neutral-600 dark:text-neutral-400">Tracking: <span className="text-[#900606]">{trackingResult.trackingNumber}</span></span>
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl p-4 text-center md:text-right min-w-[200px]">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Estimated Delivery</p>
                <p className="text-2xl font-black text-orange-700 dark:text-orange-300">{trackingResult.estimatedDelivery}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Timeline */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Tracking History</h3>
                <div className="relative pl-4 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-8">
                  {trackingResult.timeline.map((item, index) => (
                    <div key={item.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-[#131C2E] ${item.completed ? 'bg-[#900606]' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                        {item.current && (
                          <div className="absolute inset-0 bg-[#900606] rounded-full animate-ping opacity-75"></div>
                        )}
                      </div>
                      
                      <div className={`pl-4 ${item.completed ? 'text-neutral-900 dark:text-white' : 'text-neutral-400 dark:text-neutral-600'}`}>
                        <h4 className="text-lg font-bold">{item.status}</h4>
                        <div className="flex items-center gap-2 text-sm mt-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span>{item.date}</span>
                          {item.time && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                              <span>{item.time}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-neutral-50 dark:bg-[#0f172a] rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Item Summary</h3>
                <div className="space-y-4">
                  {trackingResult.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white dark:bg-[#131C2E] p-4 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {/* Placeholder Image */}
                          <img src="/kit logo 2.png - Edited.png" alt="Item" className="w-8 h-8 object-contain opacity-50" />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">{item.name}</p>
                          <p className="text-sm font-semibold text-neutral-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-black text-[#900606]">{item.price}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-neutral-600 dark:text-neutral-400">Total Paid</span>
                    <span className="font-black text-2xl text-neutral-900 dark:text-white">₹3,999</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/contact" className="text-sm font-bold text-[#900606] hover:underline flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Need help with your delivery? Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
