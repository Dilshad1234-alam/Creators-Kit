'use client';

import { useEffect, useState } from 'react';

export default function ContentManager({ tab }) {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If tab === 'legal', fetch from /api/policies
    // Otherwise fetch from /api/content
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'legal' ? '/api/policies' : '/api/content';
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setContentItems(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key, newValue) => {
    try {
      const endpoint = tab === 'legal' ? '/api/policies' : '/api/content';
      const res = await fetch(endpoint, {
        method: 'POST', // POST handles upsert in our API
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: newValue }), // Note: for Policy it expects {key, title, content}
      });
      if (res.ok) {
        // Optimistic UI update or re-fetch
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update content', err);
    }
  };

  if (loading) return <div className="text-zinc-400">Loading {tab} content...</div>;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">
      <h2 className="text-2xl font-bold text-white mb-8 capitalize">{tab} Management</h2>
      <div className="space-y-6">
        {contentItems.map((item) => (
          <div key={item._id} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
            <h3 className="font-bold text-zinc-300 mb-4">{item.key || item.title}</h3>
            {typeof item.value === 'string' || item.content ? (
              <textarea 
                className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#FF3B14] min-h-[100px]"
                defaultValue={item.value || item.content}
                onBlur={(e) => {
                  if (tab === 'legal') {
                    // Update policy
                    fetch(`/api/policies/${item._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ content: e.target.value })
                    }).then(() => fetchData());
                  } else {
                    handleUpdate(item.key, e.target.value);
                  }
                }}
              />
            ) : (
              <pre className="text-xs text-zinc-500 bg-[#0B0D0E] p-4 rounded-xl overflow-x-auto">
                {JSON.stringify(item.value, null, 2)}
                <br/>
                {/* Advanced editor would be needed for JSON arrays, keeping it simple for now */}
                <span className="text-[#FF3B14] mt-2 block">JSON structures require advanced editor.</span>
              </pre>
            )}
          </div>
        ))}
        {contentItems.length === 0 && (
          <div className="text-center text-zinc-500 py-10">No records found. Run the seeder to populate default content.</div>
        )}
      </div>
    </div>
  );
}
