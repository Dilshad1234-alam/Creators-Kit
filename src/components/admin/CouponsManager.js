'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Edit2,
  Trash2,
  Plus,
  Tag,
  Search,
  Check,
  X,
  Globe,
  Package,
  Boxes,
  Sparkles,
  Percent,
  Calendar,
  AlertCircle,
  Filter,
} from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Table filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Modal product search
  const [productSearch, setProductSearch] = useState('');
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    coupon: null,
    isDeleting: false,
  });

  const initialFormState = {
    code: '',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountAmount: '',
    expiryDate: '',
    appliesTo: 'ALL', // 'ALL' | 'PRODUCTS' | 'BUNDLES' | 'THUMBNAIL_BUNDLES' | 'CATEGORY'
    applicableProducts: [],
    applicableCategories: [],
    applyToAllBundles: true, // for BUNDLES scope
    applyToAllThumbnailBundles: true, // for THUMBNAIL_BUNDLES scope
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  // Segregate products into individual, creator bundles, thumbnail bundles, and distinct categories
  const individualProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.productType === 'bundle' || p.isBundle === true) return false;
      if (p.productType === 'thumbnail-bundle') return false;
      const cat = String(p.category || '').toLowerCase();
      if (cat.includes('bundle')) return false;
      return true;
    });
  }, [products]);

  const creatorBundles = useMemo(() => {
    return products.filter((p) => {
      if (p.productType === 'thumbnail-bundle') return false;
      if (p.productType === 'bundle' || p.isBundle === true) return true;
      const cat = String(p.category || '').toLowerCase();
      return cat.includes('bundle');
    });
  }, [products]);

  const thumbnailBundles = useMemo(() => {
    return products.filter((p) => p.productType === 'thumbnail-bundle');
  }, [products]);

  const availableCategories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category && typeof p.category === 'string') {
        const trimmed = p.category.trim();
        if (trimmed) set.add(trimmed);
      }
    });
    // Ensure standard categories exist in options
    ['Lighting', 'Audio', 'Accessories', 'Creator bundles'].forEach((c) => set.add(c));
    return Array.from(set);
  }, [products]);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData(initialFormState);
    setFormError('');
    setProductSearch('');
    setCustomCategoryInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    let appliesTo = c.appliesTo;
    let applicableProducts = Array.isArray(c.applicableProducts) ? [...c.applicableProducts] : [];
    let applicableCategories = Array.isArray(c.applicableCategories) ? [...c.applicableCategories] : [];

    // Support legacy coupons
    if (!appliesTo) {
      if (c.applicableProduct && c.applicableProduct !== 'ALL') {
        appliesTo = 'PRODUCTS';
        if (!applicableProducts.includes(c.applicableProduct)) {
          applicableProducts.push(c.applicableProduct);
        }
      } else {
        appliesTo = 'ALL';
      }
    }

    setEditingCoupon(c);
    setFormData({
      code: c.code || '',
      discountType: c.discountType || 'percentage',
      discountAmount: c.discountAmount ?? '',
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split('T')[0] : '',
      appliesTo,
      applicableProducts,
      applicableCategories,
      applyToAllBundles: appliesTo === 'BUNDLES' ? applicableProducts.length === 0 : true,
      applyToAllThumbnailBundles:
        appliesTo === 'THUMBNAIL_BUNDLES' ? applicableProducts.length === 0 : true,
    });
    setFormError('');
    setProductSearch('');
    setCustomCategoryInput('');
    setIsModalOpen(true);
  };

  const handleProductToggle = (prodId) => {
    setFormData((prev) => {
      const exists = prev.applicableProducts.includes(prodId);
      const nextProducts = exists
        ? prev.applicableProducts.filter((id) => id !== prodId)
        : [...prev.applicableProducts, prodId];
      return { ...prev, applicableProducts: nextProducts };
    });
  };

  const handleCategoryToggle = (categoryName) => {
    setFormData((prev) => {
      const exists = prev.applicableCategories.some(
        (c) => c.toLowerCase() === categoryName.toLowerCase()
      );
      const nextCats = exists
        ? prev.applicableCategories.filter((c) => c.toLowerCase() !== categoryName.toLowerCase())
        : [...prev.applicableCategories, categoryName];
      return { ...prev, applicableCategories: nextCats };
    });
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!formData.applicableCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setFormData((prev) => ({
        ...prev,
        applicableCategories: [...prev.applicableCategories, trimmed],
      }));
    }
    setCustomCategoryInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.code.trim()) {
      setFormError('Coupon code is required.');
      return;
    }

    if (!formData.discountAmount || Number(formData.discountAmount) <= 0) {
      setFormError('Please enter a valid positive discount amount.');
      return;
    }

    if (formData.discountType === 'percentage' && Number(formData.discountAmount) > 100) {
      setFormError('Percentage discount cannot exceed 100%.');
      return;
    }

    // Validation based on scope
    let finalProducts = [...formData.applicableProducts];
    let finalCategories = [...formData.applicableCategories];

    if (formData.appliesTo === 'PRODUCTS') {
      if (finalProducts.length === 0) {
        setFormError('Please select at least one individual product.');
        return;
      }
    } else if (formData.appliesTo === 'BUNDLES') {
      if (formData.applyToAllBundles) {
        finalProducts = [];
      } else if (finalProducts.length === 0) {
        setFormError('Please select at least one Creator Bundle or choose "Apply to all Creator Bundles".');
        return;
      }
    } else if (formData.appliesTo === 'THUMBNAIL_BUNDLES') {
      if (formData.applyToAllThumbnailBundles) {
        finalProducts = [];
      } else if (finalProducts.length === 0) {
        setFormError('Please select at least one Thumbnail Bundle or choose "Apply to all Thumbnail Bundles".');
        return;
      }
    } else if (formData.appliesTo === 'CATEGORY') {
      if (finalCategories.length === 0) {
        setFormError('Please select or specify at least one category.');
        return;
      }
    } else {
      // ALL
      finalProducts = [];
      finalCategories = [];
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountAmount: Number(formData.discountAmount),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      appliesTo: formData.appliesTo,
      applicableProducts: finalProducts,
      applicableCategories: finalCategories,
      isActive: editingCoupon ? editingCoupon.isActive : true,
    };

    setIsSaving(true);
    try {
      const isEdit = !!editingCoupon;
      const url = isEdit ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCoupons();
        setFormData(initialFormState);
      } else {
        setFormError(data.error || 'Failed to save coupon');
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setCoupons((prev) => prev.map((c) => (c._id === id ? data.data : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const requestDeleteCoupon = (coupon) => {
    setDeleteModal({
      isOpen: true,
      coupon,
      isDeleting: false,
    });
  };

  const handleConfirmDeleteCoupon = async () => {
    if (!deleteModal.coupon) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const id = deleteModal.coupon._id;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success || res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        setDeleteModal({ isOpen: false, coupon: null, isDeleting: false });
      } else {
        alert(data.error || 'Failed to delete coupon');
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Failed to delete coupon', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Export Discounts Report to CSV matching Orders pattern
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Coupon Code,Discount Type,Discount Value,Applies To,Status,Expiry Date\n' +
      coupons
        .map((c) => {
          const discountVal =
            c.discountType === 'percentage'
              ? `${c.discountAmount}%`
              : `₹${c.discountAmount}`;
          const appliesToStr =
            c.appliesTo === 'ALL'
              ? 'Site-wide'
              : c.appliesTo === 'PRODUCTS'
              ? 'Specific Products'
              : c.appliesTo === 'BUNDLES'
              ? 'Creator Bundles'
              : c.appliesTo === 'THUMBNAIL_BUNDLES'
              ? 'Thumbnail Bundles'
              : c.appliesTo === 'CATEGORY'
              ? `Category: ${(c.applicableCategories || []).join(', ')}`
              : 'Site-wide';
          const statusStr = c.isActive ? 'Active' : 'Inactive';
          const expiryStr = c.expiryDate
            ? new Date(c.expiryDate).toLocaleDateString()
            : 'Never';

          return `"${c.code}","${c.discountType || 'percentage'}","${discountVal}","${appliesToStr.replace(/"/g, '""')}","${statusStr}","${expiryStr}"`;
        })
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Discounts_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render Applies To pill in table
  const renderAppliesToBadge = (coupon) => {
    const scope =
      coupon.appliesTo ||
      (coupon.applicableProduct && coupon.applicableProduct !== 'ALL' ? 'PRODUCTS' : 'ALL');

    if (scope === 'ALL') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
          <Globe className="w-3 h-3 text-neutral-500" />
          Site-wide
        </span>
      );
    }

    if (scope === 'PRODUCTS') {
      const ids = coupon.applicableProducts || [];
      const count =
        ids.length > 0
          ? ids.length
          : coupon.applicableProduct && coupon.applicableProduct !== 'ALL'
          ? 1
          : 0;

      const matchedNames = ids.map((id) => {
        const prod = products.find((p) => p.id === id || String(p._id) === String(id));
        return prod ? prod.name : id;
      });

      return (
        <div className="flex flex-col gap-1 items-start">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
            title={matchedNames.join(', ')}
          >
            <Package className="w-3 h-3 text-blue-600" />
            {count > 0 ? `${count} Product${count > 1 ? 's' : ''}` : 'Specific Products'}
          </span>
          {matchedNames.length > 0 && (
            <span
              className="text-[10px] text-neutral-500 max-w-[200px] truncate"
              title={matchedNames.join(', ')}
            >
              {matchedNames.slice(0, 2).join(', ')}
              {matchedNames.length > 2 ? ` +${matchedNames.length - 2} more` : ''}
            </span>
          )}
        </div>
      );
    }

    if (scope === 'BUNDLES') {
      const ids = coupon.applicableProducts || [];
      const matchedNames = ids.map((id) => {
        const prod = products.find((p) => p.id === id || String(p._id) === String(id));
        return prod ? prod.name : id;
      });

      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Boxes className="w-3 h-3 text-purple-600" />
            {ids.length > 0
              ? `${ids.length} Creator Bundle${ids.length > 1 ? 's' : ''}`
              : 'Creator Bundles (All)'}
          </span>
          {matchedNames.length > 0 && (
            <span
              className="text-[10px] text-neutral-500 max-w-[200px] truncate"
              title={matchedNames.join(', ')}
            >
              {matchedNames.slice(0, 2).join(', ')}
              {matchedNames.length > 2 ? ` +${matchedNames.length - 2} more` : ''}
            </span>
          )}
        </div>
      );
    }

    if (scope === 'THUMBNAIL_BUNDLES') {
      const ids = coupon.applicableProducts || [];
      const matchedNames = ids.map((id) => {
        const prod = products.find((p) => p.id === id || String(p._id) === String(id));
        return prod ? prod.name : id;
      });

      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {ids.length > 0
              ? `${ids.length} Thumbnail Bundle${ids.length > 1 ? 's' : ''}`
              : 'Thumbnail Bundles (All)'}
          </span>
          {matchedNames.length > 0 && (
            <span
              className="text-[10px] text-neutral-500 max-w-[200px] truncate"
              title={matchedNames.join(', ')}
            >
              {matchedNames.slice(0, 2).join(', ')}
              {matchedNames.length > 2 ? ` +${matchedNames.length - 2} more` : ''}
            </span>
          )}
        </div>
      );
    }

    if (scope === 'CATEGORY') {
      const cats = coupon.applicableCategories || [];
      return (
        <div className="flex flex-col gap-1 items-start">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Tag className="w-3 h-3 text-emerald-600" />
            Category ({cats.length})
          </span>
          <span className="text-[10px] text-neutral-500 max-w-[200px] truncate" title={cats.join(', ')}>
            {cats.join(', ') || 'Any'}
          </span>
        </div>
      );
    }

    return <span className="text-neutral-500 text-xs">Site-wide</span>;
  };

  // Filtered coupons for table display
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(c.discountAmount).includes(searchQuery);

      if (!matchesSearch) return false;

      if (scopeFilter === 'ALL') return true;
      if (scopeFilter === 'SITE_WIDE') {
        return (
          c.appliesTo === 'ALL' ||
          (!c.appliesTo && (!c.applicableProduct || c.applicableProduct === 'ALL'))
        );
      }
      if (scopeFilter === 'PRODUCTS') {
        return (
          c.appliesTo === 'PRODUCTS' ||
          (!c.appliesTo && c.applicableProduct && c.applicableProduct !== 'ALL')
        );
      }
      if (scopeFilter === 'BUNDLES') return c.appliesTo === 'BUNDLES';
      if (scopeFilter === 'THUMBNAIL_BUNDLES') return c.appliesTo === 'THUMBNAIL_BUNDLES';
      if (scopeFilter === 'CATEGORY') return c.appliesTo === 'CATEGORY';

      return true;
    });
  }, [coupons, searchQuery, scopeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const siteWide = coupons.filter(
      (c) =>
        c.appliesTo === 'ALL' ||
        (!c.appliesTo && (!c.applicableProduct || c.applicableProduct === 'ALL'))
    ).length;
    const targeted = total - siteWide;
    return { total, active, siteWide, targeted };
  }, [coupons]);

  // Products to render inside modal based on search
  const visibleIndividualProducts = useMemo(() => {
    if (!productSearch.trim()) return individualProducts;
    const q = productSearch.toLowerCase();
    return individualProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [individualProducts, productSearch]);

  const visibleCreatorBundles = useMemo(() => {
    if (!productSearch.trim()) return creatorBundles;
    const q = productSearch.toLowerCase();
    return creatorBundles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [creatorBundles, productSearch]);

  const visibleThumbnailBundles = useMemo(() => {
    if (!productSearch.trim()) return thumbnailBundles;
    const q = productSearch.toLowerCase();
    return thumbnailBundles.filter((p) => p.name.toLowerCase().includes(q));
  }, [thumbnailBundles, productSearch]);

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center text-neutral-500 font-medium shadow-2xs">
        Loading discounts and coupons from MongoDB...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Discounts
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Manage your store&apos;s discount coupons and promotional offers in one place.
          </p>
        </div>

        {/* Right Controls: Date Picker, Export Report & Add Coupon */}
        <div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">
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

            {/* Date Picker Dropdown Popover */}
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

          {/* Export Report Action Button */}
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

          {/* Add Coupon Action Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-[#900606] hover:bg-[#720404] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN DISCOUNTS CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code or discount..."
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

        {/* Scope Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Scopes' },
              { id: 'SITE_WIDE', label: 'Site-wide' },
              { id: 'PRODUCTS', label: 'Individual Products' },
              { id: 'BUNDLES', label: 'Creator Bundles' },
              { id: 'THUMBNAIL_BUNDLES', label: 'Thumbnail Bundles' },
              { id: 'CATEGORY', label: 'Category' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScopeFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  scopeFilter === tab.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-500 font-medium">Scope:</span>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none focus:border-[#900606] cursor-pointer"
            >
              <option value="ALL">All Scopes</option>
              <option value="SITE_WIDE">Site-wide</option>
              <option value="PRODUCTS">Individual Products</option>
              <option value="BUNDLES">Creator Bundles</option>
              <option value="THUMBNAIL_BUNDLES">Thumbnail Bundles</option>
              <option value="CATEGORY">Category</option>
            </select>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 font-bold w-[18%]">CODE</th>
                <th className="py-3.5 px-3 font-bold w-[16%]">DISCOUNT</th>
                <th className="py-3.5 px-3 font-bold w-[26%]">APPLIES TO</th>
                <th className="py-3.5 px-3 font-bold w-[14%]">STATUS</th>
                <th className="py-3.5 px-3 font-bold w-[14%]">EXPIRY</th>
                <th className="py-3.5 px-3 text-right font-bold w-[12%]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {filteredCoupons.map((c) => (
                <tr key={c._id} className="hover:bg-neutral-50/70 transition-colors group">
                  <td className="py-4 px-3 align-middle font-mono font-bold">
                    <span className="bg-red-50 text-[#900606] px-2.5 py-1 rounded-lg border border-red-100/80 font-mono text-xs font-bold tracking-wide">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-4 px-3 align-middle">
                    {c.discountType === 'percentage' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <Percent className="w-3.5 h-3.5 text-emerald-600" />
                        {c.discountAmount}% OFF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-neutral-900 font-extrabold text-xs bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200">
                        ₹{c.discountAmount} FLAT
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-3 align-middle">{renderAppliesToBadge(c)}</td>
                  <td className="py-4 px-3 align-middle">
                    <button
                      type="button"
                      onClick={() => toggleStatus(c._id, c.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors border ${
                        c.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                      }`}
                      title="Click to toggle status"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
                      <span>{c.isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-3 align-middle text-neutral-600 text-xs">
                    {c.expiryDate ? (
                      <span className="inline-flex items-center gap-1.5 text-neutral-700">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(c.expiryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    ) : (
                      <span className="text-neutral-400 italic">Never expires</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-right align-middle">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => requestDeleteCoupon(c)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">No coupons found</p>
                    <p className="text-xs">
                      {searchQuery
                        ? `No coupons match your search criteria "${searchQuery}"`
                        : 'No discount coupons created yet. Click "+ Add Coupon" to create your first promotion.'}
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

      {/* Add / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-neutral-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#900606]">
                  {editingCoupon ? 'Edit Discount Coupon' : 'Create New Discount Coupon'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Set target products, bundles, percentage or flat discounts.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
              {/* Code */}
              <div>
                <label className="block text-neutral-700 mb-1.5 font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CREATOR30, LIGHTS10"
                  className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-xl px-4 py-3 text-[#900606] outline-none focus:border-[#900606] font-mono uppercase font-bold text-sm tracking-wider"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })
                  }
                />
              </div>

              {/* Discount Type & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 mb-1.5 font-bold">Discount Type</label>
                  <select
                    className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 outline-none focus:border-[#900606] cursor-pointer"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 mb-1.5 font-bold">
                    {formData.discountType === 'percentage' ? 'Percentage Off (%)' : 'Amount Off (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    placeholder={formData.discountType === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                    className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 outline-none focus:border-[#900606]"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
                  />
                </div>
              </div>

              {/* Applies To Scope Selector */}
              <div>
                <label className="block text-neutral-700 mb-1.5 font-bold">
                  Applies To (Target Audience / Products)
                </label>
                <select
                  className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 font-bold outline-none focus:border-[#900606] cursor-pointer"
                  value={formData.appliesTo}
                  onChange={(e) => {
                    const nextScope = e.target.value;
                    setFormData({
                      ...formData,
                      appliesTo: nextScope,
                      applicableProducts: [],
                      applyToAllBundles: true,
                      applyToAllThumbnailBundles: true,
                    });
                    setProductSearch('');
                  }}
                >
                  <option value="ALL">Site-wide (All Products &amp; Bundles)</option>
                  <option value="PRODUCTS">Specific Individual Products</option>
                  <option value="BUNDLES">Creator Bundles</option>
                  <option value="THUMBNAIL_BUNDLES">Thumbnail Bundles</option>
                  <option value="CATEGORY">Specific Category</option>
                </select>
              </div>

              {/* SCOPE 1: Specific Individual Products */}
              {formData.appliesTo === 'PRODUCTS' && (
                <div className="bg-[#F8FAFC] border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">Pick Individual Products</h4>
                      <p className="text-[11px] text-neutral-500 font-normal">
                        Select which individual products this coupon is valid for.
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      {formData.applicableProducts.length} selected
                    </span>
                  </div>

                  {/* Search filter for products */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search individual products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-800 outline-none focus:border-[#900606]"
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          applicableProducts: individualProducts.map((p) => p.id || p._id),
                        })
                      }
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Select All Individual Products
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, applicableProducts: [] })}
                      className="text-neutral-500 hover:underline"
                    >
                      Clear Selection
                    </button>
                  </div>

                  {/* Scrollable Products List */}
                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100 bg-white border border-neutral-200 rounded-xl p-2">
                    {visibleIndividualProducts.map((prod) => {
                      const prodId = prod.id || prod._id;
                      const isSelected = formData.applicableProducts.includes(prodId);
                      const img = prod.image || (prod.images && prod.images[0]?.src) || '/pro1.png';

                      return (
                        <label
                          key={prodId}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/80' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleProductToggle(prodId)}
                            className="rounded border-neutral-300 text-[#900606] focus:ring-[#900606] w-4 h-4 cursor-pointer"
                          />
                          <img
                            src={img}
                            alt={prod.name}
                            className="w-9 h-9 object-cover rounded-md border border-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-neutral-800 truncate">{prod.name}</p>
                            <p className="text-[10px] text-neutral-400">
                              ₹{prod.price} {prod.category ? `• ${prod.category}` : ''}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                    {visibleIndividualProducts.length === 0 && (
                      <p className="text-center py-4 text-neutral-400 text-xs">
                        No individual products found matching &ldquo;{productSearch}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SCOPE 2: Creator Bundles */}
              {formData.appliesTo === 'BUNDLES' && (
                <div className="bg-[#F8FAFC] border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">Creator Bundles Scope</h4>
                      <p className="text-[11px] text-neutral-500 font-normal">
                        Apply to all creator bundles or target specific packages.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bundleScope"
                        checked={formData.applyToAllBundles}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            applyToAllBundles: true,
                            applicableProducts: [],
                          })
                        }
                        className="text-[#900606] focus:ring-[#900606]"
                      />
                      <span className="text-xs text-neutral-800 font-bold">
                        Apply to ALL Creator Bundles (Pro, Basic, Ultimate, etc.)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="bundleScope"
                        checked={!formData.applyToAllBundles}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            applyToAllBundles: false,
                          })
                        }
                        className="text-[#900606] focus:ring-[#900606]"
                      />
                      <span className="text-xs text-neutral-800 font-bold">
                        Select Specific Creator Bundles
                      </span>
                    </label>
                  </div>

                  {!formData.applyToAllBundles && (
                    <div className="pt-2 space-y-2">
                      <div className="max-h-52 overflow-y-auto space-y-2 bg-white border border-neutral-200 rounded-xl p-2">
                        {visibleCreatorBundles.map((b) => {
                          const bundleId = b.id || b._id;
                          const isSelected = formData.applicableProducts.includes(bundleId);
                          const img = b.image || (b.images && b.images[0]?.src) || '/pro1.png';

                          return (
                            <label
                              key={bundleId}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-purple-50/80' : 'hover:bg-neutral-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleProductToggle(bundleId)}
                                className="rounded border-neutral-300 text-[#900606] focus:ring-[#900606] w-4 h-4 cursor-pointer"
                              />
                              <img
                                src={img}
                                alt={b.name}
                                className="w-9 h-9 object-cover rounded-md border border-neutral-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-neutral-800 truncate">{b.name}</p>
                                <p className="text-[10px] text-neutral-400">₹{b.price} • Bundle</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCOPE 3: Thumbnail Bundles */}
              {formData.appliesTo === 'THUMBNAIL_BUNDLES' && (
                <div className="bg-[#F8FAFC] border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">Thumbnail Bundles Scope</h4>
                      <p className="text-[11px] text-neutral-500 font-normal">
                        Apply to thumbnail packages and variant bundles.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="thumbBundleScope"
                        checked={formData.applyToAllThumbnailBundles}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            applyToAllThumbnailBundles: true,
                            applicableProducts: [],
                          })
                        }
                        className="text-[#900606] focus:ring-[#900606]"
                      />
                      <span className="text-xs text-neutral-800 font-bold">
                        Apply to ALL Thumbnail Bundles
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="thumbBundleScope"
                        checked={!formData.applyToAllThumbnailBundles}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            applyToAllThumbnailBundles: false,
                          })
                        }
                        className="text-[#900606] focus:ring-[#900606]"
                      />
                      <span className="text-xs text-neutral-800 font-bold">
                        Select Specific Thumbnail Bundles
                      </span>
                    </label>
                  </div>

                  {!formData.applyToAllThumbnailBundles && (
                    <div className="pt-2 space-y-2">
                      <div className="max-h-52 overflow-y-auto space-y-2 bg-white border border-neutral-200 rounded-xl p-2">
                        {visibleThumbnailBundles.map((b) => {
                          const bundleId = b.id || b._id;
                          const isSelected = formData.applicableProducts.includes(bundleId);
                          const img = b.image || (b.images && b.images[0]?.src) || '/pro1.png';

                          return (
                            <label
                              key={bundleId}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-amber-50/80' : 'hover:bg-neutral-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleProductToggle(bundleId)}
                                className="rounded border-neutral-300 text-[#900606] focus:ring-[#900606] w-4 h-4 cursor-pointer"
                              />
                              <img
                                src={img}
                                alt={b.name}
                                className="w-9 h-9 object-cover rounded-md border border-neutral-200 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-neutral-800 truncate">{b.name}</p>
                                <p className="text-[10px] text-neutral-400">
                                  ₹{b.price} • Thumbnail Bundle
                                </p>
                              </div>
                            </label>
                          );
                        })}
                        {visibleThumbnailBundles.length === 0 && (
                          <p className="text-center py-4 text-neutral-400 text-xs">
                            No thumbnail bundles found in database.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCOPE 4: Specific Category */}
              {formData.appliesTo === 'CATEGORY' && (
                <div className="bg-[#F8FAFC] border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-xs">Select Targeted Categories</h4>
                      <p className="text-[11px] text-neutral-500 font-normal">
                        Coupon applies only to products belonging to selected categories.
                      </p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                      {formData.applicableCategories.length} selected
                    </span>
                  </div>

                  {/* Available Categories Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableCategories.map((cat) => {
                      const isSelected = formData.applicableCategories.some(
                        (c) => c.toLowerCase() === cat.toLowerCase()
                      );

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom category input */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add another category name..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomCategory();
                        }
                      }}
                      className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 outline-none focus:border-[#900606]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      className="px-3 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Expiry Date */}
              <div>
                <label className="block text-neutral-700 mb-1.5 font-bold">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 outline-none focus:border-[#900606]"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-[#900606] hover:bg-[#720404] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, coupon: null, isDeleting: false })
        }
        onConfirm={handleConfirmDeleteCoupon}
        title="Delete Coupon?"
        message={
          deleteModal.coupon
            ? `Are you sure you want to delete coupon code "${deleteModal.coupon.code}"? This will stop future orders from using it.`
            : 'Are you sure you want to delete this coupon?'
        }
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
}
