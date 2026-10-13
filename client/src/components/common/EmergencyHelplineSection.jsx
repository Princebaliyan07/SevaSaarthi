/**
 * ALL_HELPLINES — Complete India Emergency & Citizen Helpline Directory
 * Categorized, verified official numbers
 *
 * Emergency Red / Crimson design theme for authentic national emergency readiness.
 */
export const ALL_HELPLINES_CATEGORIES = [
  {
    id: 'emergency',
    title: 'Core Emergency Services',
    titleHi: 'मुख्य आपातकालीन सेवाएं',
    icon: '🚨',
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
    helplines: [
      { name: 'Railway Emergency (RPF)', nameHi: 'रेलवे सुरक्षा बल', num: '182', note: 'Rail' },
      { name: 'Road Accident Emergency', nameHi: 'सड़क दुर्घटना सहायता', num: '1073', note: 'Road' },
      { name: 'Cyber Crime Helpline', nameHi: 'साइबर क्राइम हेल्पलाइन', num: '1930', note: 'Cyber' },
      { name: 'Drug De-addiction', nameHi: 'नशा मुक्ति हेल्पलाइन', num: '1800-11-0031', note: 'NCORD' },
    ],
  },
];

export function EmergencyHelplineSection({ lang = 'en', onDownloadPdf }) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-bold text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            {lang === 'hi' ? '24×7 राष्ट्रीय आपातकालीन हेल्पलाइन' : '24×7 All-India Emergency Helplines'}
          </div>
          <h2 className="border-l-4 border-red-600 pl-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {lang === 'hi' ? 'भारत की सभी आपातकालीन हेल्पलाइन नंबर' : 'All India Emergency Helpline Directory'}
          </h2>
          <p className="pl-4 text-sm font-medium text-slate-500 sm:text-base dark:text-slate-400">
            {lang === 'hi'
              ? 'सरकारी, बाल सुरक्षा, महिला सुरक्षा, स्वास्थ्य — सभी हेल्पलाइन एक जगह'
              : 'Government · Women Safety · Child Protection · Health · Disaster — all in one place'}
          </p>
        </div>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={onDownloadPdf}
          className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-600/20 transition hover:from-red-700 hover:to-red-800 hover:shadow-xl active:scale-95"
        >
          <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {lang === 'hi' ? 'सभी नंबर PDF डाउनलोड करें' : 'Download All as PDF'}
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {ALL_HELPLINES_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="overflow-hidden rounded-2xl border border-red-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/15 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-red-600/50"
          >
            {/* Authentic Emergency Red Card Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-600 via-red-600 to-red-700 px-4 py-3 dark:from-red-700 dark:to-red-800">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 text-lg text-white shadow-xs backdrop-blur-xs ring-1 ring-white/30">
                {cat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black leading-tight text-white">
                  {lang === 'hi' ? cat.titleHi : cat.title}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-red-100">
                  {cat.helplines.length} {lang === 'hi' ? 'हेल्पलाइन' : 'numbers'}
                </p>
              </div>
            </div>

            {/* Helpline rows */}
            <div className="divide-y divide-slate-100 px-1 dark:divide-slate-800">
              {cat.helplines.map((h) => (
                <div
                  key={h.num + h.name}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/20"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold leading-tight text-slate-800 dark:text-slate-100">
                      {lang === 'hi' ? h.nameHi : h.name}
                    </p>
                    <span className="mt-1 inline-block rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                      {h.note}
                    </span>
                  </div>
                  <a
                    href={`tel:${h.num.replace(/[-\s]/g, '')}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 font-mono text-xs sm:text-sm font-black text-emerald-800 transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
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
        ))}
      </div>

      {/* Bottom Offline PDF banner */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-amber-50/40 p-5 sm:flex-row dark:border-red-900/40 dark:from-slate-900 dark:to-red-950/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-700 text-2xl text-white shadow-lg shadow-red-600/20">
            📄
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'सभी हेल्पलाइन नंबर — बिना इंटरनेट के उपयोग हेतु डाउनलोड करें' : 'Download All Helpline Numbers — Use Offline Without Internet'}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi'
                ? '30+ हेल्पलाइन · हिंदी + English · प्रिंट रेडी PDF'
                : '30+ helplines · Hindi + English · Print-ready HTML/PDF · SevaSaarthi Official'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-black text-white shadow-md shadow-red-600/20 transition hover:bg-red-700 hover:shadow-lg active:scale-95"
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