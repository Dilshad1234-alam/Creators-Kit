const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit';

async function fixImages() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('creators-kit');
    
    // Fix HomepageFeatures
    const hpf = db.collection('homepagefeatures');
    const hpfDocs = await hpf.find({}).toArray();
    for (const doc of hpfDocs) {
      if (doc.image && typeof doc.image === 'string' && doc.image.includes(' ')) {
        const newImage = doc.image.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
        await hpf.updateOne({ _id: doc._id }, { $set: { image: newImage } });
      }
    }

    // Fix Masterclasses
    const mc = db.collection('masterclasses');
    const mcDocs = await mc.find({}).toArray();
    for (const doc of mcDocs) {
      if (doc.image && typeof doc.image === 'string' && doc.image.includes(' ')) {
        const newImage = doc.image.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
        await mc.updateOne({ _id: doc._id }, { $set: { image: newImage } });
      }
    }
    
    // Fix Products
    const products = db.collection('products');
    const pDocs = await products.find({}).toArray();
    for (const doc of pDocs) {
      let updated = false;
      const updates = {};
      
      if (doc.image && typeof doc.image === 'string' && doc.image.includes(' ')) {
        updates.image = doc.image.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
        updated = true;
      }
      
      if (doc.images && Array.isArray(doc.images)) {
        updates.images = doc.images.map(img => {
          if (typeof img === 'string') return img.replace(/ /g, '-').replace(/\(/g, '').replace(/\)/g, '');
          return img;
        });
        updated = true;
      }
      
      if (updated) {
        await products.updateOne({ _id: doc._id }, { $set: updates });
      }
    }

    console.log('Fixed DB image URLs successfully');
  } finally {
    await client.close();
  }
}

fixImages().catch(console.error);
