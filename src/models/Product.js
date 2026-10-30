import mongoose from 'mongoose';

const VariantImageSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      default: '/pro1.png',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const BonusMasterclassSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '/video.webp',
    },
    badge: {
      type: String,
      default: '100% Free',
    },
    originalPrice: {
      type: Number,
      default: 1999,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: false,
      index: true,
    },
    slug: {
      type: String,
      required: false,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    subheading: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
    image: {
      type: String,
      default: '/pro1.png',
    },
    video: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    images: {
      type: [VariantImageSchema],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    items: {
      type: [String],
      default: [],
    },
    specifications: [
      {
        label: String,
        value: String,
      },
    ],
    whatsInTheBox: [
      {
        name: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 120,
    },
    soldCount: {
      type: String,
      default: '1k+',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    useCase: String,
    benefit: String,
    icon: String,
    tag: String,
    discount: String,
    category: {
      type: String,
      default: 'individual',
      index: true,
    },
    productType: {
      type: String,
      enum: ['individual', 'bundle', 'thumbnail-bundle'],
      default: 'individual',
      index: true,
    },
    isBundle: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeaturedHero: {
      type: Boolean,
      default: false,
      index: true,
    },
    includeBonusCourses: {
      type: Boolean,
      default: true,
    },
    bonusMasterclasses: {
      type: [BonusMasterclassSchema],
      default: [
        {
          id: 'instagram-mastery',
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          image: '/video 2.webp',
          badge: '100% Free',
          originalPrice: 1999,
          active: true,
        },
        {
          id: 'youtube-mastery',
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          image: '/video 1.webp',
          badge: '100% Free',
          originalPrice: 1999,
          active: true,
        },
        {
          id: 'filmora-mastery',
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          image: '/video.webp',
          badge: '100% Free',
          originalPrice: 999,
          active: true,
        },
      ],
    },
  },
  { timestamps: true }
);

// Auto-populate id and sync productType before saving
ProductSchema.pre('save', function () {
  if (!this.id && this.name) {
    this.id = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (!this.slug && this.id) {
    this.slug = this.id;
  }
  if (!this.id && this.slug) {
    this.id = this.slug;
  }

  // Determine or synchronize productType and isBundle
  if (this.productType === 'thumbnail-bundle') {
    this.isBundle = false;
  } else if (this.productType === 'bundle') {
    this.isBundle = true;
  } else if (this.productType === 'individual') {
    this.isBundle = false;
  } else {
    if (this.images && this.images.length > 1 && this.images.some((v) => v.title || v.subtitle || v.price)) {
      this.productType = 'thumbnail-bundle';
      this.isBundle = false;
    } else if (this.isBundle || (this.category && this.category.toLowerCase().includes('bundle'))) {
      this.productType = 'bundle';
      this.isBundle = true;
    } else {
      this.productType = 'individual';
      this.isBundle = false;
    }
  }

  // Sync main image with first variant if images provided
  if (this.images && this.images.length > 0 && this.images[0].src && (!this.image || this.image === '/pro1.png')) {
    this.image = this.images[0].src;
  }
});

if (mongoose.models && mongoose.models.Product) {
  delete mongoose.models.Product;
}

export default mongoose.model('Product', ProductSchema);
