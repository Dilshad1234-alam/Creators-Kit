'use client';

import { useEffect, useState } from 'react';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: '',
    expiryDate: '',
    applicableProduct: 'ALL'
  });

  useEffect(() => {
    fetchCoupons();
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
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([data.data, ...coupons]);
        setIsModalOpen(false);
        setFormData({ code: '', discountType: 'percentage', discountAmount: '', expiryDate: '', applicableProduct: 'ALL' });
      } else {
        alert(data.error || 'Failed to create coupon');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.map(c => c._id === id ? data.data : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-neutral-400">Loading coupons...</div>;

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-100">Coupons & Discounts</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-neutral-100 px-4 py-2 rounded-xl font-bold transition-colors"
        >
          + Create Coupon
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-800">
              <th className="pb-4 pr-4">Code</th>
              <th className="pb-4 px-4">Discount</th>
              <th className="pb-4 px-4">Applies To</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4">Expiry</th>
              <th className="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-5 pr-4 font-mono font-bold text-neutral-100 align-top">{c.code}</td>
                <td className="py-5 px-4 align-top text-neutral-300 font-medium">
                  {c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}
                </td>
                <td className="py-5 px-4 align-top">
                  {c.applicableProduct === 'ALL' ? (
                    <span className="text-neutral-400 text-sm">Site-wide</span>
                  ) : (
                    <span className="text-blue-400 text-sm bg-blue-400/10 px-2 py-1 rounded-md border border-blue-400/20">Specific Product</span>
                  )}
                </td>
                <td className="py-5 px-4 align-top">
                  <button 
                    onClick={() => toggleStatus(c._id, c.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                      c.isActive 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                        : 'bg-neutral-800/50 text-neutral-500 border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-5 px-4 align-top text-neutral-400 text-sm">
                  {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                </td>
                <td className="py-5 px-4 align-top text-right">
                  <button 
                    onClick={() => deleteCoupon(c._id)}
                    className="text-red-500 hover:text-red-400 font-medium text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-neutral-500">
                  <p className="mb-4">No coupons found. Create one to get started.</p>
                  <button 
                    onClick={async () => {
                      const res = await fetch('/api/seed', { method: 'POST' });
                      const data = await res.json();
                      if (data.success) {
                        alert('Database seeded successfully!');
                        fetchCoupons();
                      } else {
                        alert('Failed to seed: ' + data.error);
                      }
                    }}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 px-6 py-2 rounded-xl font-bold transition-colors"
                  >
                    Instant Database Seeder
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/60 backdrop-blur-sm">
          <div className="bg-background border border-neutral-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-neutral-100 mb-6">Create New Coupon</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. CREATOR20"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-primary font-mono uppercase"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-bold text-neutral-400 mb-1">Type</label>
                  <select 
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-primary"
                    value={formData.discountType}
                    onChange={e => setFormData({...formData, discountType: e.target.value})}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div className="w-2/3">
                  <label className="block text-sm font-bold text-neutral-400 mb-1">Amount</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-primary"
                    value={formData.discountAmount}
                    onChange={e => setFormData({...formData, discountAmount: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-1">Apply To</label>
                <select 
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-primary"
                  value={formData.applicableProduct}
                  onChange={e => setFormData({...formData, applicableProduct: e.target.value})}
                >
                  <option value="ALL">All Products (Site-wide)</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-400 mb-1">Expiry Date (Optional)</label>
                <input 
                  type="date" 
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 outline-none focus:border-primary [color-scheme:dark]"
                  value={formData.expiryDate}
                  onChange={e => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-neutral-100 bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
