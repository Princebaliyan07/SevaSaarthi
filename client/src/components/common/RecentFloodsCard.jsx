import { REAL_FLOOD_EVENTS } from '../../services/disasterTelemetryService';

export default function RecentFloodsCard({ selectedIncident, onSelectIncident }) {
  const floods = REAL_FLOOD_EVENTS;

  return (
    <div className="rounded-2xl border border-cyan-600/30 bg-gradient-to-b from-cyan-900/90 via-cyan-950/90 to-slate-900/95 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌊</span>
          <span className="text-sm font-black text-cyan-100 tracking-wide">Recent Floods</span>
        </div>
        <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full border border-cyan-500/30">
          CWC · NDMA Live
        </span>
      </div>

      {/* Flood Cards Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-cyan-700">
        {floods.map((fld) => {
          const isSelected = selectedIncident?.incidentId === fld.id;
          const bgClass =
            fld.severity === 'critical'
              ? 'bg-rose-500/90 hover:bg-rose-500 border-rose-400/50 text-white'
              : fld.severity === 'high'
              ? 'bg-orange-500/90 hover:bg-orange-500 border-orange-400/50 text-white'
              : 'bg-cyan-500/90 hover:bg-cyan-500 border-cyan-400/50 text-slate-950';

          return (
            <div
              key={fld.id}
              onClick={() =>
                onSelectIncident?.({
                  incidentId: fld.id,
                  disasterType: 'flood',
                  title: fld.title,
                  description: `${fld.metricBadge} — ${fld.action}`,
                  latitude: fld.lat,
                  longitude: fld.lng,
                  locationName: fld.place,
                  state: fld.place,
                  severity: fld.severity,
                  source: fld.source,
                  actionRequired: fld.action,
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
                    🌊 {fld.metricBadge}
                  </span>
                  <span className="text-[9px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full shrink-0">
                    CWC
                  </span>
                </div>

                {/* Title */}
                <p className="text-xs font-black leading-tight line-clamp-1">{fld.title}</p>

                {/* Location */}
                <p className="text-[11px] font-semibold flex items-center gap-1 line-clamp-1">
                  <span>📍</span>
                  <span>{fld.place}</span>
                </p>

                {/* Date / Time */}
                <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[10px] font-bold">
                  <span>📅 {fld.dateFormatted}</span>
                  <span>🕒 {fld.timeFormatted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
