import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const GUIDES = [
  {
    id: 'flood',
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

export default function PreparednessAccordion() {
  const { lang, t } = useLanguage();
  const [openItem, setOpenItem] = useState('flood');

  return (
    <div className="space-y-4">
      {GUIDES.map((item) => {
        const isOpen = openItem === item.id;
        return (
          <div key={item.id} className="card overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setOpenItem(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between p-4 text-left font-bold text-ink hover:bg-surface/50"
            >
              <span className="flex items-center gap-2 text-base text-brand-dark">
                <span>{isOpen ? '▼' : '▶'}</span>
                <span>{lang === 'hi' ? item.titleHi : item.title}</span>
              </span>
              <span className="text-xs font-semibold text-ink-soft">
                {isOpen ? (lang === 'hi' ? 'छुपाएं' : 'Hide') : (lang === 'hi' ? 'देखें' : 'View checklist')}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-line p-5">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Before */}
                  <div className="rounded-lg bg-surface p-3.5 border border-line">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                      {t('disaster.before')}
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-xs text-ink leading-relaxed">
                      {(lang === 'hi' ? item.beforeHi : item.before).map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* During */}
                  <div className="rounded-lg bg-red-50/50 p-3.5 border border-red-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sos">
                      {t('disaster.during')}
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-xs text-ink leading-relaxed">
                      {(lang === 'hi' ? item.duringHi : item.during).map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sos font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* After */}
                  <div className="rounded-lg bg-surface p-3.5 border border-line">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                      {t('disaster.after')}
                    </h4>
                    <ul className="mt-2.5 space-y-2 text-xs text-ink leading-relaxed">
                      {(lang === 'hi' ? item.afterHi : item.after).map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-slate-600 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
