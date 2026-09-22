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

  if (loading) return <div className="text-neutral-600 dark:text-neutral-400">Loading {tab} content...</div>;

  return (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-4 sm:p-6 md:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 capitalize">{tab} Management</h2>
        {tab === 'content' && (
          <button 
            onClick={handleUpdateContent}
            disabled={isSaving}
            className="px-6 py-2 bg-primary hover:bg-primary/80 text-neutral-900 dark:text-neutral-100 font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {tab === 'legal' ? (
          contentItems.map((item) => (
            <div key={item._id} className="bg-white dark:bg-neutral-950 p-4 sm:p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-bold text-neutral-700 dark:text-neutral-300 mb-4">{item.title}</h3>
              <textarea 
                className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 text-neutral-900 dark:text-neutral-100 outline-none focus:border-primary min-h-[100px]"
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
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
               <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">Homepage Content</h3>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Badge Text</label>
                 <input type="text" value={contentMap['hero_badge'] !== undefined ? contentMap['hero_badge'] : '🔥 All-in-One Creator Bundle'} onChange={(e) => handleContentChange('hero_badge', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Subheading</label>
                 <input type="text" value={contentMap['hero_subheading'] !== undefined ? contentMap['hero_subheading'] : 'The Complete Creator Bundle'} onChange={(e) => handleContentChange('hero_subheading', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Heading</label>
                 <input type="text" value={contentMap['hero_heading'] !== undefined ? contentMap['hero_heading'] : 'Unbox your potential'} onChange={(e) => handleContentChange('hero_heading', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Description</label>
                 <textarea value={contentMap['hero_description'] !== undefined ? contentMap['hero_description'] : 'Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.'} onChange={(e) => handleContentChange('hero_description', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none h-24" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Button 1 Text</label>
                   <input type="text" value={contentMap['hero_btn1_text'] !== undefined ? contentMap['hero_btn1_text'] : 'Get Your Creator Kit'} onChange={(e) => handleContentChange('hero_btn1_text', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Button 2 Text</label>
                   <input type="text" value={contentMap['hero_btn2_text'] !== undefined ? contentMap['hero_btn2_text'] : 'Explore What\'s Inside'} onChange={(e) => handleContentChange('hero_btn2_text', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
               <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">Product Page Content</h3>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Badge Text</label>
                 <input type="text" value={contentMap['product_badge_text'] !== undefined ? contentMap['product_badge_text'] : 'SAVE 55%'} onChange={(e) => handleContentChange('product_badge_text', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Hero Heading</label>
                 <input type="text" value={contentMap['product_hero_heading'] !== undefined ? contentMap['product_hero_heading'] : 'PROFESSIONAL LED RING LIGHT'} onChange={(e) => handleContentChange('product_hero_heading', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Hero Description</label>
                 <textarea value={contentMap['product_hero_desc'] !== undefined ? contentMap['product_hero_desc'] : 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.'} onChange={(e) => handleContentChange('product_hero_desc', e.target.value)} className="w-full bg-white dark:bg-background border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:border-primary outline-none h-24" />
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
