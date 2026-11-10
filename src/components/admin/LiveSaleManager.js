'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function LiveSaleManager() {
  const [activeTab, setActiveTab] = useState('creatorDeals'); // 'banners' | 'deals' | 'creatorDeals' | 'categories' | 'faqs'

  // Data states
  const [banners, setBanners] = useState([]);
  const [deals, setDeals] = useState([]);
  const [creatorDeals, setCreatorDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Header Controls matching Home / Products page
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
    section: '',
    isDeleting: false,
  });

  // Form states for each tab
  const [bannerForm, setBannerForm] = useState({
    bannerImageUrl: '',
    displayOrder: 1,
    status: 'LIVE',
  });

  const [dealForm, setDealForm] = useState({
    name: '',
    tag: 'FLASH DEAL',
    subtitle: '',
    price: '',
    mrp: '',
    discountPercent: '',
    stockLeft: 10,
    stockTotal: 50,
    image: '',
    rating: 4.8,
    reviewsCount: 120,
    freeBonus: '',
    dealUrl: '/live-sale',
    order: 1,
    status: 'LIVE',
  });

  const [creatorDealForm, setCreatorDealForm] = useState({
    title: '',
    category: 'STANDS & MOUNTS',
    badge: 'BESTSELLER',
    price: '',
    mrp: '',
    discountText: '',
    stockLeft: 7,
    stockTotal: 20,
    imageUrl: '',
    subtitle: '',
    rating: 4.8,
    reviewsCount: 120,
    displayOrder: 1,
    status: 'LIVE',
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    itemCount: 'Studio Gear',
    image: '',
    discount: 'UP TO 50% OFF',
    startingPrice: '₹999',
    badge: 'HOT DEAL',
    link: '/product',
    order: 1,
    status: 'LIVE',
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    status: 'LIVE',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/live-sale/sections?section=all');
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};
        setBanners(data.banners || []);
        setDeals(data.deals || []);
        setCreatorDeals(data.creatorDeals || []);
        setCategories(data.categories || []);
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      console.error('Failed to load live sale sections:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (item, section) => {
    try {
      const isLive = item.status === 'LIVE' || (item.active !== false && item.status !== 'Draft' && item.status !== 'DRAFT');
      const newStatus = isLive ? (section === 'banners' || section === 'creator-deals' ? 'Draft' : 'DRAFT') : 'LIVE';
      const res = await fetch(`/api/admin/live-sale/sections?section=${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: item._id,
          status: newStatus,
          active: newStatus === 'LIVE',
        }),
      });

      if (res.ok) {
        if (section === 'banners') {
          setBanners((prev) =>
            prev.map((b) => (b._id === item._id ? { ...b, status: newStatus, active: newStatus === 'LIVE' } : b))
          );
        } else if (section === 'deals') {
          setDeals((prev) =>
            prev.map((d) => (d._id === item._id ? { ...d, status: newStatus, active: newStatus === 'LIVE' } : d))
          );
        } else if (section === 'creator-deals') {
          setCreatorDeals((prev) =>
            prev.map((cd) => (cd._id === item._id ? { ...cd, status: newStatus, active: newStatus === 'LIVE' } : cd))
          );
        } else if (section === 'categories') {
          setCategories((prev) =>
            prev.map((c) => (c._id === item._id ? { ...c, status: newStatus, active: newStatus === 'LIVE' } : c))
          );
        } else if (section === 'faqs') {
          setFaqs((prev) =>
            prev.map((f) => (f._id === item._id ? { ...f, status: newStatus, active: newStatus === 'LIVE' } : f))
          );
        }
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingItem(null);
    if (activeTab === 'banners') {
      setBannerForm({
        bannerImageUrl: '',
        displayOrder: banners.length + 1,
        status: 'LIVE',
      });
    } else if (activeTab === 'deals') {
      setDealForm({
        name: '',
        tag: 'FLASH DEAL',
        subtitle: '',
        price: '',
        mrp: '',
        discountPercent: '',
        stockLeft: 10,
        stockTotal: 50,
        image: '',
        rating: 4.8,
        reviewsCount: 120,
        freeBonus: '',
        dealUrl: '/live-sale',
        order: deals.length + 1,
        status: 'LIVE',
      });
    } else if (activeTab === 'creatorDeals') {
      setCreatorDealForm({
        title: '',
        category: 'STANDS & MOUNTS',
        badge: 'BESTSELLER',
        price: '',
        mrp: '',
        discountText: '',
        stockLeft: 7,
        stockTotal: 20,
        imageUrl: '',
        subtitle: '',
        rating: 4.8,
        reviewsCount: 120,
        displayOrder: creatorDeals.length + 1,
        status: 'LIVE',
      });
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name: '',
        itemCount: 'Studio Gear',
        image: '',
        discount: 'UP TO 50% OFF',
        startingPrice: '₹999',
        badge: 'HOT DEAL',
        link: '/product',
        order: categories.length + 1,
        status: 'LIVE',
      });
    } else {
      setFaqForm({
        question: '',
        answer: '',
        category: 'General',
        order: faqs.length + 1,
        status: 'LIVE',
      });
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'banners') {
      setBannerForm({
        bannerImageUrl: item.bannerImage || item.bannerImageUrl || item.image || '',
        displayOrder: item.displayOrder !== undefined ? item.displayOrder : (item.order || 1),
        status: item.status || (item.active !== false ? 'LIVE' : 'Draft'),
      });
    } else if (activeTab === 'deals') {
      setDealForm({
        name: item.name || item.title || '',
        tag: item.tag || item.badge || 'FLASH DEAL',
        subtitle: item.subtitle || '',
        price: item.price !== undefined ? item.price : '',
        mrp: item.mrp !== undefined ? item.mrp : '',
        discountPercent: item.discountPercent !== undefined ? item.discountPercent : '',
        stockLeft: item.stockLeft !== undefined ? item.stockLeft : 10,
        stockTotal: item.stockTotal !== undefined ? item.stockTotal : 50,
        image: item.image || item.imageUrl || '',
        rating: item.rating || 4.8,
        reviewsCount: item.reviewsCount || 120,
        freeBonus: item.freeBonus || '',
        dealUrl: item.dealUrl || '/live-sale',
        order: item.order !== undefined ? item.order : (item.displayOrder || 1),
        status: item.status || (item.active !== false ? 'LIVE' : 'DRAFT'),
      });
    } else if (activeTab === 'creatorDeals') {
      setCreatorDealForm({
        title: item.title || item.name || '',
        category: item.category || 'STANDS & MOUNTS',
        badge: item.badge || item.tag || 'BESTSELLER',
        price: item.price !== undefined ? item.price : '',
        mrp: item.mrp !== undefined ? item.mrp : '',
        discountText: item.discountText || '',
        stockLeft: item.stockLeft !== undefined ? item.stockLeft : 7,
        stockTotal: item.stockTotal !== undefined ? item.stockTotal : 20,
        imageUrl: item.imageUrl || item.image || '',
        subtitle: item.subtitle || '',
        rating: item.rating || 4.8,
        reviewsCount: item.reviewsCount || 120,
        displayOrder: item.displayOrder !== undefined ? item.displayOrder : (item.order || 1),
        status: item.status || (item.active !== false ? 'LIVE' : 'Draft'),
      });
    } else if (activeTab === 'categories') {
      setCategoryForm({
        name: item.name || '',
        itemCount: item.itemCount || 'Studio Gear',
        image: item.image || '',
        discount: item.discount || 'UP TO 50% OFF',
        startingPrice: item.startingPrice || '₹999',
        badge: item.badge || 'HOT DEAL',
        link: item.link || '/product',
        order: item.order || 1,
        status: item.status || (item.active !== false ? 'LIVE' : 'DRAFT'),
      });
    } else {
      setFaqForm({
        question: item.question || '',
        answer: item.answer || '',
        category: item.category || 'General',
        order: item.order || 1,
        status: item.status || (item.active !== false ? 'LIVE' : 'DRAFT'),
      });
    }
    setIsModalOpen(true);
  };

  // Submit Modal Form (Add or Edit)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isEditing = !!editingItem;
      const method = isEditing ? 'PUT' : 'POST';
      let payload = {};

      const targetSection = activeTab === 'creatorDeals' ? 'creator-deals' : activeTab;

      if (activeTab === 'banners') {
        const imgUrl = (bannerForm.bannerImageUrl || '').trim();
        const dispOrder = Number(bannerForm.displayOrder) || 1;
        payload = {
          bannerImage: imgUrl,
          bannerImageUrl: imgUrl,
          image: imgUrl,
          displayOrder: dispOrder,
          order: dispOrder,
          status: bannerForm.status,
          active: bannerForm.status === 'LIVE',
        };
      } else if (activeTab === 'deals') {
        const priceNum = Number(dealForm.price) || 0;
        const mrpNum = Number(dealForm.mrp) || priceNum;
        const discountPercent = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
        payload = {
          name: dealForm.name.trim(),
          title: dealForm.name.trim(),
          tag: dealForm.tag.trim(),
          badge: dealForm.tag.trim(),
          subtitle: dealForm.subtitle.trim(),
          price: priceNum,
          mrp: mrpNum,
          discountPercent,
          savings: Math.max(0, mrpNum - priceNum),
          stockLeft: Number(dealForm.stockLeft) || 10,
          stockTotal: Number(dealForm.stockTotal) || 50,
          image: (dealForm.image || '').trim(),
          imageUrl: (dealForm.image || '').trim(),
          rating: Number(dealForm.rating) || 4.8,
          reviewsCount: Number(dealForm.reviewsCount) || 120,
          freeBonus: dealForm.freeBonus.trim(),
          dealUrl: dealForm.dealUrl.trim() || '/live-sale',
          order: Number(dealForm.order) || 1,
          displayOrder: Number(dealForm.order) || 1,
          status: dealForm.status,
          active: dealForm.status === 'LIVE',
        };
      } else if (activeTab === 'creatorDeals') {
        const priceNum = Number(creatorDealForm.price) || 0;
        const mrpNum = Number(creatorDealForm.mrp) || priceNum;
        const discountPercent = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
        const discountText =
          creatorDealForm.discountText && creatorDealForm.discountText.trim() !== ''
            ? creatorDealForm.discountText.trim()
            : discountPercent > 0
            ? `${discountPercent}% OFF`
            : '';
        payload = {
          title: creatorDealForm.title.trim(),
          name: creatorDealForm.title.trim(),
          category: (creatorDealForm.category || 'CREATOR GEAR').trim(),
          badge: (creatorDealForm.badge || 'BESTSELLER').trim(),
          price: priceNum,
          mrp: mrpNum,
          discountText,
          discountPercent,
          savings: Math.max(0, mrpNum - priceNum),
          stockLeft: Number(creatorDealForm.stockLeft) || 7,
          stockTotal: Number(creatorDealForm.stockTotal) || 20,
          imageUrl: (creatorDealForm.imageUrl || '').trim(),
          image: (creatorDealForm.imageUrl || '').trim(),
          subtitle: creatorDealForm.subtitle.trim(),
          rating: Number(creatorDealForm.rating) || 4.8,
          reviewsCount: Number(creatorDealForm.reviewsCount) || 120,
          displayOrder: Number(creatorDealForm.displayOrder) || 1,
          order: Number(creatorDealForm.displayOrder) || 1,
          status: creatorDealForm.status,
          active: creatorDealForm.status === 'LIVE',
        };
      } else if (activeTab === 'categories') {
        payload = { ...categoryForm };
      } else {
        payload = { ...faqForm };
      }

      if (isEditing) {
        payload._id = editingItem._id;
      }

      const res = await fetch(`/api/admin/live-sale/sections?section=${targetSection}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        await fetchAllData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to save item');
      }
    } catch (err) {
      console.error('Failed to submit form:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Request Delete confirmation
  const requestDelete = (id, title, section) => {
    setDeleteModal({
      isOpen: true,
      id,
      title: `Delete ${title || 'Item'}`,
      message: `Are you sure you want to permanently delete "${title}" from the live sale? This action will remove it immediately from MongoDB Compass.`,
      section,
      isDeleting: false,
    });
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteModal.id || !deleteModal.section) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const res = await fetch(
        `/api/admin/live-sale/sections?section=${deleteModal.section}&id=${deleteModal.id}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        setDeleteModal({ isOpen: false, id: null, title: '', message: '', section: '', isDeleting: false });
        await fetchAllData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to delete item');
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Export Report to CSV
  const handleExportReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = '';

    if (activeTab === 'banners') {
      csvContent += 'Display Order,Banner Image URL,Status\n';
      csvContent += banners
        .map(
          (b) =>
            `"${b.displayOrder || b.order || 1}","${(b.bannerImage || b.bannerImageUrl || b.image || '').replace(
              /"/g,
              '""'
            )}","${b.status || 'LIVE'}"`
        )
        .join('\n');
      filename = `CreatorsKit_LiveSale_Banners_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else if (activeTab === 'deals') {
      csvContent += 'Order,Name,Tag,Sale Price,MRP,Discount,Stock Left,Stock Total,Rating,Status\n';
      csvContent += deals
        .map(
          (d) =>
            `"${d.order || d.displayOrder || 0}","${(d.name || d.title || '').replace(/"/g, '""')}","${(d.tag || '').replace(
              /"/g,
              '""'
            )}","${d.price}","${d.mrp}","${d.discountPercent}%","${d.stockLeft}","${d.stockTotal}","${
              d.rating || 4.8
            }","${d.status || 'LIVE'}"`
        )
        .join('\n');
      filename = `CreatorsKit_LiveSale_FlashDeals_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else if (activeTab === 'creatorDeals') {
      csvContent += 'Order,Title,Category,Badge,Price,MRP,Discount,Stock Left,Stock Total,Rating,Status\n';
      csvContent += creatorDeals
        .map(
          (cd) =>
            `"${cd.displayOrder || cd.order || 0}","${(cd.title || cd.name || '').replace(/"/g, '""')}","${(
              cd.category || ''
            ).replace(/"/g, '""')}","${(cd.badge || '').replace(/"/g, '""')}","${cd.price}","${cd.mrp}","${
              cd.discountText || ''
            }","${cd.stockLeft}","${cd.stockTotal}","${cd.rating || 4.8}","${cd.status || 'LIVE'}"`
        )
        .join('\n');
      filename = `CreatorsKit_LiveSale_CreatorDeals_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else if (activeTab === 'categories') {
      csvContent += 'Order,Name,Item Count,Discount,Starting Price,Badge,Link,Status\n';
      csvContent += categories
        .map(
          (c) =>
            `"${c.order || 0}","${(c.name || '').replace(/"/g, '""')}","${(c.itemCount || '').replace(
              /"/g,
              '""'
            )}","${(c.discount || '').replace(/"/g, '""')}","${(c.startingPrice || '').replace(
              /"/g,
              '""'
            )}","${(c.badge || '').replace(/"/g, '""')}","${(c.link || '').replace(/"/g, '""')}","${
              c.status || 'LIVE'
            }"`
        )
        .join('\n');
      filename = `CreatorsKit_LiveSale_Categories_${dateRange.replace(/\s+/g, '_')}.csv`;
    } else {
      csvContent += 'Order,Category,Question,Answer,Status\n';
      csvContent += faqs
        .map(
          (f) =>
            `"${f.order || 0}","${(f.category || 'General').replace(/"/g, '""')}","${(
              f.question || ''
            ).replace(/"/g, '""')}","${(f.answer || '').replace(/"/g, '""')}","${f.status || 'LIVE'}"`
        )
        .join('\n');
      filename = `CreatorsKit_LiveSale_FAQs_${dateRange.replace(/\s+/g, '_')}.csv`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items by search query
  const getFilteredData = () => {
    const q = searchQuery.toLowerCase().trim();
    if (activeTab === 'banners') {
      if (!q) return banners;
      return banners.filter(
        (b) =>
          (b.bannerImage || b.bannerImageUrl || b.image)?.toLowerCase().includes(q) ||
          b.status?.toLowerCase().includes(q) ||
          String(b.displayOrder || b.order || '').includes(q)
      );
    }
    if (activeTab === 'deals') {
      if (!q) return deals;
      return deals.filter(
        (d) =>
          (d.name || d.title)?.toLowerCase().includes(q) ||
          d.tag?.toLowerCase().includes(q) ||
          d.subtitle?.toLowerCase().includes(q) ||
          d.freeBonus?.toLowerCase().includes(q)
      );
    }
    if (activeTab === 'creatorDeals') {
      if (!q) return creatorDeals;
      return creatorDeals.filter(
        (cd) =>
          (cd.title || cd.name)?.toLowerCase().includes(q) ||
          cd.category?.toLowerCase().includes(q) ||
          cd.badge?.toLowerCase().includes(q) ||
          cd.subtitle?.toLowerCase().includes(q) ||
          String(cd.price || '').includes(q)
      );
    }
    if (activeTab === 'categories') {
      if (!q) return categories;
      return categories.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.itemCount?.toLowerCase().includes(q) ||
          c.badge?.toLowerCase().includes(q) ||
          c.link?.toLowerCase().includes(q)
      );
    }
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
    );
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      {/* 1. TOP HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Live Sale &amp; Flash Deals
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Dynamically manage Hero Banners, Flash Deals, Creator Deals, Category Navigation, and FAQs live on the website.
          </p>
        </div>

        {/* Right Controls: Active Counter, Date Picker, Export Report & Add Button */}
        <div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">
          {/* Active Section Count Badge */}
          <div className="bg-white border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {activeTab === 'banners'
                ? `${banners.length} Banners`
                : activeTab === 'deals'
                ? `${deals.length} Flash Deals`
                : activeTab === 'creatorDeals'
                ? `${creatorDeals.length} Creator Deals`
                : activeTab === 'categories'
                ? `${categories.length} Categories`
                : `${faqs.length} FAQs`}
            </span>
          </div>

          {/* Date Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="bg-white border border-neutral-200/90 hover:border-neutral-300 text-neutral-700 text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{dateRange}</span>
            </button>

            {isDatePickerOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 z-30 text-xs font-medium">
                {['Today', 'Last 7 Days', 'Oct 1 – Oct 23, 2026', 'This Month', 'All Time'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setIsDatePickerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                      dateRange === range
                        ? 'bg-neutral-100 text-neutral-900 font-bold'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={handleExportReport}
            className="bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export report</span>
          </button>

          {/* Dynamic + Add Item Primary Button */}
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
                : activeTab === 'deals'
                ? '+ Add Flash Deal'
                : activeTab === 'creatorDeals'
                ? '+ Add Creator Deal'
                : activeTab === 'categories'
                ? '+ Add Category'
                : '+ Add FAQ'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. SECTION SELECTION TABS */}
      <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl w-fit border border-neutral-200/80 flex-wrap">
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
            setActiveTab('deals');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'deals'
              ? 'bg-white text-[#DC2626] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Flash Deals</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {deals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('creatorDeals');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'creatorDeals'
              ? 'bg-white text-[#900606] shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Creator Deals</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {creatorDeals.length}
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
          <span>Category Cards</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {categories.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('faqs');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'bg-white text-neutral-900 shadow-2xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>FAQs</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 font-bold">
            {faqs.length}
          </span>
        </button>
      </div>

      {/* 3. MAIN CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Full-width Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'banners'
                ? 'Search banners by image URL, status or order...'
                : activeTab === 'deals'
                ? 'Search flash deals by name, tag, or subtitle...'
                : activeTab === 'creatorDeals'
                ? 'Search creator deals by title, category, badge, or price...'
                : activeTab === 'categories'
                ? 'Search categories by name, badge, or link...'
                : 'Search FAQs by question, answer, or category...'
            }
            className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs font-normal outline-none focus:border-[#900606] transition-colors placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* DATA TABLES FOR EACH TAB */}
        <div className="overflow-x-auto">
          {/* TAB 1: HERO BANNERS TABLE */}
          {activeTab === 'banners' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[10%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[30%]">BANNER PREVIEW</th>
                  <th className="py-3.5 px-3 font-bold w-[38%]">IMAGE URL / CDN</th>
                  <th className="py-3.5 px-3 font-bold w-[10%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[12%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-32 h-14 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-16 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-400">
                      No banners found. Click &quot;+ Add Banner&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((b) => (
                    <tr key={b._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {b.displayOrder || b.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="w-32 h-14 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={getImageUrl(b.bannerImage || b.bannerImageUrl || b.image)}
                            alt="Hero Banner"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/img-kit8.png';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="font-mono text-[11px] text-neutral-800 break-all select-all font-semibold">
                          {b.bannerImage || b.bannerImageUrl || b.image}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-medium mt-0.5">
                          Full-bleed hero banner graphic
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(b, 'banners')}
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                            b.status === 'LIVE' || (b.active !== false && b.status !== 'Draft' && b.status !== 'DRAFT')
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {b.status === 'LIVE' || (b.active !== false && b.status !== 'Draft' && b.status !== 'DRAFT') ? 'LIVE' : 'Draft'}
                        </button>
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
                            onClick={() => requestDelete(b._id, `Hero Banner #${b.displayOrder || b.order || 1}`, 'banners')}
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

          {/* TAB 2: FLASH DEALS TABLE */}
          {activeTab === 'deals' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[34%]">PRODUCT / ITEM</th>
                  <th className="py-3.5 px-3 font-bold w-[22%]">PRICING &amp; DISCOUNT</th>
                  <th className="py-3.5 px-3 font-bold w-[16%]">STOCK LEVEL</th>
                  <th className="py-3.5 px-3 font-bold w-[10%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-12 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-24 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-14 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No flash deals found. Click &quot;+ Add Flash Deal&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((d) => {
                    const priceVal = Number(d.price) || 0;
                    const mrpVal = Number(d.mrp) || priceVal;
                    const discPercent = d.discountPercent || (mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0);
                    const stockVal = Number(d.stockLeft) || 10;
                    const stockTot = Number(d.stockTotal) || 50;
                    const stockBarPercent = Math.min(100, Math.max(15, Math.round((stockVal / stockTot) * 100)));

                    return (
                      <tr key={d._id} className="hover:bg-neutral-50/70 transition-colors group">
                        <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                            {d.displayOrder || d.order || 0}
                          </span>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                              <img
                                src={getImageUrl(d.image || d.imageUrl)}
                                alt={d.name || d.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/wireless-mic1.png';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors line-clamp-1">
                                  {d.name || d.title}
                                </span>
                                {(d.tag || d.badge) && (
                                  <span className="inline-block text-[9px] font-extrabold text-[#DC2626] bg-red-50 border border-red-100 px-1.5 py-0.2 rounded uppercase">
                                    {d.tag || d.badge}
                                  </span>
                                )}
                              </div>
                              {d.subtitle && (
                                <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                                  {d.subtitle}
                                </div>
                              )}
                              {d.freeBonus && (
                                <div className="text-[10px] text-emerald-700 font-semibold line-clamp-1 mt-0.5">
                                  🎁 {d.freeBonus}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-neutral-900 text-sm">
                              ₹{priceVal.toLocaleString('en-IN')}
                            </span>
                            {mrpVal > priceVal && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ₹{mrpVal.toLocaleString('en-IN')}
                              </span>
                            )}
                            {discPercent > 0 && (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                -{discPercent}%
                              </span>
                            )}
                          </div>
                          {mrpVal > priceVal && (
                            <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">
                              Save ₹{(mrpVal - priceVal).toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="space-y-1 max-w-[140px]">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                stockVal <= 5
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : stockVal <= 15
                                  ? 'bg-[#FEF7E7] text-[#D97706]'
                                  : 'bg-[#EAFBF3] text-[#129A64]'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>Only {stockVal} left!</span>
                            </span>
                            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all"
                                style={{ width: `${stockBarPercent}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {stockVal} in stock of {stockTot}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(d, 'deals')}
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                              d.status === 'LIVE' || (d.active !== false && d.status !== 'Draft' && d.status !== 'DRAFT')
                                ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {d.status === 'LIVE' || (d.active !== false && d.status !== 'Draft' && d.status !== 'DRAFT') ? 'LIVE' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(d)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Edit Deal"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(d._id, d.name || d.title || 'Flash Deal', 'deals')}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Deal"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: FESTIVE CREATOR DEALS TABLE (NEW) */}
          {activeTab === 'creatorDeals' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[34%]">PRODUCT / ITEM</th>
                  <th className="py-3.5 px-3 font-bold w-[22%]">PRICING &amp; DISCOUNT</th>
                  <th className="py-3.5 px-3 font-bold w-[16%]">STOCK LEVEL</th>
                  <th className="py-3.5 px-3 font-bold w-[10%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-12 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-24 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-14 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No creator deals found. Click &quot;+ Add Creator Deal&quot; above to add one.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((cd) => {
                    const priceVal = Number(cd.price) || 0;
                    const mrpVal = Number(cd.mrp) || priceVal;
                    const discPercent = cd.discountPercent || (mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0);
                    const stockVal = Number(cd.stockLeft) || 7;
                    const stockTot = Number(cd.stockTotal) || 20;
                    const stockBarPercent = Math.min(100, Math.max(15, Math.round((stockVal / stockTot) * 100)));

                    return (
                      <tr key={cd._id} className="hover:bg-neutral-50/70 transition-colors group">
                        <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                            {cd.displayOrder || cd.order || 0}
                          </span>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                              <img
                                src={getImageUrl(cd.imageUrl || cd.image)}
                                alt={cd.title || cd.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/tripod1.png';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors line-clamp-1">
                                  {cd.title || cd.name}
                                </span>
                                {(cd.badge || cd.tag) && (
                                  <span className="inline-block text-[9px] font-extrabold text-[#900606] bg-amber-50 border border-amber-200/70 px-1.5 py-0.2 rounded uppercase tracking-wider">
                                    {cd.badge || cd.tag}
                                  </span>
                                )}
                                {cd.category && (
                                  <span className="inline-block text-[9px] font-bold text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded uppercase">
                                    {cd.category}
                                  </span>
                                )}
                              </div>
                              {cd.subtitle && (
                                <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                                  {cd.subtitle}
                                </div>
                              )}
                              <div className="text-[10px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
                                <span>★ {Number(cd.rating || 4.8).toFixed(1)}</span>
                                <span className="text-neutral-400 font-normal">({cd.reviewsCount || 120} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-neutral-900 text-sm">
                              ₹{priceVal.toLocaleString('en-IN')}
                            </span>
                            {mrpVal > priceVal && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ₹{mrpVal.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {cd.discountText || `${discPercent}% OFF`}
                            </span>
                          </div>
                          {mrpVal > priceVal && (
                            <div className="text-[10px] text-neutral-400 mt-0.5 font-medium">
                              Save ₹{(mrpVal - priceVal).toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <div className="space-y-1 max-w-[140px]">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                stockVal <= 4
                                  ? 'bg-[#FEE2E2] text-[#DC2626]'
                                  : stockVal <= 8
                                  ? 'bg-[#FEF7E7] text-[#D97706]'
                                  : 'bg-[#EAFBF3] text-[#129A64]'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>Only {stockVal} left in stock!</span>
                            </span>
                            <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 h-full rounded-full transition-all"
                                style={{ width: `${stockBarPercent}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {stockVal} left of {stockTot}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 align-middle">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(cd, 'creator-deals')}
                            className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                              cd.status === 'LIVE' || (cd.active !== false && cd.status !== 'Draft' && cd.status !== 'DRAFT')
                                ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                            }`}
                            title="Click to toggle status"
                          >
                            {cd.status === 'LIVE' || (cd.active !== false && cd.status !== 'Draft' && cd.status !== 'DRAFT') ? 'LIVE' : 'Draft'}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(cd)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Edit Deal"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(cd._id, cd.title || cd.name || 'Creator Deal', 'creator-deals')}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Deal"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: CATEGORY CARDS TABLE */}
          {activeTab === 'categories' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[12%]">PREVIEW</th>
                  <th className="py-3.5 px-3 font-bold w-[30%]">CATEGORY &amp; ITEM COUNT</th>
                  <th className="py-3.5 px-3 font-bold w-[28%]">DISCOUNT &amp; STARTING PRICE</th>
                  <th className="py-3.5 px-3 font-bold w-[10%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[12%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-12 bg-neutral-100 rounded-lg"></div></td>
                      <td className="py-4 px-3"><div className="w-36 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-24 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-14 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No categories found. Click &quot;+ Add Category&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((c) => (
                    <tr key={c._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {c.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                          <img
                            src={getImageUrl(c.image)}
                            alt={c.name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/tripod.jpg';
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors">
                            {c.name}
                          </span>
                          {c.badge && (
                            <span className="inline-block text-[10px] font-extrabold text-[#D97706] bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {c.itemCount || 'Studio Gear'}
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
                            {c.discount}
                          </span>
                          <span className="text-neutral-500 text-[11px]">
                            From <span className="font-bold text-neutral-900">{c.startingPrice}</span>
                          </span>
                        </div>
                        {c.link && (
                          <div className="text-[10px] text-neutral-400 font-mono mt-0.5 truncate max-w-[200px]">
                            {c.link}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(c, 'categories')}
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                            c.status === 'LIVE' || (c.active !== false && c.status !== 'DRAFT')
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          {c.status === 'LIVE' || (c.active !== false && c.status !== 'DRAFT') ? 'LIVE' : 'DRAFT'}
                        </button>
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
                            onClick={() => requestDelete(c._id, c.name || 'Category', 'categories')}
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

          {/* TAB 5: FAQS TABLE */}
          {activeTab === 'faqs' && (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[8%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[34%]">QUESTION</th>
                  <th className="py-3.5 px-3 font-bold w-[14%]">CATEGORY</th>
                  <th className="py-3.5 px-3 font-bold w-[32%]">ANSWER PREVIEW</th>
                  <th className="py-3.5 px-3 font-bold w-[8%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
                {loading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-48 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-20 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-56 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                      <td className="py-4 px-3 text-right"><div className="w-14 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No FAQs found. Click &quot;+ Add FAQ&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((f) => (
                    <tr key={f._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {f.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900 group-hover:text-[#900606] transition-colors">
                        {f.question}
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200/60">
                          {f.category || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle text-neutral-500 line-clamp-2 max-w-sm">
                        {f.answer}
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(f, 'faqs')}
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                            f.status === 'LIVE' || (f.active !== false && f.status !== 'DRAFT')
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200 hover:bg-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                          }`}
                        >
                          {f.status === 'LIVE' || (f.active !== false && f.status !== 'DRAFT') ? 'LIVE' : 'DRAFT'}
                        </button>
                      </td>
                      <td className="py-4 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(f)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Edit FAQ"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDelete(f._id, f.question || 'FAQ', 'faqs')}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete FAQ"
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
        </div>
      </div>

      {/* 4. ADD / EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
              <h2 className="text-lg font-bold text-neutral-900">
                {editingItem ? 'Edit Item' : '+ Add New Item'} -{' '}
                {activeTab === 'banners'
                  ? 'Hero Banner'
                  : activeTab === 'deals'
                  ? 'Flash Deal'
                  : activeTab === 'creatorDeals'
                  ? 'Creator Deal'
                  : activeTab === 'categories'
                  ? 'Category Card'
                  : 'FAQ'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-semibold">
              {/* TAB 1: HERO BANNER FORM */}
              {activeTab === 'banners' && (
                <>
                  <div>
                    <label className="block text-neutral-700 mb-1">Banner Image URL *</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.bannerImageUrl}
                      onChange={(e) => setBannerForm({ ...bannerForm, bannerImageUrl: e.target.value })}
                      placeholder="/img-kit8.png or https://ik.imagekit.io/..."
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                    <p className="text-[10px] text-neutral-400 font-normal mt-1">
                      Direct image path from /public folder or external CDN URL.
                    </p>
                  </div>

                  {bannerForm.bannerImageUrl && (
                    <div className="rounded-xl border border-neutral-200 p-2 bg-neutral-50 flex items-center justify-center">
                      <img
                        src={getImageUrl(bannerForm.bannerImageUrl)}
                        alt="Preview"
                        className="max-h-28 rounded-lg object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/img-kit8.png';
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        min="1"
                        value={bannerForm.displayOrder}
                        onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Status</label>
                      <select
                        value={bannerForm.status}
                        onChange={(e) => setBannerForm({ ...bannerForm, status: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                      >
                        <option value="LIVE">LIVE (Visible)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: FLASH DEAL FORM */}
              {activeTab === 'deals' && (
                <>
                  <div>
                    <label className="block text-neutral-700 mb-1">Deal Name *</label>
                    <input
                      type="text"
                      required
                      value={dealForm.name}
                      onChange={(e) => setDealForm({ ...dealForm, name: e.target.value })}
                      placeholder="e.g. Wireless Creator Mic (Dual Channel)"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Tag / Badge</label>
                      <input
                        type="text"
                        value={dealForm.tag}
                        onChange={(e) => setDealForm({ ...dealForm, tag: e.target.value })}
                        placeholder="e.g. FLASH DEAL, DEAL OF THE DAY"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={dealForm.image}
                        onChange={(e) => setDealForm({ ...dealForm, image: e.target.value })}
                        placeholder="/wireless-mic1.png"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Subtitle / Highlights</label>
                    <input
                      type="text"
                      value={dealForm.subtitle}
                      onChange={(e) => setDealForm({ ...dealForm, subtitle: e.target.value })}
                      placeholder="e.g. Crystal clear 48kHz audio with noise reduction"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Sale Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={dealForm.price}
                        onChange={(e) => setDealForm({ ...dealForm, price: e.target.value })}
                        placeholder="799"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Original MRP (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={dealForm.mrp}
                        onChange={(e) => setDealForm({ ...dealForm, mrp: e.target.value })}
                        placeholder="1499"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Stock Left</label>
                      <input
                        type="number"
                        min="0"
                        value={dealForm.stockLeft}
                        onChange={(e) => setDealForm({ ...dealForm, stockLeft: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Stock Total</label>
                      <input
                        type="number"
                        min="1"
                        value={dealForm.stockTotal}
                        onChange={(e) => setDealForm({ ...dealForm, stockTotal: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={dealForm.order}
                        onChange={(e) => setDealForm({ ...dealForm, order: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Status</label>
                      <select
                        value={dealForm.status}
                        onChange={(e) => setDealForm({ ...dealForm, status: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                      >
                        <option value="LIVE">LIVE (Visible)</option>
                        <option value="DRAFT">DRAFT (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: FESTIVE CREATOR DEAL FORM (NEW) */}
              {activeTab === 'creatorDeals' && (
                <>
                  <div>
                    <label className="block text-neutral-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={creatorDealForm.title}
                      onChange={(e) => setCreatorDealForm({ ...creatorDealForm, title: e.target.value })}
                      placeholder="e.g. Wireless Studio Mic"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Category</label>
                      <select
                        value={creatorDealForm.category}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, category: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                      >
                        <option value="STANDS & MOUNTS">STANDS & MOUNTS</option>
                        <option value="AUDIO">AUDIO</option>
                        <option value="ACCESSORIES">ACCESSORIES</option>
                        <option value="STUDIO LIGHTING">STUDIO LIGHTING</option>
                        <option value="CREATOR GEAR">CREATOR GEAR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Badge / Ribbon Tag</label>
                      <select
                        value={creatorDealForm.badge}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, badge: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                      >
                        <option value="BESTSELLER">BESTSELLER</option>
                        <option value="TRENDING">TRENDING</option>
                        <option value="HOT DEAL">HOT DEAL</option>
                        <option value="PRO LIGHTING">PRO LIGHTING</option>
                        <option value="PRO AUDIO">PRO AUDIO</option>
                        <option value="BEST STABILITY">BEST STABILITY</option>
                        <option value="MEGA SAVER">MEGA SAVER</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Product Image URL *</label>
                    <input
                      type="text"
                      required
                      value={creatorDealForm.imageUrl}
                      onChange={(e) => setCreatorDealForm({ ...creatorDealForm, imageUrl: e.target.value })}
                      placeholder="/tripod1.png or https://ik.imagekit.io/..."
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>

                  {creatorDealForm.imageUrl && (
                    <div className="rounded-xl border border-neutral-200 p-2 bg-neutral-50 flex items-center justify-center">
                      <img
                        src={getImageUrl(creatorDealForm.imageUrl)}
                        alt="Preview"
                        className="max-h-24 rounded-lg object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/tripod1.png';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-700 mb-1">Subtitle / Key Features</label>
                    <input
                      type="text"
                      value={creatorDealForm.subtitle}
                      onChange={(e) => setCreatorDealForm({ ...creatorDealForm, subtitle: e.target.value })}
                      placeholder="e.g. Heavy-duty, lightweight aluminum tripod"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Sale Price (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={creatorDealForm.price}
                        onChange={(e) => {
                          const val = e.target.value;
                          const p = Number(val);
                          const m = Number(creatorDealForm.mrp);
                          const disc = m > p ? `${Math.round(((m - p) / m) * 100)}% OFF` : '';
                          setCreatorDealForm({ ...creatorDealForm, price: val, discountText: disc });
                        }}
                        placeholder="999"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Original MRP (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={creatorDealForm.mrp}
                        onChange={(e) => {
                          const val = e.target.value;
                          const m = Number(val);
                          const p = Number(creatorDealForm.price);
                          const disc = m > p ? `${Math.round(((m - p) / m) * 100)}% OFF` : '';
                          setCreatorDealForm({ ...creatorDealForm, mrp: val, discountText: disc });
                        }}
                        placeholder="1299"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Discount Tag Text</label>
                      <input
                        type="text"
                        value={creatorDealForm.discountText}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, discountText: e.target.value })}
                        placeholder="e.g. 23% OFF"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Stock Left (Urgency)</label>
                      <input
                        type="number"
                        min="1"
                        value={creatorDealForm.stockLeft}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, stockLeft: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        min="1"
                        value={creatorDealForm.displayOrder}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, displayOrder: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Status</label>
                      <select
                        value={creatorDealForm.status}
                        onChange={(e) => setCreatorDealForm({ ...creatorDealForm, status: e.target.value })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                      >
                        <option value="LIVE">LIVE (Visible on Website)</option>
                        <option value="Draft">Draft (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 4: CATEGORY FORM */}
              {activeTab === 'categories' && (
                <>
                  <div>
                    <label className="block text-neutral-700 mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. Microphones"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Sub-label / Item Count</label>
                      <input
                        type="text"
                        value={categoryForm.itemCount}
                        onChange={(e) => setCategoryForm({ ...categoryForm, itemCount: e.target.value })}
                        placeholder="e.g. Wireless Audio"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Badge</label>
                      <input
                        type="text"
                        value={categoryForm.badge}
                        onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                        placeholder="e.g. HOT DEAL, BESTSELLER"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Image URL *</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      placeholder="/wireless-mic.jpg"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Discount Tag</label>
                      <input
                        type="text"
                        value={categoryForm.discount}
                        onChange={(e) => setCategoryForm({ ...categoryForm, discount: e.target.value })}
                        placeholder="e.g. UP TO 65% OFF"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Starting Price</label>
                      <input
                        type="text"
                        value={categoryForm.startingPrice}
                        onChange={(e) => setCategoryForm({ ...categoryForm, startingPrice: e.target.value })}
                        placeholder="e.g. ₹799"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Target Link</label>
                      <input
                        type="text"
                        value={categoryForm.link}
                        onChange={(e) => setCategoryForm({ ...categoryForm, link: e.target.value })}
                        placeholder="/product"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={categoryForm.order}
                        onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Status</label>
                    <select
                      value={categoryForm.status}
                      onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                    >
                      <option value="LIVE">LIVE (Visible)</option>
                      <option value="DRAFT">DRAFT (Hidden)</option>
                    </select>
                  </div>
                </>
              )}

              {/* TAB 5: FAQ FORM */}
              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-neutral-700 mb-1">Question *</label>
                    <input
                      type="text"
                      required
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      placeholder="e.g. Are Creators Kit gear compatible with smartphones & DSLRs?"
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Answer *</label>
                    <textarea
                      required
                      rows={4}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      placeholder="Enter detailed answer..."
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        placeholder="e.g. Compatibility, Shipping"
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                        className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Status</label>
                    <select
                      value={faqForm.status}
                      onChange={(e) => setFaqForm({ ...faqForm, status: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                    >
                      <option value="LIVE">LIVE (Visible)</option>
                      <option value="DRAFT">DRAFT (Hidden)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving to Database...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, title: '', message: '', section: '', isDeleting: false })}
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        message={deleteModal.message}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
}
