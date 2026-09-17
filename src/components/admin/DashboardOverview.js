'use client';

import { useEffect, useState } from 'react';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch these from an aggregate API.
    // For now, we'll fetch products and orders to calculate basic stats.
    async function fetchStats() {
      try {
        const [resProducts, resOrders] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);
        const dataProducts = await resProducts.json();
        const dataOrders = await resOrders.json();

        const ordersList = dataOrders.data || [];
        const totalRevenue = ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        setStats({
          products: (dataProducts.data || []).length,
          orders: ordersList.length,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-zinc-400">Loading dashboard data...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="relative group bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-[#FF3B14]/50 transition-colors overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-[#FF3B14] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
        <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Total Products
        </h3>
        <p className="text-5xl font-black text-white">{stats.products}</p>
      </div>

      <div className="relative group bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-[#FF3B14]/50 transition-colors overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-[#FF3B14] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
        <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Total Orders
        </h3>
        <p className="text-5xl font-black text-white">{stats.orders}</p>
      </div>

      <div className="relative group bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl hover:border-[#FF3B14]/50 transition-colors overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-[#FF3B14] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
        <h3 className="text-zinc-400 font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Total Revenue
        </h3>
        <p className="text-5xl font-black text-[#FF3B14]">₹{stats.revenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
