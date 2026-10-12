import api from './api';
import {
  RED_FLAG_KEYWORDS,
  INTENTS,
  RED_FLAG_RESPONSE,
  DEFAULT_RESPONSE,
} from './aiKnowledge';

/**
 * Does `text` contain keyword `kw`?
 * - English/Hinglish single words must match as whole words, so "pani" no longer
 *   matches "company" and "mela" no longer matches "melatonin".
 * - Phrases and Hindi (Devanagari) keywords use a simple "contains" check.
 */
function hasKeyword(text, kw) {
  const isPlainWord = /^[a-z0-9]+$/.test(kw);
  if (!isPlainWord) return text.includes(kw);
  return new RegExp(`(^|[^a-z0-9])${kw}($|[^a-z0-9])`).test(text);
}

export function isRedFlagSymptom(text = '') {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => hasKeyword(lower, kw));
}

function findIntent(lower) {
  return INTENTS.find((intent) => intent.keywords.some((kw) => hasKeyword(lower, kw)));
}

export async function sendAiMessage(message, history = []) {
  const lower = message.toLowerCase().trim();

  // 1. Safety first: red-flag symptoms get an instant local answer.
  //    We never wait for (or depend on) the server for emergencies.
  if (isRedFlagSymptom(lower)) {
    return RED_FLAG_RESPONSE;
  }

  // 2. Try the backend AI if it exists.
  try {
    const res = await api.post('/ai/chat', { message, history });
    if (res.data?.data) return res.data.data;
  } catch {
    // backend not available, use the built-in knowledge base below
  }

  // 3. Built-in knowledge base (see aiKnowledge.js)
  const intent = findIntent(lower);
  if (intent) {
    return {
      reply: intent.reply,
      replyHi: intent.replyHi,
      isRedFlag: false,
      actions: intent.actions,
    };
  }

  return DEFAULT_RESPONSE;
}