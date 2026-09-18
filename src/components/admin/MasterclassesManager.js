'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function MasterclassesManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    badge: '',
    order: 0
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/homepage-masterclasses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      badge: '',
      order: courses.length + 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image || '',
      badge: item.badge || '',
      order: item.order || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/homepage-masterclasses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const url = editingItem 
        ? `/api/homepage-masterclasses/${editingItem._id}`
        : '/api/homepage-masterclasses';
        
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to save course', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-zinc-400 mt-8">Loading Mastery Courses...</div>;

  return (
    <>
      <div className="bg-zinc-900/60 border border-zinc-800/80 shadow-2xl rounded-3xl p-8 backdrop-blur-xl mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Manage Masterclasses / Mastery Courses</h2>
          <button 
            onClick={handleAddNew}
            className="px-6 py-2 bg-[#FF3B14] hover:bg-[#FF3B14]/80 text-white font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(255,59,20,0.4)]"
          >
            + Add New Course
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 uppercase text-xs font-black tracking-wider border-b border-zinc-800/50">
                <th className="pb-4 pr-4">Order</th>
                <th className="pb-4 pr-4">Course Title</th>
                <th className="pb-4 px-4 w-[40%]">Description</th>
                <th className="pb-4 px-4">Badge</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {courses.map((item) => (
                <tr key={item._id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="py-5 pr-4 text-zinc-400 font-bold">{item.order}</td>
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-700/50">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-xl">🎓</div>
                        )}
                      </div>
                      <span className="font-bold text-white">{item.title}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-sm text-zinc-400 line-clamp-2">{item.description}</p>
                  </td>
                  <td className="py-5 px-4">
                    {item.badge && (
                      <span className="bg-[#FF3B14]/10 text-[#FF3B14] px-3 py-1 rounded-full text-xs font-bold border border-[#FF3B14]/20">
                        {item.badge}
                      </span>
                    )}
                  </td>
                  <td className="py-5 pl-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-colors"
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
          {courses.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No courses found. Click "+ Add New Course" to create one.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#0B0D0E] border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 rounded-t-3xl">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-8 py-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Course Title</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Order</label>
                    <input 
                      required 
                      type="number" 
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Description</label>
                  <textarea 
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#FF3B14] focus:ring-1 focus:ring-[#FF3B14]/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Image URL</label>
                    <input 
                      type="text" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="e.g. https://example.com/image.png"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#FF3B14] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">Badge Text</label>
                    <input 
                      type="text" 
                      value={formData.badge}
                      onChange={(e) => setFormData({...formData, badge: e.target.value})}
                      placeholder="e.g. 100% Free"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:border-[#FF3B14] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 border-t border-zinc-800 bg-zinc-900/50 rounded-b-3xl flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#FF3B14] hover:bg-[#FF3B14]/80 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,59,20,0.3)] flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Course'}
                </button>
              </div>
            </form>
          </div>
        </div>, document.body
      )}
    </>
  );
}
