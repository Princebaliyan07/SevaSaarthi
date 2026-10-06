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

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
      {TILES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelectTile?.(t)}
          className={`group relative flex h-36 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${t.gradient} p-4.5 text-left text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.97]`}
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl transition-transform duration-300 group-hover:scale-125">
              {t.icon}
            </span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
              {t.number}
            </span>
          </div>
          <div>
            <span className="block text-base font-black leading-tight drop-shadow-sm">
              {lang === 'hi' ? t.titleHi : t.title}
            </span>
            <span className="mt-1 block text-xs font-medium text-white/80">
              {lang === 'hi' ? t.subtitleHi : t.subtitle}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
