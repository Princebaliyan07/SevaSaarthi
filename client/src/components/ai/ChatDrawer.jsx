import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAiMessage, isRedFlagSymptom } from '../../services/aiService';
import { useLanguage } from '../../context/LanguageContext';

/*
 * Privacy: chat messages live ONLY in React state below.
 * Nothing is written to localStorage, sessionStorage, cookies or any backend here,
 * so a page refresh (or closing the tab) wipes the conversation completely.
 */

const STARTER_PROMPTS = ['Flood help', 'Nearest hospital', 'Missing person'];

function BotAvatar({ className = 'h-8 w-8' }) {
  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-sm`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    </div>
  );
}

export default function ChatDrawer({ initialQuery = '', externalPrompt = null }) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const sessionRef = useRef(0); // bumps on every reset so late replies from an old chat are ignored
  const initialSentRef = useRef(false);

  // The greeting is NOT stored in messages, so it always matches the current language
  // and a reset simply returns to an empty list.
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedRedFlag, setLockedRedFlag] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  const hasChat = messages.length > 0;

  // Keep the newest message in view (scroll the chat box only, not the whole page)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  // Query coming from the URL (?query=...) is sent once
  useEffect(() => {
    if (initialQuery && !initialSentRef.current) {
      initialSentRef.current = true;
      handleSend(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Quick prompt chosen from the right-hand card
  useEffect(() => {
    if (externalPrompt?.text) {
      handleSend(externalPrompt.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrompt?.id]);

  const resetChat = () => {
    sessionRef.current += 1;
    setMessages([]);
    setInputText('');
    setLoading(false);
    setLockedRedFlag(false);
    setConfirmEnd(false);
  };

  const handleSend = async (queryText) => {
    const textToSend = (typeof queryText === 'string' ? queryText : inputText).trim();
    if (!textToSend) return;

    const session = sessionRef.current;
    const history = messages;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setConfirmEnd(false);
    setLoading(true);

    if (isRedFlagSymptom(textToSend)) {
      setLockedRedFlag(true);
    }

    try {
      const response = await sendAiMessage(textToSend, history);
      if (session !== sessionRef.current) return; // chat was reset while waiting
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: lang === 'hi' ? response.replyHi || response.reply : response.reply,
        actions: response.actions || [],
        isRedFlag: response.isRedFlag,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      if (session !== sessionRef.current) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Sorry, something went wrong. Please try again. In an emergency, call 112.',
          actions: [{ label: 'Call 112', type: 'call', value: '112', danger: true }],
        },
      ]);
    } finally {
      if (session === sessionRef.current) setLoading(false);
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
    <div className="flex h-[calc(100vh-15rem)] max-h-[720px] min-h-[540px] flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card dark:shadow-cardDark transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-900 px-4 py-3.5 text-white sm:px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-dark bg-green-400" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold">AI Saarthi</p>
            <p className="text-xs text-white/80">Online · Hindi, English, Hinglish</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChat && !confirmEnd && (
            <button
              type="button"
              onClick={() => setConfirmEnd(true)}
              className="rounded-full border border-white/40 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              End chat
            </button>
          )}
          <button
            type="button"
            onClick={resetChat}
            className="flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-300 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>
        </div>
      </div>

      {/* End chat confirmation */}
      {confirmEnd && (
        <div className="flex items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/40 px-4 py-2.5 text-sm text-amber-900 dark:text-amber-200 sm:px-6">
          <span>End this chat? The conversation will be deleted.</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setConfirmEnd(false)}
              className="rounded-full px-3 py-1 text-xs font-semibold text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40"
            >
              Keep chatting
            </button>
            <button
              type="button"
              onClick={resetChat}
              className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700"
            >
              End and delete
            </button>
          </div>
        </div>
      )}

      {/* Red Flag Alert Lock Banner */}
      {lockedRedFlag && (
        <div className="bg-sos px-4 py-3 text-center text-white">
          <p className="text-sm font-bold">
            This may be an emergency. Typing is paused for your safety.
          </p>
          <div className="mt-2 flex justify-center gap-2">
            <a
              href="tel:112"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-extrabold text-sos shadow hover:bg-slate-100"
            >
              Call 112 now
            </a>
            <button
              type="button"
              onClick={() => setLockedRedFlag(false)}
              className="rounded-full border border-white/60 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              I'm safe, continue
            </button>
          </div>
        </div>
      )}

      {/* Message stream */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/70 px-4 py-5 sm:px-6 transition-colors">
        {/* Greeting (always first, never stored) */}
        <div className="flex items-end gap-2.5">
          <BotAvatar />
          <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 px-4 py-3 text-sm leading-relaxed text-slate-800 dark:text-slate-100 shadow-sm">
            {t('ai.greeting')}
          </div>
        </div>

        {/* Starter chips (only on a fresh chat) */}
        {!hasChat && !loading && (
          <div className="flex flex-wrap gap-2 pl-[2.625rem]">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSend(p)}
                className="rounded-full border border-teal-600/70 dark:border-teal-500/50 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-300 transition hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : ''} max-w-full`}>
                {!isUser && <BotAvatar />}
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'rounded-br-md bg-gradient-to-br from-teal-700 to-emerald-800 text-white'
                      : m.isRedFlag
                      ? 'rounded-bl-md border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 font-semibold text-sos dark:text-red-300'
                      : 'rounded-bl-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  {m.text}
                </div>
              </div>

              {/* Suggested action pills */}
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2 pl-[2.625rem]">
                  {m.actions.map((act, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleActionClick(act)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                        act.danger
                          ? 'bg-sos text-white hover:bg-sos-dark focus-visible:ring-sos'
                          : 'border border-teal-600 dark:border-teal-500/60 bg-white dark:bg-slate-800 text-teal-800 dark:text-teal-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white focus-visible:ring-brand shadow-xs'
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

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-end gap-2.5">
            <BotAvatar />
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-4 py-3.5 shadow-sm" role="status" aria-label="AI Saarthi is typing">
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-teal-500" />
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 pb-3 pt-3 sm:px-5 transition-colors">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-1.5 transition focus-within:border-teal-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-teal-500/30"
        >
          <input
            type="text"
            autoComplete="off"
            disabled={lockedRedFlag}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              lockedRedFlag ? 'Typing paused. Please call 112.' : t('ai.placeholder')
            }
            className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={lockedRedFlag || !inputText.trim() || loading}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-700 to-emerald-800 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('ai.send')}
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
        <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Chats are not saved. Refreshing the page deletes this conversation.
        </p>
      </div>
    </div>
  );
}