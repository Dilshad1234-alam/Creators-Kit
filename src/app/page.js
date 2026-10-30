import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import HomepageFeature from '@/models/HomepageFeature';
import Masterclass from '@/models/Masterclass';
import Blog from '@/models/Blog';
import HeroBanner from '@/models/HeroBanner';
import Category from '@/models/Category';
import Product from '@/models/Product';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const contentMap = {};
  let heroBanners = [];
  let categories = [];
  let kitComponents = [];
  let masteryCourses = [];
  let blogs = [];
  let featuredProducts = [];

  try {
    await dbConnect();
    
    // 1. Fetch Content
    let content = await Content.find({}).lean();
    if (content.length === 0) {
      const seedData = [
        { key: 'hero_badge', value: '🔥 All-in-One Creator Bundle' },
        { key: 'hero_heading', value: 'Unbox your potential' },
        { key: 'hero_subheading', value: 'The Complete Creator Bundle' },
        { key: 'hero_description', value: 'Stop guessing what gear you need. We provide the professional equipment, expert courses, and tactile resources so you can focus on what matters: making great content.' },
        { key: 'hero_btn1_text', value: 'Get Your Creator Kit' },
        { key: 'hero_btn2_text', value: 'Explore What\'s Inside' },
        { key: 'product_hero_heading', value: 'PROFESSIONAL LED RING LIGHT' },
        { key: 'product_badge_text', value: 'SAVE 55%' },
        { key: 'product_hero_desc', value: 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.' },
        { key: 'section_one_title', value: "Need Just One Piece?" },
        { key: 'section_two_title', value: 'The Complete Bundle' },
        { key: 'section_three_title', value: 'The Secret Sauce: Education' }
      ];
      await Content.insertMany(seedData);
      content = await Content.find({}).lean();
    }
    content.forEach(item => {
      contentMap[item.key] = item.value;
    });

    // 2. Fetch Hero Banners
    let bannersData = await HeroBanner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    if (bannersData.length === 0) {
      const seedBanners = [
        { image: '/banner 5.png', title: 'ALL-IN-ONE CREATOR KIT', subtitle: '🚀 Everything You Need', ctaText: 'Explore Bundle', link: '/product', order: 1, active: true },
        { image: '/banner 1.png', title: 'PROFESSIONAL LIGHTING.', subtitle: '💡 Studio Grade', ctaText: 'Shop Lighting', link: '/product', order: 2, active: true },
        { image: '/banner 2.jpg', title: 'ULTIMATE STABILITY.', subtitle: '📸 Carbon Fiber', ctaText: 'Explore Tripods', link: '/product', order: 3, active: true },
        { image: '/banners 2.jpg', title: 'CRYSTAL CLEAR AUDIO.', subtitle: '🎙️ Pro Sound', ctaText: 'Shop Microphones', link: '/product', order: 4, active: true },
      ];
      await HeroBanner.insertMany(seedBanners);
      bannersData = await HeroBanner.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    }
    heroBanners = bannersData.map(doc => ({ ...doc, _id: doc._id.toString() }));

    // 3. Fetch Categories
    let catsData = await Category.find({}).sort({ order: 1 }).lean();
    if (catsData.length === 0) {
      const seedCategories = [
        { name: 'Lights', image: '/ring.jpg', link: '/product', itemCount: 'Studio Lighting', order: 1 },
        { name: 'Pro Tripods', image: '/tripod.jpg', link: '/product', itemCount: 'Heavy Duty Stands', order: 2 },
        { name: 'Gimbal/Rig', image: '/chorma.jpg', link: '/product', itemCount: 'Stabilizers & Backdrops', order: 3 },
        { name: 'Microphones', image: '/wireless-mic.jpg', link: '/product', itemCount: 'Wireless Audio', order: 4 },
      ];
      await Category.insertMany(seedCategories);
      catsData = await Category.find({}).sort({ order: 1 }).lean();
    }
    categories = catsData.map(doc => ({ ...doc, _id: doc._id.toString() }));

    // 4. Fetch Features
    kitComponents = await HomepageFeature.find({}).sort({ order: 1 }).lean();
    kitComponents = kitComponents.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));

    // 5. Fetch Masterclasses (Learn & Grow Cards)
    masteryCourses = await Masterclass.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    if (masteryCourses.length === 0) {
      const seedMasterclasses = [
        {
          title: 'Instagram Mastery',
          description: 'Learn the algorithm secrets, how to go viral with Reels, and build a dedicated following fast.',
          icon: '📱',
          image: '/banner 5.png',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 1,
          active: true,
        },
        {
          title: 'YouTube Mastery',
          description: 'Master SEO, thumbnail creation, and viewer retention to monetize your channel efficiently.',
          icon: '▶️',
          image: '/banner 6.png',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 2,
          active: true,
        },
        {
          title: 'Filmora Mastery',
          description: 'Professional video editing made simple. Learn cuts, transitions, effects, and color grading.',
          icon: '🎬',
          image: '/banner 8.png',
          badge: '100% Free',
          ctaText: 'Explore Bundles',
          ctaLink: '/product',
          order: 3,
          active: true,
        },
      ];
      await Masterclass.insertMany(seedMasterclasses);
      masteryCourses = await Masterclass.find({ active: { $ne: false } }).sort({ order: 1 }).lean();
    }
    masteryCourses = masteryCourses.map(doc => ({
      ...doc,
      _id: doc._id.toString()
    }));

    // 6. Fetch Blogs for Review of Creators section
    blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(10).lean();
    blogs = blogs.map(doc => ({
      ...doc,
      _id: doc._id.toString(),
      id: doc.slug || doc._id.toString()
    }));

    // 7. Fetch Individual Products for Features Products section
    const rawProducts = await Product.find({
      $or: [
        { productType: 'individual' },
        { productType: { $exists: false }, isBundle: false }
      ]
    }).sort({ createdAt: -1 }).lean();

    featuredProducts = rawProducts.map((p) => {
      const priceVal = typeof p.price === 'number' ? p.price : Number(p.price) || 0;
      const origVal = p.originalPrice ? Number(p.originalPrice) : Math.round(priceVal * 1.3);
      const discountVal = p.discount || (origVal > priceVal ? `${Math.round(((origVal - priceVal) / origVal) * 100)}% OFF` : '');
      return {
        id: p.id || p._id.toString(),
        _id: p._id.toString(),
        name: p.name,
        price: priceVal,
        mrp: origVal,
        discount: discountVal,
        image: p.image || (Array.isArray(p.images) && p.images[0]?.src) || '/ring.jpg',
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 120,
      };
    });

  } catch (error) {
    console.warn('MongoDB connection or query skipped on homepage:', error.message);
  }

  return (
    <HomeClient 
      contentMap={contentMap}
      heroBanners={heroBanners}
      categories={categories}
      kitComponents={kitComponents} 
      masteryCourses={masteryCourses} 
      blogs={blogs}
      featuredProducts={featuredProducts}
    />
  );
}
