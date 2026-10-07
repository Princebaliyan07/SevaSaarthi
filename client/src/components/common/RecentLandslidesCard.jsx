import { REAL_LANDSLIDE_EVENTS } from '../../services/disasterTelemetryService';

export default function RecentLandslidesCard({ selectedIncident, onSelectIncident }) {
  const landslides = REAL_LANDSLIDE_EVENTS;

  return (
    <div className="rounded-2xl border border-amber-600/30 bg-gradient-to-b from-amber-900/90 via-amber-950/90 to-slate-900/95 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⛰️</span>
          <span className="text-sm font-black text-amber-100 tracking-wide">Recent Landslides</span>
        </div>
        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
          GSI · BRO Live
        </span>
      </div>

      {/* Landslide Cards Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-amber-700">
        {landslides.map((ls) => {
          const isSelected = selectedIncident?.incidentId === ls.id;
          const bgClass =
            ls.severity === 'critical'
              ? 'bg-rose-500/90 hover:bg-rose-500 border-rose-400/50 text-white'
              : ls.severity === 'high'
              ? 'bg-orange-500/90 hover:bg-orange-500 border-orange-400/50 text-white'
              : 'bg-amber-500/90 hover:bg-amber-500 border-amber-400/50 text-slate-950';

          return (
            <div
              key={ls.id}
              onClick={() =>
                onSelectIncident?.({
                  incidentId: ls.id,
                  disasterType: 'landslide',
                  title: ls.title,
                  description: `${ls.metricBadge} — ${ls.action}`,
                  latitude: ls.lat,
                  longitude: ls.lng,
                  locationName: ls.place,
                  state: ls.place,
                  severity: ls.severity,
                  source: ls.source,
                  actionRequired: ls.action,
                  reportedAt: new Date(),
                })
              }
              className={`min-w-[200px] sm:min-w-[220px] cursor-pointer rounded-2xl border p-3.5 transition-all shadow-md ${bgClass} ${
                isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : 'hover:scale-[1.02]'
              }`}
            >
              <div className="space-y-1.5">
                {/* Top badge row */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black tracking-tight uppercase leading-tight">
                    ⛰️ {ls.metricBadge}
                  </span>
                  <span className="text-[9px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full shrink-0">
                    GSI
                  </span>
                </div>

                {/* Title */}
                <p className="text-xs font-black leading-tight line-clamp-1">{ls.title}</p>

                {/* Location */}
                <p className="text-[11px] font-semibold flex items-center gap-1 line-clamp-1">
                  <span>📍</span>
                  <span>{ls.place}</span>
                </p>

                {/* Date / Time */}
                <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[10px] font-bold">
                  <span>📅 {ls.dateFormatted}</span>
                  <span>🕒 {ls.timeFormatted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
