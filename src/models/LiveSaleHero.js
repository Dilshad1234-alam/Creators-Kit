import mongoose from 'mongoose';

const LiveSaleHeroSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      trim: true,
      default: '',
    },
    bannerImageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    displayOrder: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['LIVE', 'Draft', 'DRAFT'],
      default: 'LIVE',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'livesalebanner',
    strict: false,
  }
);

LiveSaleHeroSchema.pre('validate', function (next) {
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

LiveSaleHeroSchema.pre('save', function (next) {
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

const LiveSaleHero =
  mongoose.models.LiveSaleHero ||
  mongoose.model('LiveSaleHero', LiveSaleHeroSchema);

export { LiveSaleHero };
export default LiveSaleHero;
