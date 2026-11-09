import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILiveDeal extends Document {
  title: string;
  category: string;
  salePrice: number;
  mrp: number;
  discountPercent: number;
  inventoryCount: number;
  status: 'Active' | 'Flash' | 'Expired';
  image: string;
  subtitle?: string;
  badge?: string;
  dealUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LiveDealSchema = new Schema<ILiveDeal>(
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

// Auto-calculate discountPercent before save if not provided
LiveDealSchema.pre('save', function (next) {
  if (this.mrp && this.salePrice && this.mrp > this.salePrice) {
    this.discountPercent = Math.round(((this.mrp - this.salePrice) / this.mrp) * 100);
  }
  next();
});

if (mongoose.models && mongoose.models.LiveDeal) {
  delete mongoose.models.LiveDeal;
}

const LiveDeal: Model<ILiveDeal> =
  mongoose.models.LiveDeal || mongoose.model<ILiveDeal>('LiveDeal', LiveDealSchema);

export default LiveDeal;
