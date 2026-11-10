import mongoose from 'mongoose';

const LiveSaleDealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    category: { type: String, default: 'CREATOR GEAR', trim: true },
    badge: { type: String, default: 'BESTSELLER', trim: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    discountText: { type: String, default: '', trim: true },
    discountPercent: { type: Number, default: 0 },
    savings: { type: Number, default: 0 },
    stockLeft: { type: Number, default: 7, min: 0 },
    stockTotal: { type: Number, default: 20, min: 0 },
    imageUrl: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    subtitle: { type: String, default: '', trim: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 120 },
    dealType: { type: String, enum: ['FLASH', 'CREATOR'], default: 'CREATOR' },
    dealUrl: { type: String, default: '/live-sale', trim: true },
    displayOrder: { type: Number, default: 1 },
    order: { type: Number, default: 1 },
    status: { type: String, enum: ['LIVE', 'Draft', 'DRAFT'], default: 'LIVE' },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'livesalecreatordeals',
    strict: false,
  }
);

// Pre-validate hook
LiveSaleDealSchema.pre('validate', function (next) {
  if (!this.title && this.name) this.title = this.name;
  if (!this.name && this.title) this.name = this.title;
  if (!this.imageUrl && this.image) this.imageUrl = this.image;
  if (!this.image && this.imageUrl) this.image = this.imageUrl;

  const orderNum = Number(this.displayOrder !== undefined ? this.displayOrder : this.order);
  this.displayOrder = isNaN(orderNum) ? 1 : orderNum;
  this.order = this.displayOrder;

  const price = Number(this.price) || 0;
  const mrp = Number(this.mrp) || price;
  this.savings = Math.max(0, mrp - price);
  this.discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  if (!this.discountText || this.discountText.trim() === '') {
    this.discountText = this.discountPercent > 0 ? `${this.discountPercent}% OFF` : '';
  }

  if (this.status) {
    this.active = this.status === 'LIVE';
  } else if (this.active !== undefined) {
    this.status = this.active ? 'LIVE' : 'Draft';
  }

  if (typeof next === 'function') next();
});

// Pre-save hook
LiveSaleDealSchema.pre('save', function (next) {
  if (!this.title && this.name) this.title = this.name;
  if (!this.name && this.title) this.name = this.title;
  if (!this.imageUrl && this.image) this.imageUrl = this.image;
  if (!this.image && this.imageUrl) this.image = this.imageUrl;
  if (typeof next === 'function') next();
});

export const LiveSaleCreatorDeal =
  mongoose.models.LiveSaleCreatorDeal ||
  mongoose.model('LiveSaleCreatorDeal', LiveSaleDealSchema);

export const LiveSaleDeal = LiveSaleCreatorDeal;

export default LiveSaleCreatorDeal;

