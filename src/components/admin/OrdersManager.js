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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === id ? data.data : o));
      }
    } catch (err) {
      console.error('Failed to update order', err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Processing': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Delivered': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF3B14]"></div>
    </div>
  );

  return (
    <div className="bg-[#0B0D0E]/80 border border-zinc-800/80 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Decorative Gradient Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF3B14] to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF3B14] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8 relative z-12">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tight mb-1">Orders Management</h2>
          <p className="text-sm text-zinc-400">Track and manage your storefront orders.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-zinc-300">{orders.length} Total Orders</span>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="text-zinc-400 uppercase text-[10px] font-black tracking-widest border-b border-zinc-800/80">
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
                  <div className="font-bold text-zinc-100 text-sm mb-1">{o.orderId || `ORD-${o._id.substring(o._id.length - 6).toUpperCase()}`}</div>
                  <div className="text-[10px] font-mono text-zinc-500 mb-2 truncate max-w-[100px]">{o._id}</div>
                  <div className="text-xs text-zinc-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                
                {/* Customer Name only */}
                <td className="py-6 px-4 align-top">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-xs font-bold text-white border border-zinc-700 shadow-inner flex-shrink-0">
                      {getInitials(o.customerName)}
                    </div>
                    <div className="font-bold text-zinc-200 text-sm whitespace-nowrap">{o.customerName}</div>
                  </div>
                </td>

                {/* Email Column */}
                <td className="py-6 px-4 align-top">
                  <a href={`mailto:${o.customerEmail}`} className="text-sm text-zinc-300 hover:text-[#FF3B14] transition-colors inline-block">{o.customerEmail}</a>
                </td>

                {/* Address Column */}
                <td className="py-6 px-4 align-top">
                  {o.shippingAddress ? (
                    <div className="text-sm text-zinc-400 leading-relaxed max-w-[200px]">
                      <span className="text-zinc-200 block">{o.shippingAddress.street}</span>
                      {o.shippingAddress.city}{o.shippingAddress.state ? `, ${o.shippingAddress.state}` : ''} {o.shippingAddress.zipCode}<br/>
                      {o.shippingAddress.country}
                    </div>
                  ) : (
                    <span className="text-zinc-600 text-xs italic">No Address Provided</span>
                  )}
                </td>

                <td className="py-6 px-4 align-top">
                  <div className="space-y-1.5">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-900/40 p-2 rounded-md border border-zinc-800/30 group-hover:border-zinc-700/50 transition-colors">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-1 h-4 bg-zinc-700 rounded-full"></div>
                          <span className="text-xs text-zinc-300 truncate font-medium" title={item.name}>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                          <span className="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-6 px-4 align-top">
                  <div className="font-black text-white text-lg tracking-tight">₹{o.totalAmount?.toLocaleString()}</div>
                </td>
                <td className="py-6 px-4 align-top">
                  <div className={`relative inline-block border rounded-full overflow-hidden transition-all duration-300 ${getStatusColor(o.status)}`}>
                    <select 
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-xs font-bold w-full outline-none cursor-pointer z-10 relative"
                    >
                      <option value="Pending" className="bg-zinc-900 text-yellow-500">Pending</option>
                      <option value="Processing" className="bg-zinc-900 text-purple-500">Processing</option>
                      <option value="Shipped" className="bg-zinc-900 text-blue-500">Shipped</option>
                      <option value="Delivered" className="bg-zinc-900 text-emerald-500">Delivered</option>
                      <option value="Cancelled" className="bg-zinc-900 text-rose-500">Cancelled</option>
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                  </div>
                  <h3 className="text-zinc-300 font-bold mb-1">No orders yet</h3>
                  <p className="text-sm text-zinc-500">When customers place orders, they will appear here.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
