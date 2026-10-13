import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import DisasterProtectionVideos from '../components/DisasterProtectionVideos';
import HealthcareActionCenter from '../components/resources/HealthcareActionCenter';
import MelaReadinessHub from '../components/resources/MelaReadinessHub';
import DisasterReadinessScore from '../components/resources/DisasterReadinessScore';
import { downloadBilingualGuide } from '../utils/guideGenerator';

const DOWNLOADS = [
  {
    key: 'first-aid',
    title: 'Emergency First Aid Handbook',
    titleHi: 'आपातकालीन प्राथमिक चिकित्सा पुस्तिका',
    category: 'healthcare',
    categoryLabel: 'Healthcare & First Aid',
    categoryLabelHi: 'स्वास्थ्य एवं प्राथमिक चिकित्सा',
    size: 'Civic Healthcare · Bilingual PDF/HTML',
    desc: 'Immediate life-saving procedures: CPR 30:2, arterial bleeding control, burns cooling, choking Heimlich, and snakebite DOs/DONTs.',
    descHi: 'जीवन रक्षक त्वरित प्रक्रियाएं: सीपीआर, गंभीर रक्तस्राव नियंत्रण, जलन, चोकिंग और सर्पदंश सावधानियां।',
    icon: '🩹',
  },
  {
    key: 'flood-guide',
    title: 'Flood Preparedness & Evacuation Guide',
    titleHi: 'बाढ़ पूर्व तैयारी एवं सुरक्षित निकासी गाइड',
    category: 'floods',
    categoryLabel: 'Floods & Weather',
    categoryLabelHi: 'बाढ़ एवं मौसमी आपदा',
    size: 'NDMA Standard · Bilingual PDF/HTML',
    desc: 'Pre-flood 72-hour survival go-bag, electrical breaker safety, moving water driving hazards, and designated relief shelter routes.',
    descHi: 'बाढ़ पूर्व 72 घंटे का गो-बैग, बिजली सुरक्षा, बहते पानी के खतरे और सुरक्षित ऊंचे राहत शिविर निकासी मार्ग।',
    icon: '🌊',
  },
  {
    key: 'heatwave-protocol',
    title: 'Heatwave & Sunstroke Safety Protocol',
    titleHi: 'लू एवं हीटस्ट्रोक सुरक्षा प्रोटोकॉल',
    category: 'heatwave',
    categoryLabel: 'Heatwave & Climate',
    categoryLabelHi: 'लू एवं ताप लहर',
    size: 'Health Ministry · Bilingual PDF/HTML',
    desc: 'Exhaustion vs heat stroke triage, WHO standard ORS formulation, rapid active body cooling, and peak hour sun avoidance.',
    descHi: 'हीट एग्जॉशन बनाम हीटस्ट्रोक पहचान, ओआरएस घोल अनुपात, त्वरित शरीर शीतलन और दोपहर में धूप से बचाव।',
    icon: '☀️',
  },
  {
    key: 'kumbh-manual',
    title: 'Kumbh Mela Sangam Safety Manual',
    titleHi: 'कुंभ मेला संगम सुरक्षा नियमावली',
    category: 'mela',
    categoryLabel: 'Mela & Crowd Safety',
    categoryLabelHi: 'मेला एवं भीड़ सुरक्षा',
    size: 'Smart Administration · Bilingual PDF/HTML',
    desc: 'Sangam barricaded bathing safety, strict one-way pontoon bridge flow, crowd surge boxer stance, and lost-found reunification desks.',
    descHi: 'संगम स्नान सुरक्षा, पीपा पुल अनुशासन, भीड़ के दबाव में रक्षात्मक मुद्रा और खोया-पाया केंद्र मिलाप प्रक्रिया।',
    icon: '🚩',
  },
  {
    key: 'earthquake-guide',
    title: 'Earthquake Preparedness & Response Guide',
    titleHi: 'भूकंप पूर्व तैयारी एवं आपातकालीन सुरक्षा निर्देश',
    category: 'earthquake',
    categoryLabel: 'Earthquake & Structural',
    categoryLabelHi: 'भूकंप एवं संरचना सुरक्षा',
    size: 'NDMA Standard · Bilingual PDF/HTML',
    desc: 'Drop-Cover-Hold On protocol, indoor structural safe zones, open ground hazard avoidance, and post-quake gas leak inspections.',
    descHi: 'झुकें-ढकें-पकड़ें (Drop, Cover, Hold On) नियम, खुले मैदान की सुरक्षा और भूकंप पश्चात गैस व बिजली जांच।',
    icon: '🏚️',
  },
  {
    key: 'cyclone-guide',
    title: 'Cyclone & High-Wind Safety Handbook',
    titleHi: 'चक्रवात एवं तेज आंधी-तूफान सुरक्षा निर्देशिका',
    category: 'floods',
    categoryLabel: 'Floods & Weather',
    categoryLabelHi: 'बाढ़ एवं मौसमी आपदा',
    size: 'IMD & NDMA · Bilingual PDF/HTML',
    desc: 'Home window hardening, interior safe room sheltering, storm surge avoidance, and identifying the false calm eye of the storm.',
    descHi: 'खिड़की-छत सुरक्षा, सुरक्षित भीतरी कमरे में शरण, तूफानी लहरों से दूरी और चक्रवात की आंख के धोखे से बचाव।',
    icon: '🌀',
  },
];

const INITIAL_CHECKLIST_ITEMS = [
  // Original items preserved
  { id: 'water', label: 'Water and food', labelHi: 'पानी और सूखा भोजन', group: 'hydration', ready: true },
  { id: 'torch', label: 'Torch and power bank', labelHi: 'टॉर्च और पावर बैंक', group: 'tools', ready: true },
  { id: 'firstaid', label: 'First aid kit', labelHi: 'प्राथमिक चिकित्सा किट', group: 'medical', ready: true },
  { id: 'medicines', label: 'Essential medicines', labelHi: 'जरूरी दवाएं', group: 'medical', ready: true },
  { id: 'docs', label: 'Important documents', labelHi: 'महत्वपूर्ण दस्तावेज', group: 'documents', ready: false },
  { id: 'whistle', label: 'Whistle and radio', labelHi: 'सीटी और बैटरी रेडियो', group: 'tools', ready: false },

  // Enhanced items requested
  { id: 'drinking_water_res', label: 'Drinking water (4-5L per person sealed)', labelHi: 'पीने का पानी (प्रति व्यक्ति 4-5 लीटर सीलबंद)', group: 'hydration', ready: true },
  { id: 'non_perishable_food', label: 'Non-perishable food (3-day dry rations & energy bars)', labelHi: '3 दिन का सूखा राशन (सत्तू, भुने चने, बिस्कुट)', group: 'hydration', ready: false },
  { id: 'masks_hygiene', label: 'Masks and hygiene supplies (N95 masks, soap, sanitizers)', labelHi: 'मास्क एवं स्वच्छता सामग्री (N95 मास्क, साबुन, सैनिटाइजर)', group: 'medical', ready: true },
  { id: 'emergency_contacts', label: 'Emergency contact list (Laminated paper card)', labelHi: 'आपातकालीन संपर्क सूची (लेमिनेटेड पेपर कार्ड)', group: 'documents', ready: true },
  { id: 'basic_first_aid', label: 'Basic first-aid supplies (Sterile gauze, bandage tape, antiseptic)', labelHi: 'बुनियादी प्राथमिक चिकित्सा सामग्री (स्टेरलाइज्ड गॉज, पट्टी, लोशन)', group: 'medical', ready: true },
  { id: 'personal_medical', label: 'Necessary personal medical supplies (Inhalers, insulin, BP meds)', labelHi: 'व्यक्तिगत नियमित चिकित्सीय दवाएं (इनहेलर, इंसुलिन, बीपी दवाएं)', group: 'medical', ready: false },
  { id: 'doc_copies', label: 'Copies of important documents (Aadhaar & property in waterproof pouch)', labelHi: 'दस्तावेजों की प्रतियां (आधार व कागजात वाटरप्रूफ थैली में)', group: 'documents', ready: false },
  { id: 'baby_elderly_care', label: 'Baby or elderly care essentials (Formula, diapers, mobility aids)', labelHi: 'शिशु या वृद्ध देखभाल जरूरी सामान (दूध, डायपर, छड़ी)', group: 'vulnerable', ready: false },
];

export default function ResourcesPage() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  // Downloads filter & search state
  const [downloadCategory, setDownloadCategory] = useState('all');
  const [downloadSearch, setDownloadSearch] = useState('');

  // Storage key: if user logged in, associate with user, else guest storage
  const storageKey = user?.id ? `ss_checklist_user_${user.id}` : 'ss_emergency_checklist_v2';

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to retain new items
          const savedMap = new Map(parsed.map((item) => [item.id, item.ready]));
          return INITIAL_CHECKLIST_ITEMS.map((item) => ({
            ...item,
            ready: savedMap.has(item.id) ? !!savedMap.get(item.id) : item.ready,
          }));
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_CHECKLIST_ITEMS;
  });

  // Save to storage on update
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checklist));
    } catch {
      /* storage unavailable */
    }
  }, [checklist, storageKey]);

  const toggleItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ready: !item.ready } : item))
    );
  };

  const handleResetChecklist = () => {
    setChecklist(INITIAL_CHECKLIST_ITEMS);
  };

  const handleSelectAll = () => {
    const allChecked = checklist.every((i) => i.ready);
    setChecklist((prev) => prev.map((item) => ({ ...item, ready: !allChecked })));
  };

  const handlePrintChecklist = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const readyItems = checklist.filter((i) => i.ready);
    const pendingItems = checklist.filter((i) => !i.ready);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>SevaSaarthi Emergency Kit Checklist</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
          h1 { color: #0f766e; font-size: 24px; margin-bottom: 4px; }
          .sub { color: #64748b; font-size: 13px; margin-bottom: 20px; }
          .progress { background: #e2e8f0; border-radius: 9999px; height: 12px; margin-bottom: 20px; overflow: hidden; }
          .bar { background: #0d9488; height: 100%; width: ${Math.round((readyItems.length / checklist.length) * 100)}%; }
          .stats { font-weight: bold; margin-bottom: 15px; font-size: 14px; }
          .section { margin-top: 20px; }
          .section-title { font-size: 15px; font-weight: bold; border-bottom: 2px solid #0f766e; padding-bottom: 4px; margin-bottom: 10px; }
          .item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px dotted #cbd5e1; font-size: 13px; }
          .box { width: 14px; height: 14px; border: 1px solid #475569; display: inline-block; text-align: center; line-height: 14px; font-size: 11px; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
          @media print { body { padding: 10px; } button { display: none; } }
        </style>
      </head>
      <body>
        <h1>🛡️ SevaSaarthi Emergency Kit Checklist</h1>
        <div class="sub">Preparedness Verification Record · Date: ${new Date().toLocaleDateString()}</div>
        <div class="stats">Overall Readiness: ${Math.round((readyItems.length / checklist.length) * 100)}% (${readyItems.length} of ${checklist.length} items packed)</div>
        <div class="progress"><div class="bar"></div></div>

        <div class="section">
          <div class="section-title">✓ PACKED & READY ITEMS (${readyItems.length})</div>
          ${readyItems
            .map(
              (i) => `<div class="item"><span class="box">✓</span> <strong>${i.label}</strong> / ${i.labelHi}</div>`
            )
            .join('')}
        </div>

        <div class="section">
          <div class="section-title">⚠️ NEEDED / TO BE ACQUIRED (${pendingItems.length})</div>
          ${pendingItems
            .map(
              (i) => `<div class="item"><span class="box">&nbsp;</span> ${i.label} / ${i.labelHi}</div>`
            )
            .join('')}
        </div>

        <div class="footer">
          SevaSaarthi Civic Emergency Platform · Helpline: 112 / 108 · Keep this sheet attached to your 72-Hour Emergency Bag.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const readyCount = checklist.filter((item) => item.ready).length;
  const scorePercent = Math.round((readyCount / checklist.length) * 100);

  // Filtered downloads
  const filteredDownloads = useMemo(() => {
    return DOWNLOADS.filter((item) => {
      const matchCat = downloadCategory === 'all' || item.category === downloadCategory;
      const q = downloadSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.titleHi.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.descHi.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [downloadCategory, downloadSearch]);

  const categories = [
    { id: 'all', label: 'All Guides', labelHi: 'सभी गाइड' },
    { id: 'healthcare', label: 'Healthcare & First Aid', labelHi: 'स्वास्थ्य एवं फर्स्ट एड' },
    { id: 'floods', label: 'Floods & Weather', labelHi: 'बाढ़ एवं मौसमी आपदा' },
    { id: 'heatwave', label: 'Heatwave', labelHi: 'लू एवं ताप लहर' },
    { id: 'mela', label: 'Mela & Crowd Safety', labelHi: 'मेला एवं भीड़ सुरक्षा' },
    { id: 'earthquake', label: 'Earthquakes', labelHi: 'भूकंप सुरक्षा' },
  ];

  return (
    <div className="container-page py-8 space-y-10">
      {/* Page Header with modern styling and teal/green accents */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 ring-1 ring-teal-400/30">
              <span>🛡️</span>
              <span>{lang === 'hi' ? 'नागरिक सुरक्षा एवं संसाधन केंद्र' : 'Civic Safety & Resilience Hub'}</span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-white">
              {t('resources.title')}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-teal-100/90 max-w-2xl">
              {t('resources.subtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintChecklist}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-teal-400/30 bg-teal-800/40 px-3.5 py-2 text-xs font-bold text-teal-200 transition hover:bg-teal-700/50"
            >
              <span>🖨️</span>
              <span>{lang === 'hi' ? 'प्रिंट चेकलिस्ट' : 'Print Checklist'}</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-2xl bg-white px-4 py-2 text-xs font-extrabold text-teal-950 transition hover:bg-teal-50 shadow-sm"
            >
              <span>←</span>
              <span>{t('resources.backHome')}</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 1. DISASTER PROTECTION VIDEOS SECTION — KEPT 100% UNCHANGED AS REQUESTED */}
      <DisasterProtectionVideos />

      {/* 2. UNIQUE FEATURE: HEALTHCARE EMERGENCY ACTION CENTER */}
      <HealthcareActionCenter />

      {/* 3. UNIQUE FEATURE: MELA CROWD SAFETY & LIVE READINESS HUB */}
      <MelaReadinessHub />

      {/* 4. REDESIGNED QUICK DOWNLOADS & INTERACTIVE EMERGENCY KIT CHECKLIST */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start pt-2">
        {/* Quick Downloads Section (Redesigned with Category Filters & Search) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-xl text-white shadow-md shadow-teal-600/20">
                📥
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {t('resources.quickDownloads')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'सत्यापित द्विभाषी हैंडबुक (हिंदी + English)' : 'Printable Bilingual Handbooks (Hindi + English)'}
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
              {filteredDownloads.length} {lang === 'hi' ? 'गाइड उपलब्ध' : 'Guides Available'}
            </span>
          </div>

          {/* Search bar */}
          <div>
            <input
              type="text"
              value={downloadSearch}
              onChange={(e) => setDownloadSearch(e.target.value)}
              placeholder={lang === 'hi' ? 'गाइड खोजें (उदा. फर्स्ट एड, बाढ़, भूकंप, कुंभ)...' : 'Search guides by title, disaster or topic...'}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setDownloadCategory(c.id)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  downloadCategory === c.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {lang === 'hi' ? c.labelHi : c.label}
              </button>
            ))}
          </div>

          {/* Resource Cards */}
          <div className="space-y-3.5">
            {filteredDownloads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {lang === 'hi' ? 'कोई गाइड नहीं मिली। कृपया खोज शब्द बदलें।' : 'No guides match your search or filter.'}
              </div>
            ) : (
              filteredDownloads.map((item) => (
                <div
                  key={item.key}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-teal-400/80 hover:shadow-md dark:border-slate-800 dark:bg-slate-850 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-2xl ring-1 ring-teal-200/60 transition group-hover:scale-105 dark:bg-teal-950/60 dark:ring-teal-800">
                      <span>{item.icon}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-teal-100/80 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
                          {lang === 'hi' ? item.categoryLabelHi : item.categoryLabel}
                        </span>
                        <span className="rounded-md bg-emerald-100/70 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                          हिंदी + EN
                        </span>
                      </div>

                      <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                        {lang === 'hi' ? item.titleHi : item.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {lang === 'hi' ? item.descHi : item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Working Download Button */}
                  <button
                    type="button"
                    onClick={() => downloadBilingualGuide(item.key)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-teal-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 sm:self-center"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
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
                    <span>{lang === 'hi' ? 'गाइड डाउनलोड करें' : 'Download Guide'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Emergency Kit Checklist (Interactive Dashboard with Dynamic %, Reset, and Print) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {t('resources.checklistTitle')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? '72 घंटे के आपातकालीन किट की तैयारी' : '72-Hour Household Disaster Go-Bag'}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                scorePercent >= 80
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                  : scorePercent >= 50
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
              }`}
            >
              {readyCount} / {checklist.length} {lang === 'hi' ? 'तैयार' : 'Packed'}
            </span>
          </div>

          {/* Dynamic Percentage Meter */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>{t('resources.score')}:</span>
              <span className="text-base font-black text-teal-700 dark:text-teal-300">
                {scorePercent}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  scorePercent >= 80 ? 'bg-emerald-600' : scorePercent >= 50 ? 'bg-teal-600' : 'bg-amber-600'
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                {checklist.every((i) => i.ready)
                  ? lang === 'hi' ? 'सभी हटाएं' : 'Uncheck All'
                  : lang === 'hi' ? 'सभी चुनें' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                {lang === 'hi' ? 'रीसेट' : 'Reset'}
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrintChecklist}
              className="inline-flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-950/60 dark:text-teal-300"
            >
              <span>🖨️</span>
              <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs transition-colors ${
                  item.ready
                    ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase shrink-0 ${
                      item.ready
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-400 text-white dark:bg-slate-600'
                    }`}
                  >
                    {item.ready ? t('resources.ready') : t('resources.needed')}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {lang === 'hi' ? item.labelHi : item.label}
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={item.ready}
                  onChange={() => toggleItem(item.id)}
                  className="h-4 w-4 shrink-0 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-2 text-center text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
            {user?.id
              ? (lang === 'hi' ? '✓ आपकी चेकलिस्ट आपके खाते के साथ सुरक्षित है।' : '✓ Checklist progress saved to your authenticated account.')
              : (lang === 'hi' ? '✓ प्रगति आपके स्थानीय ब्राउज़र में स्वतः सहेजी जाती है।' : '✓ Progress automatically saved to your local browser storage.')}
          </div>
        </div>
      </div>

      {/* 5. SMALL EXTRA FEATURE: PERSONAL DISASTER READINESS SCORE */}
      <DisasterReadinessScore />
    </div>
  );
}
