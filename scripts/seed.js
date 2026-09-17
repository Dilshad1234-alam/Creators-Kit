import mongoose from 'mongoose';
import dbConnect from '../src/lib/mongodb.js';
import Product from '../src/models/Product.js';
import Content from '../src/models/Content.js';
import Policy from '../src/models/Policy.js';

// Run with: node seed.js (might need to configure node for ES modules if outside Next)
// Because we are inside Next.js, it's easier to run this via an API endpoint or script.
// For now, I'll export a function that can be called from an API route.

export const seedDatabase = async () => {
  await dbConnect();

  // Seed Products
  const kitComponents = [
    {
      id: 'bundle-01',
      name: 'Zinmatt Creators Kit - Complete Bundle',
      description: 'The ultimate creator bundle.',
      price: 3999,
      originalPrice: 4999,
      stock: 100,
      images: [{ src: '/kits 17.jpg - Edited.png' }, { src: '/kits 18.jpg - Edited.png' }],
    },
    {
      id: 'ring-light',
      name: 'Ring Light',
      description: 'Professional LED ring light.',
      price: 1499,
      stock: 50,
      image: '/kits 25.jpg - Edited.png',
      features: ['3 Color Modes', '10 Brightness Levels'],
      useCase: 'Perfect for well-lit vlogs.',
      benefit: 'Instantly elevates video quality.',
      icon: '💡',
    },
    {
      id: 'mic',
      name: 'Wireless Microphone',
      description: 'Crisp, clear audio capture.',
      price: 999,
      stock: 50,
      image: '/kits 27.jpg - Edited.png',
      features: ['Noise Reduction', 'Plug-and-Play'],
      useCase: 'Ideal for interviews.',
      benefit: 'Ensures clear audio.',
      icon: '🎙️',
    },
  ];

  await Product.deleteMany({});
  await Product.insertMany(kitComponents);
  console.log('Seeded Products');

  return { success: true, message: 'Seeded database successfully!' };
};
