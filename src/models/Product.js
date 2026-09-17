import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  images: [{
    src: String,
  }],
  features: [String],
  useCase: String,
  benefit: String,
  icon: String,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
