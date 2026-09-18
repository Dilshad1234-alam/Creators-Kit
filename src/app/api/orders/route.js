import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
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
        ? { street: body.address, city: '', state: '', zipCode: '', country: '' }
        : body.address;
    }
    if (body.amount && !body.totalAmount) {
      body.totalAmount = body.amount;
    }
    if (!body.status) {
      body.status = 'Pending';
    }

    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
