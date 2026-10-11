import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Circle, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon URLs in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Category visual styling & Icons
export const FACILITY_CATEGORIES = {
  hospital_medical: {
    label: 'Hospital & Medical Camps',
    labelHi: 'अस्पताल व मेडिकल कैंप',
    icon: '🏥',
    color: '#ef4444', // red
    bgColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  },
  medicine_distribution: {
    label: 'Medicine Distribution',
    labelHi: 'दवा वितरण केंद्र',
    icon: '💊',
    color: '#06b6d4', // cyan
    bgColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  },
  drinking_water: {
    label: 'Drinking Water Stations',
    labelHi: 'पेयजल केंद्र',
    icon: '🚰',
    color: '#0ea5e9', // sky blue
    bgColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
  },
  toilet: {
    label: 'Sanitation & Toilets',
    labelHi: 'शौचालय व स्वच्छता',
    icon: '🚻',
    color: '#84cc16', // lime
    bgColor: 'bg-lime-500/10 text-lime-700 dark:text-lime-300 border-lime-500/20',
  },
  entry_gate: {
    label: 'Entry Gates',
    labelHi: 'प्रवेश द्वार',
    icon: '🚪',
    color: '#10b981', // emerald
    bgColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  exit_gate: {
    label: 'Exit Gates',
    labelHi: 'निकास द्वार',
    icon: '🚶',
    color: '#8b5cf6', // purple
    bgColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  },
  emergency_shelter: {
    label: 'Emergency Shelters',
    labelHi: 'आपातकालीन रैन बसेरे',
    icon: '⛺',
    color: '#f59e0b', // amber
    bgColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  },
  help_desk: {
    label: 'Help Desks & Lost-Found',
    labelHi: 'सहायता केंद्र व पूछताछ',
    icon: 'ℹ️',
    color: '#0d9488', // teal
    bgColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
  },
  crowded_area: {
    label: 'Crowded Areas',
    labelHi: 'अत्यधिक भीड़ वाले क्षेत्र',
    icon: '👥',
    color: '#f97316', // orange
    bgColor: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  },
  restricted_area: {
    label: 'Restricted Areas',
    labelHi: 'प्रतिबंधित क्षेत्र',
    icon: '🚫',
    color: '#dc2626', // dark red
    bgColor: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  },
  temporarily_closed_route: {
    label: 'Temporarily Closed Routes',
    labelHi: 'अस्थायी बंद मार्ग',
    icon: '🚧',
    color: '#64748b', // slate
    bgColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
  },
};

// Map recentering controller
function MapFlyTo({ target, zoom = 15 }) {
  const map = useMap();
  useEffect(() => {
    if (target && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], zoom, {
        duration: 1.2,
      });
    }
  }, [target, zoom, map]);
  return null;
}

// Click listener for Admin Map Picker
function MapClickHandler({ onLocationSelect, active }) {
  useMapEvents({
    click(e) {
      if (active && onLocationSelect) {
        onLocationSelect({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
        });
      }
    },
  });
  return null;
}

export default function InteractiveMelaMap({
  facilities = [],
  alerts = [],
  focusedLocation = null,
  isAdmin = false,
  onAddFacility = null,
  onEditFacility = null,
  onDeleteFacility = null,
  lang = 'en',
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMarker, setActiveMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  // Default Sangam, Prayagraj Center
  const defaultCenter = useMemo(() => [25.4285, 81.884], []);

  // Request user GPS location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationError(null);
      },
      (err) => {
        setLocationError('Location permission denied. Showing Mela Sangam grounds.');
      },
      { timeout: 8000 }
    );
  };

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      if (selectedCategory !== 'all' && fac.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          fac.name?.toLowerCase().includes(q) ||
          fac.description?.toLowerCase().includes(q) ||
          fac.sector?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [facilities, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Controls: Filter Pills & Search */}
      <div className="glass-card p-4 sm:p-5 space-y-4 border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'महाकुंभ इंटरैक्टिव सुविधा मानचित्र' : 'Interactive Mela Facilities & Safe Route Map'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'hi'
                  ? 'अस्पताल, दवा वितरण, पेयजल, शौचालय, प्रवेश/निकास और भीड़ वाले क्षेत्रों की लाइव जानकारी।'
                  : 'Database-driven facilities with real coordinates and live status updates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-all shadow-xs"
              title="Show My Location"
            >
              <span>🎯</span>
              <span>{lang === 'hi' ? 'मेरी स्थिति' : 'Locate Me'}</span>
            </button>

            {isAdmin && onAddFacility && (
              <button
                type="button"
                onClick={() => {
                  setIsPickingLocation(!isPickingLocation);
                  if (!isPickingLocation) onAddFacility();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all"
              >
                <span>➕</span>
                <span>{lang === 'hi' ? 'नई सुविधा जोड़ें' : 'Add Facility (Admin)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={lang === 'hi' ? 'सुविधा का नाम, सेक्टर या सेवा खोजें...' : 'Search facility name, sector, or service...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
          </div>

          {/* Quick Clear Filter */}
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-3 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline shrink-0"
            >
              ✕ {lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filter'}
            </button>
          )}
        </div>

        {/* Category Filters (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-sm'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            🌟 {lang === 'hi' ? 'सभी सुविधाएं' : 'All Facilities'} ({facilities.length})
          </button>

          {Object.entries(FACILITY_CATEGORIES).map(([catKey, catInfo]) => {
            const count = facilities.filter((f) => f.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{catInfo.icon}</span>
                <span>{lang === 'hi' ? catInfo.labelHi : catInfo.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {locationError && (
          <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            ⚠️ {locationError}
          </p>
        )}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-lg h-[460px] sm:h-[520px]">
        {/* Demonstration Data Banner Overlay */}
        <div className="absolute top-3 left-3 z-[1000] px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold shadow-md flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Prayagraj Sangam Grounds · Database Synchronized · Demo Markers</span>
        </div>

        {/* Interactive Map Component */}
        <MapContainer
          center={defaultCenter}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Re-center if focusedLocation is passed */}
          {focusedLocation && <MapFlyTo target={focusedLocation} zoom={16} />}
          {userLocation && <MapFlyTo target={userLocation} zoom={15} />}

          {/* Map click handler for admin */}
          <MapClickHandler
            active={isPickingLocation}
            onLocationSelect={(coords) => {
              setPickedLocation(coords);
              if (onAddFacility) onAddFacility(coords);
            }}
          />

          {/* User Location Marker */}
          {userLocation && (
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={8}
              pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.9, color: '#ffffff', weight: 3 }}
            >
              <Popup>
                <div className="text-xs font-bold p-1">
                  📍 {lang === 'hi' ? 'आपकी वर्तमान स्थिति' : 'You are here'}
                </div>
              </Popup>
            </CircleMarker>
          )}

          {/* Active Alerts Geofence Circles */}
          {alerts
            .filter((a) => a.status === 'Active' && a.latitude && a.longitude)
            .map((alert) => (
              <Circle
                key={alert.alertId || alert._id}
                center={[alert.latitude, alert.longitude]}
                radius={alert.areaRadiusMeters || 250}
                pathOptions={{
                  color: alert.severity === 'Critical' ? '#dc2626' : alert.severity === 'Warning' ? '#f59e0b' : '#3b82f6',
                  fillColor: alert.severity === 'Critical' ? '#ef4444' : alert.severity === 'Warning' ? '#fbbf24' : '#60a5fa',
                  fillOpacity: 0.25,
                  dashArray: '4, 6',
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1 p-1 max-w-[220px]">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase text-white bg-rose-600">
                      🚨 {alert.severity} Alert
                    </span>
                    <h4 className="font-bold text-slate-900 mt-1">{alert.title}</h4>
                    <p className="text-[11px] text-slate-600">{alert.recommendedAction}</p>
                  </div>
                </Popup>
              </Circle>
            ))}

          {/* Facility Markers */}
          {filteredFacilities.map((fac) => {
            const cat = FACILITY_CATEGORIES[fac.category] || FACILITY_CATEGORIES.help_desk;
            const isSelected = activeMarker?.facilityId === fac.facilityId;
            return (
              <CircleMarker
                key={fac.facilityId || fac._id}
                center={[fac.latitude, fac.longitude]}
                radius={isSelected ? 10 : 7}
                pathOptions={{
                  fillColor: cat.color,
                  fillOpacity: 0.9,
                  color: '#ffffff',
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => setActiveMarker(fac),
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 min-w-[210px] text-slate-900">
                    <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                      <span className="text-xs font-bold flex items-center gap-1">
                        <span>{cat.icon}</span>
                        <span>{fac.name}</span>
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          fac.status === 'Operational'
                            ? 'bg-emerald-100 text-emerald-800'
                            : fac.status === 'Congested'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {fac.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {fac.description}
                    </p>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1 border-t">
                      <div>
                        <span className="font-semibold block">Hours:</span>
                        <span>{fac.operatingHours || '24x7'}</span>
                      </div>
                      <div>
                        <span className="font-semibold block">Sector:</span>
                        <span>{fac.sector || 'Sangam'}</span>
                      </div>
                    </div>

                    {fac.isDemoData && (
                      <p className="text-[9px] text-slate-400 italic">
                        * Demonstration facility marker
                      </p>
                    )}

                    {isAdmin && (
                      <div className="flex items-center gap-2 pt-1 border-t">
                        {onEditFacility && (
                          <button
                            type="button"
                            onClick={() => onEditFacility(fac)}
                            className="text-[10px] font-bold text-teal-600 hover:underline"
                          >
                            ✏️ Edit
                          </button>
                        )}
                        {onDeleteFacility && (
                          <button
                            type="button"
                            onClick={() => onDeleteFacility(fac.facilityId || fac._id)}
                            className="text-[10px] font-bold text-rose-600 hover:underline"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected Marker Detail Card on Mobile / Desktop */}
      {activeMarker && (
        <div className="glass-card p-4 rounded-2xl border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base">
                {FACILITY_CATEGORIES[activeMarker.category]?.icon || '📍'}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeMarker.name}
              </h4>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
                {activeMarker.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {activeMarker.description} · <span className="font-semibold">Sector:</span> {activeMarker.sector} · <span className="font-semibold">Hours:</span> {activeMarker.operatingHours}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveMarker(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 shrink-0"
          >
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
