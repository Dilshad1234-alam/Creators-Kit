import mongoose from 'mongoose';

const MasterclassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // image URL
  },
  badge: {
    type: String, // e.g. "100% Free"
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

if (mongoose.models.Masterclass) {
  delete mongoose.models.Masterclass;
}

export default mongoose.model('Masterclass', MasterclassSchema);
