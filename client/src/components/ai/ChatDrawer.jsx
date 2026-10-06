import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAiMessage, isRedFlagSymptom } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

export default function ChatDrawer({ initialQuery = '' }) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const chatBottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: t('ai.greeting'),
      actions: [],
    },
    {
      id: 'm-2',
      sender: 'user',
      text: 'Mere area mein flood aa gaya hai',
    },
    {
      id: 'm-3',
      sender: 'ai',
      text: 'Pehle batayein, kya aap abhi safe hain? Agar evacuation order hai to use follow karein, aur unchi jagah par jaiye. Main nearest shelter (1.1 km) dhoondh sakta hoon.',
      actions: [
        { label: 'Haan, shelter dikhao', type: 'link', value: '/disaster' },
        { label: 'Medicine request banao', type: 'link', value: '/healthcare' },
      ],
    },
    {
      id: 'm-4',
      sender: 'user',
      text: 'Nearest hospital',
    },
    {
      id: 'm-5',
      sender: 'ai',
      text: 'Nearest government hospital: District Government Hospital, 2.4 km, open 24x7. Kya main directions kholun?',
      actions: [{ label: 'Yes, open directions', type: 'link', value: '/healthcare' }],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedRedFlag, setLockedRedFlag] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    if (isRedFlagSymptom(textToSend)) {
      setLockedRedFlag(true);
    }

    try {
      const response = await sendAiMessage(textToSend, messages);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: lang === 'hi' ? response.replyHi || response.reply : response.reply,
        actions: response.actions || [],
        isRedFlag: response.isRedFlag,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'call') {
      window.location.href = `tel:${action.value}`;
    } else if (action.type === 'link') {
      navigate(action.value);
    } else {
      handleSend(action.label);
    }
  };

  return (
    <div className="card flex h-[620px] flex-col overflow-hidden bg-white shadow-card">
      {/* Red Flag Alert Lock Banner */}
      {lockedRedFlag && (
        <div className="bg-sos p-3 text-center text-white animate-pulse">
          <p className="text-xs font-extrabold uppercase tracking-wide">
            🚨 EMERGENCY RED-FLAG DETECTED: INPUT LOCKED FOR SAFETY 🚨
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <a
              href="tel:112"
              className="rounded-lg bg-white px-4 py-1.5 text-xs font-extrabold text-sos shadow hover:bg-slate-100"
            >
              Call 112 (National Emergency)
            </a>
            <button
              type="button"
              onClick={() => setLockedRedFlag(false)}
              className="rounded-lg border border-white/50 px-3 py-1.5 text-xs text-white hover:bg-white/10"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-brand text-white rounded-br-none'
                    : m.isRedFlag
                    ? 'bg-red-50 text-sos border border-red-200 rounded-bl-none font-semibold'
                    : 'bg-surface text-ink border border-line rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {/* Triage action suggestion pills */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.actions.map((act, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleActionClick(act)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                        act.danger
                          ? 'bg-sos text-white hover:bg-sos-dark'
                          : 'bg-brand text-white hover:bg-brand-dark'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span className="h-2 w-2 rounded-full bg-brand animate-ping"></span>
            <span>AI Saarthi is thinking...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Chat Input Bar matching Page 8 */}
      <div className="border-t border-line bg-surface p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            disabled={lockedRedFlag}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lockedRedFlag
                ? 'Input locked due to emergency symptom. Call 112.'
                : t('ai.placeholder')
            }
            className="flex-1 rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder-ink-soft focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={lockedRedFlag || !inputText.trim() || loading}
            className="btn-primary shrink-0 px-5"
          >
            {t('ai.send')}
          </button>
        </form>
      </div>
    </div>
  );
}
