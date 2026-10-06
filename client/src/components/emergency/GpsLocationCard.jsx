import { useEmergency } from '../../context/EmergencyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function GpsLocationCard() {
  const { lang, t } = useLanguage();
  const { geo } = useEmergency();

  const handleShare = () => {
    geo.request();
  };

  const handleDirections = () => {
    window.open('https://www.google.com/maps/search/District+Government+Hospital+Civil+Lines+Prayagraj', '_blank');
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📍</span>
          <span>{t('emergency.yourLocation')}</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {t('emergency.permissionNote')}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleShare}
          disabled={geo.status === 'loading'}
          className="btn-outline w-full justify-center text-xs font-bold py-3 shadow-xs"
        >
          {geo.status === 'loading' ? (
            lang === 'hi' ? '📡 स्थान प्राप्त कर रहे हैं...' : '📡 Acquiring Live GPS Satellite...'
          ) : geo.status === 'granted' ? (
            lang === 'hi' ? '✓ स्थान साझा किया गया (Active)' : '✓ GPS Location Active'
          ) : (
            `📍 ${t('emergency.shareLocation')}`
          )}
        </button>

        {geo.coords && (
          <p className="mt-2.5 text-center font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
            Lat: {geo.coords.lat.toFixed(4)}, Lng: {geo.coords.lng.toFixed(4)} (GPS Precision Active)
          </p>
        )}
        {geo.error && (
          <p className="mt-2 text-center text-xs text-rose-500 font-bold">{geo.error}</p>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('emergency.nearestHospital')}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              District Hospital · 2.4 km
            </span>
          </div>
          <button
            type="button"
            onClick={handleDirections}
            className="rounded-xl border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700"
          >
            🧭 {lang === 'hi' ? 'दिशा-निर्देश' : 'Directions'}
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('emergency.nearestShelter')}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Community Relief Hall · 1.1 km
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert('Demo shelter rescue request transmitted to Prayagraj Control Hub.')}
            className="rounded-xl border border-slate-300 bg-white/90 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-slate-700"
          >
            🆘 {t('emergency.requestHelp')}
          </button>
        </div>
      </div>
    </div>
  );
}
