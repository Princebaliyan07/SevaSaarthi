import { useLanguage } from '../../context/LanguageContext';

// Top strip shown on every page while the app runs on demo data.
export default function DemoBanner() {
  const { t } = useLanguage();
  return (
    <div role="note" className="bg-demo-bg px-4 py-1.5 text-center text-xs font-medium text-demo-fg">
      {t('banner.demo')}
    </div>
  );
}
