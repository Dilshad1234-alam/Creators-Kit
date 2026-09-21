'use client';

import { useEffect, useState } from 'react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [resProducts, resOrders] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        const dataProducts = await resProducts.json();
        const dataOrders = await resOrders.json();

        const ordersList = dataOrders.data || [];
        // Only count 'Delivered' and 'Shipped' for revenue
        const totalRevenue = ordersList.reduce((acc, order) => {
          if (order.status === 'Delivered' || order.status === 'Shipped') {
            return acc + (order.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate unique customers based on email or name
        const uniqueCustomers = new Set(ordersList.map(o => o.customerEmail || o.customerName || 'Guest').filter(name => name !== 'Guest'));

        setStats({
          products: (dataProducts.data || []).length,
          orders: ordersList.length,
          revenue: totalRevenue,
          customers: uniqueCustomers.size || 0,
        });
        
        // Save the 5 most recent orders (assuming they are sorted by date descending)
        setRecentOrders(ordersList.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Skeleton Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-neutral-900/40 border border-neutral-800/40 rounded-3xl p-8 h-40">
              <div className="h-4 bg-neutral-800/60 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-neutral-800/60 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        {/* Skeleton Table */}
        <div className="bg-neutral-900/40 border border-neutral-800/40 rounded-3xl p-8 h-96">
          <div className="h-6 bg-neutral-800/60 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-neutral-800/40 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative group bg-neutral-900/80 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-neutral-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
              Total Products
            </h3>
            <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20">Active</span>
          </div>
          <p className="text-5xl font-black text-neutral-100 mt-2">{stats.products}</p>
        </div>

        <div className="relative group bg-neutral-900/80 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-neutral-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse"></span>
              Total Orders
            </h3>
            <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded-full border border-yellow-500/20">+12% this week</span>
          </div>
          <p className="text-5xl font-black text-neutral-100 mt-2">{stats.orders}</p>
        </div>

        <div className="relative group bg-neutral-900/80 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-neutral-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></span>
              Total Revenue
            </h3>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full border border-primary/20">Verified</span>
          </div>
          <p className="text-5xl font-black text-primary mt-2">₹{stats.revenue.toLocaleString()}</p>
        </div>

        <div className="relative group bg-neutral-900/80 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-primary/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-start">
            <h3 className="text-neutral-400 font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></span>
              Total Customers
            </h3>
            <span className="bg-purple-500/10 text-purple-500 text-xs font-bold px-2 py-1 rounded-full border border-purple-500/20">Unique</span>
          </div>
          <p className="text-5xl font-black text-neutral-100 mt-2">{stats.customers}</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-neutral-900/80 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl">
        <h2 className="text-2xl font-bold text-neutral-100 mb-8 flex items-center gap-3">
          Recent Orders & Store Activity
          <span className="bg-neutral-800 text-neutral-400 text-xs font-bold px-3 py-1 rounded-full">Last 5 Orders</span>
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-800/50">
                <th className="pb-4 pr-4">Order Details</th>
                <th className="pb-4 px-4 w-[35%]">Items Bought</th>
                <th className="pb-4 px-4">Amount</th>
                <th className="pb-4 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {recentOrders.map((o) => (
                <tr key={o._id} className="hover:bg-neutral-800/20 transition-colors group">
                  <td className="py-6 pr-4 align-top">
                    <div className="font-bold text-neutral-200">{o.customerName}</div>
                    <div className="text-xs text-neutral-500 mt-1 font-mono">ID: {o._id}</div>
                  </td>
                  <td className="py-6 px-4 align-top">
                    <div className="space-y-2">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-neutral-950/40 p-2 rounded-lg border border-neutral-800/30">
                          <span className="text-sm text-neutral-300 truncate max-w-[150px]">{item.name}</span>
                          <span className="text-xs font-bold text-neutral-500 bg-neutral-900 px-2 py-1 rounded">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-4 align-top">
                    <div className="font-bold text-primary text-lg">₹{o.totalAmount?.toLocaleString()}</div>
                  </td>
                  <td className="py-6 pl-4 align-top text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      o.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                      o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      o.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {o.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>}
                      {o.status === 'Shipped' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>}
                      {o.status === 'Delivered' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>}
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-neutral-500">No recent activity.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
