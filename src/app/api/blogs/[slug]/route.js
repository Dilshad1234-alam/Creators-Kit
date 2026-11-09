import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

const getProductImageForStory = (productName = '') => {
  const pLower = (productName || '').toLowerCase();
  if (pLower.includes('mic')) return '/wireless-mic.jpg';
  if (pLower.includes('tripod') || pLower.includes('stand')) return '/tripod.jpg';
  if (pLower.includes('ring') || pLower.includes('light')) return '/ring.jpg';
  if (pLower.includes('bundle') || pLower.includes('kit')) return '/banner 6.png';
  if (pLower.includes('gimbal') || pLower.includes('chorma') || pLower.includes('rig') || pLower.includes('green')) return '/chorma.jpg';
  return '/ring.jpg';
};

function getFilter(identifier) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return { $or: [{ _id: identifier }, { slug: identifier }] };
  }
  return { slug: identifier };
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();

    const blog = await Blog.findOne(getFilter(slug));
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();
    const body = await req.json();

    if (body.rating !== undefined) {
      body.rating = Number(body.rating) || 5;
    }

    if (!body.title && body.author) {
      body.title = body.product ? `${body.author} - ${body.product}` : `${body.author}'s Review`;
    }

    if (body.productImage === undefined || body.productImage === '') {
      if (body.product) {
        body.productImage = getProductImageForStory(body.product);
      }
    }

    const blog = await Blog.findOneAndUpdate(getFilter(slug), { $set: body }, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();

    const blog = await Blog.findOneAndDelete(getFilter(slug));
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
