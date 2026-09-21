'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    image: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
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
        title: blog.title || '',
        author: blog.author || '',
        image: blog.image || '',
        excerpt: blog.excerpt || '',
        content: blog.content || ''
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        author: '',
        image: '',
        excerpt: '',
        content: ''
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
    try {
      const isEdit = !!editingBlog;
      const url = isEdit ? `/api/blogs/${editingBlog.slug}` : '/api/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save blog');
      
      await fetchBlogs();
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete blog');
      
      setBlogs(prev => prev.filter(b => b.slug !== slug));
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) return <div className="text-white">Loading blogs...</div>;

  return (
    <div className="bg-neutral-900/50 rounded-3xl border border-neutral-800 p-8 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Manage Blogs</h2>
        <button 
          onClick={() => openModal()} 
          className="bg-primary text-black font-bold px-6 py-3 rounded-full hover:bg-primary-hover transition-colors"
        >
          + Add New Blog
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-neutral-300">
          <thead className="text-xs uppercase bg-neutral-800/50 text-neutral-400">
            <tr>
              <th className="px-6 py-4 rounded-tl-xl rounded-bl-xl">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 rounded-tr-xl rounded-br-xl text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-16 h-12 relative rounded-md overflow-hidden bg-neutral-950 border border-neutral-800">
                    <img 
                      src={blog.image || '/placeholder.png'} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{blog.title}</td>
                <td className="px-6 py-4">{blog.author}</td>
                <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(blog)} className="text-primary hover:text-white mr-4 transition-colors font-medium">Edit</button>
                  <button onClick={() => handleDelete(blog.slug)} className="text-red-500 hover:text-red-400 transition-colors font-medium">Delete</button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-neutral-500">
                  No blogs found. Create your first post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  value={formData.title} 
                  onChange={handleChange} 
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="The Exact Lighting & Audio Setup..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Author</label>
                  <input 
                    type="text" 
                    name="author" 
                    required
                    value={formData.author} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    required
                    value={formData.image} 
                    onChange={handleChange} 
                    className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="/kits 16.jpg - Edited.png"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Excerpt (Short Description)</label>
                <textarea 
                  name="excerpt" 
                  required
                  value={formData.excerpt} 
                  onChange={handleChange} 
                  rows="2"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="A short summary of the blog post..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Full Content</label>
                <textarea 
                  name="content" 
                  required
                  value={formData.content} 
                  onChange={handleChange} 
                  rows="6"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Write your rich blog content here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-6 py-3 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-black font-bold px-8 py-3 rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
                >
                  {editingBlog ? 'Update Blog' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
