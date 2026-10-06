import { useSearchParams } from 'react-router-dom';
import ChatDrawer from '../components/ai/ChatDrawer';
import MedicalDisclaimerBanner from '../components/ai/MedicalDisclaimerBanner';
import TriageActionCard from '../components/ai/TriageActionCard';
import { useLanguage } from '../context/LanguageContext';

export default function AiSaarthiPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  return (
    <div className="container-page py-8 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
          {t('ai.title')}
        </h1>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Interactive Chat Interface */}
        <div className="lg:col-span-7">
          <ChatDrawer initialQuery={initialQuery} />
        </div>

        {/* Right Column: Medical Disclaimer & Triage Action Card */}
        <div className="space-y-6 lg:col-span-5">
          <MedicalDisclaimerBanner />
          <TriageActionCard onSelectPrompt={(q) => console.log('Prompt selected:', q)} />
        </div>
      </div>
    </div>
  );
}
