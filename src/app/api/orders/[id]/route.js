import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    // We now use `id` consistently across this dynamic route folder
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    let order;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } 
    
    // If not found by _id, try finding by the custom orderId field (e.g. Razorpay ID)
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const orderToUpdate = await Order.findById(id);
    if (!orderToUpdate) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (body.status === 'Delivered' && orderToUpdate.status !== 'Delivered') {
      if (!body.otp || body.otp !== orderToUpdate.deliveryOtp) {
        return NextResponse.json({ success: false, error: 'Invalid OTP' }, { status: 400 });
      }
    }

    const order = await Order.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
