import cron from 'node-cron';
import Incident from '../models/Incident.model.js';

export function startCleanupJob() {
  // Runs once a day at 02:00 AM
  return cron.schedule('0 2 * * *', async () => {
    console.log('[Cleanup Job] Running daily incident housekeeping...');
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const result = await Incident.updateMany(
        {
          status: 'resolved',
          updatedAt: { $lt: thirtyDaysAgo },
        },
        {
          $set: { status: 'closed' },
        }
      );
      console.log(`[Cleanup Job] Closed ${result.modifiedCount} archived incidents.`);
    } catch (err) {
      console.error('[Cleanup Job Error]', err.message);
    }
  });
}

export default { startCleanupJob };
