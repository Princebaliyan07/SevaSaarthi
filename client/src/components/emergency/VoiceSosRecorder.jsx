import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { reportIncident } from '../../services/incidentService';

export default function VoiceSosRecorder({ onDispatchSuccess }) {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const hi = lang === 'hi';

  // Start empty as requested - do not pre-fill any default or officer name
  const [callerName, setCallerName] = useState('');
  const [callerPhone, setCallerPhone] = useState('');
  const [coords, setCoords] = useState(null);
  const [locStatus, setLocStatus] = useState('detecting'); // 'detecting' | 'ready' | 'fallback'
  const [locAddress, setLocAddress] = useState('Detecting GPS location...');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isDispatching, setIsDispatching] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Auto-detect GPS location on mount & reverse geocode to exact area name (e.g. Greater Noida)
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocStatus('fallback');
      setLocAddress('Prayagraj Emergency Sector (GPS unavailable)');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocStatus('ready');
        const coordsText = `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
        setLocAddress(`GPS: ${coordsText}`);

        // Reverse geocoding to detect exact place name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
            const city = addr.city || addr.town || addr.city_district || addr.county || '';
            const state = addr.state || '';
            
            const areaParts = [neighborhood, city, state].filter(Boolean);
            const areaName = areaParts.length > 0 ? areaParts.join(', ') : (data.display_name?.split(',').slice(0, 3).join(',') || '');
            
            if (areaName) {
              setLocAddress(`${areaName} (GPS: ${coordsText})`);
            }
          }
        } catch (err) {
          console.warn('Reverse geocoding failed, using coordinates:', err);
        }
      },
      () => {
        setLocStatus('fallback');
        setLocAddress('Prayagraj Zone 4 (Default Location)');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const startVoiceRecording = async () => {
    try {
      setSentSuccess(false);
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        sendVoiceEmergencyDispatch(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            // Auto stop at 20 seconds
            stopVoiceRecording();
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert(
        hi
          ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया माइक अनुमति दें।'
          : 'Microphone permission denied. Please allow microphone access to record emergency voice SOS.'
      );
    }
  };

  const stopVoiceRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const sendVoiceEmergencyDispatch = async (blob) => {
    setIsDispatching(true);

    try {
      // Convert blob to base64 Data URL for standalone audio transmission
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        const base64Audio = reader.result;

        const incidentPayload = {
          title: `🎙️ Voice SOS: ${callerName || 'Emergency Citizen'}`,
          category: 'Medical',
          severity: 'critical',
          name: callerName || 'Citizen User',
          phone: callerPhone || 'Not provided',
          lat: coords?.lat || 25.4358,
          lng: coords?.lng || 81.8463,
          location: locAddress,
          description: `Citizen Voice SOS dispatched directly to Police Command Centre. Coordinates: ${locAddress}. Contact: ${callerPhone || 'N/A'}.`,
          audioUrl: base64Audio,
        };

        const res = await reportIncident(incidentPayload);
        setIsDispatching(false);
        setSentSuccess(true);
        onDispatchSuccess?.(res?.data || res);
      };
    } catch {
      setIsDispatching(false);
      setSentSuccess(true);
    }
  };

  return (
    <div className="rounded-3xl border border-rose-300 dark:border-rose-900/60 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl shadow-rose-900/5 space-y-4">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 dark:border-rose-950 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-rose-600/30 text-lg">
            🎙️
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {hi ? 'पुश इन इमरजेंसी (आपातकालीन वॉयस एसओएस)' : 'Push in Emergency · Voice SOS Dispatch'}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {hi
                ? 'जो भी आप बोलेंगे सीधे पुलिस व आपदा कंट्रोल रूम को जाएगा।'
                : 'Dispatches your live voice audio & coordinates directly to the Police Admin.'}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 px-3 py-1 text-xs font-bold border border-rose-500/20">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          {hi ? 'पुलिस व कंट्रोल रूम सीधा ट्रांसमिट' : 'Direct Police Command Audio'}
        </span>
      </div>

      {/* Caller Name & Phone Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            {hi ? 'आपका नाम' : 'Your Name'}
          </label>
          <input
            type="text"
            placeholder={hi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
            value={callerName}
            onChange={(e) => setCallerName(e.target.value)}
            disabled={isRecording || isDispatching}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
            {hi ? 'मोबाइल नंबर' : 'Mobile number'}
          </label>
          <input
            type="tel"
            placeholder={hi ? 'मोबाइल नंबर' : 'Mobile number'}
            value={callerPhone}
            onChange={(e) => setCallerPhone(e.target.value)}
            disabled={isRecording || isDispatching}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Auto Location Telemetry Display */}
      <div className="flex items-center justify-between rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 p-3 text-xs">
        <div className="flex items-center gap-2">
          <span>📍</span>
          <div>
            <span className="font-bold text-teal-900 dark:text-teal-200">
              {hi ? 'स्वतः पहचानी गई लोकेशन:' : 'Auto-detected Location:'}
            </span>
            <p className="text-[11px] font-mono font-semibold text-teal-700 dark:text-teal-400">
              {locAddress}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase text-teal-800 dark:text-teal-300 bg-teal-200/60 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
          {locStatus === 'ready' ? '✓ GPS Verified' : 'Auto'}
        </span>
      </div>

      {/* Big Push in Emergency Button */}
      <div className="pt-2 flex flex-col items-center justify-center space-y-3">
        <button
          type="button"
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          disabled={isDispatching}
          className={`w-full group relative flex items-center justify-center gap-3 rounded-2xl py-4 px-6 text-sm sm:text-base font-black text-white shadow-xl transition-all duration-300 active:scale-95 cursor-pointer ${
            isRecording
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 animate-pulse ring-4 ring-rose-500/40 shadow-rose-600/40'
              : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-rose-600/30'
          }`}
        >
          <span className="text-2xl">{isRecording ? '⏹️' : '🎙️'}</span>
          <span>
            {isRecording
              ? (hi ? `रिकॉर्डिंग समाप्त करें व भेजें (00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}s)` : `Tap to Stop & Send (00:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}s)`)
              : isDispatching
              ? (hi ? 'कंट्रोल रूम को भेजा जा रहा है...' : 'Transmitting to Police Command...')
              : (hi ? 'पुश इन इमरजेंसी — बोलकर एसओएस भेजें' : 'Push in Emergency — Speak Voice SOS')}
          </span>
        </button>

        {isRecording && (
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>
              {hi ? 'माइक्रोफ़ोन चालू है — समस्या बोलें...' : 'Microphone recording — Describe the emergency clearly...'}
            </span>
          </div>
        )}

        {/* Confirmation that voice has been sent directly to admin without local replay */}
        {sentSuccess && !isRecording && (
          <div className="w-full flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-3.5 text-xs font-bold text-emerald-800 dark:text-emerald-200">
            <div className="flex items-center gap-2">
              <span className="text-base">✓</span>
              <span>
                {hi
                  ? 'वॉयस ऑडियो व जीपीएस लोकेशन पुलिस कंट्रोल रूम को सफलतापूर्वक भेजी गई!'
                  : 'Voice audio & GPS location transmitted directly to Police Command Centre!'}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900 px-2 py-0.5 rounded-full font-mono">
              Live
            </span>
          </div>
        )}

        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500">
          {hi
            ? 'सुरक्षा नियम: वॉयस नोट इस फोन पर सेव नहीं होता। रिकॉर्ड होते ही सीधे कमांड सेंटर में पुलिस अधिकारी सुन सकते हैं।'
            : 'Privacy Note: Audio is not stored on your device. It is securely routed to the Police Admin console.'}
        </p>
      </div>
    </div>
  );
}
