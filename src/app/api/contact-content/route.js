import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactContent from '@/models/ContactContent';

export const dynamic = 'force-dynamic';

export function generateMapUrls(address) {
  if (!address || !address.trim()) {
    return {
      embedUrl: 'https://maps.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
      directionsUrl: 'https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh'
    };
  }
  const clean = address.trim();
  // Check if raw iframe code was pasted
  if (clean.includes('<iframe') && clean.includes('src="')) {
    const match = clean.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return {
        embedUrl: match[1],
        directionsUrl: `https://maps.google.com/?q=${encodeURIComponent('Sector 62 Noida')}`
      };
    }
  }
  // Check if direct embed url was provided
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return {
      embedUrl: clean,
      directionsUrl: clean
    };
  }
  // Standard address query
  return {
    embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(clean)}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
    directionsUrl: `https://maps.google.com/?q=${encodeURIComponent(clean)}`
  };
}

const initialContactData = {
  hero: {
    badge: "WE'RE HERE TO HELP",
    title: "Let's Create",
    highlight: 'Something Amazing Together',
    description:
      'Have a question about our products, bundles, courses or your order? Our team is always ready to help you on your creator journey.',
    image: '/contact1.png',
    badges: [
      {
        icon: 'Headphones',
        title: 'Quick Support',
        subtitle: 'Get fast answers',
        order: 1,
      },
      {
        icon: 'ShieldCheck',
        title: 'Trusted & Reliable',
        subtitle: '100% genuine products',
        order: 2,
      },
      {
        icon: 'Users',
        title: 'Creator First',
        subtitle: "We're creators too",
        order: 3,
      },
    ],
  },
  channels: {
    formTitle: 'Get in',
    formHighlight: 'Touch',
    formSubtitle:
      'Fill out the form and our team will get back to you as soon as possible. We usually respond within 24 hours.',
    infoTitle: 'Contact',
    infoHighlight: 'Information',
    infoSubtitle:
      'You can also reach us directly through the following channels.',
    phone: {
      title: 'Call Us',
      number: '+91 98765 43210',
      timings: 'Mon – Sat, 10:00 AM – 7:00 PM',
    },
    email: {
      title: 'Email Us',
      address: 'support@creatorskit.in',
      note: 'We usually respond within 24 hours.',
    },
    whatsapp: {
      title: 'WhatsApp Support',
      number: '+91 98765 43210',
      note: 'Chat with us for quick help',
    },
    office: {
      title: 'Our Office',
      city: 'New Delhi, India',
      fullAddress:
        'A-123, Creator Hub, Sector 62, Noida, Uttar Pradesh 201309',
    },
  },
  location: {
    title: 'Our',
    highlight: 'Location',
    subtitle: 'Visit our office or find us on the map.',
    mapAddress: 'Sector 62, Noida, Uttar Pradesh 201309',
    mapEmbedUrl:
      'https://maps.google.com/maps?q=Sector+62+Noida+Uttar+Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://maps.google.com/?q=Sector+62+Noida+Uttar+Pradesh',
    officeImage: '/contact.png',
    perks: [
      {
        icon: 'Navigation',
        title: 'Easy to Reach',
        subtitle: 'Located in Noida',
        order: 1,
      },
      {
        icon: 'Car',
        title: 'Parking Spot',
        subtitle: 'Hassle-free parking',
        order: 2,
      },
      {
        icon: 'Train',
        title: 'Metro Friendly',
        subtitle: 'Near Sector 62',
        order: 3,
      },
    ],
  },
  faqs: {
    title: 'Frequently Asked',
    highlight: 'Questions',
    subtitle:
      "Find answers to the most common questions. Can't find what you're looking for? Contact us.",
    ctaText: 'View All FAQs',
    ctaLink: '/faq',
    items: [
      {
        question: 'How can I track my order?',
        answer:
          'You can easily track your order status live from your account dashboard or through the tracking link sent to your registered email and WhatsApp number after dispatch.',
        category: 'Orders',
        order: 1,
      },
      {
        question: 'What is the return and refund policy?',
        answer:
          'We offer a 7-day easy replacement policy for any damaged, defective, or incorrect studio gear delivered. Our support team arranges hassle-free doorstep pickup.',
        category: 'Orders',
        order: 2,
      },
      {
        question: 'Do you offer COD (Cash on Delivery)?',
        answer:
          'Yes, Cash on Delivery (COD) is available across major pin codes all over India with no hidden additional fees.',
        category: 'Payments',
        order: 3,
      },
      {
        question: 'How can I get the free courses with bundle purchase?',
        answer:
          'As soon as your bundle order is confirmed, lifetime access credentials and course links for all bonus masterclasses are automatically delivered to your email.',
        category: 'Courses',
        order: 4,
      },
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery across India usually takes 3 to 5 business days depending on your delivery address and city tier.',
        category: 'Shipping',
        order: 5,
      },
      {
        question: 'Are your products covered under warranty?',
        answer:
          'Yes, all our creator kits, lighting equipment, condenser mics, and heavy-duty tripods come with an official 1-year manufacturer warranty.',
        category: 'Warranty',
        order: 6,
      },
      {
        question: 'Can I get a bulk order or business inquiry?',
        answer:
          'Yes! For corporate bulk orders, podcast studio setups, schools, or creator academy setups, email us at support@creatorskit.in for custom institutional pricing.',
        category: 'Business',
        order: 7,
      },
      {
        question: 'How can I contact support on WhatsApp?',
        answer:
          'You can click our direct WhatsApp chat link or send a message to +91 98765 43210 for instant creator support and order assistance.',
        category: 'Support',
        order: 8,
      },
    ],
  },
};

// GET: Fetch or auto-seed contact content
export async function GET() {
  try {
    await dbConnect();
    let content = await ContactContent.findOne().lean();

    if (!content) {
      const created = await ContactContent.create(initialContactData);
      content = created.toObject();
    }

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to get contact content:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update entire document or a specific section
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();

    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create(initialContactData);
    }

    // 1. Updating a specific item inside an array (e.g. faq or perk)
    if (body.action === 'updateItem') {
      const { section, itemId, itemData } = body;
      if (section === 'faqs') {
        const item = content.faqs.items.id(itemId);
        if (item) {
          Object.assign(item, itemData);
          await content.save();
          return NextResponse.json({ success: true, data: content });
        }
        return NextResponse.json(
          { success: false, error: 'FAQ item not found' },
          { status: 404 }
        );
      }
      if (section === 'badges') {
        const item = content.hero.badges.id(itemId);
        if (item) {
          Object.assign(item, itemData);
          await content.save();
          return NextResponse.json({ success: true, data: content });
        }
        return NextResponse.json(
          { success: false, error: 'Hero badge item not found' },
          { status: 404 }
        );
      }
      if (section === 'perks') {
        const item = content.location.perks.id(itemId);
        if (item) {
          Object.assign(item, itemData);
          await content.save();
          return NextResponse.json({ success: true, data: content });
        }
        return NextResponse.json(
          { success: false, error: 'Location perk not found' },
          { status: 404 }
        );
      }
    }

    // 2. Updating a section directly (hero, channels, location, faqs)
    if (body.section) {
      const { section, data } = body;
      if (section === 'hero') {
        content.hero = { ...content.hero.toObject(), ...data };
      } else if (section === 'channels') {
        content.channels = { ...content.channels.toObject(), ...data };
      } else if (section === 'location') {
        const existingLocation = content.location.toObject();
        let updatedLocation = { ...existingLocation, ...data };

        // Automatically convert entered address to Google Maps embed URL
        if (data.mapAddress && (!data.mapEmbedUrl || data.autoGenerateEmbed !== false)) {
          const generated = generateMapUrls(data.mapAddress);
          updatedLocation.mapEmbedUrl = generated.embedUrl;
          if (!data.directionsUrl || data.autoGenerateDirections !== false) {
            updatedLocation.directionsUrl = generated.directionsUrl;
          }
        }
        content.location = updatedLocation;
      } else if (section === 'faqs') {
        content.faqs = { ...content.faqs.toObject(), ...data };
      }
      await content.save();
      return NextResponse.json({ success: true, data: content });
    }

    // 3. Full document replacement/update
    const updated = await ContactContent.findByIdAndUpdate(
      content._id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update contact content:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Add an item to an array (faq item, hero badge, location perk)
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { section, item } = body;

    let content = await ContactContent.findOne();
    if (!content) {
      content = await ContactContent.create(initialContactData);
    }

    if (section === 'faqs') {
      content.faqs.items.push(item);
    } else if (section === 'badges') {
      content.hero.badges.push(item);
    } else if (section === 'perks') {
      content.location.perks.push(item);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid section' },
        { status: 400 }
      );
    }

    await content.save();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to add contact content item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an item from an array (faq item, hero badge, location perk)
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const itemId = searchParams.get('itemId');

    if (!section || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Section and itemId are required' },
        { status: 400 }
      );
    }

    let content = await ContactContent.findOne();
    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    if (section === 'faqs') {
      content.faqs.items.pull({ _id: itemId });
    } else if (section === 'badges') {
      content.hero.badges.pull({ _id: itemId });
    } else if (section === 'perks') {
      content.location.perks.pull({ _id: itemId });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid section' },
        { status: 400 }
      );
    }

    await content.save();
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Failed to delete contact content item:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

