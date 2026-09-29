const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit';

async function fixImages() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('creators-kit');
    
    // Fix WhatsInside
    const whatsinsides = db.collection('whatsinsides');
    const wiDocs = await whatsinsides.find({}).toArray();
    for (const doc of wiDocs) {
      if (doc.image && doc.image.includes(' ')) {
        const newImage = doc.image.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, ''); // replace spaces, remove parentheses if any
        await whatsinsides.updateOne({ _id: doc._id }, { $set: { image: newImage } });
      }
    }
    
    // Fix Products
    const products = db.collection('products');
    const pDocs = await products.find({}).toArray();
    for (const doc of pDocs) {
      let updated = false;
      const updates = {};
      
      if (doc.images && Array.isArray(doc.images)) {
        updates.images = doc.images.map(img => img.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, ''));
        updated = true;
      }
      
      if (updated) {
        await products.updateOne({ _id: doc._id }, { $set: updates });
      }
    }

    console.log('Fixed DB image URLs');
  } finally {
    await client.close();
  }
}

fixImages().catch(console.error);
