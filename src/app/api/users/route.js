import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const role = searchParams.get('role');

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 }).lean();

    // Fetch order aggregation for all users
    const orders = await Order.find({}).lean();

    const usersWithStats = users.map((u) => {
      const userOrders = orders.filter(
        (o) =>
          (o.customerEmail && o.customerEmail.toLowerCase() === u.email.toLowerCase()) ||
          (o.customerName && o.customerName.toLowerCase() === u.name.toLowerCase())
      );
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const orderCount = userOrders.length;
      const status = totalSpent > 20000 ? 'VIP' : orderCount > 0 ? 'Active' : 'Registered';

      return {
        _id: u._id.toString(),
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role || 'user',
        phone: u.phone || '',
        location: u.location || '',
        isVerified: u.isVerified,
        createdAt: u.createdAt,
        orders: orderCount,
        spent: totalSpent,
        formattedSpent: `₹${totalSpent.toLocaleString('en-IN')}`,
        status,
      };
    });

    let filtered = usersWithStats;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          u.phone.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const existing = await User.findOne({ email: body.email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 400 });
    }

    const user = await User.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      password: body.password || 'Creator@123',
      role: body.role || 'user',
      phone: body.phone || '',
      location: body.location || '',
      isVerified: body.isVerified !== undefined ? body.isVerified : true,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ success: true, data: userObj }, { status: 201 });
  } catch (error) {
    console.error('POST /api/users error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
