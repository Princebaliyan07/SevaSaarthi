import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/50 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/50">
      <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand text-xs font-black text-white">
            S
          </span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {t('brand.name')} · {t('brand.tagline')}
          </span>
        </div>
        <p className="text-center sm:text-right text-xs text-slate-500 dark:text-slate-400">
          {t('footer.text')}
        </p>
      </div>
    </footer>
  );
}
