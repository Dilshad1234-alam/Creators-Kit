'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imagekit';
import { useRouter } from 'next/navigation';
import DeleteConfirmModal from './DeleteConfirmModal';

export const getProductImageForBlog = (productName = '', customProductImage = '') => {
  if (customProductImage && customProductImage.trim() !== '') {
    return customProductImage;
  }
  const pLower = (productName || '').toLowerCase();
  if (pLower.includes('mic')) return '/wireless-mic.jpg';
  if (pLower.includes('tripod') || pLower.includes('stand')) return '/tripod.jpg';
  if (pLower.includes('ring') || pLower.includes('light')) return '/ring.jpg';
  if (pLower.includes('bundle') || pLower.includes('kit')) return '/banner 6.png';
  if (pLower.includes('gimbal') || pLower.includes('chorma') || pLower.includes('rig') || pLower.includes('green')) return '/chorma.jpg';
  return '/ring.jpg';
};

export default function BlogsManager() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blog: null,
    isDeleting: false,
  });

  // Filter & Header States matching Orders page
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    author: '',
    product: '',
    productImage: '',
    image: '',
    videoUrl: '',
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/blogs', { cache: 'no-store' });
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        author: blog.author || '',
        product: blog.product || '',
        productImage: blog.productImage || getProductImageForBlog(blog.product, blog.productImage),
        image: blog.image || '',
        videoUrl: blog.videoUrl || blog.video || '',
      });
    } else {
      setEditingBlog(null);
      setFormData({
        author: '',
        product: '',
        productImage: '',
        image: '/blog.jpg',
        videoUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = !!editingBlog;
      const targetId = editingBlog ? (editingBlog._id || editingBlog.slug) : '';
      const url = isEdit ? `/api/blogs/${targetId}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const resolvedProductImage = (formData.productImage && formData.productImage.trim())
        ? formData.productImage.trim()
        : getProductImageForBlog(formData.product);

      const payload = {
        author: formData.author,
        product: formData.product,
        productImage: resolvedProductImage,
        image: formData.image,
        videoUrl: formData.videoUrl,
        title: editingBlog?.title || (formData.product ? `${formData.author} - ${formData.product}` : `${formData.author}'s Review`),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save review');
      }
      
      await fetchBlogs();
      router.refresh();
      closeModal();
      setFormData({ author: '', product: '', productImage: '', image: '', videoUrl: '' });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDelete = (blog) => {
    setDeleteModal({
      isOpen: true,
      blog,
      isDeleting: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.blog) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    const blog = deleteModal.blog;
    try {
      const targetId = blog.slug || blog._id;
      const res = await fetch(`/api/blogs/${targetId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete blog');

      setBlogs((prev) => prev.filter((b) => (b.slug || b._id) !== targetId));
      setDeleteModal({ isOpen: false, blog: null, isDeleting: false });
      router.refresh();
    } catch (error) {
      console.error('Failed to delete blog:', error);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Export Reviews Report to CSV matching Orders page pattern
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Author,Featured Gear,Product Image,Image,Video URL,Published Date\n' +
      blogs
        .map(
          (b) =>
            `"${(b.author || '').replace(/"/g, '""')}","${(b.product || '').replace(/"/g, '""')}","${(b.productImage || '').replace(/"/g, '""')}","${(b.image || '').replace(/"/g, '""')}","${(b.videoUrl || '').replace(/"/g, '""')}","${new Date(b.createdAt || Date.now()).toLocaleDateString('en-US')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Reviews_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter blogs by search query
  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      blog.author?.toLowerCase().includes(q) ||
      blog.product?.toLowerCase().includes(q) ||
      blog.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      
      {/* 1. TOP HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Blogs
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Manage creator stories and journal blog posts in real-time.
          </p>
        </div>

        {/* Right Controls: Date Picker, Export Report & Add Blog */}
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

          {/* Add Blog Action Button */}
          <button
            type="button"
            onClick={() => openModal()}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Blog</span>
          </button>

        </div>
      </div>

      {/* 2. MAIN BLOGS CARD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs by title, author, or gear..."
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

        {/* Blogs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3.5 px-3 font-bold w-[12%]">IMAGE</th>
                <th className="py-3.5 px-3 font-bold w-[12%]">PRODUCT ICON</th>
                <th className="py-3.5 px-3 font-bold w-[24%]">CREATOR / AUTHOR</th>
                <th className="py-3.5 px-3 font-bold w-[24%]">FEATURED GEAR</th>
                <th className="py-3.5 px-3 font-bold w-[14%]">DATE</th>
                <th className="py-3.5 px-3 text-right font-bold w-[14%]">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-3">
                      <div className="w-14 h-11 bg-neutral-100 rounded-lg"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-11 h-11 bg-neutral-100 rounded-lg"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-32 h-4 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-28 h-4 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="w-16 h-4 bg-neutral-100 rounded"></div>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <div className="w-16 h-7 bg-neutral-100 rounded-lg ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-neutral-50/70 transition-colors group">
                    {/* Creator Image Thumbnail */}
                    <td className="py-4 px-3 align-middle">
                      <div className="w-14 h-11 relative rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-2xs flex-shrink-0">
                        <img 
                          src={getImageUrl(blog.image || '/blog.jpg')} 
                          alt={blog.author || 'thumbnail'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {blog.videoUrl && (
                          <span className="absolute bottom-1 right-1 bg-black/75 text-white rounded p-0.5" title="Video Review Available">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                              <polygon points="5 3 19 10 5 17 5 3" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product Icon Thumbnail */}
                    <td className="py-4 px-3 align-middle">
                      <div className="w-11 h-11 relative rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/90 shadow-2xs flex-shrink-0 p-1 flex items-center justify-center">
                        <img 
                          src={getImageUrl(getProductImageForBlog(blog.product, blog.productImage))} 
                          alt={blog.product || 'product'} 
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => { e.currentTarget.src = '/ring.jpg'; }}
                        />
                      </div>
                    </td>

                    {/* Creator / Author */}
                    <td className="py-4 px-3 align-middle">
                      <div className="font-bold text-neutral-900 group-hover:text-[#900606] transition-colors">
                        {blog.author || 'Anonymous Creator'}
                      </div>
                    </td>

                    {/* Featured Gear */}
                    <td className="py-4 px-3 align-middle">
                      {blog.product ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-semibold border border-neutral-200/60 truncate max-w-[200px]">
                          {blog.product}
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-normal">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-3 align-middle text-neutral-600 font-medium">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recent'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-3 text-right align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openModal(blog)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Edit Review"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => requestDelete(blog)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Review"
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
              {!isLoading && filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-neutral-400">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">No reviews found</p>
                    <p className="text-xs">
                      {searchQuery
                        ? `No creator reviews match your search criteria "${searchQuery}"`
                        : 'No creator reviews in MongoDB yet. Create your first review!'}
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

      {/* 4. MODAL: ADD / EDIT BLOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                  {editingBlog ? 'Edit Creator Review' : 'Add New Creator Review'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {editingBlog
                    ? 'Update the author, featured gear, media, and product thumbnail.'
                    : 'Create and publish a verified creator review to showcase on your storefront.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Author / Creator Name
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    placeholder="e.g. Priya Verma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                    Featured Gear
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    placeholder="e.g. VoiceForge Wireless Mic"
                  />
                </div>
              </div>

              {/* Product Thumbnail Image URL / Path with Live Preview */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Product Thumbnail Image URL / Path
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="productImage"
                    value={formData.productImage}
                    onChange={handleChange}
                    className="flex-1 bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    placeholder="e.g. /ring.jpg, /wireless-mic.jpg, /tripod.jpg or ImageKit URL"
                  />
                  {(formData.productImage || formData.product) && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0 shadow-2xs p-0.5">
                      <img
                        src={getImageUrl(getProductImageForBlog(formData.product, formData.productImage))}
                        alt="Product Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-normal">
                  Shows as the product icon at the bottom-left of the creator review card on the homepage.
                </p>
              </div>

              {/* Creator Image URL / Path (Review Photo) with Live Preview Thumbnail */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Creator Image URL / Path (Review Photo)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image"
                    required
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                    placeholder="/blog1.jpg"
                  />
                  {formData.image && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex-shrink-0 shadow-2xs">
                      <img
                        src={getImageUrl(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Video URL / Path (Optional) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Video URL / Path (Optional)
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                  placeholder="https://example.com/video.mp4 or YouTube link"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingBlog
                    ? 'Update Review'
                    : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom In-App Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, blog: null, isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
        title="Delete Review?"
        message={
          deleteModal.blog
            ? `Are you sure you want to delete ${deleteModal.blog.author ? `"${deleteModal.blog.author}'s review"` : 'this review'}? This action cannot be undone.`
            : 'Are you sure you want to delete this review?'
        }
        isDeleting={deleteModal.isDeleting}
      />

    </div>
  );
}