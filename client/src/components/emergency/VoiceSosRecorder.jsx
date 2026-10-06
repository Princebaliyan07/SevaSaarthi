import { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function VoiceSosRecorder({ onRecordComplete }) {
  const { lang } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const timerRef = useRef(null);

  const startRecord = () => {
    setRecording(true);
    setRecordTime(0);
    setHasRecorded(false);
    timerRef.current = setInterval(() => {
      setRecordTime((t) => t + 1);
    }, 1000);
  };

  const stopRecord = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    setHasRecorded(true);
    onRecordComplete?.({ duration: recordTime });
  };

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">
            {lang === 'hi' ? 'पुश-टू-टॉक वॉयस एसओएस' : 'Push-to-Talk Voice SOS'}
          </h3>
          <p className="text-[11px] text-ink-soft">
            {lang === 'hi'
              ? 'आपातकालीन ऑपरेटर के लिए तुरंत 10-सेकंड की ऑडियो क्लिप रिकॉर्ड करें'
              : 'Record a rapid 10s voice note dispatched with your coordinates'}
          </p>
        </div>

        <button
          type="button"
          onClick={recording ? stopRecord : startRecord}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow transition-transform active:scale-95 ${
            recording ? 'bg-sos animate-pulse ring-4 ring-sos/30' : 'bg-slate-800 hover:bg-slate-900'
          }`}
          aria-label={recording ? 'Stop recording' : 'Start voice SOS'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>
      </div>

      {recording && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-red-50 p-2.5 text-xs text-sos font-semibold">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sos animate-ping"></span>
            <span>{lang === 'hi' ? 'रिकॉर्ड हो रहा है...' : 'Recording voice note...'}</span>
          </div>
          <span>00:0{recordTime}s</span>
        </div>
      )}

      {hasRecorded && (
        <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 font-semibold">
          <span>✓ {lang === 'hi' ? 'वॉयस नोट संलग्न किया गया (00:05)' : 'Audio note attached to SOS report (00:05)'}</span>
          <button
            type="button"
            onClick={() => setHasRecorded(false)}
            className="text-[11px] underline text-slate-600 hover:text-slate-900"
          >
            {lang === 'hi' ? 'हटाएं' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
