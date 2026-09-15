import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { items, customer } = await req.json();

    // Verify razorpay keys are present
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
    }

    // Calculate total amount in paise (1 INR = 100 paise)
    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) * 100;

    // If using placeholder keys, return a mock order instead of crashing
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      return NextResponse.json({
        id: `order_mock_${Date.now()}`,
        amount: amount.toString(),
        currency: 'INR',
      });
    }

    // Initialize razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount.toString(),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
