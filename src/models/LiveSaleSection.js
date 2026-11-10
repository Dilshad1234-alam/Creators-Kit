import mongoose from 'mongoose';

// 1. LiveSaleHeroBanner Schema
const LiveSaleHeroBannerSchema = new mongoose.Schema(
  {
    bannerImage: { type: String, trim: true, default: '' },
    bannerImageUrl: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 1 },
    order: { type: Number, default: 1 },
    status: { type: String, enum: ['LIVE', 'Draft', 'DRAFT'], default: 'LIVE' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'livesalebanner', strict: false }
);

LiveSaleHeroBannerSchema.pre('validate', function (next) {
  const img = this.bannerImage || this.bannerImageUrl || this.image || '';
  if (img) {
    this.bannerImage = img;
    this.bannerImageUrl = img;
    this.image = img;
  }
  const orderNum = Number(this.displayOrder !== undefined ? this.displayOrder : this.order);
  this.displayOrder = isNaN(orderNum) ? 1 : orderNum;
  this.order = this.displayOrder;

  if (this.status) {
    this.active = this.status === 'LIVE';
  } else if (this.active !== undefined) {
    this.status = this.active ? 'LIVE' : 'Draft';
  }
  if (typeof next === 'function') next();
});

LiveSaleHeroBannerSchema.pre('save', function (next) {
  const img = this.bannerImage || this.bannerImageUrl || this.image || '';
  if (img) {
    this.bannerImage = img;
    this.bannerImageUrl = img;
    this.image = img;
  }
  const orderNum = Number(this.displayOrder !== undefined ? this.displayOrder : this.order);
  this.displayOrder = isNaN(orderNum) ? 1 : orderNum;
  this.order = this.displayOrder;

  if (typeof next === 'function') next();
});

// 2. LiveSaleFlashDeal Schema
const LiveSaleFlashDealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    tag: { type: String, default: 'FLASH DEAL', trim: true },
    subtitle: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    savings: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    stockLeft: { type: Number, default: 10, min: 0 },
    stockTotal: { type: Number, default: 50, min: 0 },
    image: { type: String, required: true, trim: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 120 },
    freeBonus: { type: String, default: '', trim: true },
    dealUrl: { type: String, default: '/live-sale', trim: true },
    order: { type: Number, default: 1 },
    status: { type: String, enum: ['LIVE', 'DRAFT'], default: 'LIVE' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'livesaleflashdeals' }
);

LiveSaleFlashDealSchema.pre('save', function (next) {
  if (this.mrp && this.price) {
    this.savings = Math.max(0, this.mrp - this.price);
    if (this.mrp > this.price) {
      this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    }
  }
  if (typeof next === 'function') next();
});

// 3. LiveSaleCategoryGrid Schema
const LiveSaleCategoryGridSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    itemCount: { type: String, default: 'Studio Gear', trim: true },
    image: { type: String, required: true, trim: true },
    discount: { type: String, default: 'UP TO 50% OFF', trim: true },
    startingPrice: { type: String, default: '₹999', trim: true },
    badge: { type: String, default: 'HOT DEAL', trim: true },
    link: { type: String, default: '/product', trim: true },
    order: { type: Number, default: 1 },
    status: { type: String, enum: ['LIVE', 'DRAFT'], default: 'LIVE' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'livesalecategories' }
);

// 4. LiveSaleFAQ Schema
const LiveSaleFAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    order: { type: Number, default: 1 },
    status: { type: String, enum: ['LIVE', 'DRAFT'], default: 'LIVE' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'livesalefaqs' }
);

export const LiveSaleHeroBanner =
  mongoose.models.LiveSaleHeroBanner ||
  mongoose.model('LiveSaleHeroBanner', LiveSaleHeroBannerSchema);

export const LiveSaleFlashDeal =
  mongoose.models.LiveSaleFlashDeal ||
  mongoose.model('LiveSaleFlashDeal', LiveSaleFlashDealSchema);

export const LiveSaleCategoryGrid =
  mongoose.models.LiveSaleCategoryGrid ||
  mongoose.model('LiveSaleCategoryGrid', LiveSaleCategoryGridSchema);

export const LiveSaleFAQ =
  mongoose.models.LiveSaleFAQ ||
  mongoose.model('LiveSaleFAQ', LiveSaleFAQSchema);

export { LiveSaleCreatorDeal } from './LiveSaleDeal.js';

export default {
  LiveSaleHeroBanner,
  LiveSaleFlashDeal,
  LiveSaleCreatorDeal: mongoose.models.LiveSaleCreatorDeal,
  LiveSaleCategoryGrid,
  LiveSaleFAQ,
};

