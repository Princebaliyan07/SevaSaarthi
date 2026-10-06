/**
 * SevaSaarthi Bilingual Civic Guide Generator & Downloader
 * Generates beautifully styled, print-ready, official bilingual (Hindi + English)
 * disaster and emergency safety handbooks.
 */

export const CIVIC_GUIDES = {
  'first-aid': {
    filename: 'SevaSaarthi_Emergency_First_Aid_Handbook.html',
    title: 'Emergency First Aid Handbook',
    titleHi: 'आपातकालीन प्राथमिक चिकित्सा पुस्तिका',
    agency: 'Civic Healthcare & Red Cross Standards',
    version: '2026 National Edition',
    sections: [
      {
        heading: '1. CPR (Cardiopulmonary Resuscitation) / सी.पी.आर. जीवन रक्षक प्रक्रिया',
        en: 'For unresponsive victims not breathing normally: 1) Call 108/112 immediately. 2) Place hands in center of chest. 3) Push hard and fast (100-120 compressions per minute, 2 inches deep). 4) Give 2 rescue breaths after every 30 compressions if trained.',
        hi: 'बेहोश और सांस न ले रहे व्यक्ति के लिए: 1) तुरंत 108 या 112 पर कॉल करें। 2) छाती के बीच में दोनों हाथ रखें। 3) तेजी से और जोर से दबाएं (100-120 बार प्रति मिनट, 2 इंच गहराई)। 4) प्रशिक्षित होने पर हर 30 बार दबाने के बाद 2 बार मुंह से सांस दें।',
      },
      {
        heading: '2. Severe Bleeding Control / गंभीर रक्तस्राव नियंत्रण',
        en: '1) Apply direct, firm pressure on the wound with a clean cloth or sterile gauze. 2) Keep pressure continuous for at least 10 minutes without lifting. 3) Elevate the injured limb above heart level if no fracture is suspected. 4) If arterial blood spurts, apply a tourniquet 2 inches above the wound and note the time.',
        hi: '1) घाव पर साफ कपड़े या गॉज से सीधा और लगातार दबाव डालें। 2) कम से कम 10 मिनट तक दबाव बनाए रखें। 3) यदि हड्डी टूटने का संदेह न हो, तो घायल अंग को दिल के स्तर से ऊपर उठाएं। 4) अत्यधिक खून बहने पर घाव से 2 इंच ऊपर कसकर पट्टी (टूर्निकेट) बांधें और समय नोट करें।',
      },
      {
        heading: '3. Burns & Scalds / जलने पर तत्काल प्राथमिक उपचार',
        en: '1) Cool the burn immediately under cool, running tap water for 15-20 minutes. 2) Never use ice, iced water, butter, oil, or toothpaste (they trap heat and cause infections). 3) Cover loosely with sterile plastic wrap or clean dry cloth. 4) Seek immediate emergency care for burns larger than the palm or on face/joints.',
        hi: '1) जले हुए हिस्से को तुरंत 15-20 मिनट तक सामान्य ठंडे बहते पानी के नीचे रखें। 2) कभी भी बर्फ, तेल, घी या टूथपेस्ट न लगाएं (यह गर्मी रोकते हैं और संक्रमण फैलाते हैं)। 3) घाव को साफ पॉलीथिन या सूती कपड़े से हल्के से ढकें। 4) हथेली से बड़े या चेहरे पर जले घाव के लिए तुरंत अस्पताल जाएं।',
      },
      {
        heading: '4. Choking (Heimlich Maneuver) / गले में खाना या वस्तु अटकना',
        en: '1) If the person cannot speak or breathe, stand behind them. 2) Place a fist just above their navel and grasp it with your other hand. 3) Perform quick, upward and inward abdominal thrusts. 4) For pregnant women or infants, perform chest thrusts instead.',
        hi: '1) यदि व्यक्ति बोल या सांस न ले पा रहा हो, तो उसके पीछे खड़े हों। 2) नाभि के ठीक ऊपर एक मुट्ठी रखें और दूसरे हाथ से पकड़ें। 3) तेजी से अंदर और ऊपर की ओर झटका (एब्डॉमिनल थ्रस्ट) दें। 4) गर्भवती महिलाओं और नवजात शिशुओं के लिए छाती पर दबाव दें।',
      },
      {
        heading: '5. Snake Bite Protocol / सर्पदंश पर क्या करें और क्या न करें',
        en: 'DO: Keep victim calm and completely still. Immobilize the bitten limb below heart level. Note snake description. Rush to nearest hospital for Anti-Snake Venom (ASV).\nDO NOT: Do NOT cut the wound, do NOT suck the venom, do NOT apply ice, and do NOT tie extremely tight ropes.',
        hi: 'क्या करें: मरीज को शांत रखें और बिल्कुल हिलने न दें। काटे गए अंग को दिल के स्तर से नीचे रखें। तुरंत एंटी-वेनम वाले अस्पताल ले जाएं।\nक्या न करें: घाव पर चीरा न लगाएं, जहर चूसने की कोशिश न करें, बर्फ न लगाएं और अत्यधिक तंग रस्सी न बांधें।',
      },
    ],
    helplines: [
      { name: 'National Emergency', num: '112' },
      { name: 'Ambulance Service', num: '108' },
      { name: 'Disaster Helpline', num: '1078' },
    ],
  },

  'flood-guide': {
    filename: 'SevaSaarthi_Flood_Preparedness_Evacuation_Guide.html',
    title: 'Flood Preparedness & Evacuation Guide',
    titleHi: 'बाढ़ पूर्व तैयारी एवं सुरक्षित निकासी नियमावली',
    agency: 'National Disaster Management Authority (NDMA) Standards',
    version: '2026 Monsoon Edition',
    sections: [
      {
        heading: '1. Pre-Flood Emergency Go-Bag / बाढ़ पूर्व 72 घंटे का इमरजेंसी बैग',
        en: 'Prepare an emergency kit with: 3 days of non-perishable food, potable drinking water (3L per person/day), waterproof pouch with Aadhaar/property papers, battery torch, power bank, first aid box with ORS and chlorine water-purification tablets.',
        hi: 'इमरजेंसी किट में रखें: 3 दिनों का सूखा भोजन, पीने का पानी (3 लीटर प्रति व्यक्ति/दिन), वाटरप्रूफ बैग में आधार कार्ड व जरूरी दस्तावेज, टॉर्च, पावर बैंक, ओआरएस और क्लोरीन की गोलियों वाली प्राथमिक चिकित्सा किट।',
      },
      {
        heading: '2. During Flood & Evacuation / बाढ़ के दौरान निकासी सावधानियां',
        en: '1) Turn off electricity main circuit breaker and LPG cylinder valves before leaving. 2) Never walk, swim, or drive through moving water. 6 inches of moving water can knock you down, and 12 inches can sweep away cars. 3) Follow designated SDRF/NDRF evacuation routes to elevated relief camps.',
        hi: '1) घर छोड़ने से पहले मुख्य बिजली का स्विच और गैस सिलेंडर रेगुलेटर बंद करें। 2) बहते पानी में कभी पैदल न चलें और न गाड़ी चलाएं। 6 इंच बहता पानी इंसान को गिरा सकता है और 12 इंच पानी गाड़ी को बहा ले जा सकता है। 3) प्रशासन द्वारा बताए गए सुरक्षित निकासी मार्गों से ऊंचे राहत शिविरों में जाएं।',
      },
      {
        heading: '3. Post-Flood Health & Water Safety / बाढ़ के बाद स्वास्थ्य और सुरक्षा',
        en: '1) Boil drinking water vigorously for at least 1 minute or use chlorine tablets. 2) Beware of snakes, scorpions, and rodents taking shelter in dry areas of homes. 3) Do not turn on electrical appliances until fully inspected and certified by an electrician.',
        hi: '1) पीने का पानी कम से कम 1 मिनट तक उबालकर ही पिएं या क्लोरीन की गोली डालें। 2) सूखे स्थानों पर छुपे सांप, बिच्छू और अन्य जीवों से सावधान रहें। 3) बिजली के उपकरणों को पूरी तरह सूखने और मैकेनिक द्वारा जांचे जाने से पहले चालू न करें।',
      },
    ],
    helplines: [
      { name: 'NDMA Control Room', num: '1078' },
      { name: 'State Relief Commissioner', num: '1070' },
      { name: 'Emergency Services', num: '112' },
    ],
  },

  'heatwave-protocol': {
    filename: 'SevaSaarthi_Heatwave_Sunstroke_Safety_Protocol.html',
    title: 'Heatwave & Sunstroke Safety Protocol',
    titleHi: 'लू (हीटवेव) और सनस्ट्रोक सुरक्षा प्रोटोकॉल',
    agency: 'Ministry of Health & Family Welfare',
    version: '2026 Summer Protocol',
    sections: [
      {
        heading: '1. Identification: Heat Exhaustion vs Heat Stroke / लक्षण और अंतर',
        en: 'Heat Exhaustion: Heavy sweating, cold pale skin, dizziness, muscle cramps, nausea. (Manage with rest, shade, and fluids).\nHeat Stroke (MEDICAL EMERGENCY): Body temperature over 104°F (40°C), red hot dry skin, rapid pulse, slurred speech, unconsciousness. Call 108 immediately!',
        hi: 'हीट एग्जॉशन: अत्यधिक पसीना, पीली ठंडी त्वचा, चक्कर, मांसपेशियों में ऐंठन, कमजोरी। (छांव और ओआरएस से आराम दें)।\nहीट स्ट्रोक (घातक आपात स्थिति): शरीर का तापमान 104°F से अधिक, पसीना बंद होकर लाल गर्म सूखी त्वचा, बेहोशी। तुरंत 108 पर कॉल करें!',
      },
      {
        heading: '2. Preventive Daily Protocol / दैनिक बचाव नियम',
        en: '1) Avoid stepping outside between 12:00 PM and 4:00 PM during peak thermal intensity. 2) Drink at least 3-4 liters of water daily, along with buttermilk (chaas), lemon water, and raw mango panna. 3) Wear loose, lightweight, light-colored cotton clothes and cover head with a cotton gamcha/hat.',
        hi: '1) दोपहर 12:00 बजे से 4:00 बजे के बीच सीधी धूप में निकलने से बचें। 2) दिन में कम से कम 3-4 लीटर पानी, छाछ, नींबू पानी और कच्चे आम का पन्ना पिएं। 3) हल्के रंग के ढीले सूती कपड़े पहनें और सिर को सूती गमछे, टोपी या छाते से ढकें।',
      },
      {
        heading: '3. Emergency Treatment on Sunstroke / सनस्ट्रोक होने पर तुरंत क्या करें',
        en: '1) Move patient immediately to a cool, shaded, or air-conditioned area. 2) Remove excess clothing. 3) Sponge entire body with cool water and place ice packs wrapped in cloth on armpits, groin, and neck. 4) Do NOT give fluids if patient is unconscious or drowsy.',
        hi: '1) मरीज को तुरंत ठंडी छांव या वातानुकूलित कमरे में लाएं। 2) अतिरिक्त कपड़े ढीले करें या हटाएं। 3) ठंडे पानी की पट्टियां पूरे शरीर पर रखें और कांख, गर्दन व कमर पर बर्फ की थैली लगाएं। 4) यदि मरीज बेहोश या सुस्त हो, तो जबरन पानी न पिलाएं। तुरंत 108 बुलाएं।',
      },
    ],
    helplines: [
      { name: 'Ambulance Emergency', num: '108' },
      { name: 'Health Helpline', num: '104' },
      { name: 'Unified Emergency', num: '112' },
    ],
  },

  'kumbh-manual': {
    filename: 'SevaSaarthi_Kumbh_Mela_Sangam_Safety_Manual.html',
    title: 'Kumbh Mela Sangam Safety Manual',
    titleHi: 'कुंभ मेला संगम सुरक्षा एवं भीड़ प्रबंधन नियमावली',
    agency: 'Prayagraj Mela Administration & Smart City Command',
    version: 'Maha Kumbh 2026 Protocol',
    sections: [
      {
        heading: '1. Sangam Ghat Holy Dip Safety / संगम घाट स्नान सुरक्षा नियम',
        en: '1) Bathe only within designated barricaded ghat sectors. Never cross river safety chains or red danger buoys. 2) Keep a firm hold of children and elderly family members at all times. 3) Avoid bathing during peak rush hours (Brahma Muhurta on Shahi Snan dates) if traveling with infants or seniors.',
        hi: '1) केवल निर्धारित बैरिकेड्स वाले घाटों पर ही स्नान करें। नदी की लाल चेतावनी ब्वॉय या सुरक्षा जंजीरों को कभी पार न करें। 2) बच्चों और बुजुर्गों का हाथ हमेशा मजबूती से पकड़कर रखें। 3) प्रमुख शाही स्नान तिथियों पर अत्यधिक भीड़ के समय छोटे बच्चों और वृद्धों को गहरे जल में न ले जाएं।',
      },
      {
        heading: '2. Pontoon Bridge (Pipa Pul) Discipline / पीपा पुल पार करने की नियमावली',
        en: '1) Move strictly in the designated one-way pedestrian flow. Never attempt to walk against the crowd. 2) Do NOT stop on pontoon bridges for selfies or photography (this creates fatal bottlenecks). 3) Follow instructions broadcast over public address speakers and from police watchtowers.',
        hi: '1) केवल निर्धारित एकतरफा दिशा में ही चलें। कभी भी भीड़ के विपरीत चलने का प्रयास न करें। 2) पीपा पुलों पर खड़े होकर सेल्फी या फोटो न लें (इससे खतरनाक रुकावट पैदा होती है)। 3) लाउडस्पीकरों और पुलिस वॉचटावर से दिए जा रहे निर्देशों का कड़ाई से पालन करें।',
      },
      {
        heading: '3. Crowd Surge & Stampede Survival / भीड़ के दबाव से बचाव के उपाय',
        en: '1) If caught in a surging crowd, stay on your feet. Keep hands up in front of your chest like a boxer to preserve breathing space for your lungs. 2) Move diagonally with the crowd flow rather than pushing directly forward or backward. 3) If you fall, immediately curl into a tight ball on your side (fetal position) with hands protecting your head and neck.',
        hi: '1) यदि भीड़ का दबाव बढ़े, तो पैरों पर टिके रहें। दोनों हाथों को बॉक्सर की तरह छाती के सामने रखें ताकि फेफड़ों को सांस लेने की जगह मिलती रहे। 2) भीड़ के बहाव के साथ तिरछी दिशा में धीरे-धीरे बाहर निकलें। 3) यदि जमीन पर गिर जाएं, तो तुरंत करवट लेकर घुटनों को छाती से सटाएं और हाथों से सिर व गर्दन को ढकें।',
      },
      {
        heading: '4. Lost & Found Reunification / खोया-पाया एवं परिवार मिलाप केंद्र',
        en: '1) Put an ID slip with child/elderly person’s name, phone number, and home district inside their pocket or around their wrist before entering grounds. 2) If separated, report immediately to the nearest of 48 Lost & Found Desks at Sangam, Parade Ground, or Sector 4. 3) AI-powered facial matching cameras and live digital broadcasts help reunite families rapidly.',
        hi: '1) मेला क्षेत्र में प्रवेश से पहले बच्चों और बुजुर्गों की जेब में नाम, फोन नंबर और जिले की पर्ची अवश्य रखें। 2) बिछड़ने पर संगम, परेड मैदान या सेक्टर 4 के नजदीकी खोया-पाया केंद्र पर तुरंत सूचना दें। 3) एआई फेशियल मैचिंग कैमरे और डिजिटल उद्घोषणा प्रणाली परिजनों को शीघ्र मिलाने में सक्रिय हैं।',
      },
    ],
    helplines: [
      { name: 'Kumbh Mela Helpline', num: '1920' },
      { name: 'Police Control Room', num: '112' },
      { name: 'Sangam Health Camp', num: '108' },
    ],
  },
};

/**
 * Generate a complete standalone HTML printable document with bilingual Hindi + English
 */
export function generateBilingualGuideHtml(guideKey) {
  const guide = CIVIC_GUIDES[guideKey] || CIVIC_GUIDES['first-aid'];

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${guide.title} - ${guide.titleHi} | SevaSaarthi</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      padding: 30px 20px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .title-block h1 {
      font-size: 26px;
      color: #0f172a;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .title-block h2 {
      font-size: 20px;
      color: #0284c7;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .meta-badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
    }
    .actions {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-print:hover { background: #0369a1; }
    
    .section {
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px dashed #cbd5e1;
    }
    .section:last-of-type { border-bottom: none; }
    .section-title {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      background: #f1f5f9;
      padding: 8px 14px;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #0284c7;
    }
    .lang-block {
      margin-bottom: 12px;
      padding: 12px 16px;
      border-radius: 8px;
    }
    .lang-en {
      background: #fafafa;
      border-left: 3px solid #64748b;
    }
    .lang-hi {
      background: #eff6ff;
      border-left: 3px solid #3b82f6;
    }
    .lang-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
      display: block;
    }
    .lang-en .lang-label { color: #64748b; }
    .lang-hi .lang-label { color: #2563eb; }
    .content-text {
      font-size: 14px;
      line-height: 1.7;
      white-space: pre-line;
    }
    
    .helpline-box {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 20px;
      margin-top: 30px;
    }
    .helpline-title {
      font-size: 15px;
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .helpline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
    }
    .helpline-card {
      background: #ffffff;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #fee2e2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .helpline-num {
      font-size: 18px;
      font-weight: 800;
      color: #dc2626;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }

    @media print {
      body { background: #ffffff; padding: 0; }
      .container { box-shadow: none; border: none; padding: 10px; }
      .actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title-block">
        <span class="meta-badge">${guide.agency}</span>
        <span class="meta-badge">${guide.version}</span>
        <h1>${guide.title}</h1>
        <h2>${guide.titleHi}</h2>
      </div>
      <div class="actions">
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      </div>
    </div>

    ${guide.sections
      .map(
        (sec) => `
      <div class="section">
        <div class="section-title">${sec.heading}</div>
        <div class="lang-block lang-en">
          <span class="lang-label">English Guidance</span>
          <div class="content-text">${sec.en}</div>
        </div>
        <div class="lang-block lang-hi">
          <span class="lang-label">हिन्दी निर्देश (Hindi)</span>
          <div class="content-text">${sec.hi}</div>
        </div>
      </div>
    `
      )
      .join('')}

    <div class="helpline-box">
      <div class="helpline-title">
        <span>🚨</span>
        <span>24x7 Emergency Helplines / 24x7 आपातकालीन हेल्पलाइन नंबर</span>
      </div>
      <div class="helpline-grid">
        ${guide.helplines
          .map(
            (h) => `
          <div class="helpline-card">
            <span style="font-size: 13px; font-weight: 600; color: #334155;">${h.name}</span>
            <span class="helpline-num">${h.num}</span>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="footer">
      <p>SevaSaarthi Civic Emergency Platform · Verified Government & Disaster Management Authority Handbook</p>
      <p>Download date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Designed for offline emergency access.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Triggers an instant download of the bilingual guide
 */
export function downloadBilingualGuide(guideKey) {
  const guide = CIVIC_GUIDES[guideKey] || CIVIC_GUIDES['first-aid'];
  const htmlContent = generateBilingualGuideHtml(guideKey);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = guide.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
