import mongoose from 'mongoose';

const StatSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  icon: { type: String, default: 'Users' },
  order: { type: Number, default: 0 },
});

const WhyChooseCardSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: 'ShoppingCart' },
  order: { type: Number, default: 0 },
});

const TimelineMilestoneSchema = new mongoose.Schema({
  year: { type: String, default: '' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  desc: { type: String, default: '' },
  image: { type: String, default: '' },
  linkedin: { type: String, default: 'https://linkedin.com' },
  instagram: { type: String, default: 'https://instagram.com' },
  order: { type: Number, default: 0 },
});

const AboutContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: 'OUR STORY' },
      title: { type: String, default: 'Empowering Creators Across' },
      highlight: { type: String, default: 'India' },
      description: {
        type: String,
        default:
          'At CreatorsKit, we believe everyone has a story to tell. Our mission is to equip creators with the right tools, knowledge and support to turn their passion into a profession.',
      },
      ctaText: { type: String, default: 'Shop Our Kits' },
      ctaLink: { type: String, default: '/product' },
      image: { type: String, default: '/about5.png' },
      features: [
        {
          text: { type: String, default: '' },
          icon: { type: String, default: 'Diamond' },
        },
      ],
    },
    mission: {
      badge: { type: String, default: 'OUR MISSION' },
      title: { type: String, default: 'To Create More and' },
      highlight: { type: String, default: 'More Creators' },
      suffix: { type: String, default: 'Across India' },
      description: {
        type: String,
        default:
          'We aim to make content creation simple, accessible and affordable for everyone. By providing high-quality creator kits, practical courses and a supportive community, we help individuals start, grow and succeed on platforms like Instagram, YouTube and beyond.',
      },
      image: { type: String, default: '/about2.png' },
    },
    vision: {
      badge: { type: String, default: 'OUR VISION' },
      title: { type: String, default: 'A Creator in' },
      highlight: { type: String, default: 'Every Home' },
      description: {
        type: String,
        default:
          'We envision a future where content creation becomes a mainstream career choice in India — where anyone, from any background or city, can start creating, share their talent with the world and build a successful career.',
      },
      ctaText: { type: String, default: 'Know Our Journey' },
      ctaLink: { type: String, default: '/contact' },
      image: { type: String, default: '/about1.png' },
    },
    ctaBanner: {
      title: { type: String, default: 'Join Our Growing' },
      highlight: { type: String, default: 'Creator Community' },
      description: {
        type: String,
        default:
          'Get the latest updates, tips, exclusive offers and be part of a community that supports creators across India.',
      },
      ctaText: { type: String, default: 'Join Now' },
      ctaLink: { type: String, default: '/contact' },
      image: { type: String, default: '/about4.png' },
    },
    stats: [StatSchema],
    whyChoose: {
      title: { type: String, default: 'Why Creators Choose' },
      highlight: { type: String, default: 'CreatorsKit?' },
      subtitle: {
        type: String,
        default: "We're more than just an online store. We're a complete ecosystem for creators.",
      },
      cards: [WhyChooseCardSchema],
    },
    timeline: {
      title: { type: String, default: 'Our' },
      highlight: { type: String, default: 'Story' },
      subtitle: {
        type: String,
        default: "From a small idea to a growing community of creators — here's how CreatorsKit came to life.",
      },
      ctaText: { type: String, default: 'Read More' },
      ctaLink: { type: String, default: '/contact' },
      milestones: [TimelineMilestoneSchema],
    },
    team: {
      title: { type: String, default: 'Meet' },
      highlight: { type: String, default: 'Our Team' },
      subtitle: {
        type: String,
        default: 'A passionate team working to empower creators across India.',
      },
      members: [TeamMemberSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutContent || mongoose.model('AboutContent', AboutContentSchema);

