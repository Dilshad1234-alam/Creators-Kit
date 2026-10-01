'use client';

import { useEffect, useState} from 'react';

export default function DashboardOverview() {
 const [stats, setStats] = useState({
 products: 0,
 orders: 0,
 revenue: 0,
 customers: 0,
});
 const [recentOrders, setRecentOrders] = useState([]);
 const [chartData, setChartData] = useState([]);
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

 const currentYear = new Date().getFullYear();
 const monthlyStats = Array(12).fill(null).map(() => ({ revenue: 0, orders: 0 }));
 
 ordersList.forEach(order => {
   if (order.createdAt) {
     const date = new Date(order.createdAt);
     if (date.getFullYear() === currentYear) {
       const monthIndex = date.getMonth();
       const rev = (order.status === 'Delivered' || order.status === 'Shipped') ? (order.totalAmount || 0) : 0;
       monthlyStats[monthIndex].revenue += rev;
       monthlyStats[monthIndex].orders += 1;
     }
   }
 });
 
 const maxRevenue = Math.max(...monthlyStats.map(m => m.revenue), 1);
 const maxOrders = Math.max(...monthlyStats.map(m => m.orders), 1);
 
 const chart = monthlyStats.map((stat, i) => ({
   month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
   heightPrimary: (stat.revenue / maxRevenue) * 95 || 5,
   heightSecondary: (stat.orders / maxOrders) * 95 || 5
 }));
 setChartData(chart);
 
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
 <div key={i} className="bg-[#FDFBF7] border border-neutral-200 rounded-3xl p-8 h-40">
 <div className="h-4 bg-neutral-100 rounded w-1/3 mb-4"></div>
 <div className="h-10 bg-neutral-100 rounded w-1/2"></div>
 </div>
 ))}
 </div>
 {/* Skeleton Table */}
 <div className="bg-[#FDFBF7] border border-neutral-200 rounded-3xl p-8 h-96">
 <div className="h-6 bg-neutral-100 rounded w-1/4 mb-8"></div>
 <div className="space-y-4">
 {[...Array(5)].map((_, i) => (
 <div key={i} className="h-12 bg-neutral-100 rounded w-full"></div>
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
 <div className="relative group bg-[#FDFBF7] border border-neutral-200 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-[#900606]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
 <div className="flex justify-between items-start">
 <h3 className="text-neutral-600 font-bold mb-2 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
 Total Products
 </h3>
 <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20">Active</span>
 </div>
 <p className="text-5xl font-black text-[#900606] mt-2">{stats.products}</p>
 </div>

 <div className="relative group bg-[#FDFBF7] border border-neutral-200 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-[#900606]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
 <div className="flex justify-between items-start">
 <h3 className="text-neutral-600 font-bold mb-2 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)] animate-pulse"></span>
 Total Orders
 </h3>
 <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded-full border border-yellow-500/20">+12% this week</span>
 </div>
 <p className="text-5xl font-black text-[#900606] mt-2">{stats.orders}</p>
 </div>

 <div className="relative group bg-[#FDFBF7] border border-neutral-200 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-[#900606]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#900606] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
 <div className="flex justify-between items-start">
 <h3 className="text-neutral-600 font-bold mb-2 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-[#900606] shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></span>
 Total Revenue
 </h3>
 <span className="bg-[#900606]/10 text-[#900606] text-xs font-bold px-2 py-1 rounded-full border border-[#900606]/20">Verified</span>
 </div>
 <p className="text-5xl font-black text-[#900606] mt-2">₹{stats.revenue.toLocaleString()}</p>
 </div>

 <div className="relative group bg-[#FDFBF7] border border-neutral-200 shadow-2xl rounded-3xl p-8 backdrop-blur-xl hover:border-[#900606]/50 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-purple-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
 <div className="flex justify-between items-start">
 <h3 className="text-neutral-600 font-bold mb-2 flex items-center gap-2">
 <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></span>
 Total Customers
 </h3>
 <span className="bg-purple-500/10 text-purple-500 text-xs font-bold px-2 py-1 rounded-full border border-purple-500/20">Unique</span>
 </div>
 <p className="text-5xl font-black text-[#900606] mt-2">{stats.customers}</p>
 </div>
  </div>

  {/* Sales Report / Analytics Section */}
  <div className="bg-[#FDFBF7] dark:bg-[#131C2E] border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl p-4 md:p-8 backdrop-blur-xl w-full max-w-full overflow-hidden">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
          Sales Analytics
          <span className="bg-[#900606]/10 text-[#900606] text-xs font-bold px-3 py-1 rounded-full">This Year</span>
        </h2>
        <p className="text-neutral-500 text-sm mt-1">Monthly revenue and order volume comparison.</p>
      </div>
      <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
        <button className="px-4 py-1.5 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold rounded-md shadow-sm">Revenue</button>
        <button className="px-4 py-1.5 text-neutral-500 dark:text-neutral-400 text-sm font-semibold hover:text-neutral-900 rounded-md">Orders</button>
      </div>
    </div>
    
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[600px] h-72 flex items-end justify-between gap-2 px-2 pb-6 border-b border-neutral-200 dark:border-neutral-800 relative">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full border-b border-neutral-100 dark:border-neutral-800/50"></div>
        ))}
      </div>

      {/* Bar Chart Real Data */}
      {chartData.map((data, i) => (
        <div key={data.month} className="flex flex-col items-center gap-2 group relative z-10 w-full">
          <div className="flex items-end justify-center w-full gap-1 h-56">
            <div className="w-1/3 md:w-4 bg-[#900606] rounded-t-sm shadow-sm group-hover:bg-[#b00808] transition-colors" style={{ height: `${data.heightPrimary}%` }}></div>
            <div className="w-1/3 md:w-4 bg-[#F87171] rounded-t-sm shadow-sm group-hover:bg-[#FCA5A5] transition-colors" style={{ height: `${data.heightSecondary}%` }}></div>
          </div>
          <span className="text-xs font-semibold text-neutral-400 mt-2">{data.month}</span>
        </div>
      ))}
      </div>
    </div>
    
    <div className="flex gap-6 mt-6 justify-center">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#900606]"></span>
        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Direct Sales</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#F87171]"></span>
        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Affiliate Sales</span>
      </div>
    </div>
  </div>

  {/* Recent Activity Table */}
  <div className="bg-[#FDFBF7] border border-neutral-200 shadow-2xl rounded-3xl p-4 md:p-8 backdrop-blur-xl w-full max-w-full overflow-hidden">
 <h2 className="text-xl md:text-2xl font-bold text-[#900606] mb-6 md:mb-8 flex flex-wrap items-center gap-3">
 Recent Orders & Store Activity
 <span className="bg-neutral-100 text-neutral-600 text-xs font-bold px-3 py-1 rounded-full">Last 5 Orders</span>
 </h2>
 
 <div className="overflow-x-auto w-full">
 <table className="w-full text-left min-w-[600px]">
 <thead>
 <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-200">
 <th className="pb-4 pr-4">Order Details</th>
 <th className="pb-4 px-4 w-[35%]">Items Bought</th>
 <th className="pb-4 px-4">Amount</th>
 <th className="pb-4 pl-4 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-800/30">
 {recentOrders.map((o) => (
 <tr key={o._id} className="hover:bg-neutral-100 transition-colors group">
 <td className="py-6 pr-4 align-top">
 <div className="font-bold text-neutral-800">{o.customerName}</div>
 <div className="text-xs text-neutral-500 mt-1 font-mono">ID: {o._id}</div>
 </td>
 <td className="py-6 px-4 align-top">
 <div className="space-y-2">
 {o.items?.map((item, idx) => (
 <div key={idx} className="flex justify-between items-center bg-[#FDFBF7] p-2 rounded-lg border border-neutral-200">
 <span className="text-sm text-neutral-700 truncate max-w-[150px]">{item.name}</span>
 <span className="text-xs font-bold text-neutral-500 bg-[#FDFBF7] px-2 py-1 rounded">x{item.quantity}</span>
 </div>
 ))}
 </div>
 </td>
 <td className="py-6 px-4 align-top">
 <div className="font-bold text-[#900606] text-lg">₹{o.totalAmount?.toLocaleString()}</div>
 </td>
 <td className="py-6 pl-4 align-top text-right">
 <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
 o.status === 'Confirmed' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
 o.status === 'Packed' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
 o.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
 o.status === 'Out for Delivery' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
 o.status === 'Delivered' ? 'bg-[#900606]/10 text-[#900606] border border-[#900606]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
}`}>
 {o.status === 'Confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>}
 {o.status === 'Packed' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></span>}
 {o.status === 'Shipped' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>}
 {o.status === 'Out for Delivery' && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2"></span>}
 {o.status === 'Delivered' && <span className="w-1.5 h-1.5 rounded-full bg-[#900606] mr-2"></span>}
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
