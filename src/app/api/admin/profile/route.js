import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get('email')?.toLowerCase()?.trim();

    // Also check NextAuth session if available
    let sessionEmail = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        sessionEmail = session.user.email.toLowerCase().trim();
      }
    } catch (e) {
      // Session parsing may fail if request lacks NextAuth cookies
    }

    const targetEmail = emailParam || sessionEmail;
    let admin = null;

    if (targetEmail) {
      admin = await User.findOne({ email: targetEmail, role: 'admin' })
        .select('_id name email role profileImage phone location')
        .lean();
    }

    // Fallback: If no email was specified or matched, fetch the primary admin user
    if (!admin) {
      admin = await User.findOne({ role: 'admin' })
        .sort({ createdAt: 1 })
        .select('_id name email role profileImage phone location')
        .lean();
    }

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'No admin user found in database' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage || '',
        phone: admin.phone || '',
        location: admin.location || '',
      },
    });
  } catch (error) {
    console.error('GET /api/admin/profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin profile', details: error.message },
      { status: 500 }
    );
  }
}
