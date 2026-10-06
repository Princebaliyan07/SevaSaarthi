import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function HospitalCard({ hospital, isSelected, onSelect }) {
  const { lang, t } = useLanguage();

  const handleDirections = (e) => {
    e.stopPropagation();
    const url = hospital.googleMapsUrl || (hospital.lat && hospital.lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (hospital.phone) {
      window.location.href = `tel:${hospital.phone.replace(/[^0-9+]/g, '')}`;
    }
  };

  const isGovt = (hospital.type || '').toLowerCase() === 'government' ||
    (hospital.name || '').toLowerCase().includes('government') ||
    (hospital.name || '').toLowerCase().includes('district') ||
    (hospital.name || '').toLowerCase().includes('govt');

  return (
    <div
      onClick={() => onSelect?.(hospital)}
      className={`group cursor-pointer rounded-2xl border p-4.5 transition-all duration-200 ${
        isSelected
          ? 'border-brand bg-teal-500/10 shadow-md ring-2 ring-brand/40 dark:bg-teal-500/15 dark:border-teal-400'
          : 'border-slate-200/80 bg-white/80 hover:border-brand/50 hover:bg-slate-50/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-800/80'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand dark:text-white dark:group-hover:text-brand-light transition-colors">
              {hospital.name}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                isGovt
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
              }`}
            >
              {isGovt ? (lang === 'hi' ? '🏛️ सरकारी' : '🏛️ Government') : (lang === 'hi' ? '🏨 निजी' : '🏨 Private')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
            <span className="font-semibold text-teal-600 dark:text-teal-400">{hospital.category || 'General'}</span>
            <span>·</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">📍 {hospital.distanceKm ?? '2.5'} km</span>
            <span>·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">🕒 {hospital.hours || 'Open 24x7'}</span>
            {(hospital.district || hospital.city) && (
              <>
                <span>·</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  🏛️ {hospital.city || hospital.district} {hospital.district && hospital.city !== hospital.district ? `(${hospital.district})` : ''}
                </span>
              </>
            )}
          </p>

          {/* Live Bed Count Indicators */}
          {(hospital.icuBedsAvailable !== undefined || hospital.oxygenBedsAvailable !== undefined) && (
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
              {/* {hospital.icuBedsAvailable !== undefined && (
                <span className="font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/40">
                  🛏️ {hospital.icuBedsAvailable} {lang === 'hi' ? 'आईसीयू बेड' : 'ICU Beds'}
                </span>
              )}
              {hospital.oxygenBedsAvailable !== undefined && (
                <span className="font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-900/40">
                  💨 {hospital.oxygenBedsAvailable} {lang === 'hi' ? 'ऑक्सीजन' : 'O₂ Beds'}
                </span>
              )} */}
              {hospital.traumaCenterActive && (
                <span className="font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40">
                  🚨 {lang === 'hi' ? 'ट्रॉमा सक्रिय' : 'Trauma Active'}
                </span>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {hospital.address || `${hospital.name}, ${hospital.city || ''}, Uttar Pradesh`}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0">
          <Badge type={hospital.badge || (isGovt ? 'official' : 'verified')} />

          <div className="flex items-center gap-2">
            {hospital.phone && (
              <button
                type="button"
                onClick={handleCall}
                title={`Call ${hospital.phone}`}
                className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300 transition-all"
              >
                📞 {lang === 'hi' ? 'कॉल' : 'Call'}
              </button>
            )}

            <button
              type="button"
              onClick={handleDirections}
              className="rounded-xl border border-slate-300/80 bg-white/90 px-3 py-1 text-xs font-bold text-teal-700 shadow-xs hover:border-brand hover:bg-teal-500/10 hover:text-teal-900 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700"
            >
              🧭 {lang === 'hi' ? 'रास्ता देखें' : t('health.directions')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
