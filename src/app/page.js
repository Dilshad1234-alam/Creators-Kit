import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import HomepageFeature from '@/models/HomepageFeature';
import Masterclass from '@/models/Masterclass';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
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
  
  const contentMap = {};
  content.forEach(item => {
    contentMap[item.key] = item.value;
  });

  // 2. Fetch Features
  let kitComponents = await HomepageFeature.find({}).sort({ order: 1 }).lean();
  kitComponents = kitComponents.map(doc => ({
    ...doc,
    _id: doc._id.toString()
  }));

  // 3. Fetch Masterclasses
  let masteryCourses = await Masterclass.find({}).sort({ order: 1 }).lean();
  masteryCourses = masteryCourses.map(doc => ({
    ...doc,
    _id: doc._id.toString()
  }));

  return (
    <HomeClient 
      contentMap={contentMap} 
      kitComponents={kitComponents} 
      masteryCourses={masteryCourses} 
    />
  );
}
