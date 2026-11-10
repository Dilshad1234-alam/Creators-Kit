import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      gokwikOrderId,
      paymentId,
      paymentMode = 'Online',
      paymentStatus = 'Paid',
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
    } = body;

    // 1. Validate required inputs
    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid customer email address is required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order items are required and cart cannot be empty.' },
        { status: 400 }
      );
    }

    const cleanEmail = customerEmail.toLowerCase().trim();
    const cleanName = (customerName || cleanEmail.split('@')[0] || 'Valued Creator').trim();

    // 2. Generate secure 6-digit delivery OTP for doorstep handover
    const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Prepare bundled bonus masterclasses (Worth Rs 4,999)
    const bundledCourses = [
      {
        id: 'instagram-mastery',
        title: 'Instagram Growth & Algorithm Masterclass',
        status: 'Granted',
        unlockedAt: new Date(),
      },
      {
        id: 'youtube-mastery',
        title: 'YouTube Viral Video Production Masterclass',
        status: 'Granted',
        unlockedAt: new Date(),
      },
      {
        id: 'filmora-mastery',
        title: 'Filmora Video Editing Masterclass',
        status: 'Granted',
        unlockedAt: new Date(),
      },
    ];

    // 4. Construct unique order identifier
    const formattedOrderId =
      gokwikOrderId ||
      `GK_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 5. Create Order document in MongoDB
    const newOrder = await Order.create({
      orderId: formattedOrderId,
      customerName: cleanName,
      customerEmail: cleanEmail,
      shippingAddress: {
        street:
          shippingAddress?.street ||
          shippingAddress?.address1 ||
          'Verified via GoKwik Checkout',
        city: shippingAddress?.city || 'India',
        state: shippingAddress?.state || '',
        zipCode: shippingAddress?.zipCode || shippingAddress?.pincode || '',
        country: shippingAddress?.country || 'India',
      },
      items: items.map((item) => ({
        productId: String(item.productId || 'creators-kit-v1'),
        name: item.name || 'Studio Creator Gear',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: item.image || item.image_url || '/placeholder.png',
      })),
      totalAmount: Number(totalAmount) || 0,
      status: 'Confirmed',
      paymentStatus: paymentStatus === 'COD' ? 'COD' : (paymentStatus || 'Paid'),
      paymentMode: paymentMode === 'Cash on Delivery' ? 'Cash on Delivery' : 'Online',
      deliveryOtp,
      bundledCourses,
    });

    console.log(`[GOKWIK CHECKOUT] Order ${formattedOrderId} created successfully for ${cleanEmail}`);
    const orderDoc = newOrder;

    // 6. Unlock masterclasses and update customer purchase status in MongoDB Compass User collection
    try {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        user.hasPurchased = true;
        const classesToUnlock = ['instagram-mastery', 'youtube-mastery', 'filmora-mastery'];
        classesToUnlock.forEach((classId) => {
          if (!user.unlockedMasterclasses.includes(classId)) {
            user.unlockedMasterclasses.push(classId);
          }
        });
        if (customerPhone && !user.phone) {
          user.phone = customerPhone;
        }
        await user.save();
        console.log(`[GOKWIK CHECKOUT] Unlocked 3 masterclasses for user ${cleanEmail}`);
      }
    } catch (userUpdateErr) {
      console.warn('[GOKWIK CHECKOUT] Failed to update user masterclasses in DB:', userUpdateErr);
    }

    // 7. Send Order Confirmation Email via Nodemailer
    try {
      const itemsListHtml = newOrder.items
        .map(
          (item) => `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 8px; font-weight: 600; color: #1e293b;">${item.name}</td>
            <td style="padding: 12px 8px; text-align: center; color: #64748b;">x${item.quantity}</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: 700; color: #900606;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
          </tr>
        `
        )
        .join('');

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background-color: #900606; padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">Creators Kit</h1>
            <p style="color: #fca5a5; font-size: 13px; margin: 6px 0 0 0; font-weight: 600;">Order Confirmation & Delivery Details</p>
          </div>

          <div style="padding: 28px 24px;">
            <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>${cleanName}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
              Thank you for shopping with Creators Kit! Your express order has been placed and confirmed via GoKwik.
            </p>

            <!-- Order ID & OTP Card -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Order Number:</td>
                  <td style="font-size: 14px; font-weight: 700; color: #0f172a; text-align: right; padding-bottom: 6px;">${formattedOrderId}</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b; padding-bottom: 6px;">Payment Method:</td>
                  <td style="font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; padding-bottom: 6px;">GoKwik Express (${orderDoc.paymentMode})</td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #64748b;">Delivery OTP (Keep Secret):</td>
                  <td style="font-size: 18px; font-weight: 900; color: #900606; text-align: right; letter-spacing: 2px;">${deliveryOtp}</td>
                </tr>
              </table>
            </div>

            <!-- Items Summary -->
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">Items in Your Order</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <thead>
                <tr style="background: #f1f5f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: #64748b;">
                  <th style="padding: 10px 8px; text-align: left;">Item</th>
                  <th style="padding: 10px 8px; text-align: center;">Qty</th>
                  <th style="padding: 10px 8px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsListHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 14px 8px; font-weight: 800; font-size: 15px; color: #0f172a;">Total Paid</td>
                  <td style="padding: 14px 8px; font-weight: 900; font-size: 16px; color: #900606; text-align: right;">Rs. ${Number(totalAmount).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Unlocked Masterclasses Banner -->
            <div style="background: linear-gradient(135deg, #111827 0%, #1e293b 100%); border-radius: 12px; padding: 20px; color: #ffffff; margin-bottom: 24px;">
              <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #f59e0b; font-weight: 800;">3 Free Lifetime Masterclasses Unlocked!</h4>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                You have instant lifetime access to Instagram Growth Mastery, YouTube Video Mastery, and Filmora Editing Mastery.
              </p>
              <a href="http://localhost:3000/account?tab=courses" style="display: inline-block; background: #900606; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700;">Start Learning Now</a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 24px 0 0 0;">
              Questions? Reply directly to this email or visit our <a href="http://localhost:3000/contact" style="color: #900606; text-decoration: none; font-weight: 600;">Support Desk</a>.
            </p>
          </div>
        </div>
      `;

      await sendEmail({
        to: cleanEmail,
        subject: `Order Confirmed: ${formattedOrderId} - Creators Kit`,
        html: emailHtml,
      });
      console.log(`[GOKWIK CHECKOUT] Confirmation email sent to ${cleanEmail}`);
    } catch (emailErr) {
      console.warn('[GOKWIK CHECKOUT] Non-blocking email sending failure:', emailErr);
    }

    // 8. Return successful response
    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully via GoKwik Express Checkout.',
        orderId: orderDoc._id,
        orderNumber: orderDoc.orderId,
        deliveryOtp: orderDoc.deliveryOtp,
        status: orderDoc.status,
        totalAmount: orderDoc.totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[GOKWIK CHECKOUT API ERROR]:', error);
    return NextResponse.json(
      { error: 'Failed to record GoKwik order', details: error.message },
      { status: 500 }
    );
  }
}

