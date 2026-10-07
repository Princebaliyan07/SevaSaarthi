import { useLanguage } from '../../context/LanguageContext';

const TILES = [
  {
    id: 'medical',
    title: 'Medical emergency',
    titleHi: 'चिकित्सा आपातकाल',
    subtitle: 'Ambulance 108',
    subtitleHi: 'एम्बुलेंस 108',
    icon: '🚑',
    gradient: 'from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600',
    number: '108',
  },
  {
    id: 'road',
    title: 'Road accident',
    titleHi: 'सड़क दुर्घटना',
    subtitle: 'Police & Trauma EMS',
    subtitleHi: 'पुलिस और एम्बुलेंस',
    icon: '🚗',
    gradient: 'from-rose-700 to-pink-800 hover:from-rose-600 hover:to-pink-700',
    number: '112',
  },
  {
    id: 'fire',
    title: 'Fire outbreak',
    titleHi: 'आग / अग्निकांड',
    subtitle: 'Fire tender 101',
    subtitleHi: 'अग्निशमन सेवा 101',
    icon: '🔥',
    gradient: 'from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600',
    number: '101',
  },
  {
    id: 'missing',
    title: 'Missing person',
    titleHi: 'लापता व्यक्ति',
    subtitle: 'Instant broadcast',
    subtitleHi: 'रिपोर्ट और खोज',
    icon: '🔍',
    gradient: 'from-teal-700 to-emerald-800 hover:from-teal-600 hover:to-emerald-700',
    number: '112',
  },
  {
    id: 'disaster',
    title: 'Disaster flood / storm',
    titleHi: 'आपदा बचाव',
    subtitle: 'NDRF / SDRF team',
    subtitleHi: 'बचाव, आश्रय, भोजन',
    icon: '🌊',
    gradient: 'from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600',
    number: '1078',
  },
  {
    id: 'crime',
    title: 'Crime or safety alert',
    titleHi: 'अपराध या सुरक्षा',
    subtitle: 'Police dispatch 112',
    subtitleHi: 'पुलिस 112',
    icon: '👮',
    gradient: 'from-indigo-700 to-violet-900 hover:from-indigo-600 hover:to-violet-800',
    number: '112',
  },
  {
    id: 'ambulance',
    title: 'Advanced life support',
    titleHi: 'एम्बुलेंस तत्काल',
    subtitle: 'Call 108 direct',
    subtitleHi: 'कॉल करें 108',
    icon: '🏥',
    gradient: 'from-red-800 to-rose-950 hover:from-red-700 hover:to-rose-900',
    number: '108',
  },
  {
    id: 'police',
    title: 'Police Rapid PCR',
    titleHi: 'पुलिस पीसीआर',
    subtitle: 'Call 112 emergency',
    subtitleHi: 'कॉल करें 112',
    icon: '🚓',
    gradient: 'from-blue-700 to-indigo-900 hover:from-blue-600 hover:to-indigo-800',
    number: '112',
  },
  {
    id: 'other',
    title: 'Other urgent hazard',
    titleHi: 'अन्य आपातकाल',
    subtitle: 'Civic rapid triage',
    subtitleHi: 'समस्या बताएं',
    icon: '⚡',
    gradient: 'from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800',
    number: '112',
  },
];

export default function EmergencyTileGrid({ onSelectTile }) {
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
      {TILES.map((tile) => {
        const title = hi ? tile.titleHi : tile.title;
        const subtitle = hi ? tile.subtitleHi : tile.subtitle;

        return (
          <button
            key={tile.id}
            type="button"
            onClick={() => onSelectTile?.(tile)}
            aria-label={`${title}. ${subtitle}`}
            className={`group relative flex min-h-[9.5rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${tile.gradient} p-4 text-left text-white shadow-lg shadow-slate-900/10 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:focus-visible:ring-white dark:focus-visible:ring-offset-slate-900`}
          >
            {/* Soft light from the top-right corner */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_55%)]"
            />

            {/* Big faded emoji watermark */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -right-2 rotate-12 select-none text-7xl opacity-20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none"
            >
              {tile.icon}
            </span>

            {/* Shine sweep on hover */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[300%] motion-reduce:hidden"
            />

            {/* Top row: icon + number */}
            <div className="relative flex items-start justify-between gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                <span aria-hidden="true">{tile.icon}</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-black tracking-wide backdrop-blur-sm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="currentColor"
                >
                  <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                </svg>
                {tile.number}
              </span>
            </div>

            {/* Bottom: title + subtitle + arrow */}
            <div className="relative mt-4 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <span className="block text-base font-black leading-tight drop-shadow-sm">{title}</span>
                <span className="mt-1 block text-xs font-medium text-white/80">{subtitle}</span>
              </div>
              <span
                aria-hidden="true"
                className="mb-0.5 shrink-0 -translate-x-1 text-lg font-bold opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
              >
                →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}