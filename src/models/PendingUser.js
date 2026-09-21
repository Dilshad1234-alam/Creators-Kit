import mongoose from 'mongoose';

const PendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpire: {
      type: Date,
      required: true,
      expires: 0 // Automatically deletes the document when the current time >= otpExpire
    },
  },
  { timestamps: true }
);

export default mongoose.models.PendingUser || mongoose.model('PendingUser', PendingUserSchema);
