import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import {
  LiveSaleHeroBanner,
  LiveSaleFlashDeal,
  LiveSaleCreatorDeal,
  LiveSaleCategoryGrid,
  LiveSaleFAQ,
} from '@/models/LiveSaleSection';

export const dynamic = 'force-dynamic';

function getModelForSection(section) {
  const norm = (section || '').toLowerCase().trim();
  if (norm === 'banners' || norm === 'hero' || norm === 'herobanner' || norm === 'livesaleherobanner') {
    return LiveSaleHeroBanner;
  }
  if (norm === 'deals' || norm === 'flash' || norm === 'flashdeal' || norm === 'livesaleflashdeal') {
    return LiveSaleFlashDeal;
  }
  if (
    norm === 'creator-deals' ||
    norm === 'creatordeals' ||
    norm === 'creator' ||
    norm === 'creatordeal' ||
    norm === 'livesalecreatordeal'
  ) {
    return LiveSaleCreatorDeal;
  }
  if (norm === 'categories' || norm === 'category' || norm === 'categorygrid' || norm === 'livesalecategorygrid') {
    return LiveSaleCategoryGrid;
  }
  if (norm === 'faqs' || norm === 'faq' || norm === 'livesalefaq') {
    return LiveSaleFAQ;
  }
  return null;
}

// GET all sections or a specific section
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section') || 'all';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const filter = activeOnly ? { $or: [{ active: true }, { status: 'LIVE' }] } : {};

    if (section === 'all') {
      const [rawBanners, rawDeals, rawCreatorDeals, categories, faqs] = await Promise.all([
        LiveSaleHeroBanner.find(filter).sort({ displayOrder: 1, order: 1, createdAt: -1 }).lean(),
        LiveSaleFlashDeal.find(filter).sort({ order: 1, createdAt: -1 }).lean(),
        LiveSaleCreatorDeal.find(filter).sort({ displayOrder: 1, order: 1, createdAt: -1 }).lean(),
        LiveSaleCategoryGrid.find(filter).sort({ order: 1, createdAt: -1 }).lean(),
        LiveSaleFAQ.find(filter).sort({ order: 1, createdAt: -1 }).lean(),
      ]);

      const banners = rawBanners.map((b) => {
        const img = b.bannerImage || b.bannerImageUrl || b.image || '';
        const dispOrder = b.displayOrder !== undefined ? b.displayOrder : (b.order || 1);
        return {
          ...b,
          bannerImage: img,
          bannerImageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: b.status || (b.active !== false ? 'LIVE' : 'Draft'),
          active: b.status === 'LIVE' || (b.active !== false && b.status !== 'Draft' && b.status !== 'DRAFT'),
        };
      });

      const deals = rawDeals.map((d) => {
        const img = d.imageUrl || d.image || '/wireless-mic1.png';
        const title = d.title || d.name || 'Flash Deal';
        const dispOrder = d.displayOrder !== undefined ? d.displayOrder : (d.order || 1);
        return {
          ...d,
          title,
          name: title,
          imageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: d.status || (d.active !== false ? 'LIVE' : 'Draft'),
          active: d.status === 'LIVE' || (d.active !== false && d.status !== 'Draft' && d.status !== 'DRAFT'),
        };
      });

      const creatorDeals = rawCreatorDeals.map((cd) => {
        const img = cd.imageUrl || cd.image || '/tripod1.png';
        const title = cd.title || cd.name || 'Creator Deal';
        const dispOrder = cd.displayOrder !== undefined ? cd.displayOrder : (cd.order || 1);
        return {
          ...cd,
          title,
          name: title,
          imageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: cd.status || (cd.active !== false ? 'LIVE' : 'Draft'),
          active: cd.status === 'LIVE' || (cd.active !== false && cd.status !== 'Draft' && cd.status !== 'DRAFT'),
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          banners,
          deals,
          creatorDeals,
          categories,
          faqs,
        },
      });
    }

    const Model = getModelForSection(section);
    if (!Model) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}. Expected 'banners', 'deals', 'creator-deals', 'categories', or 'faqs'.` },
        { status: 400 }
      );
    }

    if (section === 'banners' || section === 'hero') {
      const items = await Model.find(filter).sort({ displayOrder: 1, order: 1, createdAt: -1 }).lean();
      const banners = items.map((b) => {
        const img = b.bannerImage || b.bannerImageUrl || b.image || '';
        const dispOrder = b.displayOrder !== undefined ? b.displayOrder : (b.order || 1);
        return {
          ...b,
          bannerImage: img,
          bannerImageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: b.status || (b.active !== false ? 'LIVE' : 'Draft'),
          active: b.status === 'LIVE' || (b.active !== false && b.status !== 'Draft' && b.status !== 'DRAFT'),
        };
      });
      return NextResponse.json({
        success: true,
        count: banners.length,
        data: banners,
      });
    }

    if (
      section === 'creator-deals' ||
      section === 'creatordeals' ||
      section === 'creator' ||
      Model === LiveSaleCreatorDeal
    ) {
      const items = await Model.find(filter).sort({ displayOrder: 1, order: 1, createdAt: -1 }).lean();
      const creatorDeals = items.map((cd) => {
        const img = cd.imageUrl || cd.image || '/tripod1.png';
        const title = cd.title || cd.name || 'Creator Deal';
        const dispOrder = cd.displayOrder !== undefined ? cd.displayOrder : (cd.order || 1);
        return {
          ...cd,
          title,
          name: title,
          imageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: cd.status || (cd.active !== false ? 'LIVE' : 'Draft'),
          active: cd.status === 'LIVE' || (cd.active !== false && cd.status !== 'Draft' && cd.status !== 'DRAFT'),
        };
      });
      return NextResponse.json({
        success: true,
        count: creatorDeals.length,
        data: creatorDeals,
      });
    }

    if (section === 'deals' || section === 'flash' || Model === LiveSaleFlashDeal) {
      const items = await Model.find(filter).sort({ order: 1, displayOrder: 1, createdAt: -1 }).lean();
      const deals = items.map((d) => {
        const img = d.imageUrl || d.image || '/wireless-mic1.png';
        const title = d.title || d.name || 'Flash Deal';
        const dispOrder = d.displayOrder !== undefined ? d.displayOrder : (d.order || 1);
        return {
          ...d,
          title,
          name: title,
          imageUrl: img,
          image: img,
          displayOrder: dispOrder,
          order: dispOrder,
          status: d.status || (d.active !== false ? 'LIVE' : 'Draft'),
          active: d.status === 'LIVE' || (d.active !== false && d.status !== 'Draft' && d.status !== 'DRAFT'),
        };
      });
      return NextResponse.json({
        success: true,
        count: deals.length,
        data: deals,
      });
    }

    const items = await Model.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/live-sale/sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve live sale section items', details: error.message },
      { status: 500 }
    );
  }
}

// POST create an item in a section
export async function POST(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const section = searchParams.get('section') || body.section;

    const Model = getModelForSection(section);
    if (!Model) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}.` },
        { status: 400 }
      );
    }

    const itemData = { ...body };
    delete itemData.section;

    if (section === 'banners' || section === 'hero') {
      const img = (itemData.bannerImage || itemData.bannerImageUrl || itemData.image || '').trim();
      itemData.bannerImage = img;
      itemData.bannerImageUrl = img;
      itemData.image = img;
      const orderVal = Number(itemData.displayOrder !== undefined ? itemData.displayOrder : itemData.order);
      itemData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
      itemData.order = itemData.displayOrder;
      itemData.status = (itemData.status === 'Draft' || itemData.status === 'DRAFT') ? 'Draft' : 'LIVE';
      itemData.active = itemData.status === 'LIVE';
    }

    if (
      section === 'creator-deals' ||
      section === 'creatordeals' ||
      section === 'creator' ||
      Model === LiveSaleCreatorDeal
    ) {
      const img = (itemData.imageUrl || itemData.image || '').trim();
      itemData.imageUrl = img;
      itemData.image = img;
      const title = (itemData.title || itemData.name || '').trim();
      itemData.title = title;
      itemData.name = title;
      itemData.price = Number(itemData.price) || 0;
      itemData.mrp = Number(itemData.mrp) || itemData.price;
      itemData.savings = Math.max(0, itemData.mrp - itemData.price);
      itemData.discountPercent =
        itemData.mrp > itemData.price
          ? Math.round(((itemData.mrp - itemData.price) / itemData.mrp) * 100)
          : 0;
      if (!itemData.discountText || itemData.discountText.trim() === '') {
        itemData.discountText = itemData.discountPercent > 0 ? `${itemData.discountPercent}% OFF` : '';
      }
      itemData.stockLeft = Number(itemData.stockLeft !== undefined ? itemData.stockLeft : 7);
      itemData.stockTotal = Number(itemData.stockTotal !== undefined ? itemData.stockTotal : 20);
      const orderVal = Number(itemData.displayOrder !== undefined ? itemData.displayOrder : itemData.order);
      itemData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
      itemData.order = itemData.displayOrder;
      itemData.category = (itemData.category || 'CREATOR GEAR').trim();
      itemData.badge = (itemData.badge || itemData.tag || 'BESTSELLER').trim();
      itemData.status = (itemData.status === 'Draft' || itemData.status === 'DRAFT') ? 'Draft' : 'LIVE';
      itemData.active = itemData.status === 'LIVE';
    }

    if (section === 'deals' || section === 'flash' || Model === LiveSaleFlashDeal) {
      const img = (itemData.imageUrl || itemData.image || '').trim();
      itemData.imageUrl = img;
      itemData.image = img;
      const title = (itemData.name || itemData.title || '').trim();
      itemData.title = title;
      itemData.name = title;
      itemData.price = Number(itemData.price) || 0;
      itemData.mrp = Number(itemData.mrp) || itemData.price;
      itemData.savings = Math.max(0, itemData.mrp - itemData.price);
      itemData.discountPercent =
        itemData.mrp > itemData.price
          ? Math.round(((itemData.mrp - itemData.price) / itemData.mrp) * 100)
          : 0;
      if (!itemData.discountText || itemData.discountText.trim() === '') {
        itemData.discountText = itemData.discountPercent > 0 ? `${itemData.discountPercent}% OFF` : '';
      }
      itemData.stockLeft = Number(itemData.stockLeft !== undefined ? itemData.stockLeft : 10);
      itemData.stockTotal = Number(itemData.stockTotal !== undefined ? itemData.stockTotal : 50);
      const orderVal = Number(itemData.displayOrder !== undefined ? itemData.displayOrder : itemData.order);
      itemData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
      itemData.order = itemData.displayOrder;
    }

    // Ensure order is assigned if missing
    if (itemData.order === undefined || itemData.order === null) {
      const count = await Model.countDocuments();
      itemData.order = count + 1;
      itemData.displayOrder = count + 1;
    }

    // Synchronize status and active flags
    if (itemData.status === 'LIVE') itemData.active = true;
    if (itemData.status === 'Draft' || itemData.status === 'DRAFT') itemData.active = false;
    if (itemData.active !== undefined && !itemData.status) {
      itemData.status = itemData.active ? 'LIVE' : 'Draft';
    }

    const newItem = await Model.create(itemData);
    return NextResponse.json({
      success: true,
      message: `${section} item created successfully`,
      data: newItem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/live-sale/sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create item', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update an item in a section
export async function PUT(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    const section = searchParams.get('section') || body.section;
    const itemId = body._id || body.id || searchParams.get('id');

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required for update' },
        { status: 400 }
      );
    }

    const Model = getModelForSection(section);
    if (!Model) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}.` },
        { status: 400 }
      );
    }

    const updateData = { ...body };
    delete updateData._id;
    delete updateData.id;
    delete updateData.section;

    if (section === 'banners' || section === 'hero') {
      const img = (updateData.bannerImage || updateData.bannerImageUrl || updateData.image || '').trim();
      if (img) {
        updateData.bannerImage = img;
        updateData.bannerImageUrl = img;
        updateData.image = img;
      }
      if (updateData.displayOrder !== undefined || updateData.order !== undefined) {
        const orderVal = Number(updateData.displayOrder !== undefined ? updateData.displayOrder : updateData.order);
        updateData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
        updateData.order = updateData.displayOrder;
      }
      if (updateData.status !== undefined) {
        updateData.status = (updateData.status === 'Draft' || updateData.status === 'DRAFT') ? 'Draft' : 'LIVE';
        updateData.active = updateData.status === 'LIVE';
      }
    }

    if (
      section === 'creator-deals' ||
      section === 'creatordeals' ||
      section === 'creator' ||
      Model === LiveSaleCreatorDeal
    ) {
      if (updateData.imageUrl || updateData.image) {
        const img = (updateData.imageUrl || updateData.image || '').trim();
        updateData.imageUrl = img;
        updateData.image = img;
      }
      if (updateData.title || updateData.name) {
        const title = (updateData.title || updateData.name || '').trim();
        updateData.title = title;
        updateData.name = title;
      }
      if (updateData.displayOrder !== undefined || updateData.order !== undefined) {
        const orderVal = Number(updateData.displayOrder !== undefined ? updateData.displayOrder : updateData.order);
        updateData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
        updateData.order = updateData.displayOrder;
      }
      if (updateData.mrp !== undefined || updateData.price !== undefined) {
        const current = await LiveSaleCreatorDeal.findById(itemId);
        const mrp = Number(updateData.mrp ?? current?.mrp ?? 0);
        const price = Number(updateData.price ?? current?.price ?? 0);
        if (mrp && price) {
          updateData.savings = Math.max(0, mrp - price);
          updateData.discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
          if (!updateData.discountText) {
            updateData.discountText = updateData.discountPercent > 0 ? `${updateData.discountPercent}% OFF` : '';
          }
        }
      }
      if (updateData.status !== undefined) {
        updateData.status = (updateData.status === 'Draft' || updateData.status === 'DRAFT') ? 'Draft' : 'LIVE';
        updateData.active = updateData.status === 'LIVE';
      }
    }

    if (section === 'deals' || section === 'flash' || Model === LiveSaleFlashDeal) {
      if (updateData.imageUrl || updateData.image) {
        const img = (updateData.imageUrl || updateData.image || '').trim();
        updateData.imageUrl = img;
        updateData.image = img;
      }
      if (updateData.name || updateData.title) {
        const title = (updateData.name || updateData.title || '').trim();
        updateData.title = title;
        updateData.name = title;
      }
      if (updateData.displayOrder !== undefined || updateData.order !== undefined) {
        const orderVal = Number(updateData.displayOrder !== undefined ? updateData.displayOrder : updateData.order);
        updateData.displayOrder = isNaN(orderVal) ? 1 : orderVal;
        updateData.order = updateData.displayOrder;
      }
      if (updateData.mrp !== undefined || updateData.price !== undefined) {
        const current = await LiveSaleFlashDeal.findById(itemId);
        const mrp = Number(updateData.mrp ?? current?.mrp ?? 0);
        const price = Number(updateData.price ?? current?.price ?? 0);
        if (mrp && price) {
          updateData.savings = Math.max(0, mrp - price);
          updateData.discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
          if (!updateData.discountText) {
            updateData.discountText = updateData.discountPercent > 0 ? `${updateData.discountPercent}% OFF` : '';
          }
        }
      }
      if (updateData.status !== undefined) {
        updateData.status = (updateData.status === 'Draft' || updateData.status === 'DRAFT') ? 'Draft' : 'LIVE';
        updateData.active = updateData.status === 'LIVE';
      }
    }

    // If status toggled, keep active in sync
    if (updateData.status) {
      updateData.active = updateData.status === 'LIVE';
    } else if (updateData.active !== undefined) {
      updateData.status = updateData.active ? 'LIVE' : 'Draft';
    }

    // Auto-recalculate savings and discount percent for flash deals
    if (Model === LiveSaleFlashDeal && (updateData.mrp || updateData.price)) {
      const current = await LiveSaleFlashDeal.findById(itemId);
      const mrp = Number(updateData.mrp ?? current?.mrp ?? 0);
      const price = Number(updateData.price ?? current?.price ?? 0);
      if (mrp && price) {
        updateData.savings = Math.max(0, mrp - price);
        updateData.discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
      }
    }

    const updated = await Model.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Item not found in MongoDB' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${section} item updated successfully`,
      data: updated,
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/live-sale/sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update item', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE an item from a section
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    let itemId = searchParams.get('id');

    if (!itemId) {
      try {
        const body = await req.json();
        itemId = body.id || body._id;
      } catch (_) {}
    }

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required for deletion' },
        { status: 400 }
      );
    }

    const Model = getModelForSection(section);
    if (!Model) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}.` },
        { status: 400 }
      );
    }

    const deleted = await Model.findByIdAndDelete(itemId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${section} item deleted successfully`,
      data: deleted,
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/live-sale/sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete item', details: error.message },
      { status: 500 }
    );
  }
}

