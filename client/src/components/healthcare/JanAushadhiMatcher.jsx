import { useState } from 'react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function JanAushadhiMatcher({ medicines = [] }) {
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('paracetamol');

  const filtered = medicines.filter((m) =>
    m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMed = filtered[0] || medicines[0];

  const savingsPercent = selectedMed
    ? Math.round(((selectedMed.commercialPrice - selectedMed.janAushadhiPrice) / selectedMed.commercialPrice) * 100)
    : 0;

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>💊</span>
          <span>{t('health.medicineTitle')}</span>
        </h2>
        <Badge type="official">{lang === 'hi' ? 'जन औषधि' : 'Jan Aushadhi'}</Badge>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('health.medicineSearchPlaceholder')}
            className="w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 backdrop-blur-sm focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white dark:placeholder-slate-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick medicine suggestion chips */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {['paracetamol', 'cetirizine', 'pantoprazole', 'ORS'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSearchTerm(chip)}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition-all duration-200 ${
                searchTerm.toLowerCase() === chip.toLowerCase()
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {selectedMed ? (
        <div className="space-y-4 pt-1">
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedMed.genericName} <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{selectedMed.dosage}</span>
              </h3>
              <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300">
                {savingsPercent}% {lang === 'hi' ? 'बचत' : 'Cheaper'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {lang === 'hi' ? 'ब्रांड समकक्ष:' : 'Branded equivalents:'} <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedMed.brandName}</span>
            </p>
          </div>

          {/* Price comparison cards */}
          <div className="grid grid-cols-2 gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-center dark:border-slate-800 dark:bg-slate-900/60">
            <div className="rounded-xl bg-white/90 p-3 shadow-xs border border-emerald-400/60 dark:bg-slate-800/90 dark:border-emerald-500/40">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                {lang === 'hi' ? 'जन औषधि जेनेरिक' : 'Jan Aushadhi'}
              </span>
              <span className="mt-1 block text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{selectedMed.janAushadhiPrice}</span>
              <span className="block text-[10px] text-slate-400">{lang === 'hi' ? 'प्रति स्ट्रिप' : 'per strip'}</span>
            </div>

            <div className="rounded-xl bg-white/90 p-3 shadow-xs border border-slate-200 dark:bg-slate-800/90 dark:border-slate-700">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {lang === 'hi' ? 'वाणिज्यिक ब्रांडेड' : 'Commercial'}
              </span>
              <span className="mt-1 block text-2xl font-bold text-slate-400 line-through">₹{selectedMed.commercialPrice}</span>
              <span className="block text-[10px] text-slate-400">{lang === 'hi' ? 'औसत एमआरपी' : 'avg MRP'}</span>
            </div>
          </div>

          {/* Usage and advice */}
          <div className="space-y-2 text-xs">
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{selectedMed.purpose}</p>
            <p className="font-bold text-slate-800 dark:text-slate-100">
              ⚠️ {selectedMed.whenToSeeDoctor || t('health.whenToSeeDoctor')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <Badge type="demo">{t('health.sampleInfo')}</Badge>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {selectedMed.inStock ? (lang === 'hi' ? 'उपलब्ध है (In Stock)' : 'In stock nearby') : (lang === 'hi' ? 'अल्प स्टॉक' : 'Low stock')}
            </span>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {lang === 'hi' ? 'कोई दवा नहीं मिली।' : 'No medicines matched your search.'}
        </p>
      )}
    </div>
  );
}
