export default function RecentEarthquakesCard({
  earthquakes = [],
  selectedEarthquake = null,
  onSelectEarthquake,
  loading = false,
}) {
  return (
    <div className="rounded-2xl border border-sky-600/30 bg-gradient-to-b from-sky-900/90 via-sky-950/90 to-slate-900/95 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌋</span>
          <span className="text-sm font-black text-sky-100 tracking-wide">Recent Earthquakes</span>
        </div>
        <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full border border-sky-500/30">
          USGS · Live
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-8 text-center text-xs text-sky-300">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mr-2 align-middle" />
          <span>Fetching live USGS seismic sensors...</span>
        </div>
      ) : earthquakes.length === 0 ? (
        <div className="py-6 text-center text-xs text-sky-300/80">
          No significant seismic tremors detected in this area recently.
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-sky-700">
          {earthquakes.slice(0, 8).map((eq) => {
            const isSelected = selectedEarthquake?.id === eq.id;
            const magNum = parseFloat(eq.magnitude) || 3.0;

            const bgClass =
              magNum >= 5.0
                ? 'bg-rose-500/85 hover:bg-rose-500 border-rose-400/50'
                : magNum >= 4.0
                ? 'bg-amber-500/85 hover:bg-amber-500 border-amber-400/50'
                : 'bg-emerald-500/85 hover:bg-emerald-500 border-emerald-400/50';

            return (
              <div
                key={eq.id}
                onClick={() => onSelectEarthquake?.(eq)}
                className={`min-w-[190px] sm:min-w-[210px] cursor-pointer rounded-2xl border p-3.5 transition-all text-slate-950 shadow-md ${bgClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black tracking-tight">
                      {eq.magnitude} Magnitude
                    </span>
                    <span className="text-[10px] font-bold bg-white/30 text-slate-950 px-2 py-0.5 rounded-full">
                      Depth {eq.depth || 10}km
                    </span>
                  </div>

                  <p className="text-xs font-bold flex items-center gap-1 line-clamp-1">
                    <span>📍</span>
                    <span>{eq.place}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[10px] font-bold">
                    <span>📅 {eq.dateFormatted}</span>
                    <span>🕒 {eq.timeFormatted}</span>
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
