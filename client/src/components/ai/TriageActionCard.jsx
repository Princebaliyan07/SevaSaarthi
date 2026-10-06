import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

const ACTIONS = [
  { label: 'Find nearby hospital', labelHi: 'नजदीकी अस्पताल खोजें', type: 'safe' },
  { label: 'Find government medicine store', labelHi: 'सरकारी दवा केंद्र खोजें', type: 'safe' },
  { label: 'Find shelter', labelHi: 'आश्रय खोजें', type: 'safe' },
  { label: 'Create emergency request', labelHi: 'आपातकालीन अनुरोध बनाएं', type: 'asksFirst' },
  { label: 'Book doctor appointment', labelHi: 'डॉक्टर अपॉइंटमेंट बुक करें', type: 'asksFirst' },
  { label: 'Report missing person', labelHi: 'लापता व्यक्ति की रिपोर्ट करें', type: 'asksFirst' },
];

export default function TriageActionCard({ onSelectPrompt }) {
  const { lang, t } = useLanguage();

  return (
    <div className="card p-5 bg-white space-y-5">
      {/* Try asking chips matching Page 8 */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2.5">
          {t('ai.tryAsking')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Flood help', labelHi: 'बाढ़ सहायता', query: 'Mere area mein flood aa gaya hai' },
            { label: 'Nearest hospital', labelHi: 'निकटतम अस्पताल', query: 'Nearest hospital' },
            { label: 'Missing person', labelHi: 'लापता व्यक्ति', query: 'Missing person in Kumbh Mela' },
            { label: 'Chest pain', labelHi: 'सीने में दर्द (आपातकाल)', query: 'Chest pain and sweating' },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSelectPrompt?.(chip.query)}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-brand hover:bg-brand-soft/30 transition-all"
            >
              {lang === 'hi' ? chip.labelHi : chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions list matching Page 8 */}
      <div className="border-t border-line pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
          {t('ai.actionsTitle')}
        </h4>
        <div className="space-y-2">
          {ACTIONS.map((act) => (
            <div
              key={act.label}
              className="flex items-center justify-between rounded-lg border border-line/60 bg-surface/40 p-2.5 text-xs"
            >
              <span className="font-semibold text-ink">
                {lang === 'hi' ? act.labelHi : act.label}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  act.type === 'safe'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {act.type === 'safe' ? t('badge.safe') : t('badge.asksFirst')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
