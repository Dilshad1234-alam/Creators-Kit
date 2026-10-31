import mongoose from 'mongoose';

const HeroFeatureSchema = new mongoose.Schema({
  icon: { type: String, default: 'Headphones' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const LocationPerkSchema = new mongoose.Schema({
  icon: { type: String, default: 'Navigation' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const FaqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'General' },
  order: { type: Number, default: 0 },
});

const ContactContentSchema = new mongoose.Schema(
  {
    hero: {
      badge: { type: String, default: "WE'RE HERE TO HELP" },
      title: { type: String, default: "Let's Create" },
      highlight: { type: String, default: 'Something Amazing Together' },
      description: {
        type: String,
        default:
          'Have a question about our products, bundles, courses or your order? Our team is always ready to help you on your creator journey.',
      },
      image: { type: String, default: '/contact1.png' },
      badges: [HeroFeatureSchema],
    },
    channels: {
      formTitle: { type: String, default: 'Get in' },
      formHighlight: { type: String, default: 'Touch' },
      formSubtitle: {
        type: String,
        default:
          'Fill out the form and our team will get back to you as soon as possible. We usually respond within 24 hours.',
      },
      infoTitle: { type: String, default: 'Contact' },
      infoHighlight: { type: String, default: 'Information' },
      infoSubtitle: {
        type: String,
        default: 'You can also reach us directly through the following channels.',
      },
      phone: {
        title: { type: String, default: 'Call Us' },
        number: { type: String, default: '+91 98765 43210' },
        timings: { type: String, default: 'Mon – Sat, 10:00 AM – 7:00 PM' },
      },
      email: {
        title: { type: String, default: 'Email Us' },
        address: { type: String, default: 'support@creatorskit.in' },
        note: { type: String, default: 'We usually respond within 24 hours.' },
      },
      whatsapp: {
        title: { type: String, default: 'WhatsApp Support' },
        number: { type: String, default: '+91 98765 43210' },
        note: { type: String, default: 'Chat with us for quick help' },
      },
      office: {
        title: { type: String, default: 'Our Office' },
        city: { type: String, default: 'New Delhi, India' },
        fullAddress: {
          type: String,
          default: 'A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309',
        },
      },
    },
    location: {
      title: { type: String, default: 'Our' },
      highlight: { type: String, default: 'Location' },
      subtitle: {
        type: String,
        default: 'Visit our office or find us on the map.',
      },
      mapAddress: {
        type: String,
        default: 'Sector 62, Noida, Uttar Pradesh 201309',
      },
      mapEmbedUrl: {
        type: String,
        default:
          'https://maps.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
      },
      directionsUrl: {
        type: String,
        default: 'https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh',
      },
      officeImage: { type: String, default: '/contact.png' },
      perks: [LocationPerkSchema],
    },
    faqs: {
      title: { type: String, default: 'Frequently Asked' },
      highlight: { type: String, default: 'Questions' },
      subtitle: {
        type: String,
        default:
          "Find answers to the most common questions. Can't find what you're looking for? Contact us.",
      },
      ctaText: { type: String, default: 'View All FAQs' },
      ctaLink: { type: String, default: '/faq' },
      items: [FaqItemSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactContent ||
  mongoose.model('ContactContent', ContactContentSchema);

