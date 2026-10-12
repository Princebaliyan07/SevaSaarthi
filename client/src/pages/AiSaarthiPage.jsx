import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatDrawer from '../components/ai/ChatDrawer';
import MedicalDisclaimerBanner from '../components/ai/MedicalDisclaimerBanner';
import TriageActionCard from '../components/ai/TriageActionCard';
import { useLanguage } from '../context/LanguageContext';

export default function AiSaarthiPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read ?query=... once, then remove it from the URL so a refresh starts a clean chat.
  const [initialQuery] = useState(() => searchParams.get('query') || '');
  useEffect(() => {
    if (searchParams.has('query')) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Quick prompts from the right-hand card are passed to the chat as a one-off message.
  const [externalPrompt, setExternalPrompt] = useState(null);
  const handleSelectPrompt = (text) => {
    setExternalPrompt({ id: Date.now(), text });
    // On phones the chat is above the quick-help card, so bring it into view.
    document
      .getElementById('saarthi-chat')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="bg-gradient-to-b from-teal-50/70 via-white to-white">
      <div className="container-page space-y-6 py-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
            {t('ai.title')}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-ink-soft sm:text-base">
            Find hospitals, shelters and help near you. Ask in Hindi, English or Hinglish.
          </p>
        </div>

        {/* Main two column layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Left: chat */}
          <div id="saarthi-chat" className="lg:col-span-7">
            <ChatDrawer initialQuery={initialQuery} externalPrompt={externalPrompt} />
          </div>

          {/* Right: disclaimer and quick help */}
          <div className="space-y-5 lg:col-span-5">
            <MedicalDisclaimerBanner />
            <TriageActionCard onSelectPrompt={handleSelectPrompt} />
          </div>
        </div>
      </div>
    </div>
  );
}