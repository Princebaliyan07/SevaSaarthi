/*
 * Quick help card (right side of the AI Saarthi page).
 * Each tile sends its `prompt` to the chat through onSelectPrompt(text).
 * Prompts are written so they match the topics in services/aiKnowledge.js.
 */

const FAQ_GROUPS = [
  {
    title: 'Health',
    items: [
      { icon: '🏥', label: 'Find hospital', prompt: 'Find nearest hospital' },
      { icon: '💊', label: 'Jan Aushadhi store', prompt: 'Jan Aushadhi medicine store' },
      { icon: '🌡️', label: 'Fever help', prompt: 'I have fever, what should I do?' },
      { icon: '📅', label: 'Book appointment', prompt: 'Book doctor appointment' },
      { icon: '🫀', label: 'Chest pain', prompt: 'I have chest pain', urgent: true },
    ],
  },
  {
    title: 'Disaster and safety',
    items: [
      { icon: '⚠️', label: 'Disaster alert', prompt: 'Disaster alert' },
      { icon: '🌊', label: 'Flood help', prompt: 'Mere area mein flood aa gaya hai' },
      { icon: '🏠', label: 'Find shelter', prompt: 'Find nearest shelter' },
      { icon: '🌍', label: 'Earthquake safety', prompt: 'Earthquake safety tips' },
      { icon: '🆘', label: 'Get help now', prompt: 'I need emergency help', urgent: true },
    ],
  },
  {
    title: 'People and community',
    items: [
      { icon: '🔎', label: 'Report missing person', prompt: 'Report missing person' },
      { icon: '🤝', label: 'Get a volunteer', prompt: 'I need a volunteer' },
    ],
  },
];

const ACTIONS = [
  { label: 'Find nearby hospital', prompt: 'Find nearest hospital', safe: true },
  { label: 'Find government medicine store', prompt: 'Jan Aushadhi medicine store', safe: true },
  { label: 'Find shelter', prompt: 'Find nearest shelter', safe: true },
  { label: 'Create emergency request', prompt: 'I need emergency help', safe: false },
  { label: 'Book doctor appointment', prompt: 'Book doctor appointment', safe: false },
  { label: 'Report missing person', prompt: 'Report missing person', safe: false },
];

export default function TriageActionCard({ onSelectPrompt }) {
  const ask = (text) => {
    if (typeof onSelectPrompt === 'function') onSelectPrompt(text);
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-ink">Quick help</h2>
        <p className="mt-0.5 text-sm text-ink-soft">Tap a question and AI Saarthi will answer in the chat.</p>
      </div>

      <div className="space-y-5">
        {FAQ_GROUPS.map((group) => (
          <section key={group.title}>
            <h3 className="mb-2 text-sm font-semibold text-ink-soft">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => ask(item.prompt)}
                  className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[13px] font-semibold leading-tight transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    item.urgent
                      ? 'border-red-200 bg-red-50 text-sos hover:border-sos hover:bg-red-100'
                      : 'border-line bg-slate-50 text-ink hover:border-brand hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <span className="text-lg leading-none" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* What the assistant can do */}
      <details className="group mt-5 rounded-2xl border border-line bg-slate-50/60">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink">
          What AI Saarthi can do
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-ink-soft transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <ul className="space-y-2 px-3 pb-3">
          {ACTIONS.map((a) => (
            <li key={a.label}>
              <button
                type="button"
                onClick={() => ask(a.prompt)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5 text-left text-sm font-medium text-ink transition hover:border-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <span>{a.label}</span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    a.safe ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {a.safe ? 'Safe' : 'Asks first'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}