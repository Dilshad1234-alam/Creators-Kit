'use client';

import { useEffect, useState } from 'react';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, otp = null) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === id ? data.data : o));
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update order', err);
      alert('Failed to update order');
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === id ? data.data : o));
      }
    } catch (err) {
      console.error('Failed to update payment status', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Processing': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-background/80 border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Decorative Gradient Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF3B14] to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 relative z-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-500 tracking-tight mb-1">Orders Management</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Track and manage your storefront orders.</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{orders.length} Total Orders</span>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="text-neutral-600 dark:text-neutral-400 uppercase text-[10px] font-black tracking-widest border-b border-neutral-200 dark:border-neutral-800/80">
              <th className="pb-4 pr-4 w-[12%]">Order Info</th>
              <th className="pb-4 px-4 w-[12%]">Customer</th>
              <th className="pb-4 px-4 w-[15%]">Email</th>
              <th className="pb-4 px-4 w-[18%]">Address</th>
              <th className="pb-4 px-4 w-[18%]">Items</th>
              <th className="pb-4 px-4 w-[10%]">Amount</th>
              <th className="pb-4 px-4 w-[11%]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="py-6 pr-4 align-top">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm mb-1">{o.orderId || `ORD-${o._id.substring(o._id.length - 6).toUpperCase()}`}</div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-2 truncate max-w-[100px]">{o._id}</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mb-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {o.deliveryOtp && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                      OTP: {o.deliveryOtp}
                    </div>
                  )}
                </td>
                
                {/* Customer Name only */}
                <td className="py-6 px-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-xs font-bold text-neutral-900 dark:text-neutral-100 border border-neutral-700 shadow-inner flex-shrink-0">
                      {getInitials(o.customerName)}
                    </div>
                    <div className="font-bold text-neutral-800 dark:text-neutral-200 text-sm whitespace-nowrap">{o.customerName}</div>
                  </div>
                </td>

                {/* Email Column */}
                <td className="py-6 px-4 align-top">
                  <a href={`mailto:${o.customerEmail}`} className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary transition-colors inline-block">{o.customerEmail}</a>
                </td>

                {/* Address Column */}
                <td className="py-6 px-4 align-top">
                  {o.shippingAddress ? (
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-[200px]">
                      <span className="text-neutral-800 dark:text-neutral-200 block">{o.shippingAddress.street}</span>
                      {o.shippingAddress.city}{o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ''} {o.shippingAddress.zipCode}<br/>
                      {o.shippingAddress.country}
                    </div>
                  ) : (
                    <span className="text-neutral-600 text-xs italic">No Address Provided</span>
                  )}
                </td>

                <td className="py-6 px-4 align-top">
                  <div className="space-y-1.5">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white dark:bg-neutral-900/40 p-2 rounded-md border border-neutral-200 dark:border-neutral-800/30 group-hover:border-neutral-700/50 transition-colors">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-1 h-4 bg-neutral-700 rounded-full"></div>
                          <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate font-medium" title={item.name}>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-6 px-4 align-top">
                  <div className="font-black text-neutral-900 dark:text-neutral-100 text-lg tracking-tight mb-2">₹{o.totalAmount?.toLocaleString()}</div>
                  <div className="flex flex-col gap-1.5">
                    <button 
                      onClick={() => {
                        const newStatus = o.paymentStatus === 'Paid' ? (o.paymentMode === 'Cash on Delivery' ? 'COD' : 'Pending') : 'Paid';
                        updatePaymentStatus(o._id, newStatus);
                      }}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded w-fit text-left flex items-center gap-1 transition-colors ${
                        o.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20' : 
                        o.paymentStatus === 'COD' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500/20' :
                        'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                      }`}
                      title="Click to toggle payment status"
                    >
                      {o.paymentStatus || 'Pending'} {o.paymentMode === 'Cash on Delivery' ? '(COD)' : ''}
                      <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </button>
                  </div>
                </td>
                <td className="py-6 px-4 align-top">
                  <div className={`relative inline-block border rounded-full overflow-hidden transition-all duration-300 ${getStatusColor(o.status)}`}>
                    <select 
                      value={o.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus === 'Delivered') {
                          if (o.paymentMode === 'Cash on Delivery' && o.paymentStatus !== 'Paid') {
                            alert('Cannot mark COD order as delivered without updating payment status to Paid.');
                            e.target.value = o.status;
                            return;
                          }
                          const otp = prompt('Please enter the 6-digit Delivery OTP provided by the customer:');
                          if (otp) {
                            if (otp !== o.deliveryOtp) {
                              alert('Incorrect OTP entered.');
                              e.target.value = o.status;
                              return;
                            }
                            updateStatus(o._id, newStatus, otp);
                          } else {
                            e.target.value = o.status;
                          }
                        } else {
                          updateStatus(o._id, newStatus);
                        }
                      }}
                      className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-xs font-bold w-full outline-none cursor-pointer z-10 relative"
                    >
                      <option value="Pending" className="bg-white dark:bg-neutral-900 text-yellow-500">Pending</option>
                      <option value="Processing" className="bg-white dark:bg-neutral-900 text-purple-500">Processing</option>
                      <option value="Shipped" className="bg-white dark:bg-neutral-900 text-blue-500">Shipped</option>
                      <option value="Delivered" className="bg-white dark:bg-neutral-900 text-emerald-500">Delivered</option>
                      <option value="Cancelled" className="bg-white dark:bg-neutral-900 text-rose-500">Cancelled</option>
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-4">
                    <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <h3 className="text-neutral-700 dark:text-neutral-300 font-bold mb-1">No orders yet</h3>
                  <p className="text-sm text-neutral-500">When customers place orders, they will appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
