import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="flex items-center rounded-xl border border-slate-200/80 bg-white/80 p-0.5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-800/80"
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold transition-all duration-200 ${
          lang === 'en'
            ? 'bg-brand text-white shadow-xs dark:bg-brand-light dark:text-slate-950'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('hi')}
        aria-pressed={lang === 'hi'}
        className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold transition-all duration-200 ${
          lang === 'hi'
            ? 'bg-brand text-white shadow-xs dark:bg-brand-light dark:text-slate-950'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
