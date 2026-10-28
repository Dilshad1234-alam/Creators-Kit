import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (!email && !userId) {
      return NextResponse.json({
        success: true,
        hasBundleAccess: false,
        reason: 'Authentication required'
      });
    }

    await connectDB();

    const normalizedEmail = (email || '').trim().toLowerCase();

    // 1. Check User record in database
    let user = null;
    if (normalizedEmail) {
      user = await User.findOne({
        email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') }
      }).select('-password -otpCode -otpExpire');
    } else if (userId) {
      user = await User.findById(userId).select('-password -otpCode -otpExpire');
    }

    // Admins always have access
    if (user && user.role === 'admin') {
      return NextResponse.json({
        success: true,
        hasBundleAccess: true,
        isAdmin: true,
        unlockedMasterclasses: ['instagram-mastery', 'youtube-mastery', 'filmora-mastery']
      });
    }

    // Direct user purchase flag
    if (user && (user.hasPurchased === true || (Array.isArray(user.unlockedMasterclasses) && user.unlockedMasterclasses.length > 0))) {
      return NextResponse.json({
        success: true,
        hasBundleAccess: true,
        unlockedMasterclasses: user.unlockedMasterclasses?.length > 0
          ? user.unlockedMasterclasses
          : ['instagram-mastery', 'youtube-mastery', 'filmora-mastery']
      });
    }

    // 2. Query MongoDB Order collection for completed or confirmed purchases
    const orderQuery = {
      $and: [
        { status: { $nin: ['Cancelled', 'Failed'] } },
        {
          $or: [
            { customerEmail: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } },
            { email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } },
            { 'customer.email': { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } }
          ]
        }
      ]
    };

    const qualifyingOrders = await Order.find(orderQuery).lean();

    const hasQualifyingOrder = qualifyingOrders.some((order) => {
      // Check if order has bundledCourses
      if (Array.isArray(order.bundledCourses) && order.bundledCourses.length > 0) {
        return true;
      }
      // Check if items include a bundle or kit
      if (Array.isArray(order.items) && order.items.length > 0) {
        return order.items.some((item) => {
          const name = (item.name || '').toLowerCase();
          const pId = (item.productId || '').toLowerCase();
          return (
            name.includes('bundle') ||
            name.includes('kit') ||
            pId.includes('bundle') ||
            pId.includes('kit')
          );
        });
      }
      return false;
    });

    if (hasQualifyingOrder) {
      // Automatically sync user document
      if (user && !user.hasPurchased) {
        await User.updateOne(
          { _id: user._id },
          {
            $set: { hasPurchased: true },
            $addToSet: {
              unlockedMasterclasses: {
                $each: ['instagram-mastery', 'youtube-mastery', 'filmora-mastery']
              }
            }
          }
        ).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        hasBundleAccess: true,
        unlockedMasterclasses: ['instagram-mastery', 'youtube-mastery', 'filmora-mastery']
      });
    }

    return NextResponse.json({
      success: true,
      hasBundleAccess: false,
      reason: 'No bundle purchase found'
    });
  } catch (error) {
    console.error('Error verifying user bundle course access:', error);
    return NextResponse.json(
      { success: false, error: 'Database verification failed', hasBundleAccess: false },
      { status: 500 }
    );
  }
}
