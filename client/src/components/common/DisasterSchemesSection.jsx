/**
 * Real Government Schemes for Natural Disaster Victims (India)
 * Sources: NDMA, PM India, MyScheme portal, Ministry of Home Affairs
 */

export const DISASTER_SCHEMES = [
  {
    id: 'pmfby',
    icon: '🌾',
    category: 'Agriculture',
    categoryColor: 'emerald',
    title: 'PM Fasal Bima Yojana (PMFBY)',
    titleHi: 'प्रधानमंत्री फसल बीमा योजना',
    description: 'Crop insurance covering losses due to floods, drought, cyclone, hailstorm & other natural calamities. Premium as low as 2% for Kharif crops.',
    descHi: 'बाढ़, सूखा, चक्रवात, ओलावृष्टि से फसल नुकसान का बीमा। खरीफ फसलों के लिए मात्र 2% प्रीमियम।',
    eligibility: 'All farmers with land records',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    benefit: 'Up to ₹2 lakh crop loss coverage',
    link: 'https://pmfby.gov.in',
    applyLink: 'https://pmfby.gov.in/farmerRegistrationForm',
  },
  {
    id: 'sdrf',
    icon: '🏠',
    category: 'Relief Fund',
    categoryColor: 'blue',
    title: 'SDRF — State Disaster Relief Fund',
    titleHi: 'राज्य आपदा राहत कोष (SDRF)',
    description: 'Financial assistance to families affected by natural disasters — house damage, loss of life, cattle, crops and livelihoods. Administered by State Govts.',
    descHi: 'प्राकृतिक आपदा से प्रभावित परिवारों को घर, जीवन, मवेशी, फसल नुकसान पर राहत राशि।',
    eligibility: 'BPL & APL families affected by disaster',
    ministry: 'NDMA / State Disaster Management Authority',
    benefit: '₹1.2 lakh for house damage, ₹4 lakh death ex-gratia',
    link: 'https://ndma.gov.in/Relief/SDRF',
    applyLink: 'https://ndma.gov.in/Relief/SDRF',
  },
  {
    id: 'pmay-gramin',
    icon: '🏡',
    category: 'Housing',
    categoryColor: 'orange',
    title: 'PM Awas Yojana — Gramin (PMAY-G)',
    titleHi: 'प्रधानमंत्री आवास योजना-ग्रामीण',
    description: 'Reconstruction of pucca houses for families whose homes were destroyed in floods, cyclones or earthquakes. Priority for disaster-affected beneficiaries.',
    descHi: 'बाढ़, चक्रवात या भूकंप में घर टूटने पर पक्के घर के निर्माण के लिए प्राथमिकता सहायता।',
    eligibility: 'Homeless / disaster-hit rural families',
    ministry: 'Ministry of Rural Development',
    benefit: '₹1.2–1.5 lakh for house construction',
    link: 'https://pmayg.nic.in',
    applyLink: 'https://pmayg.nic.in/netiay/home.aspx',
  },
  {
    id: 'nrlm',
    icon: '💼',
    category: 'Livelihood',
    categoryColor: 'purple',
    title: 'DAY-NRLM — Livelihood Restoration',
    titleHi: 'दीनदयाल अंत्योदय योजना-NRLM',
    description: 'Rapid livelihood restoration support for disaster-affected rural households — seed capital, credit linkage and SHG support to rebuild income.',
    descHi: 'आपदा प्रभावित ग्रामीण परिवारों को आजीविका पुनर्निर्माण हेतु बीज पूंजी, ऋण सहायता।',
    eligibility: 'Rural households affected by disaster',
    ministry: 'Ministry of Rural Development',
    benefit: 'Up to ₹15,000 seed capital + bank credit linkage',
    link: 'https://aajeevika.gov.in',
    applyLink: 'https://aajeevika.gov.in/content/apply-scheme',
  },
  {
    id: 'pmjdy',
    icon: '🏦',
    category: 'Financial Aid',
    categoryColor: 'teal',
    title: 'PM Jan Dhan Yojana — Overdraft',
    titleHi: 'प्रधानमंत्री जन धन योजना',
    description: 'Disaster-hit account holders get ₹10,000 emergency overdraft and accident insurance of ₹1–2 lakh. Immediate cash relief through DBT.',
    descHi: 'आपदा प्रभावित खाताधारकों को ₹10,000 ओवरड्राफ्ट व ₹1-2 लाख दुर्घटना बीमा।',
    eligibility: 'Jan Dhan account holders',
    ministry: 'Ministry of Finance / DBT',
    benefit: '₹10,000 OD + ₹2 lakh accident insurance',
    link: 'https://pmjdy.gov.in',
    applyLink: 'https://pmjdy.gov.in/account',
  },
  {
    id: 'nhm-disaster',
    icon: '🏥',
    category: 'Health',
    categoryColor: 'rose',
    title: 'NHM Disaster Health Response',
    titleHi: 'राष्ट्रीय स्वास्थ्य मिशन — आपदा स्वास्थ्य',
    description: 'Free medical camps, medicines, disease surveillance and mental health support for disaster-affected communities under NHM rapid response teams.',
    descHi: 'आपदा प्रभावित क्षेत्रों में NHM द्वारा मुफ्त चिकित्सा शिविर, दवाएं और मानसिक स्वास्थ्य सहायता।',
    eligibility: 'All disaster-affected persons',
    ministry: 'Ministry of Health & Family Welfare',
    benefit: 'Free treatment, medicines & mental health counseling',
    link: 'https://nhm.gov.in',
    applyLink: 'https://nhm.gov.in/index1.php?lang=1&level=1&sublinkid=971&lid=154',
  },
  {
    id: 'myscheme',
    icon: '🔍',
    category: 'All Schemes',
    categoryColor: 'indigo',
    title: 'MyScheme — Find All Disaster Schemes',
    titleHi: 'माई स्कीम — सभी योजनाएं खोजें',
    description: 'Official Government of India portal to discover 13,000+ schemes. Filter by disaster type, state, income, age to find schemes you are eligible for.',
    descHi: 'भारत सरकार का आधिकारिक पोर्टल — 13,000+ योजनाएं, आपदा प्रकार और राज्य से फ़िल्टर करें।',
    eligibility: 'All Indian citizens',
    ministry: 'Ministry of Electronics & IT (MeitY)',
    benefit: 'Discover 13,000+ central & state schemes',
    link: 'https://www.myscheme.gov.in/search/category/disaster-management',
    applyLink: 'https://www.myscheme.gov.in/search/category/disaster-management',
  },
  {
    id: 'aapda-mitra',
    icon: '🤝',
    category: 'Volunteer',
    categoryColor: 'amber',
    title: 'Aapda Mitra Scheme',
    titleHi: 'आपदा मित्र योजना',
    description: 'NDMA trains community volunteers as Aapda Mitras for first response during floods, earthquakes & cyclones. Register as a community disaster responder.',
    descHi: 'NDMA द्वारा सामुदायिक स्वयंसेवकों को बाढ़, भूकंप, चक्रवात में प्रथम प्रतिक्रिया हेतु प्रशिक्षित करती है।',
    eligibility: 'Volunteers aged 18–45 with literacy',
    ministry: 'NDMA — National Disaster Management Authority',
    benefit: 'Free training, stipend & relief kit',
    link: 'https://ndma.gov.in/Awareness/aapda-mitra',
    applyLink: 'https://ndma.gov.in/Awareness/aapda-mitra',
  },
];

const COLOR_MAP = {
  emerald: { badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', accent: 'from-emerald-500 to-teal-500', ring: 'group-hover:ring-emerald-400/50' },
  blue: { badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30', accent: 'from-blue-500 to-indigo-500', ring: 'group-hover:ring-blue-400/50' },
  orange: { badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30', accent: 'from-orange-500 to-amber-500', ring: 'group-hover:ring-orange-400/50' },
  purple: { badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30', accent: 'from-purple-500 to-fuchsia-500', ring: 'group-hover:ring-purple-400/50' },
  teal: { badge: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30', accent: 'from-teal-500 to-cyan-500', ring: 'group-hover:ring-teal-400/50' },
  rose: { badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30', accent: 'from-rose-500 to-pink-500', ring: 'group-hover:ring-rose-400/50' },
  indigo: { badge: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30', accent: 'from-indigo-500 to-blue-600', ring: 'group-hover:ring-indigo-400/50' },
  amber: { badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30', accent: 'from-amber-500 to-orange-500', ring: 'group-hover:ring-amber-400/50' },
};

export function DisasterSchemesSection({ lang = 'en' }) {
  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
            {lang === 'hi' ? 'सरकारी योजनाएं' : 'Government Relief Schemes'}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {lang === 'hi' ? '🛡️ आपदा पीड़ितों के लिए सरकारी योजनाएं' : '🛡️ Schemes for Disaster Victims'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'NDMA · PM India · राज्य सरकार की आधिकारिक योजनाएं — सीधे आवेदन करें'
              : 'Official NDMA · PM India · State Govt schemes — apply directly with one click'}
          </p>
        </div>
        <a
          href="https://www.myscheme.gov.in/search/category/disaster-management"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-300/50 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
        >
          View All Schemes ↗
        </a>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {DISASTER_SCHEMES.map((scheme) => {
          const colors = COLOR_MAP[scheme.categoryColor] || COLOR_MAP.indigo;
          return (
            <div
              key={scheme.id}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/80 ring-2 ring-transparent ${colors.ring}`}
            >
              {/* Top gradient accent bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${colors.accent} shrink-0`} />

              <div className="flex flex-1 flex-col gap-3 p-4">
                {/* Icon + Category */}
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${colors.accent} text-2xl shadow-md`}>
                    {scheme.icon}
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colors.badge}`}>
                    {scheme.category}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-black leading-snug text-slate-900 dark:text-white">
                    {lang === 'hi' ? scheme.titleHi : scheme.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                    {scheme.ministry}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                  {lang === 'hi' ? scheme.descHi : scheme.description}
                </p>

                {/* Benefit pill */}
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                  <span className="text-xs">💰</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {scheme.benefit}
                  </span>
                </div>

                {/* Eligibility */}
                <p className="text-[11px] text-slate-500 dark:text-slate-500 flex items-center gap-1">
                  <span>✅</span>
                  <span>{scheme.eligibility}</span>
                </p>

                {/* CTA Buttons */}
                <div className="mt-auto flex gap-2 pt-1">
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Learn More ↗
                  </a>
                  <a
                    href={scheme.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 rounded-xl bg-gradient-to-r ${colors.accent} py-2 text-center text-xs font-black text-white shadow-sm transition hover:opacity-90 hover:shadow-md`}
                  >
                    Apply Now →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Banner — MyScheme Portal */}
      <a
        href="https://www.myscheme.gov.in"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between gap-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 p-5 transition hover:shadow-lg dark:border-indigo-500/20 dark:from-indigo-950/40 dark:via-blue-950/40 dark:to-purple-950/40"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl shadow-lg">
            🇮🇳
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'माई स्कीम — 13,000+ सरकारी योजनाएं एक जगह' : 'MyScheme.gov.in — 13,000+ Government Schemes in One Place'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi'
                ? 'अपनी पात्रता के अनुसार योजनाएं खोजें · आधिकारिक MeitY पोर्टल'
                : 'Find schemes by eligibility, disaster type & state · Official MeitY portal'}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-black text-white transition group-hover:bg-indigo-700">
          Explore ↗
        </span>
      </a>
    </section>
  );
}
