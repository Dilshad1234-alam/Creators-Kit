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

  if (loading) return <div className="text-zinc-400">Loading orders...</div>;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white mb-8">Orders Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-zinc-500 uppercase text-xs font-black tracking-wider border-b border-zinc-800">
              <th className="pb-4 pr-4">Order ID</th>
              <th className="pb-4 px-4 w-[25%]">Customer Details</th>
              <th className="pb-4 px-4 w-[30%]">Items</th>
              <th className="pb-4 px-4">Total</th>
              <th className="pb-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-zinc-800/30 transition-colors">
                <td className="py-5 pr-4 font-mono text-xs text-zinc-500 align-top">{o._id}</td>
                <td className="py-5 px-4 align-top">
                  <div className="font-bold text-zinc-200 mb-1">{o.customerName}</div>
                  <div className="text-xs text-zinc-400">
                    <a href={`mailto:${o.customerEmail}`} className="hover:text-[#FF3B14]">{o.customerEmail}</a>
                  </div>
                  {o.shippingAddress && (
                    <div className="mt-2 text-xs text-zinc-500 leading-tight">
                      <p>{o.shippingAddress.street}</p>
                      <p>{o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}</p>
                      <p>{o.shippingAddress.country}</p>
                    </div>
                  )}
                </td>
                <td className="py-5 px-4 align-top">
                  <div className="space-y-2">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50">
                        <span className="text-sm text-zinc-300 truncate max-w-[150px]" title={item.name}>{item.name}</span>
                        <span className="text-xs font-bold text-zinc-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-5 px-4 align-top font-bold text-[#FF3B14]">₹{o.totalAmount?.toLocaleString()}</td>
                <td className="py-5 px-4 align-top">
                  <select 
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none font-bold focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 transition-all cursor-pointer ${
                      o.status === 'Pending' ? 'text-yellow-500' :
                      o.status === 'Shipped' ? 'text-blue-500' :
                      o.status === 'Delivered' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    <option value="Pending" className="text-yellow-500">Pending</option>
                    <option value="Shipped" className="text-blue-500">Shipped</option>
                    <option value="Delivered" className="text-green-500">Delivered</option>
                    <option value="Cancelled" className="text-red-500">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-zinc-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
