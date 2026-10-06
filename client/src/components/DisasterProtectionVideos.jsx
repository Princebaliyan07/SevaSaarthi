import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const VIDEO_SECTIONS = [
  {
    id: 'flood',
    title: 'Flood Protection',
    titleHi: 'बाढ़ से बचाव',
    icon: '🌊',
    badge: 'NDMA Standard',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    youtubeId: 'rgNNmfJLhW8',
    summary: 'Essential survival protocols before, during, and after severe riverine floods and sudden cloudburst inundation.',
    summaryHi: 'अचानक बाढ़, नदी के जलस्तर में वृद्धि और जलभराव के दौरान जीवन रक्षा के प्रमाणित उपाय।',
    dos: [
      'Move to higher elevated ground or designated relief shelters immediately.',
      'Turn off electricity main circuit switches and gas valves before leaving.',
      "Never drive or walk through moving floodwaters (\"Turn Around, Don't Drown\").",
    ],
    dosHi: [
      'तुरंत ऊंचे स्थानों या प्रशासन द्वारा चिन्हित राहत शिविरों में जाएं।',
      'घर छोड़ते समय मुख्य बिजली का स्विच और गैस रेगुलेटर बंद करें।',
      'बहते पानी में कभी पैदल या गाड़ी से निकलने का प्रयास न करें।',
    ],
    helpline: '1078 (NDMA)',
  },
  {
    id: 'cyclone',
    title: 'Cyclone Safety',
    titleHi: 'चक्रवात से सुरक्षा',
    icon: '🌀',
    badge: 'Coastal Warning',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800',
    youtubeId: 'sdhpSDXctLw',
    summary: 'Pre-storm preparation, structural protection against wind squalls, and coastal storm surge survival guidelines.',
    summaryHi: 'तेज हवाओं, आंधी और समुद्र तटीय चक्रवाती तूफानों से सुरक्षा के महत्वपूर्ण नियम।',
    dos: [
      'Secure loose roof tiles, tin sheets, and outdoor structures well in advance.',
      'Stay indoors in the safest room; avoid glass windows and exterior doors.',
      'Keep battery-powered radio, torches, and emergency dry food stock ready.',
    ],
    dosHi: [
      'छत की चादरें और बाहर रखे सामान को पहले से मजबूती से बांधें।',
      'घर के सबसे सुरक्षित कमरे में रहें, कांच की खिड़कियों से दूर रहें।',
      'बैटरी वाला रेडियो, टॉर्च और सूखा राशन पहले से तैयार रखें।',
    ],
    helpline: '1070 (State Control)',
  },
  {
    id: 'earthquake',
    title: 'Earthquake Protocol',
    titleHi: 'भूकंप से बचाव',
    icon: '🌋',
    badge: 'Drop, Cover & Hold',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    youtubeId: '90z5oU1WNTc',
    summary: 'The standard "Drop, Cover, and Hold On" survival technique during seismic tremors and building evacuations.',
    summaryHi: 'भूकंप के झटकों के दौरान "झुको, ढको और पकड़ो" (Drop, Cover, Hold) तकनीक का पालन करें।',
    dos: [
      'Drop to the floor, take cover under a sturdy desk or table, and hold on firmly.',
      'Stay away from glass windows, tall heavy bookcases, and ceiling fans.',
      'Do not use elevators during an earthquake; use stairs only after shaking stops.',
    ],
    dosHi: [
      'जमीन पर झुकें, मजबूत मेज के नीचे सिर छिपाएं और उसे कसकर पकड़ें।',
      'कांच की खिड़कियों, भारी अलमारियों और पंखों से दूर रहें।',
      'लिफ्ट का प्रयोग बिल्कुल न करें; झटके रुकने पर सीढ़ियों से खुले स्थान में जाएं।',
    ],
    helpline: '112 (Emergency)',
  },
  {
    id: 'landslides',
    title: 'Landslide Warning',
    titleHi: 'भूस्खलन सुरक्षा',
    icon: '⛰️',
    badge: 'Mountain Safety',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    youtubeId: '9j_StYqR_Pg',
    summary: 'Identifying early warning slope failure signs, mudflow transit precautions, and mountainous road safety.',
    summaryHi: 'पहाड़ी क्षेत्रों में भारी बारिश के दौरान मलबा गिरने और भूस्खलन से बचाव की सावधानियां।',
    dos: [
      'Listen for unusual sounds like cracking trees or rolling boulders on mountain slopes.',
      'Avoid night transit on mountain highway passes during heavy rainfall alerts.',
      'If mudflow approaches, move perpendicular away from the path of debris.',
    ],
    dosHi: [
      'पेड़ों के टूटने या पत्थरों के गिरने की आवाज पर तुरंत सतर्क हों।',
      'भारी बारिश के दौरान रात में पहाड़ी रास्तों पर यात्रा करने से बचें।',
      'मलबा आते देखने पर उसके बहाव की दिशा से समकोण (तिरछे) होकर सुरक्षित भागें।',
    ],
    helpline: '1078 (NDRF/SDRF)',
  },
  {
    id: 'mela-aapda',
    title: 'Mela Crowd Safety',
    titleHi: 'कुंभ मेला भीड़ व भगदड़ सुरक्षा',
    icon: '🕉️',
    badge: 'Crowd Protocol',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    youtubeId: 'Q6fPL92dybY',
    summary: 'Navigating massive pilgrim gatherings, ghat bathing barricades, pontoon bridges, and crowd surge survival.',
    summaryHi: 'महाकुंभ एवं धार्मिक मेलों में भीड़ के भारी दबाव और भगदड़ से बचाव के जीवन रक्षक उपाय।',
    dos: [
      'Keep elbows in front of chest like a boxer to preserve breathing room for lungs.',
      'Never stop on pontoon bridges or narrow ghat stairs for photography/selfies.',
      'If you fall, curl immediately into a fetal ball covering head and vital organs.',
    ],
    dosHi: [
      'भीड़ में दोनों कोहनियों को छाती के आगे रखें ताकि सांस लेने की जगह बनी रहे।',
      'पीपा पुलों या घाट की सीढ़ियों पर सेल्फी या फोटो खींचने के लिए न रुकें।',
      'यदि गिर जाएं, तो तुरंत करवट लेकर सिर और गर्दन को दोनों हाथों से ढकें।',
    ],
    helpline: '1920 (Mela Helpline)',
  },
];

export default function DisasterProtectionVideos() {
  const [activeTab, setActiveTab] = useState(VIDEO_SECTIONS[0].id);
  const { lang } = useLanguage();

  const current = VIDEO_SECTIONS.find((s) => s.id === activeTab) || VIDEO_SECTIONS[0];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-7">
      {/* Section Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-base dark:bg-rose-950/60">
              🛡️
            </span>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              {lang === 'hi' ? 'आपदा से बचाव एवं सुरक्षा गाइड (वीडियो)' : 'How to Protect Yourself from Disasters'}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'प्रमाणित वीडियो ट्यूटोरियल और राष्ट्रीय आपदा प्रबंधन (NDMA) के सुरक्षा दिशा-निर्देश'
              : 'Official awareness videos and certified disaster survival protocols'}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {lang === 'hi' ? 'प्रमाणित वीडियो' : 'Verified Video Guides'}
        </span>
      </div>

      {/* Category Navbar / Tab Selector */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {VIDEO_SECTIONS.map((sec) => {
          const isActive = sec.id === activeTab;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveTab(sec.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20 ring-2 ring-brand/30'
                  : 'border border-slate-200/80 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-base">{sec.icon}</span>
              <span>{lang === 'hi' ? sec.titleHi : sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Video & Guidance Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        {/* Responsive YouTube Video Player (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-lg dark:border-slate-800">
            <iframe
              className="absolute inset-0 h-full w-full rounded-2xl"
              src={`https://www.youtube-nocookie.com/embed/${current.youtubeId}?rel=0&modestbranding=1`}
              title={lang === 'hi' ? current.titleHi : current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>📺 Source: NDMA / Official Public Safety Awareness</span>
            <a
              href={`https://youtu.be/${current.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand hover:underline"
            >
              Open on YouTube ↗
            </a>
          </div>
        </div>

        {/* Guidance and Do's & Don'ts (5 Cols) */}
        <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-850/50 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className={`rounded-md border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${current.badgeColor}`}>
                {current.badge}
              </span>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                Helpline: {current.helpline}
              </span>
            </div>

            <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
              {lang === 'hi' ? current.titleHi : current.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'hi' ? current.summaryHi : current.summary}
            </p>
          </div>

          {/* Do's Checklist */}
          <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/80">
            <span className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {lang === 'hi' ? '✅ मुख्य जीवन रक्षक नियम (Key Actions):' : '✅ Key Survival Actions:'}
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {(lang === 'hi' ? current.dosHi : current.dos).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency SOS Prompt */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'आपातकाल में 112 डायल करें' : 'Dial 112 in immediate risk'}
            </div>
            <a
              href={`tel:${current.helpline.match(/\d+/)?.[0] || '112'}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-rose-700 transition-colors"
            >
              <span>🚨</span>
              <span>Call {current.helpline}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
