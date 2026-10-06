import axios from 'axios';

const RED_FLAG_KEYWORDS = [
  'chest pain',
  'seene mein dard',
  'seena dard',
  'dil ka daura',
  'heart attack',
  'unconscious',
  'behosh',
  'severe bleeding',
  'khoon beh raha',
  'saas nahi aa rahi',
  'saans',
  'choking',
  'cant breathe',
  'cannot breathe',
  'snake bite',
  'saap',
  'poison',
  'drowning',
  'doob raha',
];

export function isRedFlagSymptom(text = '') {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * AI Saarthi triage and guidance service
 */
export async function processAiTriage(message, history = []) {
  const lower = (message || '').toLowerCase().trim();

  // 1. Red-flag life-threatening emergency check
  if (isRedFlagSymptom(lower)) {
    return {
      reply:
        '⚠️ EMERGENCY ALERT: This symptom may indicate a life-threatening medical emergency. Do NOT wait. Call 112 or 108 immediately. Proceeding to nearest trauma center.',
      replyHi:
        '⚠️ आपातकालीन चेतावनी: यह लक्षण जीवन के लिए घातक आपात स्थिति का संकेत हो सकता है। प्रतीक्षा न करें। तुरंत 112 या 108 पर कॉल करें। निकटतम ट्रॉमा सेंटर जाएं।',
      isRedFlag: true,
      urgency: 'critical',
      actions: [
        { label: '🚨 Call 112 / 108 Now', type: 'call', value: '112', danger: true },
        { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'AI Saarthi provides civic guidance only and is not a substitute for clinical diagnosis. In life risk, immediately call 112 or 108.',
    };
  }

  // 2. Flood or Water Inundation
  if (lower.includes('flood') || lower.includes('pani') || lower.includes('baadh') || lower.includes('doob')) {
    return {
      reply:
        'Please verify your immediate safety. If an evacuation order is active, move immediately to elevated ground or designated relief camp. Do not cross waterlogged bridges or submerged roads.',
      replyHi:
        'कृपया पहले अपनी सुरक्षा सुनिश्चित करें। यदि निकासी आदेश है तो ऊंचे स्थान या राहत शिविर की ओर जाएं। जलभराव वाले रास्तों या पुलों को पार न करें।',
      isRedFlag: false,
      urgency: 'high',
      actions: [
        { label: '⛺ View Safe Relief Shelters', type: 'link', value: '/live-board' },
        { label: '🆘 Report SOS Incident', type: 'link', value: '/emergency' },
      ],
      disclaimer: 'Follow state disaster management authority (SDMA) instructions.',
    };
  }

  // 3. Fever / Medication / Jan Aushadhi
  if (lower.includes('fever') || lower.includes('bukhar') || lower.includes('dawa') || lower.includes('medicine') || lower.includes('pain')) {
    return {
      reply:
        'For mild fever and body pain, Paracetamol 500mg/650mg is widely accessible at Pradhan Mantri Jan Aushadhi Kendras for ₹8–₹18 (up to 70% cheaper than branded options). Stay hydrated with ORS. If fever persists over 3 days or exceeds 102°F, consult a physician.',
      replyHi:
        'हल्के बुखार और दर्द के लिए, जन औषधि केंद्रों पर पैरासिटामोल ₹8–₹18 में उपलब्ध है (ब्रांडेड से 70% तक सस्ती)। ओआरएस घोल पिएं। बुखार 3 दिन से अधिक रहे तो डॉक्टर को दिखाएं।',
      isRedFlag: false,
      urgency: 'moderate',
      actions: [
        { label: '💊 Check Jan Aushadhi Generic Prices', type: 'link', value: '/healthcare' },
        { label: '👨‍⚕️ Book OPD Consultation', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'Medication advice is informational. Consult a certified medical practitioner before administration.',
    };
  }

  // 4. Kumbh Mela / Lost & Found / Missing Persons
  if (lower.includes('mela') || lower.includes('kumbh') || lower.includes('lost') || lower.includes('missing') || lower.includes('bheed') || lower.includes('crowd')) {
    return {
      reply:
        'For Kumbh Mela assistance: Check live zone density before visiting Sangam Ghat. If someone is separated, immediately register a case at the nearest Lost & Found Booth or submit a missing-person report to broadcast across all Mela command centers.',
      replyHi:
        'कुंभ मेला सहायता: संगम जाने से पहले घाट की भीड़ स्थिति जांचें। यदि कोई साथी बिछड़ गया है, तो तुरंत खोया-पाया केंद्र पर सूचना दें या मिसिंग रिपोर्ट दर्ज करें।',
      isRedFlag: false,
      urgency: 'moderate',
      actions: [
        { label: '📢 Report Missing Person', type: 'link', value: '/mela' },
        { label: '📊 Live Crowd Density Board', type: 'link', value: '/mela' },
      ],
      disclaimer: 'SevaSaarthi Mela Command Center coordinates with Prayagraj Police & NDRF.',
    };
  }

  // 5. Default General Guidance
  return {
    reply:
      `Hello! I am AI Saarthi, your civic emergency assistant. I can help you locate nearby 24x7 hospitals, compare Jan Aushadhi generic medicines, report 112 SOS emergencies, or navigate Kumbh Mela safety zones. How may I assist you today?`,
    replyHi:
      `नमस्ते! मैं एआई सारथी हूँ, आपका आपातकालीन सहायक। मैं आपको निकटतम 24x7 अस्पताल खोजने, जन औषधि दवाएं जांचने, 112 आपात स्थिति रिपोर्ट करने या कुंभ मेला सुरक्षा सहायता प्रदान कर सकता हूँ।`,
    isRedFlag: false,
    urgency: 'low',
    actions: [
      { label: '🏥 Find 24x7 Hospitals', type: 'link', value: '/healthcare' },
      { label: '🚨 Report SOS Emergency', type: 'link', value: '/emergency' },
      { label: '🗺️ Live Situation Map', type: 'link', value: '/live-board' },
    ],
    disclaimer: 'AI Saarthi provides civic guidance only. Always follow local authority instructions.',
  };
}

export default { isRedFlagSymptom, processAiTriage };
