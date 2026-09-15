import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, customer } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!customer || !customer.email || !customer.firstName || !customer.lastName) {
      return NextResponse.json(
        { error: 'Missing required customer details' },
        { status: 400 }
      );
    }

    // Server-side total calculation to prevent client manipulation
    const calculateTotal = (cartItems) => {
      // In a real app, you would look up the price in the DB using the item ID
      // rather than trusting the client price. For this mock, we assume $199.99 for creators-kit-v1
      return cartItems.reduce((total, item) => {
        const itemPrice = item.id === 'creators-kit-v1' ? 199.99 : 0;
        return total + itemPrice * item.quantity;
      }, 0);
    };

    const finalTotal = calculateTotal(items);

    // Mock payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here is where you would typically create a Stripe PaymentIntent 
    // or initialize a Razorpay order, save to your database, etc.
    
    /* Example Stripe Integration:
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // in cents
      currency: 'usd',
      metadata: { customer_email: customer.email },
    });
    */

    return NextResponse.json(
      { 
        message: 'Payment processed successfully (MOCKED)', 
        orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        totalCharged: finalTotal 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process checkout', details: error.message },
      { status: 500 }
    );
  }
}
