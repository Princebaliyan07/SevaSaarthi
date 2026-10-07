import { useState } from 'react';
import { REAL_FLOOD_EVENTS, REAL_LANDSLIDE_EVENTS } from '../../services/disasterTelemetryService';
import { useLanguage } from '../../context/LanguageContext';

export default function RecentEarthquakesCard({
  earthquakes = [],
  selectedEarthquake = null,
  onSelectEarthquake,
  onSelectIncident,
  loading = false,
  activeTab: propTab = 'earthquake',
  onTabChange,
}) {
  const { lang } = useLanguage();
  const [internalTab, setInternalTab] = useState('earthquake');
  const activeTab = propTab || internalTab;

  const handleTabClick = (tab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const floods = REAL_FLOOD_EVENTS;
  const landslides = REAL_LANDSLIDE_EVENTS;

  return (
    <div className="rounded-2xl border border-sky-600/30 bg-gradient-to-b from-sky-900/90 via-sky-950/90 to-slate-900/95 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-sky-500/20 pb-3 mb-3 gap-2">
        <div className="flex items-center gap-1.5 bg-sky-950/80 p-1 rounded-xl border border-sky-700/50">
          <button
            type="button"
            onClick={() => handleTabClick('earthquake')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'earthquake'
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-sky-300 hover:text-white'
            }`}
          >
            🌋 Earthquakes
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('flood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'flood'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-sky-300 hover:text-white'
            }`}
          >
            🌊 Floods
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('landslide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'landslide'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-sky-300 hover:text-white'
            }`}
          >
            ⛰️ Landslides
          </button>
        </div>

        <span className="text-lg" title="Live Geo Hazard Telemetry">
          {activeTab === 'earthquake' ? '🌋' : activeTab === 'flood' ? '🌊' : '⛰️'}
        </span>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'earthquake' && (
        <>
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
                    <div className="space-y-2">
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
        </>
      )}

      {/* Floods Tab */}
      {activeTab === 'flood' && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-sky-700">
          {floods.map((fld) => {
            const isSelected = selectedEarthquake?.id === fld.id;
            const bgClass =
              fld.severity === 'critical'
                ? 'bg-rose-500/90 hover:bg-rose-500 border-rose-400/50 text-white'
                : 'bg-cyan-500/90 hover:bg-cyan-500 border-cyan-400/50 text-slate-950';

            return (
              <div
                key={fld.id}
                onClick={() => {
                  onSelectIncident?.({
                    incidentId: fld.id,
                    disasterType: 'flood',
                    title: fld.title,
                    description: `${fld.metricBadge} - ${fld.action}`,
                    latitude: fld.lat,
                    longitude: fld.lng,
                    state: fld.place,
                    locationName: fld.place,
                    severity: fld.severity,
                    source: fld.source,
                    actionRequired: fld.action,
                    reportedAt: new Date(),
                  });
                }}
                className={`min-w-[210px] sm:min-w-[230px] cursor-pointer rounded-2xl border p-3.5 transition-all shadow-md ${bgClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-tight uppercase">
                      🌊 {fld.metricBadge}
                    </span>
                    <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">
                      CWC Level
                    </span>
                  </div>

                  <p className="text-xs font-black line-clamp-1">{fld.title}</p>
                  <p className="text-[11px] font-semibold flex items-center gap-1 line-clamp-1">
                    <span>📍</span>
                    <span>{fld.place}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[10px] font-bold">
                    <span>📅 {fld.dateFormatted}</span>
                    <span>🕒 {fld.timeFormatted}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Landslides Tab */}
      {activeTab === 'landslide' && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-sky-700">
          {landslides.map((ls) => {
            const isSelected = selectedEarthquake?.id === ls.id;
            const bgClass =
              ls.severity === 'critical'
                ? 'bg-rose-500/90 hover:bg-rose-500 border-rose-400/50 text-white'
                : 'bg-amber-500/90 hover:bg-amber-500 border-amber-400/50 text-slate-950';

            return (
              <div
                key={ls.id}
                onClick={() => {
                  onSelectIncident?.({
                    incidentId: ls.id,
                    disasterType: 'landslide',
                    title: ls.title,
                    description: `${ls.metricBadge} - ${ls.action}`,
                    latitude: ls.lat,
                    longitude: ls.lng,
                    state: ls.place,
                    locationName: ls.place,
                    severity: ls.severity,
                    source: ls.source,
                    actionRequired: ls.action,
                    reportedAt: new Date(),
                  });
                }}
                className={`min-w-[210px] sm:min-w-[230px] cursor-pointer rounded-2xl border p-3.5 transition-all shadow-md ${bgClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 shadow-xl' : 'hover:scale-[1.02]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-tight uppercase">
                      ⛰️ {ls.metricBadge}
                    </span>
                    <span className="text-[10px] font-bold bg-white/25 px-2 py-0.5 rounded-full">
                      GSI Array
                    </span>
                  </div>

                  <p className="text-xs font-black line-clamp-1">{ls.title}</p>
                  <p className="text-[11px] font-semibold flex items-center gap-1 line-clamp-1">
                    <span>📍</span>
                    <span>{ls.place}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-black/10 text-[10px] font-bold">
                    <span>📅 {ls.dateFormatted}</span>
                    <span>🕒 {ls.timeFormatted}</span>
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
