import { useEffect, useState, useCallback } from 'react';
import Badge from '../components/common/Badge';
import HospitalCard from '../components/healthcare/HospitalCard';
import JanAushadhiMatcher from '../components/healthcare/JanAushadhiMatcher';
import DoctorConsultModal from '../components/healthcare/DoctorConsultModal';
import EmergencyNearestHospital from '../components/healthcare/EmergencyNearestHospital';
import { getHospitals, getMedicines, getDoctors, getNearestEmergencyHospital, geocodeCity } from '../services/hospitalService';
import { useLanguage } from '../context/LanguageContext';

const TYPE_FILTERS = [
  { id: 'All', labelEn: 'All Hospitals', labelHi: 'सभी अस्पताल', icon: '🏥' },
  { id: 'Government', labelEn: 'Government', labelHi: 'सरकारी अस्पताल', icon: '🏛️' },
  { id: 'Private', labelEn: 'Private', labelHi: 'निजी अस्पताल', icon: '🏨' },
  { id: 'Trauma', labelEn: '24x7 Trauma', labelHi: '24x7 आपातकालीन/ट्रॉमा', icon: '🚨' },
];

const POPULAR_CITIES = [
  { name: 'Greater Noida', lat: 28.4744, lng: 77.5040 },
  { name: 'Noida', lat: 28.5355, lng: 77.3910 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  // { name: 'Prayagraj', lat: 25.4358, lng: 81.8463 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
];

export default function HealthcarePage() {
  const { lang, t } = useLanguage();

  // Location & Filter States
  const [userLocation, setUserLocation] = useState({
    lat: 28.4744,
    lng: 77.5040,
    name: 'Greater Noida, UP',
    isGps: false,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilterKeyword, setActiveFilterKeyword] = useState('');

  // Data States
  const [hospitals, setHospitals] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [nearestEmergency, setNearestEmergency] = useState(null);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [consultModal, setConsultModal] = useState({ isOpen: false, doctor: null, isVideo: false });
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  // Fetch Hospitals based on coordinates, type, and search
  const loadHospitals = useCallback(async (coords = userLocation, type = activeType, keyword = activeFilterKeyword) => {
    setLoadingHospitals(true);
    try {
      const params = {
        lat: coords.lat,
        lng: coords.lng,
        city: coords.name,
        type: type !== 'All' ? type.toLowerCase() : undefined,
        traumaOnly: type === 'Trauma' ? true : undefined,
        search: keyword.trim() || undefined,
        maxDistanceKm: 25,
      };

      const [hList, emergencyHosp] = await Promise.all([
        getHospitals(params),
        getNearestEmergencyHospital({ lat: coords.lat, lng: coords.lng }),
      ]);

      setHospitals(hList);
      setNearestEmergency(emergencyHosp || hList[0] || null);

      if (hList.length > 0) {
        setSelectedHospital((prev) => {
          if (!prev) return hList[0];
          const match = hList.find((h) => h.id === prev.id || h.hospitalId === prev.hospitalId);
          return match || hList[0];
        });
      }
      setLastUpdatedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error loading hospitals:', err);
    } finally {
      setLoadingHospitals(false);
    }
  }, [userLocation, activeType, activeFilterKeyword]);

  // Initial load for medicines and doctors
  useEffect(() => {
    async function loadAuxiliaryData() {
      try {
        const [mList, dList] = await Promise.all([
          getMedicines(),
          getDoctors(),
        ]);
        setMedicines(mList);
        setDoctors(dList);
      } catch (err) {
        console.error('Error loading aux healthcare data:', err);
      }
    }
    loadAuxiliaryData();
  }, []);

  // Trigger hospital load when location or filter changes
  useEffect(() => {
    loadHospitals(userLocation, activeType, activeFilterKeyword);
  }, [userLocation, activeType, activeFilterKeyword, loadHospitals]);

  // Handle GPS Location Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'hi' ? 'आपके ब्राउज़र में जीपीएस सपोर्ट नहीं है।' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedCity = `${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`;

        // Check if near Greater Noida / Noida
        if (Math.abs(latitude - 28.47) < 0.2 && Math.abs(longitude - 77.49) < 0.3) {
          detectedCity = 'Greater Noida (Your GPS)';
        } else if (Math.abs(latitude - 28.53) < 0.2 && Math.abs(longitude - 77.39) < 0.3) {
          detectedCity = 'Noida (Your GPS)';
        } else if (Math.abs(latitude - 28.61) < 0.3 && Math.abs(longitude - 77.20) < 0.3) {
          detectedCity = 'Delhi NCR (Your GPS)';
        } else if (Math.abs(latitude - 25.43) < 0.2 && Math.abs(longitude - 81.84) < 0.2) {
          detectedCity = 'Prayagraj (Your GPS)';
        }

        const newLoc = {
          lat: latitude,
          lng: longitude,
          name: detectedCity,
          isGps: true,
        };
        setUserLocation(newLoc);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert(
          lang === 'hi'
            ? 'लोकेशन प्राप्त नहीं हो सकी। ग्रेटर नोएडा क्षेत्र चुना गया है।'
            : 'Could not access precise location. Defaulting to Greater Noida region.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Unified Search Handler (City, Area, or Hospital Name)
  const handleUnifiedSearch = async (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setActiveFilterKeyword('');
      return;
    }

    setIsLocating(true);
    try {
      // 1. Check if the user entered a city or area (handles typos like varansi, gretaer noida, prayarag)
      const geocoded = await geocodeCity(query);
      if (geocoded && geocoded.lat && geocoded.lng) {
        setUserLocation({
          lat: geocoded.lat,
          lng: geocoded.lng,
          name: geocoded.name ? `${geocoded.name}, UP` : query,
          isGps: false,
        });
        setActiveFilterKeyword('');
        setSearchInput('');
      } else {
        // 2. Otherwise treat as a specific hospital name filter in current area
        setActiveFilterKeyword(query);
      }
    } catch (err) {
      console.error('Search error:', err);
      setActiveFilterKeyword(query);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="container-page py-8 space-y-10">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">
            <span className="gradient-title">
              {lang === 'hi' ? 'स्वास्थ्य एवं चिकित्सा सेवा केंद्र' : 'Healthcare & Hospital Hub'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'निकटतम सरकारी एवं निजी अस्पताल खोजें, लाइव बेड स्थिति देखें, और जन औषधि दवाइयों के मूल्यों की तुलना करें।'
              : 'Find verified Government & Private hospitals nearby, check live ICU/oxygen beds, and compare Jan Aushadhi generic medicine prices.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {lang === 'hi' ? 'लाइव अस्पताल रजिस्ट्री' : 'Live Hospital Registry'}
          </span>
          <button
            type="button"
            onClick={() => loadHospitals(userLocation, activeType, activeFilterKeyword)}
            className="btn-outline text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
            title="Refresh Hospital Data"
          >
            <span>🔄</span>
            <span>{lang === 'hi' ? 'रीफ्रेश' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. Unified Location & Search Section */}
      <section className="glass-card p-5 sm:p-6 space-y-4 shadow-sm border-teal-500/20">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Location Detection Button & Active Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{lang === 'hi' ? 'लोकेशन खोजी जा रही है...' : 'Detecting GPS...'}</span>
                </>
              ) : (
                <>
                  <span>📍</span>
                  <span>{lang === 'hi' ? 'मेरी लोकेशन खोजें (GPS)' : 'Detect My Location (GPS)'}</span>
                </>
              )}
            </button>

            <span className="text-xs font-black text-slate-800 dark:text-slate-200 bg-teal-50 dark:bg-slate-800 border border-teal-500/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
              <span>📌</span>
              <span>{userLocation.name}</span>
            </span>
          </div>

          {/* Unified Smart Search Bar */}
          <form onSubmit={handleUnifiedSearch} className="flex items-center gap-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  lang === 'hi'
                    ? 'शहर, क्षेत्र या अस्पताल खोजें (उदा. Greater Noida, Sharda, AIIMS, Lucknow)...'
                    : 'Search city, area, or hospital (e.g. Greater Noida, Sharda, AIIMS, Lucknow)...'
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setActiveFilterKeyword(''); }}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary text-xs py-2.5 px-4 font-bold shrink-0"
            >
              {lang === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </form>
        </div>

        {/* Quick Cities & Hospital Type Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          {/* Popular Cities */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              {lang === 'hi' ? 'त्वरित शहर:' : 'Quick Cities:'}
            </span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setUserLocation({ lat: c.lat, lng: c.lng, name: `${c.name}, UP`, isGps: false });
                  setSearchInput('');
                  setActiveFilterKeyword('');
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  userLocation.name.toLowerCase().includes(c.name.toLowerCase())
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Hospital Type Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveType(f.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeType === f.id
                    ? 'bg-brand text-white shadow-md shadow-brand/20 dark:bg-brand-light dark:text-slate-950'
                    : 'border border-slate-200 bg-white/90 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                <span>{f.icon}</span>
                <span>{lang === 'hi' ? f.labelHi : f.labelEn}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Primary Section: Nearby Hospitals (Govt & Private) List (Full Width) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🏥</span>
              <span>
                {lang === 'hi'
                  ? `${userLocation.name} में उपलब्ध अस्पताल एवं क्लीनिक (सरकारी व निजी)`
                  : `Hospitals & Clinics in ${userLocation.name} (Govt & Private)`}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'कुल अस्पताल:' : 'Total verified facilities:'}{' '}
              <span className="font-bold text-teal-600 dark:text-teal-400">{hospitals.length}</span> ·{' '}
              <span className="italic">
                {lang === 'hi' ? `केवल इस क्षेत्र के अस्पताल प्रदर्शित` : `Showing facilities strictly within this district/region`}
              </span>
            </p>
          </div>

          {activeFilterKeyword && (
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg dark:bg-teal-950/40 dark:text-teal-300 flex items-center gap-1.5">
              Filtering: "{activeFilterKeyword}"
              <button
                type="button"
                onClick={() => { setSearchInput(''); setActiveFilterKeyword(''); }}
                className="font-bold hover:text-rose-600"
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* Hospitals Cards Grid */}
        {loadingHospitals ? (
          <div className="glass-card py-16 text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-xs font-semibold text-slate-500">
              {lang === 'hi' ? 'अस्पताल लोड हो रहे हैं...' : 'Loading verified hospitals nearby...'}
            </p>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="glass-card py-12 text-center text-xs text-slate-500 space-y-2">
            <span className="text-2xl">🏥</span>
            <p>{lang === 'hi' ? 'इस श्रेणी या क्षेत्र में कोई अस्पताल नहीं मिला।' : 'No hospitals found for this filter or area.'}</p>
            <button
              type="button"
              onClick={() => { setActiveType('All'); setSearchInput(''); setActiveFilterKeyword(''); }}
              className="text-xs font-bold text-teal-600 hover:underline"
            >
              {lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map((hosp) => (
              <HospitalCard
                key={hosp.id || hosp.hospitalId}
                hospital={hosp}
                isSelected={selectedHospital?.id === hosp.id}
                onSelect={(h) => setSelectedHospital(h)}
              />
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 dark:text-slate-500 italic pt-1">
          ℹ️ {lang === 'hi' ? 'अस्पताल डेटा ओपनस्ट्रीटमैप लाइव एपीआई एवं राष्ट्रीय स्वास्थ्य रजिस्ट्री द्वारा सत्यापित है।' : 'Hospital data verified via OpenStreetMap Live API and National Health Registry.'}
        </p>
      </section>

      {/* 4. Emergency Section: Nearest Hospital & Live Bed Availability */}
      <EmergencyNearestHospital
        hospital={selectedHospital || nearestEmergency}
        userCoords={userLocation}
        onRefreshLocation={handleDetectLocation}
      />

      {/* 5. Lower Section: Jan Aushadhi Medicine Analysis & Verified Duty Doctors */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start pt-2">
        {/* Jan Aushadhi Generic vs Branded Price Matcher (7 cols) */}
        <div className="lg:col-span-7">
          <JanAushadhiMatcher medicines={medicines} />
        </div>

        {/* Verified Duty Doctors Directory (5 cols) */}
        <div className="glass-card p-6 space-y-5 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🩺</span>
                <span>{lang === 'hi' ? 'ड्यूटी पर सत्यापित डॉक्टर' : 'Verified Duty Doctors'}</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'ओपीडी एवं टेलीकंसल्टेशन उपलब्ध' : 'OPD & Teleconsultation Available'}
              </p>
            </div>
            <Badge type="verified" />
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 transition-all hover:border-brand/50 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        doc.status === 'online'
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {doc.status === 'online' ? t('badge.online') : t('badge.offline')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.specialty} · <span className="font-semibold text-teal-600 dark:text-teal-400">{doc.nextSlot}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    🏥 {doc.hospitalAffiliation}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setConsultModal({ isOpen: true, doctor: doc, isVideo: false })}
                    className="btn-outline text-xs py-1.5 px-3 font-bold"
                  >
                    {lang === 'hi' ? 'ओपीडी बुक करें' : 'Book OPD'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultModal({ isOpen: true, doctor: doc, isVideo: true })}
                    className="rounded-xl bg-civic px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-civic-dark transition-colors"
                  >
                    📹 {lang === 'hi' ? 'वीडियो' : 'Video'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teleconsultation & Appointment Modal */}
      <DoctorConsultModal
        isOpen={consultModal.isOpen}
        doctor={consultModal.doctor}
        isVideo={consultModal.isVideo}
        onClose={() => setConsultModal({ isOpen: false, doctor: null, isVideo: false })}
      />
    </div>
  );
}
