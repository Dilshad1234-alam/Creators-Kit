import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Do not throw a hard error during build/pre-rendering if URI is missing
if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: MONGODB_URI environment variable is missing.');
}

// MONGODB_URI check moved to dbConnect to avoid build-time errors

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('MONGODB_URI is not defined. Skipping DB connection.');
      return null;
    } else {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
