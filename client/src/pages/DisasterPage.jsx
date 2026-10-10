import { Link } from 'react-router-dom';
import LiveSituationBoard from '../components/common/LiveSituationBoard';
import DisasterProtectionVideos from '../components/DisasterProtectionVideos';
import { DisasterSchemesSection } from '../components/common/DisasterSchemesSection';
import { downloadBilingualGuide } from '../utils/guideGenerator';
import { useLanguage } from '../context/LanguageContext';

const DOWNLOADS = [
  { key: 'first-aid', title: 'Emergency First Aid Handbook', titleHi: 'आपातकालीन प्राथमिक चिकित्सा पुस्तिका', size: 'Civic Guide · Bilingual PDF/HTML', icon: '🩹' },
  { key: 'flood-guide', title: 'Flood Preparedness & Evacuation Guide', titleHi: 'बाढ़ पूर्व तैयारी एवं निकासी गाइड', size: 'NDMA Standard · Bilingual PDF/HTML', icon: '🌊' },
  { key: 'heatwave-protocol', title: 'Heatwave & Sunstroke Safety Protocol', titleHi: 'लू एवं हीटस्ट्रोक सुरक्षा प्रोटोकॉल', size: 'Health Ministry · Bilingual PDF/HTML', icon: '☀️' },
  { key: 'kumbh-manual', title: 'Kumbh Mela Sangam Safety Manual', titleHi: 'कुंभ मेला संगम सुरक्षा नियमावली', size: 'Smart Administration · Bilingual PDF/HTML', icon: '📖' },
];

export default function DisasterPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="container-page py-6 sm:py-8 space-y-12">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">
            <span className="gradient-title">
              {lang === 'hi' ? 'आपदा सारथी — लाइव निगरानी एवं सुरक्षा केंद्र' : 'Disaster Saarthi — Live Radar & Relief Hub'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            {lang === 'hi'
              ? 'लाइव GIS एवं IMD स्थिति रडार, प्रमाणित आपदा सुरक्षा मार्गदर्शिका और प्राकृतिक आपदा पीड़ितों के लिए सरकारी सहायता योजनाएं।'
              : 'All-India live GIS & IMD telemetry, verified disaster survival guides, and official Government relief schemes for disaster victims.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            {lang === 'hi' ? 'लाइव उपग्रह टेलीमेट्री' : 'Live Satellite Telemetry'}
          </span>
        </div>
      </div>

      {/* 2. 🛰️ All-India Live GIS & IMD Situation Radar (First Photo) */}
      <section id="situation-radar" className="scroll-mt-24">
        <LiveSituationBoard />
      </section>

      {/* 3. Knowledge and Resources Section (Second Photo) */}
      <section id="knowledge-resources" className="glass-card p-6 sm:p-8 space-y-8 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🛡️</span>
              <span>{t('home.resourcesTitle')}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('home.resourcesSubtitle')}
            </p>
          </div>
          <Link to="/resources" className="btn-outline text-xs font-bold">
            {t('home.viewAllResources')} →
          </Link>
        </div>

        {/* Video Protection Guides with interactive player and survival steps */}
        <DisasterProtectionVideos />

        {/* Featured Bilingual Downloads */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-indigo-600 text-lg text-white shadow-lg shadow-brand/30">
                <span>📥</span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                  {t('home.featuredDownloads')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'हिंदी + English गाइड, मुफ़्त डाउनलोड' : 'Free bilingual guides in Hindi + English'}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {DOWNLOADS.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DOWNLOADS.map((d, i) => (
              <div
                key={d.key || i}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60"
              >
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-brand to-indigo-500 transition-transform duration-300 group-hover:scale-y-100" />
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-2xl ring-1 ring-slate-200/80 dark:from-slate-800 dark:to-slate-900 dark:ring-slate-700">
                  <span>{d.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'hi' ? d.titleHi : d.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    {d.size && (
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {d.size}
                      </span>
                    )}
                    <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
                      हिंदी + EN
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadBilingualGuide(d.key)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all hover:bg-brand active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-brand dark:hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m0 0-5-5m5 5 5-5M5 20h14" />
                  </svg>
                  <span className="hidden sm:inline">{t('home.download')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Government Schemes for Natural Disaster Victims */}
      <section id="disaster-schemes" className="scroll-mt-24">
        <DisasterSchemesSection lang={lang} />
      </section>
    </div>
  );
}
