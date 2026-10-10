import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function EmergencyNearestHospital({ hospital, userCoords, onRefreshLocation }) {
  const { lang, t } = useLanguage();

  if (!hospital) {
    return (
      <div className="glass-card p-6 text-center space-y-3 border-rose-500/30">
        <span className="text-3xl">🚨</span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {lang === 'hi' ? 'निकटतम आपातकालीन अस्पताल खोज रहे हैं...' : 'Finding Nearest Emergency Hospital...'}
        </h3>
        <p className="text-xs text-slate-500">
          {lang === 'hi'
            ? 'कृपया लोकेशन अनुमति दें या ऊपर से अपना शहर चुनें।'
            : 'Please allow location permission or select your city above.'}
        </p>
      </div>
    );
  }

  const handleDirections = () => {
    const url = hospital.googleMapsUrl || (hospital.lat && hospital.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    if (hospital.phone) {
      window.location.href = `tel:${hospital.phone.replace(/[^0-9+]/g, '')}`;
    }
  };

  return (
    <section className="glass-card overflow-hidden p-6 sm:p-8 space-y-6 border-2 border-rose-500/50 shadow-xl shadow-rose-500/5 dark:border-rose-500/40">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-200/80 pb-5 dark:border-rose-950/60">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
              {lang === 'hi' ? '🚨 निकटतम आपातकालीन अस्पताल' : '🚨 Nearest Emergency Hospital'}
            </span>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-black text-amber-800 dark:text-amber-300 border border-amber-500/40">
              🔭 {lang === 'hi' ? 'भविष्य की योजना / डेमो डेटा' : 'Future Scope / Demo Data'}
            </span>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-800/40">
              ⚠️ {lang === 'hi' ? 'बेड व ऑक्सीजन डेटा वास्तविक नहीं है' : 'Bed & Oxygen Data Not Real'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {hospital.name}
          </h2>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
            <span>📍 {hospital.address || `${hospital.name}, ${hospital.city || ''}`}</span>
            <span>·</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {hospital.distanceKm} km {lang === 'hi' ? 'की दूरी पर' : 'away from you'}
            </span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">🕒 {hospital.hours || 'Open 24x7'}</span>
          </p>
        </div>

        {/* Emergency Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {hospital.phone && (
            <button
              type="button"
              onClick={handleCall}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-rose-600/30 hover:from-red-500 hover:to-rose-600 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>📞</span>
              <span>{lang === 'hi' ? 'तत्काल कॉल (डेमो नंबर)' : 'Emergency Call (Demo Number)'} ({hospital.phone})</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDirections}
            className="rounded-2xl border-2 border-teal-600 bg-white/90 px-4 py-3 text-xs sm:text-sm font-black text-teal-800 shadow-md hover:bg-teal-50 dark:bg-slate-900 dark:text-teal-300 dark:border-teal-500 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>🧭</span>
            <span>{lang === 'hi' ? 'गूगल मैप्स पर रास्ता देखें (रियल)' : 'Get Directions (Real Maps)'}</span>
          </button>
        </div>
      </div>

      {/* Future Scope Disclaimer Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-amber-300/80 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-950 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-base shrink-0">⚠️</span>
          <div>
            <span className="font-black uppercase tracking-wider text-[10px] bg-amber-200/80 dark:bg-amber-800/60 px-2 py-0.5 rounded-md mr-2">
              Future Scope / Prototype Demo
            </span>
            <span className="font-semibold">
              {lang === 'hi'
                ? 'अस्पताल का नाम व गूगल मैप्स दिशा-निर्देश वास्तविक हैं। फोन/कॉल नंबर और बेड व ऑक्सीजन डेटा प्रोटोटाइप डेमो है (वास्तविक नहीं)।'
                : 'Hospital names and Google Maps directions are real. Hospital phone/call numbers & live bed telemetry are demo data (Not real).'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-300/40">
          ✅ {lang === 'hi' ? 'अस्पताल व मैप्स वास्तविक · फोन नंबर डेमो' : 'Hospital & Directions Real · Call Number is Demo'}
        </span>
      </div>

      {/* 4 Metric Cards: ICU Beds, Oxygen Beds, Doctors on Duty, Trauma */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* ICU Beds */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            {lang === 'hi' ? 'आईसीयू बेड (डेमो डेटा)' : 'Available ICU Beds (Demo)'}
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {hospital.icuBedsAvailable ?? 8}
            </span>
            <span className="text-xs text-slate-500">
              / {hospital.totalBeds ?? 350} {lang === 'hi' ? 'कुल' : 'total'}
            </span>
          </div>
        </div>

        {/* Oxygen Beds */}
        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/60 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            {lang === 'hi' ? 'ऑक्सीजन बेड (डेमो डेटा)' : 'Oxygen Beds (Demo)'}
          </span>
          <div className="mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {hospital.oxygenBedsAvailable ?? 45}
            </span>
          </div>
        </div>

        {/* Doctors on Duty */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            {lang === 'hi' ? 'ड्यूटी पर डॉक्टर' : 'Doctors on Duty'}
          </span>
          <div className="mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {hospital.doctorsOnDuty ?? 12}
            </span>
          </div>
        </div>

        {/* Trauma Center Status */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            {lang === 'hi' ? 'ट्रॉमा सेंटर' : 'Trauma Center'}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
              {hospital.traumaCenterActive !== false
                ? lang === 'hi' ? 'सक्रिय 24x7' : 'Active 24x7'
                : lang === 'hi' ? 'स्टैंडबाय' : 'Standby'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
