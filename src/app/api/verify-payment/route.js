import { NextResponse} from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
 try {
 const body = await req.json();
 const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData} = body;

 if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
 return NextResponse.json({ error: 'Missing payment details'}, { status: 400});
}

 const secret = process.env.RAZORPAY_KEY_SECRET;
 if (!secret) {
 return NextResponse.json({ error: 'Razorpay secret not configured'}, { status: 500});
}

 // Verify Signature
 const generated_signature = crypto
 .createHmac('sha256', secret)
 .update(razorpay_order_id + '|' + razorpay_payment_id)
 .digest('hex');

 if (generated_signature !== razorpay_signature) {
 return NextResponse.json({ error: 'Invalid payment signature'}, { status: 400});
}

 // Connect to database
 await connectDB();

 // Generate 6-digit delivery OTP
 const deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();

 // Automatically grant the 3 Free Masterclasses to the verified order
 const freeMasterclassesBundle = [
   { id: 'instagram-mastery', title: 'Instagram Mastery', status: 'Granted', unlockedAt: new Date() },
   { id: 'youtube-mastery', title: 'YouTube Mastery', status: 'Granted', unlockedAt: new Date() },
   { id: 'filmora-mastery', title: 'Filmora Mastery', status: 'Granted', unlockedAt: new Date() },
 ];

 // Securely save the order with 'Processing' status now that payment is verified
 const newOrder = await Order.create({
 ...orderData,
 bundledCourses: orderData.bundledCourses || freeMasterclassesBundle,
 orderId: razorpay_payment_id, // Store the payment ID for reference
 status: 'Confirmed',
 paymentStatus: 'Paid',
 paymentMode: 'Online',
 deliveryOtp: deliveryOtp,
});

 // Automatically grant lifetime masterclass access to the registered user account
 const customerEmail = (orderData.customerEmail || orderData.email || '').trim();
 if (customerEmail) {
   try {
     await User.findOneAndUpdate(
       { email: customerEmail.toLowerCase() },
       {
         $set: { hasPurchased: true },
         $addToSet: {
           unlockedMasterclasses: {
             $each: ['instagram-mastery', 'youtube-mastery', 'filmora-mastery']
           }
         }
       }
     );
   } catch (e) {
     console.warn('Could not update user masterclass access:', e);
   }
 }

  // Calculate estimated delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Format items list
  const itemsListHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br/>
        <small style="color: #666;">Qty: ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        <strong>₹${item.price?.toLocaleString('en-IN')}</strong>
      </td>
    </tr>
  `).join('');

  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #fdfbf7; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #900606; font-weight: 900; font-size: 28px; margin: 0; letter-spacing: -0.5px;">Creators kit<span style="color: #900606;">.</span></h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
        <h2 style="color: #900606; margin-top: 0; text-align: center;">Order Successful! 🎉</h2>
        <p style="text-align: center; font-size: 16px; color: #555;">Hi ${orderData.customerName}, thank you for your order.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${razorpay_payment_id}</p>
          <p style="margin: 0 0 10px 0;"><strong>Estimated Delivery:</strong> ${formattedDeliveryDate}</p>
          <div style="background-color: #eff6ff; padding: 12px; border-radius: 8px; margin-top: 15px; border: 1px solid #bfdbfe;">
            <p style="margin: 0 0 5px 0; color: #1e3a8a; font-weight: bold;">Delivery PIN: <span style="font-size: 18px; letter-spacing: 2px;">${deliveryOtp}</span></p>
            <small style="color: #3b82f6;">(Please share this PIN with the delivery executive)</small>
          </div>
        <!-- FREE MASTERCLASSES BONUS INCLUDED -->
        <div style="background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%); border: 1.5px solid #900606; border-radius: 12px; padding: 18px; margin: 25px 0; text-align: left;">
          <h4 style="margin: 0 0 8px 0; color: #900606; font-size: 16px; font-weight: 800;">🎁 Free Creator Masterclasses Unlocked!</h4>
          <p style="margin: 0 0 10px 0; font-size: 13px; color: #555;">Your kit purchase includes full lifetime access to all 3 courses directly in your account:</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #333; line-height: 1.6;">
            <li><strong>Instagram Mastery</strong> — Algorithm & viral growth</li>
            <li><strong>YouTube Mastery</strong> — SEO, thumbnails & monetization</li>
            <li><strong>Filmora Mastery</strong> — Cinematic video editing</li>
          </ul>
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #777;">Access them anytime by logging in and navigating to the <strong>Courses</strong> tab.</p>
        </div>

        <h3 style="margin-bottom: 15px; border-bottom: 2px solid #900606; padding-bottom: 8px; color: #900606;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          ${itemsListHtml}
          <tr>
            <td style="padding: 15px 10px; text-align: right; border-top: 2px solid #f5f5f5;"><strong>Total Paid:</strong></td>
            <td style="padding: 15px 10px; text-align: right; color: #900606; font-size: 20px; font-weight: 900; border-top: 2px solid #f5f5f5;">₹${orderData.totalAmount?.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px; line-height: 1.5;">
          We're preparing your order and will notify you when it ships.<br/>
          If you have any questions, feel free to reply to this email.
        </p>
      </div>
    </div>
  `;

  // Send email asynchronously to avoid blocking the response
  sendEmail({
    to: orderData.customerEmail,
    subject: `Order Confirmed - Creators kit (${razorpay_payment_id})`,
    html: emailHtml
  }).catch(emailError => {
    console.error('Failed to send order confirmation email asynchronously:', emailError);
  });

  return NextResponse.json({ success: true, order: newOrder});
} catch (error) {
 console.error('Error verifying payment:', error);
 return NextResponse.json({ error: 'Failed to verify payment and save order'}, { status: 500});
}
}
