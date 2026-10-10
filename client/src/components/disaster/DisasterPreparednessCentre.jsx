import { useState, useEffect } from 'react';
import {
  Waves,
  Mountain,
  CloudLightning,
  Sun,
  Activity,
  CheckCircle2,
  Circle,
  ShieldCheck,
  X,
  ArrowRight,
  Info,
  Award,
  Sparkles,
} from 'lucide-react';
import { DISASTER_SAFETY_PLANS, CORE_PREPAREDNESS_TASKS } from '../../data/disasterSafetyData';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Waves,
  Mountain,
  CloudLightning,
  Sun,
  Activity,
};

const STORAGE_KEY_CHECKLIST = 'ss_disaster_checklist';
const STORAGE_KEY_CORE = 'ss_core_preparedness';

export default function DisasterPreparednessCentre({ onStartDrill }) {
  const { lang } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('before'); // 'before' | 'during' | 'after' | 'checklist'
  const [completedChecklist, setCompletedChecklist] = useState({});
  const [completedCoreTasks, setCompletedCoreTasks] = useState({});

  // Load persisted progress from localStorage
  useEffect(() => {
    try {
      const savedChecks = JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKLIST) || '{}');
      const savedCore = JSON.parse(localStorage.getItem(STORAGE_KEY_CORE) || '{}');
      setCompletedChecklist(savedChecks);
      setCompletedCoreTasks(savedCore);
    } catch {
      // ignore
    }
  }, []);

  // Save progress on change
  const togglePlanCheck = (checkId) => {
    setCompletedChecklist((prev) => {
      const updated = { ...prev, [checkId]: !prev[checkId] };
      try {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  };

  const toggleCoreTask = (taskId) => {
    setCompletedCoreTasks((prev) => {
      const updated = { ...prev, [taskId]: !prev[taskId] };
      try {
        localStorage.setItem(STORAGE_KEY_CORE, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
    });
  };

  // Calculate dynamic core preparedness score
  const completedCoreCount = CORE_PREPAREDNESS_TASKS.filter((t) => !!completedCoreTasks[t.id]).length;
  const preparednessScore = Math.round((completedCoreCount / CORE_PREPAREDNESS_TASKS.length) * 100);

  return (
    <section id="safety-centre" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Lifesaving Protocols</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Disaster Preparedness &amp; Safety Centre
          </h2>
          <p className="text-sm text-ink-soft max-w-2xl mt-1 leading-relaxed">
            Learn how to prepare, stay safe, and recover from emergencies with verified civil defense guidance.
          </p>
        </div>

        {/* Dynamic Preparedness Score Widget */}
        <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-sm flex items-center gap-4 shrink-0 sm:min-w-[260px]">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={preparednessScore >= 80 ? 'text-emerald-500' : preparednessScore >= 40 ? 'text-brand' : 'text-amber-500'}
                strokeDasharray={`${preparednessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-ink">{preparednessScore}%</span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
              My Preparedness
            </span>
            <span className="text-sm font-extrabold text-brand-dark">
              {completedCoreCount} of {CORE_PREPAREDNESS_TASKS.length} tasks ready
            </span>
            <span className="text-[10px] text-ink-soft block">
              {preparednessScore === 100 ? 'Exceptional Readiness' : preparednessScore >= 60 ? 'Moderate Readiness' : 'Needs Preparation'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Core Preparedness Checklist Quick Bar */}
      <div className="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50/70 via-emerald-50/50 to-white p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand" />
            <h3 className="text-sm font-bold text-ink">
              Household Preparedness Baseline Checklist
            </h3>
          </div>
          <span className="text-xs text-ink-soft">
            Click tasks as you complete them to increase your readiness score
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {CORE_PREPAREDNESS_TASKS.map((task) => {
            const isDone = !!completedCoreTasks[task.id];
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => toggleCoreTask(task.id)}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-50/80 text-emerald-950 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-brand/40 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <span className={`text-xs font-bold block ${isDone ? 'line-through text-emerald-800' : 'text-ink'}`}>
                    {lang === 'hi' ? task.titleHi : task.title}
                  </span>
                  <span className="text-[10px] text-ink-soft block line-clamp-2 leading-tight">
                    {task.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-ink-soft border-t border-teal-100/60">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand" />
            <span>Note: This score tracks household task readiness and does not predict survival or guarantee zero risk.</span>
          </span>
          <span className="font-semibold text-brand-dark">
            Progress auto-saved locally
          </span>
        </div>
      </div>

      {/* 5 Disaster Preparedness Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DISASTER_SAFETY_PLANS.map((plan) => {
          const IconComp = ICON_MAP[plan.icon] || ShieldCheck;
          const completedCount = plan.checklist.filter((item) => !!completedChecklist[item.id]).length;

          return (
            <div
              key={plan.id}
              className="card bg-white p-5 flex flex-col justify-between hover:border-brand/50 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${plan.accentColor}18`, color: plan.accentColor }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${plan.tagColor}`}>
                    {lang === 'hi' ? plan.categoryHi : plan.category}
                  </span>
                </div>

                {/* Title and Short Description */}
                <div>
                  <h3 className="text-lg font-bold text-ink group-hover:text-brand-dark transition-colors">
                    {lang === 'hi' ? plan.titleHi : plan.title}
                  </h3>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    {lang === 'hi' ? plan.shortDescHi : plan.shortDesc}
                  </p>
                </div>

                {/* Checklist status indicator */}
                <div className="rounded-xl bg-surface p-2.5 flex items-center justify-between text-xs border border-line/60">
                  <span className="text-ink-soft font-medium">Safety Checklist:</span>
                  <span className="font-bold text-ink">
                    {completedCount} / {plan.checklist.length} done
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2 border-t border-line/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setActiveTab('before');
                  }}
                  className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-2"
                >
                  <span>View Safety Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Polished Safety Plan Detail Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-line flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedPlan.accentColor}20`, color: selectedPlan.accentColor }}
                >
                  {(() => {
                    const IconComp = ICON_MAP[selectedPlan.icon] || ShieldCheck;
                    return <IconComp className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-ink">
                      {lang === 'hi' ? selectedPlan.titleHi : selectedPlan.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedPlan.tagColor}`}>
                      {selectedPlan.category}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft">Official NDMA &amp; SDMA Action Guide</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-full p-2 text-ink-soft hover:bg-slate-100 hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section Navigation Tabs (A. Before | B. During | C. After | D. Checklist) */}
            <div className="flex border-b border-line px-5 bg-white overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('before')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'before'
                    ? 'border-brand text-brand'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                A. Before the Disaster
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('during')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'during'
                    ? 'border-sos text-sos'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                B. During the Disaster
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('after')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'after'
                    ? 'border-slate-700 text-slate-800'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                C. After the Disaster
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'checklist'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                <span>D. Emergency Checklist</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-black">
                  {selectedPlan.checklist.filter((i) => !!completedChecklist[i.id]).length}/{selectedPlan.checklist.length}
                </span>
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'before' && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-teal-50/60 border border-teal-100 p-3 text-xs text-brand-dark flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand shrink-0" />
                    <span>Preparation before an event saves lives. Review these steps with your entire household.</span>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedPlan.before.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-ink leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-brand-dark font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'during' && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-red-50/70 border border-red-100 p-3 text-xs text-sos-dark flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sos shrink-0" />
                    <span>Immediate survival phase. Do not panic; prioritize life safety over material possessions.</span>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedPlan.during.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-ink leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-sos-dark font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'after' && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 text-xs text-slate-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Recovery and hazard assessment phase. Beware of secondary hazards like gas leaks or unstable structures.</span>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedPlan.after.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-ink leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'checklist' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>Check tasks as you prepare them in your home:</span>
                    <span className="font-bold text-brand-dark">
                      Auto-persists in your browser
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedPlan.checklist.map((item) => {
                      const isChecked = !!completedChecklist[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => togglePlanCheck(item.id)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-white border-line hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={`text-xs font-semibold leading-relaxed ${isChecked ? 'line-through text-emerald-800' : 'text-ink'}`}>
                            {item.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Drill recommendation */}
            <div className="p-4 border-t border-line bg-surface/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-ink-soft">
                Sources: National Disaster Management Authority (NDMA) &amp; IMD Guidelines
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {onStartDrill && (
                  <button
                    type="button"
                    onClick={() => {
                      const drillId = selectedPlan.id === 'flood' ? 'flash-flood' : selectedPlan.id;
                      setSelectedPlan(null);
                      onStartDrill(drillId);
                    }}
                    className="btn-outline text-xs py-2 w-full sm:w-auto"
                  >
                    Test in Mock Drill
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="btn-primary text-xs py-2 w-full sm:w-auto"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
