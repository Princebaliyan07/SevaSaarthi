import dns from 'dns';
import mongoose from 'mongoose';

// Ensure reliable SRV resolution on Windows/ISP environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sevasaarthi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[MongoDB Notice] Operating with in-memory storage fallback for real API telemetry cache.`);
    return null;
  }
}

export default connectDB;
