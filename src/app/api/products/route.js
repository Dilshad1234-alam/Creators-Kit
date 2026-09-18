import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    let products = await Product.find({}).sort({ createdAt: -1 });
    
    // Auto-seed if database is completely empty
    if (products.length === 0) {
      const seedData = [
        { id: "ring-light", name: "Professional LED Ring Light", description: "Professional LED ring light with adjustable color temperatures.", price: 3999, originalPrice: 5999, stock: 100, image: "/kits 25 (1).jpg" },
        { id: "mic", name: "Wireless Microphone", description: "Crisp, clear audio capture without the hassle of cables.", price: 2499, originalPrice: 3999, stock: 100, image: "/kits 27 (1).jpg" },
        { id: "tripod", name: "Flexible Desk Tripod", description: "Versatile mounting solution for your smartphone or DSLR.", price: 999, originalPrice: 1499, stock: 100, image: "/kits 24 (1).jpg" },
        { id: "green-screen", name: "Chroma Key Green Screen", description: "High-quality green screen backdrop for seamless background replacement.", price: 1299, originalPrice: 1999, stock: 100, image: "/kits 26 (1).jpg" },
        { id: "pen-drive", name: "Mastercourse Pendrive", description: "Physical USB pendrive packed with all our exclusive Mastery Courses.", price: 2999, originalPrice: 4999, stock: 100, image: "/kits 28 (1).jpg" }
      ];
      await Product.insertMany(seedData);
      products = await Product.find({}).sort({ createdAt: -1 });
    }
    
    return NextResponse.json({ success: true, data: products || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Auto-generate id from name if not provided (required by schema)
    if (!body.id && body.name) {
      body.id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
