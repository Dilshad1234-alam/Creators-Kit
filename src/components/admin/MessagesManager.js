'use client';
import { useState, useEffect } from 'react';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessages(messages.filter(m => m._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#900606]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFBF7] border border-neutral-200 rounded-3xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 to-neutral-500 tracking-tight mb-1">Customer Messages</h2>
          <p className="text-sm text-neutral-600">View and manage contact inquiries.</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#900606] animate-pulse"></div>
          <span className="text-xs font-bold text-neutral-700">{messages.length} Total Messages</span>
        </div>
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left border-collapse min-w-max md:min-w-full">
          <thead>
            <tr className="text-neutral-600 uppercase text-[10px] font-black tracking-widest border-b border-neutral-200">
              <th className="pb-4 pr-4 w-[20%]">Date & Time</th>
              <th className="pb-4 px-4 w-[25%]">Customer Info</th>
              <th className="pb-4 px-4 w-[45%]">Message</th>
              <th className="pb-4 px-4 w-[10%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/30">
            {messages.map((m) => (
              <tr key={m._id} className="hover:bg-neutral-100 transition-colors">
                <td className="py-4 pr-4 align-top">
                  <div className="font-bold text-[#900606] text-sm mb-1">{new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-xs text-neutral-500 font-mono">{new Date(m.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="font-bold text-neutral-800 text-sm mb-1">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="text-sm text-neutral-600 hover:text-[#900606]">{m.email}</a>
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="text-sm text-neutral-700 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar">{m.message}</div>
                </td>
                <td className="py-4 pl-4 text-right align-top">
                  <button 
                    onClick={() => handleDelete(m._id)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td colSpan="4" className="py-12 text-center text-neutral-500">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
