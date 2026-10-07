/**
 * ALL_HELPLINES — Complete India Emergency & Citizen Helpline Directory
 * Categorized, verified official numbers
 */
export const ALL_HELPLINES_CATEGORIES = [
  {
    id: 'emergency',
    title: 'Core Emergency Services',
    titleHi: 'मुख्य आपातकालीन सेवाएं',
    icon: '🚨',
    color: 'rose',
    helplines: [
      { name: 'National Unified Emergency', nameHi: 'राष्ट्रीय आपातकालीन सेवा', num: '112', note: '24×7 Toll Free' },
      { name: 'Ambulance Emergency', nameHi: 'एम्बुलेंस सेवा', num: '108', note: 'Medical' },
      { name: 'Fire & Rescue Service', nameHi: 'अग्निशमन एवं बचाव', num: '101', note: 'Fire' },
      { name: 'Police Control Room', nameHi: 'पुलिस कंट्रोल रूम', num: '100', note: 'Police' },
    ],
  },
  {
    id: 'disaster',
    title: 'Disaster & Relief',
    titleHi: 'आपदा एवं राहत',
    icon: '🌊',
    color: 'blue',
    helplines: [
      { name: 'NDMA Disaster Helpline', nameHi: 'राष्ट्रीय आपदा प्रबंधन', num: '1078', note: 'Disaster' },
      { name: 'State Disaster Helpline', nameHi: 'राज्य आपदा राहत', num: '1070', note: 'SDMA' },
      { name: 'Flood Control Room', nameHi: 'बाढ़ नियंत्रण कक्ष', num: '1800-180-5521', note: 'Flood' },
      { name: 'IMD Weather Warning', nameHi: 'मौसम विभाग', num: '1800-180-1717', note: 'Weather' },
    ],
  },
  {
    id: 'women',
    title: 'Women Safety & Protection',
    titleHi: 'महिला सुरक्षा एवं संरक्षण',
    icon: '👩‍⚕️',
    color: 'pink',
    helplines: [
      { name: 'Women Helpline (National)', nameHi: 'महिला राष्ट्रीय हेल्पलाइन', num: '1091', note: 'Safety' },
      { name: 'Domestic Violence Helpline', nameHi: 'घरेलू हिंसा हेल्पलाइन', num: '181', note: 'NCW' },
      { name: 'One Stop Centre (Sakhi)', nameHi: 'सखी वन स्टॉप सेंटर', num: '7827170170', note: 'WCD' },
      { name: 'Anti-Stalking & Eve Teasing', nameHi: 'पीड़ित महिला हेल्पलाइन', num: '1096', note: 'Safety' },
    ],
  },
  {
    id: 'child',
    title: 'Child Safety & Labour',
    titleHi: 'बाल सुरक्षा एवं बाल श्रम',
    icon: '👶',
    color: 'amber',
    helplines: [
      { name: 'Childline India (24×7)', nameHi: 'चाइल्डलाइन इंडिया', num: '1098', note: 'Children' },
      { name: 'Child Labour Helpline', nameHi: 'बाल श्रम हेल्पलाइन', num: '1800-425-8888', note: 'Labour' },
      { name: 'Missing Child Helpline', nameHi: 'लापता बच्चा हेल्पलाइन', num: '1094', note: 'Missing' },
      { name: 'POCSO / Child Abuse Report', nameHi: 'POCSO बाल यौन शोषण', num: '1098', note: 'NCPCR' },
    ],
  },
  {
    id: 'health',
    title: 'Health & Mental Wellness',
    titleHi: 'स्वास्थ्य एवं मानसिक स्वास्थ्य',
    icon: '🏥',
    color: 'teal',
    helplines: [
      { name: 'Health Helpline (NHM)', nameHi: 'स्वास्थ्य हेल्पलाइन', num: '104', note: 'Medical' },
      { name: 'iCall Mental Health', nameHi: 'मानसिक स्वास्थ्य सहायता', num: '9152987821', note: 'Mental' },
      { name: 'Vandrevala Foundation', nameHi: 'मनोवैज्ञानिक सहायता', num: '1860-2662-345', note: '24×7' },
      { name: 'COVID-19 Helpline', nameHi: 'कोविड-19 हेल्पलाइन', num: '1075', note: 'MOHFW' },
    ],
  },
  {
    id: 'senior',
    title: 'Senior Citizens & Disability',
    titleHi: 'वरिष्ठ नागरिक एवं दिव्यांग',
    icon: '🧓',
    color: 'purple',
    helplines: [
      { name: 'Elder Line (Senior Citizens)', nameHi: 'वरिष्ठ नागरिक हेल्पलाइन', num: '14567', note: 'Elders' },
      { name: 'Disability Helpline (NCPEDP)', nameHi: 'दिव्यांग हेल्पलाइन', num: '011-45121609', note: 'PwD' },
      { name: 'Old Age Homes Info', nameHi: 'वृद्धाश्रम जानकारी', num: '14567', note: 'WCD' },
    ],
  },
  {
    id: 'citizen',
    title: 'Citizen Services & Anti-Corruption',
    titleHi: 'नागरिक सेवाएं एवं भ्रष्टाचार विरोध',
    icon: '🏛️',
    color: 'indigo',
    helplines: [
      { name: 'PM Helpline (PMO India)', nameHi: 'प्रधानमंत्री हेल्पलाइन', num: '1800-11-7000', note: 'PMO' },
      { name: 'Anti-Corruption Helpline (CBI)', nameHi: 'भ्रष्टाचार विरोध CBI', num: '1800-11-0180', note: 'CBI' },
      { name: 'Income Tax Helpline', nameHi: 'आयकर हेल्पलाइन', num: '1800-103-0025', note: 'ITD' },
      { name: 'Consumer Helpline', nameHi: 'उपभोक्ता हेल्पलाइन', num: '1800-11-4000', note: 'NCDRC' },
    ],
  },
  {
    id: 'misc',
    title: 'Road, Rail & Other Safety',
    titleHi: 'सड़क, रेल एवं अन्य सुरक्षा',
    icon: '🚔',
    color: 'orange',
    helplines: [
      { name: 'Railway Emergency (RPF)', nameHi: 'रेलवे सुरक्षा बल', num: '182', note: 'Rail' },
      { name: 'Road Accident Emergency', nameHi: 'सड़क दुर्घटना सहायता', num: '1073', note: 'Road' },
      { name: 'Cyber Crime Helpline', nameHi: 'साइबर क्राइम हेल्पलाइन', num: '1930', note: 'Cyber' },
      { name: 'Drug De-addiction', nameHi: 'नशा मुक्ति हेल्पलाइन', num: '1800-11-0031', note: 'NCORD' },
    ],
  },
];

const COLOR_STYLES = {
  rose:   { header: 'from-rose-500 to-red-600',   badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',   border: 'border-rose-200 dark:border-rose-800/50',   callbtn: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500' },
  blue:   { header: 'from-blue-500 to-indigo-600', badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',   border: 'border-blue-200 dark:border-blue-800/50',   callbtn: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500' },
  pink:   { header: 'from-pink-500 to-fuchsia-500',badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-300',   border: 'border-pink-200 dark:border-pink-800/50',   callbtn: 'bg-pink-500/10 text-pink-600 hover:bg-pink-500 hover:text-white dark:bg-pink-500/20 dark:text-pink-300 dark:hover:bg-pink-500' },
  amber:  { header: 'from-amber-500 to-orange-500',badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800/50', callbtn: 'bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white dark:bg-amber-500/20 dark:text-amber-300 dark:hover:bg-amber-500' },
  teal:   { header: 'from-teal-500 to-emerald-600',badge: 'bg-teal-500/10 text-teal-600 dark:text-teal-300',   border: 'border-teal-200 dark:border-teal-800/50',   callbtn: 'bg-teal-500/10 text-teal-600 hover:bg-teal-500 hover:text-white dark:bg-teal-500/20 dark:text-teal-300 dark:hover:bg-teal-500' },
  purple: { header: 'from-purple-500 to-violet-600',badge:'bg-purple-500/10 text-purple-600 dark:text-purple-300',border:'border-purple-200 dark:border-purple-800/50',callbtn:'bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white dark:bg-purple-500/20 dark:text-purple-300 dark:hover:bg-purple-500' },
  indigo: { header: 'from-indigo-500 to-blue-600', badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',border:'border-indigo-200 dark:border-indigo-800/50',callbtn:'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500' },
  orange: { header: 'from-orange-500 to-red-500',  badge: 'bg-orange-500/10 text-orange-600 dark:text-orange-300',border:'border-orange-200 dark:border-orange-800/50',callbtn:'bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500' },
};

export function EmergencyHelplineSection({ lang = 'en', onDownloadPdf }) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            {lang === 'hi' ? '24×7 आपातकालीन हेल्पलाइन' : '24×7 Emergency Helplines — India'}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            📞 {lang === 'hi' ? 'भारत की सभी हेल्पलाइन नंबर' : 'All India Emergency Helpline Numbers'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'सरकारी, बाल सुरक्षा, महिला सुरक्षा, स्वास्थ्य — सभी हेल्पलाइन एक जगह'
              : 'Government · Women Safety · Child Protection · Health · Disaster — all in one place'}
          </p>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={onDownloadPdf}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-500/30 transition hover:from-rose-700 hover:to-red-700 hover:shadow-xl active:scale-95"
        >
          <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {lang === 'hi' ? 'सभी नंबर PDF डाउनलोड करें' : 'Download All as PDF'}
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {ALL_HELPLINES_CATEGORIES.map((cat) => {
          const c = COLOR_STYLES[cat.color] || COLOR_STYLES.rose;
          return (
            <div
              key={cat.id}
              className={`overflow-hidden rounded-2xl border bg-white/90 shadow-sm backdrop-blur-sm dark:bg-slate-900/80 ${c.border}`}
            >
              {/* Card header */}
              <div className={`flex items-center gap-2 bg-gradient-to-r ${c.header} px-4 py-3`}>
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <p className="text-xs font-black text-white leading-tight">
                    {lang === 'hi' ? cat.titleHi : cat.title}
                  </p>
                  <p className="text-[10px] text-white/70 font-semibold">{cat.helplines.length} numbers</p>
                </div>
              </div>

              {/* Helpline rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 px-1">
                {cat.helplines.map((h) => (
                  <div
                    key={h.num + h.name}
                    className="flex items-center justify-between gap-2 py-2.5 px-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">
                        {lang === 'hi' ? h.nameHi : h.name}
                      </p>
                      <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${c.badge}`}>
                        {h.note}
                      </span>
                    </div>
                    <a
                      href={`tel:${h.num.replace(/[-\s]/g, '')}`}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-sm font-black transition-all duration-200 ${c.callbtn}`}
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
                      </svg>
                      {h.num}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom PDF banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-rose-200/60 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 p-5 dark:border-rose-800/30 dark:from-rose-950/30 dark:via-red-950/30 dark:to-orange-950/30">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-2xl shadow-lg shadow-rose-500/30">
            📄
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'सभी हेल्पलाइन नंबर — बिना इंटरनेट के उपयोग हेतु डाउनलोड करें' : 'Download All Helpline Numbers — Use Offline Without Internet'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'hi'
                ? '30+ हेल्पलाइन · हिंदी + English · प्रिंट रेडी PDF'
                : '30+ helplines · Hindi + English · Print-ready HTML/PDF · SevaSaarthi Official'}
            </p>
          </div>
        </div>
        <button
          onClick={onDownloadPdf}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white transition hover:bg-rose-700 hover:shadow-lg active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
          </svg>
          {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
        </button>
      </div>
    </section>
  );
}
