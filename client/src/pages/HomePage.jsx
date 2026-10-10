import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EmergencyHelplineSection } from '../components/common/EmergencyHelplineSection';
import { downloadAllHelplinesPdf } from '../utils/guideGenerator';

// 9 Comprehensive Quick Access Citizen Actions requested by user
const QUICK_ACCESS_ITEMS = [
  {
    key: 'report',
    icon: '🚨',
    title: 'Report an Incident',
    titleHi: 'घटना की रिपोर्ट करें',
    subtitle: 'Share real-time incident information',
    subtitleHi: 'वास्तविक समय में घटना की जानकारी साझा करें',
    to: '/emergency',
    pill: 'Emergency SOS',
    pillColor: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    cardBorder: 'hover:border-rose-400/80 hover:shadow-rose-500/10',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600',
  },
  {
    key: 'first-aid',
    icon: '⚡',
    title: 'Instant Medical Help in 2–3 Min',
    titleHi: '2-3 मिनट में त्वरित प्राथमिक चिकित्सा',
    subtitle: 'Doctors, nurses & NCC/NSS volunteers nearby',
    subtitleHi: 'निकटतम डॉक्टर, नर्स व एनसीसी/एनएसएस स्वयंसेवक',
    to: '/healthcare',
    pill: 'Uber for First Aid',
    pillColor: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    cardBorder: 'hover:border-teal-400/80 hover:shadow-teal-500/10',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600',
  },
  {
    key: 'hospital',
    icon: '🏥',
    title: 'Find Hospital & Emergency Care',
    titleHi: 'अस्पताल व आपातकालीन कक्ष खोजें',
    subtitle: 'Locate nearest govt & private hospitals with live directions',
    subtitleHi: 'निकटतम सरकारी व निजी अस्पताल और सटीक मैप्स दिशा-निर्देश',
    to: '/healthcare',
    pill: 'Live Maps',
    pillColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    cardBorder: 'hover:border-emerald-400/80 hover:shadow-emerald-500/10',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600',
  },
  {
    key: 'alerts',
    icon: '📡',
    title: 'See Live Disaster Alerts',
    titleHi: 'लाइव आपदा एवं मौसम अलर्ट देखें',
    subtitle: 'All-India GIS radar, IMD nowcast & earthquake array',
    subtitleHi: 'अखिल भारतीय जीआईएस रडार व मौसम विज्ञान विभाग अलर्ट',
    to: '/disaster',
    pill: 'Satellite Feeds',
    pillColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    cardBorder: 'hover:border-amber-400/80 hover:shadow-amber-500/10',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600',
  },
  {
    key: 'schemes',
    icon: '🏛️',
    title: 'Schemes for Disaster Victims',
    titleHi: 'आपदा पीड़ितों के लिए सरकारी योजनाएं',
    subtitle: 'Compensation, NDRF/SDRF, PMFBY & relief subsidies',
    subtitleHi: 'मुआवजा, एसडीआरएफ/एनडीआरएफ व राहत सहायता योजनाएं',
    to: '/disaster',
    pill: 'Govt Portals',
    pillColor: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    cardBorder: 'hover:border-indigo-400/80 hover:shadow-indigo-500/10',
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600',
  },
  {
    key: 'mela-missing',
    icon: '🔍',
    title: 'Find Missing Person & Things',
    titleHi: 'लापता व्यक्ति व सामान खोजें',
    subtitle: 'Mela Suraksha AI face-tag & lost/found reunification',
    subtitleHi: 'मेला सुरक्षा एआई फेस-टैग व खोया-पाया पुनर्मिलन केंद्र',
    to: '/mela',
    pill: 'Mela Suraksha',
    pillColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    cardBorder: 'hover:border-purple-400/80 hover:shadow-purple-500/10',
    iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600',
  },
  {
    key: 'volunteer',
    icon: '🤝',
    title: 'Become a Volunteer',
    titleHi: 'स्वयंसेवक के रूप में जुड़ें',
    subtitle: 'Join grassroots relief teams, medicine drops & drills',
    subtitleHi: 'जमीनी राहत दल, दवा वितरण व मॉक ड्रिल में शामिल हों',
    to: '/volunteers',
    pill: 'Community Relief',
    pillColor: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30',
    cardBorder: 'hover:border-pink-400/80 hover:shadow-pink-500/10',
    iconBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-600',
  },
  {
    key: 'resources',
    icon: '📚',
    title: 'Find Resources & Guides',
    titleHi: 'गाइड, हैंडबुक व संसाधन खोजें',
    subtitle: 'NDMA standard bilingual protocols & disaster kits',
    subtitleHi: 'एनडीएमए प्रमाणित द्विभाषी सुरक्षा प्रोटोकॉल व किट',
    to: '/resources',
    pill: 'Free Downloads',
    pillColor: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    cardBorder: 'hover:border-sky-400/80 hover:shadow-sky-500/10',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600',
  },
  {
    key: 'medicines',
    icon: '💊',
    title: 'Affordable Generic Medicines',
    titleHi: 'सस्ती जन औषधि जेनेरिक दवाएं',
    subtitle: 'Jan Aushadhi matcher with 50+ medicines & 70%+ savings',
    subtitleHi: '50+ जेनेरिक दवाएं और 70% से अधिक की सीधी बचत',
    to: '/healthcare',
    pill: 'Jan Aushadhi',
    pillColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    cardBorder: 'hover:border-cyan-400/80 hover:shadow-cyan-500/10',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600',
  },
];

// The 4 Core Integrated Pillars (Health, Disaster, Medical, Mela)
const CORE_PILLARS = [
  {
    id: 'health',
    title: 'Healthcare & Medical',
    titleHi: 'स्वास्थ्य एवं चिकित्सा सेवा',
    desc: 'Emergency nearest hospital routing, 50+ Jan Aushadhi generic medicines with autocomplete price comparison, and duty doctor consultations.',
    descHi: 'निकटतम आपातकालीन अस्पताल, 50+ जन औषधि जेनेरिक दवाएं मूल्य तुलना के साथ एवं सत्यापित ड्यूटी डॉक्टर।',
    icon: '🩺',
    to: '/healthcare',
    badge: 'Medical & Care',
    color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-700 dark:text-teal-300',
    ctaText: 'Open Health Hub →',
  },
  {
    id: 'first-responder',
    title: 'First Responder Network',
    titleHi: 'त्वरित फर्स्ट रिस्पॉन्डर नेटवर्क',
    desc: '"Uber for First Aid": Registered doctors, nurses, and NCC/NSS volunteers reach patients in 2-3 minutes before ambulances arrive with live GPS distance.',
    descHi: 'प्राथमिक उपचार हेतु "उबर": एम्बुलेंस पहुंचने से पहले 2-3 मिनट में पहुंचने वाले डॉक्टर, नर्स व एनसीसी/एनएसएस स्वयंसेवक।',
    icon: '⚡',
    to: '/healthcare',
    badge: '2-3 Min Arrival',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
    ctaText: 'View Network →',
  },
  {
    id: 'disaster',
    title: 'Disaster Saarthi & GIS Radar',
    titleHi: 'आपदा सारथी एवं जीआईएस रडार',
    desc: 'All-India live satellite radar fed by NDMA SACHET, NASA EONET and USGS Seismic Array, video survival guides, and victim relief schemes.',
    descHi: 'उपग्रह आधारित लाइव जीआईएस रडार, एनडीएमए अलर्ट, प्रमाणित आपदा जीवन-रक्षा वीडियो और सरकारी राहत योजनाएं।',
    icon: '🌪️',
    to: '/disaster',
    badge: 'GIS & Early Warning',
    color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
    ctaText: 'Open Disaster Radar →',
  },
  {
    id: 'mela',
    title: 'Mela Suraksha & Crowd Safety',
    titleHi: 'मेला सुरक्षा एवं भीड़ नियंत्रण',
    desc: 'Mass gathering crowd density heatmaps, pontoon bridge capacity trackers, AI face-tag lost and missing person/belongings reunification.',
    descHi: 'महाकुंभ व धार्मिक मेलों हेतु भीड़ घनत्व हीटमैप, पांटून पुल नेविगेशन और लापता व्यक्ति/सामान पुनर्मिलन केंद्र।',
    icon: '🕉️',
    to: '/mela',
    badge: 'Crowd & Reunification',
    color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
    ctaText: 'Explore Mela Safety →',
  },
];

// Real Impact Stories
const IMPACT_STORIES = [
  {
    id: 'assam-flood',
    tag: 'FLOOD RESPONSE',
    tagColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    title: 'Community Volunteers Save Trapped Families in Assam',
    titleHi: 'असम में स्वयंसेवकों ने बाढ़ में फंसे परिवारों को बचाया',
    image: '/help-alerts.jpg',
    location: 'Brahmaputra Basin, Assam',
  },
  {
    id: 'odisha-cyclone',
    tag: 'FIRST RESPONDER',
    tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    title: 'Rapid 2-3 Min First Aid Reaches Rural & Semi-Urban Clusters',
    titleHi: '2-3 मिनट में त्वरित प्राथमिक चिकित्सा सहायता',
    image: '/help-responder.jpg',
    location: 'Cuttack & Khordha, Odisha',
  },
  {
    id: 'uttarakhand-landslide',
    tag: 'COMMUNITY SEVA',
    tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    title: 'Youth & NCC Network Delivers Vital Supplies & Medical Relief',
    titleHi: 'युवा और एनसीसी नेटवर्क ने पहुंचाई जीवनरक्षक सामग्री व सहायता',
    image: '/help-volunteers.jpg',
    location: 'Prayagraj & Uttarakhand Foothills',
  },
];

// 5-Step Workflow
const WORKFLOW_STEPS = [
  {
    step: '1',
    numColor: 'bg-rose-500 text-white',
    ringColor: 'ring-rose-500/20',
    title: 'Report & Share',
    titleHi: 'रिपोर्ट व साझा करें',
    desc: 'Citizens report medical emergencies, missing persons, or disasters.',
    descHi: 'नागरिक चिकित्सा आपातकाल, लापता व्यक्ति या आपदा की तत्काल रिपोर्ट करते हैं।',
  },
  {
    step: '2',
    numColor: 'bg-teal-600 text-white',
    ringColor: 'ring-teal-600/20',
    title: 'Verify & Coordinate',
    titleHi: 'सत्यापन व समन्वय',
    desc: 'Information is mapped onto real-time GIS situational telemetry.',
    descHi: 'डेटा का सत्यापन कर लाइव जीआईएस ग्रिड पर तुरंत मैप किया जाता है।',
  },
  {
    step: '3',
    numColor: 'bg-emerald-600 text-white',
    ringColor: 'ring-emerald-600/20',
    title: 'Mobilize Responders',
    titleHi: 'संसाधन जुटाएं',
    desc: 'Nearby doctors, NCC volunteers and emergency teams are alerted.',
    descHi: 'निकटतम डॉक्टर, एनसीसी स्वयंसेवक और आपातकालीन दल सक्रिय होते हैं।',
  },
  {
    step: '4',
    numColor: 'bg-indigo-600 text-white',
    ringColor: 'ring-indigo-600/20',
    title: 'Rapid Action',
    titleHi: 'त्वरित कार्रवाई',
    desc: '2-3 minute on-ground first aid, ambulance routing & shelter dispatch.',
    descHi: '2-3 मिनट में प्राथमिक उपचार, एम्बुलेंस सहायता व सुरक्षित आश्रय।',
  },
  {
    step: '5',
    numColor: 'bg-amber-500 text-slate-950 font-black',
    ringColor: 'ring-amber-500/20',
    title: 'Resilient Communities',
    titleHi: 'सक्षम समुदाय निर्माण',
    desc: 'Continuous capacity building for a safer, disaster-resilient India.',
    descHi: 'सुरक्षित व आपदा-प्रतिरोधी भारत के लिए निरंतर सामुदायिक सशक्तीकरण।',
  },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';

  return (
    <div className="container-page py-6 sm:py-10 space-y-12">
      {/* 1. Hero Section (Highlighting Health, Disaster, Medical, Mela) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 dark:bg-slate-900/70 p-6 sm:p-10 lg:p-12 shadow-sm backdrop-blur-xl dark:border-slate-800">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/15" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl dark:bg-brand/15" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Pillars Header Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-800 dark:text-teal-300">
                <span>🩺</span>
                <span>{hi ? 'स्वास्थ्य एवं चिकित्सा' : 'Healthcare & Medical'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                <span>🌪️</span>
                <span>{hi ? 'आपदा प्रबंधन एवं रडार' : 'Disaster Radar & Schemes'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-800 dark:text-purple-300">
                <span>🕉️</span>
                <span>{hi ? 'मेला सुरक्षा' : 'Mela Crowd Safety'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-800 dark:text-rose-300">
                <span>🚨</span>
                <span>{hi ? 'आपातकाल 112' : 'Emergency 112 Hub'}</span>
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                <span>{hi ? 'मजबूत समुदाय' : 'Stronger Communities'}</span>
                <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-brand bg-clip-text text-transparent">
                  {hi ? 'सुरक्षित एवं स्वस्थ भारत' : 'Safer, Healthier India'}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                {hi
                  ? 'नागरिक स्वास्थ्य, आपातकालीन चिकित्सा सहायता (2-3 मिनट), वास्तविक समय आपदा रडार एवं महाकुंभ मेला सुरक्षा का एकीकृत राष्ट्रीय डिजिटल मंच।'
                  : 'An integrated civic portal connecting emergency healthcare (2-3 min first aid), real-time GIS disaster radar, and mass crowd safety across India.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/emergency"
                className="btn bg-rose-600 hover:bg-rose-700 text-white font-black text-sm px-5 py-3 rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2"
              >
                <span>🚨</span>
                <span>{hi ? 'आपातकालीन सहायता' : 'Emergency SOS 112'}</span>
              </Link>
              <Link
                to="/healthcare"
                className="btn-primary text-sm font-bold px-5 py-3 rounded-xl shadow-md"
              >
                <span>🩺</span>
                <span>{hi ? 'चिकित्सा एवं अस्पताल' : 'Medical & Hospital'}</span>
              </Link>
              <Link
                to="/disaster"
                className="btn-outline text-sm font-bold px-5 py-3 rounded-xl shadow-xs"
              >
                <span>🌪️</span>
                <span>{hi ? 'आपदा रडार' : 'Disaster Radar'}</span>
              </Link>
              <Link
                to="/mela"
                className="btn-outline text-sm font-bold px-5 py-3 rounded-xl shadow-xs"
              >
                <span>🕉️</span>
                <span>{hi ? 'मेला सुरक्षा' : 'Mela Safety'}</span>
              </Link>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
              {hi
                ? 'सत्यापित अस्पताल · 2-3 मिनट फर्स्ट रिस्पॉन्डर · वास्तविक समय आपदा टेलीमेट्री · मेला खोया-पाया केंद्र'
                : 'Verified Hospitals · 2–3 Min First Responders · Real-Time Satellite Telemetry · Mela Reunification'}
            </p>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl group">
              <img
                src="/hero-banner.jpg"
                alt="SevaSaarthi — Natural Disaster Response, Healthcare Delivery, Kumbh Mela Safety"
                className="w-full h-auto max-h-[460px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Metric Bar */}
      <section className="glass-card p-5 sm:p-6 shadow-sm border-slate-200/80 dark:border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-xl text-rose-600 dark:text-rose-400">
              🚨
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">24</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'सक्रिय आपदा अलर्ट' : 'Active Disaster Alerts'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-xl text-teal-600 dark:text-teal-400">
              ⚡
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">2–3 Min</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'प्राथमिक चिकित्सा सहायता' : 'First Responder Time'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-600 dark:text-emerald-400">
              🏥
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">1,050+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'सत्यापित अस्पताल' : 'Hospitals Listed'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-600 dark:text-amber-400">
              🏛️
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">112</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'जिले कवर' : 'Districts Covered'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-600 dark:text-indigo-400">
              👥
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">3,200+</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'पंजीकृत स्वयंसेवक' : 'Registered Volunteers'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:px-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-xl text-purple-600 dark:text-purple-400">
              🕉️
            </span>
            <div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-tight">100%</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {hi ? 'मेला सुरक्षा व निगरानी' : 'Mela Crowd Coverage'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED QUICK ACCESS SECTION (Exact items requested by user) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>⚡</span>
              <span>{hi ? 'त्वरित नागरिक सेवाएं एवं आपातकालीन पहुंच' : 'Quick Access Citizen Actions'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {hi
                ? 'आपातकालीन रिपोर्टिंग, 2-3 मिनट मेडिकल सहायता, अस्पताल, आपदा अलर्ट, मेला सहायता व सरकारी योजनाओं तक एक क्लिक में पहुंचें।'
                : 'Direct 1-tap shortcuts for incident reporting, 2-3 min first aid, hospitals, disaster telemetry, mela safety & relief schemes.'}
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border border-teal-300/40 px-3 py-1.5 rounded-full">
            {QUICK_ACCESS_ITEMS.length} {hi ? 'त्वरित सेवाएं' : 'Quick Actions'}
          </span>
        </div>

        {/* 9 Quick Access Cards in 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`group glass-card p-5 rounded-2xl flex flex-col justify-between border border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${item.cardBorder}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-inner group-hover:scale-110 transition-transform ${item.iconBg}`}>
                    {item.icon}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${item.pillColor}`}>
                    {item.pill}
                  </span>
                </div>

                <div className="mt-4 space-y-1">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                    {hi ? item.titleHi : item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {hi ? item.subtitleHi : item.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 group-hover:underline flex items-center gap-1">
                  <span>{hi ? 'खोलें' : 'Access Now'}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">1-tap</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. THE 4 CORE INTEGRATED PILLARS (Health, Disaster, Medical & Mela) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span>
            <span>{hi ? 'चार मुख्य सेवा स्तंभ' : 'Four Core Modules of SevaSaarthi'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {hi
              ? 'स्वास्थ्य, आपातकालीन फर्स्ट रिस्पॉन्डर, उपग्रह आपदा रडार एवं मेला सुरक्षा का संपूर्ण समाधान'
              : 'Complete civic infrastructure integrating Healthcare, Disaster Management, Medical Emergency & Mela Safety'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CORE_PILLARS.map((p) => (
            <Link
              key={p.id}
              to={p.to}
              className="group glass-card p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {p.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {hi ? p.titleHi : p.title}
                      </h3>
                      <span className={`inline-block mt-0.5 text-[10px] font-black uppercase tracking-wider rounded-md px-2 py-0.5 border ${p.color}`}>
                        {p.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {hi ? p.descHi : p.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:underline">
                  <span>{hi ? 'मॉड्यूल देखें' : p.ctaText}</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">Official Module</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Real Impact, Real People Stories */}
      {/* <section className="space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {IMPACT_STORIES.map((story) => (
            <div
              key={story.id}
              className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-36 overflow-hidden">
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
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
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
      </section> */}

      {/* 5B. How SevaSaarthi Helps People (AI Powered Support Network) */}
      <section className="glass-card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              <span>🌟</span>
              <span>{hi ? 'जनहित में सेवा और सुरक्षा' : 'Empowering Citizens In Need'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🤝</span>
              <span>{hi ? 'सेवा सारथी नागरिकों की कैसे मदद करता है?' : 'How SevaSaarthi Helps People'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
              {hi
                ? 'अस्पताल खोजने से लेकर 2-3 मिनट में फर्स्ट रिस्पॉन्डर, उपग्रह आधारित चेतावनी और समर्पित स्वयंसेवकों तक — हर आपात स्थिति में आपका विश्वसनीय साथी।'
                : 'From finding verified hospitals to 2–3 min first-responder dispatch, satellite early alerts, and trained community volunteers — here is how SevaSaarthi supports you 24×7.'}
            </p>
          </div>
          <Link
            to="/emergency"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-md shadow-rose-500/20 transition-all shrink-0"
          >
            <span>🚨</span>
            <span>{hi ? 'तत्काल आपात सहायता' : 'Get Immediate Help'}</span>
          </Link>
        </div>

        {/* 4 Pillars Grid with AI Generated Visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Finding Hospital */}
          <div className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src="/help-hospital.jpg"
                alt="Finding Hospital and Emergency Care"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/90 text-white backdrop-blur-md shadow-md">
                🏥 Hospital & ICU
              </span>
              <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/90 font-semibold flex items-center gap-1">
                <span>📍</span> Real Distance & Maps
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {hi ? 'सत्यापित अस्पताल और आईसीयू खोज' : 'Finding Nearest Hospital & ICU'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {hi
                    ? 'अपनी लाइव लोकेशन से वास्तविक दूरी, सरकारी अस्पतालों के वास्तविक पते और गूगल मैप्स लाइव दिशा-निर्देश प्राप्त करें।'
                    : 'Locate verified govt & emergency hospitals with real distance from your GPS, authentic navigation routes, and demo slot booking.'}
                </p>
              </div>
              <Link
                to="/healthcare"
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>{hi ? 'अस्पताल खोजें' : 'Find Hospitals'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: 2-3 Min First Responder */}
          <div className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src="/help-responder.jpg"
                alt="Instant 2-3 Min First Responder"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-md shadow-md">
                ⚡ 2–3 Min Arrival
              </span>
              <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/90 font-semibold flex items-center gap-1">
                <span>🛡️</span> Verified Responders
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {hi ? '2-3 मिनट में फर्स्ट रिस्पॉन्डर' : '2–3 Min First Aid Responder'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {hi
                    ? 'एम्बुलेंस आने से पहले पड़ोस के प्रमाणित डॉक्टर, नर्स और प्रशिक्षित वॉलंटियर्स से गोल्डन ऑवर में जीवनरक्षक फर्स्ट एड।'
                    : 'Dispatch verified local doctors, nurses & trained youth to reach you in 2–3 minutes for immediate CPR & trauma first-aid.'}
                </p>
              </div>
              <Link
                to="/healthcare"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{hi ? 'रिस्पॉन्डर देखें' : 'Find Responders'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Satellite Early Alerts */}
          <div className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src="/help-alerts.jpg"
                alt="IMD & GIS Disaster Early Warning Alert System"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500/90 text-white backdrop-blur-md shadow-md">
                🛰️ IMD & GIS Radar
              </span>
              <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/90 font-semibold flex items-center gap-1">
                <span>📡</span> Live Broadcast
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {hi ? 'रियल-टाइम उपग्रह आपदा अलर्ट' : 'Real-Time Disaster Radar Alerts'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {hi
                    ? 'बाढ़, चक्रवात, भूस्खलन और भारी बारिश की सटीक मौसम चेतावनी और निकासी मार्ग सीधे नागरिकों तक।'
                    : 'Instant IMD weather warnings, flood inundation maps, cyclone tracking, and safe evacuation corridors on live GIS radar.'}
                </p>
              </div>
              <Link
                to="/disaster"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{hi ? 'लाइव रडार देखें' : 'View Live Radar'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Dedicated Volunteer Network */}
          <div className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="relative h-44 overflow-hidden bg-slate-950">
              <img
                src="/help-volunteers.jpg"
                alt="Community Volunteers Relief and Mela Safety"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-blue-500/90 text-white backdrop-blur-md shadow-md">
                🤝 50,000+ Volunteers
              </span>
              <span className="absolute bottom-2.5 left-2.5 text-[10px] text-white/90 font-semibold flex items-center gap-1">
                <span>🏕️</span> Ground Relief
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {hi ? 'समर्पित स्वयंसेवक व राहत कार्य' : 'Our Grassroots Volunteers'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {hi
                    ? 'एनसीसी, एनएसएस और युवा स्वयंसेवक भोजन वितरण, राहत शिविर, और महाकुंभ में बिछड़े लोगों को परिवार से मिलाने में सहायता करते हैं।'
                    : 'NCC, NSS and local youth coordinating food relief, medical camps, and reuniting missing persons at mass congregations.'}
                </p>
              </div>
              <Link
                to="/volunteers"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>{hi ? 'स्वयंसेवक से जुड़ें' : 'Join Volunteers'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Video / Multimedia Showcase Banner */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              {hi ? 'जनजागरूकता एवं सुरक्षा वीडियो' : 'Citizen Safety & Awareness Video Guide'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {hi ? 'आपदा एवं आपातकाल में त्वरित सुरक्षा दिशा-निर्देश देखें' : 'Watch How To Stay Safe During Emergencies'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {hi
                ? 'बाढ़, भूकंप और मेडिकल इमरजेंसी के दौरान क्या करें और क्या न करें — 2 मिनट के एनिमेटेड वीडियो और ऑडियो गाइड्स के साथ।'
                : 'Step-by-step life saving protocols for earthquakes, flash floods, heatwaves, and medical emergencies explained visually.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/disaster"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/30 transition-all"
            >
              <span>▶️</span>
              <span>{hi ? 'सुरक्षा वीडियो देखें' : 'Watch Safety Videos'}</span>
            </Link>
            <Link
              to="/emergency"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <span>🚨</span>
              <span>{hi ? 'इमरजेंसी कॉल 112' : 'Emergency 112'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. How SevaSaarthi Works */}
      <section className="glass-card p-6 sm:p-8 space-y-6 shadow-sm border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>{hi ? 'सेवा सारथी कैसे कार्य करता है' : 'How SevaSaarthi Works'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hi
              ? 'सूचना से समाधान तक — स्वास्थ्य, आपदा एवं आपातकालीन जनसहयोग की सशक्त प्रक्रिया।'
              : 'From information to action — together for resilient, healthy communities.'}
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

      {/* 7. All-India Emergency Helplines */}
      <section id="emergency-helplines" className="scroll-mt-24">
        <EmergencyHelplineSection lang={lang} onDownloadPdf={downloadAllHelplinesPdf} />
      </section>
    </div>
  );
}
