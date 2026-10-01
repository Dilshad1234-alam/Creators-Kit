import { NextResponse} from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/mailer';

export async function GET() {
 try {
 await dbConnect();
 const orders = await Order.find({}).sort({ createdAt: -1});
 return NextResponse.json({ success: true, data: orders});
} catch (error) {
 return NextResponse.json({ success: false, error: error.message}, { status: 400});
}
}

export async function POST(req) {
 try {
 await dbConnect();
 const body = await req.json();

 // Map legacy/inconsistent fields to our strict schema
 if (body.customer) {
 if (!body.customerName) body.customerName = body.customer.name;
 if (!body.customerEmail) body.customerEmail = body.customer.email;
 if (!body.shippingAddress && body.customer.address) {
 body.shippingAddress = body.customer.address;
}
}
 if (body.email && !body.customerEmail) {
 body.customerEmail = body.email;
}
 if (body.address && !body.shippingAddress) {
 body.shippingAddress = typeof body.address === 'string' 
 ? { street: body.address, city: '', state: '', zipCode: '', country: ''}
 : body.address;
}
 if (body.amount && !body.totalAmount) {
 body.totalAmount = body.amount;
}
 if (!body.status) {
 body.status = 'Confirmed';
}

 // Assign COD defaults and generate Delivery OTP if not already provided
 if (!body.paymentMode) body.paymentMode = 'Cash on Delivery';
 if (!body.paymentStatus) body.paymentStatus = 'COD';
 if (!body.deliveryOtp) {
 body.deliveryOtp = Math.floor(100000 + Math.random() * 900000).toString();
}

 const order = await Order.create(body);

  // Send Order Confirmation Email
  if (order.customerEmail) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const itemsListHtml = order.items?.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br/>
          <small style="color: #666;">Qty: ${item.quantity}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          <strong>₹${item.price?.toLocaleString('en-IN')}</strong>
        </td>
      </tr>
    `).join('') || '';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #fdfbf7; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #900606; font-weight: 900; font-size: 28px; margin: 0; letter-spacing: -0.5px;">Creators kit<span style="color: #900606;">.</span></h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 16px; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.02);">
          <h2 style="color: #900606; margin-top: 0; text-align: center;">Order Successful! 🎉</h2>
          <p style="text-align: center; font-size: 16px; color: #555;">Hi ${order.customerName || 'Creator'}, thank you for your order.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${order._id}</p>
            <p style="margin: 0 0 10px 0;"><strong>Payment Mode:</strong> ${order.paymentMode}</p>
            <p style="margin: 0 0 10px 0;"><strong>Estimated Delivery:</strong> ${formattedDeliveryDate}</p>
            <div style="background-color: #eff6ff; padding: 12px; border-radius: 8px; margin-top: 15px; border: 1px solid #bfdbfe;">
              <p style="margin: 0 0 5px 0; color: #1e3a8a; font-weight: bold;">Delivery PIN: <span style="font-size: 18px; letter-spacing: 2px;">${order.deliveryOtp}</span></p>
              <small style="color: #3b82f6;">(Please share this PIN with the delivery executive)</small>
            </div>
          </div>

          <h3 style="margin-bottom: 15px; border-bottom: 2px solid #900606; padding-bottom: 8px; color: #900606;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            ${itemsListHtml}
            <tr>
              <td style="padding: 15px 10px; text-align: right; border-top: 2px solid #f5f5f5;"><strong>Total:</strong></td>
              <td style="padding: 15px 10px; text-align: right; color: #900606; font-size: 20px; font-weight: 900; border-top: 2px solid #f5f5f5;">₹${order.totalAmount?.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px; line-height: 1.5;">
            We're preparing your order and will notify you when it ships.<br/>
            If you have any questions, feel free to reply to this email.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: order.customerEmail,
        subject: `Order Confirmed - Creators kit (${order._id})`,
        html: emailHtml
      });
      console.log('Order confirmation email sent successfully to', order.customerEmail);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }
  }

 return NextResponse.json({ success: true, data: order}, { status: 201});
} catch (error) {
 if (error.name === 'ValidationError') {
 return NextResponse.json({ success: false, error: error.message}, { status: 400});
}
 return NextResponse.json({ success: false, error: error.message}, { status: 500});
}
}
