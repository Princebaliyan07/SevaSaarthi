import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getHospitals } from '../../services/hospitalService';

const FIRST_AID_TABS = [
  {
    id: 'cpr',
    title: 'Hands-Only CPR',
    titleHi: 'सी.पी.आर. (हृदय गति रुकने पर)',
    icon: '❤️',
    badge: 'Critical Life-Saver',
    badgeHi: 'अति-महत्वपूर्ण',
    steps: [
      {
        en: 'Check responsiveness and normal breathing. Call 108 or 112 immediately.',
        hi: 'व्यक्ति के होश और सांस की जांच करें। तुरंत 108 या 112 पर कॉल करें।',
      },
      {
        en: 'Place the heel of one hand in the center of the chest. Place the other hand on top and interlock fingers.',
        hi: 'एक हाथ की हथेली छाती के बीच में रखें। दूसरा हाथ उसके ऊपर रखकर उंगलियां फंसा लें।',
      },
      {
        en: 'Push hard and fast: 100 to 120 compressions per minute, at least 2 inches deep. Let chest fully recoil.',
        hi: 'तेजी से और जोर से दबाएं: 100-120 बार प्रति मिनट, कम से कम 2 इंच गहराई तक। छाती को पूरी तरह वापस आने दें।',
      },
      {
        en: 'Continue compressions without stopping until professional ambulance paramedics take over or the person begins breathing.',
        hi: 'तब तक बिना रुके दबाव जारी रखें जब तक एम्बुलेंस पैरामेडिक्स न पहुंच जाएं या व्यक्ति सांस न लेने लगे।',
      },
    ],
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    titleHi: 'गंभीर रक्तस्राव नियंत्रण',
    icon: '🩸',
    badge: 'Immediate Action',
    badgeHi: 'तुरंत कदम',
    steps: [
      {
        en: 'Apply direct, continuous, firm pressure over the bleeding site using a sterile gauze or cleanest cloth available.',
        hi: 'साफ सूती कपड़े या स्टेरलाइज्ड पट्टी से घाव पर सीधा, निरंतर और मजबूत दबाव डालें।',
      },
      {
        en: 'Maintain uninterrupted pressure for at least 10 minutes without lifting to check the wound.',
        hi: 'घाव देखने के लिए पट्टी उठाए बिना कम से कम 10 मिनट तक लगातार दबाव बनाए रखें।',
      },
      {
        en: 'Elevate the injured limb above the level of the heart if there is no fracture suspected.',
        hi: 'यदि हड्डी टूटने का संदेह न हो, तो घायल हाथ या पैर को दिल के स्तर से ऊपर उठाएं।',
      },
      {
        en: 'If arterial bleeding cannot be stopped by pressure, apply a commercial or improvised tourniquet 2 inches above the wound and record the exact time.',
        hi: 'यदि धमनी से अत्यधिक खून बहना बंद न हो, तो घाव से 2 इंच ऊपर पट्टी कसकर बांधें (टूर्निकेट) और समय लिख लें।',
      },
    ],
  },
  {
    id: 'heatstroke',
    title: 'Heatstroke & Dehydration',
    titleHi: 'हीटस्ट्रोक एवं निर्जलीकरण',
    icon: '☀️',
    badge: 'Summer & Crowd Risk',
    badgeHi: 'गर्मी व भीड़ का खतरा',
    steps: [
      {
        en: 'Differentiate: Heat exhaustion causes heavy sweating and pale cold skin. Heat stroke causes body temp >104°F, red hot dry skin, confusion, and loss of consciousness (EMERGENCY).',
        hi: 'पहचानें: हीट एग्जॉशन में पसीना व ठंडक होती है। हीटस्ट्रोक में तापमान 104°F से अधिक, त्वचा लाल व सूखी, भ्रम और बेहोशी होती है (आपातकाल)।',
      },
      {
        en: 'Move person immediately to deep shade, air conditioning, or well-ventilated shelter.',
        hi: 'मरीज को तुरंत घनी छांव, पंखे या वातानुकूलित ठंडे स्थान पर लाएं।',
      },
      {
        en: 'Active cooling: Wet the entire body with cool water and place ice/cold damp packs on armpits, groin, and neck.',
        hi: 'सक्रिय शीतलन: पूरे शरीर पर ठंडा पानी छिड़कें और कांख, गर्दन व कमर पर ठंडी पट्टी लगाएं।',
      },
      {
        en: 'Oral Rehydration Solution (ORS): Dissolve 6 level teaspoons of sugar + 1/2 level teaspoon of salt in 1 liter clean drinking water. Sip slowly. Do not give liquids if unconscious.',
        hi: 'ओआरएस घोल: 1 लीटर पानी में 6 चम्मच चीनी + आधा चम्मच नमक मिलाकर धीरे-धीरे पिलाएं। बेहोश व्यक्ति को कभी पानी न पिलाएं।',
      },
    ],
  },
  {
    id: 'triage',
    title: 'When to Seek Urgent Care',
    titleHi: 'आपातकालीन मदद कब लें (रेड फ्लैग)',
    icon: '🚨',
    badge: 'Critical Red Flags',
    badgeHi: 'खतरे के लक्षण',
    steps: [
      {
        en: 'Chest pressure, crushing chest pain, or pain radiating to left jaw/arm (suspected heart attack).',
        hi: 'छाती में भारीपन, तेज दर्द या बाएं कंधे/जबड़े तक फैलता दर्द (संभावित दिल का दौरा)।',
      },
      {
        en: 'Sudden face drooping, arm weakness, or slurred incoherent speech (FAST stroke symptoms).',
        hi: 'चेहरे का एक तरफ झुकना, हाथ में कमजोरी, या अचानक बोली लड़खड़ाना (स्ट्रोक/लकवा के लक्षण)।',
      },
      {
        en: 'Severe breathlessness, wheezing, blue lips or nails, or uncontrollable coughing fits.',
        hi: 'अत्यधिक सांस फूलना, होंठ या नाखूनों का नीला पड़ना, या ऑक्सीजन स्तर में भारी गिरावट।',
      },
      {
        en: 'Head injury followed by loss of consciousness, repetitive vomiting, or seizures.',
        hi: 'सिर में गंभीर चोट के बाद बेहोशी, बार-बार उल्टी आना, या मिर्गी/दौरे के लक्षण।',
      },
    ],
  },
];

const MEDICAL_KIT_ITEMS = [
  { id: 'chronic', en: '14-Day supply of essential chronic prescriptions (BP, diabetes, cardiac, thyroid)', hi: 'नियमित जीवनरक्षक दवाएं (बीपी, शुगर, हृदय रोग) - न्यूनतम 14 दिन का बैकअप', icon: '💊' },
  { id: 'ors', en: 'ORS electrolyte sachets (5-10 packets) & water purification tablets', hi: 'ओआरएस इलेक्ट्रॉल के पैकेट (5-10) एवं पानी शुद्ध करने वाली क्लोरीन गोलियां', icon: '💧' },
  { id: 'bandages', en: 'Sterile gauze pads, roller bandages, micropore surgical tape & triangular sling', hi: 'स्टेरलाइज्ड गॉज, रोलर पट्टी, माइक्रोपोर टेप और त्रिकोणीय स्लिंग पट्टी', icon: '🩹' },
  { id: 'antiseptic', en: 'Povidone-iodine antiseptic liquid/ointment & sterile wipes', hi: 'एंटीसेप्टिक दवा (पोविडोन-आयोडीन लोशन) एवं स्टेरलाइज्ड कॉटन स्वाब', icon: '🧴' },
  { id: 'tools', en: 'Digital thermometer, pulse oximeter, blunt medical scissors & tweezers', hi: 'डिजिटल थर्मामीटर, पल्स ऑक्सीमीटर, मेडिकल कैंची और चिमटी', icon: '✂️' },
  { id: 'meds', en: 'Basic OTC remedies: Paracetamol, antihistamine (allergies), antacid, burn ointment', hi: 'बुखार की दवा (पैरासिटामोल), एलर्जी की दवा, एंटासिड और बर्न ऑइंटमेंट', icon: '🌡️' },
];

export default function HealthcareActionCenter() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('cpr');
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [cityFilter, setCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocStatus, setUserLocStatus] = useState(null); // 'locating' | 'success' | 'denied'
  const [showMedicalKitModal, setShowMedicalKitModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchHosp() {
      setLoadingHospitals(true);
      try {
        const data = await getHospitals();
        if (isMounted && Array.isArray(data)) {
          setHospitals(data);
        }
      } catch (err) {
        console.error('Failed to load verified hospitals in action center:', err);
      } finally {
        if (isMounted) setLoadingHospitals(false);
      }
    }
    fetchHosp();
    return () => {
      isMounted = false;
    };
  }, []);

  const cities = useMemo(() => {
    const set = new Set();
    hospitals.forEach((h) => {
      if (h.city) set.add(h.city);
    });
    return ['All', ...Array.from(set)];
  }, [hospitals]);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      const matchCity = cityFilter === 'All' || h.city?.toLowerCase() === cityFilter.toLowerCase();
      const matchQuery =
        !searchQuery ||
        (h.name && h.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.address && h.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (h.city && h.city.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCity && matchQuery;
    });
  }, [hospitals, cityFilter, searchQuery]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setUserLocStatus('denied');
      return;
    }
    setUserLocStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocStatus('success');
        // Sort nearest based on distance if lat/lng available
        const { latitude, longitude } = pos.coords;
        setHospitals((prev) => {
          const list = [...prev];
          list.sort((a, b) => {
            const distA = Math.hypot((a.lat || 0) - latitude, (a.lng || 0) - longitude);
            const distB = Math.hypot((b.lat || 0) - latitude, (b.lng || 0) - longitude);
            return distA - distB;
          });
          return list;
        });
      },
      () => {
        setUserLocStatus('denied');
      },
      { timeout: 8000 }
    );
  };

  const currentTab = FIRST_AID_TABS.find((t) => t.id === activeTab) || FIRST_AID_TABS[0];

  return (
    <section className="space-y-6 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50/40 via-white to-emerald-50/30 p-6 shadow-sm dark:border-teal-900/60 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-teal-950/40 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-teal-100/80 pb-5 dark:border-teal-900/40">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
            <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse" />
            {lang === 'hi' ? 'लाइव स्वास्थ्य एवं चिकित्सा केंद्र' : 'Live Healthcare Emergency Hub'}
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {lang === 'hi' ? 'स्वास्थ्य आपातकालीन एक्शन सेंटर' : 'Healthcare Emergency Action Center'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang === 'hi'
              ? 'आपदा एवं भीड़ में त्वरित जीवन रक्षक प्राथमिक चिकित्सा, हीटस्ट्रोक देखभाल और सत्यापित नजदीकी अस्पताल मार्गदर्शिका।'
              : 'Verified first-aid protocols, hospital locator, heatstroke triage, and emergency preparedness for natural disasters and large public events.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowMedicalKitModal(true)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 active:scale-95 sm:self-auto"
        >
          <span>🎒</span>
          <span>{lang === 'hi' ? 'पर्सनल मेडिकल किट चेकलिस्ट' : 'Personal Medical Kit Guide'}</span>
        </button>
      </div>

      {/* Emergency Helplines Quick Ribbon */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { num: '108', label: 'Ambulance & Paramedics', labelHi: 'एम्बुलेंस एवं पैरामेडिक्स', icon: '🚑', color: 'from-rose-500 to-red-600' },
          { num: '112', label: 'National Unified Emergency', labelHi: 'राष्ट्रीय आपातकालीन नंबर', icon: '🚨', color: 'from-amber-500 to-orange-600' },
          { num: '104', label: 'Health Advisory Helpline', labelHi: 'स्वास्थ्य परामर्श हेल्पलाइन', icon: '🩺', color: 'from-teal-600 to-emerald-600' },
          { num: '1078', label: 'Disaster Emergency Helpline', labelHi: 'आपदा प्रबंधन हेल्पलाइन', icon: '🛡️', color: 'from-blue-600 to-indigo-600' },
        ].map((h) => (
          <a
            key={h.num}
            href={`tel:${h.num}`}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-3.5 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${h.color} text-lg text-white shadow-sm`}>
              <span>{h.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {h.num}
              </div>
              <div className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? h.labelHi : h.label}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Interactive First Aid & Clinical Triage Tabs */}
      <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs dark:border-teal-900/40 dark:bg-slate-900/90">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🩺</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'त्वरित प्राथमिक उपचार प्रोटोकॉल' : 'Immediate First-Aid & Triage Guidelines'}
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'क्लिक करके प्रोटोकॉल देखें' : 'Click to inspect protocols'}
          </span>
        </div>

        {/* Tab buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FIRST_AID_TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 ring-2 ring-teal-500/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{lang === 'hi' ? tab.titleHi : tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-teal-50/20 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentTab.icon}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? currentTab.titleHi : currentTab.title}
              </h4>
            </div>
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
              {lang === 'hi' ? currentTab.badgeHi : currentTab.badge}
            </span>
          </div>

          <ol className="mt-3 space-y-2.5">
            {currentTab.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-[10px] text-white">
                  {idx + 1}
                </span>
                <span>{lang === 'hi' ? step.hi : step.en}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Verified Hospital Locator Integration */}
      <div className="rounded-2xl border border-teal-100 bg-white p-5 shadow-xs dark:border-teal-900/40 dark:bg-slate-900/90 space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
              🏥
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {lang === 'hi' ? 'सत्यापित आपातकालीन चिकित्सा केंद्र एवं अस्पताल' : 'Verified Emergency Hospitals & Trauma Centers'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'hi'
                  ? 'लाइव आईसीयू व ऑक्सीजन बेड स्थिति, 24x7 इमरजेंसी एवं सीधा नेविगेशन'
                  : 'Live ICU & Oxygen bed availability, 24x7 trauma facilities & direct navigation'}
              </p>
            </div>
          </div>

          {/* Location button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={userLocStatus === 'locating'}
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 transition hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-950/60 dark:text-teal-300 sm:self-auto"
          >
            <span>📍</span>
            <span>
              {userLocStatus === 'locating'
                ? lang === 'hi' ? 'स्थान खोज रहे हैं...' : 'Detecting GPS...'
                : userLocStatus === 'success'
                ? lang === 'hi' ? 'निकटतम से क्रमबद्ध ✓' : 'Sorted by Nearest ✓'
                : lang === 'hi' ? 'मेरी लोकेशन से खोजें' : 'Sort by My Location'}
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'अस्पताल का नाम या पता खोजें...' : 'Search hospital by name, area or trauma...'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
              {lang === 'hi' ? 'शहर:' : 'City:'}
            </span>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                  cityFilter === city
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                }`}
              >
                {city === 'All' ? (lang === 'hi' ? 'सभी' : 'All') : city}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Cards Grid */}
        {loadingHospitals ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'सत्यापित अस्पतालों की जानकारी लोड हो रही है...' : 'Fetching verified hospital network telemetry...'}
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {lang === 'hi' ? 'कोई अस्पताल नहीं मिला। कृपया दूसरा शहर या नाम खोजें।' : 'No hospitals found matching your criteria. Try switching cities.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredHospitals.slice(0, 6).map((hosp) => (
              <div
                key={hosp.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition hover:border-teal-400/60 hover:bg-white hover:shadow-sm dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-850"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                      {hosp.name}
                    </h4>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        hosp.type === 'Government'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
                      }`}
                    >
                      {hosp.type === 'Government' ? (lang === 'hi' ? 'सरकारी' : 'Govt') : (lang === 'hi' ? 'प्राइवेट' : 'Private')}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    📍 {hosp.address}
                  </p>

                  {/* Bed & Facility Telemetry */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {hosp.traumaCenterActive && (
                      <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                        ⚡ 24x7 Trauma OT
                      </span>
                    )}
                    {typeof hosp.icuBedsAvailable === 'number' && (
                      <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800 dark:bg-teal-900/60 dark:text-teal-200">
                        ICU Beds: {hosp.icuBedsAvailable}
                      </span>
                    )}
                    {typeof hosp.oxygenBedsAvailable === 'number' && (
                      <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                        O₂ Beds: {hosp.oxygenBedsAvailable}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: Call & Map */}
                <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    📞 {hosp.phone || '108'}
                  </span>

                  <div className="flex items-center gap-2">
                    {hosp.phone && (
                      <a
                        href={`tel:${hosp.phone}`}
                        className="rounded-lg bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-teal-700"
                      >
                        {lang === 'hi' ? 'कॉल करें' : 'Call'}
                      </a>
                    )}
                    <a
                      href={hosp.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.name + ' ' + hosp.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {lang === 'hi' ? 'दिशा-निर्देश' : 'Directions'} ↗
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic text-center pt-1">
          {lang === 'hi'
            ? 'सूचना स्रोत: सार्वजनिक स्वास्थ्य एवं आपदा नियंत्रण नेटवर्क। यह जानकारी आपातकालीन तैयारी और नागरिक मार्गदर्शन के लिए है, पेशेवर चिकित्सीय सलाह का विकल्प नहीं।'
            : 'Source: Civic Healthcare Network & Integrated Hospital Database. Educational triage guidance only — not a substitute for clinical diagnosis or prescription.'}
        </p>
      </div>

      {/* Modal: Personal Medical Emergency Kit Checklist */}
      {showMedicalKitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-teal-200 bg-white p-6 shadow-2xl dark:border-teal-900 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎒</span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'व्यक्तिगत चिकित्सा आपातकालीन किट' : 'Personal Medical Emergency Kit Guide'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'आपदा या यात्रा के दौरान साथ रखने योग्य सामग्री' : 'Essential medical items to pack for disaster or major events'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMedicalKitModal(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {MEDICAL_KIT_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {lang === 'hi' ? item.hi : item.en}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMedicalKitModal(false)}
                className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700"
              >
                {lang === 'hi' ? 'समझ गए (बंद करें)' : 'Understood (Close)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
