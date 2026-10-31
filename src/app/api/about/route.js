import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AboutContent from '@/models/AboutContent';

export const dynamic = 'force-dynamic';

const initialAboutData = {
  hero: {
    badge: 'OUR STORY',
    title: 'Empowering Creators Across',
    highlight: 'India',
    description:
      'At CreatorsKit, we believe everyone has a story to tell. Our mission is to equip creators with the right tools, knowledge and support to turn their passion into a profession.',
    ctaText: 'Shop Our Kits',
    ctaLink: '/product',
    image: '/about5.png',
    features: [
      { text: 'Premium Quality Products', icon: 'Diamond' },
      { text: 'Free Expert Courses', icon: 'GraduationCap' },
      { text: 'Creator Community', icon: 'Users' },
      { text: 'Dedicated Support', icon: 'Headphones' },
    ],
  },
  mission: {
    badge: 'OUR MISSION',
    title: 'To Create More and',
    highlight: 'More Creators',
    suffix: 'Across India',
    description:
      'We aim to make content creation simple, accessible and affordable for everyone. By providing high-quality creator kits, practical courses and a supportive community, we help individuals start, grow and succeed on platforms like Instagram, YouTube and beyond.',
    image: '/about2.png',
  },
  vision: {
    badge: 'OUR VISION',
    title: 'A Creator in',
    highlight: 'Every Home',
    description:
      'We envision a future where content creation becomes a mainstream career choice in India — where anyone, from any background or city, can start creating, share their talent with the world and build a successful career.',
    ctaText: 'Know Our Journey',
    ctaLink: '/contact',
    image: '/about1.png',
  },
  ctaBanner: {
    title: 'Join Our Growing',
    highlight: 'Creator Community',
    description:
      'Get the latest updates, tips, exclusive offers and be part of a community that supports creators across India.',
    ctaText: 'Join Now',
    ctaLink: '/contact',
    image: '/about4.png',
  },
  stats: [
    { value: '50,000+', label: 'Happy Creators', icon: 'Users', order: 1 },
    { value: '10,000+', label: 'Products Delivered', icon: 'Box', order: 2 },
    { value: '500+', label: 'Students Trained', icon: 'GraduationCap', order: 3 },
    { value: '4.8/5', label: 'Customer Rating', icon: 'Star', order: 4 },
  ],
  whyChoose: {
    title: 'Why Creators Choose',
    highlight: 'CreatorsKit?',
    subtitle: "We're more than just an online store. We're a complete ecosystem for creators.",
    cards: [
      {
        title: 'Curated Creator Kits',
        desc: 'High-quality, genuine products selected for creators.',
        icon: 'ShoppingCart',
        order: 1,
      },
      {
        title: 'Free Premium Courses',
        desc: 'Learn Instagram, YouTube, Video Editing and more with bundle purchases.',
        icon: 'BookOpen',
        order: 2,
      },
      {
        title: 'Supportive Community',
        desc: 'Be part of a growing community of creators across India.',
        icon: 'Users',
        order: 3,
      },
      {
        title: 'Expert Support',
        desc: 'Our team is always here to help you at every step of your journey.',
        icon: 'Headphones',
        order: 4,
      },
    ],
  },
  timeline: {
    title: 'Our',
    highlight: 'Story',
    subtitle: "From a small idea to a growing community of creators — here's how CreatorsKit came to life.",
    ctaText: 'Read More',
    ctaLink: '/contact',
    milestones: [
      {
        year: '2022',
        title: 'The Beginning',
        desc: 'We started with a simple mission — to help creators get the right tools at affordable prices.',
        order: 1,
      },
      {
        year: '2023',
        title: 'Building the Community',
        desc: 'Launched our creator bundles and free courses.',
        order: 2,
      },
      {
        year: '2024',
        title: 'Growing Together',
        desc: 'Reached 50,000+ happy creators across India.',
        order: 3,
      },
      {
        year: '2025',
        title: 'Bigger Vision',
        desc: 'Continuing our journey to create more and more creators in every city and town.',
        order: 4,
      },
    ],
  },
  team: {
    title: 'Meet',
    highlight: 'Our Team',
    subtitle: 'A passionate team working to empower creators across India.',
    members: [
      {
        name: 'Manish Kumar',
        role: 'Founder & CEO',
        desc: 'Building a creator-friendly India.',
        image: '/team/manish.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 1,
      },
      {
        name: 'Priya Sharma',
        role: 'Product & Community',
        desc: 'Connecting and growing our creator community.',
        image: '/team/priya.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 2,
      },
      {
        name: 'Rahul Verma',
        role: 'Marketing & Growth',
        desc: 'Helping creators reach new heights.',
        image: '/team/rahul.jpg',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 3,
      },
      {
        name: 'Ankit Singh',
        role: 'Operations & Support',
        desc: 'Ensuring the best experience for our creators.',
        image: '/team/ankit.png',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        order: 4,
      },
    ],
  },
};

export async function GET() {
  try {
    await dbConnect();
    let doc = await AboutContent.findOne();

    if (!doc) {
      doc = await AboutContent.create(initialAboutData);
    }

    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error('About GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    let doc = await AboutContent.findOne();
    if (!doc) {
      doc = await AboutContent.create(initialAboutData);
    }

    const body = await req.json();
    const { section, item } = body;

    if (!section || !item) {
      return NextResponse.json({ success: false, error: 'Section and item are required' }, { status: 400 });
    }

    if (section === 'team') {
      doc.team.members.push(item);
    } else if (section === 'timeline') {
      doc.timeline.milestones.push(item);
    } else if (section === 'stats') {
      doc.stats.push(item);
    } else if (section === 'whyChoose') {
      doc.whyChoose.cards.push(item);
    } else {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 });
    }

    await doc.save();
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error('About POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    let doc = await AboutContent.findOne();
    if (!doc) {
      doc = await AboutContent.create(initialAboutData);
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');
    const body = await req.json();

    // If updating a specific item inside an array
    if (section && id) {
      let targetItem = null;
      if (section === 'team') {
        targetItem = doc.team.members.id(id);
      } else if (section === 'timeline') {
        targetItem = doc.timeline.milestones.id(id);
      } else if (section === 'stats') {
        targetItem = doc.stats.id(id);
      } else if (section === 'whyChoose') {
        targetItem = doc.whyChoose.cards.id(id);
      }

      if (!targetItem) {
        return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
      }

      Object.assign(targetItem, body);
      await doc.save();
      return NextResponse.json({ success: true, data: doc });
    }

    // If updating a specific top-level section (e.g., hero, mission, vision, ctaBanner, or header texts)
    if (section) {
      if (section === 'hero' && body) {
        doc.hero = { ...doc.hero.toObject(), ...body };
      } else if (section === 'mission' && body) {
        doc.mission = { ...doc.mission.toObject(), ...body };
      } else if (section === 'vision' && body) {
        doc.vision = { ...doc.vision.toObject(), ...body };
      } else if (section === 'ctaBanner' && body) {
        doc.ctaBanner = { ...doc.ctaBanner.toObject(), ...body };
      } else if (section === 'teamHeaders' && body) {
        doc.team.title = body.title ?? doc.team.title;
        doc.team.highlight = body.highlight ?? doc.team.highlight;
        doc.team.subtitle = body.subtitle ?? doc.team.subtitle;
      } else if (section === 'timelineHeaders' && body) {
        doc.timeline.title = body.title ?? doc.timeline.title;
        doc.timeline.highlight = body.highlight ?? doc.timeline.highlight;
        doc.timeline.subtitle = body.subtitle ?? doc.timeline.subtitle;
        doc.timeline.ctaText = body.ctaText ?? doc.timeline.ctaText;
        doc.timeline.ctaLink = body.ctaLink ?? doc.timeline.ctaLink;
      } else if (section === 'whyChooseHeaders' && body) {
        doc.whyChoose.title = body.title ?? doc.whyChoose.title;
        doc.whyChoose.highlight = body.highlight ?? doc.whyChoose.highlight;
        doc.whyChoose.subtitle = body.subtitle ?? doc.whyChoose.subtitle;
      }
      await doc.save();
      return NextResponse.json({ success: true, data: doc });
    }

    // Otherwise, replace/merge whole doc
    const updated = await AboutContent.findByIdAndUpdate(doc._id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('About PUT Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    let doc = await AboutContent.findOne();
    if (!doc) {
      return NextResponse.json({ success: false, error: 'About content not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');

    if (!section || !id) {
      return NextResponse.json({ success: false, error: 'Section and ID required' }, { status: 400 });
    }

    if (section === 'team') {
      doc.team.members.pull({ _id: id });
    } else if (section === 'timeline') {
      doc.timeline.milestones.pull({ _id: id });
    } else if (section === 'stats') {
      doc.stats.pull({ _id: id });
    } else if (section === 'whyChoose') {
      doc.whyChoose.cards.pull({ _id: id });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 });
    }

    await doc.save();
    return NextResponse.json({ success: true, data: doc });
  } catch (error) {
    console.error('About DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

