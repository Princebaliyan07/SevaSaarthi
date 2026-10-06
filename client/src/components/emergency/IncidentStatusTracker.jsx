import { useLanguage } from '../../context/LanguageContext';

const STAGES = [
  { key: 'reported', label: 'Reported', labelHi: 'रिपोर्ट किया गया', color: 'bg-sos text-white' },
  { key: 'received', label: 'Received', labelHi: 'प्राप्त हुआ', color: 'bg-alert text-white' },
  { key: 'assigned', label: 'Assigned', labelHi: 'आवंटित', color: 'bg-slate-700 text-white' },
  { key: 'responding', label: 'Responding', labelHi: 'कार्रवाई जारी', color: 'bg-blue-600 text-white' },
  { key: 'resolved', label: 'Resolved', labelHi: 'हल हो गया', color: 'bg-emerald-600 text-white' },
];

export default function IncidentStatusTracker({
  incidentId = 'SS-EMG-2026-50401',
  title = 'Medical emergency: report created',
  status = 'assigned',
}) {
  const { lang, t } = useLanguage();

  const currentIndex = Math.max(
    0,
    STAGES.findIndex((s) => s.key.toLowerCase() === status.toLowerCase())
  );

  return (
    <div className="card p-5 bg-white border border-brand/20">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
        <h3 className="text-base font-bold text-ink">
          {title}
        </h3>
        <span className="font-mono text-xs font-extrabold text-sos bg-red-50 px-2 py-0.5 rounded border border-red-200">
          {incidentId}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">
        {t('emergency.reportNote')}
      </p>

      {/* Progress pill timeline */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {STAGES.slice(0, 3).map((st, idx) => {
          const isActive = idx <= currentIndex;
          return (
            <span
              key={st.key}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
                isActive ? st.color : 'bg-slate-100 text-slate-400'
              }`}
            >
              {lang === 'hi' ? st.labelHi : st.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
