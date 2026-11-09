import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import LiveDeal from '@/models/LiveDeal';

export const dynamic = 'force-dynamic';

// GET all deals with optional category / search filtering
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '100', 10)));

    const query = {};

    if (category && category !== 'all' && category !== 'All Deals') {
      query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { subtitle: { $regex: q, $options: 'i' } },
        { badge: { $regex: q, $options: 'i' } },
      ];
    }

    const deals = await LiveDeal.find(query).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    console.error('Error fetching live deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch live deals', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new live deal
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      title,
      category = 'Flash Sales',
      salePrice,
      mrp,
      inventoryCount = 10,
      status = 'Active',
      image = '/pro1.png',
      subtitle = '',
      badge = '',
      dealUrl = '/live-sale',
    } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json({ success: false, error: 'Deal title is required' }, { status: 400 });
    }

    const numSalePrice = Number(salePrice);
    const numMrp = Number(mrp);

    if (isNaN(numSalePrice) || numSalePrice < 0) {
      return NextResponse.json({ success: false, error: 'Valid sale price is required' }, { status: 400 });
    }

    if (isNaN(numMrp) || numMrp < 0) {
      return NextResponse.json({ success: false, error: 'Valid MRP is required' }, { status: 400 });
    }

    const discountPercent =
      body.discountPercent !== undefined && !isNaN(Number(body.discountPercent))
        ? Number(body.discountPercent)
        : numMrp > numSalePrice
        ? Math.round(((numMrp - numSalePrice) / numMrp) * 100)
        : 0;

    const newDeal = await LiveDeal.create({
      title: title.trim(),
      category: category.trim(),
      salePrice: numSalePrice,
      mrp: numMrp,
      discountPercent,
      inventoryCount: Number(inventoryCount) || 0,
      status: ['Active', 'Flash', 'Expired'].includes(status) ? status : 'Active',
      image: image?.trim() || '/pro1.png',
      subtitle: subtitle?.trim() || '',
      badge: badge?.trim() || '',
      dealUrl: dealUrl?.trim() || '/live-sale',
    });

    return NextResponse.json({
      success: true,
      message: 'Live deal created successfully',
      data: newDeal,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating live deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create live deal', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update an existing live deal
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const dealId = body._id || body.id;

    if (!dealId) {
      return NextResponse.json({ success: false, error: 'Deal ID is required for update' }, { status: 400 });
    }

    const updateData = { ...body };
    delete updateData._id;
    delete updateData.id;

    if (updateData.salePrice !== undefined) updateData.salePrice = Number(updateData.salePrice);
    if (updateData.mrp !== undefined) updateData.mrp = Number(updateData.mrp);
    if (updateData.inventoryCount !== undefined) updateData.inventoryCount = Number(updateData.inventoryCount);

    if (updateData.mrp && updateData.salePrice && updateData.mrp > updateData.salePrice) {
      updateData.discountPercent = Math.round(((updateData.mrp - updateData.salePrice) / updateData.mrp) * 100);
    }

    const updatedDeal = await LiveDeal.findByIdAndUpdate(dealId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDeal) {
      return NextResponse.json({ success: false, error: 'Live deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Live deal updated successfully',
      data: updatedDeal,
    });
  } catch (error) {
    console.error('Error updating live deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update live deal', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove a live deal
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    let dealId = searchParams.get('id');

    if (!dealId) {
      try {
        const body = await req.json();
        dealId = body.id || body._id;
      } catch (_) {}
    }

    if (!dealId) {
      return NextResponse.json({ success: false, error: 'Deal ID is required' }, { status: 400 });
    }

    const deleted = await LiveDeal.findByIdAndDelete(dealId);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Live deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Live deal deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Error deleting live deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete live deal', details: error.message },
      { status: 500 }
    );
  }
}
