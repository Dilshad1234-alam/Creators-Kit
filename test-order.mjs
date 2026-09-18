import mongoose from 'mongoose';
import { default as Order } from './src/models/Order.js';
import dbConnect from './src/lib/mongodb.js';

const test = async () => {
  await dbConnect();
  try {
    const orderData = {
      customerName: `John Doe`,
      customerEmail: 'test@example.com',
      shippingAddress: {
        street: '123 Test',
        city: 'Test City',
        state: '',
        zipCode: '12345',
        country: 'IN'
      },
      items: [{
        productId: 'bundle-01',
        name: 'Zinmatt',
        price: 3999,
        quantity: 1
      }],
      totalAmount: 3999,
      status: 'Processing'
    };
    await Order.create(orderData);
    console.log('Order created successfully');
  } catch (err) {
    console.log('Validation Error:', err.message);
  } finally {
    process.exit();
  }
};
test();
