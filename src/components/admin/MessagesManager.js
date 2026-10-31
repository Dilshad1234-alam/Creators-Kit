'use client';

import { useState, useEffect } from 'react';
import DeleteConfirmModal from './DeleteConfirmModal';
import ContactManager from './ContactManager';

export default function MessagesManager() {
  const [activeView, setActiveView] = useState('inquiries'); // 'inquiries' | 'page-content'
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Detail Modal for viewing complete message
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    item: null,
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    contactItem: null,
    isDeleting: false,
  });

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState(null);

  // Search & Header Controls matching Orders page
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts(isManual = false) {
    try {
      if (isManual) setIsRefreshing(true);
      else setLoading(true);

      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch contact inquiries', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  const requestDelete = (contactItem) => {
    setDeleteModal({
      isOpen: true,
      contactItem,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.contactItem) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const id = deleteModal.contactItem._id;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || res.ok) {
        setContacts((prev) => prev.filter((m) => m._id !== id));
        if (detailModal.item?._id === id) {
          setDetailModal({ isOpen: false, item: null });
        }
        setDeleteModal({ isOpen: false, contactItem: null, isDeleting: false });
      } else {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Failed to delete contact inquiry', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCopyText = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Subject Badge Color Styling
  const getSubjectBadge = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('order') || s.includes('delivery')) {
      return 'bg-[#FEF7E7] text-[#D97706] border-amber-200/90';
    }
    if (s.includes('bundle') || s.includes('creator')) {
      return 'bg-[#EAFBF3] text-[#129A64] border-emerald-200/90';
    }
    if (s.includes('product') || s.includes('compatibility')) {
      return 'bg-[#EDF5FF] text-[#2563EB] border-blue-200/90';
    }
    if (s.includes('course') || s.includes('masterclass')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/90';
    }
    if (s.includes('bulk') || s.includes('business')) {
      return 'bg-rose-50 text-rose-700 border-rose-200/90';
    }
    return 'bg-neutral-100 text-neutral-700 border-neutral-200/90';
  };

  // Export Customer Inquiries to CSV matching Orders page pattern
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Date,Time,Customer Name,Email,Phone,Subject,Message\n' +
      contacts
        .map(
          (m) =>
            `"${new Date(m.createdAt || Date.now()).toLocaleDateString('en-US')}","${new Date(
              m.createdAt || Date.now()
            ).toLocaleTimeString('en-US')}","${(m.name || '').replace(/"/g, '""')}","${(
              m.email || ''
            ).replace(/"/g, '""')}","${(m.phone || '').replace(/"/g, '""')}","${(
              m.subject || 'General Inquiry'
            ).replace(/"/g, '""')}","${(m.message || '').replace(/"/g, '""')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `CreatorsKit_Contact_Inquiries_${dateRange.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries by search query
  const filteredContacts = contacts.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      {/* Top View Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-px">
        <button
          type="button"
          onClick={() => setActiveView('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeView === 'inquiries'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Customer Inquiries</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
            {contacts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('page-content')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeView === 'page-content'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Contact Page CMS</span>
        </button>
      </div>

      {activeView === 'page-content' ? (
        <ContactManager />
      ) : (
        <>
          {/* 1. TOP HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Contact Inquiries
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            View, respond to, and manage contact inquiries submitted by customers from the website.
          </p>
        </div>

        {/* Right Controls: Badge, Refresh, Date Picker & Export Report */}
        <div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">
          
          {/* Live Inquiries Count Badge */}
          <div className="bg-white border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{contacts.length} Inquiries</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchContacts(true)}
            disabled={isRefreshing || loading}
            title="Refresh Inquiries"
            className="bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
          >
            <svg
              className={`w-3.5 h-3.5 text-neutral-600 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Date Picker Button */}
          <div className="relative">
            <button
              type="button"
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

            {/* Date Picker Popover */}
            {isDatePickerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDatePickerOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <p className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Select Range
                  </p>
                  {['Oct 1 – Oct 23, 2026', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year to Date'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        setIsDatePickerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-neutral-50 transition-colors font-medium cursor-pointer ${
                        dateRange === range ? 'text-[#DC2626] font-bold bg-red-50/50' : 'text-neutral-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Report Button */}
          <button
            type="button"
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

      {/* 2. MAIN CONTACTS CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by customer name, email, phone number, subject, or message content..."
            className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 font-bold w-[14%]">DATE &amp; TIME</th>
                <th className="py-3.5 px-3 font-bold w-[18%]">CUSTOMER</th>
                <th className="py-3.5 px-3 font-bold w-[14%]">PHONE</th>
                <th className="py-3.5 px-3 font-bold w-[17%]">SUBJECT</th>
                <th className="py-3.5 px-3 font-bold w-[25%]">MESSAGE</th>
                <th className="py-3.5 px-3 text-right font-bold w-[12%]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-3">
                      <div className="w-24 h-4 bg-neutral-100 rounded mb-1.5"></div>
                      <div className="w-16 h-3 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-32 h-4 bg-neutral-100 rounded mb-1.5"></div>
                      <div className="w-40 h-3 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-24 h-4 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-28 h-5 bg-neutral-100 rounded-md"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-full h-4 bg-neutral-100 rounded mb-1.5"></div>
                      <div className="w-3/4 h-3 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="w-16 h-7 bg-neutral-100 rounded-lg ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredContacts.map((m) => (
                  <tr key={m._id} className="hover:bg-neutral-50/70 transition-colors group">
                    
                    {/* 1. Date & Time */}
                    <td className="py-4 px-3 align-top">
                      <div className="font-bold text-neutral-900">
                        {new Date(m.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        {new Date(m.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* 2. Customer Name & Email */}
                    <td className="py-4 px-3 align-top">
                      <div className="font-bold text-neutral-900">{m.name}</div>
                      <div className="mt-0.5">
                        <a
                          href={`mailto:${m.email}`}
                          className="text-[11px] text-neutral-500 hover:text-[#900606] hover:underline transition-colors break-all"
                          title="Click to email customer"
                        >
                          {m.email}
                        </a>
                      </div>
                    </td>

                    {/* 3. Phone Number */}
                    <td className="py-4 px-3 align-top">
                      {m.phone ? (
                        <a
                          href={`tel:${m.phone}`}
                          className="inline-flex items-center gap-1.5 font-mono text-neutral-800 hover:text-[#900606] transition-colors"
                          title="Click to call customer"
                        >
                          <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{m.phone}</span>
                        </a>
                      ) : (
                        <span className="text-neutral-300 font-mono">—</span>
                      )}
                    </td>

                    {/* 4. Subject Badge */}
                    <td className="py-4 px-3 align-top">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${getSubjectBadge(
                          m.subject
                        )}`}
                      >
                        {m.subject || 'General Inquiry'}
                      </span>
                    </td>

                    {/* 5. Message Body Preview with Click to Read */}
                    <td className="py-4 px-3 align-top">
                      <div
                        onClick={() => setDetailModal({ isOpen: true, item: m })}
                        className="cursor-pointer group/msg max-w-sm"
                        title="Click to view full inquiry details"
                      >
                        <p className="text-neutral-700 leading-relaxed line-clamp-2 text-xs sm:text-[13px] group-hover/msg:text-[#900606] transition-colors">
                          {m.message}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-semibold group-hover/msg:text-[#900606] transition-colors mt-0.5 inline-block">
                          View details ➔
                        </span>
                      </div>
                    </td>

                    {/* 6. Action Controls */}
                    <td className="py-4 px-3 text-right align-top">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => setDetailModal({ isOpen: true, item: m })}
                          className="px-2 py-1.5 text-xs font-semibold text-neutral-600 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="View Full Inquiry"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="hidden lg:inline">View</span>
                        </button>

                        {/* Reply via Email */}
                        <a
                          href={`mailto:${m.email}?subject=Re:%20${encodeURIComponent(
                            m.subject || 'Inquiry regarding CreatorsKit'
                          )}`}
                          className="px-2 py-1.5 text-xs font-semibold text-neutral-600 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Reply via Email"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden lg:inline">Reply</span>
                        </a>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => requestDelete(m)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Inquiry"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {/* Empty Search State */}
              {!loading && filteredContacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">No contact inquiries found</p>
                    <p className="text-xs">
                      {searchQuery
                        ? `No inquiries match your search criteria "${searchQuery}"`
                        : 'No customer inquiries in MongoDB yet. Submissions from the website contact page will appear here.'}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-bold text-[#900606] hover:underline cursor-pointer"
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

      {/* 3. FOOTER CONSISTENT WITH ORDERS */}
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

      {/* 4. DETAIL MODAL: COMPLETE INQUIRY VIEW */}
      {detailModal.isOpen && detailModal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setDetailModal({ isOpen: false, item: null })}
          />
          <div className="relative w-full max-w-xl bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto z-10 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border mb-2 ${getSubjectBadge(
                  detailModal.item.subject
                )}`}>
                  {detailModal.item.subject || 'General Inquiry'}
                </span>
                <h3 className="text-xl font-extrabold text-[#111827] tracking-tight">
                  Inquiry from {detailModal.item.name}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-1">
                  Received on {new Date(detailModal.item.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailModal({ isOpen: false, item: null })}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customer Details Pill Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200/70 text-xs">
              
              {/* Customer Email */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Email Address
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${detailModal.item.email}`}
                    className="font-bold text-neutral-900 hover:text-[#900606] hover:underline break-all"
                  >
                    {detailModal.item.email}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(detailModal.item.email, 'email')}
                    className="text-neutral-400 hover:text-neutral-700 text-[11px] font-semibold cursor-pointer shrink-0"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Customer Phone */}
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Phone Number
                </span>
                {detailModal.item.phone ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${detailModal.item.phone}`}
                      className="font-bold text-neutral-900 hover:text-[#900606] font-mono"
                    >
                      {detailModal.item.phone}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyText(detailModal.item.phone, 'phone')}
                      className="text-neutral-400 hover:text-neutral-700 text-[11px] font-semibold cursor-pointer shrink-0"
                      title="Copy Phone"
                    >
                      {copiedKey === 'phone' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                ) : (
                  <span className="text-neutral-400">Not provided</span>
                )}
              </div>

            </div>

            {/* Message Body */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Customer Message
              </span>
              <div className="p-4 rounded-xl bg-white border border-neutral-200/90 text-neutral-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {detailModal.item.message}
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => requestDelete(detailModal.item)}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                {detailModal.item.phone && (
                  <a
                    href={`https://wa.me/${detailModal.item.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <span>WhatsApp</span>
                  </a>
                )}
                
                <a
                  href={`mailto:${detailModal.item.email}?subject=Re:%20${encodeURIComponent(
                    detailModal.item.subject || 'Inquiry regarding CreatorsKit'
                  )}`}
                  className="px-4 py-2 bg-[#DC2626] hover:bg-[#C81E1E] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. CUSTOM IN-APP DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, contactItem: null, isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Contact Inquiry?"
        message={
          deleteModal.contactItem
            ? `Are you sure you want to delete the inquiry from "${deleteModal.contactItem.name}"? This action cannot be undone.`
            : 'Are you sure you want to delete this contact inquiry?'
        }
        isDeleting={deleteModal.isDeleting}
      />
        </>
      )}

    </div>
  );
}
