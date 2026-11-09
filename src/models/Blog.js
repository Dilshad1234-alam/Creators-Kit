import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
    },
    slug: {
        type: String,
        required: [true, 'Please provide a unique slug'],
        unique: true,
        index: true,
    },
    content: {
        type: String,
        default: '',
    },
    excerpt: {
        type: String,
        default: '',
    },
    author: {
        type: String,
        default: 'Creator',
    },
    product: {
        type: String,
        default: '',
    },
    productImage: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/800x400?text=Blog+Cover',
    },
    videoUrl: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

if (mongoose.models && mongoose.models.Blog) {
  delete mongoose.models.Blog;
}
if (mongoose.connection && mongoose.connection.models && mongoose.connection.models.Blog) {
  delete mongoose.connection.models.Blog;
}

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);

