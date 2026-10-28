'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardOverview() {
  const router = useRouter();

  // Metrics State dynamically calculated from MongoDB
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    aov: 0,
  });

  const [dateRange, setDateRange] = useState('All-Time');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [revenuePeriod, setRevenuePeriod] = useState('All time');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState(null);

  // Dynamic Recent Orders & Top Products from MongoDB
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch('/api/orders').catch(() => null),
          fetch('/api/products').catch(() => null),
          fetch('/api/users').catch(() => null),
        ]);

        let ordersList = [];
        if (ordersRes && ordersRes.ok) {
          const data = await ordersRes.json();
          ordersList = data.data || [];
        }

        let userCount = 0;
        if (usersRes && usersRes.ok) {
          const uData = await usersRes.json();
          userCount = uData.data?.length || 0;
        }

        if (productsRes && productsRes.ok) {
          const pData = await productsRes.json();
          const pList = pData.data || [];
          const mappedTop = pList.slice(0, 4).map((p, idx) => ({
            id: p._id || p.id,
            name: p.name,
            category: p.category || (p.isBundle ? 'Creator bundles' : 'Accessories'),
            price: `₹${(p.price || 0).toLocaleString('en-IN')}`,
            sold: `${p.stock ? Math.max(1, 50 - p.stock) : 10 + idx * 5} sold`,
            image: p.image || '/pro1.png',
            fallbackImage: '/pro.png',
          }));
          setTopProducts(mappedTop);
        }

        const dbRevenue = ordersList.reduce((acc, order) => {
          if (order.status !== 'Cancelled') {
            return acc + (order.totalAmount || 0);
          }
          return acc;
        }, 0);

        const uniqueCustomerEmails = new Set(
          ordersList.map((o) => o.customerEmail || o.customerName).filter(Boolean)
        );

        const totalCustomers = Math.max(userCount, uniqueCustomerEmails.size);
        const aov = ordersList.length > 0 ? Math.round(dbRevenue / ordersList.length) : 0;

        setStats({
          revenue: dbRevenue,
          orders: ordersList.length,
          customers: totalCustomers,
          aov,
        });

        const mappedRecent = ordersList.slice(0, 5).map((o) => {
          let badgeClass = 'bg-[#FEF7E7] text-[#D97706]';
          if (o.status === 'Delivered') badgeClass = 'bg-[#EAFBF3] text-[#129A64]';
          else if (o.status === 'Shipped' || o.status === 'Out for Delivery') badgeClass = 'bg-[#EDF5FF] text-[#2563EB]';
          else if (o.status === 'Cancelled') badgeClass = 'bg-[#FEE2E2] text-[#DC2626]';

          return {
            id: o.orderId || `#CK-${o._id?.toString().slice(-6).toUpperCase()}`,
            customerName: o.customerName || 'Customer',
            customerEmail: o.customerEmail || '',
            amount: `₹${(o.totalAmount || 0).toLocaleString('en-IN')}`,
            status: o.status || 'Confirmed',
            badgeClass,
          };
        });
        setRecentOrders(mappedRecent);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      }
    }
    fetchStats();
  }, []);

  // Export Report to CSV
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order ID,Customer Name,Customer Email,Amount,Status\n' +
      recentOrders
        .map(
          (o) =>
            `"${o.id}","${o.customerName}","${o.customerEmail}","${o.amount.replace('₹', '')}","${o.status}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Report_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Data Points matching the exact line peaks and valleys
  const revenuePoints = [
    { date: 'Oct 01', revenue: '₹20,400', prev: '₹23,000', x: 50, y: 172 },
    { date: 'Oct 03', revenue: '₹24,200', prev: '₹18,500', x: 95, y: 160 },
    { date: 'Oct 05', revenue: '₹21,100', prev: '₹24,000', x: 135, y: 168 },
    { date: 'Oct 08', revenue: '₹38,500', prev: '₹26,000', x: 185, y: 130 },
    { date: 'Oct 10', revenue: '₹33,200', prev: '₹34,000', x: 230, y: 145 },
    { date: 'Oct 12', revenue: '₹48,900', prev: '₹38,000', x: 275, y: 105 },
    { date: 'Oct 15', revenue: '₹42,000', prev: '₹43,000', x: 320, y: 120 },
    { date: 'Oct 17', revenue: '₹52,400', prev: '₹39,000', x: 375, y: 92 },
    { date: 'Oct 20', revenue: '₹45,100', prev: '₹49,000', x: 430, y: 110 },
    { date: 'Oct 21', revenue: '₹64,800', prev: '₹42,000', x: 485, y: 65 },
    { date: 'Oct 22', revenue: '₹58,300', prev: '₹52,000', x: 535, y: 82 },
    { date: 'Oct 23', revenue: '₹72,650', prev: '₹55,000', x: 585, y: 45 },
  ];

  // SVG path strings constructed from the exact peaks & valleys
  const revenueLinePath =
    'M 50 172 L 95 160 L 135 168 L 185 130 L 230 145 L 275 105 L 320 120 L 375 92 L 430 110 L 485 65 L 535 82 L 585 45';
  const revenueAreaPath = `${revenueLinePath} L 585 215 L 50 215 Z`;
  const previousLinePath =
    'M 50 168 L 105 182 L 170 152 L 220 165 L 290 138 L 360 112 L 420 128 L 490 88 L 540 105 L 585 80';

  // Category Donut Calculations (Circumference for radius 65 is 408.4)
  const circumference = 408.4;
  const categories = [
    {
      id: 'bundles',
      label: 'Creator bundles',
      percent: 43,
      dashLength: circumference * 0.43,
      offset: 0,
      color: '#E11D48',
      dotColor: 'bg-[#E11D48]',
    },
    {
      id: 'lighting',
      label: 'Lighting',
      percent: 28,
      dashLength: circumference * 0.28,
      offset: -(circumference * 0.43),
      color: '#1E293B',
      dotColor: 'bg-[#1E293B]',
    },
    {
      id: 'audio',
      label: 'Audio',
      percent: 17,
      dashLength: circumference * 0.17,
      offset: -(circumference * (0.43 + 0.28)),
      color: '#94A3B8',
      dotColor: 'bg-[#94A3B8]',
    },
    {
      id: 'accessories',
      label: 'Accessories',
      percent: 12,
      dashLength: circumference * 0.12,
      offset: -(circumference * (0.43 + 0.28 + 0.17)),
      color: '#E2E8F0',
      dotColor: 'bg-[#E2E8F0]',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#111827] dark:text-white tracking-tight">
            Dashboard <span className="text-[#900606] whitespace-nowrap">overview</span>
          </h1>

          <p className="text-xs sm:text-[13px] text-neutral-700 font-normal mt-1">
            Welcome back, Admin. Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Right Controls: Date Picker & Export Report */}
        <div className="flex items-center gap-3 relative">
          
          {/* Date Picker Button */}
          <div className="relative">
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 shadow-2xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{dateRange}</span>
            </button>

            {/* Date Picker Dropdown Popover */}
            {isDatePickerOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                <p className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Select Range
                </p>
                {['Oct 1 – Oct 23, 2026', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year to Date'].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDatePickerOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-neutral-50 transition-colors font-medium ${
                      dateRange === range ? 'text-[#DC2626] font-bold bg-red-50/50' : 'text-neutral-700'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Action Button */}
          <button
            onClick={handleExportReport}
            className="bg-[#900606] hover:bg-[#a70606] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Export report</span>
          </button>

        </div>
      </div>

      {/* 2. HERO BANNER SECTION */}
      <div className="relative bg-[#141517] rounded-xl lg:rounded-3xl p-12 sm:p-15 overflow-hidden text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Subtle Ambient Red Glow */}
        <div className="absolute right-12 top-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Left Content */}
        <div className="max-w-xl z-10">
          <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#900606] mb-5">
            YOUR CREATOR BUSINESS, AT A GLANCE
          </p>

          <h2 className="text-4xl pb-3 md:text-5xl lg:text-6xl font-medium text-[#eaedf1] dark:text-white tracking-tight">
            Dashboard <span className="text-[#900606] whitespace-nowrap">overview</span>
          </h2>
          
          {/* <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white leading-tight">
            Great gear. <span className="text-[#EF4444]">Greater growth.</span>
          </h2> */}

          <p className="text-xs sm:text-sm text-neutral-400 font-medium mt-2 leading-relaxed">
            Your next big milestone starts here. Keep the momentum going.
          </p>

          <button
            onClick={() => router.push('/admin?tab=products')}
            className="mt-5 inline-flex items-center gap-1.5 bg-[#900606] hover:bg-[#a70606] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer group"
          >
            <span>Manage products</span>
            <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
          </button>
        </div>

        {/* Right Studio Gear Graphic */}
        <div className="relative w-full md:w-80 lg:w-[350px] h-36 sm:h-44 shrink-0 overflow-hidden rounded-xl bg-[#141517] flex items-center justify-center">
          <img
            src="/banner 6.png"
            alt="Creator Studio Gear"
            className="w-full h-full object-cover object-center filter brightness-95"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/creator-studio.jpg';
            }}
          />
        </div>

      </div>

      {/* 3. METRICS / ANALYTICS CARDS (4-COLUMN GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total revenue</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] font-bold text-xs flex items-center justify-center">
              ₹
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight">
              ₹{stats.revenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 18.6%</span>
            <span className="text-neutral-400 font-normal">vs. last month</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total orders</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
              </svg>
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight">
              {stats.orders.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 12.8%</span>
            <span className="text-neutral-400 font-normal">vs. last month</span>
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Total customers</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight">
              {stats.customers.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 8.2%</span>
            <span className="text-neutral-400 font-normal">vs. last month</span>
          </div>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Average order value</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#DC2626] flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-[28px] font-black text-[#111827] tracking-tight">
              ₹{stats.aov.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>↗ 5.1%</span>
            <span className="text-neutral-400 font-normal">vs. last month</span>
          </div>
        </div>

      </div>

      {/* 4. CHARTS & CATEGORY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Revenue Overview (Area / Line Chart) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Revenue overview</h3>
                <p className="text-xs text-neutral-400 font-normal mt-0.5">A little progress, every single day.</p>
              </div>

              {/* Time Filter Select */}
              <select
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value)}
                className="bg-white border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-2xs outline-none cursor-pointer hover:border-neutral-300"
              >
                <option value="This month">This month</option>
                <option value="Last month">Last month</option>
                <option value="This quarter">This quarter</option>
                <option value="This year">This year</option>
              </select>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5 mt-4 text-xs font-semibold text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-neutral-400 font-normal">Previous period</span>
              </div>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative mt-6 w-full h-64 sm:h-72">
            
            {/* Hover Tooltip */}
            {hoveredPoint && (
              <div
                className="absolute z-30 bg-[#111827] text-white text-xs rounded-lg py-1.5 px-3 pointer-events-none shadow-xl transform -translate-x-1/2 -translate-y-full mb-2"
                style={{
                  left: `${(hoveredPoint.x / 620) * 100}%`,
                  top: `${(hoveredPoint.y / 240) * 100}%`,
                }}
              >
                <p className="font-bold">{hoveredPoint.date}</p>
                <p className="text-red-400 font-semibold">{hoveredPoint.revenue}</p>
                <p className="text-[10px] text-neutral-400">Prev: {hoveredPoint.prev}</p>
              </div>
            )}

            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 620 240"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.18" />
                  <stop offset="85%" stopColor="#DC2626" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[
                { label: '₹80k', y: 35 },
                { label: '₹60k', y: 80 },
                { label: '₹40k', y: 125 },
                { label: '₹20k', y: 170 },
                { label: '₹0', y: 215 },
              ].map((grid, idx) => (
                <g key={idx}>
                  <text
                    x="2"
                    y={grid.y + 4}
                    fill="#94A3B8"
                    fontSize="11"
                    fontWeight="500"
                  >
                    {grid.label}
                  </text>
                  <line
                    x1="45"
                    y1={grid.y}
                    x2="600"
                    y2={grid.y}
                    stroke="#F1F5F9"
                    strokeWidth="1.2"
                  />
                </g>
              ))}

              {/* Area Gradient Fill */}
              <path
                d={revenueAreaPath}
                fill="url(#revenueGrad)"
              />

              {/* Previous Period Dashed Curve */}
              <path
                d={previousLinePath}
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Current Period Curve */}
              <path
                d={revenueLinePath}
                fill="none"
                stroke="#DC2626"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* X-axis labels */}
              {[
                { label: 'Oct 01', x: 50 },
                { label: 'Oct 05', x: 135 },
                { label: 'Oct 10', x: 230 },
                { label: 'Oct 15', x: 320 },
                { label: 'Oct 20', x: 430 },
                { label: 'Oct 23', x: 585 },
              ].map((tick, i) => (
                <text
                  key={i}
                  x={tick.x}
                  y="235"
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="500"
                >
                  {tick.label}
                </text>
              ))}

              {/* Interactive Hover Circles */}
              {revenuePoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="16"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right (4 cols): Sales by Category (Donut Chart) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Sales by category</h3>
                <p className="text-xs text-neutral-400 font-normal mt-0.5">What creators are loving.</p>
              </div>
              <button className="text-neutral-400 hover:text-neutral-700 p-1 font-bold">
                •••
              </button>
            </div>

            {/* Donut Chart SVG */}
            <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="#F8FAFC"
                  strokeWidth="20"
                  fill="transparent"
                />

                {/* Segments */}
                {categories.map((cat) => (
                  <circle
                    key={cat.id}
                    cx="80"
                    cy="80"
                    r="65"
                    stroke={cat.color}
                    strokeWidth={hoveredDonutSegment === cat.id ? '24' : '20'}
                    strokeDasharray={`${cat.dashLength} ${circumference}`}
                    strokeDashoffset={cat.offset}
                    fill="transparent"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredDonutSegment(cat.id)}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  />
                ))}
              </svg>

              {/* Donut Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-neutral-900 tracking-tight">
                  1,284
                </span>
                <span className="text-[11px] font-medium text-neutral-400">
                  Total orders
                </span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredDonutSegment(cat.id)}
                onMouseLeave={() => setHoveredDonutSegment(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredDonutSegment === cat.id ? 'bg-neutral-50' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${cat.dotColor}`}></span>
                  <span className="font-semibold text-neutral-700">{cat.label}</span>
                </div>
                <span className="font-bold text-neutral-900">{cat.percent}%</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 5. RECENT ORDERS & TOP SELLING PRODUCTS TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Recent orders</h3>
              <p className="text-xs text-neutral-400 font-normal mt-0.5">
                The latest from your creator community.
              </p>
            </div>

            <button
              onClick={() => router.push('/admin?tab=orders')}
              className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all orders</span>
              <span>↗</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-2 font-bold">ORDER ID</th>
                  <th className="py-3 px-4 font-bold">CUSTOMER</th>
                  <th className="py-3 px-4 font-bold">AMOUNT</th>
                  <th className="py-3 px-2 text-right font-bold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-2 font-bold text-neutral-900">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-900">{order.customerName}</div>
                      <div className="text-[11px] text-neutral-400 font-normal">{order.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-900">
                      {order.amount}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${order.badgeClass}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (4 cols): Top Selling Products & Low Stock Alert */}
        <div className="lg:col-span-4 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Top selling products</h3>
                <p className="text-xs text-neutral-400 font-normal mt-0.5">
                  The gear making an impact.
                </p>
              </div>

              <button
                onClick={() => router.push('/admin?tab=products')}
                className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View all</span>
                <span>↗</span>
              </button>
            </div>

            {/* Product Items List */}
            <div className="space-y-4">
              {topProducts.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = prod.fallbackImage;
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        {prod.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-neutral-900">
                      {prod.price}
                    </p>
                    <p className="text-[11px] text-neutral-400 font-medium">
                      {prod.sold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert Warning Box */}
          <div className="mt-6 bg-[#FEF8ED] border border-[#FDE68A]/70 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">⚙</span>
              <span className="font-medium text-[11px] sm:text-xs text-amber-800">
                3 products are running low on stock.
              </span>
            </div>
            <button
              onClick={() => router.push('/admin?tab=products')}
              className="font-bold text-[11px] sm:text-xs text-[#DC2626] hover:underline shrink-0 ml-2 cursor-pointer"
            >
              Review →
            </button>
          </div>

        </div>

      </div>

      {/* 6. DASHBOARD FOOTER */}
      <div className="pt-4 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
        <p>© 2026 CreatorsKit. Built for creators, by creators.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
            Sample data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All systems operational
          </span>
        </div>
      </div>

    </div>
  );
}
