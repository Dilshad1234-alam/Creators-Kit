'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import WhatsInsideManager from './WhatsInsideManager';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Creating, object = Editing
  
  const initialFormState = {
    name: '',
    description: '',
    subheading: '',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    images: ['', '', '', '', ''],
    category: 'both',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      subheading: product.subheading || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock || '',
      image: product.image || '',
      images: product.images && product.images.length > 0 
        ? [...product.images.map(img => img.src), ...Array(5).fill('')].slice(0, 5)
        : [product.image || '', '', '', '', ''],
      category: product.category || 'both',
    });
    setIsModalOpen(true);
  };

  const handleAddNewClick = (defaultCategory = 'both') => {
    setEditingProduct(null);
    setFormData({ ...initialFormState, category: defaultCategory });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    // Confirmation removed to delete directly
    
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        images: formData.images.filter(url => url.trim() !== '').map(url => ({ src: url })),
        category: formData.category || 'both',
      };

      if (editingProduct) {
        // Update Existing
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts(products.map(p => p._id === editingProduct._id ? data.data : p));
          setIsModalOpen(false);
          setEditingProduct(null);
          setFormData(initialFormState);
        } else {
          alert('Failed to update product: ' + data.message);
        }
      } else {
        // Create New
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setProducts([data.data, ...products]);
          setIsModalOpen(false);
          setFormData(initialFormState);
        } else {
          alert('Failed to create product: ' + data.error);
        }
      }
    } catch (err) {
      console.error('Failed to save product', err);
    } finally {
      setIsSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-neutral-100 dark:bg-neutral-800/60 rounded w-1/4 mb-4"></div>
        <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/40 rounded-3xl p-8 h-96"></div>
      </div>
    );
  }

  const renderTable = (title, items, defaultCategory) => (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
        <button 
          onClick={() => handleAddNewClick(defaultCategory)}
          className="px-6 py-2 bg-primary hover:bg-primary/80 text-neutral-900 dark:text-neutral-100 font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          + Add New Product
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-200 dark:border-neutral-800/50">
              <th className="pb-4 pr-4">Product Name</th>
              <th className="pb-4 px-4 w-[25%]">Description</th>
              <th className="pb-4 px-4">Price (₹)</th>
              <th className="pb-4 px-4">Original Price (₹)</th>
              <th className="pb-4 px-4">Stock</th>
              <th className="pb-4 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-neutral-100 dark:bg-neutral-800/20 transition-colors">
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-4">
                    {p.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex-shrink-0 flex items-center justify-center text-neutral-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-neutral-800 dark:text-neutral-200">{p.name}</div>
                      {p.image && <div className="text-xs text-neutral-500 mt-1 font-mono truncate max-w-[150px]">{p.image}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 text-sm text-neutral-600 dark:text-neutral-400">
                  {p.description ? (p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description) : '-'}
                </td>
                <td className="py-5 px-4 text-neutral-700 dark:text-neutral-300 font-medium">
                  {p.price.toLocaleString()}
                </td>
                <td className="py-5 px-4 text-neutral-500 line-through text-sm">
                  {p.originalPrice ? p.originalPrice.toLocaleString() : '-'}
                </td>
                <td className="py-5 px-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                    p.stock > 10 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : p.stock > 0
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {p.stock}
                  </span>
                </td>
                <td className="py-5 pl-4 text-right align-middle">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold rounded-lg transition-colors border border-neutral-700 hover:border-neutral-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-neutral-500 text-lg">No products found.</p>
                    <p className="text-neutral-600 text-sm">Use <strong>+ Add New Product</strong> above to create one.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const bundleProducts = products.filter(p => !p.category || p.category === 'bundle' || p.category === 'both');
  const individualProducts = products.filter(p => !p.category || p.category === 'individual' || p.category === 'both');

  return (
    <div className="space-y-6 relative">
      {renderTable('Manage Bundle Products', bundleProducts, 'bundle')}
      {renderTable('Manage Individual Pieces (Need Just One Piece)', individualProducts, 'individual')}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-surface/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="px-8 pt-8 pb-6 shrink-0 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 m-0">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmitForm} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-8 py-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Product Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    placeholder="e.g. Creators Kit 25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Subheading (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.subheading}
                    onChange={(e) => setFormData({...formData, subheading: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    placeholder="e.g., CREATOR BUNDLE - COMPLETE SETUP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">Placement Category</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center text-center transition-colors ${formData.category === 'bundle' ? 'bg-primary/10 border-primary text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-700'}`}>
                    <input type="radio" name="category" value="bundle" className="hidden" checked={formData.category === 'bundle'} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    <span className="font-bold text-sm">Bundle Only</span>
                    <span className="text-[10px] opacity-70 mt-1">Main Kit Items</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center text-center transition-colors ${formData.category === 'individual' ? 'bg-primary/10 border-primary text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-700'}`}>
                    <input type="radio" name="category" value="individual" className="hidden" checked={formData.category === 'individual'} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    <span className="font-bold text-sm">Individual Only</span>
                    <span className="text-[10px] opacity-70 mt-1">Need Just One Piece</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center text-center transition-colors ${formData.category === 'both' ? 'bg-primary/10 border-primary text-neutral-900 dark:text-neutral-100' : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-700'}`}>
                    <input type="radio" name="category" value="both" className="hidden" checked={formData.category === 'both'} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    <span className="font-bold text-sm">Both Sections</span>
                    <span className="text-[10px] opacity-70 mt-1">Shows everywhere</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Description</label>
                <textarea 
                  required 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-y"
                  placeholder="Product description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Price (₹)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Original Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Stock</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              {(formData.category === 'bundle' || formData.category === 'both') ? (
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Product Gallery Images (Up to 5)</label>
                  <div className="space-y-2">
                    {formData.images.map((url, index) => (
                      <input 
                        key={index}
                        type="text" 
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev, 
                            images: newImages,
                            ...(index === 0 ? { image: e.target.value } : {})
                          }));
                        }}
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        placeholder={`Image URL ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Image URL</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    placeholder="/kits 25.jpg"
                  />
                </div>
              )}
            </div>

              <div className="px-8 py-6 shrink-0 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3 bg-white dark:bg-neutral-950/30 rounded-b-3xl">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                  className="px-6 py-3 bg-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:text-neutral-100 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary hover:bg-primary/80 text-neutral-900 dark:text-neutral-100 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <WhatsInsideManager />
    </div>
  );
}
