import mongoose from 'mongoose';
import dns from 'dns';

// Fix querySrv EREFUSED on Windows/ISPs when resolving MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: MONGODB_URI environment variable is missing.');
}

/**
 * Global cache across hot-reloads and serverless invocations.
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

  // 1. Instant check: If mongoose has an active connection (readyState === 1), return it immediately
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    if (!cached.conn) cached.conn = mongoose;
    return mongoose;
  }

  // 2. If cached connection is active, return immediately
  if (cached.conn && cached.conn.connection?.readyState === 1) {
    return cached.conn;
  }

  // 3. If disconnected or errored, reset cache
  if (mongoose.connection && (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3)) {
    cached.conn = null;
    cached.promise = null;
  }

  // 4. If connection is already being established, await the existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        return m;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        console.error('MongoDB connection error:', error.message);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
