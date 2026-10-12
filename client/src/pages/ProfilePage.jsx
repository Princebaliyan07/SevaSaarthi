import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);

  return (
    <div className="container-page py-12 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-center space-y-6 relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/80 bg-amber-500/15 px-3 py-1 text-xs font-black text-amber-800 dark:text-amber-300">
            <span>🚧</span>
            <span>{tx('Candidate Profile · Active Development', 'कैंडिडेट प्रोफ़ाइल · सक्रिय विकास')}</span>
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-black text-white shadow-xs animate-pulse">
            <span>⚡</span>
            <span>{tx('Coming Soon', 'जल्द आ रहा है')}</span>
          </span>
        </div>

        {/* Big Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/15 text-4xl shadow-inner border border-amber-400/40">
          🚧
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {tx('Candidate & Citizen Profile', 'कैंडिडेट और नागरिक प्रोफ़ाइल')}
          </h1>
          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
            {tx('Unified Identity & Emergency Credentials Card', 'एकीकृत पहचान एवं आपातकालीन क्रेडेंशियल कार्ड')}
          </p>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 p-5 text-left dark:border-amber-900/60 dark:from-amber-950/30 dark:to-orange-950/20">
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-200 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
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

        {/* Back to Home Link */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md shadow-teal-600/20 hover:opacity-95 transition"
          >
            <span>←</span>
            <span>{tx('Back to Home', 'होमपेज पर वापस जाएं')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
