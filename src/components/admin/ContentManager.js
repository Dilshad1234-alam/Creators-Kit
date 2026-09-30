'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PolicyEditor = ({ item, onUpdate }) => {
  const [content, setContent] = useState(item.content);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`/api/policies/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(item.content); // revert changes
    setIsEditing(false);
  };

  return (
    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-neutral-200 flex flex-col gap-4 w-full transition-all">
      <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
        <h3 className="font-bold text-xl text-[#900606]">{item.title}</h3>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm font-bold text-[#900606] bg-[#900606]/10 px-4 py-1.5 rounded-full hover:bg-[#900606]/20 transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <div className="w-full">
        <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase">
          {item.title} Content
        </label>
        <textarea 
          className={`w-full border rounded-xl p-4 text-neutral-700 outline-none min-h-[250px] resize-y transition-colors ${
            isEditing 
              ? 'bg-white border-neutral-300 focus:border-[#900606] shadow-inner' 
              : 'bg-transparent border-transparent resize-none'
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Enter the ${item.title} content here...`}
          disabled={!isEditing}
        />
      </div>
      {isEditing && (
        <div className="flex justify-end gap-3 mt-2">
          <button 
            onClick={handleCancel}
            disabled={saving}
            className="text-neutral-600 font-medium px-6 py-2 rounded-full hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#900606] text-white font-medium px-6 py-2 rounded-full hover:bg-[#900606]/90 transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Policy'}
          </button>
        </div>
      )}
    </div>
  );
};
import HomepageFeaturesManager from './HomepageFeaturesManager';
import MasterclassesManager from './MasterclassesManager';

export default function ContentManager({ tab}) {
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
    const res = await fetch(endpoint, { cache: 'no-store'});
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
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ key, value}),
    });
    }
      
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
 setContentMap(prev => ({ ...prev, [key]: value}));
};

 if (loading) return <div className="text-neutral-600">Loading {tab} content...</div>;

 return (
 <div className="bg-[#FDFBF7] border border-neutral-200 rounded-[2rem] p-4 sm:p-6 md:p-8 backdrop-blur-xl">
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
 <h2 className="text-xl sm:text-2xl font-bold text-[#900606] capitalize">{tab} Management</h2>
 {tab === 'content' && (
 <button 
 onClick={handleUpdateContent}
 disabled={isSaving}
 className="px-6 py-2 bg-[#900606] hover:bg-[#900606]/80 text-white font-bold rounded-full transition-all duration-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50"
 >
 {isSaving ? 'Saving...' : 'Save Changes'}
 </button>
 )}
 </div>

 <div className="space-y-6">
 {tab === 'legal' ? (
  <div className="flex flex-col gap-6 w-full">
  {contentItems.map((item) => (
  <PolicyEditor key={item._id} item={item} onUpdate={fetchData} />
  ))}
  </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-neutral-200 space-y-4">
 <h3 className="font-bold text-xl text-[#900606] border-b border-neutral-200 pb-2">Homepage Content</h3>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Badge Text</label>
 <input type="text" value={contentMap['hero_badge'] !== undefined ? contentMap['hero_badge'] : '🔥 All-in-One Creator Bundle'} onChange={(e) => handleContentChange('hero_badge', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Subheading</label>
 <input type="text" value={contentMap['hero_subheading'] !== undefined ? contentMap['hero_subheading'] : 'The Complete Creator Bundle'} onChange={(e) => handleContentChange('hero_subheading', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Heading</label>
 <input type="text" value={contentMap['hero_heading'] !== undefined ? contentMap['hero_heading'] : 'Unbox your potential'} onChange={(e) => handleContentChange('hero_heading', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Hero Description</label>
 <textarea value={contentMap['hero_description'] !== undefined ? contentMap['hero_description'] : 'Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.'} onChange={(e) => handleContentChange('hero_description', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none h-24" />
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Button 1 Text</label>
 <input type="text" value={contentMap['hero_btn1_text'] !== undefined ? contentMap['hero_btn1_text'] : 'Get Your Creator Kit'} onChange={(e) => handleContentChange('hero_btn1_text', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Button 2 Text</label>
 <input type="text" value={contentMap['hero_btn2_text'] !== undefined ? contentMap['hero_btn2_text'] : 'Explore What\'s Inside'} onChange={(e) => handleContentChange('hero_btn2_text', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 </div>
 </div>

 <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-neutral-200 space-y-4">
 <h3 className="font-bold text-xl text-[#900606] border-b border-neutral-200 pb-2">Product Page Content</h3>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Badge Text</label>
 <input type="text" value={contentMap['product_badge_text'] !== undefined ? contentMap['product_badge_text'] : 'SAVE 55%'} onChange={(e) => handleContentChange('product_badge_text', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Hero Heading</label>
 <input type="text" value={contentMap['product_hero_heading'] !== undefined ? contentMap['product_hero_heading'] : 'PROFESSIONAL LED RING LIGHT'} onChange={(e) => handleContentChange('product_hero_heading', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none" />
 </div>
 <div>
 <label className="block text-xs font-bold text-neutral-500 mb-1 uppercase">Product Hero Description</label>
 <textarea value={contentMap['product_hero_desc'] !== undefined ? contentMap['product_hero_desc'] : 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.'} onChange={(e) => handleContentChange('product_hero_desc', e.target.value)} className="w-full bg-[#FDFBF7] border border-neutral-200 rounded-lg px-4 py-3 text-[#900606] focus:border-[#900606] outline-none h-24" />
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
