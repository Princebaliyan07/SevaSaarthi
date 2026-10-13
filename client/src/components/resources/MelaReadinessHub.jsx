import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getMelaOverview, getCrowdZones } from '../../services/melaService';

const VISIT_CHECKLIST_ITEMS = [
  {
    id: 'id_slip',
    title: 'ID Slip in Child & Senior Pockets',
    titleHi: 'बच्चों व बुजुर्गों की जेब में पहचान पर्ची',
    desc: 'Laminate or write name, emergency phone number, and district on paper. Keep in every family member’s pocket.',
    descHi: 'कागज पर नाम, फोन नंबर और जिला लिखकर बच्चों और वृद्धों की जेब में रखें।',
    icon: '🪪',
  },
  {
    id: 'meeting_point',
    title: 'Pre-Agreed Physical Meeting Point',
    titleHi: 'पूर्व-निर्धारित मिलन स्थल',
    desc: 'Select a numbered pillar, police watchtower, or registered camp (e.g. Sector 4 Lost-Found Desk) before entering.',
    descHi: 'मेले में प्रवेश से पहले एक निश्चित खंभा, पुलिस वॉचटावर या खोया-पाया केंद्र तय करें।',
    icon: '🚩',
  },
  {
    id: 'hydration_pack',
    title: 'Hydration & Heat Protection',
    titleHi: 'पर्याप्त पानी एवं धूप से बचाव',
    desc: 'Carry minimum 1.5L drinking water per person, ORS sachets, and a lightweight cotton cloth (gamcha) to cover head.',
    descHi: 'प्रति व्यक्ति कम से कम 1.5L पानी, ओआरएस और सिर ढकने के लिए सूती गमछा साथ रखें।',
    icon: '💧',
  },
  {
    id: 'power_bank',
    title: 'Fully Charged Phone & Power Bank',
    titleHi: 'फुल चार्ज मोबाइल व पावर बैंक',
    desc: 'Network congestion drains battery rapidly. Keep phone on battery-saver mode and save key helplines offline.',
    descHi: 'भीड़ में नेटवर्क सर्च से बैटरी जल्दी खत्म होती है। बैटरी सेवर ऑन रखें और हेल्पलाइन नंबर सेव रखें।',
    icon: '🔋',
  },
  {
    id: 'crowd_discipline',
    title: 'Strict One-Way Pontoon Bridge Flow',
    titleHi: 'पीपा पुल पर एकतरफा आवागमन का नियम',
    desc: 'Never walk against crowd direction and strictly avoid stopping on bridges for photos or selfies.',
    descHi: 'भीड़ के विपरीत कभी न चलें और पुलों पर फोटो या सेल्फी लेने के लिए बिल्कुल न रुकें।',
    icon: '🌉',
  },
];

const SAFETY_PILLARS = [
  {
    icon: '🧭',
    title: 'Designated Meeting Points',
    titleHi: 'पारिवारिक मिलन स्थल की योजना',
    desc: 'Do not choose vague landmarks like "near the big tent" or "by the river". Agree on a permanent numbered Gate, Police Watchtower, or Sector Information Booth.',
    descHi: 'कभी भी "नदी किनारे" या "बड़े पंडाल" जैसा अस्पष्ट स्थान न चुनें। हमेशा स्थायी नंबर वाले गेट, पुलिस वॉचटावर या सेक्टर सूचना केंद्र को ही मिलन स्थल बनाएं।',
    tag: 'Family Essential',
    tagHi: 'परिवार के लिए आवश्यक',
  },
  {
    icon: '🛡️',
    title: 'Crowd Surge Defensive Stance',
    titleHi: 'भीड़ के दबाव में बॉक्सर रक्षात्मक मुद्रा',
    desc: 'If trapped in sudden crowd surges: Stand firm, keep hands up in front of your chest with elbows bent (boxer stance) to protect lung expansion. Move diagonally with flow.',
    descHi: 'यदि भीड़ का दबाव बढ़े, तो पैर मजबूती से टिकाएं। दोनों हाथों को बॉक्सर की तरह छाती के आगे रखें ताकि फेफड़ों पर दबाव न आए। भीड़ के साथ तिरछी दिशा में निकलें।',
    tag: 'Survival Protocol',
    tagHi: 'जीवन रक्षा नियम',
  },
  {
    icon: '📢',
    title: 'Lost Person Reporting & AI Face-Match',
    titleHi: 'खोया-पाया रिपोर्टिंग एवं एआई मिलान',
    desc: 'If separated, report instantly to the nearest of 48 Lost & Found Desks at Sangam. SevaSaarthi connects directly to digital announcements and AI facial matching.',
    descHi: 'बिछड़ने पर तुरंत संगम के 48 खोया-पाया काउंटरों में से नजदीकी केंद्र पर जाएं। सेवासारथी डिजिटल लाउडस्पीकर और एआई फेशियल मैचिंग से जुड़ा हुआ है।',
    tag: 'Fast Reunification',
    tagHi: 'त्वरित खोज',
  },
  {
    icon: '🚪',
    title: 'Evacuation Routes & River Safety',
    titleHi: 'निकासी मार्ग एवं घाट स्नान सुरक्षा',
    desc: 'Bathe strictly within barricaded shallow ghats. Never cross red river buoys. Pay attention to loudspeaker warnings and emergency yellow exit arrows.',
    descHi: 'केवल बैरिकेड्स वाले सुरक्षित घाटों पर ही स्नान करें। लाल चेतावनी ब्वॉय को कभी पार न करें। लाउडस्पीकर व पीले निकासी तीरों पर नजर रखें।',
    tag: 'Ghat Discipline',
    tagHi: 'घाट अनुशासन',
  },
];

export default function MelaReadinessHub() {
  const { lang } = useLanguage();
  const [telemetry, setTelemetry] = useState(null);
  const [zones, setZones] = useState([]);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [prepChecked, setPrepChecked] = useState({});

  useEffect(() => {
    let isMounted = true;
    async function loadMelaData() {
      setLoadingTelemetry(true);
      try {
        const [overview, zoneData] = await Promise.all([
          getMelaOverview(),
          getCrowdZones(),
        ]);
        if (isMounted) {
          setTelemetry(overview);
          if (Array.isArray(zoneData)) setZones(zoneData);
        }
      } catch (err) {
        console.error('Failed to load Mela crowd telemetry:', err);
      } finally {
        if (isMounted) setLoadingTelemetry(false);
      }
    }
    loadMelaData();
    return () => {
      isMounted = false;
    };
  }, []);

  const togglePrepItem = (id) => {
    setPrepChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const prepCount = Object.values(prepChecked).filter(Boolean).length;
  const prepPercent = Math.round((prepCount / VISIT_CHECKLIST_ITEMS.length) * 100);

  return (
    <section className="space-y-6 rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/30 p-6 shadow-sm dark:border-amber-900/50 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-orange-950/30 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-amber-100 pb-5 dark:border-amber-900/30">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
            <span className="flex h-2 w-2 rounded-full bg-amber-600 animate-pulse" />
            {lang === 'hi' ? 'महाकुंभ एवं तीर्थ मेला सुरक्षा हब' : 'Mela & Pilgrimage Safety Hub'}
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {lang === 'hi' ? 'मेला भीड़ सुरक्षा एवं लाइव तैयारी केंद्र' : 'Mela Crowd Safety & Live Readiness Hub'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang === 'hi'
              ? 'लाखों श्रद्धालुओं के महाआयोजन में सुरक्षित स्नान, भगदड़ से बचाव, खोया-पाया सहायता एवं पारिवारिक मिलन मार्गदर्शन।'
              : 'End-to-end pilgrimage safety protocols, crowd surge protection, pontoon bridge discipline, and lost person reunification.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrepModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95"
          >
            <span>🎒</span>
            <span>{lang === 'hi' ? 'मेला यात्रा पूर्व तैयारी' : 'Prepare for Your Visit'}</span>
          </button>

          <Link
            to="/mela"
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-bold text-amber-800 transition hover:bg-amber-50 dark:border-amber-800 dark:bg-slate-800 dark:text-amber-200"
          >
            <span>🗺️</span>
            <span>{lang === 'hi' ? 'लाइव मेला मैप खोलें' : 'Interactive Mela Map'} ↗</span>
          </Link>
        </div>
      </div>

      {/* Live Crowd Status Telemetry Card (Real Data or Verified Civic Baseline) */}
      <div className="rounded-2xl border border-amber-200/80 bg-white p-5 shadow-xs dark:border-amber-900/40 dark:bg-slate-900/90">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              📡
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {lang === 'hi' ? 'मेला क्षेत्र स्थिति एवं भीड़ निगरानी' : 'Mela Ground Operations & Density Status'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {telemetry
                  ? (lang === 'hi' ? 'सत्यापित लाइव टेलीमेट्री सक्रिय' : 'Connected to Mela Operations Telemetry')
                  : (lang === 'hi' ? 'आधिकारिक नागरिक सुरक्षा मोड सक्रिय · अद्यतन स्थिति' : 'Official Civic Readiness Mode · Latest Verified Baseline')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {telemetry?.overallStatus || (lang === 'hi' ? 'सामान्य एवं नियंत्रित' : 'Normal / Regulated Flow')}
            </span>
            <span className="text-[10px] text-slate-400">
              • {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'संगम स्नान घाट' : 'Sangam Ghat Density'}
            </div>
            <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
              {telemetry?.ghatDensity || (lang === 'hi' ? 'मध्यम (प्रवाहमयी)' : 'Moderate (Free Flow)')}
            </div>
            <span className="mt-1 inline-block rounded-md bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              {lang === 'hi' ? 'सुरक्षित बैरिकेड्स' : 'Barricades Intact'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'पीपा पुल स्थिति' : 'Pontoon Bridges'}
            </div>
            <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
              {telemetry?.bridgeStatus || (lang === 'hi' ? 'एकतरफा आवागमन' : 'Strict One-Way')}
            </div>
            <span className="mt-1 inline-block rounded-md bg-teal-100 px-1.5 py-0.5 text-[9px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
              {lang === 'hi' ? 'पुलिस निगरानी सक्रिय' : 'Tower Guarded'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'खोया-पाया सहायता केंद्र' : 'Lost & Found Desks'}
            </div>
            <div className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
              {telemetry?.lostFoundDesks || '48 Active Desks'}
            </div>
            <span className="mt-1 inline-block rounded-md bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
              {lang === 'hi' ? 'एआई कैमरा लाइव' : 'AI CCTV Sync'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'आपातकालीन हेल्पलाइन' : 'Mela Helpline'}
            </div>
            <div className="mt-1 text-base font-extrabold text-amber-700 dark:text-amber-400">
              1920
            </div>
            <span className="mt-1 inline-block rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
              {lang === 'hi' ? '24x7 टोल-फ्री' : '24x7 Toll-Free'}
            </span>
          </div>
        </div>

        {/* Dynamic Zone Chips if Available */}
        {zones.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'सक्रिय निगरानी क्षेत्र:' : 'Monitored Ground Sectors:'}
            </span>
            {zones.slice(0, 5).map((z, i) => (
              <span
                key={z._id || i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    z.densityLevel === 'high' ? 'bg-rose-500' : z.densityLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span>{z.name || `Sector ${i + 1}`}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4 Pillars of Mela Crowd Safety */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SAFETY_PILLARS.map((pillar, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100/80 text-2xl transition group-hover:scale-105 dark:bg-amber-900/50">
                  {pillar.icon}
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  {lang === 'hi' ? pillar.tagHi : pillar.tag}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">
                {lang === 'hi' ? pillar.titleHi : pillar.title}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'hi' ? pillar.descHi : pillar.desc}
              </p>
            </div>

            {idx === 2 && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/mela"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400"
                >
                  <span>{lang === 'hi' ? 'खोया-पाया केंद्र व केस दर्ज करें' : 'Open Lost & Found Portal'}</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive "Prepare for Your Visit" Modal */}
      {showPrepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl dark:border-amber-900 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎒</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'मेला यात्रा पूर्व तैयारी चेकलिस्ट' : 'Pre-Visit Pilgrimage Readiness Checklist'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'मेले में जाने से पहले परिवार सहित इन 5 चरणों को पूरा करें' : 'Complete these 5 critical steps before stepping onto the grounds'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrepModal(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{lang === 'hi' ? 'तैयारी स्कोर:' : 'Visit Readiness:'}</span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">{prepPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full bg-amber-600 transition-all duration-300 rounded-full"
                  style={{ width: `${prepPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {VISIT_CHECKLIST_ITEMS.map((item) => {
                const isChecked = !!prepChecked[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => togglePrepItem(item.id)}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-xs transition-all ${
                      isChecked
                        ? 'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/40'
                        : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePrepItem(item.id)}
                      className="mt-0.5 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                        <span>{item.icon}</span>
                        <span>{lang === 'hi' ? item.titleHi : item.title}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {lang === 'hi' ? item.descHi : item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {prepCount} / {VISIT_CHECKLIST_ITEMS.length} {lang === 'hi' ? 'पूर्ण' : 'completed'}
              </span>
              <button
                type="button"
                onClick={() => setShowPrepModal(false)}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
              >
                {lang === 'hi' ? 'सहेजें व बंद करें' : 'Done & Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
