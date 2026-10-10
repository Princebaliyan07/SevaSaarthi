import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const GUIDES = [
  {
    id: 'flood',
    emoji: '🌊',
    tile: 'bg-sky-100 text-sky-700',
    title: 'Flood',
    titleHi: 'बाढ़',
    before: [
      'Know your evacuation route and shelter',
      'Keep medicines, documents and a torch in a go-bag',
    ],
    beforeHi: [
      'अपने निकासी मार्ग और निकटतम आश्रय को जानें',
      'गो-बैग में दवाएं, महत्वपूर्ण दस्तावेज और टॉर्च तैयार रखें',
    ],
    during: [
      'Move to higher ground. Never walk or drive through flood water',
      'Switch off electricity if safe',
    ],
    duringHi: [
      'ऊंचे स्थान पर जाएं। बाढ़ के पानी में कभी न चलें या गाड़ी न चलाएं',
      'यदि सुरक्षित हो तो बिजली का मुख्य स्विच बंद करें',
    ],
    after: [
      'Return only when officials say so',
      'Boil or purify water before drinking',
    ],
    afterHi: [
      'आधिकारिक घोषणा के बाद ही वापस लौटें',
      'पीने से पहले पानी को उबालें या शुद्ध करें',
    ],
  },
  {
    id: 'landslide',
    emoji: '⛰️',
    tile: 'bg-amber-100 text-amber-700',
    title: 'Landslide',
    titleHi: 'भूस्खलन',
    before: [
      'Learn local warning signs: cracks, tilted poles',
      'Plan a route away from slopes',
    ],
    beforeHi: [
      'स्थानीय चेतावनी संकेत पहचानें: दरारें, झुके हुए खंभे',
      'ढलानों से दूर एक सुरक्षित मार्ग की योजना बनाएं',
    ],
    during: [
      'Move away from the slope, not down its path',
      'Follow evacuation orders immediately',
    ],
    duringHi: [
      'ढलान से दूर हटें, उसके बहाव के रास्ते में न जाएं',
      'निकासी आदेशों का तुरंत पालन करें',
    ],
    after: [
      'Stay out of the area as secondary slides may occur',
      'Report blocked roads and injuries',
    ],
    afterHi: [
      'इलाके से बाहर रहें क्योंकि दोबारा भूस्खलन हो सकता है',
      'अवरुद्ध सड़कों और घायलों की सूचना कंट्रोल रूम को दें',
    ],
  },
  {
    id: 'earthquake',
    emoji: '🏚️',
    tile: 'bg-stone-200 text-stone-700',
    title: 'Earthquake',
    titleHi: 'भूकंप',
    before: [
      'Secure heavy furniture and overhead fixtures',
      'Agree on a family meeting point',
    ],
    beforeHi: [
      'भारी फर्नीचर को सुरक्षित करें',
      'परिवार के साथ मिलने का एक खुला सुरक्षित स्थान तय करें',
    ],
    during: [
      'Drop, cover and hold on',
      'Stay away from windows and heavy glass',
    ],
    duringHi: [
      'झुकें, ढकें और पकड़ें (Drop, Cover & Hold)',
      'खिड़कियों और भारी कांच से दूर रहें',
    ],
    after: [
      'Expect aftershocks and check for structural damage',
      'Check for gas leaks before using flames',
    ],
    afterHi: [
      'आफ्टरशॉक के लिए सतर्क रहें',
      'माचिस या आग जलाने से पहले गैस रिसाव की जांच करें',
    ],
  },
  {
    id: 'cyclone',
    emoji: '🌀',
    tile: 'bg-indigo-100 text-indigo-700',
    title: 'Cyclone',
    titleHi: 'चक्रवात',
    before: [
      'Charge phones and power banks',
      'Know your nearest cyclone shelter',
    ],
    beforeHi: [
      'मोबाइल और पावर बैंक चार्ज रखें',
      'निकटतम चक्रवात आश्रय स्थल की जानकारी रखें',
    ],
    during: [
      'Stay indoors away from windows',
      'Listen to official radio and disaster updates',
    ],
    duringHi: [
      'घरों के अंदर रहें, खिड़कियों से दूर रहें',
      'आधिकारिक रेडियो या मोबाइल अलर्ट सुनते रहें',
    ],
    after: [
      'Avoid fallen power lines and damaged poles',
      'Return only when declared safe',
    ],
    afterHi: [
      'गिरे हुए बिजली के तारों से दूर रहें',
      'सुरक्षित घोषित होने पर ही बाहर निकलें',
    ],
  },
  {
    id: 'heatwave',
    emoji: '☀️',
    tile: 'bg-orange-100 text-orange-700',
    title: 'Heatwave',
    titleHi: 'लू / ग्रीष्म लहर',
    before: [
      'Plan outdoor work for mornings',
      'Keep ORS and water ready',
    ],
    beforeHi: [
      'बाहरी काम सुबह के समय करें',
      'ओआरएस और पर्याप्त पानी तैयार रखें',
    ],
    during: [
      'Drink water often, rest in shade',
      'Check on elderly neighbours',
    ],
    duringHi: [
      'बार-बार पानी पिएं, छाया में आराम करें',
      'बुजुर्ग पड़ोसियों और बच्चों का हालचाल लें',
    ],
    after: [
      'Watch for heat-illness signs: cramps, dizziness',
      'Seek care if confused or very weak',
    ],
    afterHi: [
      'लू के लक्षणों पर ध्यान दें: चक्कर, मांसपेशियों में ऐंठन',
      'यदि कमजोरी या भ्रम महसूस हो तो तुरंत चिकित्सा सहायता लें',
    ],
  },
];

/* The three phases are a real sequence, so they get numbers.
   "During" is the one people need under stress, so it is the visually loudest. */
const PHASES = [
  {
    key: 'before',
    num: 1,
    card: 'bg-surface border-line',
    badge: 'bg-brand text-white',
    heading: 'text-brand-dark',
    tick: 'bg-brand/10 text-brand',
  },
  {
    key: 'during',
    num: 2,
    card: 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-100',
    badge: 'bg-sos text-white',
    heading: 'text-sos',
    tick: 'bg-sos/10 text-sos',
  },
  {
    key: 'after',
    num: 3,
    card: 'bg-surface border-line',
    badge: 'bg-slate-600 text-white',
    heading: 'text-ink-soft',
    tick: 'bg-slate-200 text-slate-600',
  },
];

function Check({ className = '' }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10.5l4 4 8-9" />
      </svg>
    </span>
  );
}

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-ink-soft transition-transform duration-300 motion-reduce:transition-none ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export default function PreparednessAccordion({
  title = 'Preparedness guides',
  titleHi = 'तैयारी गाइड',
  subtitle = 'Field-tested guidance for quick reference in low-connectivity areas.',
  subtitleHi = 'कम नेटवर्क वाले इलाकों में त्वरित संदर्भ के लिए परखी हुई जानकारी।',
}) {
  const { lang, t } = useLanguage();
  const [openItem, setOpenItem] = useState('flood');
  const isHi = lang === 'hi';

  return (
    <section
      aria-labelledby="preparedness-heading"
      className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm"
    >
      {/* Section header */}
      <header className="flex flex-col gap-3 border-b border-line bg-surface px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-start gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-xl text-white"
            aria-hidden="true"
          >
            🛡️
          </span>
          <div>
            <h2 id="preparedness-heading" className="text-xl font-bold leading-tight text-ink">
              {isHi ? titleHi : title}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">
              {isHi ? subtitleHi : subtitle}
            </p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          {GUIDES.length} {isHi ? 'आपदा गाइड' : 'hazard guides'}
        </span>
      </header>

      {/* Rows */}
      <div className="divide-y divide-line">
        {GUIDES.map((item) => {
          const isOpen = openItem === item.id;
          const panelId = `guide-panel-${item.id}`;

          return (
            <div
              key={item.id}
              className={`relative transition-colors duration-300 ${isOpen ? 'bg-surface/50' : 'bg-white'}`}
            >
              {/* Accent bar marks the open row */}
              <span
                className={`absolute inset-y-0 left-0 w-1 bg-brand transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />

              <h3>
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand sm:px-7"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${item.tile}`}
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-bold leading-tight text-ink">
                      {isHi ? item.titleHi : item.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">
                      {isHi ? item.title : item.titleHi}
                    </span>
                  </span>

                  <span className="hidden text-sm font-semibold text-ink-soft sm:inline">
                    {isOpen ? (isHi ? 'छुपाएं' : 'Hide') : isHi ? 'देखें' : 'View checklist'}
                  </span>
                  <Chevron open={isOpen} />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-label={isHi ? item.titleHi : item.title}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-6 pt-1 sm:px-7">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {PHASES.map((phase) => {
                        const points = isHi ? item[`${phase.key}Hi`] : item[phase.key];
                        return (
                          <div key={phase.key} className={`rounded-xl border p-4 ${phase.card}`}>
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${phase.badge}`}
                                aria-hidden="true"
                              >
                                {phase.num}
                              </span>
                              <h4 className={`text-base font-bold ${phase.heading}`}>
                                {t(`disaster.${phase.key}`)}
                              </h4>
                            </div>
                            <ul className="mt-3.5 space-y-3 text-sm leading-relaxed text-ink">
                              {points.map((point, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <Check className={phase.tick} />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}