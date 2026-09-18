import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
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
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  applicableProduct: {
    type: String,
    default: 'ALL',
  }
}, { timestamps: true });

// Prevent model overwrite in development HMR
if (mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
