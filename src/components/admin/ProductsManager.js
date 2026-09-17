'use client';

import { useEffect, useState } from 'react';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleUpdate = async (id, updatedField) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedField),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p._id === id ? data.data : p));
      }
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

  if (loading) return <div className="text-zinc-400">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Manage Products & Pricing</h2>
          <button className="px-6 py-2 bg-[#FF3B14] hover:bg-[#E01900] text-white font-bold rounded-full transition-colors text-sm shadow-lg">
            + Add New Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 uppercase text-xs font-black tracking-wider border-b border-zinc-800">
                <th className="pb-4 pr-4">Product Name</th>
                <th className="pb-4 px-4 w-[25%]">Description</th>
                <th className="pb-4 px-4">Price (₹)</th>
                <th className="pb-4 px-4">Original Price (₹)</th>
                <th className="pb-4 px-4">Stock</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-5 pr-4 font-bold text-zinc-200">{p.name}</td>
                  <td className="py-5 px-4">
                    <textarea 
                      defaultValue={p.description || ''}
                      onBlur={(e) => handleUpdate(p._id, { description: e.target.value })}
                      className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 w-full text-sm text-zinc-300 focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none resize-y min-h-[42px] transition-all"
                      rows={2}
                    />
                  </td>
                  <td className="py-5 px-4">
                    <input 
                      type="number" 
                      defaultValue={p.price}
                      onBlur={(e) => handleUpdate(p._id, { price: Number(e.target.value) })}
                      className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 w-28 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all"
                    />
                  </td>
                  <td className="py-5 px-4">
                    <input 
                      type="number" 
                      defaultValue={p.originalPrice || ''}
                      onBlur={(e) => handleUpdate(p._id, { originalPrice: Number(e.target.value) })}
                      className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 w-28 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all"
                    />
                  </td>
                  <td className="py-5 px-4">
                    <input 
                      type="number" 
                      defaultValue={p.stock}
                      onBlur={(e) => handleUpdate(p._id, { stock: Number(e.target.value) })}
                      className="bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 w-20 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all"
                    />
                  </td>
                  <td className="py-5 pl-4 text-right">
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-colors border border-zinc-700">Save</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-zinc-500">No products found. Add some or run the seeder.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
