'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user info from localStorage (as used in /account page)
    const savedData = localStorage.getItem('creatorsKitUserInfo');
    if (savedData) {
      try {
        const userInfo = JSON.parse(savedData);
        if (userInfo.email) {
          setUserEmail(userInfo.email);
        } else {
          // No email found
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/user/orders?email=${encodeURIComponent(userEmail)}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.error || 'Failed to load orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full border-4 border-neutral-200 border-t-[#900606] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden text-[#900606] py-12 md:py-24 animate-page-enter">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 md:pt-12">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#900606]">My Orders</h1>
            <p className="text-neutral-600 font-medium mt-2">Track and manage your past purchases.</p>
          </div>
          <Link href="/product" className="px-6 py-2.5 bg-[#900606] text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors">
            Continue Shopping
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        {!userEmail ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Please sign in to view your orders.</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">You need to be logged in and have an email associated with your account to see your order history.</p>
            <Link href="/login" className="px-8 py-3 bg-[#900606] text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-lg">
              Sign In
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-neutral-200 p-16 text-center shadow-sm flex flex-col items-center">
            <span className="text-6xl mb-6">🛍️</span>
            <h2 className="text-2xl font-bold mb-3 text-[#900606]">No orders placed yet</h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto">Looks like you haven't bought anything from us yet. Explore our gear and build your ultimate setup!</p>
            <Link href="/product" className="px-8 py-3 bg-[#900606] text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const displayOrderId = order._id;
              
              const statusStyles = {
                Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                Processing: 'bg-blue-50 text-blue-700 border-blue-200',
                Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                Delivered: 'bg-green-50 text-green-700 border-green-200',
                Cancelled: 'bg-red-50 text-red-700 border-red-200',
              };

              const statusClass = statusStyles[order.status] || 'bg-neutral-50 text-neutral-600 border-neutral-200';

              return (
                <div key={order._id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <div>
                        <p className="text-neutral-500 mb-0.5">Order Placed</p>
                        <p className="font-semibold text-neutral-800">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-0.5">Total</p>
                        <p className="font-semibold text-neutral-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-neutral-500 mb-0.5">Order #</p>
                        <p className="font-mono font-bold text-[#900606]">{displayOrderId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusClass} flex-1 sm:flex-none text-center`}>
                        {order.status}
                      </span>
                      <Link 
                        href={`/order-success?orderId=${displayOrderId}`}
                        className="px-4 py-1.5 border border-neutral-300 rounded-full text-sm font-bold text-neutral-700 hover:bg-neutral-100 transition-colors flex-1 sm:flex-none text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-20 h-20 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <span className="text-3xl">📦</span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#900606] line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                            <p className="font-bold text-[#900606] mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
