import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const URI = 'mongodb+srv://SevaSaarthi:Soram01@cluster0.r9y7r3n.mongodb.net/sevasaarthi?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  await mongoose.connect(URI);
  const db = mongoose.connection.db;

  const alertRes = await db.collection('melaalerts').deleteMany({
    alertId: { $in: ['MA-ALERT-01', 'MA-ALERT-02'] },
  });
  console.log('Deleted legacy demo alerts from DB:', alertRes.deletedCount);

  const mapRes = await db.collection('melamaps').deleteMany({
    mapId: 'prayagraj_kumbh',
  });
  console.log('Deleted prayagraj_kumbh map from DB:', mapRes.deletedCount);

  const remainingAlerts = await db.collection('melaalerts').find({}).toArray();
  console.log('Remaining alerts in DB:', remainingAlerts.map((a) => `${a.alertId}: ${a.title}`));

  const remainingMaps = await db.collection('melamaps').find({}).toArray();
  console.log('Remaining maps in DB:', remainingMaps.map((m) => `${m.mapId}: ${m.name}`));

  await mongoose.disconnect();
}

run().catch(console.error);
