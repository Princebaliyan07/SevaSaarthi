import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import LiveSituationBoard from '../components/common/LiveSituationBoard';
import DisasterProtectionVideos from '../components/DisasterProtectionVideos';
import { downloadBilingualGuide, downloadAllHelplinesPdf } from '../utils/guideGenerator';
import { useLanguage } from '../context/LanguageContext';
import { DisasterSchemesSection } from '../components/common/DisasterSchemesSection';
import { EmergencyHelplineSection } from '../components/common/EmergencyHelplineSection';

const QUICK_ACTIONS = [
  { key: 'medical', label: 'Medical help', labelHi: 'चिकित्सा सहायता', icon: '🩺', to: '/healthcare', color: 'teal' },
  { key: 'emergency', label: 'Emergency SOS', labelHi: 'आपातकाल SOS', icon: '🚨', to: '/emergency', isSos: true, color: 'rose' },
  { key: 'disaster', label: 'Disaster help', labelHi: 'आपदा सहायता', icon: '🌊', to: '/disaster', color: 'amber' },
  { key: 'hospital', label: 'Find hospital', labelHi: 'अस्पताल खोजें', icon: '🏥', to: '/healthcare', color: 'emerald' },
  { key: 'medicine', label: 'Find medicine', labelHi: 'दवा खोजें', icon: '💊', to: '/healthcare', color: 'cyan' },
  { key: 'missing', label: 'Missing person', labelHi: 'लापता व्यक्ति', icon: '🔍', to: '/mela', color: 'indigo' },
];

const FIVE_SERVICES = [
  { key: 'health', name: 'Seva Health', nameHi: 'सेवा स्वास्थ्य', desc: 'Verified doctors, ICU bed availability & Jan Aushadhi generic medicines', to: '/healthcare', icon: '🏥', tag: 'Care' },
  { key: 'disaster', name: 'Disaster Saarthi', nameHi: 'आपदा सारथी', desc: 'Live GIS multi-hazard maps, flood tracking & emergency preparedness', to: '/disaster', icon: '🌪️', tag: 'GIS' },
  { key: 'emergency', name: 'Emergency 112 Hub', nameHi: 'आपातकालीन हब', desc: 'Instant 1-tap dispatch for Police, Fire, Ambulance & Voice SOS', to: '/emergency', icon: '🚨', tag: 'Rapid' },
  { key: 'mela', name: 'Mela Suraksha', nameHi: 'मेला सुरक्षा', desc: 'Kumbh crowd density heatmap, pontoon bridges & AI face-tag reunification', to: '/mela', icon: '🕉️', tag: 'Crowd' },
  { key: 'volunteers', name: 'Seva Volunteers', nameHi: 'सेवा स्वयंसेवक', desc: 'Grassroot relief teams, medicine drop pipelines & donation campaigns', to: '/volunteers', icon: '🤝', tag: 'Relief' },
];

const DOWNLOADS = [
  { key: 'first-aid', title: 'Emergency First Aid Handbook', titleHi: 'आपातकालीन प्राथमिक चिकित्सा पुस्तिका', size: 'Civic Guide · Bilingual PDF/HTML', icon: '🩹' },
  { key: 'flood-guide', title: 'Flood Preparedness & Evacuation Guide', titleHi: 'बाढ़ पूर्व तैयारी एवं निकासी गाइड', size: 'NDMA Standard · Bilingual PDF/HTML', icon: '🌊' },
  { key: 'heatwave-protocol', title: 'Heatwave & Sunstroke Safety Protocol', titleHi: 'लू एवं हीटस्ट्रोक सुरक्षा प्रोटोकॉल', size: 'Health Ministry · Bilingual PDF/HTML', icon: '☀️' },
  { key: 'kumbh-manual', title: 'Kumbh Mela Sangam Safety Manual', titleHi: 'कुंभ मेला संगम सुरक्षा नियमावली', size: 'Smart Administration · Bilingual PDF/HTML', icon: '📖' },
];

export default function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container-page py-10 space-y-14">

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-teal-500/10 via-white/80 to-transparent p-8 sm:p-12 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-transparent">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-light/20 blur-3xl dark:bg-brand/15" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-civic/15 blur-3xl dark:bg-indigo-900/20" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-800 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Official Citizen &amp; Emergency Response Platform
          </div>

          <h1 className="page-title leading-tight">
            <span className="gradient-title block">{t('home.heroTitle')}</span>
          </h1>

          <p className="text-base text-slate-600 sm:text-lg leading-relaxed dark:text-slate-300">
            {t('home.heroSubtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/healthcare" className="btn-primary text-sm font-bold px-6 py-3 shadow-lg shadow-teal-700/20">
              {t('home.ctaMedical')}
            </Link>
            <Link to="/emergency" className="btn-sos text-sm font-bold px-6 py-3 animate-sosPulse shadow-lg shadow-rose-600/30">
              {t('home.ctaEmergency')}
            </Link>
            <Link to="/disaster" className="btn rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-5 py-3 shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600">
              {t('home.ctaDisaster')}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/resources" className="font-semibold text-brand hover:underline dark:text-brand-light flex items-center gap-1">
              <span>{t('home.ctaResources')}</span>
              <span>→</span>
            </Link>
            <span className="opacity-40">|</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span>{t('home.labelsNote')}</span>
              <Badge type="verified" />
              <Badge type="official" />
              <Badge type="live" />
              <Badge type="demo" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Situation Board */}
      <section className="space-y-3">
        <LiveSituationBoard />
      </section>

      {/* Quick Action Grid */}
      <section className="space-y-4">
        <h2 className="section-title flex items-center gap-2">
          <span>⚡</span>
          <span>Quick Citizen Actions</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK_ACTIONS.map((qa) => (
            <Link
              key={qa.key}
              to={qa.to}
              className={`group glass-card flex flex-col justify-between p-5 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 ${
                qa.isSos
                  ? 'border-rose-300/80 hover:border-rose-500 hover:shadow-glowSos dark:border-rose-900/50'
                  : 'hover:border-brand dark:hover:border-brand-light'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100/80 text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300 dark:bg-slate-800">
                  {qa.icon}
                </span>
              </div>
              <div className="mt-4">
                <span className="block text-sm font-bold text-slate-900 group-hover:text-brand dark:text-white dark:group-hover:text-brand-light transition-colors">
                  {lang === 'hi' ? qa.labelHi : qa.label}
                </span>
                <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-brand dark:text-brand-light">
                  {t('home.open')} <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Government Schemes for Disaster Victims */}
      <DisasterSchemesSection lang={lang} />

      {/* Five Services Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="section-title">{t('home.fiveServicesTitle')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integrated multi-departmental emergency and civic architecture
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FIVE_SERVICES.map((s) => (
            <Link
              key={s.key}
              to={s.to}
              className="group glass-card flex flex-col justify-between p-5 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{s.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                    {s.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand dark:text-white dark:group-hover:text-brand-light transition-colors">
                  {lang === 'hi' ? s.nameHi : s.name}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-brand dark:text-brand-light">
                Explore module <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Knowledge & Resources Section */}
      <section className="glass-card p-6 sm:p-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('home.resourcesTitle')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('home.resourcesSubtitle')}
            </p>
          </div>
          <Link to="/resources" className="btn-outline text-xs font-bold">
            {t('home.viewAllResources')} →
          </Link>
        </div>

        <DisasterProtectionVideos />

        {/* Featured Downloads */}
        <div className="space-y-4">
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
                  {lang === 'hi' ? 'हिंदी + English गाइड, मुफ़्त' : 'Free guides in Hindi + English'}
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

      {/* All India Emergency Helplines — Comprehensive Section */}
      <EmergencyHelplineSection lang={lang} onDownloadPdf={downloadAllHelplinesPdf} />

    </div>
  );
}
