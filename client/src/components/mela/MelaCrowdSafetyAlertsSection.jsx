import { useState } from 'react';

export default function MelaCrowdSafetyAlertsSection({
  alerts = [],
  isAdmin = false,
  onOpenCreateAlert = null,
  onResolveAlert = null,
  onViewOnMap = null,
  lang = 'en',
}) {
  const [showHistory, setShowHistory] = useState(false);

  const activeAlerts = alerts.filter((a) => a.status === 'Active');
  const pastAlerts = alerts.filter((a) => a.status !== 'Active');

  const displayedAlerts = showHistory ? alerts : activeAlerts;

  const SEVERITY_BADGES = {
    Informational: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
    Advisory: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
    Warning: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300',
    Critical: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 animate-pulse',
  };

  return (
    <div className="glass-card p-6 space-y-6 border-slate-200/80 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'मेला भीड़ सुरक्षा एवं आधिकारिक चेतावनी' : 'Mela Crowd Safety & Official Alerts'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'hi'
              ? 'प्रशासन एवं पुलिस नियंत्रण कक्ष द्वारा जारी आधिकारिक आपात निर्देश व भीड़ प्रबंधन।'
              : 'Directives and corridor regulations published by Mela Police & Crowd Management.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-xs"
          >
            {showHistory ? 'Show Active Only' : `Alert History (${pastAlerts.length})`}
          </button>

          {isAdmin && onOpenCreateAlert && (
            <button
              type="button"
              onClick={onOpenCreateAlert}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
            >
              <span>📢</span>
              <span>Publish Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Sensor vs Administration Attribution Banner */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            Crowd condition data is <strong className="text-slate-700 dark:text-slate-200">administration-reported and timestamped</strong> by on-ground duty officers.
          </span>
        </div>
        <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
          Sync: 24×7 Active
        </span>
      </div>

      {/* Alerts Feed */}
      {displayedAlerts.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
          ✅ No active emergency crowd alerts. All corridors report normal transit movement.
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedAlerts.map((alert) => {
            const isResolved = alert.status !== 'Active';
            return (
              <div
                key={alert.alertId || alert._id}
                className={`p-4.5 rounded-2xl border transition-all ${
                  isResolved
                    ? 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40 opacity-75'
                    : alert.severity === 'Critical'
                    ? 'border-rose-500/50 bg-rose-50/40 dark:border-rose-500/30 dark:bg-rose-950/20 shadow-sm'
                    : 'border-amber-500/40 bg-white/90 dark:border-amber-500/20 dark:bg-slate-900/90 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          SEVERITY_BADGES[alert.severity] || SEVERITY_BADGES.Advisory
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        • {alert.alertType}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({alert.alertId})
                      </span>
                      {isResolved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          Resolved
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {alert.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      👉 <strong className="text-slate-800 dark:text-slate-200">Recommended Action:</strong> {alert.recommendedAction}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>📍 <strong>Location:</strong> {alert.affectedLocation}</span>
                      <span>🏛️ <strong>Authority:</strong> {alert.issuingAuthority}</span>
                      {alert.expiresAt && (
                        <span>⏳ <strong>Valid until:</strong> {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    {onViewOnMap && alert.latitude && alert.longitude && (
                      <button
                        type="button"
                        onClick={() => onViewOnMap({ lat: alert.latitude, lng: alert.longitude })}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 border border-teal-500/20 transition-all flex items-center gap-1"
                      >
                        <span>🗺️</span>
                        <span>View on Map</span>
                      </button>
                    )}

                    {isAdmin && !isResolved && onResolveAlert && (
                      <button
                        type="button"
                        onClick={() => onResolveAlert(alert.alertId || alert._id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 transition-all"
                      >
                        ✅ Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
