import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LiveSaleConfig from '@/models/LiveSaleConfig';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  saleEventName: 'Mega Creator Fest',
  saleName: 'Mega Creator Fest',
  tickerText: 'Diwali Creator Dhamaka Live Now • Extra 10% Off with code CREATE10',
  heroHeading: 'MEGA CREATOR FEST:',
  heroHighlight: 'UP TO 50% OFF',
  heroDescription:
    "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
  heroSubtitle:
    "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
  countdownHours: 8,
  countdownTargetHours: 8,
  countdownEndDate: '',
  viewerCount: 184,
  liveViewerCount: 184,
  isActive: true,
  active: true,
  couponCode: 'CREATE10',
  promoCode: 'CREATE10',
  discountPercent: 10,
  promoDiscount: 10,
  bannerHeadline: 'EXTRA 10% OFF',
  promoHeadline: 'EXTRA 10% OFF',
  bannerSubtitle: 'Valid on all live deals & bundles • Zero min order',
  promoSubline: 'Valid on all live deals & bundles • Zero min order',
  secretOfferTitle: "Today's Secret Festival Deal!",
  mysteryOfferTitle: "Today's Secret Festival Deal!",
  secretCoupon: 'FEST500',
  mysteryOfferCode: 'FEST500',
  secretBenefit: 'Flat ₹500 OFF on all Creator Bundles',
  mysteryOfferDesc: 'Flat ₹500 OFF on all Creator Bundles',
  secretOfferEnabled: true,
  showMysteryOffer: true,
};

function normalize(doc) {
  if (!doc) return { ...DEFAULT_CONFIG };
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc;

  const saleEventName = raw.saleEventName || raw.saleName || DEFAULT_CONFIG.saleEventName;
  const heroDescription = raw.heroDescription || raw.heroSubtitle || DEFAULT_CONFIG.heroDescription;
  const countdownHours = Number(raw.countdownHours ?? raw.countdownTargetHours ?? DEFAULT_CONFIG.countdownHours);
  const viewerCount = Number(raw.viewerCount ?? raw.liveViewerCount ?? DEFAULT_CONFIG.viewerCount);
  const isActive = raw.isActive !== undefined ? Boolean(raw.isActive) : (raw.active !== undefined ? Boolean(raw.active) : DEFAULT_CONFIG.isActive);
  const couponCode = raw.couponCode || raw.promoCode || DEFAULT_CONFIG.couponCode;
  const discountPercent = Number(raw.discountPercent ?? raw.promoDiscount ?? DEFAULT_CONFIG.discountPercent);
  const bannerHeadline = raw.bannerHeadline || raw.promoHeadline || DEFAULT_CONFIG.bannerHeadline;
  const bannerSubtitle = raw.bannerSubtitle || raw.promoSubline || DEFAULT_CONFIG.bannerSubtitle;
  const secretOfferTitle = raw.secretOfferTitle || raw.mysteryOfferTitle || DEFAULT_CONFIG.secretOfferTitle;
  const secretCoupon = raw.secretCoupon || raw.mysteryOfferCode || DEFAULT_CONFIG.secretCoupon;
  const secretBenefit = raw.secretBenefit || raw.mysteryOfferDesc || DEFAULT_CONFIG.secretBenefit;
  const secretOfferEnabled = raw.secretOfferEnabled !== undefined ? Boolean(raw.secretOfferEnabled) : (raw.showMysteryOffer !== undefined ? Boolean(raw.showMysteryOffer) : DEFAULT_CONFIG.secretOfferEnabled);

  return {
    ...DEFAULT_CONFIG,
    ...raw,
    saleEventName,
    saleName: saleEventName,
    heroDescription,
    heroSubtitle: heroDescription,
    countdownHours,
    countdownTargetHours: countdownHours,
    viewerCount,
    liveViewerCount: viewerCount,
    isActive,
    active: isActive,
    couponCode,
    promoCode: couponCode,
    discountPercent,
    promoDiscount: discountPercent,
    bannerHeadline,
    promoHeadline: bannerHeadline,
    bannerSubtitle,
    promoSubline: bannerSubtitle,
    secretOfferTitle,
    mysteryOfferTitle: secretOfferTitle,
    secretCoupon,
    mysteryOfferCode: secretCoupon,
    secretBenefit,
    mysteryOfferDesc: secretBenefit,
    secretOfferEnabled,
    showMysteryOffer: secretOfferEnabled,
  };
}

export async function GET() {
  try {
    await dbConnect();
    const config = await LiveSaleConfig.findOne().sort({ updatedAt: -1 }).lean();
    return NextResponse.json(normalize(config));
  } catch (error) {
    console.error('Error fetching live sale config:', error);
    return NextResponse.json(DEFAULT_CONFIG);
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const normalized = normalize(body);

    let existing = await LiveSaleConfig.findOne().sort({ updatedAt: -1 });
    if (existing) {
      Object.assign(existing, normalized);
      await existing.save();
      return NextResponse.json({ success: true, config: normalize(existing) });
    }

    const created = await LiveSaleConfig.create(normalized);
    return NextResponse.json({ success: true, config: normalize(created) });
  } catch (error) {
    console.error('Error saving live sale config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}
