import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  unread: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String, // e.g. 'order', 'offer', 'security'
    default: 'system'
  }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
