import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage',
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    // Scope: 'ALL' (Site-wide), 'PRODUCTS' (Specific Individual Products), 'BUNDLES' (Creator Bundles), 'THUMBNAIL_BUNDLES' (Thumbnail Bundles), 'CATEGORY' (Specific Category)
    appliesTo: {
      type: String,
      enum: ['ALL', 'PRODUCTS', 'BUNDLES', 'THUMBNAIL_BUNDLES', 'CATEGORY'],
      default: 'ALL',
    },
    // Array of targeted Product IDs or Slugs
    applicableProducts: {
      type: [String],
      default: [],
    },
    // Array of targeted Category names
    applicableCategories: {
      type: [String],
      default: [],
    },
    // Backward compatibility for existing records
    applicableProduct: {
      type: String,
      default: 'ALL',
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in development HMR
if (mongoose.models && mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
