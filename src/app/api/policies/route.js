import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Policy from '@/models/Policy';

export const dynamic = 'force-dynamic';

const initialPolicies = [
  {
    key: 'terms',
    title: 'Terms & Conditions',
    content: `1. Acceptance of Terms: By accessing the Creators Kit website and purchasing our creator gear or bundles, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and customers.

2. User Accounts & Security: You agree to provide accurate and complete information when registering an account. You are solely responsible for protecting your account credentials and password.

3. Products, Pricing & Payments: All prices are displayed in INR and/or USD. We reserve the right to change prices at any time. Secure checkout is provided for all online and Cash on Delivery payments.

4. Returns & Intellectual Property: All content, images, videos, and masterclass materials provided by Creators Kit remain our exclusive intellectual property and may not be reproduced without explicit written permission.`,
  },
  {
    key: 'privacy',
    title: 'Privacy Policy',
    content: `1. Information We Collect: Name, email address, phone number, and shipping address when you place an order or create an account. Passwords and security credentials used for authentication.

2. How We Use Your Information: The information we collect is strictly used to process transactions, deliver Creator Kits securely, provide customer support, and send order status updates.

3. Data Security & Storage: We employ 256-bit SSL encryption, restricted database access, and secure authentication to protect your private data at all times.`,
  },
  {
    key: 'return',
    title: 'Return & Refund Policy',
    content: `1. The 7-Day Return Window: We offer a hassle-free, 7-day replacement policy on physical merchandise. You have exactly 7 days from the delivery date to initiate a replacement request for damaged or defective items.

2. Conditions for Returning Gear: The physical gear must be in original condition, with original packaging, accessories, manuals, and proof of purchase.

3. Process & Support: Doorstep pickup is scheduled by our logistics partners. Once inspected, an immediate replacement or full refund is issued to your original payment method.`,
  },
  {
    key: 'shipping',
    title: 'Shipping Policy',
    content: `1. Order Processing & Dispatch: All creator gear orders are inspected and dispatched within 24 to 48 business hours of payment confirmation.

2. Pan-India Delivery Timelines: Metro deliveries take 2 to 4 working days; Tier 2 & 3 cities take 4 to 6 working days; remote areas take 6 to 9 working days via our verified courier partners (Bluedart, Delhivery, DTDC, Xpressbees).

3. Shipping Charges & Free Delivery: Free insured standard delivery is provided on eligible prepaid orders. Minimal nominal shipping applies to promotional or COD orders.

4. Live Tracking: You will receive real-time SMS, email, and WhatsApp tracking updates with your courier AWB number immediately upon dispatch.`,
  },
];

export async function GET() {
  try {
    await dbConnect();
    let policies = await Policy.find({});

    if (policies.length === 0) {
      await Policy.insertMany(initialPolicies);
      policies = await Policy.find({});
    }

    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const policy = await Policy.findOneAndUpdate(
      { key: body.key },
      body,
      { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
