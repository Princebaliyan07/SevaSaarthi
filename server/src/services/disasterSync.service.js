import { syncAllRealIncidents } from './incident.service.js';
import { fetchSachetAlerts } from './sachet.service.js';
import { fetchImdTelemetry } from './imd.service.js';

let lastSyncStats = {
  timestamp: null,
  nasaCount: 0,
  sachetCount: 0,
  imdCount: 0,
  totalActive: 0,
  status: 'idle',
};

/**
 * Orchestrate end-to-end disaster data synchronization
 */
export async function runDisasterSync(io = null) {
  lastSyncStats.status = 'syncing';
  console.log('[DisasterSync] Starting multi-agency telemetry synchronization...');

  try {
    // 1. Fetch real NASA EONET + SACHET live incidents
    const incidentResult = await syncAllRealIncidents();

    // 2. Refresh SACHET CAP feeds specifically
    const sachetAlerts = await fetchSachetAlerts();

    // 3. Refresh IMD alerts
    const imdAlerts = await fetchImdTelemetry();

    lastSyncStats = {
      timestamp: new Date(),
      nasaCount: incidentResult.eonetCount || 0,
      sachetCount: sachetAlerts.length,
      imdCount: imdAlerts.length,
      totalActive: incidentResult.totalCount || 0,
      status: 'success',
    };

    console.log(
      `[DisasterSync] Synchronization complete. Active disasters: ${lastSyncStats.totalActive} (EONET: ${lastSyncStats.nasaCount}, SACHET/IMD: ${lastSyncStats.sachetCount + lastSyncStats.imdCount})`
    );

    if (io) {
      io.emit('disasters:synced', {
        timestamp: lastSyncStats.timestamp,
        totalActive: lastSyncStats.totalActive,
        stats: lastSyncStats,
      });
    }

    return lastSyncStats;
  } catch (error) {
    lastSyncStats.status = 'error';
    lastSyncStats.lastError = error.message;
    console.error('[DisasterSync Error]', error.message);
    throw error;
  }
}

export function getDisasterSyncStatus() {
  return lastSyncStats;
}

export default { runDisasterSync, getDisasterSyncStatus };
