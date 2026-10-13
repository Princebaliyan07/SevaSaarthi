import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URI = process.env.MONGODB_URI;

async function run() {
  if (!URI) {
    console.error('MONGODB_URI environment variable is required to run this script.');
    process.exit(1);
  }

  await mongoose.connect(URI);
  const db = mongoose.connection.db;

  const alertRes = await db.collection('melaalerts').deleteMany({
    alertId: { $in: ['MA-ALERT-01', 'MA-ALERT-02'] },
  });
  console.log('Deleted legacy demo alerts from DB:', alertRes.deletedCount);

  const remainingAlerts = await db.collection('melaalerts').find({}).toArray();
  console.log('Remaining alerts in DB:', remainingAlerts.map((a) => `${a.alertId}: ${a.title}`));

  const remainingMaps = await db.collection('melamaps').find({}).toArray();
  console.log('Remaining maps in DB:', remainingMaps.map((m) => `${m.mapId}: ${m.name}`));

  await mongoose.disconnect();
}

run().catch(console.error);
