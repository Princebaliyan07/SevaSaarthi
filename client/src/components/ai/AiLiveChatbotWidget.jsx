import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendAiMessage, isRedFlagSymptom } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';
import useVoiceRecognition from '../../hooks/useVoiceRecognition';

// Starter suggestions shown when chat starts or is empty (matching user's screenshot layout)
const STARTER_SUGGESTIONS = [
  {
    icon: '🏥',
    labelEn: 'Find nearest hospital & emergency care',
    labelHi: 'नज़दीकी अस्पताल और इमरजेंसी वार्ड खोजें',
    prompt: 'Find nearest hospital',
  },
  {
    icon: '🚨',
    labelEn: 'Disaster helpline & active emergency alert',
    labelHi: 'आपदा हेल्पलाइन एवं सक्रिय इमरजेंसी अलर्ट',
    prompt: 'I need emergency help and disaster helpline',
  },
  {
    icon: '🩺',
    labelEn: 'First aid & emergency symptom triage',
    labelHi: 'प्राथमिक उपचार एवं लक्षणों की जाँच',
    prompt: 'What are the emergency first aid steps?',
  },
  {
    icon: '🕉️',
    labelEn: 'Prayagraj Mela lost person & facilities',
    labelHi: 'प्रयागराज मेला खोया-पाया और सुविधा केंद्र',
    prompt: 'How to report a missing person in Mela?',
  },
  {
    icon: '💊',
    labelEn: 'Jan Aushadhi generic medicines store',
    labelHi: 'जन औषधि केंद्र और सस्ती दवाइयां',
    prompt: 'Jan Aushadhi medicine store',
  },
];

function RobotFaceSvg({ className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Head Antenna */}
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />
      <line x1="12" y1="5" x2="12" y2="8" />
      {/* Robot Head Body */}
      <rect x="4" y="8" width="16" height="12" rx="3.5" />
      {/* Eyes with glow */}
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
      {/* Friendly Mouth */}
      <path d="M9 16.5h6" />
      {/* Side Ears / Sensors */}
      <line x1="2" y1="13" x2="4" y2="13" />
      <line x1="20" y1="13" x2="22" y2="13" />
    </svg>
  );
}

export default function AiLiveChatbotWidget() {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcomeTooltip, setShowWelcomeTooltip] = useState(true);
  const [lockedRedFlag, setLockedRedFlag] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sessionRef = useRef(0);

  // Voice speech-to-text integration
  const { supported: voiceSupported, listening, transcript, start: startVoice, stop: stopVoice } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowWelcomeTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Hide floating robot on full-page AI Saarthi route to avoid duplicate UI
  if (pathname === '/ai-saarthi') {
    return null;
  }

  const handleSend = async (queryText) => {
    const textToSend = (typeof queryText === 'string' ? queryText : inputText).trim();
    if (!textToSend || loading) return;

    const currentSession = sessionRef.current;
    const history = messages;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    if (isRedFlagSymptom(textToSend)) {
      setLockedRedFlag(true);
    }

    try {
      const response = await sendAiMessage(textToSend, history);
      if (currentSession !== sessionRef.current) return;

      const aiReplyText = hi && response.replyHi ? response.replyHi : response.reply;
      const botMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        actions: response.actions || [],
        isRedFlag: Boolean(response.isRedFlag),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      if (currentSession !== sessionRef.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: tx(
            'I am currently operating in safe offline mode. For critical life emergencies, please dial 112 immediately.',
            'मैं सुरक्षित ऑफलाइन मोड में काम कर रहा हूँ। किसी भी आपात स्थिति में कृपया तुरंत 112 डायल करें।'
          ),
          actions: [{ label: 'Call 112', type: 'call', value: '112', danger: true }],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    sessionRef.current += 1;
    setMessages([]);
    setInputText('');
    setLoading(false);
    setLockedRedFlag(false);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'call') {
      window.location.href = `tel:${action.value}`;
    } else if (action.type === 'link') {
      navigate(action.value);
      setIsOpen(false);
    } else if (action.type === 'prompt') {
      handleSend(action.value || action.label);
    }
  };

  return (
    <aside
      aria-label="AI Saarthi Assistant"
      className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 select-none font-sans"
    >
      {/* ─── STATE 1: COLLAPSED ROBOT FACE BUTTON ─── */}
      {!isOpen && (
        <div className="relative group animate-fadeIn">
          {/* Dismissible Greeting Tooltip / Notification Chip */}
          {showWelcomeTooltip && messages.length === 0 && (
            <div
              className="absolute -top-12 right-0 flex items-center gap-1.5 whitespace-nowrap rounded-2xl bg-white/95 dark:bg-slate-900/95 px-3.5 py-1.5 text-xs font-black text-slate-800 dark:text-slate-100 shadow-xl border border-teal-500/30 backdrop-blur-md animate-bounce cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <span className="text-sm">👋</span>
              <span>{tx('Ask AI Saarthi!', 'AI सारथी से पूछें!')}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWelcomeTooltip(false);
                }}
                className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          )}

          {/* Floating Robot Face FAB Button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-600 text-white shadow-2xl shadow-teal-600/40 border-2 border-white/80 dark:border-slate-800 transition-all duration-300 hover:scale-110 active:scale-95 group-hover:shadow-teal-500/60"
            title={tx('Chat with AI Saarthi', 'AI सारथी से बात करें')}
            aria-label={tx('Open AI Saarthi live chat', 'AI सारथी लाइव चैट खोलें')}
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-2xl sm:rounded-3xl bg-teal-400/30 animate-pulse -z-10 blur-xs" />

            {/* Robot Face SVG Icon */}
            <RobotFaceSvg className="h-7 w-7 sm:h-8 sm:w-8 transition-transform group-hover:rotate-6" />

            {/* Live Online Green Dot */}
            <span
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 shadow-xs"
              title="Online"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            </span>

            {/* AI Pill Badge */}
            <span className="absolute -bottom-2 inset-x-0 mx-auto w-max rounded-full bg-slate-900/90 dark:bg-black/90 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-teal-300 border border-teal-500/40 shadow-xs">
              AI
            </span>
          </button>
        </div>
      )}

      {/* ─── STATE 2: EXPANDED LIVE CHAT WINDOW (Matching User Screenshot) ─── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Saarthi Live Chat"
          className="flex flex-col w-[350px] sm:w-[390px] max-w-[calc(100vw-32px)] h-[540px] max-h-[82vh] rounded-3xl border border-teal-500/30 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/25 overflow-hidden transition-all duration-300 animate-slideUp backdrop-blur-2xl"
        >
          {/* Top Header Row (SevaSaarthi Theme + Controls) */}
          <header className="relative flex items-center justify-between border-b border-teal-500/20 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 px-4 py-3.5 text-white shadow-sm shrink-0">
            {/* Bot Identity */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md shadow-inner border border-white/30">
                <RobotFaceSvg className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-teal-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight leading-none">
                    {tx('AI Saarthi', 'AI सारथी')}
                  </h3>
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                    {tx('Live 24/7', 'लाइव 24/7')}
                  </span>
                </div>
                <p className="text-[11px] text-teal-100/90 font-medium leading-none mt-1">
                  {tx('Emergency & Civic Assistant', 'आपातकालीन व नागरिक सहायक')}
                </p>
              </div>
            </div>

            {/* Window Controls: Restart, Minimize, Cross */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="rounded-xl p-1.5 text-teal-100 hover:bg-white/20 hover:text-white transition"
                title={tx('Clear & restart chat', 'चैट रीसेट करें')}
                aria-label="Restart chat"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              {/* Minimize button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-teal-100 hover:bg-white/20 hover:text-white transition"
                title={tx('Minimize chat', 'चैट छोटा करें')}
                aria-label="Minimize"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Cross button (Collapses into Robot Face) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1.5 text-teal-100 hover:bg-rose-500/80 hover:text-white transition"
                title={tx('Close to robot face', 'बंद करके रोबोट आइकॉन बनाएं')}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Red Flag Emergency Alert Top Ribbon */}
          {lockedRedFlag && (
            <div className="flex items-center justify-between gap-2 bg-rose-600 px-3.5 py-2 text-xs font-black text-white shrink-0 animate-pulse">
              <span className="flex items-center gap-1.5">
                <span>🚨</span>
                <span>{tx('Critical Symptoms Detected!', 'गंभीर लक्षण पाए गए!')}</span>
              </span>
              <a
                href="tel:112"
                className="rounded-lg bg-white px-2 py-0.5 text-[11px] font-black text-rose-700 shadow-xs hover:bg-rose-50"
              >
                {tx('Call 112 Now', 'तुरंत 112 मिलाएं')}
              </a>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70 dark:bg-slate-900/90"
          >
            {/* Initial Welcome Greeting Card */}
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs">
                <RobotFaceSvg className="h-4 w-4" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 p-3 shadow-xs border border-slate-200/80 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 leading-relaxed">
                <p className="font-bold text-teal-700 dark:text-teal-400 mb-1">
                  {tx('Hi! 👋 How can I help you today?', 'नमस्ते! 👋 आज मैं आपकी क्या सहायता कर सकता हूँ?')}
                </p>
                <p>
                  {tx(
                    'I can guide you through hospitals, disaster helplines, Mela facilities, and first aid emergencies.',
                    'मैं आपको अस्पताल, आपदा राहत, प्रयागराज मेला सुविधा और प्राथमिक उपचार में तुरंत मदद कर सकता हूँ।'
                  )}
                </p>
              </div>
            </div>

            {/* Quick Action Suggestion Cards (Visible when conversation is fresh) */}
            {messages.length === 0 && (
              <div className="pt-1 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                  {tx('Frequently Asked Questions:', 'अक्सर पूछे जाने वाले सवाल:')}
                </p>
                <div className="space-y-1.5">
                  {STARTER_SUGGESTIONS.map((item) => (
                    <button
                      key={item.prompt}
                      type="button"
                      onClick={() => handleSend(item.prompt)}
                      className="w-full flex items-center justify-between gap-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-750 bg-white dark:bg-slate-800/90 p-2.5 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all hover:border-teal-500 hover:bg-teal-50/60 dark:hover:bg-slate-750 hover:shadow-xs active:scale-[0.99] group"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-base shrink-0">{item.icon}</span>
                        <span className="truncate">{hi ? item.labelHi : item.labelEn}</span>
                      </span>
                      <span className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className={`flex items-start gap-2 max-w-[88%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-2xs mt-0.5">
                        <RobotFaceSvg className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`rounded-2xl p-3 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                        isUser
                          ? 'rounded-tr-xs bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium shadow-teal-600/10'
                          : m.isRedFlag
                          ? 'rounded-tl-xs bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 border-2 border-rose-300 dark:border-rose-800 font-medium'
                          : 'rounded-tl-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700'
                      }`}
                    >
                      {m.text}

                      {/* Action buttons embedded in reply */}
                      {m.actions && m.actions.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                          {m.actions.map((act) => (
                            <button
                              key={act.label}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition shadow-2xs ${
                                act.danger
                                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                                  : 'bg-teal-50 dark:bg-slate-700 text-teal-800 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-100'
                              }`}
                            >
                              {act.type === 'call' && '📞 '}
                              {act.label}
                              {act.type === 'link' && ' ↗'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 px-1">
                    {m.time}
                  </span>
                </div>
              );
            })}

            {/* Thinking / Typing Animation Indicator */}
            {loading && (
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <RobotFaceSvg className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-semibold">{tx('AI Saarthi is thinking...', 'उत्तर तैयार कर रहे हैं...')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar */}
          <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 sm:p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              {/* Voice Speech Dictation Button */}
              {voiceSupported && (
                <button
                  type="button"
                  onClick={listening ? stopVoice : startVoice}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                    listening
                      ? 'bg-rose-500 border-rose-500 text-white animate-pulse'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600'
                  }`}
                  title={listening ? 'Stop recording' : 'Voice input'}
                >
                  <span className="text-base">🎙️</span>
                </button>
              )}

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={tx('Type your question...', 'अपना सवाल यहाँ लिखें...')}
                className="flex-1 rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20 hover:opacity-95 active:scale-95 disabled:opacity-40 transition"
                title={tx('Send message', 'भेजें')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            {/* Bottom Disclaimer Micro-copy */}
            <p className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500">
              {tx(
                'AI guidance only. For medical & life emergencies, call 112 / 108.',
                'केवल सहायक जानकारी। जीवन आपात स्थिति में 112 / 108 पर कॉल करें।'
              )}
            </p>
          </footer>
        </div>
      )}
    </aside>
  );
}
