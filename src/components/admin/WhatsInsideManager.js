'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WhatsInsideManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    image: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/whats-inside');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch whats inside items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      image: item.image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/whats-inside/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(p => p._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/whats-inside/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setItems(items.map(p => p._id === editingItem._id ? data.data : p));
          setIsModalOpen(false);
          setEditingItem(null);
          setFormData(initialFormState);
        } else {
          alert('Failed to update: ' + data.message);
        }
      } else {
        const res = await fetch('/api/whats-inside', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          setItems([data.data, ...items]);
          setIsModalOpen(false);
          setFormData(initialFormState);
        } else {
          alert('Failed to create: ' + data.error);
        }
      }
    } catch (err) {
      console.error('Failed to save item', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse mt-12">
        <div className="h-10 bg-neutral-800/60 rounded w-1/4 mb-4"></div>
        <div className="bg-neutral-900/40 border border-neutral-800/40 rounded-3xl p-8 h-64"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-900/60 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-100">Manage What's Inside Grid</h2>
        <button 
          onClick={handleAddNewClick}
          className="px-6 py-2 bg-primary hover:bg-primary/80 text-neutral-100 font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          + Add New Item
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-800/50">
              <th className="pb-4 pr-4">Item Name</th>
              <th className="pb-4 px-4 w-[40%]">Description</th>
              <th className="pb-4 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {items.map((p) => (
              <tr key={p._id} className="hover:bg-neutral-800/20 transition-colors">
                <td className="py-5 pr-4">
                  <div className="flex items-center gap-4">
                    {p.image ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 flex-shrink-0 flex items-center justify-center text-neutral-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-neutral-200">{p.name}</div>
                      {p.image && <div className="text-xs text-neutral-500 mt-1 font-mono truncate max-w-[150px]">{p.image}</div>}
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4 text-sm text-neutral-400">
                  {p.description ? (p.description.length > 80 ? p.description.substring(0, 80) + '...' : p.description) : '-'}
                </td>
                <td className="py-5 pl-4 text-right align-middle">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg transition-colors border border-neutral-700 hover:border-neutral-600"
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
                <td colSpan="3" className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-neutral-500 text-lg">No items found.</p>
                    <p className="text-neutral-600 text-sm">Use <strong>+ Add New Item</strong> above to create one.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-background border border-neutral-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-neutral-100">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-100 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-8 py-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Item Name</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Image URL</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    placeholder="/image.jpg or https://..."
                  />
                </div>
              </div>
              <div className="px-8 py-6 border-t border-neutral-800 bg-neutral-900/50 rounded-b-3xl flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary hover:bg-primary/80 disabled:opacity-50 text-neutral-100 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
