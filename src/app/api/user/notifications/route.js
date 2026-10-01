import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    let notifications = await Notification.find({ email }).sort({ createdAt: -1 });
    
    if (notifications.length === 0) {
      // If no notifications exist, generate dynamic notifications based on recent orders
      const Order = (await import('@/models/Order')).default;
      const recentOrders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 }).limit(3);
      
      const newNotifs = [];
      
      if (recentOrders.length > 0) {
        recentOrders.forEach(order => {
          let title = 'Order Placed';
          let desc = `Your order ${order._id.toString().slice(-6)} has been placed successfully.`;
          
          if (order.status === 'Delivered') {
            title = 'Order Delivered';
            desc = `Your order ${order._id.toString().slice(-6)} has been delivered. Enjoy your gear!`;
          } else if (order.status === 'Shipped' || order.status === 'Out for Delivery') {
            title = 'Order Shipped';
            desc = `Great news! Your order ${order._id.toString().slice(-6)} is on its way.`;
          }
          
          newNotifs.push({
            email,
            title,
            desc,
            unread: true,
            type: 'order',
            createdAt: order.updatedAt || order.createdAt
          });
        });
      } else {
        // Fallback welcome message if no orders exist yet
        newNotifs.push({
          email,
          title: 'Welcome to Creators Kit!',
          desc: 'Thanks for creating an account. Start exploring our premium gear.',
          unread: true,
          type: 'system',
          createdAt: new Date(Date.now() - 3600000)
        });
      }
      
      await Notification.insertMany(newNotifs);
      notifications = await Notification.find({ email }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
