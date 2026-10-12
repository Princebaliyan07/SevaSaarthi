/*
 * AI Saarthi knowledge base.
 * Ye file AI ka "dimaag" hai. Naya topic add karna ho to INTENTS me ek naya object jodo.
 *
 * Har intent:
 *   keywords : ye words/phrases message me milen to intent chalta hai (lowercase)
 *   reply    : Hinglish jawab
 *   replyHi  : Hindi (Devanagari) jawab
 *   actions  : buttons. type 'link' = site ka page, 'call' = phone call, 'prompt' = chat me ye text bhejo
 *
 * Intents upar se neeche check hote hain. Pehla match jeetta hai.
 *
 * NOTE: Site ke sirf wahi pages likhe hain jo code me dikhe: /healthcare, /disaster, /mela, /emergency.
 * Baaki features (pages, services) neeche TODO jagah par apne hisaab se jodo.
 */

export const RED_FLAG_KEYWORDS = [
  'chest pain',
  'seene mein dard',
  'seene me dard',
  'dil ka daura',
  'heart attack',
  'unconscious',
  'behosh',
  'severe bleeding',
  'khoon beh raha',
  'saas nahi aa rahi',
  'saans nahi aa rahi',
  'saans lene mein takleef',
  'saans lene me takleef',
  'choking',
  'cant breathe',
  "can't breathe",
  'cannot breathe',
  'seizure',
  'daura pad raha',
  'jhatke aa rahe',
  'zeher',
  'poison',
  'overdose',
  'सीने में दर्द',
  'बेहोश',
  'सांस नहीं',
];

export const INTENTS = [
  // ---------- 1. Fever ----------
  {
    id: 'fever',
    keywords: [
      'fever', 'bukhar', 'bukhaar', 'taap', 'temperature', 'tez bukhar',
      'paracetamol', 'crocin', 'dolo', 'बुखार', 'ताप',
    ],
    reply:
      'Bukhar me main dawai prescribe nahi kar sakta, par general jaankari de sakta hoon:\n\n' +
      '• Aaram karein, khoob paani, ORS ya nimbu paani piyein, halke kapde pehnein.\n' +
      '• Bukhar kam karne ke liye aam taur par paracetamol (OTC) use hoti hai. Kitni leni hai ye packet ke label ya pharmacist/doctor se poochkar hi tay karein.\n' +
      '• Dengue ya malaria ka shak ho to aspirin ya ibuprofen jaisi dard-nivarak dawai bina doctor ke na lein. Bachon ko aspirin kabhi na dein.\n\n' +
      'Doctor ko turant dikhayein agar: bukhar 3 din se zyada ho, 103°F (39.4°C) se upar ho, saans me takleef ho, tez sar dard ya gardan akdi ho, daane nikalein, baar-baar ulti ho, behoshi lage, ya mareez bachcha, boodha ya pregnant ho.\n\n' +
      'Main doctor nahi hoon. Kya main nazdeeki hospital ya Jan Aushadhi store dikhaun?',
    replyHi:
      'बुखार में मैं दवा प्रिस्क्राइब नहीं कर सकता, लेकिन सामान्य जानकारी दे सकता हूँ:\n\n' +
      '• आराम करें, खूब पानी, ORS या नींबू पानी पिएं, हल्के कपड़े पहनें।\n' +
      '• बुखार कम करने के लिए आम तौर पर पैरासिटामोल (बिना पर्चे वाली) इस्तेमाल होती है। कितनी लेनी है, यह पैकेट के लेबल या फार्मासिस्ट/डॉक्टर से पूछकर ही तय करें।\n' +
      '• डेंगू या मलेरिया का शक हो तो एस्पिरिन या इबुप्रोफेन जैसी दर्द की दवा बिना डॉक्टर के न लें। बच्चों को एस्पिरिन कभी न दें।\n\n' +
      'डॉक्टर को तुरंत दिखाएं अगर: बुखार 3 दिन से ज़्यादा हो, 103°F (39.4°C) से ऊपर हो, सांस में तकलीफ हो, तेज़ सिरदर्द या गर्दन अकड़ी हो, दाने निकलें, बार-बार उल्टी हो, बेहोशी लगे, या मरीज़ बच्चा, बुज़ुर्ग या गर्भवती हो।\n\n' +
      'मैं डॉक्टर नहीं हूँ। क्या मैं नज़दीकी अस्पताल या जन औषधि स्टोर दिखाऊँ?',
    actions: [
      { label: 'Nearest hospital', type: 'link', value: '/healthcare' },
      { label: 'Jan Aushadhi store', type: 'link', value: '/healthcare' },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- 2. Cold / cough ----------
  {
    id: 'cold_cough',
    keywords: ['cold', 'cough', 'khansi', 'khasi', 'zukam', 'jukam', 'sardi', 'gale mein dard', 'sore throat', 'खांसी', 'जुकाम', 'सर्दी'],
    reply:
      'Sardi-khansi me aam taur par aaram, garam paani, bhaap lena aur gunguna paani ya namak ke gargle se aaram milta hai. Koi bhi dawai lene se pehle pharmacist ya doctor se poochein, main khud dawai nahi bata sakta.\n\n' +
      'Doctor ko dikhayein agar: 7 din se zyada rahe, saans phoolne lage, seene me dard ho, tez bukhar ho, ya khansi me khoon aaye.',
    replyHi:
      'सर्दी-खांसी में आम तौर पर आराम, गरम पानी, भाप लेना और गुनगुने पानी या नमक के गरारे से आराम मिलता है। कोई भी दवा लेने से पहले फार्मासिस्ट या डॉक्टर से पूछें, मैं खुद दवा नहीं बता सकता।\n\n' +
      'डॉक्टर को दिखाएं अगर: 7 दिन से ज़्यादा रहे, सांस फूलने लगे, सीने में दर्द हो, तेज़ बुखार हो, या खांसी में खून आए।',
    actions: [
      { label: 'Nearest hospital', type: 'link', value: '/healthcare' },
      { label: 'Book doctor appointment', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 3. Loose motion / dehydration ----------
  {
    id: 'loose_motion',
    keywords: ['loose motion', 'dast', 'diarrhea', 'diarrhoea', 'ulti', 'vomiting', 'dehydration', 'दस्त', 'उल्टी'],
    reply:
      'Dast ya ulti me sabse zaroori hai paani ki kami na hone dena. Thoda-thoda ORS, saaf paani aur nariyal paani lete rahein.\n\n' +
      'Turant doctor ke paas jayein agar: potty me khoon ho, 2 din se zyada chale, bahut kamzori ya chakkar ho, peshab kam aaye, ya mareez chhota bachcha ya boodha ho.',
    replyHi:
      'दस्त या उल्टी में सबसे ज़रूरी है पानी की कमी न होने देना। थोड़ा-थोड़ा ORS, साफ पानी और नारियल पानी लेते रहें।\n\n' +
      'तुरंत डॉक्टर के पास जाएं अगर: पॉटी में खून हो, 2 दिन से ज़्यादा चले, बहुत कमज़ोरी या चक्कर हो, पेशाब कम आए, या मरीज़ छोटा बच्चा या बुज़ुर्ग हो।',
    actions: [
      { label: 'Find ORS / medicine store', type: 'link', value: '/healthcare' },
      { label: 'Nearest hospital', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 4. Ambulance ----------
  {
    id: 'ambulance',
    keywords: ['ambulance', '108', 'emergency', 'आपातकाल', 'एम्बुलेंस'],
    reply:
      'Emergency me turant 112 (national emergency) ya 108 (ambulance) par call karein. Agar aap safe hain to apni location bata dein, main madad ke raste dikhaunga.',
    replyHi:
      'आपातकाल में तुरंत 112 (राष्ट्रीय आपातकालीन) या 108 (एम्बुलेंस) पर कॉल करें। अगर आप सुरक्षित हैं तो अपनी लोकेशन बताएं, मैं मदद के रास्ते दिखाऊंगा।',
    actions: [
      { label: 'Call 112', type: 'call', value: '112', danger: true },
      { label: 'Call 108 (Ambulance)', type: 'call', value: '108', danger: true },
      { label: 'Emergency page', type: 'link', value: '/emergency' },
    ],
  },

  // ---------- 5. Flood / disaster ----------
  {
    id: 'disaster',
    keywords: [
      'flood', 'baadh', 'badh aayi', 'doob', 'sailab', 'cyclone', 'disaster', 'aapda', 'आपदा',
      'shelter', 'relief camp', 'aashray', 'pani bhar', 'paani bhar', 'pani aa gaya', 'paani aa gaya',
      'ghar mein pani', 'ghar me pani', 'बाढ़', 'आश्रय',
    ],
    reply:
      'Pehle batayein, kya aap abhi safe hain? Agar evacuation order hai to use follow karein, aur unchi jagah par jaiye. Main nearest shelter dhoondh sakta hoon.',
    replyHi:
      'पहले बताएं, क्या आप अभी सुरक्षित हैं? यदि निकासी आदेश है तो उसका पालन करें, और ऊंचे स्थान पर जाएं। मैं निकटतम आश्रय ढूंढ सकता हूँ।',
    actions: [
      { label: 'Find shelter', type: 'link', value: '/disaster' },
      { label: 'Medicine request banao', type: 'link', value: '/healthcare' },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- 6. Missing person / Mela ----------
  {
    id: 'missing',
    keywords: ['missing', 'kho gaya', 'kho gayi', 'gum ho', 'gumshuda', 'lapata', 'bichhad', 'mela', 'kumbh', 'लापता', 'खो गया', 'मेला'],
    reply:
      'Missing person case register karne ke liye basic details (naam, umra, aakhri sthan) chahiye. Ye jaankari Help Desk ke saath surakshit tareeke se share hogi.',
    replyHi:
      'लापता व्यक्ति का मामला दर्ज करने के लिए बुनियादी विवरण (नाम, उम्र, अंतिम स्थान) चाहिए। यह जानकारी हेल्प डेस्क के साथ सुरक्षित तरीके से साझा होगी।',
    actions: [
      { label: 'Report missing person', type: 'link', value: '/mela' },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- 7. Appointment ----------
  {
    id: 'appointment',
    keywords: ['appointment', 'book doctor', 'doctor se milna', 'अपॉइंटमेंट'],
    reply:
      'Doctor appointment book karne ke liye Healthcare page par jayein. Booking se pehle main aapse confirm karunga.',
    replyHi:
      'डॉक्टर अपॉइंटमेंट बुक करने के लिए हेल्थकेयर पेज पर जाएं। बुकिंग से पहले मैं आपसे पुष्टि करूँगा।',
    actions: [{ label: 'Open Healthcare', type: 'link', value: '/healthcare' }],
  },

  // ---------- 8. Hospital / doctor ----------
  {
    id: 'hospital',
    keywords: ['hospital', 'aspatal', 'doctor', 'clinic', 'nearest hospital', 'अस्पताल', 'डॉक्टर'],
    reply:
      'Nazdeeki hospital aur doctor ki list Healthcare page par hai. Kya main wahan khol dun?',
    replyHi:
      'नज़दीकी अस्पताल और डॉक्टर की सूची हेल्थकेयर पेज पर है। क्या मैं वहां खोल दूँ?',
    actions: [
      { label: 'Yes, open Healthcare', type: 'link', value: '/healthcare' },
      { label: 'Call 108 (Ambulance)', type: 'call', value: '108', danger: true },
    ],
  },

  // ---------- 9. Medicine / Jan Aushadhi ----------
  {
    id: 'medicine',
    keywords: ['medicine', 'medicines', 'dawa', 'dawai', 'davai', 'jan aushadhi', 'generic', 'tablet', 'दवा', 'दवाई', 'जन औषधि'],
    reply:
      'Aap Jan Aushadhi generic medicines check kar sakte hain, jo branded dawaon se 50-90% tak sasti ho sakti hain. Main dawai prescribe nahi karta. Prescription wali dawaon ke liye doctor ka parcha zaroori hai.',
    replyHi:
      'आप जन औषधि जेनेरिक दवाएं देख सकते हैं, जो ब्रांडेड दवाओं से 50-90% तक सस्ती हो सकती हैं। मैं दवा प्रिस्क्राइब नहीं करता। पर्चे वाली दवाओं के लिए डॉक्टर का पर्चा ज़रूरी है।',
    actions: [
      { label: 'Compare generic prices', type: 'link', value: '/healthcare' },
      { label: 'Nearby Jan Aushadhi store', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 10. What can you do / about site ----------
  {
    id: 'about',
    keywords: ['kya kar sakte', 'what can you do', 'help', 'madad', 'sevasaarthi', 'seva saarthi', 'about', 'features', 'मदद'],
    reply:
      'SevaSaarthi me main in cheezon me madad kar sakta hoon:\n' +
      '• Healthcare: nazdeeki hospital, Jan Aushadhi dawa store, doctor appointment\n' +
      '• Disaster: flood/bhukamp/mausam alerts, shelter aur madad request\n' +
      '• Mela: missing person report\n' +
      '• Emergency: 112, 108, police aur fire par seedha call, incident report\n' +
      '• Volunteers aur Resources: madad karna ya safety guides dekhna\n' +
      '• Aam bimaariyon (bukhar, sardi-khansi, dast) ki basic jaankari. Main doctor nahi hoon aur dawai prescribe nahi karta.',
    replyHi:
      'सेवासारथी में मैं इन चीज़ों में मदद कर सकता हूँ:\n' +
      '• हेल्थकेयर: नज़दीकी अस्पताल, जन औषधि दवा स्टोर, डॉक्टर अपॉइंटमेंट\n' +
      '• आपदा: बाढ़/भूकंप/मौसम अलर्ट, आश्रय और मदद अनुरोध\n' +
      '• मेला: लापता व्यक्ति की रिपोर्ट\n' +
      '• आपातकाल: 112, 108, पुलिस और फायर पर सीधा कॉल, घटना रिपोर्ट\n' +
      '• वॉलंटियर्स और रिसोर्सेज़: मदद करना या सेफ्टी गाइड देखना\n' +
      '• आम बीमारियों (बुखार, सर्दी-खांसी, दस्त) की बुनियादी जानकारी। मैं डॉक्टर नहीं हूँ और दवा प्रिस्क्राइब नहीं करता।',
    actions: [
      { label: 'Find hospital', type: 'link', value: '/healthcare' },
      { label: 'Flood shelters', type: 'link', value: '/disaster' },
      { label: 'Emergency 112', type: 'link', value: '/emergency' },
    ],
  },

  // =====================================================================
  // Neeche ke intents aapke project ki files (pages/ aur services/) ke naam dekhkar banaye gaye hain.
  // Routes ('/volunteers', '/resources', '/profile', '/') aapke App.jsx ke routes se match karwa lena.
  // =====================================================================

  // ---------- Earthquake (earthquakeService) ----------
  {
    id: 'earthquake',
    keywords: ['earthquake', 'bhukamp', 'bhookamp', 'quake', 'tremor', 'भूकंप'],
    reply:
      'Bhukamp aaye to: khuli jagah par jayein. Andar hain to table ya mazboot furniture ke neeche "Drop, Cover, Hold" karein, khidki aur sheeshe se door rahein, lift ka use na karein. Jhatke ruk jayein to saavdhani se bahar niklein.\n\n' +
      'Latest earthquake alerts aur nazdeeki madad Disaster page par dekh sakte hain.',
    replyHi:
      'भूकंप आए तो: खुली जगह पर जाएं। अंदर हैं तो टेबल या मज़बूत फर्नीचर के नीचे "झुको, ढको, पकड़ो" करें, खिड़की और शीशे से दूर रहें, लिफ्ट का इस्तेमाल न करें। झटके रुक जाएं तो सावधानी से बाहर निकलें।\n\n' +
      'ताज़ा भूकंप अलर्ट और नज़दीकी मदद आपदा पेज पर देख सकते हैं।',
    actions: [
      { label: 'Disaster alerts', type: 'link', value: '/disaster' },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- Weather (weatherService) ----------
  {
    id: 'weather',
    keywords: ['weather', 'mausam', 'barish', 'baarish', 'rain', 'heatwave', 'heat wave', 'garmi', 'thand', 'मौसम', 'बारिश'],
    reply:
      'Mausam aur disaster se judi taaza jaankari Disaster page par milti hai. Tez barish ya baadh ka khatra ho to nichli jagah se door rahein aur zaroori saman ek bag me taiyar rakhein.',
    replyHi:
      'मौसम और आपदा से जुड़ी ताज़ा जानकारी आपदा पेज पर मिलती है। तेज़ बारिश या बाढ़ का खतरा हो तो निचली जगह से दूर रहें और ज़रूरी सामान एक बैग में तैयार रखें।',
    actions: [
      { label: 'Open Disaster page', type: 'link', value: '/disaster' },
      { label: 'Find shelter', type: 'link', value: '/disaster' },
    ],
  },

  // ---------- First responders: police / fire / rescue (firstResponderService) ----------
  {
    id: 'first_responder',
    keywords: [
      'first responder', 'police', 'fire brigade', 'aag lag', 'aag lagi', 'fire', 'ndrf', 'sdrf',
      'rescue', 'bachao', 'पुलिस', 'आग', 'बचाव',
    ],
    reply:
      'Turant madad ke liye: Police 100, Fire 101, Ambulance 108, ya sab ke liye 112 par call karein. Aag lage to pehle bahar niklein, phir call karein. Pehle khud surakshit hona zaroori hai.',
    replyHi:
      'तुरंत मदद के लिए: पुलिस 100, फायर 101, एम्बुलेंस 108, या सबके लिए 112 पर कॉल करें। आग लगे तो पहले बाहर निकलें, फिर कॉल करें। पहले खुद सुरक्षित होना ज़रूरी है।',
    actions: [
      { label: 'Call 112', type: 'call', value: '112', danger: true },
      { label: 'Call Police 100', type: 'call', value: '100', danger: true },
      { label: 'Call Fire 101', type: 'call', value: '101', danger: true },
    ],
  },

  // ---------- Report incident / alerts (incidentService, alertService) ----------
  {
    id: 'incident',
    keywords: ['incident', 'report incident', 'alert', 'alerts', 'complaint', 'accident', 'durghatna', 'दुर्घटना', 'अलर्ट'],
    reply:
      'Kisi ghatna ya durghatna ki report karne ke liye Emergency page par jayein. Agar kisi ki jaan khatre me hai to pehle 112 ya 108 par call karein.',
    replyHi:
      'किसी घटना या दुर्घटना की रिपोर्ट करने के लिए आपातकाल पेज पर जाएं। अगर किसी की जान खतरे में है तो पहले 112 या 108 पर कॉल करें।',
    actions: [
      { label: 'Open Emergency page', type: 'link', value: '/emergency' },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- Volunteers (VolunteersPage, volunteerService) ----------
  {
    id: 'volunteer',
    keywords: ['volunteer', 'volunteers', 'volunteering', 'swayamsevak', 'sevak', 'seva karna', 'स्वयंसेवक', 'वालंटियर'],
    reply:
      'Madad karna chahte hain? Volunteers page par aap volunteer ban sakte hain ya zaroorat par volunteers se madad le sakte hain.',
    replyHi:
      'मदद करना चाहते हैं? वॉलंटियर्स पेज पर आप वॉलंटियर बन सकते हैं या ज़रूरत पर वॉलंटियर्स से मदद ले सकते हैं।',
    actions: [{ label: 'Open Volunteers', type: 'link', value: '/volunteers' }],
  },

  // ---------- Resources / guides (ResourcesPage) ----------
  {
    id: 'resources',
    keywords: ['resources', 'resource', 'guide', 'guides', 'safety tips', 'tips', 'checklist', 'sansadhan', 'गाइड', 'संसाधन'],
    reply:
      'Safety guides, checklists aur zaroori resources Resources page par hain.',
    replyHi:
      'सेफ्टी गाइड, चेकलिस्ट और ज़रूरी संसाधन रिसोर्सेज़ पेज पर हैं।',
    actions: [{ label: 'Open Resources', type: 'link', value: '/resources' }],
  },

  // ---------- Profile (ProfilePage) ----------
  {
    id: 'profile',
    keywords: ['profile', 'my account', 'account', 'login', 'sign in', 'signup', 'sign up', 'प्रोफाइल'],
    reply:
      'Apna profile dekhne ya badalne ke liye Profile page par jayein.',
    replyHi:
      'अपनी प्रोफाइल देखने या बदलने के लिए प्रोफाइल पेज पर जाएं।',
    actions: [{ label: 'Open Profile', type: 'link', value: '/profile' }],
  },

  // TODO: aur features jodne ke liye yahan naya object likho:
  // { id: 'xyz', keywords: [...], reply: '...', replyHi: '...', actions: [...] }
];

export const RED_FLAG_RESPONSE = {
  reply:
    '⚠️ EMERGENCY ALERT: Ye symptom jaanleva emergency ho sakta hai. Intezaar na karein. Turant 112 ya 108 par call karein aur kisi ko apne paas bula lein.',
  replyHi:
    '⚠️ आपातकालीन चेतावनी: यह लक्षण जानलेवा आपात स्थिति हो सकता है। इंतज़ार न करें। तुरंत 112 या 108 पर कॉल करें और किसी को अपने पास बुला लें।',
  isRedFlag: true,
  actions: [
    { label: 'Call 112 Now', type: 'call', value: '112', danger: true },
    { label: 'Call 108 (Ambulance)', type: 'call', value: '108', danger: true },
    { label: 'Nearest hospital', type: 'link', value: '/healthcare' },
  ],
};

export const DEFAULT_RESPONSE = {
  reply:
    'Main madad kar sakta hoon: nazdeeki hospital, Jan Aushadhi dawa store, flood/aapda shelter, missing person report, aur bukhar-sardi jaisi aam bimaariyon ki basic jaankari. Aap kya chahte hain?',
  replyHi:
    'मैं मदद कर सकता हूँ: नज़दीकी अस्पताल, जन औषधि दवा स्टोर, बाढ़/आपदा आश्रय, लापता व्यक्ति रिपोर्ट, और बुखार-सर्दी जैसी आम बीमारियों की बुनियादी जानकारी। आप क्या चाहते हैं?',
  isRedFlag: false,
  actions: [
    { label: 'Find hospital', type: 'link', value: '/healthcare' },
    { label: 'Flood shelters', type: 'link', value: '/disaster' },
    { label: 'Emergency 112', type: 'link', value: '/emergency' },
  ],
};