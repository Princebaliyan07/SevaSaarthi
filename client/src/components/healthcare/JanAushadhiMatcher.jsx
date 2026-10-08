import { useState, useRef } from 'react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

const CHIPS = ['paracetamol',  'cetirizine', 'pantoprazole', 'metformin', 'ORS','Cetirizine Hydrochloride' , 'Metformin Hydrochloride Sustained Release ' , 'Amoxicillin + Potassium Clavulanate' ];
const RING_RADIUS = 34;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

const formatINR = (value) =>
  Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export default function JanAushadhiMatcher({ medicines = [] }) {
  const { lang, t } = useLanguage();
  const hi = lang === 'hi';

  const [searchTerm, setSearchTerm] = useState('paracetamol');
  const [pick, setPick] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const query = searchTerm.trim().toLowerCase();
  const filtered = medicines.filter(
    (m) =>
      m.genericName.toLowerCase().includes(query) ||
      m.brandName.toLowerCase().includes(query)
  );

  const selectedMed = filtered[pick] || filtered[0];

  const saved = selectedMed ? selectedMed.commercialPrice - selectedMed.janAushadhiPrice : 0;
  const savingsPercent =
    selectedMed && selectedMed.commercialPrice > 0
      ? Math.round((saved / selectedMed.commercialPrice) * 100)
      : 0;
  const ringOffset = RING_LENGTH * (1 - Math.min(Math.max(savingsPercent, 0), 100) / 100);

  const updateSearch = (value) => {
    setSearchTerm(value);
    setPick(0);
    setShowSuggestions(value.length >= 2);
  };

  // Autocomplete suggestions: all medicines matching current partial query
  const suggestions = query.length >= 2
    ? medicines.filter(
        (m) =>
          m.genericName.toLowerCase().includes(query) ||
          m.brandName.toLowerCase().includes(query)
      ).slice(0, 8)
    : [];

  return (
    <section className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-xl shadow-lg shadow-emerald-500/30">
            <span aria-hidden="true">💊</span>
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight text-slate-900 dark:text-white">
              {hi ? 'जन औषधि दवा जानकारी' : 'Jan Aushadhi Medicine Information'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hi ? `${medicines.length}+ दवाओं में से खोजें — सस्ती जेनेरिक दवा पाएं` : `Search ${medicines.length}+ medicines — Find low-cost Jan Aushadhi generics`}
            </p>
          </div>
        </div>
        <Badge type="official">{hi ? 'जन औषधि' : 'Jan Aushadhi'}</Badge>
      </div>


      {/* Search */}
      <div className="space-y-3 px-6 pt-5">
        <div className="relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => updateSearch(e.target.value)}
            onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={hi ? 'दवा का नाम लिखें — जैसे "azi" लिखने पर Azithromycin दिखेगा...' : 'Type medicine name — e.g. "azi" shows Azithromycin...'}
            aria-label={t('health.medicineSearchPlaceholder')}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-3.5 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-sm backdrop-blur-sm transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:placeholder-slate-500 dark:focus:border-emerald-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { updateSearch(''); setShowSuggestions(false); }}
              aria-label={hi ? 'खोज साफ़ करें' : 'Clear search'}
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              ✕
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
              {suggestions.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={() => {
                    updateSearch(m.genericName);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{m.genericName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.brandName} · {m.dosage}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    ₹{m.janAushadhiPrice}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CHIPS.map((chip) => {
            const active = query === chip.toLowerCase();
            return (
              <button
                key={chip}
                type="button"
                onClick={() => updateSearch(chip)}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  active
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'border-slate-200 bg-white/60 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-emerald-500/60 dark:hover:text-emerald-300'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {selectedMed ? (
        <div className="space-y-5 px-6 pb-6 pt-5">
          {filtered.length > 1 && (
            <div
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
              role="tablist"
              aria-label={hi ? 'मिलती हुई दवाएँ' : 'Matching medicines'}
            >
              {filtered.map((m, i) => (
                <button
                  key={`${m.genericName}-${m.dosage}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={m === selectedMed}
                  onClick={() => setPick(i)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    m === selectedMed
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {m.genericName} {m.dosage}
                </button>
              ))}
            </div>
          )}

          {/* Name */}
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedMed.genericName}
              <span className="ml-2 align-middle text-sm font-semibold text-slate-500 dark:text-slate-400">
                {selectedMed.dosage}
              </span>
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {hi ? 'ब्रांड समकक्ष:' : 'Branded equivalents:'}{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {selectedMed.brandName}
              </span>
            </p>
          </div>

          {/* Savings panel */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-700 p-5 text-white shadow-xl shadow-emerald-700/20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative flex items-center gap-5">
              <div
                className="relative h-[84px] w-[84px] shrink-0"
                role="img"
                aria-label={`${savingsPercent}% ${hi ? 'बचत' : 'cheaper'}`}
              >
                <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
                  <circle cx="42" cy="42" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="8" />
                  <circle
                    cx="42"
                    cy="42"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={RING_LENGTH}
                    strokeDashoffset={ringOffset}
                    style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-xl font-black">{savingsPercent}%</span>
                  <span className="mt-0.5 text-[10px] font-medium text-emerald-100">
                    {hi ? 'बचत' : 'cheaper'}
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-emerald-100">
                  {hi ? 'जन औषधि जेनेरिक' : 'Jan Aushadhi price'}
                </p>
                <p className="flex items-baseline gap-1 text-4xl font-black leading-tight">
                  ₹{formatINR(selectedMed.janAushadhiPrice)}
                  <span className="text-xs font-medium text-emerald-100">
                    {hi ? 'प्रति स्ट्रिप' : 'per strip'}
                  </span>
                </p>
                <p className="mt-1 text-xs text-emerald-50">
                  {hi ? 'वाणिज्यिक औसत एमआरपी' : 'Branded avg MRP'}{' '}
                  <span className="font-semibold line-through decoration-white/60">
                    ₹{formatINR(selectedMed.commercialPrice)}
                  </span>
                </p>
              </div>
            </div>

            {saved > 0 && (
              <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-white/15 px-4 py-2.5 text-xs backdrop-blur-sm">
                <span className="text-emerald-50">
                  {hi ? 'हर स्ट्रिप पर आपकी बचत' : 'You save on every strip'}
                </span>
                <span className="text-sm font-bold">₹{formatINR(saved)}</span>
              </div>
            )}
          </div>

          {/* About */}
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {selectedMed.purpose}
          </p>

          <div className="flex gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            <span aria-hidden="true" className="text-base leading-none">⚠️</span>
            <p className="font-medium">
              {selectedMed.whenToSeeDoctor || t('health.whenToSeeDoctor')}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-800">
            <Badge type="demo">{t('health.sampleInfo')}</Badge>
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold ${
                selectedMed.inStock
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {selectedMed.inStock && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    selectedMed.inStock ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              {selectedMed.inStock
                ? hi ? 'उपलब्ध है (In Stock)' : 'In stock nearby'
                : hi ? 'अल्प स्टॉक' : 'Low stock'}
            </span>
          </div>
        </div>
      ) : (
        <div className="px-6 pb-8 pt-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
            <span aria-hidden="true">🔍</span>
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {hi ? 'कोई दवा नहीं मिली।' : 'No medicines matched your search.'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {hi
              ? 'दवा का जेनेरिक या ब्रांड नाम लिखकर देखें।'
              : 'Try the generic or brand name, or pick one of the suggestions above.'}
          </p>
        </div>
      )}
    </section>
  );
}