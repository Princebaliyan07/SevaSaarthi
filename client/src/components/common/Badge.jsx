import { useLanguage } from '../../context/LanguageContext';

const STYLES = {
  verified: 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
  official: 'bg-indigo-500/15 text-indigo-700 border border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40',
  live: 'bg-rose-500/15 text-rose-700 border border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40 animate-pulse',
  demo: 'bg-amber-500/15 text-amber-800 border border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
  // Severity / status chips
  critical: 'bg-red-600 text-white shadow-sm shadow-red-500/30',
  high: 'bg-rose-500/20 text-rose-700 border border-rose-500/40 dark:bg-rose-500/30 dark:text-rose-200 dark:border-rose-500/50',
  moderate: 'bg-amber-500/20 text-amber-800 border border-amber-500/40 dark:bg-amber-500/30 dark:text-amber-200 dark:border-amber-500/50',
  normal: 'bg-sky-500/15 text-sky-700 border border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40',
  pending: 'bg-slate-200/80 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const LABEL_KEYS = {
  verified: 'badge.verified',
  official: 'badge.official',
  live: 'badge.live',
  demo: 'badge.demo',
};

export default function Badge({ type = 'neutral', full = false, children, className = '' }) {
  const { t } = useLanguage();
  const label = children ?? (type === 'demo' && full ? t('badge.demoData') : t(LABEL_KEYS[type] || ''));
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase transition-colors ${
        STYLES[type] || STYLES.neutral
      } ${className}`}
    >
      {label}
    </span>
  );
}
