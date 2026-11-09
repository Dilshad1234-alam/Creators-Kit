import mongoose from 'mongoose';

const LiveSaleConfigSchema = new mongoose.Schema(
  {
    saleEventName: {
      type: String,
      default: 'Mega Creator Fest',
    },
    tickerText: {
      type: String,
      default: 'Diwali Creator Dhamaka Live Now • Extra 10% Off with code CREATE10',
    },
    heroHeading: {
      type: String,
      default: 'MEGA CREATOR FEST:',
    },
    heroHighlight: {
      type: String,
      default: 'UP TO 50% OFF',
    },
    heroDescription: {
      type: String,
      default:
        "Equip your dream studio with India's #1 creator gear. Instant festive price drops + 3 free masterclasses on every bundle.",
    },
    countdownHours: {
      type: Number,
      default: 8,
    },
    countdownEndDate: {
      type: String,
      default: '',
    },
    viewerCount: {
      type: Number,
      default: 184,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    couponCode: {
      type: String,
      default: 'CREATE10',
    },
    discountPercent: {
      type: Number,
      default: 10,
    },
    bannerHeadline: {
      type: String,
      default: 'EXTRA 10% OFF',
    },
    bannerSubtitle: {
      type: String,
      default: 'Valid on all live deals & bundles • Zero min order',
    },
    secretOfferTitle: {
      type: String,
      default: "Today's Secret Festival Deal!",
    },
    secretCoupon: {
      type: String,
      default: 'FEST500',
    },
    secretBenefit: {
      type: String,
      default: 'Flat ₹500 OFF on all Creator Bundles',
    },
    secretOfferEnabled: {
      type: Boolean,
      default: true,
    },

    // Legacy compatibility fields
    saleName: { type: String },
    heroSubtitle: { type: String },
    countdownTargetHours: { type: Number },
    liveViewerCount: { type: Number },
    active: { type: Boolean },
    promoCode: { type: String },
    promoDiscount: { type: Number },
    promoHeadline: { type: String },
    promoSubline: { type: String },
    mysteryOfferTitle: { type: String },
    mysteryOfferCode: { type: String },
    mysteryOfferDesc: { type: String },
    showMysteryOffer: { type: Boolean },
  },
  { timestamps: true, collection: 'livesaleconfigs' }
);

if (mongoose.models && mongoose.models.LiveSaleConfig) {
  delete mongoose.models.LiveSaleConfig;
}

export default mongoose.models.LiveSaleConfig || mongoose.model('LiveSaleConfig', LiveSaleConfigSchema);
