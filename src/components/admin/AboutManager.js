'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  Users,
  Clock,
  BarChart3,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Search,
  Globe,
  Layers,
  Award,
  BookOpen,
  ShoppingCart,
  Headphones,
  Star,
  Box,
  GraduationCap,
  Diamond
} from 'lucide-react';

export default function AboutManager() {
  const [activeTab, setActiveTab] = useState('team'); // 'team' | 'timeline' | 'stats' | 'general'
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('team'); // 'team' | 'timeline' | 'stat' | 'whyChoose'
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    section: '',
    id: null,
    title: '',
    message: '',
    isDeleting: false,
  });

  // Form states for items
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    desc: '',
    image: '',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    order: 1,
  });

  const [timelineForm, setTimelineForm] = useState({
    year: '',
    title: '',
    desc: '',
    order: 1,
  });

  const [statForm, setStatForm] = useState({
    value: '',
    label: '',
    icon: 'Users',
    order: 1,
  });

  const [whyChooseForm, setWhyChooseForm] = useState({
    title: '',
    desc: '',
    icon: 'ShoppingCart',
    order: 1,
  });

  // General content forms
  const [heroForm, setHeroForm] = useState({
    badge: 'OUR STORY',
    title: 'Empowering Creators Across',
    highlight: 'India',
    description: '',
    ctaText: 'Shop Our Kits',
    ctaLink: '/product',
    image: '/about5.png',
  });

  const [missionForm, setMissionForm] = useState({
    badge: 'OUR MISSION',
    title: 'To Create More and',
    highlight: 'More Creators',
    suffix: 'Across India',
    description: '',
    image: '/about2.png',
  });

  const [visionForm, setVisionForm] = useState({
    badge: 'OUR VISION',
    title: 'A Creator in',
    highlight: 'Every Home',
    description: '',
    ctaText: 'Know Our Journey',
    ctaLink: '/contact',
    image: '/about1.png',
  });

  const [ctaBannerForm, setCtaBannerForm] = useState({
    title: 'Join Our Growing',
    highlight: 'Creator Community',
    description: '',
    ctaText: 'Join Now',
    ctaLink: '/contact',
    image: '/about4.png',
  });

  const [teamHeaderForm, setTeamHeaderForm] = useState({
    title: 'Meet',
    highlight: 'Our Team',
    subtitle: 'A passionate team working to empower creators across India.',
  });

  const [timelineHeaderForm, setTimelineHeaderForm] = useState({
    title: 'Our',
    highlight: 'Story',
    subtitle: "From a small idea to a growing community of creators — here's how CreatorsKit came to life.",
    ctaText: 'Read More',
    ctaLink: '/contact',
  });

  const [whyChooseHeaderForm, setWhyChooseHeaderForm] = useState({
    title: 'Why Creators Choose',
    highlight: 'CreatorsKit?',
    subtitle: "We're more than just an online store. We're a complete ecosystem for creators.",
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const showToast = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 3500);
  };

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/about');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setAboutData(d);

          if (d.hero) setHeroForm({ ...d.hero });
          if (d.mission) setMissionForm({ ...d.mission });
          if (d.vision) setVisionForm({ ...d.vision });
          if (d.ctaBanner) setCtaBannerForm({ ...d.ctaBanner });

          if (d.team) {
            setTeamHeaderForm({
              title: d.team.title || 'Meet',
              highlight: d.team.highlight || 'Our Team',
              subtitle: d.team.subtitle || '',
            });
          }
          if (d.timeline) {
            setTimelineHeaderForm({
              title: d.timeline.title || 'Our',
              highlight: d.timeline.highlight || 'Story',
              subtitle: d.timeline.subtitle || '',
              ctaText: d.timeline.ctaText || 'Read More',
              ctaLink: d.timeline.ctaLink || '/contact',
            });
          }
          if (d.whyChoose) {
            setWhyChooseHeaderForm({
              title: d.whyChoose.title || 'Why Creators Choose',
              highlight: d.whyChoose.highlight || 'CreatorsKit?',
              subtitle: d.whyChoose.subtitle || '',
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load about data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Add modal
  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);

    if (type === 'team') {
      const nextOrder = (aboutData?.team?.members?.length || 0) + 1;
      setTeamForm({
        name: '',
        role: '',
        desc: '',
        image: '',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: nextOrder,
      });
    } else if (type === 'timeline') {
      const nextOrder = (aboutData?.timeline?.milestones?.length || 0) + 1;
      setTimelineForm({
        year: new Date().getFullYear().toString(),
        title: '',
        desc: '',
        order: nextOrder,
      });
    } else if (type === 'stat') {
      const nextOrder = (aboutData?.stats?.length || 0) + 1;
      setStatForm({
        value: '',
        label: '',
        icon: 'Users',
        order: nextOrder,
      });
    } else if (type === 'whyChoose') {
      const nextOrder = (aboutData?.whyChoose?.cards?.length || 0) + 1;
      setWhyChooseForm({
        title: '',
        desc: '',
        icon: 'ShoppingCart',
        order: nextOrder,
      });
    }

    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);

    if (type === 'team') {
      setTeamForm({
        name: item.name || '',
        role: item.role || '',
        desc: item.desc || '',
        image: item.image || '',
        linkedin: item.linkedin || 'https://linkedin.com',
        instagram: item.instagram || 'https://instagram.com',
        order: item.order ?? 1,
      });
    } else if (type === 'timeline') {
      setTimelineForm({
        year: item.year || '',
        title: item.title || '',
        desc: item.desc || '',
        order: item.order ?? 1,
      });
    } else if (type === 'stat') {
      setStatForm({
        value: item.value || '',
        label: item.label || '',
        icon: item.icon || 'Users',
        order: item.order ?? 1,
      });
    } else if (type === 'whyChoose') {
      setWhyChooseForm({
        title: item.title || '',
        desc: item.desc || '',
        icon: item.icon || 'ShoppingCart',
        order: item.order ?? 1,
      });
    }

    setIsModalOpen(true);
  };

  // Submit item modal (Add / Edit)
  const handleSubmitItem = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const isEdit = Boolean(editingItem);

      let payload = {};
      let sectionKey = '';

      if (modalType === 'team') {
        payload = { ...teamForm };
        sectionKey = 'team';
      } else if (modalType === 'timeline') {
        payload = { ...timelineForm };
        sectionKey = 'timeline';
      } else if (modalType === 'stat') {
        payload = { ...statForm };
        sectionKey = 'stats';
      } else if (modalType === 'whyChoose') {
        payload = { ...whyChooseForm };
        sectionKey = 'whyChoose';
      }

      let res;
      if (isEdit) {
        res = await fetch(`/api/about?section=${sectionKey}&id=${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: sectionKey, item: payload }),
        });
      }

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
          setIsModalOpen(false);
          showToast(isEdit ? 'Item updated successfully!' : 'Item added successfully!');
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save item');
      }
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save item. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item confirm
  const handleDeleteConfirm = (section, id, title) => {
    setDeleteModal({
      isOpen: true,
      section,
      id,
      title: `Delete "${title}"?`,
      message: 'Are you sure you want to delete this item? It will be removed immediately from the public About Us page.',
      isDeleting: false,
    });
  };

  const handleExecuteDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
      const { section, id } = deleteModal;
      const res = await fetch(`/api/about?section=${section}&id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
          setDeleteModal({ isOpen: false, section: '', id: null, title: '', message: '', isDeleting: false });
          showToast('Item deleted successfully!');
        }
      } else {
        alert('Failed to delete item.');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('An error occurred while deleting.');
    } finally {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Save General Section (Hero, Mission, Vision, CTA Banner, or Section Headings)
  const handleSaveSection = async (sectionName, data) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/about?section=${sectionName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAboutData(json.data);
          showToast(`${sectionName.toUpperCase()} section updated successfully!`);
        }
      } else {
        alert('Failed to update section.');
      }
    } catch (err) {
      console.error('Save section error:', err);
      alert('Failed to update section.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Team Members
  const filteredTeam = (aboutData?.team?.members || []).filter(
    (m) =>
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Milestones
  const filteredTimeline = (aboutData?.timeline?.milestones || []).filter(
    (item) =>
      item.year?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Stats
  const statsList = aboutData?.stats || [];
  const whyChooseList = aboutData?.whyChoose?.cards || [];

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#900606] animate-pulse"></span>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              About Us Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Customize team members, company story timeline, stats, mission, and hero section in real-time.
          </p>
        </div>

        {/* Action Button & Live Public Link */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {activeTab === 'team' && (
            <button
              onClick={() => handleOpenAdd('team')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Member</span>
            </button>
          )}

          {activeTab === 'timeline' && (
            <button
              onClick={() => handleOpenAdd('timeline')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Milestone</span>
            </button>
          )}

          {activeTab === 'stats' && (
            <button
              onClick={() => handleOpenAdd('stat')}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Stat</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-600 text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/90 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'team', label: 'Team Members', icon: Users, count: aboutData?.team?.members?.length || 0 },
          { id: 'timeline', label: 'Story Timeline', icon: Clock, count: aboutData?.timeline?.milestones?.length || 0 },
          { id: 'stats', label: 'Stats & Ecosystem', icon: BarChart3, count: (aboutData?.stats?.length || 0) + (aboutData?.whyChoose?.cards?.length || 0) },
          { id: 'general', label: 'Hero, Mission & Vision', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#900606] text-white shadow-2xs'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100/70 border border-neutral-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-12 text-center">
          <div className="w-8 h-8 border-3 border-[#900606] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-neutral-500">Loading About Us content...</p>
        </div>
      )}

      {/* TAB 1: TEAM MEMBERS */}
      {!loading && activeTab === 'team' && (
        <div className="space-y-6">
          {/* Section Heading Settings */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  Team Section Headings
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update the title, highlighted text, and subtitle above the team list.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('teamHeaders', teamHeaderForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Headings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={teamHeaderForm.title}
                  onChange={(e) => setTeamHeaderForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Meet"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={teamHeaderForm.highlight}
                  onChange={(e) => setTeamHeaderForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="e.g. Our Team"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={teamHeaderForm.subtitle}
                  onChange={(e) => setTeamHeaderForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. A passionate team working to empower creators across India."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members by name, role or bio..."
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-neutral-200 rounded-xl bg-white outline-none focus:border-[#900606]"
            />
          </div>

          {/* Team Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTeam.map((member) => (
              <div
                key={member._id}
                className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Preview - Edge to Edge, No side gap */}
                  <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-neutral-100">
                    <Image
                      src={getImageUrl(member.image || '/team/manish.jpg')}
                      alt={member.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      #{member.order ?? 0}
                    </span>
                  </div>

                  <div className="p-4 pb-0">
                    <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs font-bold text-[#900606] mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-neutral-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {member.desc}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-3">
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-neutral-400 text-xs">
                      {member.linkedin && <span className="hover:text-[#0A66C2]">LinkedIn</span>}
                      {member.instagram && <span className="hover:text-[#E4405F]">Instagram</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit('team', member)}
                        className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit Member"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm('team', member._id, member.name)}
                        className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTeam.length === 0 && (
              <div className="col-span-full bg-white border border-dashed border-neutral-300 rounded-2xl p-8 text-center">
                <Users className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-500">No team members found.</p>
                <button
                  onClick={() => handleOpenAdd('team')}
                  className="mt-3 text-xs font-bold text-[#900606] hover:underline cursor-pointer"
                >
                  + Add First Member
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STORY TIMELINE */}
      {!loading && activeTab === 'timeline' && (
        <div className="space-y-6">
          {/* Section Heading Settings */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  Our Story Headings & CTA
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update title, description, and button shown on the left of the timeline.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('timelineHeaders', timelineHeaderForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Story Info
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={timelineHeaderForm.title}
                  onChange={(e) => setTimelineHeaderForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Our"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={timelineHeaderForm.highlight}
                  onChange={(e) => setTimelineHeaderForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="Story"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={timelineHeaderForm.ctaText}
                  onChange={(e) => setTimelineHeaderForm((p) => ({ ...p, ctaText: e.target.value }))}
                  placeholder="Read More"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Button Link</label>
                <input
                  type="text"
                  value={timelineHeaderForm.ctaLink}
                  onChange={(e) => setTimelineHeaderForm((p) => ({ ...p, ctaLink: e.target.value }))}
                  placeholder="/contact"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Story Subtitle</label>
                <textarea
                  rows={2}
                  value={timelineHeaderForm.subtitle}
                  onChange={(e) => setTimelineHeaderForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="From a small idea to a growing community..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* Timeline List */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-neutral-900">
                Milestones ({filteredTimeline.length})
              </h3>
              <button
                onClick={() => handleOpenAdd('timeline')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#900606] hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredTimeline.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-neutral-200/70 hover:bg-neutral-50/70 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-sm font-black text-[#900606] bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg shrink-0">
                      {item.year}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded">
                      Order: {item.order ?? 0}
                    </span>
                    <button
                      onClick={() => handleOpenEdit('timeline', item)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Milestone"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('timeline', item._id, `${item.year} - ${item.title}`)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredTimeline.length === 0 && (
                <p className="text-xs text-neutral-400 text-center py-6">No milestones added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STATS & WHY CHOOSE CARDS */}
      {!loading && activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Key Stats Section */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  Key Statistics Bar
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The 4 highlight numbers displayed across the stat bar (e.g. 50,000+ Happy Creators).
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('stat')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#900606] hover:bg-[#780505] px-3.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {statsList.map((st) => (
                <div
                  key={st._id}
                  className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Icon: {st.icon}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#900606] bg-red-50 px-1.5 py-0.5 rounded">
                        #{st.order}
                      </span>
                    </div>
                    <p className="text-xl font-black text-neutral-900 tracking-tight">{st.value}</p>
                    <p className="text-xs text-neutral-500 font-semibold mt-0.5">{st.label}</p>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-neutral-200/60">
                    <button
                      onClick={() => handleOpenEdit('stat', st)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Stat"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('stats', st._id, st.label)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Stat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Creators Choose Section */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  &quot;Why Creators Choose&quot; Ecosystem Cards
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The feature cards highlighting benefits like Curated Kits, Free Courses, Community, Support.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveSection('whyChooseHeaders', whyChooseHeaderForm)}
                  disabled={isSaving}
                  className="bg-neutral-900 hover:bg-black text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  Save Title
                </button>
                <button
                  onClick={() => handleOpenAdd('whyChoose')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#900606] hover:bg-[#780505] px-3.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Card</span>
                </button>
              </div>
            </div>

            {/* Why Choose Header Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-3 border-b border-neutral-100">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={whyChooseHeaderForm.title}
                  onChange={(e) => setWhyChooseHeaderForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Why Creators Choose"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={whyChooseHeaderForm.highlight}
                  onChange={(e) => setWhyChooseHeaderForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="CreatorsKit?"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={whyChooseHeaderForm.subtitle}
                  onChange={(e) => setWhyChooseHeaderForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="We're more than just an online store..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {whyChooseList.map((card) => (
                <div
                  key={card._id}
                  className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-full bg-red-50 text-[#900606] flex items-center justify-center font-bold text-xs">
                        {card.icon?.slice(0, 2) || '★'}
                      </span>
                      <span className="text-[10px] font-extrabold text-neutral-400">#{card.order}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{card.title}</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-neutral-100">
                    <button
                      onClick={() => handleOpenEdit('whyChoose', card)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Card"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('whyChoose', card._id, card.title)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HERO, MISSION, VISION & CTA BANNER */}
      {!loading && activeTab === 'general' && (
        <div className="space-y-6">
          {/* Hero Section Form */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  1. Hero Banner Section
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Top full-width dark banner with title, background image, and call-to-action button.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('hero', heroForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Hero
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="OUR STORY"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Main Title</label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Empowering Creators Across"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={heroForm.highlight}
                  onChange={(e) => setHeroForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="India"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={heroForm.ctaText}
                  onChange={(e) => setHeroForm((p) => ({ ...p, ctaText: e.target.value }))}
                  placeholder="Shop Our Kits"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Link Destination</label>
                <input
                  type="text"
                  value={heroForm.ctaLink}
                  onChange={(e) => setHeroForm((p) => ({ ...p, ctaLink: e.target.value }))}
                  placeholder="/product"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Hero Background Image</label>
                <input
                  type="text"
                  value={heroForm.image}
                  onChange={(e) => setHeroForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/about5.png"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Hero Description</label>
                <textarea
                  rows={2}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="At CreatorsKit, we believe..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* Mission Section Form */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  2. Our Mission Section
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The mission narrative and featured image side-by-side.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('mission', missionForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Mission
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={missionForm.badge}
                  onChange={(e) => setMissionForm((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="OUR MISSION"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={missionForm.title}
                  onChange={(e) => setMissionForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="To Create More and"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={missionForm.highlight}
                  onChange={(e) => setMissionForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="More Creators"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Suffix Title</label>
                <input
                  type="text"
                  value={missionForm.suffix}
                  onChange={(e) => setMissionForm((p) => ({ ...p, suffix: e.target.value }))}
                  placeholder="Across India"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Mission Side Image</label>
                <input
                  type="text"
                  value={missionForm.image}
                  onChange={(e) => setMissionForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/about2.png"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Mission Description</label>
                <textarea
                  rows={2}
                  value={missionForm.description}
                  onChange={(e) => setMissionForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="We aim to make content creation simple..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* Vision Section Form */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  3. Our Vision Section
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Vision narrative with &quot;Know Our Journey&quot; button.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('vision', visionForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Vision
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={visionForm.badge}
                  onChange={(e) => setVisionForm((p) => ({ ...p, badge: e.target.value }))}
                  placeholder="OUR VISION"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={visionForm.title}
                  onChange={(e) => setVisionForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="A Creator in"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word (Red)</label>
                <input
                  type="text"
                  value={visionForm.highlight}
                  onChange={(e) => setVisionForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="Every Home"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={visionForm.ctaText}
                  onChange={(e) => setVisionForm((p) => ({ ...p, ctaText: e.target.value }))}
                  placeholder="Know Our Journey"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">CTA Link Destination</label>
                <input
                  type="text"
                  value={visionForm.ctaLink}
                  onChange={(e) => setVisionForm((p) => ({ ...p, ctaLink: e.target.value }))}
                  placeholder="/contact"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Vision Image</label>
                <input
                  type="text"
                  value={visionForm.image}
                  onChange={(e) => setVisionForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/about1.png"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Vision Description</label>
                <textarea
                  rows={2}
                  value={visionForm.description}
                  onChange={(e) => setVisionForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="We envision a future where content creation becomes a mainstream career..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* Join Community CTA Banner Form */}
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                  4. Bottom CTA Banner (Join Community)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Footer community invitation call-out banner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSection('ctaBanner', ctaBannerForm)}
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                Save Banner
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Prefix Title</label>
                <input
                  type="text"
                  value={ctaBannerForm.title}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Join Our Growing"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Highlight Word</label>
                <input
                  type="text"
                  value={ctaBannerForm.highlight}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, highlight: e.target.value }))}
                  placeholder="Creator Community"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Background Image</label>
                <input
                  type="text"
                  value={ctaBannerForm.image}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="/about4.png"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Button Text</label>
                <input
                  type="text"
                  value={ctaBannerForm.ctaText}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, ctaText: e.target.value }))}
                  placeholder="Join Now"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Button Link</label>
                <input
                  type="text"
                  value={ctaBannerForm.ctaLink}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, ctaLink: e.target.value }))}
                  placeholder="/contact"
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">Description</label>
                <input
                  type="text"
                  value={ctaBannerForm.description}
                  onChange={(e) => setCtaBannerForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Get the latest updates, tips..."
                  className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ITEM ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => !isSaving && setIsModalOpen(false)} />
          <div className="relative bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 max-w-md w-full z-10 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight mb-1">
              {editingItem ? 'Edit' : 'Add New'}{' '}
              {modalType === 'team'
                ? 'Team Member'
                : modalType === 'timeline'
                ? 'Milestone'
                : modalType === 'stat'
                ? 'Statistic'
                : 'Why Choose Card'}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Changes will immediately reflect on the live About Us page.
            </p>

            <form onSubmit={handleSubmitItem} className="space-y-3.5">
              {/* TEAM MEMBER FORM */}
              {modalType === 'team' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.name}
                      onChange={(e) => setTeamForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Manish Kumar"
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Role / Job Title *</label>
                    <input
                      type="text"
                      required
                      value={teamForm.role}
                      onChange={(e) => setTeamForm((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Founder & CEO"
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Short Bio</label>
                    <textarea
                      rows={2}
                      value={teamForm.desc}
                      onChange={(e) => setTeamForm((p) => ({ ...p, desc: e.target.value }))}
                      placeholder="e.g. Building a creator-friendly India."
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Photo Image URL</label>
                    <input
                      type="text"
                      value={teamForm.image}
                      onChange={(e) => setTeamForm((p) => ({ ...p, image: e.target.value }))}
                      placeholder="/team/manish.jpg or ImageKit URL"
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={teamForm.linkedin}
                        onChange={(e) => setTeamForm((p) => ({ ...p, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com"
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={teamForm.instagram}
                        onChange={(e) => setTeamForm((p) => ({ ...p, instagram: e.target.value }))}
                        placeholder="https://instagram.com"
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={teamForm.order}
                      onChange={(e) => setTeamForm((p) => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>
                </>
              )}

              {/* TIMELINE FORM */}
              {modalType === 'timeline' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Year *</label>
                      <input
                        type="text"
                        required
                        value={timelineForm.year}
                        onChange={(e) => setTimelineForm((p) => ({ ...p, year: e.target.value }))}
                        placeholder="2024"
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Title *</label>
                      <input
                        type="text"
                        required
                        value={timelineForm.title}
                        onChange={(e) => setTimelineForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Growing Together"
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={timelineForm.desc}
                      onChange={(e) => setTimelineForm((p) => ({ ...p, desc: e.target.value }))}
                      placeholder="Reached 50,000+ happy creators across India."
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={timelineForm.order}
                      onChange={(e) => setTimelineForm((p) => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>
                </>
              )}

              {/* STAT FORM */}
              {modalType === 'stat' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Metric Value *</label>
                      <input
                        type="text"
                        required
                        value={statForm.value}
                        onChange={(e) => setStatForm((p) => ({ ...p, value: e.target.value }))}
                        placeholder="e.g. 50,000+"
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Icon Key</label>
                      <select
                        value={statForm.icon}
                        onChange={(e) => setStatForm((p) => ({ ...p, icon: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606] bg-white"
                      >
                        <option value="Users">Users (Creators)</option>
                        <option value="Box">Box (Products)</option>
                        <option value="GraduationCap">GraduationCap (Students)</option>
                        <option value="Star">Star (Rating)</option>
                        <option value="Award">Award</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Metric Label *</label>
                    <input
                      type="text"
                      required
                      value={statForm.label}
                      onChange={(e) => setStatForm((p) => ({ ...p, label: e.target.value }))}
                      placeholder="e.g. Happy Creators"
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={statForm.order}
                      onChange={(e) => setStatForm((p) => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>
                </>
              )}

              {/* WHY CHOOSE CARD FORM */}
              {modalType === 'whyChoose' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={whyChooseForm.title}
                      onChange={(e) => setWhyChooseForm((p) => ({ ...p, title: e.target.value }))}
                      placeholder="e.g. Curated Creator Kits"
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={whyChooseForm.desc}
                      onChange={(e) => setWhyChooseForm((p) => ({ ...p, desc: e.target.value }))}
                      placeholder="High-quality, genuine products selected for creators."
                      className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Icon</label>
                      <select
                        value={whyChooseForm.icon}
                        onChange={(e) => setWhyChooseForm((p) => ({ ...p, icon: e.target.value }))}
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606] bg-white"
                      >
                        <option value="ShoppingCart">ShoppingCart</option>
                        <option value="BookOpen">BookOpen (Courses)</option>
                        <option value="Users">Users (Community)</option>
                        <option value="Headphones">Headphones (Support)</option>
                        <option value="Diamond">Diamond</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={whyChooseForm.order}
                        onChange={(e) => setWhyChooseForm((p) => ({ ...p, order: Number(e.target.value) }))}
                        className="w-full text-xs border border-neutral-200 rounded-xl px-3 py-2 outline-none focus:border-[#900606]"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSaving ? <span>Saving...</span> : <span>Save Item</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, section: '', id: null, title: '', message: '', isDeleting: false })}
        onConfirm={handleExecuteDelete}
        title={deleteModal.title}
        message={deleteModal.message}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
}

