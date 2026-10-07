import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DisasterProtectionVideos from '../components/DisasterProtectionVideos';
import { downloadBilingualGuide } from '../utils/guideGenerator';

const DOWNLOADS = [
  {
    key: 'first-aid',
    title: 'Emergency First Aid Handbook',
    titleHi: 'आपातकालीन प्राथमिक चिकित्सा पुस्तिका',
    size: 'Civic Guide · Bilingual PDF/HTML',
  },
  {
    key: 'flood-guide',
    title: 'Flood Preparedness & Evacuation Guide',
    titleHi: 'बाढ़ पूर्व तैयारी एवं निकासी गाइड',
    size: 'NDMA Standard · Bilingual PDF/HTML',
  },
  {
    key: 'heatwave-protocol',
    title: 'Heatwave & Sunstroke Safety Protocol',
    titleHi: 'लू एवं हीटस्ट्रोक सुरक्षा प्रोटोकॉल',
    size: 'Health Ministry · Bilingual PDF/HTML',
  },
  {
    key: 'kumbh-manual',
    title: 'Kumbh Mela Sangam Safety Manual',
    titleHi: 'कुंभ मेला संगम सुरक्षा नियमावली',
    size: 'Smart Administration · Bilingual PDF/HTML',
  },
];

const INITIAL_CHECKLIST = [
  { id: 'water', label: 'Water and food', ready: true },
  { id: 'torch', label: 'Torch and power bank', ready: true },
  { id: 'firstaid', label: 'First aid kit', ready: true },
  { id: 'medicines', label: 'Essential medicines', ready: true },
  { id: 'docs', label: 'Important documents', ready: false },
  { id: 'whistle', label: 'Whistle and radio', ready: false },
];

export default function ResourcesPage() {
  const { lang, t } = useLanguage();
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  const toggleItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ready: !item.ready } : item))
    );
  };

  const readyCount = checklist.filter((item) => item.ready).length;
  const scorePercent = Math.round((readyCount / checklist.length) * 100);

  return (
    <div className="container-page py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            {t('resources.title')}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {t('resources.subtitle')}
          </p>
        </div>
        <Link to="/" className="btn-outline text-xs font-bold">
          {t('resources.backHome')}
        </Link>
      </div>

      {/* Disaster Protection Videos with Navbar Selector */}
      <DisasterProtectionVideos />

      {/* Two Columns: Quick Downloads and Emergency Kit Checklist */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-start pt-2">
        {/* Quick Downloads */}
        {/* Featured downloads — paste this in place of your old <div className="space-y-4"> block.
    Before the return(), add:
      import { SAFETY_DOWNLOADS, isSafetyGuide, downloadSafetyGuide } from '../../data/safetyGuides';
      const ALL_DOWNLOADS = [...DOWNLOADS, ...SAFETY_DOWNLOADS];
      const handleDownload = (key) => (isSafetyGuide(key) ? downloadSafetyGuide(key) : downloadBilingualGuide(key)); */}
<div className="space-y-5">
  {/* Heading */}
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-indigo-600 text-lg text-white shadow-lg shadow-brand/30">
        <span aria-hidden="true">📥</span>
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
      {ALL_DOWNLOADS.length}
    </span>
  </div>

  {/* Cards (scrolls when the list is long) */}
  <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
    {ALL_DOWNLOADS.map((d, i) => (
      <div
        key={d.key || i}
        className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-slate-800 dark:bg-slate-900/60"
      >
        {/* Accent bar slides in on hover */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-gradient-to-b from-brand to-indigo-500 transition-transform duration-300 group-hover:scale-y-100 motion-reduce:transition-none"
        />

        {/* Icon tile */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 text-2xl ring-1 ring-slate-200/80 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none dark:from-slate-800 dark:to-slate-900 dark:ring-slate-700">
          <span aria-hidden="true">{d.icon}</span>
        </div>

        {/* Text */}
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
            {d.category && (
              <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[11px] font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                {lang === 'hi' ? d.categoryHi || d.category : d.category}
              </span>
            )}
            <span className="rounded-md bg-brand/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
              हिंदी + EN
            </span>
          </div>
        </div>

        {/* Download button */}
        <button
          type="button"
          onClick={() => handleDownload(d.key)}
          title={`Download ${d.title} (Bilingual Hindi + English)`}
          aria-label={`${t('home.download')}: ${lang === 'hi' ? d.titleHi : d.title}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-brand hover:shadow-md hover:shadow-brand/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:scale-95 dark:bg-white dark:text-slate-900 dark:hover:bg-brand dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transition-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 4v11" />
            <path d="m7 11 5 5 5-5" />
            <path d="M5 20h14" />
          </svg>
          <span className="hidden sm:inline">{t('home.download')}</span>
        </button>
      </div>
    ))}
  </div>
</div>

        {/* Emergency Kit Checklist with Dynamic Preparedness Score */}
        <div className="card p-5 bg-white space-y-4">
          <h2 className="text-lg font-bold text-ink">
            {t('resources.checklistTitle')}
          </h2>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-line/80 bg-surface p-2.5 text-xs transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      item.ready
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-600 text-white'
                    }`}
                  >
                    {item.ready ? t('resources.ready') : t('resources.needed')}
                  </span>
                  <span className="font-semibold text-ink">{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={item.ready}
                  onChange={() => toggleItem(item.id)}
                  className="h-4 w-4 rounded text-brand focus:ring-brand"
                />
              </div>
            ))}
          </div>

          {/* Preparedness Score Progress Meter */}
          <div className="pt-3 border-t border-line space-y-2">
            <div className="flex justify-between text-xs font-bold text-ink">
              <span>{t('resources.score')}:</span>
              <span className="text-brand font-extrabold">{scorePercent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className="h-full bg-brand transition-all duration-300 rounded-full"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
