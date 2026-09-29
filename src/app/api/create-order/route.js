import Razorpay from 'razorpay';
import { NextResponse} from 'next/server';

export async function POST(req) {
 try {
 const { items, customer, discountAmount = 0} = await req.json();


 // Calculate total amount in paise (1 INR = 100 paise)
 const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
 const amount = Math.max(0, cartTotal - discountAmount) * 100;



 if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
 console.error('Razorpay keys are missing');
 return NextResponse.json({ error: 'Razorpay keys are not configured'}, { status: 500});
}

 // Initialize razorpay instance
 const razorpay = new Razorpay({
 key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
 key_secret: process.env.RAZORPAY_KEY_SECRET,
});

 const options = {
 amount: amount.toString(),
 currency: 'INR',
 receipt:`receipt_${Date.now()}`,
 payment_capture: 1,
};

 const order = await razorpay.orders.create(options);

 return NextResponse.json(order);
} catch (error) {
 console.error('Error creating Razorpay order:', error);
 return NextResponse.json({ error: 'Failed to create order'}, { status: 500});
}
}
