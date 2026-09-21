'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function HomepageFeaturesManager() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    useCase: '',
    benefit: '',
    icon: '',
    image: '',
    order: 0
  });

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const res = await fetch('/api/homepage-features');
      const data = await res.json();
      if (data.success) {
        setFeatures(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch features', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      features: '',
      useCase: '',
      benefit: '',
      icon: '',
      image: '',
      order: features.length + 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      features: Array.isArray(item.features) ? item.features.join(', ') : item.features,
      useCase: item.useCase || '',
      benefit: item.benefit || '',
      icon: item.icon || '',
      image: item.image || '',
      order: item.order || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/homepage-features/${id}`, { method: 'DELETE' });
      fetchFeatures();
    } catch (error) {
      console.error('Failed to delete feature', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Convert comma-separated string back to array
    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    try {
      const url = editingItem 
        ? `/api/homepage-features/${editingItem._id}`
        : '/api/homepage-features';
        
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchFeatures();
      }
    } catch (error) {
      console.error('Failed to save feature', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-400 mt-8">Loading Homepage Features...</div>;

  return (
    <>
      <div className="bg-neutral-900/60 border border-neutral-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-100">Manage Homepage Features (Kit Components)</h2>
          <button 
            onClick={handleAddNew}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-neutral-100 font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          >
            + Add New Feature
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-neutral-500 uppercase text-xs font-black tracking-wider border-b border-neutral-800/50">
                <th className="pb-4 pr-4">Order</th>
                <th className="pb-4 pr-4">Name</th>
                <th className="pb-4 px-4 w-[40%]">Description</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {features.map((item) => (
                <tr key={item._id} className="hover:bg-neutral-800/20 transition-colors">
                  <td className="py-5 pr-4 text-neutral-400 font-bold">{item.order}</td>
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-700/50">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xl">{item.icon}</div>
                        )}
                      </div>
                      <span className="font-bold text-neutral-100">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-sm text-neutral-400 line-clamp-2">{item.description}</p>
                  </td>
                  <td className="py-5 pl-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-bold rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-500 text-xs font-bold rounded-lg transition-colors border border-red-900/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {features.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              No homepage features found. Click "+ Add New Feature" to create one.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-background border border-neutral-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-neutral-100">
                {editingItem ? 'Edit Feature' : 'Add New Feature'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-100 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-8 py-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Feature Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Order</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                    />
                  </div>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Icon (Emoji)</label>
                    <input 
                      type="text" 
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Image URL (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Bullet Features (Comma Separated)</label>
                  <textarea 
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    rows="2"
                    placeholder="E.g. High brightness, Adjustable stand, 3 color modes"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Use Case</label>
                    <textarea 
                      value={formData.useCase}
                      onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                      rows="2"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">Benefit</label>
                    <textarea 
                      value={formData.benefit}
                      onChange={(e) => setFormData({...formData, benefit: e.target.value})}
                      rows="2"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:border-primary outline-none transition-all resize-none"
                    ></textarea>
                  </div>
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
                  {isSaving ? 'Saving...' : 'Save Feature'}
                </button>
              </div>
            </form>
          </div>
        </div>, document.body
      )}
    </>
  );
}
