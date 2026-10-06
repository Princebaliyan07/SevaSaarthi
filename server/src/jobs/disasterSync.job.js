import cron from 'node-cron';
import { runDisasterSync } from '../services/disasterSync.service.js';

export function startDisasterSyncJob(io) {
  const intervalMinutes = process.env.SYNC_INTERVAL_MINUTES || 5;

  console.log(`[Job Scheduler] Disaster telemetry sync job scheduled every ${intervalMinutes} minutes.`);

  return cron.schedule(`*/${intervalMinutes} * * * *`, async () => {
    console.log(`[Job Runner] Running scheduled disaster telemetry synchronization...`);
    try {
      await runDisasterSync(io);
    } catch (err) {
      console.error('[Job Error] Periodic disaster sync failed:', err.message);
    }
  });
}

export default { startDisasterSyncJob };
