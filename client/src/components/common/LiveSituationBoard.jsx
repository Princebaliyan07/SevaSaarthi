import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import Badge from './Badge';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { getLiveIncidents } from '../../services/alertService';

// Smooth Map Controller to fly to selected alert coordinates
function MapRecenter({ coords, zoom = 6 }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, map]);
  return null;
}

export default function LiveSituationBoard({ className = '' }) {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [disasterFilter, setDisasterFilter] = useState('all');

  const loadData = useCallback(async () => {
    try {
      const res = await getLiveIncidents({
        disasterType: disasterFilter !== 'all' ? disasterFilter : undefined,
      });
      setIncidents(res.incidents);
      setLastUpdated(res.lastUpdated ? new Date(res.lastUpdated) : new Date());
      if (res.incidents.length > 0 && (!selectedIncident || !res.incidents.find(i => i.incidentId === selectedIncident.incidentId))) {
        setSelectedIncident(res.incidents[0]);
      }
    } catch (e) {
      console.warn('Failed to load live incidents:', e);
    } finally {
      setLoading(false);
    }
  }, [disasterFilter, selectedIncident]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Marker colors by severity and source verification
  const getMarkerStyling = (incident, isSelected) => {
    let fillColor = '#EAB308'; // Default Yellow for External
    let strokeColor = '#CA8A04';

    if (incident.sourceType === 'official_gov') {
      if (incident.severity === 'critical') {
        fillColor = '#EF4444'; // Red for Official Critical
        strokeColor = '#B91C1C';
      } else {
        fillColor = '#10B981'; // Green for Official Verified
        strokeColor = '#047857';
      }
    } else if (incident.sourceType === 'external_scientific') {
      fillColor = '#F59E0B'; // Amber / Yellow for NASA EONET
      strokeColor = '#D97706';
    } else if (incident.sourceType === 'demo') {
      fillColor = '#3B82F6'; // Blue for Demo
      strokeColor = '#1D4ED8';
    }

    return {
      fillColor,
      color: isSelected ? '#FFFFFF' : strokeColor,
      weight: isSelected ? 3.5 : 2,
      radius: isSelected ? 16 : 11,
      fillOpacity: 0.9,
    };
  };

  return (
    <div className={`glass-card overflow-hidden p-5 sm:p-7 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-rose-600"></span>
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🛰️</span>
              <span>{lang === 'hi' ? 'अखिल भारतीय लाइव GIS एवं IMD स्थिति रडार' : 'All-India Live GIS & IMD Situation Radar'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Feeds: NDMA SACHET + NASA EONET v3</span>
              {lastUpdated && (
                <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400">
                  · Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Source Badges Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            🟢 Official Alert
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            🟡 NASA EONET
          </span>
          <button
            type="button"
            onClick={loadData}
            title="Refresh live telemetry"
            className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <span>🔄</span>
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="my-3.5 flex flex-wrap gap-1.5 text-xs">
        {['all', 'flood', 'landslide', 'cyclone', , 'heatwave', 'wildfire'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setDisasterFilter(f)}
            className={`rounded-xl px-3 py-1 text-xs font-bold capitalize transition-all ${
              disasterFilter === f
                ? 'bg-brand text-white shadow-xs dark:bg-brand-light dark:text-slate-950'
                : 'border border-slate-200/80 bg-white/80 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300'
            }`}
          >
            {f === 'all' ? 'All Disasters' : f}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Map (Left) & Active Telemetry Bulletins (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Real Interactive Leaflet GIS Map */}
        <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-md lg:col-span-7">
          {!loading && (
            <MapContainer
              center={[22.5937, 80.9629]}
              zoom={4.5}
              scrollWheelZoom={false}
              className={`h-full w-full z-10 ${isDark ? 'leaflet-dark-mode' : ''}`}
              style={{ background: isDark ? '#0F172A' : '#F8FAFC' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Fly To Focused Region */}
              {selectedIncident && (
                <MapRecenter
                  coords={{ lat: selectedIncident.latitude, lng: selectedIncident.longitude }}
                  zoom={6}
                />
              )}

              {/* Live Incident Markers */}
              {incidents.map((inc) => {
                const isSelected = selectedIncident?.incidentId === inc.incidentId;
                const styling = getMarkerStyling(inc, isSelected);

                return (
                  <CircleMarker
                    key={inc.incidentId}
                    center={[inc.latitude, inc.longitude]}
                    pathOptions={styling}
                    eventHandlers={{
                      click: () => setSelectedIncident(inc),
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 space-y-1 max-w-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900 block uppercase">
                            {inc.disasterType}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                              inc.sourceType === 'official_gov'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inc.sourceType === 'official_gov' ? 'Verified Official' : 'NASA Satellite'}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 block">{inc.title}</span>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{inc.description}</p>
                        <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                          <span>📍 {inc.state}</span>
                          {inc.sourceUrl && (
                            <a
                              href={inc.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-teal-700 font-bold underline"
                            >
                              Source ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Map Overlay Badge */}
          <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-xl bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-md">
            🗺️ Click marker to focus
          </div>
        </div>

        {/* Selected Live Incident Telemetry Details (Right Column) */}
        <div className="space-y-4 lg:col-span-5">
          {selectedIncident && (
            <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {selectedIncident.sourceType === 'official_gov'
                    ? '🏛️ Official Government Alert'
                    : '🛰️ Scientific Satellite Telemetry'}
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wide ${
                    selectedIncident.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-700 border border-rose-500/40 dark:text-rose-300'
                      : 'bg-amber-500/20 text-amber-700 border border-amber-500/40 dark:text-amber-300'
                  }`}
                >
                  {selectedIncident.severity}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedIncident.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  📍 {selectedIncident.locationName || selectedIncident.district || selectedIncident.state} ·{' '}
                  <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedIncident.source}</span>
                </p>
              </div>

              {/* Description & Action Required */}
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                <p>{selectedIncident.description}</p>
                {selectedIncident.actionRequired && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 font-bold text-rose-700 dark:text-rose-300 flex items-start gap-1.5">
                    <span>🚨</span>
                    <span>{selectedIncident.actionRequired}</span>
                  </div>
                )}
              </div>

              {/* Source Link & Verification Badge */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-mono text-[11px] text-slate-500">
                  ID: {selectedIncident.incidentId}
                </span>
                {selectedIncident.sourceUrl && (
                  <a
                    href={selectedIncident.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline dark:text-teal-400"
                  >
                    <span>View Official Source</span>
                    <span>↗</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Incident Quick Selector List */}
          <div className="space-y-2">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {lang === 'hi' ? 'सक्रिय राष्ट्रीय चेतावनी सूची' : `Live Incidents Feed (${incidents.length})`}
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.incidentId}
                  onClick={() => setSelectedIncident(inc)}
                  className={`cursor-pointer rounded-xl border p-2.5 transition-all text-xs flex items-center justify-between ${
                    selectedIncident?.incidentId === inc.incidentId
                      ? 'border-brand bg-teal-500/10 shadow-xs dark:bg-teal-500/15 dark:border-teal-400'
                      : 'border-slate-200/80 bg-white/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        inc.sourceType === 'official_gov'
                          ? inc.severity === 'critical'
                            ? 'bg-rose-500 animate-ping'
                            : 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-[220px]">
                      {inc.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    {inc.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
