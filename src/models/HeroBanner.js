import mongoose from 'mongoose';

const HeroBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    mobileImage: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    ctaText: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '/product',
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroBanner || mongoose.model('HeroBanner', HeroBannerSchema);
