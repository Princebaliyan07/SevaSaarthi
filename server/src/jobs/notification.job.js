import cron from 'node-cron';
import Incident from '../models/Incident.model.js';
import { broadcastEmergencyAlert } from '../services/notification.service.js';

export function startNotificationJob() {
  // Check pending SOS SLAs every 1 minute
  return cron.schedule('* * * * *', async () => {
    try {
      const activeSos = await Incident.find({
        status: { $in: ['active', 'assigned'] },
        sourceType: 'citizen_report',
        slaMinutesRemaining: { $gt: 0 },
      });

      for (const inc of activeSos) {
        inc.slaMinutesRemaining = Math.max(0, inc.slaMinutesRemaining - 1);
        await inc.save();

        if (inc.slaMinutesRemaining === 0) {
          console.warn(`[SLA ESCALATION] Incident ${inc.incidentId} exceeded SLA deadline. Escalating to Senior District Magistrate.`);
          broadcastEmergencyAlert('incidents:sla_breach', {
            incidentId: inc.incidentId,
            title: inc.title,
            location: inc.locationName,
          });
        }
      }
    } catch (err) {
      // ignore
    }
  });
}

export default { startNotificationJob };
