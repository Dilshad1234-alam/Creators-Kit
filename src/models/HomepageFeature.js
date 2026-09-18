import mongoose from 'mongoose';

const HomepageFeatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  useCase: {
    type: String,
  },
  benefit: {
    type: String,
  },
  icon: {
    type: String, // Emoji or short text
  },
  image: {
    type: String, // URL
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.models.HomepageFeature || mongoose.model('HomepageFeature', HomepageFeatureSchema);
