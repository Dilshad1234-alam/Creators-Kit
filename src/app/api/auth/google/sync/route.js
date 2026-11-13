import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUser from '@/models/PendingUser';

// POST: Direct Google synchronization endpoint (accepts { email, name, image, googleId })
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name, image, googleId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required for synchronization' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    await dbConnect();

    // Streamlined atomic upsert using lean query
    const updateOps = {
      $setOnInsert: {
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'user',
        authProvider: 'google',
      },
      $set: {
        isVerified: true,
        ...(googleId ? { googleId } : {}),
        ...(image ? { profileImage: image } : {}),
      },
    };

    const syncedUser = await User.findOneAndUpdate(
      { email: cleanEmail },
      updateOps,
      {
        upsert: true,
        new: true,
        lean: true,
        projection: { _id: 1, name: 1, email: 1, role: 1, profileImage: 1, isVerified: 1, createdAt: 1, updatedAt: 1 },
      }
    );

    // Clean up any pending unverified registration in background
    PendingUser.deleteOne({ email: cleanEmail }).catch(() => {});

    const isNew =
      syncedUser?.createdAt &&
      syncedUser?.updatedAt &&
      syncedUser.createdAt.getTime() === syncedUser.updatedAt.getTime();

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: syncedUser._id,
          name: syncedUser.name,
          email: syncedUser.email,
          role: syncedUser.role || 'user',
          profileImage: syncedUser.profileImage || '',
          isVerified: syncedUser.isVerified,
        },
        isNew,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_ERROR] Google user sync error:', error);
    return NextResponse.json(
      { error: 'Failed to synchronize Google user', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetches current session from NextAuth and returns user synchronized from MongoDB
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    // If session already has id and role from optimized token, return immediately
    if (session.user.id && session.user.role) {
      return NextResponse.json(
        {
          authenticated: true,
          user: {
            _id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
            profileImage: session.user.image || '',
            isVerified: session.user.isVerified ?? true,
          },
        },
        { status: 200 }
      );
    }

    // Fallback lean query if token was missing role
    await dbConnect();
    const cleanEmail = session.user.email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail })
      .select('_id name email role profileImage isVerified')
      .lean();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || 'user',
          profileImage: user.profileImage || '',
          isVerified: user.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AUTH_ERROR] Google session sync error:', error);
    return NextResponse.json({ error: 'Session fetch failed', details: error.message }, { status: 500 });
  }
}
