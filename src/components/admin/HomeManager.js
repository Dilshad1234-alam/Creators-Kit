'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function HomeManager() {
  const [activeTab, setActiveTab] = useState('banners'); // 'banners' | 'categories' | 'masterclasses'

  // Data states
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Header Controls matching Orders page
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    title: '',
    message: '',
    isDeleting: false,
  });

  // Form states
  const [bannerForm, setBannerForm] = useState({
    image: '',
    title: '',
    subtitle: '',
    ctaText: '',
    link: '/product',
    order: 1,
    active: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: '',
    video: '',
    link: '/product',
    itemCount: '',
    order: 1,
  });

  const [masterclassForm, setMasterclassForm] = useState({
    title: '',
    description: '',
    badge: '100% Free',
    icon: '📱',
    image: '',
    ctaText: 'Explore Bundles',
    ctaLink: '/product',
    order: 1,
    active: true,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [bannersRes, categoriesRes, masterclassesRes] = await Promise.all([
        fetch('/api/hero-banners'),
        fetch('/api/categories'),
        fetch('/api/homepage-masterclasses'),
      ]);

      if (bannersRes.ok) {
        const bData = await bannersRes.json();
        setBanners(bData.data || []);
      }
      if (categoriesRes.ok) {
        const cData = await categoriesRes.json();
        setCategories(cData.data || []);
      }
      if (masterclassesRes.ok) {
        const mData = await masterclassesRes.json();
        setMasterclasses(mData.data || []);
      }
    } catch (err) {
      console.error('Failed to load home page sections', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Add Modal based on active tab
  const handleOpenAdd = () => {
    setEditingItem(null);
    if (activeTab === 'banners') {
      setBannerForm({
        image: '',
        title: '',
        subtitle: '',
        ctaText: 'Explore Bundle',
        link: '/product',
        order: banners.length + 1,
        active: true,
      });
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name: '',
        image: '',
        video: '',
        link: '/product',
        itemCount: '',
        order: categories.length + 1,
      });
    } else {
      setMasterclassForm({
        title: '',
        description: '',
        badge: '100% Free',
        icon: '📱',
        image: '',
        ctaText: 'Explore Bundles',
        ctaLink: '/product',
        order: masterclasses.length + 1,
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal based on active tab
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'banners') {
      setBannerForm({
        image: item.image || '',
        title: item.title || '',
        subtitle: item.subtitle || '',
        ctaText: item.ctaText || '',
        link: item.link || '/product',
        order: item.order || 0,
        active: item.active !== false,
      });
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name: item.name || '',
        image: item.image || '',
        video: item.video || item.videoUrl || '',
        link: item.link || '/product',
        itemCount: item.itemCount || '',
        order: item.order || 0,
      });
    } else {
      setMasterclassForm({
        title: item.title || '',
        description: item.description || '',
        badge: item.badge || '100% Free',
        icon: item.icon || '📱',
        image: item.image || '',
        ctaText: item.ctaText || 'Explore Bundles',
        ctaLink: item.ctaLink || '/product',
        order: item.order || 0,
        active: item.active !== false,
      });
    }
    setIsModalOpen(true);
  };

  // Delete Handler with custom in-app confirmation modal
  const requestDelete = (id, label) => {
    const sectionName =
      activeTab === 'banners'
        ? 'hero banner'
        : activeTab === 'categories'
        ? 'category'
        : 'masterclass card';
    setDeleteModal({
      isOpen: true,
      id,
      title: `Delete ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}?`,
      message: label
        ? `Are you sure you want to delete "${label}"? This action cannot be undone.`
        : `Are you sure you want to delete this ${sectionName}? This action cannot be undone.`,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    const id = deleteModal.id;
    try {
      const endpoint =
        activeTab === 'banners'
          ? `/api/hero-banners/${id}`
          : activeTab === 'categories'
          ? `/api/categories/${id}`
          : `/api/homepage-masterclasses/${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (activeTab === 'banners') setBanners((prev) => prev.filter((b) => b._id !== id));
        else if (activeTab === 'categories') setCategories((prev) => prev.filter((c) => c._id !== id));
        else setMasterclasses((prev) => prev.filter((m) => m._id !== id));
        setDeleteModal({ isOpen: false, id: null, title: '', message: '', isDeleting: false });
      } else {
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Failed to delete item', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const isEdit = !!editingItem;
      let endpoint = '';
      let payload = {};

      if (activeTab === 'banners') {
        endpoint = isEdit ? `/api/hero-banners/${editingItem._id}` : '/api/hero-banners';
        payload = bannerForm;
      } else if (activeTab === 'categories') {
        endpoint = isEdit ? `/api/categories/${editingItem._id}` : '/api/categories';
        payload = categoryForm;
      } else {
        endpoint = isEdit ? `/api/homepage-masterclasses/${editingItem._id}` : '/api/homepage-masterclasses';
        payload = masterclassForm;
      }

      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        fetchAllData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to save item');
      }
    } catch (err) {
      console.error('Failed to submit form', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Export Report to CSV matching Orders page pattern
  const handleExportReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = '';

    if (activeTab === 'banners') {
      csvContent += 'Order,Title,Subtitle,CTA Text,Link,Image,Active\n';
      csvContent += banners
        .map(
          (b) =>
            `"${b.order || 0}","${(b.title || '').replace(/"/g, '""')}","${(
              b.subtitle || ''
            ).replace(/"/g, '""')}","${(b.ctaText || '').replace(/"/g, '""')}","${
              b.link || ''
            }","${b.image || ''}","${b.active !== false ? 'Yes' : 'No'}"`
        )
        .join('\n');
      filename = `CreatorsKit_Hero_Banners_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else if (activeTab === 'categories') {
      csvContent += 'Order,Category Name,Image,Link,Subtitle/ItemCount\n';
      csvContent += categories
        .map(
          (c) =>
            `"${c.order || 0}","${(c.name || '').replace(/"/g, '""')}","${c.image || ''}","${
              c.link || ''
            }","${(c.itemCount || '').replace(/"/g, '""')}"`
        )
        .join('\n');
      filename = `CreatorsKit_Shop_Categories_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else {
      csvContent += 'Order,Title,Description,Badge,Icon,CTA Text,CTA Link,Image,Active\n';
      csvContent += masterclasses
        .map(
          (m) =>
            `"${m.order || 0}","${(m.title || '').replace(/"/g, '""')}","${(
              m.description || ''
            ).replace(/"/g, '""')}","${(m.badge || '').replace(/"/g, '""')}","${(
              m.icon || ''
            ).replace(/"/g, '""')}","${(m.ctaText || '').replace(/"/g, '""')}","${
              m.ctaLink || ''
            }","${m.image || ''}","${m.active !== false ? 'Yes' : 'No'}"`
        )
        .join('\n');
      filename = `CreatorsKit_Masterclasses_${dateRange.replace(/\s+/g, '_')}.csv`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items by search query for currently active tab
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return activeTab === 'banners' ? banners : activeTab === 'categories' ? categories : masterclasses;
    }

    if (activeTab === 'banners') {
      return banners.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.subtitle?.toLowerCase().includes(q) ||
          b.ctaText?.toLowerCase().includes(q) ||
          b.image?.toLowerCase().includes(q) ||
          b.link?.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'categories') {
      return categories.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.itemCount?.toLowerCase().includes(q) ||
          c.link?.toLowerCase().includes(q)
      );
    }

    return masterclasses.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q) ||
        m.badge?.toLowerCase().includes(q) ||
        m.ctaText?.toLowerCase().includes(q) ||
        m.ctaLink?.toLowerCase().includes(q)
    );
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      
      {/* 1. TOP HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Home Page Management
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Dynamically manage Hero Banners, Shop by Category Bento, and Learn &amp; Grow Cards live on the website.
          </p>
        </div>

        {/* Right Controls: Date Picker, Export Report & Add Button */}
        <div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">
          
          {/* Active Section Count Badge */}
          <div className="bg-white border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              {activeTab === 'banners'
                ? `${banners.length} Banners`
                : activeTab === 'categories'
                ? `${categories.length} Categories`
                : `${masterclasses.length} Masterclasses`}
            </span>
          </div>

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

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>
              {activeTab === 'banners'
                ? '+ Add Banner'
                : activeTab === 'categories'
                ? '+ Add Category'
                : '+ Add Masterclass'}
            </span>
          </button>

        </div>
      </div>

      {/* 2. SECTION SELECTION TABS */}
      <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200/80">
        <button
          type="button"
          onClick={() => {
            setActiveTab('banners');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'bg-white text-neutral-900 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Hero Banners</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {banners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('categories');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-white text-neutral-900 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Shop by Category</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {categories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('masterclasses');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'masterclasses'
              ? 'bg-white text-neutral-900 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Learn &amp; Grow Cards</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {masterclasses.length}
          </span>
        </button>
      </div>

      {/* 3. MAIN CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'banners'
                ? 'Search banners by heading, subheading, CTA, link, or image...'
                : activeTab === 'categories'
                ? 'Search categories by name, subtitle, or link...'
                : 'Search masterclasses by title, description, badge, or CTA...'
            }
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

        {/* Dynamic Table for Active Section */}
        <div className="overflow-x-auto">
          {activeTab === 'banners' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[18%]">BANNER PREVIEW</th>
                  <th className="py-3.5 px-3 font-bold w-[34%]">HEADING &amp; SUBHEADING</th>
                  <th className="py-3.5 px-3 font-bold w-[16%]">CTA BUTTON</th>
                  <th className="py-3.5 px-3 font-bold w-[10%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[14%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-24 h-12 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-4 bg-neutral-100 rounded mb-1"></div><div className="w-32 h-3 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-16 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((b) => (
                    <tr key={b._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {b.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="w-28 h-14 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={getImageUrl(b.image)}
                            alt={b.title || 'Hero Banner'}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors line-clamp-1">
                          {b.title || 'Pure Graphic Slide (No text overlay)'}
                        </div>
                        {b.subtitle && (
                          <div className="text-[11px] text-neutral-500 font-medium line-clamp-1 mt-0.5">
                            Badge: {b.subtitle}
                          </div>
                        )}
                        <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                          {b.link || '/product'}
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        {b.ctaText ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                            {b.ctaText}
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-xs">Direct Link</span>
                        )}
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            b.active !== false
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                        >
                          {b.active !== false ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(b)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Edit Banner"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(b._id, b.title || 'Banner')}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Banner"
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
              </tbody>
            </table>
          )}

          {activeTab === 'categories' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[16%]">THUMBNAIL</th>
                  <th className="py-3.5 px-3 font-bold w-[30%]">CATEGORY NAME</th>
                  <th className="py-3.5 px-3 font-bold w-[20%]">SUBTITLE / BADGE</th>
                  <th className="py-3.5 px-3 font-bold w-[12%]">TARGET URL</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[14%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-14 h-14 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-36 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-24 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-16 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((c) => (
                    <tr key={c._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {c.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="w-14 h-14 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={getImageUrl(c.image)}
                            alt={c.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          {(c.video || c.videoUrl) && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 py-0.2 rounded font-bold shadow-sm">
                              ▶ Video
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900 group-hover:text-[#900606] transition-colors">
                        {c.name}
                      </td>
                      <td className="py-4 px-3 align-middle text-neutral-500">
                        {c.itemCount ? (
                          <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200/70">
                            {c.itemCount}
                          </span>
                        ) : (
                          <span className="text-neutral-400">Default Category</span>
                        )}
                      </td>
                      <td className="py-4 px-3 align-middle text-neutral-400 font-mono text-[11px]">
                        {c.link || '/product'}
                      </td>
                      <td className="py-4 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Edit Category"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(c._id, c.name)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Category"
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
              </tbody>
            </table>
          )}

          {activeTab === 'masterclasses' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[7%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[12%]">ICON / PREVIEW</th>
                  <th className="py-3.5 px-3 font-bold w-[24%]">MASTERCLASS TITLE</th>
                  <th className="py-3.5 px-3 font-bold w-[31%]">DESCRIPTION</th>
                  <th className="py-3.5 px-3 font-bold w-[14%]">BADGE &amp; CTA</th>
                  <th className="py-3.5 px-3 font-bold w-[6%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[6%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-12 bg-neutral-100 rounded-xl"></div></td>
                      <td className="py-4 px-3"><div className="w-36 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-16 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((m) => (
                    <tr key={m._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {m.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="w-14 h-10 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                          {m.image ? (
                            <img
                              src={getImageUrl(m.image)}
                              alt={m.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900 group-hover:text-[#900606] transition-colors">
                        <div className="font-bold text-neutral-900 text-[13px]">{m.title}</div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-xs">
                          {m.ctaLink || '/product'}
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle text-neutral-600 text-xs leading-relaxed max-w-md">
                        <p className="line-clamp-2">{m.description}</p>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-50 text-[#900606] border border-red-100">
                            {m.badge || '100% Free'}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-600">
                            {m.ctaText || 'Explore Bundles'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            m.active !== false
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                        >
                          {m.active !== false ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(m)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Edit Masterclass Card"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(m._id, m.title)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Masterclass Card"
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
              </tbody>
            </table>
          )}

          {/* Empty Search State */}
          {!loading && filteredData.length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-600 mb-1">
                No {activeTab} found
              </p>
              <p className="text-xs">
                {searchQuery
                  ? `No items match your search criteria "${searchQuery}"`
                  : `No records in MongoDB yet. Click the Add button above to create one.`}
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
            </div>
          )}
        </div>

      </div>

      {/* 4. FOOTER CONSISTENT WITH ORDERS */}
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

      {/* 5. MODAL: DYNAMIC FOR ACTIVE TAB */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                  {editingItem ? 'Edit ' : 'Add New '}
                  {activeTab === 'banners'
                    ? 'Hero Banner'
                    : activeTab === 'categories'
                    ? 'Shop Category'
                    : 'Masterclass Card'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Changes made here update the live homepage frontend instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* TAB 1: HERO BANNER FORM */}
              {activeTab === 'banners' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        required
                        value={bannerForm.image}
                        onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                        placeholder="e.g. /banner 1.png or ImageKit URL"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={bannerForm.order}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, order: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Heading / Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                        placeholder="e.g. PROFESSIONAL LIGHTING."
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Subheading / Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={bannerForm.subtitle}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, subtitle: e.target.value })
                        }
                        placeholder="e.g. 💡 Studio Grade"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        CTA Button Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={bannerForm.ctaText}
                        onChange={(e) =>
                          setBannerForm({ ...bannerForm, ctaText: e.target.value })
                        }
                        placeholder="e.g. Shop Lighting"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Target Link / Route
                      </label>
                      <input
                        type="text"
                        value={bannerForm.link}
                        onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                        placeholder="/product"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="bannerActiveCheckbox"
                      checked={bannerForm.active}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#DC2626] focus:ring-[#900606]"
                    />
                    <label htmlFor="bannerActiveCheckbox" className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Publish Banner Live (Visible in Homepage Carousel)
                    </label>
                  </div>
                </>
              )}

              {/* TAB 2: SHOP BY CATEGORY FORM */}
              {activeTab === 'categories' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Category Name
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, name: e.target.value })
                        }
                        placeholder="e.g. Studio Microphones"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={categoryForm.order}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, order: Number(e.target.value) })
                        }
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Thumbnail Image URL / Path
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.image}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, image: e.target.value })
                      }
                      placeholder="e.g. /wireless-mic.jpg"
                      className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>🎬</span>
                        <span>Category Video URL / Path (Optional)</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-normal normal-case">MP4, WebM, or video link</span>
                    </label>
                    <input
                      type="text"
                      value={categoryForm.video || ''}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, video: e.target.value })
                      }
                      placeholder="e.g. /category-video.mp4, https://example.com/video.mp4"
                      className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Subtitle / Product Count Badge (Optional)
                      </label>
                      <input
                        type="text"
                        value={categoryForm.itemCount}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, itemCount: e.target.value })
                        }
                        placeholder="e.g. Studio Audio • 8 Products"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Target Link / Route
                      </label>
                      <input
                        type="text"
                        value={categoryForm.link}
                        onChange={(e) =>
                          setCategoryForm({ ...categoryForm, link: e.target.value })
                        }
                        placeholder="/product"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: LEARN & GROW MASTERCLASS FORM */}
              {activeTab === 'masterclasses' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Course / Card Title
                      </label>
                      <input
                        type="text"
                        required
                        value={masterclassForm.title}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, title: e.target.value })
                        }
                        placeholder="e.g. Instagram Mastery"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={masterclassForm.order}
                        onChange={(e) =>
                          setMasterclassForm({
                            ...masterclassForm,
                            order: Number(e.target.value),
                          })
                        }
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Badge / Tag
                      </label>
                      <input
                        type="text"
                        value={masterclassForm.badge}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, badge: e.target.value })
                        }
                        placeholder="e.g. 100% Free"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Icon Emoji
                      </label>
                      <input
                        type="text"
                        value={masterclassForm.icon}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, icon: e.target.value })
                        }
                        placeholder="e.g. 📱, 🎬, ▶️"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Image URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={masterclassForm.image}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, image: e.target.value })
                        }
                        placeholder="Overrides emoji icon"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Description
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={masterclassForm.description}
                      onChange={(e) =>
                        setMasterclassForm({ ...masterclassForm, description: e.target.value })
                      }
                      placeholder="e.g. Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast."
                      className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={masterclassForm.ctaText}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, ctaText: e.target.value })
                        }
                        placeholder="e.g. Explore Bundles"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Target Link / Route
                      </label>
                      <input
                        type="text"
                        value={masterclassForm.ctaLink}
                        onChange={(e) =>
                          setMasterclassForm({ ...masterclassForm, ctaLink: e.target.value })
                        }
                        placeholder="/product"
                        className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="masterclassActiveCheckbox"
                      checked={masterclassForm.active}
                      onChange={(e) =>
                        setMasterclassForm({ ...masterclassForm, active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#DC2626] focus:ring-[#900606]"
                    />
                    <label htmlFor="masterclassActiveCheckbox" className="text-xs font-bold text-neutral-800 cursor-pointer">
                      Publish Card Live (Visible in &quot;Learn. Create. Grow.&quot; section)
                    </label>
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Update Live' : 'Publish Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom In-App Delete Confirmation Modal (Replaces browser window.confirm) */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, id: null, title: '', message: '', isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        message={deleteModal.message}
        isDeleting={deleteModal.isDeleting}
      />

    </div>
  );
}
