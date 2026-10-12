/*
 * Shared look for the Command centre tabs.
 * Put this file in: src/components/command/commandUi.jsx
 */

export const PANEL =
  'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

export const INPUT =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white';

export const LABEL = 'mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300';

export const BTN = {
  primary:
    'rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60',
  success:
    'rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60',
  danger:
    'rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60',
  secondary:
    'rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  softDanger:
    'rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30',
};

const TONES = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300',
  rose: 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
  teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

export function Pill({ tone = 'slate', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${TONES[tone] || TONES.slate} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHead({ title, desc, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
        {desc && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{desc}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, hint }) {
  return (
    <div className="py-12 text-center">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

/* Table with a clean header. `columns` is an array of labels; the last one is right-aligned
   when lastRight is true (use it for an "Actions" column). */
export function DataTable({ columns, lastRight = false, minWidth = 720, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {columns.map((c, i) => (
              <th
                key={c}
                className={`px-3 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 ${
                  lastRight && i === columns.length - 1 ? 'text-right' : ''
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">{children}</tbody>
      </table>
    </div>
  );
}

export const ROW = 'transition hover:bg-slate-50 dark:hover:bg-slate-800/50';

/* Scrollable pill tabs. tabs: [{ id, label, icon?, count? }] */
export function Tabs({ tabs, active, onChange, ariaLabel = 'Sections' }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
              isActive
                ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}