import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import {
  Waves,
  Mountain,
  CloudLightning,
  CloudRain,
  Wind,
  History,
  AlertTriangle,
  Radio,
  MapPin,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { GIS_HAZARD_POINTS } from '../../data/seasonalGisData';

const SEASONS = ['Summer', 'Monsoon', 'Winter', 'Post-Monsoon'];

const LAYERS_CONFIG = [
  { id: 'all', label: 'All Hazards', labelHi: 'सभी खतरे', icon: Layers, color: '#0D9488' },
  { id: 'flood', label: 'Flood-prone', labelHi: 'बाढ़ प्रवण', icon: Waves, color: '#0284C7' },
  { id: 'landslide', label: 'Landslide-prone', labelHi: 'भूस्खलन प्रवण', icon: Mountain, color: '#D97706' },
  { id: 'cloudburst', label: 'Cloudburst history', labelHi: 'बादल फटने का इतिहास', icon: CloudLightning, color: '#7C3AED' },
  { id: 'rainfall', label: 'Heavy rainfall', labelHi: 'भारी वर्षा', icon: CloudRain, color: '#0891B2' },
  { id: 'cyclone', label: 'Cyclone risk', labelHi: 'चक्रवात जोखिम', icon: Wind, color: '#E11D48' },
  { id: 'past', label: 'Past incidents', labelHi: 'पिछली घटनाएं', icon: History, color: '#F59E0B' },
  { id: 'official', label: 'Official alerts', labelHi: 'आधिकारिक अलर्ट', icon: Radio, color: '#DC2626' },
];

// Smooth map recenter controller
function MapRecenter({ coords, zoom = 6 }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo([coords.lat, coords.lng], zoom, {
        duration: 1.1,
        easeLinearity: 0.25,
      });
    }
  }, [coords, zoom, map]);
  return null;
}

export default function SeasonalRiskMap({
  activeSeason: externalSeason = 'Monsoon',
  onSeasonChange,
}) {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();

  // Internal state for season and focused hazard layer
  const [activeSeason, setActiveSeason] = useState(externalSeason || 'Monsoon');
  const [activeLayer, setActiveLayer] = useState('all');

  // Keep synced with external season if provided
  useEffect(() => {
    if (externalSeason && externalSeason !== activeSeason) {
      setActiveSeason(externalSeason);
    }
  }, [externalSeason]);

  const handleSeasonSelect = (season) => {
    setActiveSeason(season);
    onSeasonChange?.(season);
  };

  const handleLayerSelect = (layerId) => {
    setActiveLayer(layerId);
  };

  // Filter hazard points based on selected season and active layer
  const filteredPoints = useMemo(() => {
    return GIS_HAZARD_POINTS.filter((point) => {
      // Must match season
      if (point.season.toLowerCase() !== activeSeason.toLowerCase()) {
        return false;
      }
      // If 'all', return all layers; otherwise must match activeLayer
      if (activeLayer !== 'all' && point.layer !== activeLayer) {
        return false;
      }
      return true;
    });
  }, [activeSeason, activeLayer]);

  // Selected incident for detail view and map center focus
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Automatically update selected incident whenever filteredPoints change
  useEffect(() => {
    if (filteredPoints.length > 0) {
      // If current selected incident is still in the filtered list, keep it; else select first
      const stillPresent = filteredPoints.find((p) => p.id === selectedIncident?.id);
      if (!stillPresent) {
        setSelectedIncident(filteredPoints[0]);
      }
    } else {
      setSelectedIncident(null);
    }
  }, [filteredPoints, selectedIncident]);

  const handleSelectIncident = (item) => {
    setSelectedIncident(item);
  };

  // Marker styling
  const getMarkerStyling = (item, isSelected) => {
    return {
      fillColor: item.color || '#0D9488',
      color: isSelected ? '#FFFFFF' : item.color,
      weight: isSelected ? 4 : 2,
      radius: isSelected ? 15 : 10,
      fillOpacity: 0.9,
    };
  };

  return (
    <div className="space-y-5">
      {/* 1. Season Selector Tabs (Summer, Monsoon, Winter, Post-Monsoon) */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-2.5">
          <span className="text-xs font-bold text-ink-soft uppercase tracking-wider mr-1 hidden sm:inline-block">
            Season:
          </span>
          {SEASONS.map((season) => {
            const isCurrent = activeSeason === season;
            return (
              <button
                key={season}
                type="button"
                onClick={() => handleSeasonSelect(season)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border ${
                  isCurrent
                    ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20 scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand/40 hover:bg-slate-50'
                }`}
              >
                {season === 'Summer'
                  ? t('disaster.summer')
                  : season === 'Monsoon'
                  ? t('disaster.monsoon')
                  : season === 'Winter'
                  ? t('disaster.winter')
                  : t('disaster.postMonsoon')}
              </button>
            );
          })}
        </div>

        {/* 2. Hazard Layer Filter Tabs (All Hazards, Flood-prone, Landslide-prone, Cloudburst, Rainfall, Cyclone, Past, Official) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-ink-soft text-[11px] uppercase tracking-wider">
            Hazard Layers:
          </span>
          {LAYERS_CONFIG.map((layer) => {
            const isActive = activeLayer === layer.id;
            const IconComp = layer.icon;

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => handleLayerSelect(layer.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-bold text-xs transition-all border ${
                  isActive
                    ? 'bg-brand text-white border-brand shadow-sm scale-105'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{lang === 'hi' ? layer.labelHi : layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Live OpenStreetMap India Map (Left) & Active Disaster Details + List (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Live Leaflet India Map (col-span-7) */}
        <div className="card overflow-hidden bg-white p-4 lg:col-span-7 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-2.5 gap-2">
            <div>
              <span className="text-xs font-black text-ink uppercase tracking-wider block">
                {lang === 'hi' ? 'लाइव भारत जीआईएस आपदा मानचित्र' : 'Live India GIS & Seasonal Situation Map'}
              </span>
              <span className="text-[11px] text-ink-soft">
                Season: <strong className="text-brand-dark">{activeSeason}</strong> · Layer: <strong className="text-brand-dark">{LAYERS_CONFIG.find(l => l.id === activeLayer)?.label}</strong> · {filteredPoints.length} active hazard zones mapped
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span>Live OpenStreetMap</span>
            </span>
          </div>

          {/* Interactive Map Container */}
          <div className="relative h-[430px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={4.8}
              scrollWheelZoom={false}
              className={`h-full w-full z-10 ${isDark ? 'leaflet-dark-mode' : ''}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Recenter controller when user clicks an incident or changes layer */}
              {selectedIncident && (
                <MapRecenter coords={{ lat: selectedIncident.lat, lng: selectedIncident.lng }} zoom={6.2} />
              )}

              {/* Render CircleMarkers for each hazard zone */}
              {filteredPoints.map((point) => {
                const isSelected = selectedIncident?.id === point.id;
                const styling = getMarkerStyling(point, isSelected);

                return (
                  <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    pathOptions={styling}
                    eventHandlers={{
                      click: () => handleSelectIncident(point),
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-xs max-w-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-ink uppercase text-[10px]">
                            {point.icon} {point.layer}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-black uppercase ${
                              point.severity === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {point.severity}
                          </span>
                        </div>
                        <span className="font-extrabold text-ink block">{point.title}</span>
                        <p className="text-[11px] text-ink-soft line-clamp-2">{point.impact}</p>
                        <div className="pt-1 border-t border-slate-200 text-[10px] text-brand-dark flex items-center justify-between">
                          <span>📍 {point.state}</span>
                          <span>{point.year}</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Map Legend on bottom-left */}
            <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-slate-200/80 shadow-md text-[10px] space-y-1">
              <span className="font-extrabold text-ink block">Layer Legend:</span>
              <div className="flex flex-col gap-0.5 font-bold">
                <span className="text-sky-700 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
                  <span>Flood-prone (CWC)</span>
                </span>
                <span className="text-amber-700 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                  <span>Landslide-prone (GSI)</span>
                </span>
                <span className="text-purple-700 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
                  <span>Cloudburst history</span>
                </span>
                <span className="text-rose-700 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                  <span>Cyclone / Alerts</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Incident Detail Box & Interactive Alert List (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Highlight Card */}
          {selectedIncident ? (
            <div className="card bg-white p-5 border border-slate-200 shadow-md space-y-4">
              <div className="border-b border-line pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{selectedIncident.icon}</span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      selectedIncident.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : selectedIncident.severity === 'high'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {selectedIncident.severity} Hazard Zone
                  </span>
                </div>

                <h3 className="text-lg font-black text-ink leading-snug">
                  {selectedIncident.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-ink-soft flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>
                    {selectedIncident.lat.toFixed(4)}° N, {selectedIncident.lng.toFixed(4)}° E · {selectedIncident.district}, {selectedIncident.state}
                  </span>
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="font-bold text-ink-soft">Season / Vigil:</span>
                  <span className="font-extrabold text-ink">{selectedIncident.year}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="font-bold text-ink-soft">Hazard Impact:</span>
                  <span className="text-right font-medium text-ink max-w-[65%] leading-relaxed">
                    {selectedIncident.impact}
                  </span>
                </div>

                <div className="py-1">
                  <span className="block font-bold text-ink-soft mb-1">Official Civil Advice:</span>
                  <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-amber-950 font-medium leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{selectedIncident.advice}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-teal-50/70 border border-teal-200 p-3 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-dark block">
                    Nearest Designated High-Ground Shelter:
                  </span>
                  <span className="font-black text-ink text-sm block">
                    {selectedIncident.shelter}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] text-ink-soft">
                <span>Verified Source: <strong>{selectedIncident.source}</strong></span>
                <Badge type="demo" />
              </div>
            </div>
          ) : (
            <div className="card bg-white p-6 text-center text-xs text-ink-soft border border-slate-200 space-y-2">
              <Shield className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700">No hazard points match current active layer.</p>
              <p>Click "All Hazards" or another hazard layer above to display disaster zones.</p>
            </div>
          )}

          {/* Interactive Incident / Hazard List */}
          <div className="space-y-2">
            <div className="rounded-xl bg-brand text-white p-2.5 text-center font-black text-xs uppercase tracking-wider shadow-sm">
              SELECT ACTIVE HAZARD ZONE TO FOCUS MAP
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {filteredPoints.map((item) => {
                const isSelected = selectedIncident?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectIncident(item)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isSelected
                        ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span>{item.icon}</span>
                        <span className="font-extrabold">{item.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        📍 {item.district}, {item.state}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        item.severity === 'critical'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
