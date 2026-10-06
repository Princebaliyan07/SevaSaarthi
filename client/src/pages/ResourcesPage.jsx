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
        <div className="card p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              {t('resources.quickDownloads')}
            </h2>
            <span className="text-xs text-brand font-semibold">Bilingual (Hindi + English)</span>
          </div>

          <div className="space-y-3">
            {DOWNLOADS.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-line p-3 hover:border-brand/40 transition-colors"
              >
                <div>
                  <span className="block text-xs font-bold text-ink">
                    {lang === 'hi' ? item.titleHi : item.title}
                  </span>
                  <span className="block text-[11px] text-ink-soft">{item.size}</span>
                </div>
                <button
                  type="button"
                  onClick={() => downloadBilingualGuide(item.key)}
                  className="btn-outline text-xs py-1.5 px-3 font-semibold flex items-center gap-1.5 hover:bg-brand hover:text-white transition-colors"
                  title="Download bilingual civic guide"
                >
                  <span>📥</span>
                  <span>Download</span>
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
