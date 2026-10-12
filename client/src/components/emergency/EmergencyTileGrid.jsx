import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const TILES = [
  // ─── PRIORITY 1: AVAILABLE ON SEVASAARTHI (Live Navigation) ───────────────
  {
    id: 'first-responder',
    type: 'live',
    to: '/healthcare#first-responder-network',
    title: 'Instant First Responder',
    titleHi: 'इंस्टेंट फर्स्ट रिस्पांडर',
    subtitle: 'Uber for First Aid · 2–3 Min',
    subtitleHi: '2-3 मिनट में प्राथमिक उपचार',
    icon: '⚡',
    gradient: 'from-teal-600 via-emerald-600 to-teal-800 hover:from-teal-500 hover:to-emerald-700',
    number: 'Live',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },
  {
    id: 'missing',
    type: 'live',
    to: '/mela#mela-missing-persons',
    title: 'Missing person desk',
    titleHi: 'लापता व्यक्ति डेस्क',
    subtitle: 'AI Photo Match & Live Desk',
    subtitleHi: 'फोटो मिलान व तुरंत रिपोर्ट',
    icon: '🔍',
    gradient: 'from-emerald-700 via-teal-800 to-cyan-900 hover:from-emerald-600 hover:to-teal-700',
    number: 'Live',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },
  {
    id: 'disaster',
    type: 'live',
    to: '/disaster#situation-radar',
    title: 'Disaster Radar & Floods',
    titleHi: 'आपदा एवं बाढ़ रडार',
    subtitle: 'GIS Telemetry & Guides',
    subtitleHi: 'उपग्रह रडार एवं बचाव गाइड',
    icon: '🌊',
    gradient: 'from-blue-700 via-indigo-800 to-cyan-900 hover:from-blue-600 hover:to-indigo-700',
    number: '1078',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },
  {
    id: 'medical',
    type: 'live',
    to: '/healthcare#hospitals-list',
    title: 'Find Hospitals & Beds',
    titleHi: 'निकटतम अस्पताल व बेड',
    subtitle: 'Government & Private ICU',
    subtitleHi: 'सरकारी एवं निजी ट्रॉमा सेंटर',
    icon: '🏥',
    gradient: 'from-rose-700 via-red-700 to-rose-900 hover:from-rose-600 hover:to-red-800',
    number: '108',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },
  {
    id: 'volunteers',
    type: 'live',
    to: '/volunteers#volunteer-teams',
    title: 'Disaster Volunteer Grid',
    titleHi: 'स्वयंसेवक राहत दल',
    subtitle: 'Nearby Squads & Aid Supply',
    subtitleHi: 'स्थानीय बचाव दल व राहत आपूर्ति',
    icon: '🤝',
    gradient: 'from-teal-700 via-slate-800 to-emerald-900 hover:from-teal-600 hover:to-emerald-800',
    number: 'Live',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },
  {
    id: 'ai-saarthi',
    type: 'live',
    to: '/ai-saarthi',
    title: 'AI Saarthi Emergency Chat',
    titleHi: 'एआई सारथी आपातकालीन चैट',
    subtitle: 'Multilingual Triage & Help',
    subtitleHi: 'हिंदी, English एवं हिंग्लिश सहायता',
    icon: '🤖',
    gradient: 'from-cyan-700 via-teal-800 to-slate-900 hover:from-cyan-600 hover:to-teal-700',
    number: '24x7',
    badge: 'On Platform',
    badgeHi: 'उपलब्ध',
  },

  // ─── PRIORITY 2: COMING SOON (With Instant Official Emergency Call Modal) ─
  {
    id: 'road',
    type: 'coming_soon',
    title: 'Road accident dispatch',
    titleHi: 'सड़क दुर्घटना सेवा',
    subtitle: 'Police & Trauma EMS',
    subtitleHi: 'पुलिस और एम्बुलेंस सहायता',
    icon: '🚗',
    gradient: 'from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800',
    number: '112',
    phone: '112',
    desc: 'Digital Road Crash reporting & telemetry dispatch is currently under integration with state traffic police.',
    descHi: 'डिजिटल सड़क दुर्घटना ट्रैकिंग व टेलीमेट्री डिस्पैच वर्तमान में राज्य ट्रैफिक पुलिस सिस्टम के साथ विकसित किया जा रहा है।',
  },
  {
    id: 'fire',
    type: 'coming_soon',
    title: 'Fire outbreak response',
    titleHi: 'अग्निकांड आपात सेवा',
    subtitle: 'Fire tender dispatch 101',
    subtitleHi: 'अग्निशमन दल कॉल 101',
    icon: '🔥',
    gradient: 'from-amber-700 via-orange-800 to-red-900 hover:from-amber-600 hover:to-orange-700',
    number: '101',
    phone: '101',
    desc: 'Automated GPS Fire Station telemetry integration is in development for smart municipal brigades.',
    descHi: 'स्मार्ट म्युनिसिपल फायर ब्रिगेड के लिए स्वचालित जीपीएस अलर्ट सिस्टम पर कार्य प्रगति पर है।',
  },
  {
    id: 'crime',
    type: 'coming_soon',
    title: 'Crime & safety alert',
    titleHi: 'अपराध व सुरक्षा अलर्ट',
    subtitle: 'Police dispatch 112',
    subtitleHi: 'पुलिस डिस्पैच 112',
    icon: '👮',
    gradient: 'from-indigo-800 via-slate-800 to-violet-950 hover:from-indigo-700 hover:to-violet-900',
    number: '112',
    phone: '112',
    desc: 'Citizen safety incident broadcasting is integrating with 112 ERSS police emergency command centres.',
    descHi: 'नागरिक सुरक्षा और तत्काल आपात अलर्ट सीधे 112 ERSS पुलिस कमांड सेंटर से जोड़े जा रहे हैं।',
  },
  {
    id: 'police',
    type: 'coming_soon',
    title: 'Police Rapid PCR',
    titleHi: 'पुलिस पीसीआर वैन',
    subtitle: 'Highway & City Patrol 112',
    subtitleHi: 'हाईवे व शहर पेट्रोल 112',
    icon: '🚓',
    gradient: 'from-blue-800 via-indigo-900 to-slate-950 hover:from-blue-700 hover:to-indigo-800',
    number: '112',
    phone: '112',
    desc: 'Real-time GPS tracking for Nearest PCR Van arrival is undergoing trials in select pilot zones.',
    descHi: 'निकटतम पीसीआर वैन के लाइव जीपीएस अराइवल ट्रैकिंग का ट्रायल पायलट ज़ोन में जारी है।',
  },
  {
    id: 'ambulance',
    type: 'coming_soon',
    title: 'Advanced Life Support (ALS)',
    titleHi: 'एडवांस्ड लाइफ सपोर्ट एम्बुलेंस',
    subtitle: 'Direct ALS booking 108',
    subtitleHi: 'कॉल करें 108 सीधे',
    icon: '🚑',
    gradient: 'from-rose-800 to-slate-900 hover:from-rose-700 hover:to-slate-800',
    number: '108',
    phone: '108',
    desc: 'Live Ventillator-equipped ALS Ambulance tracker is being synchronized with state medical fleet databases.',
    descHi: 'वेंटिलेटर युक्त ALS एम्बुलेंस की लाइव फ्लीट ट्रैकिंग राज्य स्वास्थ्य डेटाबेस के साथ जोड़ी जा रही है।',
  },
  {
    id: 'other',
    type: 'coming_soon',
    title: 'Civic urgent hazard',
    titleHi: 'नागरिक आपदा / खतरा',
    subtitle: 'Disaster & Civil Triage 112',
    subtitleHi: 'समस्या निवारण 112',
    icon: '⚡',
    gradient: 'from-slate-800 to-zinc-950 hover:from-slate-700 hover:to-zinc-900',
    number: '112',
    phone: '112',
    desc: 'Direct civic disaster escalation and electricity / gas line leakage hotlines are coming soon.',
    descHi: 'बिजली/गैस लाइन और नागरिक खतरों की सीधी एस्केलेशन हेल्पलाइन जल्द ही सक्रिय होगी।',
  },
];

export default function EmergencyTileGrid({ onSelectTile }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const hi = lang === 'hi';

  const [activeModalTile, setActiveModalTile] = useState(null);

  const handleTileClick = (tile) => {
    if (tile.type === 'live' && tile.to) {
      navigate(tile.to);
      return;
    }

    if (tile.type === 'coming_soon') {
      setActiveModalTile(tile);
      return;
    }

    onSelectTile?.(tile);
  };

  return (
    <div className="space-y-4">
      {/* Category separation header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {hi ? 'प्लेटफ़ॉर्म त्वरित सेवाएं (लाइव लिंक)' : 'Platform Quick Access (Live Direct Links)'}
          </h2>
        </div>
        <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-500/20">
          {hi ? 'प्राथमिकता: सक्रिय सेवाएं' : 'Priority 1: Active Services'}
        </span>
      </div>

      {/* 12-Card Grid */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
        {TILES.map((tile) => {
          const title = hi ? tile.titleHi : tile.title;
          const subtitle = hi ? tile.subtitleHi : tile.subtitle;
          const isLive = tile.type === 'live';

          return (
            <button
              key={tile.id}
              type="button"
              onClick={() => handleTileClick(tile)}
              aria-label={`${title}. ${subtitle}`}
              className={`group relative flex min-h-[9.8rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${tile.gradient} p-4 text-left text-white shadow-lg shadow-slate-900/10 ring-1 ${
                isLive ? 'ring-teal-400/40 ring-2' : 'ring-white/10'
              } transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.97]`}
            >
              {/* Soft light from the top-right corner */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_55%)]"
              />

              {/* Big faded emoji watermark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-4 -right-2 rotate-12 select-none text-7xl opacity-20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
              >
                {tile.icon}
              </span>

              {/* Shine sweep on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]"
              />

              {/* Top row: icon + badge / number */}
              <div className="relative flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <span aria-hidden="true">{tile.icon}</span>
                </span>
                <div className="flex flex-col items-end gap-1">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      {hi ? tile.badgeHi : tile.badge}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-xs">
                      <span>⏳</span>
                      {hi ? 'शीघ्र आ रहा' : 'Coming Soon'}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-black tracking-wide backdrop-blur-sm">
                    {tile.number}
                  </span>
                </div>
              </div>

              {/* Bottom: title + subtitle + indicator */}
              <div className="relative mt-4 flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <span className="block text-sm sm:text-base font-black leading-tight drop-shadow-sm line-clamp-2">
                    {title}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-white/85 line-clamp-1">
                    {subtitle}
                  </span>
                </div>
                <span
                  aria-hidden="true"
                  className="mb-0.5 shrink-0 rounded-full bg-white/20 p-1 text-xs font-black transition-all duration-300 group-hover:bg-white group-hover:text-slate-900"
                >
                  {isLive ? '↗' : 'ℹ'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── COMING SOON + EMERGENCY CALL CARD MODAL ───────────────────────── */}
      {activeModalTile && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalTile(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalTile(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            {/* Header with Icon and Badge */}
            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-3xl border border-amber-500/30">
                {activeModalTile.icon}
              </span>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 text-xs font-extrabold border border-amber-500/30">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  {hi ? 'कार्य प्रगति पर है · Coming Soon' : 'Feature Under Development · Coming Soon'}
                </span>
                <h3 className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                  {hi ? activeModalTile.titleHi : activeModalTile.title}
                </h3>
              </div>
            </div>

            {/* Explanation Note */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              {hi ? activeModalTile.descHi : activeModalTile.desc}
            </p>

            {/* Emergency Calling Action Card */}
            <div className="rounded-2xl border border-rose-300/80 dark:border-rose-800/80 bg-gradient-to-br from-rose-50 to-red-100/50 dark:from-rose-950/40 dark:to-red-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                    {hi ? 'आपातकालीन स्थिति में तुरंत कॉल करें:' : 'For Immediate Emergency Assistance:'}
                  </p>
                  <p className="text-xs text-rose-600/90 dark:text-rose-300/90">
                    {hi ? `हेल्पलाइन नंबर: ${activeModalTile.phone}` : `Official Emergency Helpline: ${activeModalTile.phone}`}
                  </p>
                </div>
                <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">
                  {activeModalTile.phone}
                </span>
              </div>

              <a
                href={`tel:${activeModalTile.phone}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 py-3 px-4 text-sm font-black text-white shadow-lg shadow-rose-600/30 hover:from-red-500 hover:to-rose-600 transition-all active:scale-95"
              >
                <span>📞</span>
                <span>
                  {hi
                    ? `अभी ${activeModalTile.phone} पर कॉल करें`
                    : `Call ${activeModalTile.phone} Directly Now`}
                </span>
              </a>
            </div>

            {/* Close footer */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setActiveModalTile(null)}
                className="btn-outline text-xs px-4 py-2 font-bold"
              >
                {hi ? 'वापस जाएं' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}