import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Policy from '@/models/Policy';
import Coupon from '@/models/Coupon';

export async function POST() {
  try {
    await dbConnect();

    // 1. Seed Content
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
      const defaultContent = [
        { key: 'hero-title', value: 'Elevate Your Content Creation' },
        { key: 'hero-subtitle', value: 'The ultimate kit for modern creators. High quality audio, video, and lighting in one bundle.' },
        { key: 'kit-highlight-1', value: 'Professional 4K Video Quality' },
        { key: 'kit-highlight-2', value: 'Studio Grade Audio Capture' },
        { key: 'promo-text', value: 'Get 20% off your first order!' }
      ];
      await Content.insertMany(defaultContent);
    }

    // 2. Seed Policies
    const policyCount = await Policy.countDocuments();
    if (policyCount === 0) {
      const defaultPolicies = [
        { key: 'terms-of-service', title: 'Terms of Service', content: 'These are the default terms of service. Please update them.' },
        { key: 'privacy-policy', title: 'Privacy Policy', content: 'This is the default privacy policy. Please update it.' },
        { key: 'refund-policy', title: 'Refund Policy', content: 'We offer a 30-day money-back guarantee.' }
      ];
      await Policy.insertMany(defaultPolicies);
    }

    // 3. Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const defaultCoupon = {
        code: 'CREATOR20',
        discountType: 'percentage',
        discountAmount: 20,
        isActive: true,
      };
      await Coupon.create(defaultCoupon);
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
