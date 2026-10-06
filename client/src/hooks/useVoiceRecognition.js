import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Speech-to-text (Web Speech API) in Hindi / English.
 * Works in Chrome / Edge / Android. `supported` is false elsewhere, so UI can hide the mic.
 */
export default function useVoiceRecognition() {
  const { lang } = useLanguage();
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const supported = !!SR;

  const start = useCallback(() => {
    if (!SR) return;
    setError(null);
    setTranscript('');
    const rec = new SR();
    rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (e) => {
      let text = '';
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    rec.onerror = (e) => {
      setError(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice input failed. Please try again.');
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [SR, lang]);

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => {
      try {
        recRef.current?.abort?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return { supported, listening, transcript, error, start, stop, setTranscript };
}
