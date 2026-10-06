import dns from 'dns';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}
import app from './app.js';
import { connectDB } from './config/db.js';
import { runDisasterSync } from './services/disasterSync.service.js';
import { initNotificationService } from './services/notification.service.js';
import { startDisasterSyncJob } from './jobs/disasterSync.job.js';
import { startCleanupJob } from './jobs/cleanup.job.js';
import { startNotificationJob } from './jobs/notification.job.js';

dotenv.config();

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const server = http.createServer(app);

// Real-time WebSockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

initNotificationService(io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

export function broadcastIncidentUpdate(payload) {
  io.emit('incidents:updated', payload);
}

// Start Server with auto port retry
async function startServer(port) {
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`🚨 SevaSaarthi Production Backend Running on http://localhost:${port}`);
      console.log(`📡 Real Disaster Endpoints:`);
      console.log(`   - Live Feed:  http://localhost:${port}/api/v1/incidents/live`);
      console.log(`   - Statistics: http://localhost:${port}/api/v1/incidents/stats`);
      console.log(`   - Manual Sync: POST http://localhost:${port}/api/v1/incidents/sync`);
      console.log(`   - Health:     http://localhost:${port}/api/health`);
      console.log(`🛰️ Feeds: NASA EONET v3 + NDMA SACHET CAP + IMD Weather`);
      console.log(`🏥 Health: /api/v1/hospitals, /api/v1/medicines, /api/v1/doctors`);
      console.log(`🙏 Mela: /api/v1/mela/crowd-status, /api/v1/mela/missing-persons`);
      console.log(`🤖 AI Saarthi: /api/v1/ai/chat, /api/v1/ai/triage`);
      console.log(`======================================================\n`);
      resolve(port);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`[Port ${port} in use, trying port ${port + 1}...]`);
        server.close();
        resolve(startServer(port + 1));
      } else {
        reject(err);
      }
    });
  });
}

// Bootstrap
async function bootstrap() {
  // 1. Connect MongoDB
  await connectDB();

  // 2. Initial synchronization on boot
  try {
    console.log('[Bootstrap] Running initial disaster telemetry synchronization...');
    const syncRes = await runDisasterSync(io);
    console.log(`[Bootstrap] Initial sync complete. Active real disasters: ${syncRes.totalActive}`);
  } catch (err) {
    console.warn(`[Bootstrap Warning] Initial sync delayed: ${err.message}`);
  }

  // 3. Start Periodic Background Jobs
  startDisasterSyncJob(io);
  startCleanupJob();
  startNotificationJob();

  // 4. Start HTTP Server
  await startServer(DEFAULT_PORT);
}

bootstrap();

export { server, io };
