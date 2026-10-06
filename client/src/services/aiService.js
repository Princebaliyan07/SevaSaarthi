import api from './api';

const RED_FLAG_KEYWORDS = [
  'chest pain',
  'seene mein dard',
  'dil ka daura',
  'heart attack',
  'unconscious',
  'behosh',
  'severe bleeding',
  'khoon beh raha',
  'saas nahi aa rahi',
  'choking',
  'cant breathe',
  'cannot breathe',
];

export function isRedFlagSymptom(text = '') {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function sendAiMessage(message, history = []) {
  try {
    const res = await api.post('/ai/chat', { message, history });
    if (res.data?.data) return res.data.data;
  } catch {
    // fallback to smart mock triage logic
  }

  const lower = message.toLowerCase().trim();

  // 1. Red Flag Medical Emergency Guardrail
  if (isRedFlagSymptom(lower)) {
    return {
      reply:
        '⚠️ EMERGENCY ALERT: This symptom may indicate a life-threatening medical emergency. Do NOT wait. Call 112 or 108 immediately. Proceeding to nearest trauma center.',
      replyHi:
        '⚠️ आपातकालीन चेतावनी: यह लक्षण जीवन के लिए घातक आपात स्थिति का संकेत हो सकता है। प्रतीक्षा न करें। तुरंत 112 या 108 पर कॉल करें। निकटतम ट्रॉमा सेंटर जाएं।',
      isRedFlag: true,
      actions: [
        { label: 'Call 112 Now', type: 'call', value: '112', danger: true },
        { label: 'Nearest Emergency Hospital (2.4 km)', type: 'link', value: '/healthcare' },
      ],
    };
  }

  // 2. Flood or Disaster
  if (lower.includes('flood') || lower.includes('pani') || lower.includes('baadh') || lower.includes('doob')) {
    return {
      reply:
        'Pehle batayein, kya aap abhi safe hain? Agar evacuation order hai to use follow karein, aur unchi jagah par jaiye. Main nearest shelter (1.1 km) dhoondh sakta hoon.',
      replyHi:
        'पहले बताएं, क्या आप अभी सुरक्षित हैं? यदि निकासी आदेश है तो उसका पालन करें, और ऊंचे स्थान पर जाएं। मैं निकटतम आश्रय (1.1 किमी) ढूंढ सकता हूँ।',
      isRedFlag: false,
      actions: [
        { label: 'Haan, shelter dikhao', type: 'action', value: 'show_shelter' },
        { label: 'Medicine request banao', type: 'action', value: 'request_medicine' },
      ],
    };
  }

  // 3. Hospital or Doctor
  if (
    lower.includes('hospital') ||
    lower.includes('doctor') ||
    lower.includes('aspatal') ||
    lower.includes('clinic') ||
    lower.includes('nearest hospital')
  ) {
    return {
      reply:
        'Nearest government hospital: District Government Hospital, 2.4 km, open 24x7. Kya main directions kholun?',
      replyHi:
        'निकटतम सरकारी अस्पताल: जिला सरकारी अस्पताल, 2.4 किमी, 24x7 खुला है। क्या मैं दिशा-निर्देश खोलूँ?',
      isRedFlag: false,
      actions: [
        { label: 'Yes, open directions', type: 'link', value: '/healthcare' },
        { label: 'View bed availability', type: 'action', value: 'view_beds' },
      ],
    };
  }

  // 4. Missing Person / Kumbh Mela
  if (
    lower.includes('missing') ||
    lower.includes('kho gaya') ||
    lower.includes('gum') ||
    lower.includes('lapata') ||
    lower.includes('mela')
  ) {
    return {
      reply:
        'Missing person case register karne ke liye basic details (naam, umra, aakhri sthan) chahiye. Data Help Desk par securely share hoga.',
      replyHi:
        'लापता व्यक्ति का मामला दर्ज करने के लिए बुनियादी विवरण (नाम, उम्र, अंतिम स्थान) चाहिए। डेटा हेल्प डेस्क पर सुरक्षित साझा होगा।',
      isRedFlag: false,
      actions: [
        { label: 'Report missing person', type: 'link', value: '/mela' },
        { label: 'Nearest Mela Help Desk', type: 'action', value: 'show_helpdesk' },
      ],
    };
  }

  // 5. Medicine or Jan Aushadhi
  if (lower.includes('medicine') || lower.includes('dawa') || lower.includes('paracetamol')) {
    return {
      reply:
        'Aap Jan Aushadhi generic medicines check kar sakte hain, jo commercial dawaon se 70-80% sasti hain. Kripya dhyan dein ki prescription dawaon ke liye doctor ka parcha anivarya hai.',
      replyHi:
        'आप जन औषधि जेनेरिक दवाएं देख सकते हैं, जो ब्रांडेड दवाओं से 70-80% सस्ती हैं। ध्यान दें कि पर्चे वाली दवाओं के लिए डॉक्टर का पर्चा अनिवार्य है।',
      isRedFlag: false,
      actions: [
        { label: 'Compare generic prices', type: 'link', value: '/healthcare' },
        { label: 'Nearby Jan Aushadhi store', type: 'action', value: 'show_store' },
      ],
    };
  }

  // Default helpful response
  return {
    reply:
      'Main aapki madad kar sakta hoon: nazdeeki hospital dhoondhne, Jan Aushadhi dawaon ke daam dekhne, flood/disaster shelters check karne, ya emergency report darj karne mein. Aap kya madad chahte hain?',
    replyHi:
      'मैं आपकी मदद कर सकता हूँ: नजदीकी अस्पताल ढूंढने, जन औषधि दवाओं के दाम देखने, बाढ़/आपदा आश्रय चेक करने, या आपातकालीन रिपोर्ट दर्ज करने में। आप क्या सहायता चाहते हैं?',
    isRedFlag: false,
    actions: [
      { label: 'Find hospital', type: 'link', value: '/healthcare' },
      { label: 'Emergency 112', type: 'link', value: '/emergency' },
      { label: 'Flood shelters', type: 'link', value: '/disaster' },
    ],
  };
}
