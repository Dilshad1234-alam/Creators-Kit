import mongoose from 'mongoose';

async function testConnection() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://dmd68699_db_user:dilshad9523@cluster0.yxpgsw3.mongodb.net/creators-kit';
    console.log('Connecting to', uri);
    await mongoose.connect(uri, { tlsAllowInvalidCertificates: true, serverSelectionTimeoutMS: 5000 });
    console.log('Connected successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConnection();
