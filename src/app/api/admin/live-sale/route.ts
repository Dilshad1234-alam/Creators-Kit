import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LiveSaleConfig from '@/models/LiveSaleConfig';

export const dynamic = 'force-dynamic';

const DEFAULT_CONFIG = {
  saleEventName: 'Mega Creator Fest',
  tickerText: 'Diwali Creator Dhamaka Live Now • Extra 10% Off with code CREATE10',
  heroHeading: 'MEGA CREATOR FEST:',
  heroHighlight: 'UP TO 50% OFF',
  heroDescription:
    "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
  countdownHours: 8,
  countdownEndDate: '',
  viewerCount: 184,
  isActive: true,
  couponCode: 'CREATE10',
  discountPercent: 10,
  bannerHeadline: 'EXTRA 10% OFF',
  bannerSubtitle: 'Valid on all live deals & bundles • Zero min order',
  secretOfferTitle: "Today's Secret Festival Deal!",
  secretCoupon: 'FEST500',
  secretBenefit: 'Flat ₹500 OFF on all Creator Bundles',
  secretOfferEnabled: true,

  // Legacy field mirrors
  saleName: 'Mega Creator Fest',
  heroSubtitle:
    "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
  countdownTargetHours: 8,
  liveViewerCount: 184,
  active: true,
  promoCode: 'CREATE10',
  promoDiscount: 10,
  promoHeadline: 'EXTRA 10% OFF',
  promoSubline: 'Valid on all live deals & bundles • Zero min order',
  mysteryOfferTitle: "Today's Secret Festival Deal!",
  mysteryOfferCode: 'FEST500',
  mysteryOfferDesc: 'Flat ₹500 OFF on all Creator Bundles',
  showMysteryOffer: true,
};

function normalizeConfig(doc: any) {
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
    const normalized = normalizeConfig(config);
    return NextResponse.json(normalized, { status: 200 });
  } catch (error: any) {
    console.error('[LIVE SALE GET API ERROR]:', error);
    return NextResponse.json(DEFAULT_CONFIG, { status: 200 });
  }
}

async function handleSave(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const normalized = normalizeConfig(body);

    let existing = await LiveSaleConfig.findOne().sort({ updatedAt: -1 });

    if (existing) {
      Object.assign(existing, normalized);
      await existing.save();
      console.log('[LIVE SALE API] Updated existing config:', existing._id);
      return NextResponse.json({
        success: true,
        message: 'Live Sale settings updated in MongoDB Compass successfully!',
        config: normalizeConfig(existing),
      });
    }

    const created = await LiveSaleConfig.create(normalized);
    console.log('[LIVE SALE API] Created new config:', created._id);
    return NextResponse.json({
      success: true,
      message: 'Live Sale settings created in MongoDB Compass successfully!',
      config: normalizeConfig(created),
    });
  } catch (error: any) {
    console.error('[LIVE SALE SAVE API ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save Live Sale configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleSave(request);
}

export async function PUT(request: Request) {
  return handleSave(request);
}

