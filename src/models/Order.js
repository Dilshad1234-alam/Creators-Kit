import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: String, required: true 
  },
  name: { 
    type: String, required: true 
  },
  price: { 
    type: Number, required: true 
  },
  quantity: { 
    type: Number, required: true, min: 1 
  },
});

const OrderSchema = new mongoose.Schema({
  orderId: { 
    type: String 
  }, // To store Razorpay or Mock Order ID
  customerName: { 
    type: String, required: true 
  },
  customerEmail: { 
    type: String, required: true 
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  items: [OrderItemSchema],
  totalAmount: { 
    type: Number, required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'COD'],
    default: 'Pending',
  },
  paymentMode: {
    type: String,
    enum: ['Online', 'Cash on Delivery'],
    default: 'Online',
  },
  deliveryOtp: {
    type: String,
  }
}, { timestamps: true });

// Clear Mongoose cache for HMR
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model('Order', OrderSchema);
