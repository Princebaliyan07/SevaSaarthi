import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import {
  Search,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Building,
  Heart,
  Tent,
  CheckCircle2,
  Info,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { EMERGENCY_FACILITIES } from '../../data/emergencySheltersData';
import { useLanguage } from '../../context/LanguageContext';

// Helper: Haversine distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

// Controller to smoothly pan the map
function MapController({ center, zoom = 12 }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function ShelterEvacuationFinder() {
  const { lang } = useLanguage();

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [userLocation, setUserLocation] = useState(null); // { lat, lng, name }
  const [geoError, setGeoError] = useState('');
  const [selectedFacility, setSelectedFacility] = useState(EMERGENCY_FACILITIES[0]);
  const [mapCenter, setMapCenter] = useState([25.4358, 81.8463]); // Default Prayagraj

  // Optional Geolocation with explicit permission
  const handleDetectLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: 'Your Current Location',
        };
        setUserLocation(coords);
        setMapCenter([coords.lat, coords.lng]);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        if (err.code === 1) {
          setGeoError('Location permission was denied. You can still search by city or district name above.');
        } else {
          setGeoError('Unable to retrieve location. Please search by place name.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Filter facilities
  const filteredFacilities = useMemo(() => {
    return EMERGENCY_FACILITIES.filter((f) => {
      // Type filter
      if (selectedType !== 'All' && f.type !== selectedType) {
        return false;
      }
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesAddress = f.address.toLowerCase().includes(q);
        const matchesDistrict = f.district.toLowerCase().includes(q);
        const matchesState = f.state.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress && !matchesDistrict && !matchesState) {
          return false;
        }
      }
      return true;
    }).map((f) => {
      const distance = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, f.lat, f.lng)
        : null;
      return { ...f, calculatedDistance: distance };
    }).sort((a, b) => {
      if (a.calculatedDistance && b.calculatedDistance) {
        return parseFloat(a.calculatedDistance) - parseFloat(b.calculatedDistance);
      }
      return 0;
    });
  }, [searchQuery, selectedType, userLocation]);

  const handleSelectFacility = (fac) => {
    setSelectedFacility(fac);
    setMapCenter([fac.lat, fac.lng]);
  };

  return (
    <section id="shelter-finder" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Evacuation Hubs &amp; Care</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          Find Emergency Shelters &amp; Safe Locations
        </h2>
        <p className="text-sm text-ink-soft max-w-2xl mt-1 leading-relaxed">
          Locate verified high-ground emergency shelters, district hospitals, relief camps, and safe assembly areas.
        </p>
      </div>

      {/* Prominent Evacuation Safety Warning (Strict Mandate) */}
      <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 text-amber-950 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Critical Evacuation Navigation Safety Notice</span>
        </div>
        <p className="text-xs leading-relaxed font-medium">
          A standard online road navigation route is <strong>NOT</strong> guaranteed to be safe during active floods, landslides, or road collapses. Standard GPS maps do not account for submerged culverts, washed-out bridges, or falling rock zones.
        </p>
        <p className="text-xs leading-relaxed font-bold text-amber-900">
          Always prioritize instructions and cordoned routes established by local Police, NDRF, SDRF, and District Disaster Management Authorities.
        </p>
      </div>

      {/* Controls: Search, GPS Detect & Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, district or facility (e.g. Prayagraj, Noida, Chamoli, GIMS)..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-ink placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* GPS Detection Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            className="btn-outline text-xs py-2.5 px-4 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            title="Detect nearby facilities using browser geolocation with your explicit consent"
          >
            <Navigation className="w-3.5 h-3.5 text-brand" />
            <span>Detect My Location</span>
          </button>
        </div>

        {/* Location Error Notice if any */}
        {geoError && (
          <div className="rounded-xl bg-slate-100 border border-slate-200 p-2.5 text-xs text-slate-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{geoError}</span>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-ink-soft text-[11px] uppercase tracking-wider">
            Filter:
          </span>
          {['All', 'Shelter', 'Hospital', 'Relief Centre', 'Safe Point'].map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-brand text-white border-brand shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-brand/40 hover:bg-slate-50'
                }`}
              >
                {type === 'All' ? 'All Facilities' : `${type}s`}
              </button>
            );
          })}
          <span className="text-[11px] text-ink-soft ml-auto font-medium">
            Showing {filteredFacilities.length} facilities
          </span>
        </div>
      </div>

      {/* Main Grid: Interactive Leaflet Map + Facility Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Interactive Leaflet Map (col-span-7) */}
        <div className="card bg-white p-3 border border-slate-200 lg:col-span-7 overflow-hidden space-y-2">
          <div className="flex items-center justify-between border-b border-line pb-2 px-1">
            <span className="text-xs font-black text-ink uppercase tracking-wider">
              Emergency Facilities Map
            </span>
            <span className="text-[11px] font-bold text-brand-dark">
              Click any pin to inspect verified shelter details
            </span>
          </div>

          <div className="h-[420px] w-full rounded-xl overflow-hidden border border-slate-200 relative">
            <MapContainer
              center={mapCenter}
              zoom={11}
              scrollWheelZoom={false}
              className="h-full w-full z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController center={mapCenter} zoom={11} />

              {/* User location pin if detected */}
              {userLocation && (
                <CircleMarker
                  center={[userLocation.lat, userLocation.lng]}
                  radius={9}
                  pathOptions={{
                    color: '#0284C7',
                    fillColor: '#38BDF8',
                    fillOpacity: 0.9,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs space-y-0.5">
                      <span className="font-bold text-sky-700 block">Your Position</span>
                      <span>Detected via browser GPS</span>
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Facilities pins */}
              {filteredFacilities.map((fac) => {
                const isSelected = selectedFacility?.id === fac.id;
                const pinColor =
                  fac.type === 'Hospital'
                    ? '#EF4444'
                    : fac.type === 'Shelter'
                    ? '#0D9488'
                    : fac.type === 'Relief Centre'
                    ? '#6366F1'
                    : '#F59E0B';

                return (
                  <CircleMarker
                    key={fac.id}
                    center={[fac.lat, fac.lng]}
                    radius={isSelected ? 10 : 7}
                    pathOptions={{
                      color: isSelected ? '#FFFFFF' : pinColor,
                      fillColor: pinColor,
                      fillOpacity: 0.85,
                      weight: isSelected ? 3 : 1.5,
                    }}
                    eventHandlers={{
                      click: () => handleSelectFacility(fac),
                    }}
                  >
                    <Popup>
                      <div className="p-1 text-xs space-y-1 max-w-[200px]">
                        <span className="font-extrabold text-ink block">{fac.name}</span>
                        <span className="text-[10px] text-ink-soft block">{fac.address}</span>
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span className="font-bold text-brand-dark">{fac.type}</span>
                          <span className="text-slate-500 font-mono">{fac.capacity}</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-[11px] text-ink-soft">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                <span>Shelter</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Hospital</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span>Relief Centre</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Safe Assembly</span>
              </span>
            </div>
            <span>Map tiles &copy; OpenStreetMap contributors</span>
          </div>
        </div>

        {/* Selected Facility Details & Scrollable List (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Highlight Card */}
          {selectedFacility && (
            <div className="card bg-white p-5 border-2 border-brand/50 shadow-md space-y-4">
              <div className="space-y-1.5 border-b border-line pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-brand-dark border border-teal-200">
                    {selectedFacility.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{selectedFacility.operatingStatus}</span>
                  </span>
                </div>

                <h3 className="text-base font-black text-ink leading-snug">
                  {selectedFacility.name}
                </h3>
                <p className="text-xs text-ink-soft flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedFacility.address}</span>
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface border border-line">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Capacity</span>
                  <span className="font-extrabold text-ink">{selectedFacility.capacity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface border border-line">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Distance</span>
                  <span className="font-extrabold text-brand-dark">
                    {selectedFacility.calculatedDistance ? `${selectedFacility.calculatedDistance} km away` : 'Detect location'}
                  </span>
                </div>
              </div>

              {/* Services badges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
                  Available Services &amp; Resources:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFacility.services?.map((svc, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data source attribution */}
              <div className="text-[10px] text-ink-soft pt-1 border-t border-line/60 flex items-center justify-between">
                <span>Verified by: <strong>{selectedFacility.dataSource}</strong></span>
                <span className="font-semibold text-emerald-700">Official Civil Record</span>
              </div>

              {/* Action Buttons: Call & Directions */}
              <div className="flex items-center gap-2 pt-1">
                {selectedFacility.phone && (
                  <a
                    href={`tel:${selectedFacility.phone.replace(/\s+/g, '')}`}
                    className="btn-outline flex-1 text-xs py-2 flex items-center justify-center gap-1.5 font-bold"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand" />
                    <span>Call Facility</span>
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          )}

          {/* Scrollable list of other facilities */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider block">
              Other Nearby Facilities:
            </span>
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => handleSelectFacility(fac)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                  selectedFacility?.id === fac.id
                    ? 'bg-teal-50/70 border-brand'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <span className="font-bold text-ink block">{fac.name}</span>
                  <span className="text-[10px] text-ink-soft">{fac.district}, {fac.state}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-brand-dark block">{fac.type}</span>
                  {fac.calculatedDistance && (
                    <span className="text-[10px] font-bold text-slate-500">{fac.calculatedDistance} km</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
