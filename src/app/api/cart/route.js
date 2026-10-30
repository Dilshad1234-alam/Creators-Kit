import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Cart from '@/models/Cart';

export const dynamic = 'force-dynamic';

async function getAuthenticatedUser() {
  await dbConnect();

  // 1. NextAuth Session (Google Sign-In)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      if (session.user.id) {
        const user = await User.findById(session.user.id).select('_id email name role');
        if (user) return user;
      }
      if (session.user.email) {
        const cleanEmail = session.user.email.toLowerCase().trim();
        const user = await User.findOne({ email: cleanEmail }).select('_id email name role');
        if (user) return user;
      }
    }
  } catch (err) {
    console.error('[API/CART] Error reading NextAuth session:', err);
  }

  // 2. Custom Session Cookies (Credentials Login)
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const rawEmail = cookieStore.get('user_email')?.value;

    if (authToken && rawEmail) {
      const cleanEmail = decodeURIComponent(rawEmail).toLowerCase().trim();
      const user = await User.findOne({ email: cleanEmail }).select('_id email name role');
      if (user) return user;
    }
  } catch (err) {
    console.error('[API/CART] Error reading session cookies:', err);
  }

  return null;
}

// -------------------------------------------------------------
// GET /api/cart
// Returns active user's saved cart from MongoDB
// -------------------------------------------------------------
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        items: [],
        count: 0,
      });
    }

    let userCart = await Cart.findOne({ userId: user._id }).lean();
    const items = userCart?.items || [];
    const count = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    return NextResponse.json({
      success: true,
      authenticated: true,
      userId: user._id.toString(),
      items,
      count,
    });
  } catch (error) {
    console.error('[API/CART GET] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// POST /api/cart
// Sync, add, or update cart items for the authenticated user
// -------------------------------------------------------------
export async function POST(req) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Authentication required. Please sign in to save your cart.',
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    let currentCart = await Cart.findOne({ userId: user._id });
    let items = currentCart?.items ? [...currentCart.items.map((i) => i.toObject ? i.toObject() : i)] : [];

    if (body.action === 'clear') {
      items = [];
    } else if (Array.isArray(body.items)) {
      // Direct replace/sync
      items = body.items.map((item) => ({
        id: String(item.id),
        name: String(item.name || ''),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        img: item.img || item.image || '',
        image: item.image || item.img || '',
        images: Array.isArray(item.images) ? item.images : [],
        category: item.category || '',
        originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
        rating: item.rating ? Number(item.rating) : undefined,
        reviews: item.reviews ? Number(item.reviews) : undefined,
      }));
    } else if (body.action === 'add' || body.item) {
      const newItem = body.item;
      if (!newItem || !newItem.id) {
        return NextResponse.json(
          { success: false, error: 'Invalid product item format' },
          { status: 400 }
        );
      }

      const existingIndex = items.findIndex((i) => String(i.id) === String(newItem.id));
      const qtyToAdd = Math.max(1, Number(newItem.quantity) || 1);

      if (existingIndex > -1) {
        items[existingIndex].quantity = (Number(items[existingIndex].quantity) || 1) + qtyToAdd;
        if (newItem.name) items[existingIndex].name = newItem.name;
        if (newItem.price !== undefined) items[existingIndex].price = Number(newItem.price) || 0;
        if (newItem.img || newItem.image) items[existingIndex].img = newItem.img || newItem.image;
      } else {
        items.push({
          id: String(newItem.id),
          name: String(newItem.name || ''),
          price: Number(newItem.price) || 0,
          quantity: qtyToAdd,
          img: newItem.img || newItem.image || '',
          image: newItem.image || newItem.img || '',
          images: Array.isArray(newItem.images) ? newItem.images : [],
          category: newItem.category || '',
          originalPrice: newItem.originalPrice ? Number(newItem.originalPrice) : undefined,
          rating: newItem.rating ? Number(newItem.rating) : undefined,
          reviews: newItem.reviews ? Number(newItem.reviews) : undefined,
        });
      }
    } else if (body.action === 'update') {
      const { id, quantity } = body;
      const targetQty = Number(quantity);
      if (targetQty <= 0) {
        items = items.filter((i) => String(i.id) !== String(id));
      } else {
        items = items.map((i) =>
          String(i.id) === String(id) ? { ...i, quantity: targetQty } : i
        );
      }
    } else if (body.action === 'remove') {
      const { id } = body;
      items = items.filter((i) => String(i.id) !== String(id));
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        userEmail: user.email,
        items,
      },
      { upsert: true, new: true, runValidators: true }
    );

    const finalItems = updatedCart?.items || [];
    const count = finalItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    return NextResponse.json({
      success: true,
      authenticated: true,
      userId: user._id.toString(),
      items: finalItems,
      count,
    });
  } catch (error) {
    console.error('[API/CART POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// DELETE /api/cart
// Clear cart or remove a specific item
// -------------------------------------------------------------
export async function DELETE(req) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Authentication required.',
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('id');

    let updatedCart;
    if (itemId) {
      updatedCart = await Cart.findOneAndUpdate(
        { userId: user._id },
        { $pull: { items: { id: String(itemId) } } },
        { new: true }
      );
    } else {
      updatedCart = await Cart.findOneAndUpdate(
        { userId: user._id },
        { items: [] },
        { new: true }
      );
    }

    const finalItems = updatedCart?.items || [];
    const count = finalItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

    return NextResponse.json({
      success: true,
      authenticated: true,
      items: finalItems,
      count,
    });
  } catch (error) {
    console.error('[API/CART DELETE] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}

