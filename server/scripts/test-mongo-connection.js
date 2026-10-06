import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure reliable DNS servers for Windows SRV lookups (Google & Cloudflare DNS)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log(`[Atlas Test] Testing connection to MongoDB Atlas...`);
console.log(`[Atlas Test] Target URI: ${uri ? uri.replace(/:([^@]+)@/, ':****@') : 'NOT SET'}`);

if (!uri || uri.includes('127.0.0.1')) {
  console.log('[Atlas Test] MONGODB_URI is still pointing to localhost or is empty.');
  process.exit(1);
}

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`\n🎉 [SUCCESS] Connected to MongoDB Atlas!`);
  console.log(`   Host: ${conn.connection.host}`);
  console.log(`   Database: ${conn.connection.name}`);
  console.log(`   ReadyState: ${conn.connection.readyState}\n`);
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error(`\n❌ [CONNECTION FAILED] ${err.message}`);
  if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
    console.error(`👉 Note: Check username & password. Ensure '@' in password is encoded as '%40' (e.g. Soram%4001).`);
  } else if (err.message.includes('querySrv') || err.message.includes('ENOTFOUND')) {
    console.error(`👉 Note: Check your cluster hostname (e.g. cluster0.xxxxx.mongodb.net).`);
  } else if (err.message.includes('whitelist') || err.message.includes('timed out') || err.message.includes('ECONNREFUSED')) {
    console.error(`👉 Note: Check MongoDB Atlas Network Access. Add '0.0.0.0/0' to whitelist all IPs.`);
  }
  process.exit(1);
}
