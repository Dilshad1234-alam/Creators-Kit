import mongoose from 'mongoose';

async function migrate() {
  try {
    await mongoose.connect('mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // 1. Update all existing products to be 'individual' only
    const updateRes = await db.collection('products').updateMany(
      {},
      { $set: { category: 'individual' } }
    );
    console.log(`Updated ${updateRes.modifiedCount} products to individual.`);

    // 2. Delete any existing 'bundle' products if any exist (to avoid duplicates)
    await db.collection('products').deleteMany({ category: 'bundle' });

    // 3. Insert the new main bundle product
    const newBundle = {
      name: 'PROFESSIONAL LED RING LIGHT',
      subheading: 'CREATOR BUNDLE - COMPLETE SETUP',
      price: 11795,
      originalPrice: 18495,
      stock: 100,
      description: 'An elite, all-in-one studio setup designed for serious creators. From the 10-inch precision LED ring light and noise-canceling wireless audio, to the chroma key green screen and comprehensive mastery courses—everything you need to dominate your niche is right here in one ultimate box.',
      category: 'bundle',
      images: [
        { src: '/kits 25 (1).jpg' },
        { src: '/kits 27 (1).jpg' },
        { src: '/kits 24 (1).jpg' },
        { src: '/kits 26 (1).jpg' },
        { src: '/kits 28 (1).jpg' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertRes = await db.collection('products').insertOne(newBundle);
    console.log(`Inserted bundle product with id ${insertRes.insertedId}`);

    console.log('Migration completed successfully.');
  } catch (e) {
    console.error('Error during migration:', e);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
