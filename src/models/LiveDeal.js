import mongoose from 'mongoose';

const LiveDealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a deal title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Flash Sales',
      trim: true,
    },
    salePrice: {
      type: Number,
      required: [true, 'Please provide sale price'],
      min: 0,
    },
    mrp: {
      type: Number,
      required: [true, 'Please provide original MRP'],
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
    },
    inventoryCount: {
      type: Number,
      default: 10,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Flash', 'Expired'],
      default: 'Active',
    },
    image: {
      type: String,
      default: '/pro1.png',
    },
    subtitle: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    dealUrl: {
      type: String,
      default: '/live-sale',
    },
  },
  {
    timestamps: true,
    collection: 'livedeals',
  }
);

// Auto-calculate discountPercent before save
LiveDealSchema.pre('save', function (next) {
  if (this.mrp && this.salePrice && this.mrp > this.salePrice) {
    this.discountPercent = Math.round(((this.mrp - this.salePrice) / this.mrp) * 100);
  }
  if (typeof next === 'function') next();
});

const LiveDeal =
  mongoose.models.LiveDeal || mongoose.model('LiveDeal', LiveDealSchema);

export { LiveDeal };
export default LiveDeal;
