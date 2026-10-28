import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  fileSize: { type: String, default: '' },
  fileType: { type: String, default: 'PDF Document' },
  downloadUrl: { type: String, default: '' },
}, { _id: false });

const LessonSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  duration: { type: String, default: '10:00' },
  videoUrl: { type: String, default: '' },
  videoLink: { type: String, default: '' },
  subtitles: { type: String, default: '' },
  locked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  overview: { type: String, default: '' },
  keyTakeaways: [{ type: String }],
  resources: [ResourceSchema],
}, { _id: false });

const ModuleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  lessons: [LessonSchema],
}, { _id: false });

const MasterclassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  badge: {
    type: String,
    default: '100% Free',
    trim: true,
  },
  icon: {
    type: String,
    default: '🎬',
    trim: true,
  },
  image: {
    type: String,
    default: '',
    trim: true,
  },
  videoUrl: {
    type: String,
    default: '',
    trim: true,
  },
  videoLink: {
    type: String,
    default: '',
    trim: true,
  },
  duration: {
    type: String,
    default: '2h 30m',
    trim: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  ctaText: {
    type: String,
    default: 'Explore Bundles',
    trim: true,
  },
  ctaLink: {
    type: String,
    default: '/product',
    trim: true,
  },
  order: {
    type: Number,
    default: 1,
  },
  active: {
    type: Boolean,
    default: true,
  },
  modules: [ModuleSchema],
}, { timestamps: true });

if (mongoose.models.Masterclass) {
  delete mongoose.models.Masterclass;
}

export default mongoose.models.Masterclass || mongoose.model('Masterclass', MasterclassSchema);
