'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  HelpCircle,
  Phone,
  MapPin,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Search,
  Globe,
  Headphones,
  ShieldCheck,
  Users,
  Navigation,
  Car,
  Train,
  Mail,
  Clock,
  Layers,
  MessageSquare
} from 'lucide-react';

export default function ContactManager() {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'channels' | 'hero' | 'location'
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('faq'); // 'faq' | 'badge' | 'perk'
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
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 1,
  });

  const [badgeForm, setBadgeForm] = useState({
    title: '',
    subtitle: '',
    icon: 'Headphones',
    order: 1,
  });

  const [perkForm, setPerkForm] = useState({
    title: '',
    subtitle: '',
    icon: 'Navigation',
    order: 1,
  });

  // Section forms
  const [heroForm, setHeroForm] = useState({
    badge: "WE'RE HERE TO HELP",
    title: "Let's Create",
    highlight: 'Something Amazing Together',
    description: '',
    image: '/contact1.png',
  });

  const [channelsForm, setChannelsForm] = useState({
    formTitle: 'Get in',
    formHighlight: 'Touch',
    formSubtitle: '',
    infoTitle: 'Contact',
    infoHighlight: 'Information',
    infoSubtitle: '',
    phoneTitle: 'Call Us',
    phoneNumber: '+91 98765 43210',
    phoneTimings: 'Mon – Sat, 10:00 AM – 7:00 PM',
    emailTitle: 'Email Us',
    emailAddress: 'support@creatorskit.in',
    emailNote: 'We usually respond within 24 hours.',
    whatsappTitle: 'WhatsApp Support',
    whatsappNumber: '+91 98765 43210',
    whatsappNote: 'Chat with us for quick help',
    officeTitle: 'Our Office',
    officeCity: 'New Delhi, India',
    officeAddress: 'A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309',
  });

  const [locationForm, setLocationForm] = useState({
    title: 'Our',
    highlight: 'Location',
    subtitle: 'Visit our office or find us on the map.',
    mapAddress: 'Sector 62, Noida, Uttar Pradesh 201309',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh',
    officeImage: '/contact.png',
  });

  const [faqHeaderForm, setFaqHeaderForm] = useState({
    title: 'Frequently Asked',
    highlight: 'Questions',
    subtitle: "Find answers to the most common questions. Can't find what you're looking for? Contact us.",
    ctaText: 'View All FAQs',
    ctaLink: '/faq',
  });

  useEffect(() => {
    fetchContactData();
  }, []);

  const showToast = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg('');
    }, 3500);
  };

  const fetchContactData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact-content');
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        setContactData(data);

        // Populate Hero Form
        if (data.hero) {
          setHeroForm({
            badge: data.hero.badge || "WE'RE HERE TO HELP",
            title: data.hero.title || "Let's Create",
            highlight: data.hero.highlight || 'Something Amazing Together',
            description: data.hero.description || '',
            image: data.hero.image || '/contact1.png',
          });
        }

        // Populate Channels Form
        if (data.channels) {
          setChannelsForm({
            formTitle: data.channels.formTitle || 'Get in',
            formHighlight: data.channels.formHighlight || 'Touch',
            formSubtitle: data.channels.formSubtitle || '',
            infoTitle: data.channels.infoTitle || 'Contact',
            infoHighlight: data.channels.infoHighlight || 'Information',
            infoSubtitle: data.channels.infoSubtitle || '',
            phoneTitle: data.channels.phone?.title || 'Call Us',
            phoneNumber: data.channels.phone?.number || '',
            phoneTimings: data.channels.phone?.timings || '',
            emailTitle: data.channels.email?.title || 'Email Us',
            emailAddress: data.channels.email?.address || '',
            emailNote: data.channels.email?.note || '',
            whatsappTitle: data.channels.whatsapp?.title || 'WhatsApp Support',
            whatsappNumber: data.channels.whatsapp?.number || '',
            whatsappNote: data.channels.whatsapp?.note || '',
            officeTitle: data.channels.office?.title || 'Our Office',
            officeCity: data.channels.office?.city || '',
            officeAddress: data.channels.office?.fullAddress || '',
          });
        }

        // Populate Location Form
        if (data.location) {
          const defaultAddr = data.location.mapAddress || data.channels?.office?.fullAddress || 'Sector 62, Noida, Uttar Pradesh 201309';
          setLocationForm({
            title: data.location.title || 'Our',
            highlight: data.location.highlight || 'Location',
            subtitle: data.location.subtitle || '',
            mapAddress: defaultAddr,
            mapEmbedUrl: data.location.mapEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(defaultAddr)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
            directionsUrl: data.location.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(defaultAddr)}`,
            officeImage: data.location.officeImage || '/contact.png',
          });
        }

        // Populate FAQ Header Form
        if (data.faqs) {
          setFaqHeaderForm({
            title: data.faqs.title || 'Frequently Asked',
            highlight: data.faqs.highlight || 'Questions',
            subtitle: data.faqs.subtitle || '',
            ctaText: data.faqs.ctaText || 'View All FAQs',
            ctaLink: data.faqs.ctaLink || '/faq',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load contact data', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert entered address string into Google Maps embed URL
  const handleAddressChange = (newAddress) => {
    const clean = (newAddress || '').trim();
    let embedUrl = '';
    let directionsUrl = '';
    if (clean) {
      if (clean.includes('<iframe') && clean.includes('src="')) {
        const match = clean.match(/src=["']([^"']+)["']/);
        if (match && match[1]) embedUrl = match[1];
      } else if (clean.startsWith('http://') || clean.startsWith('https://')) {
        embedUrl = clean;
        directionsUrl = clean;
      } else {
        embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(clean)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
        directionsUrl = `https://maps.google.com/?q=${encodeURIComponent(clean)}`;
      }
    }
    setLocationForm((prev) => ({
      ...prev,
      mapAddress: newAddress,
      mapEmbedUrl: embedUrl || prev.mapEmbedUrl,
      directionsUrl: directionsUrl || prev.directionsUrl,
    }));
  };

  // Save Section changes
  const saveSection = async (section, data) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/contact-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      const json = await res.json();
      if (json.success) {
        setContactData(json.data);
        showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      } else {
        alert(json.error || 'Failed to update section');
      }
    } catch (err) {
      console.error('Error saving section:', err);
      alert('Error updating section');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle open add modal
  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    if (type === 'faq') {
      const currentCount = contactData?.faqs?.items?.length || 0;
      setFaqForm({
        question: '',
        answer: '',
        category: 'General',
        order: currentCount + 1,
      });
    } else if (type === 'badge') {
      const currentCount = contactData?.hero?.badges?.length || 0;
      setBadgeForm({
        title: '',
        subtitle: '',
        icon: 'Headphones',
        order: currentCount + 1,
      });
    } else if (type === 'perk') {
      const currentCount = contactData?.location?.perks?.length || 0;
      setPerkForm({
        title: '',
        subtitle: '',
        icon: 'Navigation',
        order: currentCount + 1,
      });
    }
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'faq') {
      setFaqForm({
        question: item.question || '',
        answer: item.answer || '',
        category: item.category || 'General',
        order: item.order ?? 1,
      });
    } else if (type === 'badge') {
      setBadgeForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        icon: item.icon || 'Headphones',
        order: item.order ?? 1,
      });
    } else if (type === 'perk') {
      setPerkForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        icon: item.icon || 'Navigation',
        order: item.order ?? 1,
      });
    }
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const sectionMap = { faq: 'faqs', badge: 'badges', perk: 'perks' };
      const section = sectionMap[modalType];

      let itemData;
      if (modalType === 'faq') itemData = { ...faqForm };
      else if (modalType === 'badge') itemData = { ...badgeForm };
      else if (modalType === 'perk') itemData = { ...perkForm };

      if (editingItem) {
        // Update item
        const res = await fetch('/api/contact-content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateItem',
            section,
            itemId: editingItem._id,
            itemData,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setContactData(json.data);
          setIsModalOpen(false);
          showToast('Item updated successfully!');
        } else {
          alert(json.error || 'Failed to update item');
        }
      } else {
        // Add new item
        const res = await fetch('/api/contact-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section, item: itemData }),
        });
        const json = await res.json();
        if (json.success) {
          setContactData(json.data);
          setIsModalOpen(false);
          showToast('Item added successfully!');
        } else {
          alert(json.error || 'Failed to add item');
        }
      }
    } catch (err) {
      console.error('Error submitting item:', err);
      alert('Error saving item');
    } finally {
      setIsSaving(false);
    }
  };

  // Request Delete confirmation
  const handleDeleteConfirm = (section, id, title) => {
    setDeleteModal({
      isOpen: true,
      section,
      id,
      title,
      message: `Are you sure you want to delete "${title}"? This change will reflect live on the website.`,
      isDeleting: false,
    });
  };

  // Execute Delete
  const handleExecuteDelete = async () => {
    if (!deleteModal.id || !deleteModal.section) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(
        `/api/contact-content?section=${deleteModal.section}&itemId=${deleteModal.id}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        setContactData(json.data);
        setDeleteModal({
          isOpen: false,
          section: '',
          id: null,
          title: '',
          message: '',
          isDeleting: false,
        });
        showToast('Item deleted successfully!');
      } else {
        alert(json.error || 'Failed to delete item');
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Error deleting item');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Helper for rendering icons
  const renderDynamicIcon = (name, className = 'w-5 h-5') => {
    switch (name) {
      case 'Headphones':
        return <Headphones className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Navigation':
        return <Navigation className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Train':
        return <Train className={className} />;
      case 'Phone':
        return <Phone className={className} />;
      case 'Mail':
        return <Mail className={className} />;
      case 'MapPin':
        return <MapPin className={className} />;
      default:
        return <HelpCircle className={className} />;
    }
  };

  // Filtered FAQs
  const faqList = (contactData?.faqs?.items || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((f) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
      );
    });

  // Hero Badges
  const heroBadges = (contactData?.hero?.badges || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Location Perks
  const locationPerks = (contactData?.location?.perks || [])
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (loading) {
    return (
      <div className="w-full bg-white border border-neutral-200/80 rounded-2xl p-12 text-center shadow-2xs">
        <div className="inline-block animate-spin w-8 h-8 border-3 border-[#900606] border-t-transparent rounded-full mb-3"></div>
        <p className="text-xs font-bold text-neutral-600">Loading Contact Page Content from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-semibold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Header with Page Preview Link */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-[#900606] border border-rose-100">
              Live MongoDB Sync
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Connected
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Contact Page Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your Hero banner, phone & email channels, office location map, and FAQs live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#FBFBF7] hover:bg-neutral-100 text-neutral-700 border border-neutral-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs hover:border-neutral-300"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-500" />
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      </div>

      {/* Top Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-px overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'faqs'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQs Accordion</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
            {contactData?.faqs?.items?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'channels'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Contact Channels & Office</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero & Support Badges</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
            {contactData?.hero?.badges?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'location'
              ? 'border-[#900606] text-[#900606] bg-white'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Location & Google Map</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
            {contactData?.location?.perks?.length || 0}
          </span>
        </button>
      </div>

      {/* TAB 1: FAQS ACCORDION */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* FAQ Section Headings Form */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                  FAQ Section Headings
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update the title, highlighted word, and subtitle shown above the FAQ accordion.
                </p>
              </div>
              <button
                onClick={() =>
                  saveSection('faqs', {
                    ...contactData?.faqs,
                    title: faqHeaderForm.title,
                    highlight: faqHeaderForm.highlight,
                    subtitle: faqHeaderForm.subtitle,
                    ctaText: faqHeaderForm.ctaText,
                    ctaLink: faqHeaderForm.ctaLink,
                  })
                }
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Headings'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Prefix Title
                </label>
                <input
                  type="text"
                  value={faqHeaderForm.title}
                  onChange={(e) => setFaqHeaderForm({ ...faqHeaderForm, title: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Highlight Word (Red)
                </label>
                <input
                  type="text"
                  value={faqHeaderForm.highlight}
                  onChange={(e) => setFaqHeaderForm({ ...faqHeaderForm, highlight: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={faqHeaderForm.subtitle}
                  onChange={(e) => setFaqHeaderForm({ ...faqHeaderForm, subtitle: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* FAQ Items List & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs by question or answer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] shadow-2xs"
              />
            </div>

            <button
              onClick={() => handleOpenAdd('faq')}
              className="bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={faq._id || idx}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#FFF1F1] text-[#900606] border border-[#FFE2E2]">
                      #{faq.order ?? idx + 1}
                    </span>
                    {faq.category && (
                      <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                        {faq.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit('faq', faq)}
                    className="w-8 h-8 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm('faqs', faq._id, faq.question)}
                    className="w-8 h-8 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {faqList.length === 0 && (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center text-neutral-400 text-xs">
                No FAQs found. Click "Add FAQ" to create your first question!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CHANNELS & OFFICE */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Contact Channels & Business Information
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update phone numbers, email address, WhatsApp support, and physical office address.
                </p>
              </div>
              <button
                onClick={() =>
                  saveSection('channels', {
                    formTitle: channelsForm.formTitle,
                    formHighlight: channelsForm.formHighlight,
                    formSubtitle: channelsForm.formSubtitle,
                    infoTitle: channelsForm.infoTitle,
                    infoHighlight: channelsForm.infoHighlight,
                    infoSubtitle: channelsForm.infoSubtitle,
                    phone: {
                      title: channelsForm.phoneTitle,
                      number: channelsForm.phoneNumber,
                      timings: channelsForm.phoneTimings,
                    },
                    email: {
                      title: channelsForm.emailTitle,
                      address: channelsForm.emailAddress,
                      note: channelsForm.emailNote,
                    },
                    whatsapp: {
                      title: channelsForm.whatsappTitle,
                      number: channelsForm.whatsappNumber,
                      note: channelsForm.whatsappNote,
                    },
                    office: {
                      title: channelsForm.officeTitle,
                      city: channelsForm.officeCity,
                      fullAddress: channelsForm.officeAddress,
                    },
                  })
                }
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Channels'}
              </button>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Phone / Call Us */}
              <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-[#FBFBF7]/40">
                <div className="flex items-center gap-2 text-[#900606]">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Phone Support</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Channel Label
                  </label>
                  <input
                    type="text"
                    value={channelsForm.phoneTitle}
                    onChange={(e) => setChannelsForm({ ...channelsForm, phoneTitle: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={channelsForm.phoneNumber}
                    onChange={(e) => setChannelsForm({ ...channelsForm, phoneNumber: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Support Hours / Timings
                  </label>
                  <input
                    type="text"
                    value={channelsForm.phoneTimings}
                    onChange={(e) => setChannelsForm({ ...channelsForm, phoneTimings: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
              </div>

              {/* 2. Email Us */}
              <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-[#FBFBF7]/40">
                <div className="flex items-center gap-2 text-[#900606]">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Email Support</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Channel Label
                  </label>
                  <input
                    type="text"
                    value={channelsForm.emailTitle}
                    onChange={(e) => setChannelsForm({ ...channelsForm, emailTitle: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={channelsForm.emailAddress}
                    onChange={(e) => setChannelsForm({ ...channelsForm, emailAddress: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Response Note
                  </label>
                  <input
                    type="text"
                    value={channelsForm.emailNote}
                    onChange={(e) => setChannelsForm({ ...channelsForm, emailNote: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
              </div>

              {/* 3. WhatsApp Support */}
              <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-[#FBFBF7]/40">
                <div className="flex items-center gap-2 text-[#900606]">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Support</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Channel Label
                  </label>
                  <input
                    type="text"
                    value={channelsForm.whatsappTitle}
                    onChange={(e) => setChannelsForm({ ...channelsForm, whatsappTitle: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={channelsForm.whatsappNumber}
                    onChange={(e) => setChannelsForm({ ...channelsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Chat Note
                  </label>
                  <input
                    type="text"
                    value={channelsForm.whatsappNote}
                    onChange={(e) => setChannelsForm({ ...channelsForm, whatsappNote: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
              </div>

              {/* 4. Physical Office Address */}
              <div className="border border-neutral-200 rounded-xl p-4 space-y-3 bg-[#FBFBF7]/40">
                <div className="flex items-center gap-2 text-[#900606]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Office Address</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Location Heading
                  </label>
                  <input
                    type="text"
                    value={channelsForm.officeTitle}
                    onChange={(e) => setChannelsForm({ ...channelsForm, officeTitle: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={channelsForm.officeCity}
                    onChange={(e) => setChannelsForm({ ...channelsForm, officeCity: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                    Full Physical Address
                  </label>
                  <textarea
                    rows={2}
                    value={channelsForm.officeAddress}
                    onChange={(e) => setChannelsForm({ ...channelsForm, officeAddress: e.target.value })}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HERO & FEATURE BADGES */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Hero Banner Configuration
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update the main headline, subtitle, and creator studio background image.
                </p>
              </div>
              <button
                onClick={() =>
                  saveSection('hero', {
                    ...contactData?.hero,
                    badge: heroForm.badge,
                    title: heroForm.title,
                    highlight: heroForm.highlight,
                    description: heroForm.description,
                    image: heroForm.image,
                  })
                }
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Hero Banner'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Red Pre-heading Label
                </label>
                <input
                  type="text"
                  value={heroForm.badge}
                  onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Title (Prefix)
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Highlight Word / Text (Red)
                </label>
                <input
                  type="text"
                  value={heroForm.highlight}
                  onChange={(e) => setHeroForm({ ...heroForm, highlight: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Hero Description
                </label>
                <textarea
                  rows={3}
                  value={heroForm.description}
                  onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Background Visual Image Path
                </label>
                <input
                  type="text"
                  value={heroForm.image}
                  onChange={(e) => setHeroForm({ ...heroForm, image: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white mb-2"
                />
                <div className="relative w-full h-20 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-200">
                  <Image
                    src={getImageUrl(heroForm.image || '/contact1.png')}
                    alt="Hero Preview"
                    fill
                    unoptimized
                    className="object-cover object-center opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-bold text-white">
                    Live Hero Visual Preview
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Support Feature Badges */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Support Feature Badges (Under Hero)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The 3 pill badges displayed inside the hero banner (Quick Support, Trusted & Reliable, Creator First).
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('badge')}
                className="bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Badge</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {heroBadges.map((badge, idx) => (
                <div
                  key={badge._id || idx}
                  className="border border-neutral-200 rounded-2xl p-4 bg-[#FBFBF7]/40 flex items-center justify-between gap-3 group hover:border-neutral-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFF1F1] text-[#900606] border border-[#FFE2E2] flex items-center justify-center shrink-0">
                      {renderDynamicIcon(badge.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{badge.title}</p>
                      <p className="text-[11px] text-neutral-500 font-medium">{badge.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit('badge', badge)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('badges', badge._id, badge.title)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LOCATION & MAP */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-neutral-900">
                  Office Location & Google Map Settings
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Type your office address to automatically generate the live Google Map, or customize URLs manually.
                </p>
              </div>
              <button
                onClick={() =>
                  saveSection('location', {
                    ...contactData?.location,
                    title: locationForm.title,
                    highlight: locationForm.highlight,
                    subtitle: locationForm.subtitle,
                    mapAddress: locationForm.mapAddress,
                    mapEmbedUrl: locationForm.mapEmbedUrl,
                    directionsUrl: locationForm.directionsUrl,
                    officeImage: locationForm.officeImage,
                  })
                }
                disabled={isSaving}
                className="bg-[#900606] hover:bg-[#780505] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Location Settings'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Prefix Title
                </label>
                <input
                  type="text"
                  value={locationForm.title}
                  onChange={(e) => setLocationForm({ ...locationForm, title: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Highlight Word (Red)
                </label>
                <input
                  type="text"
                  value={locationForm.highlight}
                  onChange={(e) => setLocationForm({ ...locationForm, highlight: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={locationForm.subtitle}
                  onChange={(e) => setLocationForm({ ...locationForm, subtitle: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                />
              </div>
            </div>

            {/* DYNAMIC ADDRESS INPUT FOR GOOGLE MAPS */}
            <div className="bg-[#FFF1F1]/50 border border-[#FFE2E2] rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    <MapPin className="w-4 h-4 text-[#900606]" />
                    <span>Office Address / Location Search Query *</span>
                  </label>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Type your address, locality, or landmark name. Google Maps will automatically pinpoint this location on the map.
                  </p>
                </div>
                {channelsForm.officeAddress && (
                  <button
                    type="button"
                    onClick={() => handleAddressChange(channelsForm.officeAddress)}
                    className="text-[11px] font-bold text-[#900606] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>Use Channels Office Address</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={locationForm.mapAddress}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="e.g. Sector 62, Noida, Uttar Pradesh or Connaught Place, New Delhi"
                    className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] shadow-2xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddressChange(locationForm.mapAddress)}
                  className="bg-[#900606] hover:bg-[#780505] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Update Map Preview</span>
                </button>
              </div>
            </div>

            {/* LIVE GOOGLE MAP PREVIEW */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-neutral-700 uppercase">
                  Live Embedded Google Map Preview
                </label>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Pinpointing: {locationForm.mapAddress || 'Default Location'}
                </span>
              </div>
              <div className="w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-neutral-200 shadow-2xs bg-neutral-100 relative">
                <iframe
                  title="Admin Map Preview"
                  src={
                    locationForm.mapEmbedUrl ||
                    `https://maps.google.com/maps?q=${encodeURIComponent(
                      locationForm.mapAddress || 'Sector 62, Noida, Uttar Pradesh'
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

            {/* ADVANCED MAP URLS (COLLAPSIBLE) & OFFICE IMAGE */}
            <div className="space-y-4">
              <details className="border border-neutral-200 rounded-xl p-3 bg-[#FBFBF7]/40 text-xs text-neutral-600">
                <summary className="font-bold text-neutral-800 hover:text-[#900606] cursor-pointer">
                  Advanced: Custom Embed Iframe URL & Directions Link
                </summary>
                <div className="space-y-3 pt-3 mt-2 border-t border-neutral-200">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Google Maps Embed Iframe URL (src)
                    </label>
                    <input
                      type="text"
                      value={locationForm.mapEmbedUrl}
                      onChange={(e) => setLocationForm({ ...locationForm, mapEmbedUrl: e.target.value })}
                      placeholder="https://maps.google.com/maps?q=... or full iframe src"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-[#900606]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                      Google Maps Direct Link ("Open Directions")
                    </label>
                    <input
                      type="text"
                      value={locationForm.directionsUrl}
                      onChange={(e) => setLocationForm({ ...locationForm, directionsUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                    />
                  </div>
                </div>
              </details>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">
                  Office Image Path
                </label>
                <input
                  type="text"
                  value={locationForm.officeImage}
                  onChange={(e) => setLocationForm({ ...locationForm, officeImage: e.target.value })}
                  className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606]"
                />
              </div>
            </div>
          </div>

          {/* 3 Location Perks Cards */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Office Location Perks (Under Office Photo)
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  The 3 cards displayed beside the map (Easy to Reach, Parking Spot, Metro Friendly).
                </p>
              </div>
              <button
                onClick={() => handleOpenAdd('perk')}
                className="bg-[#900606] hover:bg-[#780505] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Perk</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {locationPerks.map((perk, idx) => (
                <div
                  key={perk._id || idx}
                  className="border border-neutral-200 rounded-2xl p-4 bg-[#FBFBF7]/40 flex items-center justify-between gap-3 group hover:border-neutral-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFF1F1] text-[#900606] border border-[#FFE2E2] flex items-center justify-center shrink-0">
                      {renderDynamicIcon(perk.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">{perk.title}</p>
                      <p className="text-[11px] text-neutral-500 font-medium">{perk.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEdit('perk', perk)}
                      className="w-7 h-7 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm('perks', perk._id, perk.title)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-[#FBFBF7]">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {editingItem ? 'Edit' : 'Add New'}{' '}
                  {modalType === 'faq'
                    ? 'FAQ'
                    : modalType === 'badge'
                    ? 'Hero Badge'
                    : 'Location Perk'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Update content live on MongoDB.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-neutral-200 text-neutral-400 hover:text-neutral-900 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {modalType === 'faq' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Question *
                    </label>
                    <input
                      type="text"
                      required
                      value={faqForm.question}
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                      placeholder="e.g. How can I track my order?"
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Answer *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      placeholder="Enter detailed answer here..."
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Category
                      </label>
                      <select
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      >
                        <option value="General">General</option>
                        <option value="Orders">Orders</option>
                        <option value="Payments">Payments</option>
                        <option value="Courses">Courses</option>
                        <option value="Shipping">Shipping</option>
                        <option value="Warranty">Warranty</option>
                        <option value="Business">Business</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Order / Position
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={faqForm.order}
                        onChange={(e) => setFaqForm({ ...faqForm, order: Number(e.target.value) })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'badge' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Badge Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={badgeForm.title}
                      onChange={(e) => setBadgeForm({ ...badgeForm, title: e.target.value })}
                      placeholder="e.g. Quick Support"
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Subtitle / Tagline *
                    </label>
                    <input
                      type="text"
                      required
                      value={badgeForm.subtitle}
                      onChange={(e) => setBadgeForm({ ...badgeForm, subtitle: e.target.value })}
                      placeholder="e.g. Get fast answers"
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={badgeForm.icon}
                        onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      >
                        <option value="Headphones">Headphones</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                        <option value="Users">Users</option>
                        <option value="Phone">Phone</option>
                        <option value="Mail">Mail</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={badgeForm.order}
                        onChange={(e) => setBadgeForm({ ...badgeForm, order: Number(e.target.value) })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'perk' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Perk Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={perkForm.title}
                      onChange={(e) => setPerkForm({ ...perkForm, title: e.target.value })}
                      placeholder="e.g. Easy to Reach"
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Subtitle / Location info *
                    </label>
                    <input
                      type="text"
                      required
                      value={perkForm.subtitle}
                      onChange={(e) => setPerkForm({ ...perkForm, subtitle: e.target.value })}
                      placeholder="e.g. Located in Noida"
                      className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Icon
                      </label>
                      <select
                        value={perkForm.icon}
                        onChange={(e) => setPerkForm({ ...perkForm, icon: e.target.value })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      >
                        <option value="Navigation">Navigation</option>
                        <option value="Car">Car</option>
                        <option value="Train">Train</option>
                        <option value="MapPin">MapPin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={perkForm.order}
                        onChange={(e) => setPerkForm({ ...perkForm, order: Number(e.target.value) })}
                        className="w-full bg-[#FBFBF7] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-neutral-900 outline-none focus:border-[#900606] focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#900606] hover:bg-[#780505] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, section: '', id: null, title: '', message: '', isDeleting: false })}
        onConfirm={handleExecuteDelete}
        title={`Delete ${deleteModal.title || 'Item'}`}
        message={deleteModal.message}
        isLoading={deleteModal.isDeleting}
      />
    </div>
  );
}

