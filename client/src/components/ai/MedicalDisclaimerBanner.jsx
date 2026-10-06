import { useLanguage } from '../../context/LanguageContext';

export default function MedicalDisclaimerBanner() {
  const { lang, t } = useLanguage();

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950">
      <div className="flex items-start gap-2.5">
        <span className="text-base text-amber-600">ℹ️</span>
        <div>
          <h4 className="font-bold text-amber-900">
            {lang === 'hi' ? 'चिकित्सा अस्वीकरण एवं सुरक्षा दिशानिर्देश' : 'Medical Disclaimer & Safety Notice'}
          </h4>
          <p className="mt-1 leading-relaxed text-amber-900/90">
            {t('ai.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
