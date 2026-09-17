import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Content || mongoose.model('Content', ContentSchema);
