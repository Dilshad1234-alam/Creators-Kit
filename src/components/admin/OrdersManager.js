'use client';

import { useEffect, useState } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function OrdersManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMenuOpenId, setStatusMenuOpenId] = useState(null);

  const [orders, setOrders] = useState([]);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    orderId: null,
    orderName: '',
    isDeleting: false,
  });

  // Fetch real database orders from MongoDB
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        const dbOrders = data.data || [];
        const mappedDbOrders = dbOrders.map((o) => {
          const addressStr = o.shippingAddress
            ? typeof o.shippingAddress === 'string'
              ? o.shippingAddress
              : `${o.shippingAddress.street || ''}, ${o.shippingAddress.city || ''} ${o.shippingAddress.state || ''} ${o.shippingAddress.zipCode || ''}`.trim()
            : 'Online Order';

          return {
            _id: o._id,
            orderId: o.orderId || `#CK-${o._id.toString().slice(-6).toUpperCase()}`,
            customerName: o.customerName || 'Customer',
            customerEmail: o.customerEmail || 'customer@email.com',
            shippingAddress: addressStr || 'Digital Delivery',
            totalAmount: o.totalAmount || 0,
            formattedAmount: `₹${(o.totalAmount || 0).toLocaleString('en-IN')}`,
            status: o.status || 'Confirmed',
            paymentMode: o.paymentMode || 'Online',
            deliveryOtp: o.deliveryOtp || '',
            items: o.items || [],
            createdAt: o.createdAt || new Date().toISOString(),
          };
        });
        setOrders(mappedDbOrders);
      }
    } catch (err) {
      console.error('Failed to load orders from MongoDB', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Status handler
  const handleStatusChange = async (orderId, newStatus) => {
    setStatusMenuOpenId(null);
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to persist status change', err);
    }
  };

  // Delete Order handler with in-app confirmation
  const requestDeleteOrder = (order) => {
    setDeleteModal({
      isOpen: true,
      orderId: order._id,
      orderName: order.name || 'Order',
      isDeleting: false,
    });
  };

  const handleConfirmDeleteOrder = async () => {
    if (!deleteModal.orderId) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const orderId = deleteModal.orderId;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setDeleteModal({ isOpen: false, orderId: null, orderName: '', isDeleting: false });
      } else {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Failed to delete order', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Export Orders Report to CSV
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order ID,Customer Name,Customer Email,Address,Amount,Status\n' +
      orders
        .map(
          (o) =>
            `"${o.orderId}","${o.customerName}","${o.customerEmail}","${(o.shippingAddress || '').replace(/"/g, '""')}","${(o.formattedAmount || '').replace('₹', '')}","${o.status}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Orders_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered orders by search query
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      o.orderId?.toLowerCase().includes(query) ||
      o.customerName?.toLowerCase().includes(query) ||
      o.customerEmail?.toLowerCase().includes(query) ||
      o.shippingAddress?.toLowerCase().includes(query) ||
      o.status?.toLowerCase().includes(query) ||
      o.formattedAmount?.toLowerCase().includes(query)
    );
  });

  // Status Badge Styling Helper
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#EAFBF3] text-[#129A64] hover:bg-[#D5F7E7]';
      case 'Processing':
      case 'Confirmed':
        return 'bg-[#FEF7E7] text-[#D97706] hover:bg-[#FEEFCB]';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-[#EDF5FF] text-[#2563EB] hover:bg-[#D9EBFF]';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FED1D1]';
      default:
        return 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Orders
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Manage your store&apos;s orders in one place.
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
            className="bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Export report</span>
          </button>

        </div>
      </div>

      {/* 2. MAIN ORDERS CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold p-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 font-bold w-[14%]">ORDER ID</th>
                <th className="py-3.5 px-3 font-bold w-[18%]">CUSTOMER</th>
                <th className="py-3.5 px-3 font-bold w-[18%]">EMAIL</th>
                <th className="py-3.5 px-3 font-bold w-[26%]">ADDRESS</th>
                <th className="py-3.5 px-3 font-bold w-[12%]">AMOUNT</th>
                <th className="py-3.5 px-3 text-right font-bold w-[12%]">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {filteredOrders.map((order) => (
                <tr key={order._id || order.orderId} className="hover:bg-neutral-50/70 transition-colors group">
                  
                  {/* Order ID */}
                  <td className="py-4 px-3 font-bold text-neutral-900 align-middle">
                    {order.orderId}
                  </td>

                  {/* Customer (Name + small email) */}
                  <td className="py-4 px-3 align-middle">
                    <div className="font-bold text-neutral-900">{order.customerName}</div>
                    <div className="text-[11px] text-neutral-400 font-normal">{order.customerEmail}</div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-3 align-middle text-neutral-600">
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="hover:text-[#900606] hover:underline transition-colors"
                    >
                      {order.customerEmail}
                    </a>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-3 align-middle text-neutral-600 max-w-xs truncate" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-3 font-bold text-neutral-900 align-middle">
                    {order.formattedAmount}
                  </td>

                  {/* Status Badge with Interactive Dropdown */}
                  <td className="py-4 px-3 text-right align-middle relative">
                    <div className="inline-block relative">
                      <button
                        onClick={() =>
                          setStatusMenuOpenId(statusMenuOpenId === order._id ? null : order._id)
                        }
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${getBadgeStyle(
                          order.status
                        )}`}
                        title="Click to update status"
                      >
                        <span>{order.status}</span>
                        <svg className="w-2.5 h-2.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Status Change Popover */}
                      {statusMenuOpenId === order._id && (
                        <div className="absolute right-0 mt-1.5 w-36 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 z-40 text-left">
                          <p className="px-3 py-1 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                            Update Status
                          </p>
                          {['Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(order._id, st)}
                              className={`w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50 transition-colors ${
                                order.status === st ? 'text-[#900606] font-bold bg-red-50/50' : 'text-neutral-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Delete Order Button */}
                      <button
                        onClick={() => requestDeleteOrder(order)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1 cursor-pointer"
                        title="Delete Order"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {/* Empty Search State */}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">No orders found</p>
                    <p className="text-xs">
                      {searchQuery ? `No orders match your search criteria "${searchQuery}"` : 'No orders in MongoDB yet. Orders placed on the frontend will appear here instantly.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-bold text-[#900606] hover:underline"
                      >
                        Clear search
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 3. FOOTER */}
      <div className="pt-4 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
        <p>© 2026 CreatorsKit. Live connected to MongoDB.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            MongoDB Live Sync
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All systems operational
          </span>
        </div>
      </div>

      {/* Custom In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, orderId: null, orderName: '', isDeleting: false })
        }
        onConfirm={handleConfirmDeleteOrder}
        title="Delete Order Permanently?"
        message={`Are you sure you want to permanently delete order for ${deleteModal.orderName}? This action cannot be undone.`}
        isDeleting={deleteModal.isDeleting}
      />

    </div>
  );
}
