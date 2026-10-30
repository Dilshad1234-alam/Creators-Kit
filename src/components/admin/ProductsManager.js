'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function ProductsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Section / Tab Filter: 'all' | 'individual' | 'bundles' | 'thumbnail-bundles'
  const [activeSectionTab, setActiveSectionTab] = useState('all');

  // Modal State for Add / Edit Product (3-Way: 'individual' | 'bundle' | 'thumbnail-bundle')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('individual'); // 'individual' | 'bundle' | 'thumbnail-bundle'
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    product: null,
    title: '',
    message: '',
    isDeleting: false,
  });

  const [expandedBonusIdx, setExpandedBonusIdx] = useState(null);

  const DEFAULT_BONUS_MASTERCLASSES = [
    {
      id: 'instagram-mastery',
      title: 'Instagram Mastery',
      description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
      image: '/video 2.webp',
      badge: '100% Free',
      originalPrice: 1999,
      active: true,
    },
    {
      id: 'youtube-mastery',
      title: 'YouTube Mastery',
      description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
      image: '/video 1.webp',
      badge: '100% Free',
      originalPrice: 1999,
      active: true,
    },
    {
      id: 'filmora-mastery',
      title: 'Filmora Mastery',
      description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
      image: '/video.webp',
      badge: '100% Free',
      originalPrice: 999,
      active: true,
    },
  ];

  const initialFormState = {
    name: '',
    subheading: '',
    category: 'Lighting',
    tag: 'Most Popular',
    price: '',
    originalPrice: '',
    stock: '10',
    image: '/ring.jpg',
    video: '',
    description: '',
    features: '',
    items: '',
    includeBonusCourses: true,
    bonusMasterclasses: DEFAULT_BONUS_MASTERCLASSES,
    images: [
      {
        src: '/ring.jpg',
        title: '',
        subtitle: '',
        description: '',
        price: '',
        originalPrice: '',
      },
    ],
  };
  const [formData, setFormData] = useState(initialFormState);

  const [products, setProducts] = useState([]);

  // Fetch real products from live MongoDB API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        const dbProducts = data.data || [];
        const formatted = dbProducts.map((p) => {
          let pType = p.productType;
          if (!pType || !['individual', 'bundle', 'thumbnail-bundle'].includes(pType)) {
            if (p.id === 'rode-wireless-go-2' || (Array.isArray(p.images) && p.images.length > 1 && p.images.some((v) => v.title && v.title !== p.name))) {
              pType = 'thumbnail-bundle';
            } else if (p.isBundle || (p.category && p.category.toLowerCase().includes('bundle'))) {
              pType = 'bundle';
            } else {
              pType = 'individual';
            }
          }
          const isBun = pType === 'bundle';
          let cat = p.category || (isBun ? 'Creator bundles' : 'Accessories');
          const rawCat = (p.category || '').toLowerCase();
          if (rawCat.includes('bundle')) cat = 'Creator bundles';
          else if (rawCat.includes('light')) cat = 'Lighting';
          else if (rawCat.includes('audio') || rawCat.includes('mic')) cat = 'Audio';

          const productImages = Array.isArray(p.images) && p.images.length > 0
            ? p.images.map((im) => ({
                src: typeof im === 'string' ? im : (im.src || p.image || '/pro1.png'),
                title: im.title || p.name || '',
                subtitle: im.subtitle || '',
                description: im.description || '',
                price: im.price !== undefined ? im.price : p.price,
                originalPrice: im.originalPrice !== undefined ? im.originalPrice : p.originalPrice,
              }))
            : [
                {
                  src: p.image || '/pro1.png',
                  title: p.name || '',
                  subtitle: '',
                  description: p.description || '',
                  price: p.price,
                  originalPrice: p.originalPrice,
                },
              ];

          return {
            _id: p._id || p.id,
            id: p.id || p._id,
            name: p.name || 'Unnamed Product',
            category: cat,
            productType: pType,
            tag: p.tag || (isBun ? 'Most Popular' : (pType === 'thumbnail-bundle' ? 'Featured Gear' : '')),
            price: p.price || 0,
            originalPrice: p.originalPrice || undefined,
            formattedPrice: `₹${(p.price || 0).toLocaleString('en-IN')}`,
            stock: typeof p.stock === 'number' ? p.stock : 10,
            image: p.image || productImages[0]?.src || '/pro1.png',
            video: p.video || p.videoUrl || '',
            images: productImages,
            fallbackImage: '/pro1.png',
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
            items: Array.isArray(p.items) ? p.items.join(', ') : (p.items || ''),
            isBundle: isBun,
          };
        });
        setProducts(formatted);
      }
    } catch (err) {
      console.error('Failed to fetch live products', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      const sectionParam = urlParams.get('section');
      if (tabParam === 'bundles' || sectionParam === 'bundles') {
        setActiveSectionTab('bundles');
      } else if (sectionParam === 'thumbnail-bundles' || tabParam === 'thumbnail-bundles') {
        setActiveSectionTab('thumbnail-bundles');
      } else if (sectionParam === 'individual' || tabParam === 'individual') {
        setActiveSectionTab('individual');
      }
    }
  }, [fetchProducts]);

  // Counts for the 3 distinct product categories
  const individualCount = products.filter((p) => p.productType === 'individual').length;
  const bundleCount = products.filter((p) => p.productType === 'bundle').length;
  const thumbnailBundleCount = products.filter((p) => p.productType === 'thumbnail-bundle').length;
  const totalCount = products.length;

  // Filter products by selected section tab and search query
  const filteredProducts = products.filter((p) => {
    // 1. Tab section filter
    if (activeSectionTab === 'individual' && p.productType !== 'individual') return false;
    if (activeSectionTab === 'bundles' && p.productType !== 'bundle') return false;
    if (activeSectionTab === 'thumbnail-bundles' && p.productType !== 'thumbnail-bundle') return false;

    // 2. Search query filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.productType?.toLowerCase().includes(query) ||
      p.formattedPrice?.toLowerCase().includes(query) ||
      `${p.stock}`.includes(query)
    );
  });

  // Modal Open Handlers
  const handleAddNewClick = () => {
    setEditingProduct(null);
    setErrorMessage('');
    setExpandedBonusIdx(null);
    const defaultType = activeSectionTab === 'bundles'
      ? 'bundle'
      : activeSectionTab === 'thumbnail-bundles'
      ? 'thumbnail-bundle'
      : 'individual';
    setModalType(defaultType);

    const defaultImg = defaultType === 'bundle' ? '/pro1.png' : (defaultType === 'thumbnail-bundle' ? '/ring5.png' : '/ring.jpg');
    setFormData({
      ...initialFormState,
      name: defaultType === 'thumbnail-bundle' ? 'Creators Studio Gear' : '',
      subheading: defaultType === 'bundle' ? 'All-In-One Studio Kit' : '',
      category: defaultType === 'bundle' ? 'Creator bundles' : 'Lighting',
      tag: defaultType === 'bundle' ? 'Most Popular' : (defaultType === 'thumbnail-bundle' ? 'Featured Gear' : ''),
      price: defaultType === 'thumbnail-bundle' ? '3999' : '',
      originalPrice: defaultType === 'thumbnail-bundle' ? '4995' : '',
      stock: '10',
      image: defaultImg,
      includeBonusCourses: defaultType === 'bundle' || defaultType === 'thumbnail-bundle',
      bonusMasterclasses: (defaultType === 'bundle' || defaultType === 'thumbnail-bundle') ? DEFAULT_BONUS_MASTERCLASSES : [],
      images: defaultType === 'thumbnail-bundle'
        ? [
            {
              src: '/ring5.png',
              title: 'Ring Light',
              subtitle: 'Professional 18 inch Ring Light with Desk Mount & Stand',
              description: 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.',
            },
            {
              src: '/tripod6.png',
              title: 'Tripod',
              subtitle: 'Professional Aluminum Tripod Stand for Cameras & Mobiles',
              description: 'Engineered for ultimate stability. Keep your shots rock-solid and level during long streams, outdoor vlogging, and cinematic pans.',
            },
            {
              src: '/chorma2.png',
              title: 'Chroma Green',
              subtitle: 'Portable Wrinkle-Resistant Green Screen Backdrop',
              description: 'Instant background removal and replacement. Set up your virtual studio anywhere in seconds with this high-grade matte green fabric.',
            },
            {
              src: '/wireless-mic4.png',
              title: 'Wireless Mic',
              subtitle: 'Dual Channel Wireless Microphone System for Creators, Vloggers & Filmmakers',
              description: 'Capture professional, studio-quality audio with the Creators Kit wireless condenser microphone. Perfect for YouTubers, podcasters, and mobile creators.',
            },
          ]
        : defaultType === 'bundle'
        ? [
            {
              src: '/pro1.png',
              title: 'Main Showcase',
              subtitle: '',
              description: '',
            },
            {
              src: '/pro.png',
              title: 'Kit Angle View 2',
              subtitle: '',
              description: '',
            },
            {
              src: '/pro2.png',
              title: 'Kit Angle View 3',
              subtitle: '',
              description: '',
            },
          ]
        : [
            {
              src: defaultImg,
              title: '',
              subtitle: '',
              description: '',
              price: '',
              originalPrice: '',
            },
          ],
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product, e) => {
    if (e) e.stopPropagation();
    setEditingProduct(product);
    setErrorMessage('');
    setExpandedBonusIdx(null);
    const pType = product.productType || (product.isBundle ? 'bundle' : 'individual');
    setModalType(pType);

    const fallbackDefaultImg = pType === 'bundle' ? '/pro1.png' : '/ring.jpg';
    const productImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((im) => ({
          src: typeof im === 'string' ? im : (im.src || product.image || fallbackDefaultImg),
          title: im.title || '',
          subtitle: im.subtitle || '',
          description: im.description || '',
          price: im.price !== undefined && im.price !== null ? im.price : '',
          originalPrice: im.originalPrice !== undefined && im.originalPrice !== null ? im.originalPrice : '',
        }))
      : [
          {
            src: product.image || fallbackDefaultImg,
            title: product.name || '',
            subtitle: '',
            description: product.description || '',
            price: product.price || '',
            originalPrice: product.originalPrice || '',
          },
        ];

    let bonusCourses = DEFAULT_BONUS_MASTERCLASSES;
    if (Array.isArray(product.bonusMasterclasses) && product.bonusMasterclasses.length > 0) {
      bonusCourses = DEFAULT_BONUS_MASTERCLASSES.map((def) => {
        const found = product.bonusMasterclasses.find(
          (b) => b.id === def.id || (b.title && b.title.toLowerCase() === def.title.toLowerCase())
        );
        if (!found) return def;
        const isLegacyImg = !found.image || found.image.includes('banner') || found.image.includes('placeholder');
        return {
          ...def,
          ...found,
          image: isLegacyImg ? def.image : found.image,
          active: found.active !== false,
        };
      });
      const defIds = new Set(DEFAULT_BONUS_MASTERCLASSES.map((d) => d.id));
      const additional = product.bonusMasterclasses.filter((b) => !defIds.has(b.id));
      bonusCourses = [...bonusCourses, ...additional];
    }

    setFormData({
      name: product.name,
      subheading: product.subheading || '',
      category: pType === 'bundle' ? 'Creator bundles' : (product.category || 'Lighting'),
      tag: product.tag || (pType === 'bundle' ? 'Most Popular' : 'Featured Gear'),
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      image: product.image || productImages[0]?.src || fallbackDefaultImg,
      video: product.video || product.videoUrl || '',
      description: product.description || '',
      features: Array.isArray(product.features) ? product.features.join(', ') : (product.features || ''),
      items: Array.isArray(product.items) ? product.items.join(', ') : (product.items || ''),
      images: productImages,
      includeBonusCourses: (pType === 'bundle' || pType === 'thumbnail-bundle') ? (product.includeBonusCourses !== false) : false,
      bonusMasterclasses: (pType === 'bundle' || pType === 'thumbnail-bundle') ? bonusCourses : [],
    });
    setIsModalOpen(true);
  };

  // Switch modal type tab (3-Way: Individual vs Creator Bundle vs Thumbnail Bundle)
  const handleTypeSwitch = (type) => {
    setModalType(type);
    if (type === 'bundle') {
      setFormData((prev) => ({
        ...prev,
        category: 'Creator bundles',
        image: prev.image.includes('ring') ? '/pro1.png' : prev.image,
        includeBonusCourses: prev.includeBonusCourses !== false,
        bonusMasterclasses: prev.bonusMasterclasses && prev.bonusMasterclasses.length > 0 ? prev.bonusMasterclasses : DEFAULT_BONUS_MASTERCLASSES,
      }));
    } else if (type === 'thumbnail-bundle') {
      setFormData((prev) => {
        let currentVariants = prev.images || [];
        if (currentVariants.length < 2) {
          currentVariants = [
            {
              src: currentVariants[0]?.src || '/ring5.png',
              title: currentVariants[0]?.title || 'Ring Light',
              subtitle: currentVariants[0]?.subtitle || 'Professional 18 inch Ring Light with Desk Mount & Stand',
              description: currentVariants[0]?.description || 'Achieve flawless, studio-quality illumination with adjustable brightness and color temperature. Perfect for eliminating shadows and glowing on camera.',
            },
            {
              src: '/tripod6.png',
              title: 'Tripod',
              subtitle: 'Professional Aluminum Tripod Stand for Cameras & Mobiles',
              description: 'Engineered for ultimate stability. Keep your shots rock-solid and level during long streams, outdoor vlogging, and cinematic pans.',
            },
            {
              src: '/chorma2.png',
              title: 'Chroma Green',
              subtitle: 'Portable Wrinkle-Resistant Green Screen Backdrop',
              description: 'Instant background removal and replacement. Set up your virtual studio anywhere in seconds with this high-grade matte green fabric.',
            },
            {
              src: '/wireless-mic4.png',
              title: 'Wireless Mic',
              subtitle: 'Dual Channel Wireless Microphone System for Creators, Vloggers & Filmmakers',
              description: 'Capture professional, studio-quality audio with the Creators Kit wireless condenser microphone. Perfect for YouTubers, podcasters, and mobile creators.',
            },
          ];
        }
        return {
          ...prev,
          name: prev.name || 'Creators Studio Gear',
          price: prev.price || '3999',
          originalPrice: prev.originalPrice || '4995',
          stock: prev.stock || '10',
          category: prev.category === 'Creator bundles' ? 'Lighting' : prev.category,
          images: currentVariants,
          image: currentVariants[0]?.src || prev.image,
          includeBonusCourses: prev.includeBonusCourses !== false,
          bonusMasterclasses: prev.bonusMasterclasses && prev.bonusMasterclasses.length > 0 ? prev.bonusMasterclasses : DEFAULT_BONUS_MASTERCLASSES,
        };
      });
    } else {
      // 'individual'
      setFormData((prev) => ({
        ...prev,
        category: prev.category === 'Creator bundles' ? 'Lighting' : prev.category,
      }));
    }
  };

  // Variant Helpers for Dynamic Switcher Management
  const handleAddVariant = () => {
    setFormData((prev) => {
      const nextIdx = (prev.images?.length || 0) + 1;
      const defaultNewSrc = modalType === 'bundle' ? '/pro.png' : (modalType === 'thumbnail-bundle' ? '/ring5.png' : '/ring.jpg');
      return {
        ...prev,
        images: [
          ...(prev.images || []),
          {
            src: defaultNewSrc,
            title: modalType === 'thumbnail-bundle' ? `Thumbnail Variant ${nextIdx}` : (modalType === 'bundle' ? `Kit Angle View ${nextIdx}` : `Angle View ${nextIdx}`),
            subtitle: '',
            description: '',
          },
        ],
      };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => {
      if ((prev.images?.length || 0) <= 1) return prev;
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated[0]?.src || prev.image,
      };
    });
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.images || [])];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...prev,
        images: updated,
        image: index === 0 && field === 'src' ? value : prev.image,
      };
    });
  };

  // Form Submit (Save / Update)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    const priceNum = Number(formData.price) || 0;
    const stockNum = Number(formData.stock) || 0;
    const origPriceNum = formData.originalPrice ? Number(formData.originalPrice) : undefined;
    const isBundle = modalType === 'bundle';
    const isThumbnailBundle = modalType === 'thumbnail-bundle';

    const inputMainImage = (formData.image || '').trim();

    // Map and clean all variant/gallery images for all product types
    let cleanedImages = [];
    if (Array.isArray(formData.images) && formData.images.length > 0) {
      cleanedImages = formData.images
        .filter((im) => {
          const s = typeof im === 'string' ? im : im?.src;
          return s && s.trim() !== '';
        })
        .map((v, idx) => {
          const s = typeof v === 'string' ? v : v.src;
          return {
            src: s.trim(),
            title: isThumbnailBundle
              ? (typeof v === 'object' && v.title ? v.title : (idx === 0 ? formData.name : `Variant ${idx + 1}`))
              : formData.name,
            subtitle: typeof v === 'object' && v.subtitle ? v.subtitle : '',
            description: typeof v === 'object' && v.description ? v.description : formData.description || '',
            price: priceNum,
            originalPrice: origPriceNum,
          };
        });
    }

    // Fallback if no images were entered in the gallery list
    if (cleanedImages.length === 0) {
      const fallbackSrc = (isThumbnailBundle ? '' : inputMainImage) || (isBundle ? '/pro1.png' : '/ring.jpg');
      cleanedImages = [
        {
          src: fallbackSrc,
          title: formData.name || 'Product',
          subtitle: '',
          description: formData.description,
          price: priceNum,
          originalPrice: origPriceNum,
        },
      ];
    } else if (inputMainImage && cleanedImages[0].src !== inputMainImage && !isThumbnailBundle) {
      // Ensure the first variant stays matched with the main image input for individual products
      cleanedImages[0].src = inputMainImage;
    }

    const primaryVariant = cleanedImages[0] || {};
    const finalMainImage = (isThumbnailBundle ? primaryVariant.src : inputMainImage) || primaryVariant.src || (isBundle ? '/pro1.png' : '/ring.jpg');

    const bonusCourses = (formData.bonusMasterclasses || DEFAULT_BONUS_MASTERCLASSES).map((c) => ({
      id: c.id || (c.title ? c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'masterclass'),
      title: c.title || 'Masterclass',
      description: c.description || '',
      image: c.image || '/video 2.webp',
      badge: c.badge || '100% Free',
      originalPrice: Number(c.originalPrice) || 1999,
      active: c.active !== false,
    }));

    const payload = {
      name: formData.name,
      subheading: (formData.subheading || '').trim(),
      productType: modalType,
      category: isBundle ? 'Creator bundles' : formData.category,
      isBundle,
      price: priceNum,
      originalPrice: origPriceNum,
      stock: stockNum,
      image: finalMainImage,
      video: (formData.video || '').trim(),
      videoUrl: (formData.video || '').trim(),
      images: cleanedImages,
      description: formData.description,
      tag: isBundle ? formData.tag : (isThumbnailBundle ? 'Featured Gear' : undefined),
      features: formData.features
        ? (Array.isArray(formData.features) ? formData.features : formData.features.split(',').map((f) => f.trim()).filter(Boolean))
        : [],
      items: formData.items
        ? (Array.isArray(formData.items) ? formData.items : formData.items.split(',').map((f) => f.trim()).filter(Boolean))
        : [],
      whatsInTheBox: (formData.items
        ? (Array.isArray(formData.items) ? formData.items : formData.items.split(',').map((f) => f.trim()).filter(Boolean))
        : []).map((name) => ({ name })),
      includeBonusCourses: (isBundle || isThumbnailBundle) ? formData.includeBonusCourses !== false : false,
      bonusMasterclasses: (isBundle || isThumbnailBundle) ? bonusCourses : [],
    };

    try {
      if (editingProduct) {
        // Update product in DB
        const targetId = editingProduct._id || editingProduct.id;
        const res = await fetch(`/api/products/${targetId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || 'Failed to update item');
        }
      } else {
        // Create new item in DB
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || 'Failed to save item');
        }
      }

      // Refresh live table data from MongoDB
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handler with in-app confirmation modal
  const requestDeleteProduct = (product, e) => {
    if (e) e.stopPropagation();
    const typeLabel = product.productType === 'thumbnail-bundle'
      ? 'thumbnail bundle'
      : product.productType === 'bundle'
      ? 'creator bundle'
      : 'individual product';

    setDeleteModal({
      isOpen: true,
      product,
      title: `Delete ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)}?`,
      message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      isDeleting: false,
    });
  };

  const handleConfirmDeleteProduct = async () => {
    if (!deleteModal.product) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    const product = deleteModal.product;
    const targetId = product._id || product.id;

    // Optimistically remove from state
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== targetId));
    setDeleteModal({ isOpen: false, product: null, title: '', message: '', isDeleting: false });

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(targetId)}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('Failed to delete on server');
        await fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product', err);
      await fetchProducts();
    }
  };

  // Export Report to CSV
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Product Name,Type,Category,Price,MRP,Inventory\n' +
      products
        .map(
          (p) => {
            const typeLabel = p.productType === 'thumbnail-bundle'
              ? 'Thumbnail Bundle'
              : p.productType === 'bundle'
              ? 'Creator Bundle'
              : 'Individual Product';
            return `"${p.name}","${typeLabel}","${p.category}","${p.price}","${p.originalPrice || ''}","${p.stock} in stock"`;
          }
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Products_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Inventory Stock Badge Helper
  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626]">
          Out of stock
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FEF7E7] text-[#D97706]">
          {stock} in stock
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EAFBF3] text-[#129A64]">
        {stock} in stock
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Products & Bundles
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Categorized database inventory for individual studio gear, creator bundles, and dynamic thumbnail suites.
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

      {/* 2. MAIN PRODUCTS CONTAINER CARD */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Category Section Tab Filters: 4 Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* All Products Tab */}
            <button
              onClick={() => setActiveSectionTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSectionTab === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              <span>All Items</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSectionTab === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {totalCount}
              </span>
            </button>

            {/* Individual Products Tab */}
            <button
              onClick={() => setActiveSectionTab('individual')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSectionTab === 'individual'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              <span>Individual Products</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSectionTab === 'individual' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {individualCount}
              </span>
            </button>

            {/* Creator Bundles Tab */}
            <button
              onClick={() => setActiveSectionTab('bundles')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSectionTab === 'bundles'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              <span>Creator Bundles</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSectionTab === 'bundles' ? 'bg-white/25 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {bundleCount}
              </span>
            </button>

            {/* Thumbnail Bundles Tab */}
            <button
              onClick={() => setActiveSectionTab('thumbnail-bundles')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSectionTab === 'thumbnail-bundles'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              <span>Thumbnail Bundles</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activeSectionTab === 'thumbnail-bundles' ? 'bg-white/25 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}>
                {thumbnailBundleCount}
              </span>
            </button>
          </div>

          {/* Section Indicator Label */}
          <div className="text-[11px] text-neutral-400 font-medium hidden md:block">
            Showing {filteredProducts.length} of {totalCount} total items in database
          </div>
        </div>

        {/* Top Controls Row: Search Input & + Add Product Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeSectionTab === 'bundles'
                  ? "Search creator bundles..."
                  : activeSectionTab === 'thumbnail-bundles'
                  ? "Search thumbnail bundles & suites..."
                  : activeSectionTab === 'individual'
                  ? "Search individual products..."
                  : "Search all products, creator bundles, and thumbnail suites..."
              }
              className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleAddNewClick}
            className="w-full sm:w-auto bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-98"
          >
            <span>+ Add product</span>
          </button>
        </div>

        {/* Categorized Products Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 font-bold w-[34%]">ITEM</th>
                <th className="py-3.5 px-3 font-bold w-[20%]">CATEGORY / TYPE</th>
                <th className="py-3.5 px-3 font-bold w-[18%]">PRICE & MRP</th>
                <th className="py-3.5 px-3 font-bold w-[16%]">INVENTORY</th>
                <th className="py-3.5 px-3 font-bold w-[12%] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {filteredProducts.map((prod) => (
                <tr
                  key={prod._id || prod.id}
                  className="hover:bg-neutral-50/70 transition-colors group"
                >
                  {/* Item (Thumbnail + Name) */}
                  <td className="py-4 px-3 align-middle">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = prod.fallbackImage || '/pro1.png';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors text-xs sm:text-sm">
                            {prod.name}
                          </span>
                          {prod.productType === 'thumbnail-bundle' && prod.images && prod.images.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded-md">
                              <span>🖼️</span> {prod.images.length} thumbnails
                            </span>
                          )}
                        </div>

                        {prod.productType === 'thumbnail-bundle' ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-block text-[10px] font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.2 rounded">
                              Thumbnail Bundle
                            </span>
                            <span className="text-[10px] text-neutral-400 font-normal">
                              • Interactive Gallery
                            </span>
                          </div>
                        ) : prod.productType === 'bundle' ? (
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="inline-block text-[10px] font-extrabold text-[#DC2626] bg-red-50 border border-red-100 px-1.5 py-0.2 rounded">
                              Creator Bundle
                            </span>
                            {prod.includeBonusCourses !== false && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                <span>🎁</span>
                                <span>
                                  {(Array.isArray(prod.bonusMasterclasses)
                                    ? prod.bonusMasterclasses.filter((c) => c.active !== false).length
                                    : 3)}{' '}
                                  Free Courses
                                </span>
                              </span>
                            )}
                            {prod.tag && (
                              <span className="text-[10px] text-neutral-400 font-normal">
                                • {prod.tag}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-normal block mt-0.5">
                            Individual Gear
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category / Type */}
                  <td className="py-4 px-3 align-middle text-neutral-600 text-xs">
                    {prod.productType === 'thumbnail-bundle' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] bg-purple-50 text-purple-700 border border-purple-200">
                        Thumbnail Bundle
                      </span>
                    ) : prod.productType === 'bundle' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-[11px] bg-red-50/70 text-[#900606] border border-red-100">
                        <span>🎁</span> Creator Bundle
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold text-[11px] bg-neutral-100 text-neutral-700">
                        <span>📦</span> {prod.category}
                      </span>
                    )}
                  </td>

                  {/* Price & MRP */}
                  <td className="py-4 px-3 align-middle">
                    <div className="font-bold text-neutral-900 text-xs sm:text-sm">
                      {prod.formattedPrice}
                    </div>
                    {prod.originalPrice ? (
                      <div className="text-[10px] text-neutral-400 font-medium">
                        MRP: <span className="line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-neutral-300 font-normal">
                        MRP not set
                      </div>
                    )}
                  </td>

                  {/* Inventory Badge */}
                  <td className="py-4 px-3 align-middle">
                    {getStockBadge(prod.stock)}
                  </td>

                  {/* Action Buttons: Preview, Edit and Delete */}
                  <td className="py-4 px-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Storefront Preview Button */}
                      <a
                        href={prod.productType === 'bundle' || prod.isBundle ? `/bundle/${prod.id || prod._id}` : `/product?id=${prod.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-[#900606] p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="View on storefront"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      {/* Edit Button */}
                      <button
                        onClick={(e) => handleEditClick(prod, e)}
                        className="text-neutral-400 hover:text-neutral-800 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => requestDeleteProduct(prod, e)}
                        className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">
                      {activeSectionTab === 'bundles'
                        ? 'No creator bundles found'
                        : activeSectionTab === 'thumbnail-bundles'
                        ? 'No thumbnail bundles found'
                        : activeSectionTab === 'individual'
                        ? 'No individual products found'
                        : 'No products found'}
                    </p>
                    <p className="text-xs">
                      {searchQuery
                        ? `No items match "${searchQuery}" in this category`
                        : 'Add an item to get started'}
                    </p>
                    {searchQuery && (
                      <button
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

      {/* 3. INTERACTIVE "+ ADD / EDIT PRODUCT" MODAL WITH TYPE SELECTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl w-full max-w-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingProduct
                    ? (modalType === 'thumbnail-bundle'
                        ? 'Edit Thumbnail Bundle'
                        : modalType === 'bundle'
                        ? 'Edit Creator Bundle'
                        : 'Edit Individual Product')
                    : (modalType === 'thumbnail-bundle'
                        ? 'Add Thumbnail Bundle'
                        : modalType === 'bundle'
                        ? 'Add Creator Bundle'
                        : 'Add Individual Product')}
                </h3>
                <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                  {modalType === 'thumbnail-bundle'
                    ? 'Configure an interactive product gallery with dynamically switchable thumbnails, titles, and individual prices.'
                    : modalType === 'bundle'
                    ? 'Configure multi-piece equipment packages sold under a single unified bundle price.'
                    : 'Configure standalone equipment pieces with single image and dedicated specifications.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* TYPE SELECTOR TABS (3-Way: Individual Product | Creator Bundle | Thumbnail Bundle) */}
            <div className="p-1 bg-neutral-100 rounded-xl border border-neutral-200/80 grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleTypeSwitch('individual')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalType === 'individual'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200/60'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>📦</span>
                <span className="truncate">Individual Product</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch('bundle')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalType === 'bundle'
                    ? 'bg-[#DC2626] text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>🎁</span>
                <span className="truncate">Creator Bundle</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch('thumbnail-bundle')}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalType === 'thumbnail-bundle'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>🖼️</span>
                <span className="truncate">Thumbnail Bundle</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-semibold">
              
              {/* Product / Bundle Name */}
              <div>
                <label className="block text-neutral-700 mb-1">
                  {modalType === 'bundle'
                    ? 'Bundle Kit Name'
                    : modalType === 'thumbnail-bundle'
                    ? 'Thumbnail Suite / Bundle Name'
                    : 'Product Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    modalType === 'bundle'
                      ? 'e.g. Pro Creator Kit or Podcast Studio Bundle'
                      : modalType === 'thumbnail-bundle'
                      ? 'e.g. Creators Studio Gear or Creator Lighting Suite'
                      : 'e.g. Digitek Ring Light 18" or Wireless Lapel Mic'
                  }
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                />
              </div>

              {/* Product / Bundle Subheading */}
              <div>
                <label className="block text-neutral-700 mb-1 flex items-center justify-between">
                  <span>
                    {modalType === 'bundle'
                      ? 'Bundle Subheading / Kit Tagline (Optional)'
                      : 'Subheading / Tagline (Optional)'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">Displayed above product title</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    modalType === 'bundle'
                      ? 'e.g. ALL-IN-ONE STUDIO KIT or PROFESSIONAL YOUTUBE SETUP'
                      : 'e.g. Broadcast-Grade Dual Channel Microphone System'
                  }
                  value={formData.subheading || ''}
                  onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                />
              </div>

              {/* Dynamic Field: Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                {modalType === 'bundle' ? (
                  <div>
                    <label className="block text-neutral-700 mb-1">Bundle Tag</label>
                    <select
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                    >
                      <option value="Most Popular">Most Popular</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="New Arrival">New Arrival</option>
                      <option value="Pro Studio Edition">Pro Studio Edition</option>
                      <option value="Limited Release">Limited Release</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-neutral-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal bg-white"
                    >
                      <option value="Lighting">Lighting</option>
                      <option value="Audio">Audio</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Cameras">Cameras</option>
                      <option value="Stands & Mounts">Stands & Mounts</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-neutral-700 mb-1">
                    {modalType === 'bundle'
                      ? 'Unified Bundle Price (₹)'
                      : modalType === 'thumbnail-bundle'
                      ? 'Base Suite Price (₹)'
                      : 'Price (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={modalType === 'thumbnail-bundle' ? 'e.g. 3999' : 'e.g. 9999'}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 mb-1">Original MRP (₹ - Optional)</label>
                  <input
                    type="number"
                    placeholder={modalType === 'thumbnail-bundle' ? 'e.g. 4995' : 'e.g. 14999'}
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-700 mb-1 flex items-center justify-between">
                  <span>
                    {modalType === 'bundle'
                      ? 'Bundle Description'
                      : modalType === 'thumbnail-bundle'
                      ? 'Suite Description (Optional)'
                      : 'Product Description (Optional)'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">Detailed overview on storefront</span>
                </label>
                <textarea
                  rows="3"
                  placeholder={
                    modalType === 'bundle'
                      ? 'e.g. The foundational setup every aspiring creator needs. Clean lighting, directional audio, and solid tripod mounting to produce crisp videos right out of the box.'
                      : modalType === 'thumbnail-bundle'
                      ? 'Overview of this equipment suite and interactive gallery switcher...'
                      : 'Detailed product specifications and usage guidance...'
                  }
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal resize-none"
                />
              </div>

              {/* Standalone Image Input (For Individual Products & Creator Bundles) */}
              {modalType !== 'thumbnail-bundle' && (
                <div>
                  <label className="block text-neutral-700 mb-1">
                    {modalType === 'bundle' ? 'Bundle Cover Image Path / URL' : 'Product Image Path / URL'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-2xs">
                      <img
                        src={getImageUrl(formData.image) || (modalType === 'bundle' ? '/pro1.png' : '/ring.jpg')}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = modalType === 'bundle' ? '/pro1.png' : '/ring.jpg';
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder={modalType === 'bundle' ? 'e.g. /pro1.png, /pro2.png' : 'e.g. /wireless-mic.jpg, /ring.jpg, https://...'}
                      value={formData.image}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData((prev) => {
                          const currentImages = Array.isArray(prev.images) && prev.images.length > 0 ? [...prev.images] : [{ src: val }];
                          currentImages[0] = { ...currentImages[0], src: val };
                          return {
                            ...prev,
                            image: val,
                            images: currentImages,
                          };
                        });
                      }}
                      className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                    />
                  </div>
                </div>
              )}

              {/* Product Video URL / Path (Optional) */}
              <div>
                <label className="block text-neutral-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>🎬</span>
                    <span>Product Video URL / Path (Optional)</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">MP4, WebM, or video link</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-2xs text-lg">
                    {formData.video ? '🎥' : '▶️'}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. /product-video.mp4, https://example.com/video.mp4"
                    value={formData.video || ''}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                  />
                </div>
              </div>

              {/* PRODUCT VARIANTS & THUMBNAIL GALLERY SECTION (For All Product Types: Individual, Creator Bundle, Thumbnail Bundle) */}
              <div className={`pt-3 pb-1 border-t -mx-6 px-6 py-4 rounded-xl border ${modalType === 'thumbnail-bundle' ? 'border-purple-100 bg-purple-50/20' : 'border-red-100 bg-red-50/20'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-neutral-900 text-xs font-bold flex items-center gap-1.5">
                      <span>🖼️</span>
                      <span>
                        {modalType === 'bundle'
                          ? 'Bundle Gallery Angles & Thumbnails'
                          : modalType === 'individual'
                          ? 'Product Gallery Thumbnails'
                          : 'Product Variants & Thumbnail Gallery'}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${modalType === 'thumbnail-bundle' ? 'text-purple-700 bg-purple-50 border-purple-200' : 'text-[#900606] bg-red-50 border-red-200'}`}>
                        {formData.images?.length || 0} {formData.images?.length === 1 ? 'Image' : 'Images'}
                      </span>
                    </label>
                    <p className="text-[11px] text-neutral-500 font-normal mt-0.5">
                      {modalType === 'bundle'
                        ? 'Add multiple image angles or kit views for this creator bundle to populate the vertical thumbnail gallery on the bundle detail page.'
                        : modalType === 'individual'
                        ? 'Add multiple image URLs/paths for the product gallery. Customers can click thumbnails to view each angle or variant.'
                        : 'Clicking each thumbnail changes its image, title, subtitle, price, MRP, and description dynamically on the product page.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className={`shrink-0 px-3 py-1.5 text-white rounded-lg text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1 ${modalType === 'thumbnail-bundle' ? 'bg-purple-700 hover:bg-purple-800' : 'bg-[#900606] hover:bg-[#7a0505]'}`}
                  >
                    <span>
                      {modalType === 'bundle'
                        ? '+ Add Bundle Angle / Image'
                        : modalType === 'individual'
                        ? '+ Add Gallery Image'
                        : '+ Add Image / Variant'}
                    </span>
                  </button>
                </div>

                  {/* Quick Image Presets Suggestion Bar (Exclusively for Thumbnail Bundles) */}
                  {modalType === 'thumbnail-bundle' && (
                    <div className="mb-3 p-2 bg-white rounded-lg border border-purple-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                      <span className="font-bold shrink-0 text-purple-600">Quick presets:</span>
                      {[
                        { label: 'Ring Light', src: '/ring5.png' },
                        { label: 'Tripod', src: '/tripod6.png' },
                        { label: 'Chroma Screen', src: '/chorma2.png' },
                        { label: 'Wireless Mic', src: '/wireless-mic4.png' },
                        { label: 'Pro Kit', src: '/pro1.png' },
                      ].map((preset) => (
                        <button
                          key={preset.src}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => {
                              const updated = [...(prev.images || [])];
                              if (updated.length > 0) {
                                updated[updated.length - 1] = {
                                  ...updated[updated.length - 1],
                                  src: preset.src,
                                  title: updated[updated.length - 1].title || preset.label,
                                };
                              }
                              return { ...prev, images: updated, image: updated[0]?.src || preset.src };
                            });
                          }}
                          className="px-2 py-0.5 border rounded font-medium whitespace-nowrap transition-colors cursor-pointer bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Variants List */}
                  <div className="space-y-3">
                    {formData.images?.map((variant, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 bg-white rounded-xl border space-y-3 transition-all shadow-2xs ${modalType === 'thumbnail-bundle' ? 'border-purple-100 hover:border-purple-300' : 'border-red-100 hover:border-red-300'}`}
                      >
                        {/* Variant Card Header */}
                        <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full border text-[10px] flex items-center justify-center font-bold shadow-2xs ${
                              modalType === 'thumbnail-bundle'
                                ? 'bg-purple-100 text-purple-700 border-purple-200'
                                : 'bg-red-100 text-[#900606] border-red-200'
                            }`}>
                              {idx + 1}
                            </span>
                            <span>
                              {idx === 0 ? 'Primary / Cover Image' : (modalType === 'bundle' ? `Bundle Angle / View #${idx + 1}` : `Gallery Image #${idx + 1}`)}
                            </span>
                            {idx === 0 && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                Main Showcase
                              </span>
                            )}
                          </div>

                          {formData.images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="text-neutral-400 hover:text-red-600 text-[11px] font-semibold flex items-center gap-1 hover:bg-red-50 px-2 py-0.5 rounded cursor-pointer transition-colors"
                              title="Remove this image"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>

                        {/* Image Thumbnail Preview & Input */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center p-0.5 shadow-2xs">
                            <img
                              src={getImageUrl(variant.src) || (modalType === 'bundle' ? '/pro1.png' : '/ring.jpg')}
                              alt={`Variant ${idx + 1}`}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = modalType === 'bundle' ? '/pro1.png' : '/ring.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                              Image Path or URL
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={modalType === 'bundle' ? 'e.g. /pro1.png, /pro2.png, /pro.png, https://...' : 'e.g. /wireless-mic1.png, /tripod.jpg, https://...'}
                              value={variant.src}
                              onChange={(e) => handleVariantChange(idx, 'src', e.target.value)}
                              className="w-full border border-neutral-200 bg-white rounded-lg px-3 py-1.5 outline-none focus:border-[#900606] text-neutral-800 font-normal text-xs"
                            />
                          </div>
                        </div>

                        {/* Extra variant fields exclusively for Thumbnail Bundles */}
                        {modalType === 'thumbnail-bundle' && (
                          <>
                            {/* Variant Title & Subtitle */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                  Variant Title
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Ring Light, Tripod, Chroma Green"
                                  value={variant.title}
                                  onChange={(e) => handleVariantChange(idx, 'title', e.target.value)}
                                  className="w-full border border-neutral-200 bg-white rounded-lg px-3 py-1.5 outline-none focus:border-purple-600 text-neutral-800 font-normal text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                  Variant Subtitle
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Professional 18 inch Ring Light with Desk Mount & Stand"
                                  value={variant.subtitle}
                                  onChange={(e) => handleVariantChange(idx, 'subtitle', e.target.value)}
                                  className="w-full border border-neutral-200 bg-white rounded-lg px-3 py-1.5 outline-none focus:border-purple-600 text-neutral-800 font-normal text-xs"
                                />
                              </div>
                            </div>

                            {/* Variant Description */}
                            <div>
                              <label className="block text-[10px] text-neutral-500 font-semibold mb-0.5">
                                Variant Description (Dynamic on Click)
                              </label>
                              <textarea
                                rows="2"
                                placeholder="Description displayed on the product detail page when this thumbnail is selected..."
                                value={variant.description}
                                onChange={(e) => handleVariantChange(idx, 'description', e.target.value)}
                                className="w-full border border-neutral-200 bg-white rounded-lg px-3 py-1.5 outline-none focus:border-purple-600 text-neutral-800 font-normal text-xs resize-none"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUNDLE-SPECIFIC FIELD: Included Kit Items */}
              {modalType === 'bundle' && (
                <div>
                  <label className="block text-neutral-700 mb-1 flex items-center justify-between">
                    <span>Included Kit Items (Comma-separated)</span>
                    <span className="text-[10px] text-neutral-400 font-normal">What&apos;s in the box</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rode Wireless Mic, 18-inch Ring Light, Heavy Duty Tripod, Carry Bag"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                    className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                  />
                </div>
              )}

              {/* Features / Highlights */}
              <div>
                <label className="block text-neutral-700 mb-1 flex items-center justify-between">
                  <span>
                    {modalType === 'bundle'
                      ? 'Bundle Highlights / Specs'
                      : modalType === 'thumbnail-bundle'
                      ? 'Suite Highlights (Comma-separated)'
                      : 'Key Features (Comma-separated)'}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">Checkmark list on storefront</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    modalType === 'bundle'
                      ? 'e.g. Dual-Channel Wireless, High-CRI Lighting, 1-Year Warranty'
                      : modalType === 'thumbnail-bundle'
                      ? 'e.g. High-CRI Ring Light, 3-Way Pan Tripod, Dual-Channel Wireless Mic'
                      : 'e.g. Bi-Color 3200K-5600K, Dimmable 1%-100%, 6ft Aluminum Stand'
                  }
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#900606] text-neutral-800 font-normal"
                />
              </div>

              {/* FREE MASTERCLASSES BUNDLE OFFER (For Creator Bundles & Thumbnail Bundles) */}
              {(modalType === 'bundle' || modalType === 'thumbnail-bundle') && (
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl">🎁</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
                        <span>Free Masterclasses Bundle Offer</span>
                        <span className="text-[10px] font-black uppercase text-[#900606] bg-red-100/90 px-2 py-0.5 rounded-full">
                          Storefront Sync
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Display the free bonus courses banner on this product detail page and grant customer accounts lifetime streaming access upon checkout.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-center">
                    <input
                      type="checkbox"
                      checked={formData.includeBonusCourses !== false}
                      onChange={(e) => setFormData({ ...formData, includeBonusCourses: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#900606]"></div>
                  </label>
                </div>

                {formData.includeBonusCourses !== false && (
                  <div className="mt-3.5 pt-3 border-t border-red-200/60">
                    {(() => {
                      const coursesList = formData.bonusMasterclasses || DEFAULT_BONUS_MASTERCLASSES;
                      const activeCount = coursesList.filter((c) => c.active !== false).length;
                      const totalVal = coursesList
                        .filter((c) => c.active !== false)
                        .reduce((sum, c) => sum + (Number(c.originalPrice) || 0), 0);

                      return (
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <p className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                                <span>Included Bonus Masterclasses (Trilogy):</span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  {activeCount} Active • Total ₹{totalVal.toLocaleString('en-IN')} Value
                                </span>
                              </p>
                              <span className="text-[10px] text-neutral-400">
                                Toggle checkboxes or click &ldquo;Customize Details&rdquo; to edit title, pricing, or description
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  bonusMasterclasses: DEFAULT_BONUS_MASTERCLASSES,
                                });
                                setExpandedBonusIdx(null);
                              }}
                              className="text-[11px] font-semibold text-[#900606] hover:underline self-start sm:self-auto cursor-pointer"
                            >
                              ↺ Reset to Defaults
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {coursesList.map((course, idx) => {
                              const isActive = course.active !== false;
                              const isExpanded = expandedBonusIdx === idx;

                              return (
                                <div
                                  key={course.id || idx}
                                  className={`rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                                    isActive
                                      ? 'border-[#900606] bg-white shadow-2xs ring-1 ring-[#900606]/20'
                                      : 'border-neutral-200 bg-neutral-100/70 opacity-60'
                                  }`}
                                >
                                  {/* Card Header & Toggle */}
                                  <div className="p-3">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                      <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-7 h-7 rounded-md bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                                          <img
                                            src={course.image || '/banner 5.png'}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.onerror = null;
                                              e.currentTarget.src = '/banner 5.png';
                                            }}
                                          />
                                        </div>
                                        <span className="font-bold text-xs text-neutral-900 truncate">
                                          {course.title}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = coursesList.map((c, i) =>
                                            i === idx ? { ...c, active: !isActive } : c
                                          );
                                          setFormData({ ...formData, bonusMasterclasses: updated });
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors shrink-0 ${
                                          isActive
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-neutral-200 text-neutral-600'
                                        }`}
                                      >
                                        {isActive ? '✓ Included' : '✕ Excluded'}
                                      </button>
                                    </div>

                                    <p className="text-[10px] text-neutral-500 line-clamp-2 leading-snug mb-2">
                                      {course.description}
                                    </p>

                                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                                      <div className="flex items-center gap-1.5">
                                        <span className="line-through text-neutral-400">
                                          ₹{Number(course.originalPrice || 1999).toLocaleString('en-IN')}
                                        </span>
                                        <span className={`font-black ${isActive ? 'text-emerald-600' : 'text-neutral-400'}`}>
                                          {course.badge || '100% Free'}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setExpandedBonusIdx(isExpanded ? null : idx)}
                                        className="text-[10px] font-bold text-[#900606] hover:underline cursor-pointer"
                                      >
                                        {isExpanded ? 'Done ▲' : 'Customize ⚙️'}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expandable Course Customizer (Specify details) */}
                                  {isExpanded && (
                                    <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-[11px] space-y-2">
                                      <div>
                                        <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                                          Course Title
                                        </label>
                                        <input
                                          type="text"
                                          value={course.title}
                                          onChange={(e) => {
                                            const updated = coursesList.map((c, i) =>
                                              i === idx ? { ...c, title: e.target.value } : c
                                            );
                                            setFormData({ ...formData, bonusMasterclasses: updated });
                                          }}
                                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:border-[#900606]"
                                        />
                                      </div>

                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                                            Value / MRP (₹)
                                          </label>
                                          <input
                                            type="number"
                                            value={course.originalPrice || ''}
                                            onChange={(e) => {
                                              const updated = coursesList.map((c, i) =>
                                                i === idx ? { ...c, originalPrice: Number(e.target.value) || 0 } : c
                                              );
                                              setFormData({ ...formData, bonusMasterclasses: updated });
                                            }}
                                            className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:border-[#900606]"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                                            Badge
                                          </label>
                                          <input
                                            type="text"
                                            value={course.badge || '100% Free'}
                                            onChange={(e) => {
                                              const updated = coursesList.map((c, i) =>
                                                i === idx ? { ...c, badge: e.target.value } : c
                                              );
                                              setFormData({ ...formData, bonusMasterclasses: updated });
                                            }}
                                            className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:border-[#900606]"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                                          Image Path
                                        </label>
                                        <input
                                          type="text"
                                          value={course.image || ''}
                                          onChange={(e) => {
                                            const updated = coursesList.map((c, i) =>
                                              i === idx ? { ...c, image: e.target.value } : c
                                            );
                                            setFormData({ ...formData, bonusMasterclasses: updated });
                                          }}
                                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:border-[#900606]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-neutral-600 mb-0.5">
                                          Short Description
                                        </label>
                                        <textarea
                                          rows="2"
                                          value={course.description || ''}
                                          onChange={(e) => {
                                            const updated = coursesList.map((c, i) =>
                                              i === idx ? { ...c, description: e.target.value } : c
                                            );
                                            setFormData({ ...formData, bonusMasterclasses: updated });
                                          }}
                                          className="w-full bg-white border border-neutral-200 rounded px-2 py-1 text-xs outline-none focus:border-[#900606] resize-none"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:bg-neutral-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-5 py-2 text-white rounded-xl font-bold text-xs shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 transition-colors ${
                    modalType === 'thumbnail-bundle'
                      ? 'bg-purple-700 hover:bg-purple-800'
                      : 'bg-[#DC2626] hover:bg-[#C81E1E]'
                  }`}
                >
                  {isSaving ? (
                    'Saving...'
                  ) : editingProduct ? (
                    modalType === 'thumbnail-bundle'
                      ? 'Update Thumbnail Bundle'
                      : modalType === 'bundle'
                      ? 'Update Creator Bundle'
                      : 'Update Individual Product'
                  ) : (
                    modalType === 'thumbnail-bundle'
                      ? '+ Add Thumbnail Bundle'
                      : modalType === 'bundle'
                      ? '+ Add Creator Bundle'
                      : '+ Add Individual Product'
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 4. DASHBOARD FOOTER */}
      <div className="pt-4 border-t border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
        <p>© 2026 CreatorsKit. Built for creators, by creators.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Categorized DB active
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
          setDeleteModal({ isOpen: false, product: null, title: '', message: '', isDeleting: false })
        }
        onConfirm={handleConfirmDeleteProduct}
        title={deleteModal.title || 'Delete Product?'}
        message={deleteModal.message || 'Are you sure you want to delete this product?'}
        isDeleting={deleteModal.isDeleting}
      />

    </div>
  );
}
