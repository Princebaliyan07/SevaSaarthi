import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CandidateProfileModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-profile-modal-title"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Card Content */}
        <div className="space-y-6 pt-2">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/80 bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-800 dark:text-amber-300 shadow-2xs">
              <span>🚧</span>
              <span>{tx('Candidate Profile · Active Development', 'कैंडिडेट प्रोफ़ाइल · सक्रिय विकास')}</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-black text-white shadow-xs animate-pulse">
              <span>⚡</span>
              <span>{tx('Coming Soon', 'जल्द आ रहा है')}</span>
            </span>
          </div>

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-3xl shadow-inner border border-amber-400/40">
              🚧
            </div>
            <div className="space-y-1">
              <h2
                id="candidate-profile-modal-title"
                className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                {tx('Candidate & Citizen Profile', 'कैंडिडेट और नागरिक प्रोफ़ाइल')}
              </h2>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {tx('Feature Under Active Development', 'यह सुविधा विकास के चरण में है')}
              </p>
            </div>
          </div>

          {/* Main User Requested Text Card */}
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 p-4 sm:p-5 dark:border-amber-900/60 dark:from-amber-950/30 dark:to-orange-950/20">
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-200">
              {hi ? (
                <>
                  हम वर्तमान में इस एकीकृत <strong>कैंडिडेट और नागरिक प्रोफ़ाइल कार्ड</strong> को परिष्कृत कर रहे हैं! प्रत्येक व्यक्ति का यह समर्पित कार्ड होगा जो उनकी सत्यापित पहचान, आपातकालीन स्वास्थ्य क्रेडेंशियल, स्वयंसेवक बैज और लाइव घटना रिकॉर्ड प्रदर्शित करेगा।
                </>
              ) : (
                <>
                  We are currently polishing this unified <strong>Candidate & Citizen Profile</strong> card! Every individual will have this dedicated card displaying their verified identity, emergency health credentials, volunteer badges, and live incident records.
                </>
              )}
            </p>
          </div>

          {/* Feature Highlights Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>🛡️</span>
              <span>{tx('Verified Identity (UIDAI Aadhaar / ID)', 'सत्यापित पहचान (UIDAI आधार / ID)')}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>🩺</span>
              <span>{tx('Emergency Health Credentials', 'इमरजेंसी स्वास्थ्य क्रेडेंशियल')}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>🎖️</span>
              <span>{tx('Volunteer & Responder Badges', 'स्वयंसेवक व रिस्पॉन्डर बैज')}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>📋</span>
              <span>{tx('Live Incident & Service Records', 'लाइव घटना व सेवा रिकॉर्ड')}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-teal-600/20 hover:opacity-95 active:scale-95 transition"
            >
              {tx('Close', 'बंद करें')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
