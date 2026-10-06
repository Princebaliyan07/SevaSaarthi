import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';
import { useLanguage } from '../../context/LanguageContext';

export default function VoiceSearchModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const { supported, listening, transcript, error, start, stop } = useVoiceRecognition();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    onClose();
    navigate(`/ai-saarthi?query=${encodeURIComponent(inputText)}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-md transition-all"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/15 text-base">
              🎙️
            </span>
            <h2 id="voice-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'hi' ? 'आवाज़ खोज एवं AI सहायता' : 'Voice Search & AI Assistant'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Microphone Interactive Zone */}
        <div className="my-6 flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={listening ? stop : start}
            disabled={!supported}
            className={`group relative flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
              listening
                ? 'bg-gradient-to-r from-red-600 to-rose-600 animate-pulse ring-8 ring-rose-500/30 shadow-glowSos'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-600/30 ring-4 ring-teal-500/20'
            }`}
            aria-label={listening ? 'Stop recording' : 'Start voice input'}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:scale-110">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>

          <p className="mt-4 text-sm font-bold text-slate-800 dark:text-slate-100">
            {listening
              ? lang === 'hi'
                ? '🔴 सुन रहे हैं... कृपया बोलिए'
                : '🔴 Listening... speak clearly'
              : lang === 'hi'
              ? 'माइक पर टैप करें और बोलें (हिंदी या अंग्रेजी)'
              : 'Tap microphone to speak in Hindi or English'}
          </p>

          {!supported && (
            <p className="mt-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs text-amber-700 dark:text-amber-300">
              {lang === 'hi'
                ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया नीचे लिखकर खोजें।'
                : 'Speech recognition is not supported in this browser. Please type below.'}
            </p>
          )}

          {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}
        </div>

        {/* Input & Search Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'उदा. "निकटतम अस्पताल" या "बाढ़ सहायता"...'
                  : 'e.g. "Nearest hospital" or "Flood shelter"...'
              }
              className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="btn-primary px-5 py-2.5 text-xs font-bold whitespace-nowrap"
            >
              {lang === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold">{lang === 'hi' ? 'सुझाव:' : 'Try:'}</span>
          <button
            type="button"
            onClick={() => setInputText('Nearest emergency hospital')}
            className="rounded-lg border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🏥 Nearest hospital
          </button>
          <button
            type="button"
            onClick={() => setInputText('Flood relief shelter')}
            className="rounded-lg border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🌊 Flood shelter
          </button>
          <button
            type="button"
            onClick={() => setInputText('Jan Aushadhi paracetamol price')}
            className="rounded-lg border border-slate-200/80 bg-slate-100/80 px-2.5 py-1 font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            💊 Generic medicine
          </button>
        </div>
      </div>
    </div>
  );
}
