'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomepageFeaturesManager from './HomepageFeaturesManager';
import MasterclassesManager from './MasterclassesManager';

export default function ContentManager({ tab }) {
  const router = useRouter();
  const [contentMap, setContentMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'legal' ? '/api/policies' : '/api/content';
      const res = await fetch(endpoint, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        if (tab === 'legal') {
          setContentItems(data.data);
        } else {
          // Map array to object for easier form binding
          const map = {};
          data.data.forEach(item => {
            map[item.key] = item.value;
          });
          setContentMap(map);
          setContentItems(data.data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContent = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(contentMap)) {
        await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
      }
      alert('Content saved successfully!');
      router.refresh();
      fetchData();
    } catch (err) {
      console.error('Failed to save content', err);
      alert('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (key, value) => {
    setContentMap(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="text-zinc-400">Loading {tab} content...</div>;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white capitalize">{tab} Management</h2>
        {tab === 'content' && (
          <button 
            onClick={handleUpdateContent}
            disabled={isSaving}
            className="px-6 py-2 bg-[#FF3B14] hover:bg-[#FF3B14]/80 text-white font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(255,59,20,0.4)] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {tab === 'legal' ? (
          contentItems.map((item) => (
            <div key={item._id} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <h3 className="font-bold text-zinc-300 mb-4">{item.title}</h3>
              <textarea 
                className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-[#FF3B14] min-h-[100px]"
                defaultValue={item.content}
                onBlur={(e) => {
                  fetch(`/api/policies/${item._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: e.target.value })
                  }).then(() => fetchData());
                }}
              />
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
               <h3 className="font-bold text-xl text-white border-b border-zinc-800 pb-2">Homepage Content</h3>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Hero Subheading</label>
                 <input type="text" value={contentMap['hero_subheading'] || ''} onChange={(e) => handleContentChange('hero_subheading', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Hero Heading</label>
                 <input type="text" value={contentMap['hero_heading'] || ''} onChange={(e) => handleContentChange('hero_heading', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Hero Description</label>
                 <textarea value={contentMap['hero_description'] || ''} onChange={(e) => handleContentChange('hero_description', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none h-24" />
               </div>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
               <h3 className="font-bold text-xl text-white border-b border-zinc-800 pb-2">Product Page Content</h3>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Product Badge Text</label>
                 <input type="text" value={contentMap['product_badge_text'] || ''} onChange={(e) => handleContentChange('product_badge_text', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Product Hero Heading</label>
                 <input type="text" value={contentMap['product_hero_heading'] || ''} onChange={(e) => handleContentChange('product_hero_heading', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase">Product Hero Description</label>
                 <textarea value={contentMap['product_hero_desc'] || ''} onChange={(e) => handleContentChange('product_hero_desc', e.target.value)} className="w-full bg-[#0B0D0E] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-[#FF3B14] outline-none h-24" />
               </div>
            </div>

          </div>
        )}
      </div>

      {tab === 'content' && (
        <div className="space-y-8">
          <HomepageFeaturesManager />
          <MasterclassesManager />
        </div>
      )}
    </div>
  );
}
