import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const GUIDE_CATEGORIES = [
  {
    id: 'fever',
    emoji: '🌡️',
    title: 'Fever',
    titleHi: 'बुखार',
    color: 'from-red-500 to-orange-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800/50',
    medicines: [
      { name: 'Paracetamol 500mg', brand: 'Dolo 650, Calpol', dose: '1 tab every 6 hrs', note: 'Best for mild fever. Safe for all ages.' },
      { name: 'Ibuprofen 400mg', brand: 'Brufen, Combiflam', dose: '1 tab every 8 hrs with food', note: 'For high fever + pain. Avoid on empty stomach.' },
    ],
    tips: ['Drink plenty of fluids (ORS/water)', 'Rest and avoid exertion', 'Sponge with lukewarm water', 'See doctor if fever > 3 days or > 104°F'],
  },
  {
    id: 'cold',
    emoji: '🤧',
    title: 'Cold & Flu',
    titleHi: 'सर्दी और फ्लू',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    medicines: [
      { name: 'Cetirizine 10mg', brand: 'Zyrtec, Cetcip', dose: '1 tab at night', note: 'For runny nose, sneezing. Causes drowsiness.' },
      { name: 'Chlorpheniramine 4mg', brand: 'Piriton, Cadistin', dose: '1 tab 3x daily', note: 'Older antihistamine. More sedating.' },
      { name: 'Loratadine 10mg', brand: 'Clarityn, Lorfast', dose: '1 tab once daily', note: 'Non-drowsy. Best for daytime use.' },
    ],
    tips: ['Steam inhalation 2x daily', 'Gargle with warm salt water', 'Honey + ginger tea for throat relief', 'Avoid cold drinks and ice cream'],
  },
  {
    id: 'cough',
    emoji: '😮‍💨',
    title: 'Cough',
    titleHi: 'खांसी',
    color: 'from-teal-500 to-green-500',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800/50',
    medicines: [
      { name: 'Dextromethorphan Syrup', brand: 'Benadryl DX, Kofarest', dose: '2 tsp every 6-8 hrs', note: 'For dry cough. Do NOT use for wet/productive cough.' },
      { name: 'Salbutamol Inhaler', brand: 'Asthalin, Ventolin', dose: '1-2 puffs every 4-6 hrs', note: 'For cough with wheezing/asthma. Use spacer.' },
      { name: 'Montelukast 10mg', brand: 'Montair, Singulair', dose: '1 tab at night', note: 'For allergic cough/asthma prevention.' },
    ],
    tips: ['Stay well-hydrated', 'Honey helps soothe throat', 'Avoid cold air and smoke', 'See doctor if cough persists > 2 weeks'],
  },
  {
    id: 'stomach',
    emoji: '🤢',
    title: 'Stomach Pain',
    titleHi: 'पेट दर्द',
    color: 'from-amber-500 to-yellow-500',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800/50',
    medicines: [
      { name: 'ORS Sachet', brand: 'Electral, WHO ORS', dose: '1 sachet in 1L water, sip slowly', note: 'Essential for diarrhoea dehydration prevention.' },
      { name: 'Metronidazole 400mg', brand: 'Flagyl, Metrogyl', dose: '1 tab 3x daily for 5 days', note: 'For amoebic dysentery/bacterial infection.' },
      { name: 'Loperamide 2mg', brand: 'Imodium', dose: '2 tabs first, then 1 after each loose stool', note: 'For non-infectious diarrhoea only.' },
      { name: 'Domperidone 10mg', brand: 'Motilium, Domstal', dose: '1 tab 30 min before meals', note: 'For nausea and bloating.' },
    ],
    tips: ['Stay on light diet (khichdi, toast)', 'Avoid spicy, oily foods', 'ORS is more important than food', 'See doctor if blood in stool or high fever'],
  },
  {
    id: 'headache',
    emoji: '🤕',
    title: 'Headache',
    titleHi: 'सिरदर्द',
    color: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800/50',
    medicines: [
      { name: 'Paracetamol 500mg', brand: 'Dolo 650, Calpol', dose: '1-2 tabs every 6 hrs', note: 'First choice for mild headache. Safe and effective.' },
      { name: 'Ibuprofen 400mg', brand: 'Brufen, Combiflam', dose: '1 tab with food every 8 hrs', note: 'For tension or migraine-type headache.' },
      { name: 'Aspirin 325mg', brand: 'Ecosprin, Aspirin', dose: '1 tab as needed', note: 'Avoid in children and gastric patients.' },
    ],
    tips: ['Rest in a quiet, dark room', 'Apply cold/warm compress', 'Stay hydrated', 'Emergency: headache with neck stiffness or vision change = call 112'],
  },
  {
    id: 'acidity',
    emoji: '🔥',
    title: 'Acidity & Heartburn',
    titleHi: 'एसिडिटी और जलन',
    color: 'from-orange-500 to-red-400',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800/50',
    medicines: [
      { name: 'Antacid (Gelusil/Digene)', brand: 'Gelusil, Digene', dose: '2 tsp after meals and at bedtime', note: 'Instant relief. Shake well before use.' },
      { name: 'Omeprazole 20mg', brand: 'Omez, Losec', dose: '1 tab 30 min before breakfast', note: 'For frequent/severe acidity. 7-14 day course.' },
      { name: 'Pantoprazole 40mg', brand: 'Pan 40, Pantocid', dose: '1 tab 30 min before meals', note: 'Stronger PPI for GERD and peptic ulcer.' },
    ],
    tips: ['Avoid spicy, oily and fried foods', 'Eat smaller, frequent meals', 'Do not lie down 2 hrs after eating', 'Avoid tea/coffee on empty stomach'],
  },
  {
    id: 'allergy',
    emoji: '🌸',
    title: 'Allergies',
    titleHi: 'एलर्जी',
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-200 dark:border-pink-800/50',
    medicines: [
      { name: 'Cetirizine 10mg', brand: 'Zyrtec, Cetcip', dose: '1 tab at night', note: 'For skin hives, nasal allergy, dust allergy.' },
      { name: 'Loratadine 10mg', brand: 'Clarityn, Lorfast', dose: '1 tab daily', note: 'Non-drowsy. Best for outdoor/pollen allergy.' },
      { name: 'Prednisolone 10mg', brand: 'Wysolone', dose: 'As prescribed by doctor only', note: 'For severe allergic reactions. Needs prescription.' },
    ],
    tips: ['Identify and avoid allergens', 'Wear mask in dusty areas', 'Keep windows closed during high pollen season', 'Carry antihistamine when outdoors'],
  },
  {
    id: 'diabetes',
    emoji: '🩸',
    title: 'Diabetes',
    titleHi: 'मधुमेह (शुगर)',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    medicines: [
      { name: 'Metformin 500mg', brand: 'Glycomet, Glucophage', dose: '1-2 tabs with meals', note: 'First-line for type 2 DM. Taken with meals to reduce GI side effects.' },
      { name: 'Glimepiride 2mg', brand: 'Amaryl, Glimpid', dose: '1 tab before breakfast', note: 'Stimulates insulin. Monitor for low blood sugar.' },
      { name: 'Insulin Glargine', brand: 'Lantus, Basalog', dose: 'As per diabetologist', note: 'Long-acting insulin. Requires doctor guidance for dose.' },
    ],
    tips: ['Monitor blood sugar daily', 'Low sugar diet: avoid rice, sweets, maida', 'Walk 30 min every day', 'Inspect feet daily for wounds'],
  },
  {
    id: 'bp',
    emoji: '❤️',
    title: 'Blood Pressure',
    titleHi: 'रक्तचाप (BP)',
    color: 'from-rose-500 to-red-600',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800/50',
    medicines: [
      { name: 'Amlodipine 5mg', brand: 'Norvasc, Amlokind', dose: '1 tab daily at same time', note: 'Calcium channel blocker. Most commonly used in India.' },
      { name: 'Atenolol 50mg', brand: 'Tenormin, Aten', dose: '1 tab once daily', note: 'Beta-blocker. Never stop suddenly.' },
      { name: 'Losartan 50mg', brand: 'Cozaar, Losar', dose: '1 tab daily', note: 'ARB. Preferred in diabetics to protect kidneys.' },
    ],
    tips: ['Check BP twice daily at same time', 'Low salt diet (< 5g/day)', 'No alcohol or smoking', 'Emergency BP > 180/110 = call 112 immediately'],
  },
  {
    id: 'pain',
    emoji: '💊',
    title: 'Pain Relief',
    titleHi: 'दर्द निवारक',
    color: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-50 dark:bg-slate-950/30',
    border: 'border-slate-200 dark:border-slate-700',
    medicines: [
      { name: 'Diclofenac 50mg', brand: 'Voveran, Voltaren', dose: '1 tab 2-3x daily with food', note: 'For joint pain, back pain, sprains. Take with food.' },
      { name: 'Naproxen 250mg', brand: 'Naprosyn', dose: '1 tab 2x daily with food', note: 'Long-acting pain relief. For arthritis and period pain.' },
      { name: 'Tramadol 50mg', brand: 'Ultram', dose: 'As prescribed only', note: 'Opioid analgesic. Controlled substance — prescription mandatory.' },
    ],
    tips: ['Apply ice/heat pack as appropriate', 'Rest the injured area', 'RICE: Rest, Ice, Compression, Elevation for sprains', 'See orthopaedic if pain persists > 1 week'],
  },
];

export default function MedicineGuideSection() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const [activeId, setActiveId] = useState('fever');

  const active = GUIDE_CATEGORIES.find((c) => c.id === activeId) || GUIDE_CATEGORIES[0];

  return (
    // ONE single card: header + pills + medicines + tips + disclaimer
    <section className={`rounded-2xl border ${active.border} ${active.bg} p-3 md:p-4 space-y-3 transition-colors`}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-base shadow">
          <span>📋</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold leading-tight text-slate-900 dark:text-white truncate">
            {hi ? 'दवा मार्गदर्शिका — बीमारी के अनुसार' : 'Medicine Guide by Condition'}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {hi ? 'लक्षण चुनें और सही दवा जानें' : 'Select your symptom to find the right medicine'}
          </p>
        </div>
        <span className="ml-auto shrink-0 text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-300/50">
          ⚕️ {hi ? 'डॉक्टर की सलाह लें' : 'Consult Doctor Always'}
        </span>
      </div>

      {/* Category Pills (single scrollable row) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GUIDE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveId(cat.id)}
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
              activeId === cat.id
                ? `bg-gradient-to-r ${cat.color} text-white shadow`
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{hi ? cat.titleHi : cat.title}</span>
          </button>
        ))}
      </div>

      {/* Body: medicines (left) + tips (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Medicines */}
        <div className="lg:col-span-2 space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {active.emoji} {hi ? active.titleHi : active.title} · {active.medicines.length} {hi ? 'दवाएं उपलब्ध' : 'medicines listed'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {active.medicines.map((med, i) => (
              <div
                key={i}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 space-y-1 shadow-sm"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">💊 {med.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Brand: {med.brand}</p>
                <p className="rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                  📏 {hi ? 'खुराक:' : 'Dose:'} <span className="text-brand font-bold">{med.dose}</span>
                </p>
                <p className="text-[10px] italic text-slate-500 dark:text-slate-400">{med.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 p-3">
          <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-2">
            💡 {hi ? 'जरूरी सुझाव' : 'Quick Tips'}
          </h4>
          <ul className="space-y-1">
            {active.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 px-3 py-1.5 text-[10px] text-amber-800 dark:text-amber-200">
        <span>⚠️</span>
        <p className="font-medium">
          {hi
            ? 'यह जानकारी केवल सामान्य मार्गदर्शन के लिए है। किसी भी दवा का उपयोग करने से पहले योग्य चिकित्सक से परामर्श अवश्य लें।'
            : 'This information is for general guidance only. Always consult a qualified medical professional before taking any medicine.'}
        </p>
      </div>
    </section>
  );
}