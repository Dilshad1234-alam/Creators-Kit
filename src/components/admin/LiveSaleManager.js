'use client';

import { useState, useEffect } from 'react';
import {
  Flame,
  Save,
  CheckCircle2,
  Clock,
  Tag,
  Gift,
  Eye,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function LiveSaleManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    saleName: 'Mega Creator Fest',
    saleEventName: 'Mega Creator Fest',
    tickerText: 'Diwali Creator Dhamaka Live Now • Extra 10% Off with code CREATE10',
    heroHeading: 'MEGA CREATOR FEST:',
    heroHighlight: 'UP TO 50% OFF',
    heroSubtitle: "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
    heroDescription: "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
    countdownTargetHours: 8,
    countdownHours: 8,
    promoCode: 'CREATE10',
    couponCode: 'CREATE10',
    promoDiscount: 10,
    discountPercent: 10,
    promoHeadline: 'EXTRA 10% OFF',
    bannerHeadline: 'EXTRA 10% OFF',
    promoSubline: 'Valid on all live deals & bundles • Zero min order',
    bannerSubtitle: 'Valid on all live deals & bundles • Zero min order',
    showMysteryOffer: true,
    secretOfferEnabled: true,
    mysteryOfferTitle: "Today's Secret Festival Deal!",
    secretOfferTitle: "Today's Secret Festival Deal!",
    mysteryOfferCode: 'FEST500',
    secretCoupon: 'FEST500',
    mysteryOfferDesc: 'Flat ₹500 OFF on all Creator Bundles',
    secretBenefit: 'Flat ₹500 OFF on all Creator Bundles',
    liveViewerCount: 184,
    viewerCount: 184,
    active: true,
    isActive: true,
  });

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        let res = await fetch('/api/admin/live-sale');
        if (!res.ok) {
          res = await fetch('/api/sale');
        }
        if (res.ok) {
          const data = await res.json();
          setFormData((prev) => ({
            ...prev,
            ...data,
            saleName: data.saleEventName || data.saleName || prev.saleName,
            saleEventName: data.saleEventName || data.saleName || prev.saleEventName,
            heroSubtitle: data.heroDescription || data.heroSubtitle || prev.heroSubtitle,
            heroDescription: data.heroDescription || data.heroSubtitle || prev.heroDescription,
            countdownTargetHours: data.countdownHours ?? data.countdownTargetHours ?? prev.countdownTargetHours,
            countdownHours: data.countdownHours ?? data.countdownTargetHours ?? prev.countdownHours,
            liveViewerCount: data.viewerCount ?? data.liveViewerCount ?? prev.liveViewerCount,
            viewerCount: data.viewerCount ?? data.liveViewerCount ?? prev.viewerCount,
            active: data.isActive !== undefined ? data.isActive : (data.active !== undefined ? data.active : prev.active),
            isActive: data.isActive !== undefined ? data.isActive : (data.active !== undefined ? data.active : prev.isActive),
            promoCode: data.couponCode || data.promoCode || prev.promoCode,
            couponCode: data.couponCode || data.promoCode || prev.couponCode,
            promoDiscount: data.discountPercent ?? data.promoDiscount ?? prev.promoDiscount,
            discountPercent: data.discountPercent ?? data.promoDiscount ?? prev.discountPercent,
            promoHeadline: data.bannerHeadline || data.promoHeadline || prev.promoHeadline,
            bannerHeadline: data.bannerHeadline || data.promoHeadline || prev.bannerHeadline,
            promoSubline: data.bannerSubtitle || data.promoSubline || prev.promoSubline,
            bannerSubtitle: data.bannerSubtitle || data.promoSubline || prev.bannerSubtitle,
            mysteryOfferTitle: data.secretOfferTitle || data.mysteryOfferTitle || prev.mysteryOfferTitle,
            secretOfferTitle: data.secretOfferTitle || data.mysteryOfferTitle || prev.secretOfferTitle,
            mysteryOfferCode: data.secretCoupon || data.mysteryOfferCode || prev.mysteryOfferCode,
            secretCoupon: data.secretCoupon || data.mysteryOfferCode || prev.secretCoupon,
            mysteryOfferDesc: data.secretBenefit || data.mysteryOfferDesc || prev.mysteryOfferDesc,
            secretBenefit: data.secretBenefit || data.mysteryOfferDesc || prev.secretBenefit,
            showMysteryOffer: data.secretOfferEnabled !== undefined ? data.secretOfferEnabled : (data.showMysteryOffer !== undefined ? data.showMysteryOffer : prev.showMysteryOffer),
            secretOfferEnabled: data.secretOfferEnabled !== undefined ? data.secretOfferEnabled : (data.showMysteryOffer !== undefined ? data.showMysteryOffer : prev.secretOfferEnabled),
          }));
        }
      } catch (err) {
        console.error('Error fetching live sale config:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };

      // Keep both naming conventions aligned
      if (name === 'saleName' || name === 'saleEventName') {
        updated.saleName = val;
        updated.saleEventName = val;
      }
      if (name === 'heroSubtitle' || name === 'heroDescription') {
        updated.heroSubtitle = val;
        updated.heroDescription = val;
      }
      if (name === 'countdownTargetHours' || name === 'countdownHours') {
        updated.countdownTargetHours = Number(val);
        updated.countdownHours = Number(val);
      }
      if (name === 'liveViewerCount' || name === 'viewerCount') {
        updated.liveViewerCount = Number(val);
        updated.viewerCount = Number(val);
      }
      if (name === 'active' || name === 'isActive') {
        updated.active = val;
        updated.isActive = val;
      }
      if (name === 'promoCode' || name === 'couponCode') {
        updated.promoCode = val;
        updated.couponCode = val;
      }
      if (name === 'promoDiscount' || name === 'discountPercent') {
        updated.promoDiscount = Number(val);
        updated.discountPercent = Number(val);
      }
      if (name === 'promoHeadline' || name === 'bannerHeadline') {
        updated.promoHeadline = val;
        updated.bannerHeadline = val;
      }
      if (name === 'promoSubline' || name === 'bannerSubtitle') {
        updated.promoSubline = val;
        updated.bannerSubtitle = val;
      }
      if (name === 'mysteryOfferTitle' || name === 'secretOfferTitle') {
        updated.mysteryOfferTitle = val;
        updated.secretOfferTitle = val;
      }
      if (name === 'mysteryOfferCode' || name === 'secretCoupon') {
        updated.mysteryOfferCode = val;
        updated.secretCoupon = val;
      }
      if (name === 'mysteryOfferDesc' || name === 'secretBenefit') {
        updated.mysteryOfferDesc = val;
        updated.secretBenefit = val;
      }
      if (name === 'showMysteryOffer' || name === 'secretOfferEnabled') {
        updated.showMysteryOffer = val;
        updated.secretOfferEnabled = val;
      }

      return updated;
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSuccessMessage('');
      setErrorMessage('');

      // Send PUT request to /api/admin/live-sale
      const res = await fetch('/api/admin/live-sale', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage('Live Sale settings updated in MongoDB Compass successfully! Live Sale page is updated.');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setErrorMessage('Network error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-3 border-neutral-200 border-t-[#900606] rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-neutral-600">Loading Live Sale Manager...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Flame className="w-6 h-6 text-[#900606]" />
              Live Sale & Festival Offers Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Configure festival branding, countdown timers, promo coupons, and high-converting customer deals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <a
            href="/live-sale"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Page</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-[#900606] hover:bg-[#780505] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Settings */}
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. FESTIVAL BRANDING & HERO */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Sparkles className="w-4 h-4 text-[#900606]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              1. Festival Event & Hero Branding
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Sale Event Name
            </label>
            <input
              type="text"
              name="saleName"
              value={formData.saleName}
              onChange={handleChange}
              placeholder="e.g. Creator Mega Sale / Diwali Creator Fest"
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Top Announcement Ticker Bar Text
            </label>
            <input
              type="text"
              name="tickerText"
              value={formData.tickerText}
              onChange={handleChange}
              placeholder="e.g. CREATOR MEGA SALE • Deals worth creating for"
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Hero Heading
              </label>
              <input
                type="text"
                name="heroHeading"
                value={formData.heroHeading}
                onChange={handleChange}
                placeholder="e.g. BIG GEAR."
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Heading Highlight
              </label>
              <input
                type="text"
                name="heroHighlight"
                value={formData.heroHighlight}
                onChange={handleChange}
                placeholder="e.g. BIGGER SAVINGS."
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-[#900606] font-bold outline-none focus:border-[#900606]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              name="heroSubtitle"
              rows={3}
              value={formData.heroSubtitle}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 font-normal outline-none focus:border-[#900606]"
            />
          </div>
        </div>

        {/* 2. COUNTDOWN & URGENCY */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Clock className="w-4 h-4 text-[#900606]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              2. Countdown Timer & Urgency Controls
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Live Countdown Target (Hours)
            </label>
            <input
              type="number"
              name="countdownTargetHours"
              min={1}
              max={72}
              value={formData.countdownTargetHours}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              The live clock on the page counts down from this duration to create purchase urgency.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Live Viewer Social Proof Baseline Count
            </label>
            <input
              type="number"
              name="liveViewerCount"
              min={50}
              max={1000}
              value={formData.liveViewerCount}
              onChange={handleChange}
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Displays e.g. &ldquo;148 creators currently viewing this sale&rdquo;.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#900606] focus:ring-[#900606] cursor-pointer"
              />
              <span className="text-xs font-bold text-neutral-800">
                Live Sale Page Status: Active & Visible
              </span>
            </label>
          </div>
        </div>

        {/* 3. PROMO CODE BANNER */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Tag className="w-4 h-4 text-[#900606]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              3. Featured Promo Coupon Banner
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                placeholder="CREATE10"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-neutral-900 outline-none focus:border-[#900606]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Discount Percent (%)
              </label>
              <input
                type="number"
                name="promoDiscount"
                min={1}
                max={90}
                value={formData.promoDiscount}
                onChange={handleChange}
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-bold outline-none focus:border-[#900606]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Banner Headline
            </label>
            <input
              type="text"
              name="promoHeadline"
              value={formData.promoHeadline}
              onChange={handleChange}
              placeholder="EXTRA 10% OFF"
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Banner Subtitle
            </label>
            <input
              type="text"
              name="promoSubline"
              value={formData.promoSubline}
              onChange={handleChange}
              placeholder="Valid on all live deals & bundles • Zero min order"
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
          </div>
        </div>

        {/* 4. CONVERSION BOOSTER: SECRET FESTIVAL OFFER */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#900606]" />
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                4. Secret Festival Lucky Offer
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="showMysteryOffer"
                checked={formData.showMysteryOffer}
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#900606] focus:ring-[#900606] cursor-pointer"
              />
              <span className="text-[11px] font-bold text-neutral-600">Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Secret Offer Title
            </label>
            <input
              type="text"
              name="mysteryOfferTitle"
              value={formData.mysteryOfferTitle}
              onChange={handleChange}
              placeholder="Today's Secret Festival Deal!"
              className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Secret Coupon Code
              </label>
              <input
                type="text"
                name="mysteryOfferCode"
                value={formData.mysteryOfferCode}
                onChange={handleChange}
                placeholder="FEST500"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-neutral-900 outline-none focus:border-[#900606]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Secret Offer Benefit
              </label>
              <input
                type="text"
                name="mysteryOfferDesc"
                value={formData.mysteryOfferDesc}
                onChange={handleChange}
                placeholder="Flat ₹500 OFF on Bundles"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium outline-none focus:border-[#900606]"
              />
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            💡 This unlocks an interactive scratch / reveal button for visitors on the Live Sale page, boosting immediate checkout conversion!
          </p>
        </div>

      </form>
    </div>
  );
}

