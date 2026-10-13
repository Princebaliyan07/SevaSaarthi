import { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ASSESSMENT_QUESTIONS = [
  {
    id: 'supplies',
    category: 'Emergency Supplies',
    categoryHi: 'आपातकालीन आपूर्ति',
    icon: '🎒',
    question: 'Do you have a packed 72-hour survival kit with drinking water, dry food, battery torch, and power bank ready to grab?',
    questionHi: 'क्या आपके पास 72 घंटे का इमरजेंसी बैग तैयार है जिसमें पीने का पानी, सूखा भोजन, टॉर्च और पावर बैंक शामिल हैं?',
    recommendation: 'Pack a 72-hour survival go-bag: 3-4 liters of water per person, dry nuts/biscuits, high-lumen torch, and charged power bank.',
    recommendationHi: '72 घंटे का गो-बैग तैयार करें: प्रति व्यक्ति 3-4 लीटर पानी, सूखा भोजन, टॉर्च और चार्ज्ड पावर बैंक रखें।',
  },
  {
    id: 'contacts',
    category: 'Family Emergency Contacts',
    categoryHi: 'पारिवारिक संपर्क योजना',
    icon: '📞',
    question: 'Does every family member carry a physical laminated card with at least 2 out-of-town emergency phone numbers?',
    questionHi: 'क्या परिवार के प्रत्येक सदस्य के पास कम से कम 2 आपातकालीन नंबरों वाली लेमिनेटेड पर्ची मौजूद है?',
    recommendation: 'Write down key relatives and local police/ambulance numbers on physical paper cards. Cellular networks often crash or phones lose charge.',
    recommendationHi: 'कागज की पर्ची पर मुख्य रिश्तेदारों और पुलिस/एंबुलेंस के नंबर लिखकर सभी सदस्यों की जेब या बटुए में रखें।',
  },
  {
    id: 'evacuation',
    category: 'Evacuation Planning',
    categoryHi: 'सुरक्षित निकासी मार्ग',
    icon: '🗺️',
    question: 'Do all members of your household know the primary and secondary flood/earthquake evacuation routes and local relief shelter?',
    questionHi: 'क्या आपके घर के सभी सदस्य बाढ़ या भूकंप के दौरान नजदीकी सुरक्षित निकासी मार्ग और राहत शिविर का स्थान जानते हैं?',
    recommendation: 'Walk through your neighborhood evacuation route with family. Identify high-ground shelters away from power lines and water channels.',
    recommendationHi: 'परिवार के साथ सुरक्षित निकासी मार्ग का पहले से मुआयना करें। बिजली के खंभों व नालों से दूर ऊंचे राहत शिविर को चिन्हित करें।',
  },
  {
    id: 'medical',
    category: 'Medical Preparedness',
    categoryHi: 'चिकित्सीय तैयारी',
    icon: '💊',
    question: 'Do you have at least 14 days of essential prescription medicines (BP, diabetes, cardiac) and an ORS/first-aid box?',
    questionHi: 'क्या आपके पास कम से कम 14 दिनों की नियमित दवाएं (बीपी, मधुमेह) और प्राथमिक चिकित्सा/ओआरएस किट उपलब्ध है?',
    recommendation: 'Maintain a 14-day rolling buffer for daily prescription medicines and keep 5-10 sachets of ORS ready in case of waterborne infections.',
    recommendationHi: 'नियमित दवाओं का 14 दिन का अतिरिक्त स्टॉक रखें और जलजनित बीमारियों से बचाव हेतु ओआरएस के पैकेट संभाल कर रखें।',
  },
  {
    id: 'documents',
    category: 'Vital Documents',
    categoryHi: 'महत्वपूर्ण दस्तावेज',
    icon: '📁',
    question: 'Are Aadhaar cards, property papers, insurance, and medical records stored in a waterproof pouch and on DigiLocker?',
    questionHi: 'क्या आधार कार्ड, संपत्ति के कागजात और बीमा रिकॉर्ड वाटरप्रूफ बैग में और डिजिलॉकर पर सुरक्षित हैं?',
    recommendation: 'Place physical identity and land records in a sealed ziplock pouch. Upload verified digital copies to Govt-approved DigiLocker.',
    recommendationHi: 'पहचान पत्रों को सीलबंद वाटरप्रूफ थैली में रखें और इनकी सत्यापित डिजिटल प्रतियां डिजिलॉकर पर सुरक्षित रखें।',
  },
  {
    id: 'crowd_safety',
    category: 'Mela & Crowd Safety',
    categoryHi: 'भीड़ एवं मेला सुरक्षा',
    icon: '👥',
    question: 'Are you familiar with crowd surge defense (boxer stance, avoiding counter-flow) and lost-child ID measures in large events?',
    questionHi: 'क्या आप भीड़ के दबाव में रक्षात्मक बॉक्सर मुद्रा, एकतरफा बहाव नियम और खोया-पाया पहचान सुरक्षा से अवगत हैं?',
    recommendation: 'Practice the boxer stance (arms up to protect chest) and agree on a specific fixed gate or watchtower as family meeting point.',
    recommendationHi: 'बॉक्सर मुद्रा (फेफड़ों की सुरक्षा हेतु हाथ आगे रखना) सीखें और मेले में हमेशा एक तय गेट या टावर को मिलन स्थल बनाएं।',
  },
];

export default function DisasterReadinessScore() {
  const { lang } = useLanguage();
  const [answers, setAnswers] = useState({
    supplies: true,
    contacts: true,
    evacuation: false,
    medical: true,
    documents: false,
    crowd_safety: false,
  });

  const toggleAnswer = (id) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRetake = () => {
    setAnswers({
      supplies: false,
      contacts: false,
      evacuation: false,
      medical: false,
      documents: false,
      crowd_safety: false,
    });
  };

  const answeredYesCount = useMemo(() => {
    return Object.values(answers).filter(Boolean).length;
  }, [answers]);

  const scorePercent = Math.round((answeredYesCount / ASSESSMENT_QUESTIONS.length) * 100);

  const missingRecommendations = useMemo(() => {
    return ASSESSMENT_QUESTIONS.filter((q) => !answers[q.id]);
  }, [answers]);

  const getTier = () => {
    if (scorePercent >= 84) {
      return {
        label: lang === 'hi' ? 'उच्च घरेलू तैयारी (सशक्त एवं लचीला)' : 'High Preparedness (Resilient Household)',
        color: 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200',
        barColor: 'bg-emerald-600',
      };
    }
    if (scorePercent >= 50) {
      return {
        label: lang === 'hi' ? 'मध्यम तैयारी (सराहनीय प्रयास, शेष कदम पूरे करें)' : 'Moderate Preparedness (Good Progress, A Few Gaps)',
        color: 'text-teal-800 bg-teal-100 border-teal-300 dark:bg-teal-900/60 dark:text-teal-200',
        barColor: 'bg-teal-600',
      };
    }
    return {
      label: lang === 'hi' ? 'बुनियादी जागरूकता (त्वरित सुधार आवश्यक)' : 'Basic Awareness (Immediate Action Needed)',
      color: 'text-amber-800 bg-amber-100 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200',
      barColor: 'bg-amber-600',
    };
  };

  const tier = getTier();

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span>📊</span>
            <span>{lang === 'hi' ? 'नागरिक स्व-मूल्यांकन' : 'Citizen Self-Assessment'}</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {lang === 'hi' ? 'आपका आपदा तैयारी स्कोर' : 'Your Disaster Readiness Score'}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang === 'hi'
              ? 'इन 6 मुख्य प्रश्नों के उत्तर दें और अपने परिवार की आपदा एवं भीड़ सुरक्षा तैयारियों का सटीक विश्लेषण प्राप्त करें।'
              : 'Answer these 6 core preparedness checks to calculate your household resilience score and receive personalized action steps.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetake}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:self-auto"
        >
          <span>🔄</span>
          <span>{lang === 'hi' ? 'पुनः मूल्यांकन करें' : 'Retake Assessment'}</span>
        </button>
      </div>

      {/* Score Meter & Visual Status Gauge */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'वर्तमान तत्परता सूचकांक' : 'Readiness Index'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {scorePercent}%
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({answeredYesCount} / {ASSESSMENT_QUESTIONS.length} {lang === 'hi' ? 'कदम तैयार' : 'measures ready'})
              </span>
            </div>
          </div>

          <span className={`inline-flex items-center rounded-xl border px-3 py-1.5 text-xs font-bold ${tier.color}`}>
            {tier.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700">
          <div
            className={`h-full ${tier.barColor} transition-all duration-500 rounded-full`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* Assessment Question Cards */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {ASSESSMENT_QUESTIONS.map((q) => {
          const isYes = !!answers[q.id];
          return (
            <div
              key={q.id}
              onClick={() => toggleAnswer(q.id)}
              className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition hover:shadow-xs ${
                isYes
                  ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    <span className="text-lg">{q.icon}</span>
                    <span>{lang === 'hi' ? q.categoryHi : q.category}</span>
                  </span>

                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      isYes
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isYes ? (lang === 'hi' ? '✓ तैयार' : '✓ Ready') : (lang === 'hi' ? '✕ अधूरा' : '✕ Needed')}
                  </span>
                </div>

                <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === 'hi' ? q.questionHi : q.question}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'क्लिक करके टॉगल करें' : 'Click to toggle'}
                </span>
                <input
                  type="checkbox"
                  checked={isYes}
                  onChange={() => toggleAnswer(q.id)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Personalized Recommendations for Missing Steps */}
      <div className="rounded-2xl border border-teal-200/80 bg-teal-50/30 p-5 dark:border-teal-900/40 dark:bg-slate-850">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {lang === 'hi' ? 'आपके लिए अनुशंसित सुधार कदम' : 'Personalized Preparedness Recommendations'}
          </h3>
        </div>

        {missingRecommendations.length === 0 ? (
          <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {lang === 'hi'
              ? 'उत्कृष्ट! आपके परिवार ने सभी 6 प्रमुख आपदा तैयारी स्तंभ पूरे कर लिए हैं। हर 6 महीने में पानी और दवाओं का नवीनीकरण करते रहें।'
              : 'Outstanding! Your household has addressed all 6 core disaster readiness pillars. Remember to rotate food and medicine stock every 6 months.'}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {missingRecommendations.map((rec) => (
              <li
                key={rec.id}
                className="flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white/80 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300"
              >
                <span className="text-base shrink-0">{rec.icon}</span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {lang === 'hi' ? rec.categoryHi : rec.category}:{' '}
                  </span>
                  <span>{lang === 'hi' ? rec.recommendationHi : rec.recommendation}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 italic">
          {lang === 'hi'
            ? 'सूचना: यह स्कोर घरेलू तैयारी को प्रोत्साहित करने के लिए एक शैक्षिक स्व-मूल्यांकन उपकरण है। यह किसी सरकारी सुरक्षा प्रमाणीकरण या आपातकाल में पूर्ण सुरक्षा की कानूनी गारंटी नहीं है।'
            : 'Disclaimer: This score is an educational self-assessment tool to improve household resilience. It does not represent an official safety certification or guarantee of safety in disasters.'}
        </p>
      </div>
    </section>
  );
}
