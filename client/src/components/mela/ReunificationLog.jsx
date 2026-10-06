import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_STEPS = [
  { key: 'missing', label: 'Missing', labelHi: 'लापता', bg: 'bg-rose-600 text-white' },
  { key: 'located', label: 'Located', labelHi: 'मिल गए', bg: 'bg-amber-600 text-white' },
  { key: 'identity', label: 'Identity check', labelHi: 'पहचान सत्यापन', bg: 'bg-sky-600 text-white' },
  { key: 'reunited', label: 'Reunited', labelHi: 'पुनर्मिलन', bg: 'bg-emerald-600 text-white' },
];

export default function ReunificationLog({ helpPoints = [], activeCase = null, onReunite }) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Status flow indicator */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('mela.statusFlow')}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_STEPS.map((step) => (
            <span
              key={step.key}
              className={`rounded-full px-3 py-1 text-xs font-bold shadow-xs ${step.bg}`}
            >
              {lang === 'hi' ? step.labelHi : step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Active Case Card (Rendered dynamically from MongoDB) */}
      {activeCase && (
        <div className="glass-card p-5 space-y-3 border-amber-500/30 dark:border-amber-500/20">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔍</span>
              <span>{t('mela.caseInProgress')}</span>
            </h3>
            <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
              {activeCase.caseId}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {activeCase.name} ({activeCase.gender}, {activeCase.age} yrs)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'अंतिम देखा गया:' : 'Last seen:'} {activeCase.lastSeenLocation} · {activeCase.lastSeenTime || 'Recent'}
              </p>
              {activeCase.clothing && (
                <p className="text-[11px] text-slate-400 italic">
                  {lang === 'hi' ? 'पहचान:' : 'Appearance:'} {activeCase.clothing}
                </p>
              )}
            </div>
            <Badge type={activeCase.status === 'Located' || activeCase.status === 'reunited' ? 'verified' : 'high'}>
              {activeCase.status === 'Located' || activeCase.status === 'reunited' ? (lang === 'hi' ? 'मिल गए' : 'Located') : (lang === 'hi' ? 'लापता' : 'Missing')}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {activeCase.status !== 'Located' && activeCase.status !== 'reunited' && (
              <button
                type="button"
                onClick={() => onReunite?.(activeCase.caseId)}
                className="btn-primary text-xs py-1.5 px-3 font-bold"
              >
                ✅ {lang === 'hi' ? 'मिलने की पुष्टि करें' : 'Mark as Reunited'}
              </button>
            )}
            <button
              type="button"
              onClick={() => alert(`Nearest Help Point: ${activeCase.nearestHelpDesk || 'Gate 3 Help Desk'}`)}
              className="btn-outline text-xs py-1.5 px-3 font-bold"
            >
              📍 {activeCase.nearestHelpDesk || 'Help Desk'}
            </button>
          </div>
        </div>
      )}

      {/* Help points tags */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t('mela.helpPoints')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {helpPoints.map((hp) => (
            <button
              key={hp}
              type="button"
              onClick={() => alert(`Locating nearest: ${hp}`)}
              className="rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-brand hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
            >
              {hp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
