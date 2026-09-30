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

async function fix() {
  try {
    await mongoose.connect('mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit');
    console.log('Connected to DB');
    
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders`);
    
    for (let order of orders) {
      let changed = false;
      for (let item of order.items) {
        if (!item.image || item.image.trim() === '') {
          console.log(`Fixing item: ${item.name}`);
          const product = await Product.findOne({ name: item.name });
          if (product) {
            item.image = product.img || (product.images && product.images.length > 0 ? (product.images[0].src || product.images[0]) : null) || product.image;
            console.log(`Set image to ${item.image}`);
            changed = true;
          }
        }
      }
      if (changed) {
        await order.save();
        console.log(`Saved order ${order._id}`);
      }
    }
    
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
