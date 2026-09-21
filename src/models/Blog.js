import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide a unique slug'],
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide the blog content'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide a short excerpt'],
  },
  author: {
    type: String,
    default: 'Admin',
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/800x400?text=Blog+Cover',
  },
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);
