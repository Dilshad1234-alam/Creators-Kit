const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  image: String
});

const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema]
}, { strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const ProductSchema = new mongoose.Schema({
  name: String,
  images: Array,
  image: String,
  img: String
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function fixPaths() {
  try {
    await mongoose.connect('mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit');
    console.log('Connected to DB');
    
    // Fix Products
    const products = await Product.find({});
    for (let product of products) {
      let changed = false;
      if (product.img === '/kits 24 (1).jpg') {
        product.img = '/kits-24-1.jpg';
        changed = true;
      }
      if (product.image === '/kits 24 (1).jpg') {
        product.image = '/kits-24-1.jpg';
        changed = true;
      }
      if (product.images && Array.isArray(product.images)) {
        for (let i = 0; i < product.images.length; i++) {
          if (product.images[i].src === '/kits 24 (1).jpg') {
            product.images[i].src = '/kits-24-1.jpg';
            product.markModified('images');
            changed = true;
          }
          if (product.images[i] === '/kits 24 (1).jpg') {
            product.images[i] = '/kits-24-1.jpg';
            product.markModified('images');
            changed = true;
          }
        }
      }
      if (changed) {
        await product.save();
        console.log(`Updated Product: ${product.name}`);
      }
    }

    // Fix Orders
    const orders = await Order.find({});
    for (let order of orders) {
      let changed = false;
      for (let item of order.items) {
        if (item.image === '/kits 24 (1).jpg') {
          item.image = '/kits-24-1.jpg';
          changed = true;
        }
      }
      if (changed) {
        await order.save();
        console.log(`Updated Order: ${order._id}`);
      }
    }
    
    console.log('Done fixing paths');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixPaths();
