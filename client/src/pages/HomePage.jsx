import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyHelplineSection } from '../components/common/EmergencyHelplineSection';
import { downloadAllHelplinesPdf } from '../utils/guideGenerator';

// Real Impact Stories matching Photo 3
const IMPACT_STORIES = [
  {
    id: 'assam-flood',
    tag: 'FLOOD RESPONSE',
    tagColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    title: 'Community Volunteers Save Trapped Families in Assam',
    titleHi: 'असम में स्वयंसेवकों ने बाढ़ में फंसे परिवारों को बचाया',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
    location: 'Brahmaputra Basin, Assam',
  },
  {
    id: 'odisha-cyclone',
    tag: 'PREPAREDNESS',
    tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    title: 'Cyclone Preparedness Drives in Coastal Odisha',
    titleHi: 'तटीय ओडिशा में चक्रवात पूर्व सुरक्षा और जागरूकता अभियान',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    location: 'Puri & Kendrapara, Odisha',
  },
  {
    id: 'uttarakhand-landslide',
    tag: 'LANDSLIDE RELIEF',
    tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    title: 'Local Youth Network Reaches Remote Villages in Uttarakhand',
    titleHi: 'उत्तराखंड के दूरदराज गांवों तक पहुंचे स्थानीय युवा स्वयंसेवक',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    location: 'Chamoli & Rudraprayag, UK',
  },
];

// 5-Step Workflow matching Photo 3 "How SevaSaarthi Works"
const WORKFLOW_STEPS = [
  {
    step: '1',
    numColor: 'bg-rose-500 text-white',
    ringColor: 'ring-rose-500/20',
    title: 'Report & Share',
    titleHi: 'रिपोर्ट व साझा करें',
    desc: 'Citizens report incidents and relief needs in real time.',
    descHi: 'नागरिक वास्तविक समय में घटनाओं और राहत आवश्यकताओं की रिपोर्ट करते हैं।',
  },
  {
    step: '2',
    numColor: 'bg-teal-600 text-white',
    ringColor: 'ring-teal-600/20',
    title: 'Verify & Coordinate',
    titleHi: 'सत्यापन व समन्वय',
    desc: 'Information is verified and mapped onto live GIS grid.',
    descHi: 'डेटा का सत्यापन कर लाइव जीआईएस ग्रिड पर मैप किया जाता है।',
  },
  {
    step: '3',
    numColor: 'bg-emerald-600 text-white',
    ringColor: 'ring-emerald-600/20',
    title: 'Mobilize Resources',
    titleHi: 'संसाधन जुटाएं',
    desc: 'Volunteers, relief kits and authorities are alerted instantly.',
    descHi: 'स्वयंसेवकों, राहत किटों और स्थानीय प्रशासन को तुरंत अलर्ट भेजा जाता है।',
  },
  {
    step: '4',
    numColor: 'bg-indigo-600 text-white',
    ringColor: 'ring-indigo-600/20',
    title: 'Take Action',
    titleHi: 'त्वरित कार्रवाई',
    desc: 'On-ground response, medical triage and support are delivered.',
    descHi: 'धरातल पर आपातकालीन राहत, चिकित्सा और सहायता प्रदान की जाती है।',
  },
  {
    step: '5',
    numColor: 'bg-amber-500 text-slate-950 font-black',
    ringColor: 'ring-amber-500/20',
    title: 'Build Resilient Communities',
    titleHi: 'सक्षम समुदाय निर्माण',
    desc: 'Continuous learning and preparedness for a safer future.',
    descHi: 'सुरक्षित भविष्य के लिए निरंतर आपदा प्रबंधन व क्षमता निर्माण।',
  },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  return (
    <div className="container-page py-6 sm:py-10 space-y-12">
      {/* 1. Hero Section (Photo 3 Theme) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-10 lg:p-12 shadow-sm backdrop-blur-xl dark:border-slate-800">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/15" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl dark:bg-brand/15" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                <span>{hi ? 'मजबूत समुदाय' : 'Stronger Communities'}</span>
                <span className="block text-teal-600 dark:text-teal-400 mt-1">
                  {hi ? 'सुरक्षित भारत' : 'Safer India'}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {hi
                  ? 'सुरक्षित और आपदा-प्रतिरोधी भारत के लिए लोगों, संसाधनों और वास्तविक समय की जानकारी को आपस में जोड़ना।'
                  : 'Connecting people, resources and real-time information for a safer, more resilient India.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/emergency"
                className="btn bg-slate-950 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 font-black text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>{hi ? 'घटना की रिपोर्ट करें' : 'Report an Incident'}</span>
                <span>→</span>
              </Link>
              <Link
                to="/volunteers"
                className="btn-outline text-sm font-bold px-5 py-3 rounded-xl shadow-xs"
              >
                {hi ? 'स्वयंसेवक के रूप में जुड़ें' : 'Join as Volunteer'}
              </Link>
              <Link
                to="/resources"
                className="btn-outline text-sm font-bold px-5 py-3 rounded-xl shadow-xs"
              >
                {hi ? 'संसाधनों तक पहुंचें' : 'Access Resources'}
              </Link>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              {hi
                ? 'जागरूक बनें · सतर्क रहें · बदलाव के वाहक बनें'
                : 'Be informed · Be prepared · Be a changemaker'}
            </p>
          </div>

          {/* Right Hero Image Card (Photo 3) */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80"
                alt="SevaSaarthi Community Volunteer Response"
                className="w-full h-72 sm:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Floating Badge Card inside image */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white space-y-1.5 shadow-xl">
                <p className="text-xs font-black uppercase tracking-wider text-teal-400">
                  {hi ? 'आज की तैयारी, सुरक्षित कल' : 'Communities Prepared Today, Resilient Tomorrow.'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">Knowledge</span>
                  <span>·</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">Coordination</span>
                  <span>·</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded-md font-semibold">Collective Action</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Metric Bar (Photo 3) */}
      <section className="glass-card p-5 sm:p-6 shadow-sm border-slate-200/80 dark:border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Stat 1 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-xl text-rose-600 dark:text-rose-400">
              🚨
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">24</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'सक्रिय अलर्ट' : 'Active Incident Alerts'}
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-xl text-teal-600 dark:text-teal-400">
              👥
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">3,200+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'पंजीकृत स्वयंसेवक' : 'Registered Volunteers'}
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-600 dark:text-emerald-400">
              📦
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">1,050+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'संसाधन सूचीबद्ध' : 'Resources Listed'}
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-600 dark:text-amber-400">
              🏛️
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">112</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'जिले शामिल' : 'Districts Covered'}
              </p>
            </div>
          </div>

          {/* Stat 5 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-600 dark:text-indigo-400">
              📢
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">18</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'जागरूकता अभियान' : 'Awareness Campaigns'}
              </p>
            </div>
          </div>

          {/* Stat 6 */}
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-600 dark:text-cyan-400">
              🛡️
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">5,000+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'लोग लाभान्वित' : 'People Reached'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Two Columns: Quick Actions + Real Impact, Real People (Photo 3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {hi ? 'त्वरित कार्रवाई' : 'Quick Actions'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hi ? 'सुरक्षित और मजबूत भारत के निर्माण में भागीदार बनें।' : 'Take action and be part of a safer, stronger India.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Action 1: Report an Incident */}
            <Link
              to="/emergency"
              className="group glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-rose-400/60 hover:shadow-lg transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-2xl dark:bg-rose-950/40 group-hover:scale-110 transition-transform">
                🚨
              </span>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  {hi ? 'घटना की रिपोर्ट' : 'Report an Incident'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {hi ? 'वास्तविक समय में जानकारी साझा करें' : 'Share real-time information'}
                </p>
              </div>
            </Link>

            {/* Action 2: Become a Volunteer */}
            <Link
              to="/volunteers"
              className="group glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-teal-400/60 hover:shadow-lg transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-2xl dark:bg-teal-950/40 group-hover:scale-110 transition-transform">
                🤝
              </span>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                  {hi ? 'स्वयंसेवक बनें' : 'Become a Volunteer'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {hi ? 'राहत और जागरूकता में शामिल हों' : 'Join relief & awareness efforts'}
                </p>
              </div>
            </Link>

            {/* Action 3: Find Resources */}
            <Link
              to="/resources"
              className="group glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-lg transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl dark:bg-emerald-950/40 group-hover:scale-110 transition-transform">
                📖
              </span>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {hi ? 'संसाधन खोजें' : 'Find Resources'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {hi ? 'गाइड, हेल्पलाइन और टूलकिट देखें' : 'Access guides, helplines & toolkits'}
                </p>
              </div>
            </Link>

            {/* Action 4: Spread Awareness */}
            <Link
              to="/disaster"
              className="group glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-1 hover:border-indigo-400/60 hover:shadow-lg transition-all"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-2xl dark:bg-indigo-950/40 group-hover:scale-110 transition-transform">
                📢
              </span>
              <div className="mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {hi ? 'जागरूकता फैलाएं' : 'Spread Awareness'}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {hi ? 'सक्षम समुदाय निर्माण में मदद करें' : 'Help build resilient communities'}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Real Impact, Real People (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {hi ? 'वास्तविक प्रभाव, वास्तविक लोग' : 'Real Impact, Real People'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {hi ? 'जमीनी स्तर पर बदलाव लाती स्वयंसेवकों की कहानियां।' : 'Ground-level volunteer stories making real difference.'}
              </p>
            </div>
            <Link
              to="/volunteers"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>{hi ? 'सभी कहानियां देखें' : 'View All Stories'}</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {IMPACT_STORIES.map((story) => (
              <div
                key={story.id}
                className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${story.tagColor} bg-white/90 dark:bg-slate-950/80`}
                  >
                    {story.tag}
                  </span>
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                    {hi ? story.titleHi : story.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <span>📍</span>
                    <span>{story.location}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How SevaSaarthi Works (Photo 3) */}
      <section className="glass-card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>{hi ? 'सेवा सारथी कैसे कार्य करता है' : 'How SevaSaarthi Works'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hi
              ? 'सूचना से समाधान तक — आपदा प्रबंधन और त्वरित जनसहयोग की सशक्त प्रक्रिया।'
              : 'From information to action — together for resilient communities.'}
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {WORKFLOW_STEPS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-4 space-y-3 transition-all hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-sm ring-4 ${s.numColor} ${s.ringColor}`}
                >
                  {s.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {hi ? s.titleHi : s.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {hi ? s.descHi : s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. All-India Emergency Helplines (Kept as requested) */}
      <section id="emergency-helplines" className="scroll-mt-24">
        <EmergencyHelplineSection lang={lang} onDownloadPdf={downloadAllHelplinesPdf} />
      </section>
    </div>
  );
}
