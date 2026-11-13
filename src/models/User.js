import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
      type: Boolean,
      default: true,
    },
    otpCode: String,
    otpExpire: Date,
    phone: String,
    location: String,
    postalCode: String,
    profileImage: String,
    hasPurchased: {
      type: Boolean,
      default: false,
    },
    unlockedMasterclasses: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, collection: 'users' }
);

// Hash password before saving to the database
UserSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
