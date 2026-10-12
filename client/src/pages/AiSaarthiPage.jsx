import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatDrawer from '../components/ai/ChatDrawer';
import MedicalDisclaimerBanner from '../components/ai/MedicalDisclaimerBanner';
import TriageActionCard from '../components/ai/TriageActionCard';
import { useLanguage } from '../context/LanguageContext';

export default function AiSaarthiPage() {
  const { lang, t } = useLanguage();
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
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-[#0B0F19]">
      <div className="container-page space-y-6 py-8">
        {/* Hero Header Banner (matching Volunteers page aesthetic) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-teal-500/20">
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <span>🤖</span>
              <span>{lang === 'hi' ? 'बुद्धिमान सहायता प्रणाली' : 'Intelligent Assistance Grid'}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              {t('ai.title')}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {lang === 'hi'
                ? 'अपने आस-पास अस्पताल, राहत शिविर और आपातकालीन मदद खोजें। हिंदी, अंग्रेजी या हिंग्लिश में पूछें।'
                : 'Find hospitals, shelters and emergency help near you. Ask in Hindi, English or Hinglish.'}
            </p>
          </div>
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