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
  'सीने में दर्द',
  'बेहोश',
  'सांस नहीं',
];

export function isRedFlagSymptom(text = '') {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * AI Saarthi triage, symptom-based disease detection and medication guidance service
 */
export async function processAiTriage(message, history = []) {
  const lower = (message || '').toLowerCase().trim();

  // 1. Red-flag life-threatening emergency check
  if (isRedFlagSymptom(lower)) {
    return {
      reply:
        '⚠️ CRITICAL EMERGENCY ALERT: These symptoms (chest pain, unconsciousness, severe breathing distress) indicate a life-threatening medical condition. Do NOT wait for medicines.\n\n' +
        '• Immediately call 112 or 108 for an emergency ambulance.\n' +
        '• Rush to the nearest cardiac / trauma emergency ward.\n' +
        '• Keep patient in a comfortable seated position with open airflow.',
      replyHi:
        '⚠️ गंभीर आपातकालीन चेतावनी: यह लक्षण (सीने में दर्द, सांस न आना, बेहोशी) जीवन के लिए घातक आपात स्थिति का संकेत हैं। दवाइयों का इंतजार न करें।\n\n' +
        '• तुरंत 112 या 108 डायल करके एम्बुलेंस बुलाएं।\n' +
        '• निकटतम ट्रॉमा सेंटर / इमरजेंसी अस्पताल पहुंचें।\n' +
        '• मरीज को खुली हवा में बैठाकर रखें और शांत रखें।',
      isRedFlag: true,
      urgency: 'critical',
      actions: [
        { label: '🚨 Call 112 / 108 Now', type: 'call', value: '112', danger: true },
        { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'AI Saarthi provides civic guidance only. In life risk, immediately call 112 or 108.',
    };
  }

  // 2. Fever & Temperature Symptoms (Disease Detection + Medicine Guidance)
  if (
    lower.includes('fever') ||
    lower.includes('bukhar') ||
    lower.includes('bukhaar') ||
    lower.includes('taap') ||
    lower.includes('temperature') ||
    lower.includes('dolo') ||
    lower.includes('paracetamol') ||
    lower.includes('बुखार')
  ) {
    const hasChills = lower.includes('chills') || lower.includes('thand') || lower.includes('kapkapi') || lower.includes('ठंड');
    const hasRash = lower.includes('rash') || lower.includes('daane') || lower.includes('lal') || lower.includes('चकत्ते');

    return {
      reply:
        '🩺 Symptom & Disease Analysis: Likely Viral Fever, Seasonal Flu, or early infection.' +
        (hasChills ? ' (Chills may indicate Malaria/Dengue or bacterial infection. Monitor platelet counts if fever persists).' : '') +
        (hasRash ? ' (Warning: Skin rash with fever needs prompt doctor examination for Dengue or Measles).' : '') +
        '\n\n' +
        '💊 Recommended Medicines You Can Take:\n' +
        '• First-Line Antipyretic: Paracetamol 650mg (Dolo 650 / Calpol 650 / Crocin) or Jan Aushadhi Generic Paracetamol (₹8–₹14 / 10 tabs).\n' +
        '• Dosage: 1 tablet after meals every 6–8 hours as needed (do NOT exceed 3 tablets in 24 hours).\n' +
        '• Hydration Support: Drink ORS (Electral), coconut water, or fresh lime water regularly.\n' +
        '• Physical Care: Place damp cold cloth strips on forehead if body temperature crosses 101°F.\n\n' +
        '⚠️ Caution: Avoid Aspirin or Ibuprofen if Dengue is suspected (risk of internal bleeding).\n' +
        '🚨 Hospital Alert: Rush to hospital if fever exceeds 103°F, lasts over 3 days, or is accompanied by breathlessness or extreme dizziness.',
      replyHi:
        '🩺 लक्षण एवं संभावित बीमारी: वायरल बुखार (Viral Fever) या मौसमी फ्लू (Seasonal Flu)।' +
        (hasChills ? ' (ठंड और कंपकंपी के साथ बुखार मलेरिया या डेंगू का संकेत हो सकता है)।' : '') +
        '\n\n' +
        '💊 आप कौन सी दवा ले सकते हैं:\n' +
        '• बुखार कम करने हेतु: पैरासिटामोल 650mg (Dolo 650 / Calpol / Crocin) या जन औषधि केंद्र से जेनेरिक पैरासिटामोल (₹8–₹14 में 10 गोलियां)।\n' +
        '• खुराक: खाना खाने के बाद 1 गोली (6–8 घंटे के अंतराल पर, 24 घंटे में अधिकतम 3 गोलियां)।\n' +
        '• घरेलू देखभाल: खूब पानी, ORS घोल और नारियल पानी पिएं। बुखार 101°F से ऊपर हो तो माथे पर ठंडे पानी की पट्टी रखें।\n\n' +
        '⚠️ चेतावनी: डेंगू की आशंका में एस्पिरिन (Aspirin) या इबुप्रोफेन कभी न लें।\n' +
        '🚨 अस्पताल कब जाएं: यदि बुखार 3 दिन से अधिक रहे, 103°F से अधिक हो या सांस लेने में परेशानी हो तो तुरंत डॉक्टर को दिखाएं।',
      isRedFlag: false,
      urgency: 'moderate',
      actions: [
        { label: '💊 Jan Aushadhi Generic Medicines', type: 'link', value: '/healthcare' },
        { label: '🏥 Nearest 24/7 Hospital', type: 'link', value: '/healthcare' },
        { label: '👨‍⚕️ Book Doctor Consultation', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'OTC guidance is for mild symptoms. Consult a physician before administering to children or pregnant individuals.',
    };
  }

  // 3. Cold, Cough, Sore Throat, Sneezing (Disease Detection + Medicine Guidance)
  if (
    lower.includes('cough') ||
    lower.includes('khansi') ||
    lower.includes('cold') ||
    lower.includes('zukam') ||
    lower.includes('jukam') ||
    lower.includes('sardi') ||
    lower.includes('sore throat') ||
    lower.includes('gale mein dard') ||
    lower.includes('khasi') ||
    lower.includes('खांसी') ||
    lower.includes('जुकाम')
  ) {
    return {
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
      isRedFlag: false,
      urgency: 'low',
      actions: [
        { label: '💊 Jan Aushadhi Cough & Cold Meds', type: 'link', value: '/healthcare' },
        { label: '👨‍⚕️ Consult Doctor Online', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'Informational guidance. For persistent cough or pediatric cases, always consult a pediatrician or doctor.',
    };
  }

  // 4. Stomach Pain, Acidity, Gas, Indigestion (Disease Detection + Medicine Guidance)
  if (
    lower.includes('stomach') ||
    lower.includes('pet') ||
    lower.includes('acidity') ||
    lower.includes('gas') ||
    lower.includes('jalan') ||
    lower.includes('heartburn') ||
    lower.includes('indigestion') ||
    lower.includes('पेट') ||
    lower.includes('गैस')
  ) {
    return {
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
      isRedFlag: false,
      urgency: 'moderate',
      actions: [
        { label: '💊 Check Antacid & Spas Meds', type: 'link', value: '/healthcare' },
        { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'For severe, radiating, or rigid abdominal pain, please get evaluated at an emergency clinic.',
    };
  }

  // 5. Loose Motion, Diarrhea, Vomiting, Food Poisoning
  if (
    lower.includes('loose motion') ||
    lower.includes('dast') ||
    lower.includes('diarrhea') ||
    lower.includes('diarrhoea') ||
    lower.includes('ulti') ||
    lower.includes('vomit') ||
    lower.includes('dehydration') ||
    lower.includes('दस्त') ||
    lower.includes('उल्टी')
  ) {
    return {
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
      isRedFlag: false,
      urgency: 'high',
      actions: [
        { label: '💊 Jan Aushadhi ORS & Meds', type: 'link', value: '/healthcare' },
        { label: '🏥 Nearest Emergency Hospital', type: 'link', value: '/healthcare' },
        { label: '🚨 Call 108 Ambulance', type: 'call', value: '108', danger: true },
      ],
      disclaimer: 'Dehydration can be dangerous in children and the elderly. Seek medical attention promptly if fluid loss is high.',
    };
  }

  // 6. Headache, Body Ache, Sprain, Muscle Pain
  if (
    lower.includes('headache') ||
    lower.includes('sar dard') ||
    lower.includes('sir dard') ||
    lower.includes('migraine') ||
    lower.includes('body pain') ||
    lower.includes('badan dard') ||
    lower.includes('joint pain') ||
    lower.includes('सर दर्द') ||
    lower.includes('बदन दर्द')
  ) {
    return {
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
      isRedFlag: false,
      urgency: 'low',
      actions: [
        { label: '💊 Generic Pain Relief Meds', type: 'link', value: '/healthcare' },
        { label: '👨‍⚕️ Consult Doctor Online', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'Do not take pain relief medications on an empty stomach.',
    };
  }

  // 7. Flood or Water Inundation / Natural Disaster
  if (lower.includes('flood') || lower.includes('pani') || lower.includes('baadh') || lower.includes('doob') || lower.includes('cyclone') || lower.includes('disaster')) {
    return {
      reply:
        'Please verify your immediate safety. If an evacuation order is active, move immediately to elevated ground or designated relief camp. Do not cross waterlogged bridges or submerged roads.',
      replyHi:
        'कृपया पहले अपनी सुरक्षा सुनिश्चित करें। यदि निकासी आदेश है तो ऊंचे स्थान या राहत शिविर की ओर जाएं। जलभराव वाले रास्तों या पुलों को पार न करें।',
      isRedFlag: false,
      urgency: 'high',
      actions: [
        { label: '🗺️ Live Disaster & Situation Map', type: 'link', value: '/live-board' },
        { label: '⛺ View Safe Relief Shelters', type: 'link', value: '/disaster' },
        { label: '🆘 Report SOS Incident', type: 'link', value: '/emergency' },
      ],
      disclaimer: 'Follow state disaster management authority (SDMA) instructions.',
    };
  }

  // 8. General Health / Medicine / Jan Aushadhi Inquiry
  if (lower.includes('dawa') || lower.includes('medicine') || lower.includes('dawae') || lower.includes('jan aushadhi') || lower.includes('generic') || lower.includes('दवा')) {
    return {
      reply:
        'Pradhan Mantri Jan Aushadhi generic medicines provide the exact same chemical formulation and therapeutic efficacy as branded medicines at 50% to 90% lower cost.\n\n' +
        'Common OTC Jan Aushadhi equivalents:\n' +
        '• Paracetamol 650mg: ₹12 (vs ₹35 branded)\n' +
        '• Cetirizine 10mg: ₹9 (vs ₹38 branded)\n' +
        '• Pantoprazole 40mg: ₹22 (vs ₹110 branded)\n' +
        '• ORS Electral sachet: ₹9 (vs ₹24 branded)\n\n' +
        'You can search generic matches and find nearby stores on the Healthcare page.',
      replyHi:
        'प्रधानमंत्री जन औषधि जेनेरिक दवाएं ब्रांडेड दवाओं के समान गुणवत्ता और प्रभाव वाली होती हैं, लेकिन 50% से 90% तक सस्ती मिलती हैं।\n\n' +
        'प्रमुख जेनेरिक दवाएं:\n' +
        '• पैरासिटामोल 650mg: ₹12 (ब्रांडेड ₹35)\n' +
        '• सेटिरिज़िन 10mg: ₹9 (ब्रांडेड ₹38)\n' +
        '• पैंटोप्राजोल 40mg: ₹22 (ब्रांडेड ₹110)\n' +
        '• ओआरएस (ORS): ₹9 (ब्रांडेड ₹24)\n\n' +
        'आप हेल्थकेयर पेज पर नजदीकी जन औषधि केंद्र और दवाओं की कीमतें देख सकते हैं।',
      isRedFlag: false,
      urgency: 'low',
      actions: [
        { label: '💊 Check Jan Aushadhi Prices', type: 'link', value: '/healthcare' },
        { label: '🏥 Find Nearest Hospital', type: 'link', value: '/healthcare' },
      ],
      disclaimer: 'Prescription medicines require a valid doctor prescription.',
    };
  }

  // 9. Kumbh Mela / Lost & Found / Missing Persons
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

  // 10. Default General Guidance
  return {
    reply:
      `Hello! I am AI Saarthi, your 24/7 civic emergency and symptom detection assistant. Tell me your symptoms (fever, cough, stomach pain, headache) and I will detect potential conditions, suggest appropriate OTC medicines, and guide you to nearby healthcare. How may I help you?`,
    replyHi:
      `नमस्ते! मैं एआई सारथी हूँ, आपका 24/7 आपातकालीन एवं लक्षण जांच सहायक। मुझे अपने लक्षण बताएं (जैसे बुखार, खांसी, पेट दर्द, सिरदर्द) और मैं संभावित बीमारी की पहचान कर उचित दवा और नजदीकी स्वास्थ्य सेवा की जानकारी दूंगा।`,
    isRedFlag: false,
    urgency: 'low',
    actions: [
      { label: '🏥 Find 24x7 Hospitals', type: 'link', value: '/healthcare' },
      { label: '💊 Jan Aushadhi Medicines', type: 'link', value: '/healthcare' },
      { label: '🗺️ Live Disaster & Situation Map', type: 'link', value: '/live-board' },
      { label: '🚨 Report SOS Emergency', type: 'link', value: '/emergency' },
    ],
    disclaimer: 'AI Saarthi provides civic guidance only. Always follow local authority instructions.',
  };
}

export default { isRedFlagSymptom, processAiTriage };
