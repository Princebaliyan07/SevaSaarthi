import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/common/Badge';
import LiveSituationBoard from '../components/common/LiveSituationBoard';
import DisasterProtectionVideos from '../components/DisasterProtectionVideos';
import { downloadBilingualGuide } from '../utils/guideGenerator';
import { useLanguage } from '../context/LanguageContext';

const QUICK_ACTIONS = [
  { key: 'medical', label: 'Medical help', labelHi: 'चिकित्सा सहायता', icon: '🩺', to: '/healthcare', color: 'teal' },
  { key: 'emergency', label: 'Emergency SOS', labelHi: 'आपातकाल SOS', icon: '🚨', to: '/emergency', isSos: true, color: 'rose' },
  { key: 'disaster', label: 'Disaster help', labelHi: 'आपदा सहायता', icon: '🌊', to: '/disaster', color: 'amber' },
  { key: 'hospital', label: 'Find hospital', labelHi: 'अस्पताल खोजें', icon: '🏥', to: '/healthcare', color: 'emerald' },
  { key: 'medicine', label: 'Find medicine', labelHi: 'दवा खोजें', icon: '💊', to: '/healthcare', color: 'cyan' },
  { key: 'missing', label: 'Missing person', labelHi: 'लापता व्यक्ति', icon: '🔍', to: '/mela', color: 'indigo' },
];

const METRICS = [
  { label: 'Active alerts', labelHi: 'सक्रिय अलर्ट', count: '7', change: '+2 new', color: 'from-amber-500 to-orange-500' },
  { label: 'Incidents today', labelHi: 'आज की घटनाएं', count: '24', change: '85% resolved', color: 'from-rose-500 to-red-600' },
  { label: 'Relief centres', labelHi: 'राहत केंद्र', count: '312', change: 'Online', color: 'from-teal-500 to-emerald-600' },
  { label: 'Hospitals nearby', labelHi: 'आसपास के अस्पताल', count: '18', change: '24x7 Ready', color: 'from-indigo-500 to-blue-600' },
];

const LIVE_ALERTS = [
  {
    title: 'Heavy rainfall warning',
    titleHi: 'भारी वर्षा की चेतावनी',
    location: 'Uttar Pradesh (Prayagraj)',
    source: 'IMD Live Feed · 2 hrs ago',
    severity: 'high',
  },
  {
    title: 'Cyclone watch',
    titleHi: 'चक्रवात निगरानी',
    location: 'Bay of Bengal coastline',
    source: 'NDMA Radar · 3 hrs ago',
    severity: 'moderate',
  },
  {
    title: 'Heatwave advisory',
    titleHi: 'लू / भीषण गर्मी चेतावनी',
    location: 'Rajasthan & West MP',
    source: 'State Disaster Cell · 5 hrs ago',
    severity: 'high',
  },
  {
    title: 'Landslide risk zone',
    titleHi: 'भूस्खलन जोखिम क्षेत्र',
    location: 'Uttarakhand (Chamoli route)',
    source: 'Geological Survey · 6 hrs ago',
    severity: 'moderate',
  },
  {
    title: 'Mela crowd surge alert',
    titleHi: 'मेला भीड़ चेतावनी',
    location: 'Prayagraj, Sangam Ghat 3',
    source: 'Smart City Sensor · 10 min ago',
    severity: 'high',
  },
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

const HELPLINES = [
  { name: 'National Unified Emergency', nameHi: 'राष्ट्रीय आपातकालीन सेवा', num: '112', tag: '24x7 Toll Free' },
  { name: 'Ambulance Emergency', nameHi: 'एम्बुलेंस आपातकालीन', num: '108', tag: 'Medical' },
  { name: 'Fire & Rescue Service', nameHi: 'अग्निशमन एवं बचाव', num: '101', tag: 'Emergency' },
  { name: 'National Disaster Management', nameHi: 'राष्ट्रीय आपदा प्रबंधन (NDMA)', num: '1078', tag: 'Disaster' },
  { name: 'Women Helpline', nameHi: 'महिला सुरक्षा हेल्पलाइन', num: '1091', tag: 'Safety' },
  { name: 'Childline Helpline', nameHi: 'बाल सुरक्षा हेल्पलाइन', num: '1098', tag: 'Children' },
];

export default function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container-page py-10 space-y-14">
      {/* Hero Section with Modern Glowing Glass Effect */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-b from-teal-500/10 via-white/80 to-transparent p-8 sm:p-12 backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-transparent">
        {/* Subtle background glow orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-light/20 blur-3xl dark:bg-brand/15" />
        <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-civic/15 blur-3xl dark:bg-indigo-900/20" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-800 dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Official Citizen & Emergency Response Platform
          </div>

          <h1 className="page-title leading-tight">
            <span className="gradient-title block">
              {t('home.heroTitle')}
            </span>
          </h1>

          <p className="text-base text-slate-600 sm:text-lg leading-relaxed dark:text-slate-300">
            {t('home.heroSubtitle')}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/healthcare" className="btn-primary text-sm font-bold px-6 py-3 shadow-lg shadow-teal-700/20">
              {t('home.ctaMedical')}
            </Link>
            <Link to="/emergency" className="btn-sos text-sm font-bold px-6 py-3 animate-sosPulse shadow-lg shadow-rose-600/30">
              {t('home.ctaEmergency')}
            </Link>
            <Link
              to="/disaster"
              className="btn rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-5 py-3 shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600"
            >
              {t('home.ctaDisaster')}
            </Link>
          </div>

          {/* Verified Badges Legend */}
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

      {/* Live Situation Board (Visual Map & Hospital Ticker) */}
      <section className="space-y-3">
        <LiveSituationBoard />
      </section>

      {/* Quick Action Grid (6 oversized modern cards with custom hover glow) */}
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

      {/* 4 Modern Metric Counter Cards with Gradient Accents */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {METRICS.map((m, i) => (
          <div
            key={i}
            className="glass-card relative overflow-hidden p-5 flex flex-col justify-between"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.color}`} />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {lang === 'hi' ? m.labelHi : m.label}
                </span>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-400/10 px-2 py-0.5 rounded-full">
                  {m.change}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {m.count}
                </span>
                <Badge type="demo" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Live Alerts Across India List */}
      <section className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('home.liveAlertsTitle')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Real-time Feed
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {LIVE_ALERTS.map((alert, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-1 last:pb-1 gap-2 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'hi' ? alert.titleHi : alert.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-4.5">
                  {alert.location} · <span className="font-mono">{alert.source}</span>
                </p>
              </div>
              <div className="pl-4 sm:pl-0">
                <Badge type={alert.severity}>
                  {alert.severity === 'high' ? t('badge.high') : t('badge.moderate')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Five Services, One Assistant Cards */}
      <section className="space-y-6">
        <div>
          <h2 className="section-title">
            {t('home.fiveServicesTitle')}
          </h2>
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

        {/* Disaster Protection Video Guides with Navigation Tabs (Replaced Category Pills) */}
        <DisasterProtectionVideos />

        {/* Featured Downloads & Important Helplines Two Columns */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 pt-2">
          {/* Featured downloads */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📥</span>
              <span>{t('home.featuredDownloads')}</span>
            </h3>
            <div className="space-y-3">
              {DOWNLOADS.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-sm transition-all hover:border-brand/50 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{d.icon}</span>
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                        {lang === 'hi' ? d.titleHi : d.title}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">{d.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadBilingualGuide(d.key)}
                    className="btn-outline text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 hover:bg-brand hover:text-white transition-colors"
                    title={`Download ${d.title} (Bilingual Hindi + English)`}
                  >
                    <span>📥</span>
                    <span>{t('home.download')}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Important Helplines */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📞</span>
              <span>{t('home.importantHelplines')}</span>
            </h3>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-5 py-1 backdrop-blur-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/80">
              {HELPLINES.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">
                      {lang === 'hi' ? h.nameHi : h.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {h.tag}
                    </span>
                  </div>
                  <a
                    href={`tel:${h.num}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 px-3 py-1 font-mono text-sm font-black text-rose-600 transition-colors hover:bg-rose-500 hover:text-white dark:bg-rose-500/20 dark:text-rose-400"
                  >
                    <span>📞</span>
                    <span>{h.num}</span>
                  </a>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              {t('home.verifyNumbersNote')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
