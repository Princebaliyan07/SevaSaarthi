/*
 * AI Saarthi knowledge base.
 * Comprehensive symptom-based disease detection, OTC medication guidance, and civic emergency routing.
 */

export const RED_FLAG_KEYWORDS = [
  'chest pain',
  'seene mein dard',
  'seene me dard',
  'seena dard',
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
  'snake bite',
  'saap',
  'सीने में दर्द',
  'बेहोश',
  'सांस नहीं',
];

export const RED_FLAG_RESPONSE = {
  reply:
    '⚠️ CRITICAL EMERGENCY ALERT: These symptoms (severe chest pain, unconsciousness, severe breathing distress) indicate a life-threatening medical emergency. Do NOT wait for medicines.\n\n' +
    '• Immediately call 112 or 108 for an emergency ambulance.\n' +
    '• Rush to the nearest hospital trauma / cardiac center.\n' +
    '• Keep the patient sitting upright in an airy place and loosen tight clothing.',
  replyHi:
    '⚠️ गंभीर आपातकालीन चेतावनी: यह लक्षण (सीने में दर्द, सांस लेने में अत्यधिक तकलीफ, बेहोशी) जीवन के लिए घातक आपात स्थिति का संकेत हैं। दवाइयों का इंतजार न करें।\n\n' +
    '• तुरंत 112 या 108 डायल करके एम्बुलेंस बुलाएं।\n' +
    '• निकटतम अस्पताल के इमरजेंसी / ट्रॉमा सेंटर पहुंचें।\n' +
    '• मरीज को शांत रखें और खुली हवा में बैठाएं।',
  isRedFlag: true,
  actions: [
    { label: 'Call 112', type: 'call', value: '112', danger: true },
    { label: 'Call 108 (Ambulance)', type: 'call', value: '108', danger: true },
    { label: 'Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
  ],
};

export const DEFAULT_RESPONSE = {
  reply:
    'Hello! I am AI Saarthi, your 24/7 civic emergency and symptom detection assistant.\n\n' +
    'Tell me your symptoms (e.g. "I had fever", "cough and cold", "stomach pain", "loose motion") and I will detect potential conditions, recommend safe OTC medicines with Jan Aushadhi generic options, and guide you to nearby healthcare.',
  replyHi:
    'नमस्ते! मैं AI सारथी हूँ, आपका 24/7 आपातकालीन एवं लक्षण जांच सहायक।\n\n' +
    'मुझे अपने लक्षण बताएं (जैसे "बुखार है", "खांसी और जुकाम", "पेट दर्द", "दस्त और उल्टी") और मैं संभावित बीमारी की पहचान कर उचित दवाइयाँ व नजदीकी अस्पताल की जानकारी दूंगा।',
  isRedFlag: false,
  actions: [
    { label: '🏥 Find 24x7 Hospitals', type: 'link', value: '/healthcare' },
    { label: '💊 Jan Aushadhi Generic Medicines', type: 'link', value: '/healthcare' },
    { label: '🗺️ Live Disaster & Situation Map', type: 'link', value: '/live-board' },
    { label: '🚨 Report SOS Emergency', type: 'link', value: '/emergency' },
  ],
};

export const INTENTS = [
  // ---------- 1. Fever & Temperature (Disease Detection + Medicine Guidance) ----------
  {
    id: 'fever',
    keywords: [
      'fever', 'bukhar', 'bukhaar', 'taap', 'temperature', 'tez bukhar',
      'i had fever', 'i have fever', 'fever medicine', 'fever dawai',
      'paracetamol', 'crocin', 'dolo', 'calpol', 'बुखार', 'ताप',
    ],
    reply:
      '🩺 Symptom & Disease Analysis: Likely Viral Fever, Seasonal Flu, or early infection.\n' +
      '(If accompanied by shivering/chills, consider Malaria or Dengue. Monitor platelets if fever persists).\n\n' +
      '💊 Recommended Medicines You Can Take:\n' +
      '• First-Line Antipyretic: Paracetamol 650mg (Dolo 650 / Calpol 650 / Crocin) or Jan Aushadhi Generic Paracetamol (₹8–₹14 / 10 tablets).\n' +
      '• Dosage: 1 tablet after meals every 6–8 hours as needed (do NOT exceed 3 tablets in 24 hours).\n' +
      '• Hydration Support: Drink ORS (Electral), coconut water, or fresh lime water regularly.\n' +
      '• Physical Care: Place damp cold cloth strips on forehead if body temperature crosses 101°F.\n\n' +
      '⚠️ Caution: Avoid Aspirin or Ibuprofen if Dengue is suspected (risk of internal bleeding).\n' +
      '🚨 Hospital Alert: Rush to hospital if fever exceeds 103°F, lasts over 3 days, or is accompanied by breathlessness or extreme dizziness.',
    replyHi:
      '🩺 लक्षण एवं संभावित बीमारी: वायरल बुखार (Viral Fever) या मौसमी फ्लू (Seasonal Flu)।\n' +
      '(यदि कंपकंपी व ठंड लगे तो मलेरिया या डेंगू की भी जांच आवश्यक हो सकती है)।\n\n' +
      '💊 आप कौन सी दवा ले सकते हैं:\n' +
      '• बुखार कम करने हेतु: पैरासिटामोल 650mg (Dolo 650 / Calpol / Crocin) या जन औषधि केंद्र से जेनेरिक पैरासिटामोल (₹8–₹14 में 10 गोलियां)।\n' +
      '• खुराक: खाना खाने के बाद 1 गोली (6–8 घंटे के अंतराल पर, 24 घंटे में अधिकतम 3 गोलियां)।\n' +
      '• घरेलू देखभाल: खूब पानी, ORS घोल और नारियल पानी पिएं। बुखार 101°F से ऊपर हो तो माथे पर ठंडे पानी की पट्टी रखें।\n\n' +
      '⚠️ चेतावनी: डेंगू की आशंका में एस्पिरिन (Aspirin) या ब्रूफेन न लें।\n' +
      '🚨 अस्पताल कब जाएं: यदि बुखार 3 दिन से अधिक रहे, 103°F से अधिक हो या सांस लेने में परेशानी हो तो तुरंत डॉक्टर को दिखाएं।',
    actions: [
      { label: '💊 Jan Aushadhi Paracetamol Prices', type: 'link', value: '/healthcare' },
      { label: '🏥 Nearest 24/7 Hospital', type: 'link', value: '/healthcare' },
      { label: '👨‍⚕️ Book Doctor Consultation', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 2. Cold, Cough, Sore Throat, Sneezing ----------
  {
    id: 'cold_cough',
    keywords: [
      'cold', 'cough', 'khansi', 'khasi', 'zukam', 'jukam', 'sardi', 'gale mein dard',
      'sore throat', 'sneezing', 'chheenk', 'chheenkain', 'खांसी', 'जुकाम', 'सर्दी', 'गले में दर्द',
    ],
    reply:
      '🩺 Symptom & Disease Analysis: Upper Respiratory Tract Infection (URTI), Common Cold, or Pharyngitis.\n\n' +
      '💊 Recommended Medicines You Can Take:\n' +
      '• Running Nose & Sneezing: Cetirizine 10mg (Cetzine / Okacet) or Levocetirizine 5mg (1 tablet at bedtime).\n' +
      '• Dry Cough: Dextromethorphan syrup (Ascoril D / Benadryl DR) - 10ml thrice daily.\n' +
      '• Wet / Productive Cough with Phlegm: Ambroxol + Guaifenesin syrup (Ascoril / Grilinctus-BM) - 10ml thrice daily.\n' +
      '• Sore Throat: Warm salt water gargles 3 times a day or Betadine 2% gargle + Strepsils lozenges.\n' +
      '• Steam Inhalation: 2 times daily for chest and nasal clearance.\n\n' +
      '🚨 Consult Doctor if: Cough lasts over 1 week, produces blood, or causes wheezing / chest tightness.',
    replyHi:
      '🩺 लक्षण एवं संभावित बीमारी: सामान्य सर्दी-जुकाम (Common Cold) या ऊपरी श्वसन नली का संक्रमण (URTI)।\n\n' +
      '💊 आप कौन सी दवा ले सकते हैं:\n' +
      '• बहती नाक व छींकों के लिए: सेटिरिज़िन 10mg (Cetirizine / Okacet) - रात को 1 गोली।\n' +
      '• सूखी खांसी के लिए: डेक्सट्रोमेथॉर्फ़न सिरप (Ascoril D / Benadryl DR) - 10ml दिन में 3 बार।\n' +
      '• बलगम वाली खांसी के लिए: एम्ब्रॉक्सोल + गुआइफेनेसिन सिरप (Ascoril / Grilinctus) - 10ml दिन में 3 बार।\n' +
      '• गले में खराश/दर्द: गुनगुने नमक पानी के गरारे या बीटाडीन गार्गल और स्ट्रेप्सिल्स (Strepsils)।\n\n' +
      '🚨 डॉक्टर को दिखाएं यदि: खांसी में खून आए, सांस फूलने लगे या 7 दिन से ज़्यादा रहे।',
    actions: [
      { label: '💊 Cough & Cold Generic Meds', type: 'link', value: '/healthcare' },
      { label: '🏥 Nearest Hospital', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 3. Stomach Pain, Acidity, Gas, Indigestion ----------
  {
    id: 'stomach_pain',
    keywords: [
      'stomach', 'pet dard', 'pet mein dard', 'pet me dard', 'acidity', 'gas',
      'jalan', 'heartburn', 'cramp', 'indigestion', 'पेट दर्द', 'गैस', 'एसिडिटी',
    ],
    reply:
      '🩺 Symptom & Disease Analysis: Acute Gastritis, Acid Reflux (GERD), or Abdominal Muscle Spasm.\n\n' +
      '💊 Recommended Medicines You Can Take:\n' +
      '• For Acidity & Heartburn: Pantoprazole 40mg (Pan-40) or Omeprazole 20mg - Take 1 tablet empty stomach in the morning.\n' +
      '• Instant Acid Relief: Antacid Gel (Digene / Gelusil suspension) - 2 tablespoons 15 mins after meals.\n' +
      '• For Stomach Cramps & Spasms: Dicyclomine + Paracetamol (Meftal-Spas) or Drotaverine 40mg (Drotin).\n' +
      '• Dietary Advice: Avoid oily, spicy food and tea/coffee. Drink warm water and buttermilk.\n\n' +
      '🚨 Warning: Seek emergency care if stomach pain is sudden and severe (lower right abdomen could indicate Appendicitis).',
    replyHi:
      '🩺 लक्षण एवं संभावित बीमारी: गैस्ट्राइटिस (Gastritis), एसिडिटी (Acid Reflux) या पेट की ऐंठन।\n\n' +
      '💊 आप कौन सी दवा ले सकते हैं:\n' +
      '• एसिडिटी व जलन के लिए: पैंटोप्राजोल 40mg (Pan-40) - सुबह खाली पेट 1 गोली।\n' +
      '• तुरंत राहत के लिए सिरप: डाइजीन (Digene) या जेलुसिल (Gelusil) सिरप - 2 चम्मच खाने के बाद।\n' +
      '• पेट दर्द व ऐंठन के लिए: मेफ्टाल-स्पास (Meftal-Spas) या ड्रोटिन 40mg (Drotin)।\n' +
      '• खान-पान: तीखा, तला-भुना और चाय-कॉफी बंद रखें। छाछ और हल्का सुपाच्य भोजन लें।\n\n' +
      '🚨 चेतावनी: यदि पेट में अचानक बहुत तेज़ असहनीय दर्द हो तो तुरंत अस्पताल जाएं (अपेंडिक्स का खतरा हो सकता है)।',
    actions: [
      { label: '💊 Check Antacid & Spas Meds', type: 'link', value: '/healthcare' },
      { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 4. Loose Motion, Diarrhea, Vomiting ----------
  {
    id: 'loose_motion',
    keywords: [
      'loose motion', 'dast', 'diarrhea', 'diarrhoea', 'ulti', 'vomiting', 'vomit',
      'dehydration', 'food poisoning', 'दस्त', 'उल्टी', 'फूड पॉइजनिंग',
    ],
    reply:
      '🩺 Symptom & Disease Analysis: Acute Gastroenteritis, Food Poisoning, or Stomach Infection.\n\n' +
      '💊 Recommended Medicines You Can Take:\n' +
      '• Mandatory Rehydration: ORS (Oral Rehydration Salts - Electral) - Mix 1 packet in 1 liter clean water; sip constantly to prevent dehydration.\n' +
      '• For Vomiting / Nausea: Ondansetron 4mg (Emeset 4 / Ondem 4) - 1 tablet 20 mins before food.\n' +
      '• Gut Recovery: Probiotic capsules (Sporlac / Darolac) + Zinc 20mg tablet daily.\n' +
      '• Loose Motion Control: Loperamide 2mg (only for adults with non-bloody watery stools).\n\n' +
      '🚨 Hospital Alert: Immediately see a doctor if there is blood in stool, severe dry mouth, absence of urination for 8 hours, or continuous vomiting.',
    replyHi:
      '🩺 लक्षण एवं संभावित बीमारी: गैस्ट्रोएंटेराइटिस (Gastroenteritis), फ़ूड पॉइज़निंग (Food Poisoning) या पेट का संक्रमण।\n\n' +
      '💊 आप कौन सी दवा ले सकते हैं:\n' +
      '• सबसे ज़रूरी (ORS घोल): इलेक्ट्रल (ORS) का 1 पैकेट 1 लीटर पानी में घोलें और थोड़ा-थोड़ा लगातार पीते रहें।\n' +
      '• उल्टी व जी मिचलाने पर: ओन्डेनसेट्रॉन 4mg (Emeset 4 / Ondem) - खाने से 20 मिनट पहले 1 गोली।\n' +
      '• आंतों के सुधार के लिए: प्रोबायोटिक (Sporlac / Darolac) और जिंक की गोली।\n' +
      '• दस्त रोकने के लिए: लोपेरामाइड 2mg (Loperamide - केवल बड़ों के लिए)।\n\n' +
      '🚨 तुरंत अस्पताल जाएं: यदि शौच में खून आए, पेशाब बंद हो जाए या लगातार अत्यधिक कमजोरी महसूस हो।',
    actions: [
      { label: '💊 Jan Aushadhi ORS & Meds', type: 'link', value: '/healthcare' },
      { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
      { label: '🚨 Call 108 Ambulance', type: 'call', value: '108', danger: true },
    ],
  },

  // ---------- 5. Headache, Migraine, Body & Joint Pain ----------
  {
    id: 'headache_pain',
    keywords: [
      'headache', 'sar dard', 'sir dard', 'migraine', 'body pain', 'badan dard',
      'joint pain', 'jod dard', 'kamar dard', 'back pain', 'सर दर्द', 'बदन दर्द',
    ],
    reply:
      '🩺 Symptom & Disease Analysis: Tension Headache, Eye Strain, Dehydration, or Myalgia (Muscle Fatigue).\n\n' +
      '💊 Recommended Medicines You Can Take:\n' +
      '• For Headache & Body Ache: Paracetamol 650mg (Dolo 650) or Naproxen 250mg with plenty of water.\n' +
      '• For Joint & Muscle Pain: Aceclofenac + Paracetamol (Zerodol-P) after food.\n' +
      '• Topical Pain Relief: Diclofenac Gel (Volini / Moov) applied gently on affected area.\n' +
      '• Non-Medical Relief: Rest in a dark, quiet room, stay hydrated, and massage temples gently.\n\n' +
      '🚨 Red Flag: Sudden thunderclap headache, stiff neck with fever, or visual disturbances requires immediate medical triage.',
    replyHi:
      '🩺 लक्षण एवं संभावित बीमारी: तनाव सिरदर्द (Tension Headache), माइग्रेन, मांसपेशियों में खिंचाव या बदन दर्द।\n\n' +
      '💊 आप कौन सी दवा ले सकते हैं:\n' +
      '• सिरदर्द व बदन दर्द: पैरासिटामोल 650mg (Dolo 650) पानी के साथ लें।\n' +
      '• जोड़ों व मांसपेशियों में दर्द: एसेक्लोफेनाक + पैरासिटामोल (Zerodol-P) खाने के बाद लें।\n' +
      '• दर्द निवारक जेल: डाइक्लोफेनाक जेल (Volini / Moov) दर्द वाली जगह पर लगाएं।\n' +
      '• आराम: शांत, अंधेरे कमरे में आराम करें और भरपूर पानी पिएं।',
    actions: [
      { label: '💊 Generic Pain Relief Meds', type: 'link', value: '/healthcare' },
      { label: '👨‍⚕️ Consult Doctor Online', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 6. Flood & Disaster (Links to Live Disaster Situation Map) ----------
  {
    id: 'disaster',
    keywords: [
      'flood', 'baadh', 'badh aayi', 'doob', 'sailab', 'cyclone', 'disaster', 'aapda',
      'shelter', 'relief camp', 'aashray', 'pani bhar', 'paani bhar', 'बाढ़', 'आश्रय',
      'live situation map', 'situation map', 'disaster map', 'नक्शा', 'आपदा',
    ],
    reply:
      '🗺️ Live Disaster & Situation Radar Alert:\n\n' +
      'Please verify your immediate safety. If an evacuation alert is active in your district:\n' +
      '• Move to designated high-ground shelters or official relief camps.\n' +
      '• Do not walk or drive through submerged flood roads or bridges.\n' +
      '• You can view real-time IMD rain, satellite flood telemetry, and safe shelter locations on our Live Situation Map.',
    replyHi:
      '🗺️ लाइव आपदा एवं स्थिति रडार अलर्ट:\n\n' +
      'कृपया तुरंत अपनी सुरक्षा सुनिश्चित करें। यदि आपके क्षेत्र में बाढ़ या आपदा निकासी का आदेश है:\n' +
      '• ऊंचे स्थान पर बने राहत शिविरों (Relief Shelters) की ओर जाएं।\n' +
      '• जलभराव वाले रास्तों, पुलों और बिजली के खंभों से दूर रहें।\n' +
      '• हमारे लाइव सिचुएशन मैप पर आप वास्तविक समय का उपग्रह डेटा, मौसम चेतावनी और सुरक्षित शिविर देख सकते हैं।',
    actions: [
      { label: '🗺️ Live Disaster & Situation Map', type: 'link', value: '/live-board' },
      { label: '⛺ View Safe Relief Shelters', type: 'link', value: '/disaster' },
      { label: '🚨 Call 112 (National Disaster Line)', type: 'call', value: '112', danger: true },
    ],
  },

  // ---------- 7. General Medicine & Jan Aushadhi ----------
  {
    id: 'medicine',
    keywords: [
      'medicine', 'medicines', 'dawa', 'dawai', 'davai', 'jan aushadhi', 'generic',
      'tablet', 'pharmacy', 'chemist', 'दवा', 'दवाई', 'जन औषधि',
    ],
    reply:
      'Pradhan Mantri Jan Aushadhi generic medicines provide the exact same chemical formulation and therapeutic efficacy as branded medicines at 50% to 90% lower cost.\n\n' +
      'Common OTC Jan Aushadhi equivalents:\n' +
      '• Paracetamol 650mg: ₹12 (vs ₹35 branded Dolo)\n' +
      '• Cetirizine 10mg: ₹9 (vs ₹38 branded Cetzine)\n' +
      '• Pantoprazole 40mg: ₹22 (vs ₹110 branded Pan-40)\n' +
      '• ORS Electral sachet: ₹9 (vs ₹24 branded)\n\n' +
      'Search our Jan Aushadhi generic directory on the Healthcare page.',
    replyHi:
      'प्रधानमंत्री जन औषधि जेनेरिक दवाएं ब्रांडेड दवाओं के समान गुणवत्ता वाली होती हैं, लेकिन 50% से 90% तक सस्ती मिलती हैं।\n\n' +
      'प्रमुख जेनेरिक दवाएं:\n' +
      '• पैरासिटामोल 650mg: ₹12 (ब्रांडेड ₹35)\n' +
      '• सेटिरिज़िन 10mg: ₹9 (ब्रांडेड ₹38)\n' +
      '• पैंटोप्राजोल 40mg: ₹22 (ब्रांडेड ₹110)\n' +
      '• ओआरएस (ORS): ₹9 (ब्रांडेड ₹24)\n\n' +
      'आप हेल्थकेयर पेज पर नजदीकी जन औषधि केंद्र और दवाओं की कीमतें देख सकते हैं।',
    actions: [
      { label: '💊 Check Jan Aushadhi Generic Prices', type: 'link', value: '/healthcare' },
      { label: '🏥 Find Nearest Hospital', type: 'link', value: '/healthcare' },
    ],
  },

  // ---------- 8. Missing person / Kumbh Mela ----------
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

  // ---------- 9. Hospital / Ambulance ----------
  {
    id: 'hospital',
    keywords: ['hospital', 'aspatal', 'doctor', 'clinic', 'nearest hospital', 'ambulance', '108', 'अस्पताल', 'डॉक्टर', 'एम्बुलेंस'],
    reply:
      'Nazdeeki 24/7 hospitals aur emergency trauma center ki list Healthcare page par uplabdh hai. Emergency ambulance ke liye turant 108 par call karein.',
    replyHi:
      'नज़दीकी 24/7 अस्पताल और इमरजेंसी ट्रॉमा सेंटर की सूची हेल्थकेयर पेज पर उपलब्ध है। इमरजेंसी एम्बुलेंस के लिए तुरंत 108 पर कॉल करें।',
    actions: [
      { label: '🏥 Find Hospitals', type: 'link', value: '/healthcare' },
      { label: 'Call 108 (Ambulance)', type: 'call', value: '108', danger: true },
      { label: 'Call 112', type: 'call', value: '112', danger: true },
    ],
  },
];