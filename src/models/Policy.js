import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  key: {
    type: String, // e.g., 'terms', 'privacy', 'shipping'
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
