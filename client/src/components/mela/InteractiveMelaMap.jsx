import { useState, useRef } from 'react';

export const FACILITY_CATEGORIES = {
  hospital_medical: {
    label: 'Hospital & Medical Stations',
    labelHi: 'अस्पताल व मेडिकल कैंप',
    icon: '🏥',
    color: '#ef4444',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
  },
  medicine_distribution: {
    label: 'Medicine Distribution',
    labelHi: 'दवा वितरण केंद्र',
    icon: '💊',
    color: '#06b6d4',
    badgeClass: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
  },
  drinking_water: {
    label: 'Drinking Water Stations',
    labelHi: 'पेयजल केंद्र',
    icon: '🚰',
    color: '#0ea5e9',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  },
  toilet: {
    label: 'Toilets & Sanitation Blocks',
    labelHi: 'शौचालय व स्वच्छता केंद्र',
    icon: '🚻',
    color: '#10b981',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  },
  entry_gate: {
    label: 'Entry Gates',
    labelHi: 'प्रवेश द्वार',
    icon: '🚪',
    color: '#3b82f6',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  exit_gate: {
    label: 'Exit Corridors',
    labelHi: 'निकास द्वार',
    icon: '🚶',
    color: '#8b5cf6',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  emergency_shelter: {
    label: 'Emergency Shelters',
    labelHi: 'रैन बसेरे व राहत शिविर',
    icon: '⛺',
    color: '#f59e0b',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  },
  help_desk: {
    label: 'Help Desks & Lost-Found',
    labelHi: 'सहायता व खोया-पाया केंद्र',
    icon: 'ℹ️',
    color: '#14b8a6',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
  crowded_area: {
    label: 'High Density Areas',
    labelHi: 'अत्यधिक भीड़ वाले क्षेत्र',
    icon: '👥',
    color: '#f97316',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  restricted_area: {
    label: 'Restricted Zones',
    labelHi: 'प्रतिबंधित क्षेत्र',
    icon: '🚫',
    color: '#dc2626',
    badgeClass: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
  },
  temporarily_closed_route: {
    label: 'Temporarily Closed Routes',
    labelHi: 'अस्थायी बंद मार्ग',
    icon: '🚧',
    color: '#64748b',
    badgeClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  },
};

export default function InteractiveMelaMap({
  facilities = [],
  alerts = [],
  maps = [],
  selectedMapId = 'prayagraj_kumbh',
  onSelectMap = null,
  onOpenAddMap = null,
  focusedFacilityId = null,
  isAdmin = false,
  onAddFacility = null,
  onEditFacility = null,
  onDeleteFacility = null,
  lang = 'en',
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFacility, setActiveFacility] = useState(null);
  const [isPickingCoords, setIsPickingCoords] = useState(false);
  const [selectedMapIdState, setSelectedMapIdState] = useState(selectedMapId);
  const mapContainerRef = useRef(null);

  // Default maps fallback
  const defaultMaps = [
    {
      mapId: 'prayagraj_kumbh',
      name: 'Prayagraj Maha Kumbh 2025 (Sangam Ground)',
      imageUrl: '/mela-blueprint-map.jpg',
      description: 'Sangam confluence, Akhada camp, Kalpwas sectors, and pontoon bridges ground layout.',
    },
    {
      mapId: 'haridwar_kumbh',
      name: 'Haridwar Kumbh (Har Ki Pauri & Ghats)',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      description: 'Har Ki Pauri corridor and pontoon footbridge crossing layout.',
    },
  ];

  const allMaps = maps && maps.length > 0 ? maps : defaultMaps;
  const activeMap = allMaps.find((m) => m.mapId === (selectedMapId || selectedMapIdState)) || allMaps[0];

  const handleMapClick = (e) => {
    if (!isPickingCoords || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const cleanCoords = {
      mapX: Math.round(x),
      mapY: Math.round(y),
      mapId: activeMap?.mapId || 'prayagraj_kumbh',
    };
    setIsPickingCoords(false);
    if (onAddFacility) onAddFacility(cleanCoords);
  };

  // Filter facilities by active map and category
  const mapFacilities = facilities.filter(
    (f) => !f.mapId || f.mapId === activeMap?.mapId || (activeMap?.mapId === 'prayagraj_kumbh' && !f.mapId)
  );

  // Only display categories that are present in the admin-added facilities
  const presentCategoryKeys = Array.from(new Set(mapFacilities.map((f) => f.category)));
  const adminCategories = Object.entries(FACILITY_CATEGORIES).filter(([catKey]) =>
    presentCategoryKeys.includes(catKey)
  );
  // Fallback to all if none added yet
  const displayedCategories = adminCategories.length > 0 ? adminCategories : Object.entries(FACILITY_CATEGORIES);

  const filteredFacilities = mapFacilities.filter((fac) => {
    if (selectedCategory !== 'all' && fac.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter & Map Switcher Bar */}
      <div className="glass-card p-4 sm:p-5 space-y-3.5 border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 text-lg">
              🗺️
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {activeMap?.name || 'Mela Ground Layout & Facilities Map'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  ⚡ Interactive Blueprint
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'hi'
                  ? 'अस्पताल, पेयजल, शौचालय, प्रवेश द्वार एवं आपातकालीन रैन बसेरों का वास्तविक समय विज़ुअलाइज़ेशन।'
                  : 'Locate toilets, water stations, medical camps, pontoon bridges, and gates on the fair grounds.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onAddFacility && (
              <button
                type="button"
                onClick={() => {
                  setIsPickingCoords(!isPickingCoords);
                  if (isPickingCoords) onAddFacility();
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isPickingCoords
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <span>{isPickingCoords ? '🎯 Click Map to Place Marker' : '➕ Add Facility Marker'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Multi-Map Ground Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              Ground Map:
            </span>
            {allMaps.map((m) => {
              const isSelected = activeMap?.mapId === m.mapId;
              return (
                <button
                  key={m.mapId}
                  type="button"
                  onClick={() => {
                    setSelectedMapIdState(m.mapId);
                    if (onSelectMap) onSelectMap(m.mapId);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  📍 {m.name}
                </button>
              );
            })}
          </div>

          {isAdmin && onOpenAddMap && (
            <button
              type="button"
              onClick={onOpenAddMap}
              className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all whitespace-nowrap flex items-center gap-1"
            >
              <span>➕</span>
              <span>Add New Ground Map</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills (Only categories added by admin) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            🌟 All ({mapFacilities.length})
          </button>

          {displayedCategories.map(([catKey, cat]) => {
            const count = mapFacilities.filter((f) => f.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'hi' ? cat.labelHi : cat.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Blueprint Map Area — 65% of screen height */}
      <div
        ref={mapContainerRef}
        onClick={handleMapClick}
        className={`relative w-full overflow-hidden rounded-none sm:rounded-2xl border-y sm:border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 select-none ${ 
          isPickingCoords ? 'cursor-crosshair ring-4 ring-amber-500' : 'cursor-default'
        }`}
        style={{ height: '65vh', minHeight: '380px', maxHeight: '820px' }}
      >
        {isPickingCoords && (
          <div className="absolute top-3 right-3 z-30 px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-lg animate-bounce">
            📍 Click anywhere on the ground layout to set coordinates
          </div>
        )}

        {/* Blueprint Map Image — fills 65vh container with object-cover, centred at top */}
        <img
          src={activeMap?.imageUrl || '/mela-blueprint-map.jpg'}
          alt={activeMap?.name || 'Mela Ground Layout Map'}
          className="w-full block select-none pointer-events-none"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />

        {/* Dynamic Facility Interactive Marker Pins Overlay */}
        {filteredFacilities.map((fac) => {
          const cat = FACILITY_CATEGORIES[fac.category] || FACILITY_CATEGORIES.help_desk;
          const isSelected = activeFacility?.facilityId === fac.facilityId;
          const leftPercent = fac.mapX !== undefined ? fac.mapX : 50;
          const topPercent = fac.mapY !== undefined ? fac.mapY : 50;

          return (
            <div
              key={fac.facilityId || fac._id}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFacility(fac);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              {/* Outer pulsing ring for attention */}
              <div
                style={{ backgroundColor: cat.color }}
                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-all transform group-hover:scale-125 ${
                  isSelected ? 'scale-125 ring-4 ring-white animate-bounce' : ''
                }`}
              >
                <span className="text-xs sm:text-sm">{cat.icon}</span>
              </div>

              {/* Tooltip on Hover */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md text-white text-[10px] font-bold whitespace-nowrap shadow-xl border border-white/20 pointer-events-none z-30">
                {fac.name}
              </div>
            </div>
          );
        })}

        {/* Active Official Alerts Highlights Overlay */}
        {alerts
          .filter((a) => a.status === 'Active')
          .map((alert) => {
            const leftPercent = alert.mapX !== undefined ? alert.mapX : 50;
            const topPercent = alert.mapY !== undefined ? alert.mapY : 50;
            return (
              <div
                key={alert.alertId || alert._id}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-5"
              >
                <div className="h-16 w-16 rounded-full bg-rose-500/20 border-2 border-rose-500 border-dashed animate-ping" />
              </div>
            );
          })}
      </div>

      {/* Selected Marker Detail Card */}
      {activeFacility && (
        <div className="glass-card p-4.5 rounded-2xl border-teal-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {FACILITY_CATEGORIES[activeFacility.category]?.icon || '📍'}
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {activeFacility.name}
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                {activeFacility.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {activeFacility.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <span>📍 <strong>Sector:</strong> {activeFacility.sector}</span>
              <span>⏰ <strong>Hours:</strong> {activeFacility.operatingHours}</span>
              <span className="text-amber-600 font-semibold">• Demonstration Marker</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && onEditFacility && (
              <button
                type="button"
                onClick={() => onEditFacility(activeFacility)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-500/30"
              >
                ✏️ Edit
              </button>
            )}
            {isAdmin && onDeleteFacility && (
              <button
                type="button"
                onClick={() => onDeleteFacility(activeFacility.facilityId || activeFacility._id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-500/30"
              >
                🗑️ Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveFacility(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
