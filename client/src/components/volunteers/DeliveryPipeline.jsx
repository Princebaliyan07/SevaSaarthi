import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

const STAGES = [
  { key: 'request', label: 'Request', labelHi: 'अनुरोध' },
  { key: 'verified', label: 'Verified', labelHi: 'सत्यापित' },
  { key: 'assigned', label: 'Assigned', labelHi: 'आवंटित' },
  { key: 'pickup', label: 'Pickup', labelHi: 'पिकअप' },
  { key: 'delivery', label: 'Delivery', labelHi: 'वितरण' },
  { key: 'completed', label: 'Completed', labelHi: 'पूर्ण' },
];

export default function DeliveryPipeline({
  requestId = 'SS-DEL-2026-000231',
  volunteer = 'A. Singh',
  eta = '35 min',
  activeStageIndex = 2, // 'Assigned'
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="card p-5 bg-white space-y-4">
      <div className="border-b border-line pb-2.5">
        <h3 className="text-base font-bold text-ink">
          {t('volunteers.deliveryTitle')}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <span>Request <strong className="font-mono text-ink">{requestId}</strong></span>
          <span>·</span>
          <span>Volunteer {volunteer}</span>
          <Badge type="verified" />
          <span>·</span>
          <span className="font-bold text-brand">ETA {eta}</span>
        </div>
      </div>

      {/* Progress pill stages */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {STAGES.map((st, idx) => {
          const isDone = idx < activeStageIndex;
          const isCurrent = idx === activeStageIndex;
          return (
            <span
              key={st.key}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-brand text-white shadow-sm'
                  : isDone
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {lang === 'hi' ? st.labelHi : st.label}
            </span>
          );
        })}
      </div>

      <p className="text-xs text-ink-soft pt-1">
        {t('volunteers.prescriptionNotice')}
      </p>
    </div>
  );
}
