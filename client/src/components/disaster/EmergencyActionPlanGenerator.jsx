import { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Download,
  Edit3,
  BookmarkCheck,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Users,
  Home,
  HeartPulse,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STORAGE_KEY_PLAN = 'ss_saved_action_plan';

export default function EmergencyActionPlanGenerator({ onStartRecommendedDrill }) {
  const { lang } = useLanguage();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    areaType: 'Urban',
    disasterType: 'Flood',
    householdSize: 4,
    assistanceNeeds: ['No additional assistance required'],
    hasContacts: 'No',
    hasShelter: 'No',
  });
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState('');

  // Load existing saved plan if any
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_PLAN) || 'null');
      if (saved && saved.formData) {
        setFormData(saved.formData);
        setIsPlanGenerated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAssistanceToggle = (val) => {
    setFormData((prev) => {
      let current = [...prev.assistanceNeeds];
      if (val === 'No additional assistance required') {
        return { ...prev, assistanceNeeds: [val] };
      }
      current = current.filter((x) => x !== 'No additional assistance required');
      if (current.includes(val)) {
        current = current.filter((x) => x !== val);
      } else {
        current.push(val);
      }
      if (current.length === 0) current = ['No additional assistance required'];
      return { ...prev, assistanceNeeds: current };
    });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsPlanGenerated(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSavePlan = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY_PLAN,
        JSON.stringify({
          formData,
          generatedAt: new Date().toISOString(),
        })
      );
      setSavedFeedback('Plan successfully saved to your browser storage!');
      setTimeout(() => setSavedFeedback(''), 4000);
    } catch {
      setSavedFeedback('Error saving plan to storage.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `=====================================================
SEVASAARTHI · PERSONALIZED HOUSEHOLD EMERGENCY ACTION PLAN
=====================================================
Generated Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
Prepared For: Household of ${formData.householdSize} member(s)
Area Terrain: ${formData.areaType}
Primary Threat Focus: ${formData.disasterType}
Special Assistance Needs: ${formData.assistanceNeeds.join(', ')}

-----------------------------------------------------
1. BEFORE AN EMERGENCY
-----------------------------------------------------
• Keep 3-day emergency supplies ready: at least ${formData.householdSize * 9} liters of drinking water and dry rations.
• Secure official identity papers (Aadhaar, property deed, insurance) in a sealed waterproof pouch.
• Map the main gas cylinder regulator and electrical circuit breaker; ensure adults know shutoff steps.
${formData.areaType === 'Mountainous' ? '• Monitor slope cracks and maintain hillside drainage channels clear of debris.\n' : ''}${formData.disasterType.includes('Flood') ? '• Ensure drainage around home is unclogged; raise electronics 1 foot above floor level.\n' : ''}${formData.hasContacts === 'No' ? '• URGENT ACTION: Write down 2 family phone numbers and local EOC (1077) on emergency cards today.\n' : '• Confirm all emergency phone numbers are updated on family phones.\n'}${formData.hasShelter === 'No' ? '• URGENT ACTION: Check the SevaSaarthi Shelter Finder below to identify your nearest designated safe high-ground relief centre.\n' : '• Confirm primary and secondary walking routes to your designated emergency shelter.\n'}
-----------------------------------------------------
2. DURING AN EMERGENCY
-----------------------------------------------------
${formData.disasterType === 'Earthquake' ? '• DROP to hands and knees, take COVER under a sturdy table, and HOLD ON until shaking stops completely.\n• Do not use elevators; avoid glass windows.' : ''}${formData.disasterType === 'Flood' || formData.disasterType === 'Cloudburst' ? '• Move immediately to higher ground or upper floor.\n• NEVER walk, swim, or drive through flooded roads (6 inches sweeps adults, 2 feet floats cars).\n• Turn off main electrical breaker and LPG gas cylinder before leaving.' : ''}${formData.disasterType === 'Landslide' ? '• Evacuate perpendicular to the slide path toward solid bedrock.\n• Curl in a ball to protect head if debris cannot be avoided.' : ''}${formData.disasterType === 'Heatwave' ? '• Stay in shaded, cooled areas between 12 PM - 4 PM.\n• Drink ORS and water frequently; cover head with cotton gamchha or hat.' : ''}${formData.assistanceNeeds.includes('Children') ? '• Keep children calm; assign a specific adult to hold their hand and carry their formula/comfort items.' : ''}${formData.assistanceNeeds.includes('Elderly people') || formData.assistanceNeeds.includes('People with mobility limitations') ? '• Prioritize mobility aids (canes, wheelchairs) and essential 7-day medications during evacuation.' : ''}

-----------------------------------------------------
3. AFTER AN EMERGENCY
-----------------------------------------------------
• Inspect surroundings for gas leaks, fractured water pipes, and exposed wiring.
• Boil or purify all drinking water for at least 10 minutes before consumption.
• Send brief SMS texts rather than voice calls to preserve emergency cellular bandwidth.
• Return home only after district civil defense authorities officially declare all clear.

-----------------------------------------------------
LEGAL & SAFETY DISCLAIMER:
This personalized household preparedness plan is generated based on standard civil defense guidelines (NDMA/SDMA) and does NOT replace directives from on-site emergency authorities or police.
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SevaSaarthi_Emergency_Action_Plan_${formData.disasterType.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Associated recommended drill
  const getRecommendedDrillId = () => {
    const d = formData.disasterType.toLowerCase();
    if (d.includes('flood')) return 'flash-flood';
    if (d.includes('landslide')) return 'landslide';
    if (d.includes('earthquake')) return 'earthquake';
    if (d.includes('cloudburst')) return 'cloudburst';
    if (d.includes('heatwave')) return 'heatwave';
    return 'flash-flood';
  };

  return (
    <section id="action-plan" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Tailored Protection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          Create Your Emergency Action Plan
        </h2>
        <p className="text-sm text-ink-soft max-w-2xl mt-1 leading-relaxed">
          Build a preparedness plan based on your household and the disasters that may affect your area.
        </p>
      </div>

      <div className="card bg-white p-5 sm:p-7 border border-slate-200">
        {!isPlanGenerated ? (
          /* Multi-Step Question Form */
          <div className="space-y-6">
            {/* Step Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-brand-dark uppercase tracking-wider">
                  Step {currentStep} of 6
                </span>
                <span className="text-ink-soft">
                  {currentStep === 1 && 'Area Terrain'}
                  {currentStep === 2 && 'Disaster Threat'}
                  {currentStep === 3 && 'Household Size'}
                  {currentStep === 4 && 'Assistance Needs'}
                  {currentStep === 5 && 'Emergency Contacts'}
                  {currentStep === 6 && 'Shelter Location'}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Question 1: Area Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  1. What type of area do you live in?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Urban', 'Rural', 'Mountainous', 'Flood-prone', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, areaType: type })}
                      className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                        formData.areaType === type
                          ? 'border-brand bg-teal-50/80 text-brand-dark ring-1 ring-brand'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 2: Disaster Type */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  2. Which disaster are you primarily preparing for?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Flood', 'Landslide', 'Earthquake', 'Cloudburst', 'Heatwave', 'Multiple disasters'].map(
                    (disaster) => (
                      <button
                        key={disaster}
                        type="button"
                        onClick={() => setFormData({ ...formData, disasterType: disaster })}
                        className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                          formData.disasterType === disaster
                            ? 'border-brand bg-teal-50/80 text-brand-dark ring-1 ring-brand'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {disaster}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Question 3: Household Size */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  3. How many people are included in your household plan?
                </h3>
                <div className="flex items-center gap-4">
                  {[1, 2, 4, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, householdSize: num })}
                      className={`w-12 h-12 rounded-xl border font-bold text-sm transition-all ${
                        formData.householdSize === num
                          ? 'border-brand bg-brand text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {num === 10 ? '10+' : num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-soft">
                  Determines required water supply ({formData.householdSize * 9} liters) and survival ration calculations.
                </p>
              </div>
            )}

            {/* Question 4: Assistance Needs (Multi-select) */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  4. Does anyone in your household need additional assistance?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Children',
                    'Elderly people',
                    'People with mobility limitations',
                    'No additional assistance required',
                  ].map((need) => {
                    const isSelected = formData.assistanceNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        type="button"
                        onClick={() => handleAssistanceToggle(need)}
                        className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                          isSelected
                            ? 'border-brand bg-teal-50/80 text-brand-dark ring-1 ring-brand'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{need}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-brand" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 5: Identified emergency contacts */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  5. Have you identified and written down emergency contacts?
                </h3>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {['Yes', 'No'].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasContacts: choice })}
                      className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                        formData.hasContacts === choice
                          ? 'border-brand bg-teal-50/80 text-brand-dark ring-1 ring-brand'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-soft">
                  Includes family members outside your immediate area, local police (112), and ambulance (108).
                </p>
              </div>
            )}

            {/* Question 6: Identified shelter */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  6. Have you identified a designated shelter or safe location?
                </h3>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {['Yes', 'No'].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasShelter: choice })}
                      className={`p-4 rounded-xl border text-center font-bold text-sm transition-all ${
                        formData.hasShelter === choice
                          ? 'border-brand bg-teal-50/80 text-brand-dark ring-1 ring-brand'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-ink-soft">
                  An elevated community centre, school, or municipal relief ground designated by the district.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-line">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn-outline text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-30"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
              >
                <span>{currentStep === 6 ? 'Generate My Plan' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Generated Plan View */
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
              <div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider block">
                  Customized Emergency Plan
                </span>
                <h3 className="text-xl font-black text-ink">
                  {formData.disasterType} Action Plan ({formData.householdSize} Persons)
                </h3>
              </div>

              {/* Functional Toolbar Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlanGenerated(false)}
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Modify questionnaire answers"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Answers</span>
                </button>
                <button
                  type="button"
                  onClick={handleSavePlan}
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 text-brand-dark"
                  title="Save plan to local storage"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Save My Plan</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadText}
                  className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Download clean plain text plan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Plan</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Plan</span>
                </button>
              </div>
            </div>

            {/* Saved Notification Toast */}
            {savedFeedback && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{savedFeedback}</span>
              </div>
            )}

            {/* Plan Body Sections */}
            <div className="space-y-5 text-xs text-ink leading-relaxed">
              {/* Profile summary chips */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Terrain: <strong>{formData.areaType}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                  Household: <strong>{formData.householdSize} Members</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Assistance: <strong>{formData.assistanceNeeds.join(', ')}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Water Target: <strong>{formData.householdSize * 9} Liters (72 Hours)</strong>
                </span>
              </div>

              {/* Critical Reminders (If user answered "No") */}
              {(formData.hasContacts === 'No' || formData.hasShelter === 'No') && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Action Items Identified from Your Answers:</span>
                  </div>
                  <ul className="space-y-1.5 pl-6 list-disc text-amber-950 font-medium">
                    {formData.hasContacts === 'No' && (
                      <li>
                        <strong>Save Emergency Contacts:</strong> You answered that contacts are not yet recorded. Print or handwrite family numbers, 112 (National Emergency), and 1077 (District Disaster Control) onto a paper card today.
                      </li>
                    )}
                    {formData.hasShelter === 'No' && (
                      <li>
                        <strong>Identify Designated Shelter:</strong> You indicated no shelter is selected yet. Scroll down to Section 5 (Shelter Finder) to pinpoint the nearest verified high-ground relief shelter.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Phase 1: Before an Emergency */}
              <div className="p-4 rounded-xl bg-surface border border-line space-y-2">
                <h4 className="text-sm font-extrabold text-brand-dark flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand" />
                  <span>Phase 1: Before an Emergency (Preparation)</span>
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                  <li>Store a minimum of {formData.householdSize * 9} liters of sealed drinking water (3L/person/day for 3 days).</li>
                  <li>Prepare high-calorie non-perishable rations (energy bars, roasted gram, dry fruits) requiring no stove fuel.</li>
                  <li>Secure family identity documents (Aadhaar, property deeds, bank passbooks) inside a waterproof zip pouch.</li>
                  {formData.areaType === 'Mountainous' && (
                    <li>Inspect exterior retaining walls for diagonal fissures after rainfall; clear boundary culverts of rock silt.</li>
                  )}
                  {formData.disasterType === 'Flood' && (
                    <li>Elevate electric appliances and power strips at least 1 foot above expected floor water level.</li>
                  )}
                  {formData.disasterType === 'Earthquake' && (
                    <li>Anchor heavy wardrobes, almirahs, and televisions to masonry studs; remove heavy wall hangings over beds.</li>
                  )}
                  {formData.assistanceNeeds.includes('Children') && (
                    <li>Pack baby formula, feeding bottles, diapers, comfort toys, and child oral rehydration sachets in go-bag.</li>
                  )}
                  {formData.assistanceNeeds.includes('Elderly people') && (
                    <li>Organize a 14-day supply of daily prescription medications (BP, diabetes, cardiac) with printed doctor notes.</li>
                  )}
                  {formData.assistanceNeeds.includes('People with mobility limitations') && (
                    <li>Verify step-free wheelchair or walker exit paths and designate an agile neighbour as secondary evacuation buddy.</li>
                  )}
                </ul>
              </div>

              {/* Phase 2: During an Emergency */}
              <div className="p-4 rounded-xl bg-red-50/60 border border-red-100 space-y-2">
                <h4 className="text-sm font-extrabold text-sos flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-sos" />
                  <span>Phase 2: During an Emergency (Survival Protocol)</span>
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-800">
                  {formData.disasterType === 'Flood' || formData.disasterType === 'Cloudburst' ? (
                    <>
                      <li>Move immediately to the highest accessible floor or roof terrace. Never walk or drive into moving water.</li>
                      <li>Shut off main electricity circuit breaker and LPG cylinder regulators before water touches electrical sockets.</li>
                      <li>Use a broom handle or stick to probe submerged ground for missing drain covers if forced to wade.</li>
                    </>
                  ) : formData.disasterType === 'Earthquake' ? (
                    <>
                      <li>Drop, Cover, and Hold On under heavy wooden furniture. Protect skull and neck with arms.</li>
                      <li>Stay indoors away from exterior glass until ground shaking halts. Never use elevators.</li>
                    </>
                  ) : formData.disasterType === 'Landslide' ? (
                    <>
                      <li>Move uphill and perpendicularly away from the gully slide funnel toward solid bedrock ridges.</li>
                      <li>Do not stand on fresh slide scree; watch out for tumbling boulders.</li>
                    </>
                  ) : formData.disasterType === 'Heatwave' ? (
                    <>
                      <li>Stay inside shaded, well-ventilated areas between 12 PM - 4 PM.</li>
                      <li>Drink salted lemon water or ORS every 30 minutes; sponge skin with damp cloth if feeling dizzy.</li>
                    </>
                  ) : (
                    <>
                      <li>Stay calm, protect your respiratory system, and listen to official civil defense radio alerts.</li>
                      <li>Evacuate early if official red alerts are broadcast; do not wait until escape routes flood.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Phase 3: After an Emergency */}
              <div className="p-4 rounded-xl bg-surface border border-line space-y-2">
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Home className="w-4 h-4 text-slate-600" />
                  <span>Phase 3: After an Emergency (Safe Recovery)</span>
                </h4>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-700">
                  <li>Boil drinking water vigorously for 10 minutes or use water purification chlorine tablets before consumption.</li>
                  <li>Do not touch damp electrical appliances or turn on mains power until verified dry by a certified technician.</li>
                  <li>Send short SMS messages to family to reduce network congestion and keep voice channels free for 112/108 dispatch.</li>
                  <li>Watch for secondary hazards: aftershocks following earthquakes, or secondary mudslides following rainfall.</li>
                </ul>
              </div>
            </div>

            {/* Recommended Drill Card */}
            <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-white p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand block">
                    Recommended Practice
                  </span>
                  <span className="text-sm font-bold text-ink">
                    Test this plan in the {formData.disasterType} Mock Drill Simulator
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartRecommendedDrill && onStartRecommendedDrill(getRecommendedDrillId())}
                className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
              >
                Start Recommended Drill
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-ink-soft border-t border-line pt-3 text-center sm:text-left">
              * Official Disclaimer: This action plan is generated from civil defense guidelines to aid personal preparedness. It does not replace official evacuation orders, disaster curfew notices, or directions issued by police and NDRF personnel.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
