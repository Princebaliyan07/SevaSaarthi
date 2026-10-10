import { useState, useEffect } from 'react';
import {
  Waves,
  Activity,
  Mountain,
  CloudLightning,
  Sun,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  RotateCcw,
  ListFilter,
  ArrowRight,
  Award,
  AlertTriangle,
  Lightbulb,
  Check,
} from 'lucide-react';
import { DRILL_SCENARIOS } from '../../data/mockDrillData';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Waves,
  Activity,
  Mountain,
  CloudLightning,
  Sun,
  Users,
};

const STORAGE_KEY_DRILLS = 'ss_mock_drill_history';

export default function MockDrillSimulator({ defaultDrillId = null }) {
  const { lang } = useLanguage();
  const [selectedDrillId, setSelectedDrillId] = useState(defaultDrillId || DRILL_SCENARIOS[0].id);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedIndex }
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [savedHistory, setSavedHistory] = useState({});

  // Sync external request (e.g. from Action Plan or Safety Centre)
  useEffect(() => {
    if (defaultDrillId) {
      const found = DRILL_SCENARIOS.find((d) => d.id === defaultDrillId);
      if (found) {
        setSelectedDrillId(defaultDrillId);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setDrillCompleted(false);
      }
    }
  }, [defaultDrillId]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEY_DRILLS) || '{}');
      setSavedHistory(history);
    } catch {
      // ignore
    }
  }, []);

  const activeDrill = DRILL_SCENARIOS.find((d) => d.id === selectedDrillId) || DRILL_SCENARIOS[0];
  const questions = activeDrill.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion?.id];
  const hasAnsweredCurrent = selectedAnswer !== undefined;

  const handleSelectOption = (index) => {
    if (hasAnsweredCurrent) return; // Prevent changing answer after reveal
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: index,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishDrill();
    }
  };

  const finishDrill = () => {
    // Calculate final score
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);
    const updatedHistory = {
      ...savedHistory,
      [activeDrill.id]: {
        score: correctCount,
        total: questions.length,
        percentage: scorePercent,
        completedAt: new Date().toISOString(),
      },
    };

    setSavedHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY_DRILLS, JSON.stringify(updatedHistory));
    } catch {
      // ignore
    }

    setDrillCompleted(true);
  };

  const handleRetryDrill = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setDrillCompleted(false);
  };

  const handleSwitchDrill = (drillId) => {
    setSelectedDrillId(drillId);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setDrillCompleted(false);
  };

  // Calculations for results view
  const correctCount = questions.filter((q) => userAnswers[q.id] === q.correctIndex).length;
  const incorrectCount = questions.length - correctCount;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const incorrectQuestions = questions.filter((q) => userAnswers[q.id] !== q.correctIndex);

  const DrillIcon = ICON_MAP[activeDrill.icon] || HelpCircle;

  return (
    <section id="mock-drills" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Interactive Simulator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
          Practice Before Disaster Strikes
        </h2>
        <p className="text-sm text-ink-soft max-w-2xl mt-1 leading-relaxed">
          Test your decisions in realistic emergency situations. Every answer explains why it is safe or hazardous.
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {DRILL_SCENARIOS.map((drill) => {
          const IconComp = ICON_MAP[drill.icon] || HelpCircle;
          const isCurrent = drill.id === activeDrill.id;
          const pastScore = savedHistory[drill.id];

          return (
            <button
              key={drill.id}
              type="button"
              onClick={() => handleSwitchDrill(drill.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                isCurrent
                  ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-brand/40 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{lang === 'hi' ? drill.titleHi : drill.title}</span>
              {pastScore && !isCurrent && (
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-slate-100 text-brand-dark">
                  {pastScore.percentage}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Drill Card Container */}
      <div className="card bg-white p-5 sm:p-7 space-y-6 border border-slate-200">
        {!drillCompleted ? (
          <>
            {/* Scenario Intro Bar */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                  <DrillIcon className="w-6 h-6 text-brand-light" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {lang === 'hi' ? activeDrill.titleHi : activeDrill.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-light/20 text-brand-light border border-brand-light/30">
                      {activeDrill.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
                    {activeDrill.intro}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block">
                  Question
                </span>
                <span className="text-lg font-black text-white">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${((currentQuestionIndex + (hasAnsweredCurrent ? 1 : 0.5)) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Current Scenario & Question Box */}
            <div className="space-y-4">
              {/* Question Context Narrative */}
              <div className="rounded-xl bg-surface p-4 border border-line text-xs font-medium text-slate-700 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-ink block mb-0.5">Emergency Context:</span>
                  <span>{currentQuestion.scenario}</span>
                </div>
              </div>

              {/* Main Question Heading */}
              <h3 className="text-base sm:text-lg font-extrabold text-ink">
                {currentQuestion.question}
              </h3>

              {/* 3 or 4 Selectable Action Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let style = 'border-slate-200 bg-white hover:border-brand/40 hover:bg-slate-50 text-slate-800';
                  let icon = <span className="w-5 h-5 rounded-full border border-slate-300 text-[11px] font-bold text-slate-500 flex items-center justify-center shrink-0">{String.fromCharCode(65 + idx)}</span>;

                  if (hasAnsweredCurrent) {
                    if (isCorrect) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500';
                      icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
                    } else if (isSelected) {
                      style = 'border-red-400 bg-red-50 text-red-950 ring-1 ring-red-400';
                      icon = <XCircle className="w-5 h-5 text-sos shrink-0" />;
                    } else {
                      style = 'border-slate-200 bg-slate-50/60 opacity-60 text-slate-600';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredCurrent}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all ${style}`}
                    >
                      {icon}
                      <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Explanation Drawer (Revealed after selection) */}
            {hasAnsweredCurrent && (
              <div
                className={`p-4 rounded-xl border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-red-50/70 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQuestion.correctIndex ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                        Safe Decision! Correct Action
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-sos shrink-0" />
                      <span className="text-xs font-black uppercase tracking-wider text-sos-dark">
                        Hazardous Choice! Why this is dangerous
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs font-medium leading-relaxed">
                  {selectedAnswer === currentQuestion.correctIndex
                    ? currentQuestion.explanation
                    : currentQuestion.unsafeReason}
                </p>

                {/* Practical Safety Tip */}
                <div className="rounded-lg bg-white/80 p-2.5 border border-black/5 flex items-start gap-2 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-semibold text-slate-800">
                    Safety Rule: {currentQuestion.safetyTip}
                  </span>
                </div>

                {/* Next Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn-primary text-xs py-2 px-5 flex items-center gap-2"
                  >
                    <span>
                      {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Final Results'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Drill Results Screen */
          <div className="space-y-6 py-2">
            <div className="text-center space-y-3 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto text-brand">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Drill Completed
                </span>
                <h3 className="text-2xl font-black text-ink mt-0.5">
                  {activeDrill.title} Results
                </h3>
              </div>

              {/* Performance Score */}
              <div className="rounded-2xl bg-surface border border-line p-5">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black text-brand-dark">{percentage}%</span>
                  <span className="text-xs font-bold text-ink-soft">
                    ({correctCount} of {questions.length} correct)
                  </span>
                </div>

                <p className="text-xs font-semibold text-ink-soft mt-2">
                  {percentage === 100
                    ? 'Exceptional situational awareness! You demonstrate solid disaster instincts.'
                    : percentage >= 60
                    ? 'Good response! A few critical safety instincts need review below.'
                    : 'Emergency actions require practice. Carefully review the recommendations below.'}
                </p>
              </div>
            </div>

            {/* Detailed Correct / Incorrect Breakdown */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-center text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                <span className="block text-xl font-black text-emerald-700">{correctCount}</span>
                <span>Safe Actions</span>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 font-bold">
                <span className="block text-xl font-black text-sos">{incorrectCount}</span>
                <span>Hazardous Decisions</span>
              </div>
            </div>

            {/* Personalized Recommendations based on errors */}
            {incorrectQuestions.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                    Personalized Recommendations for Your Mistakes
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {incorrectQuestions.map((iq) => (
                    <div key={iq.id} className="rounded-xl bg-white p-3.5 border border-amber-100 text-xs space-y-1">
                      <span className="font-bold text-ink block">{iq.question}</span>
                      <p className="text-slate-600 font-medium">
                        <span className="font-bold text-emerald-700">Recommended Action: </span>
                        {iq.options[iq.correctIndex]}
                      </p>
                      <p className="text-[11px] text-amber-800 font-semibold pt-1 border-t border-slate-100">
                        Rule: {iq.safetyTip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Retry Drill & Choose Another Drill */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={handleRetryDrill}
                className="btn-outline w-full sm:w-auto text-xs py-2.5 px-5 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Drill</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextIndex = (DRILL_SCENARIOS.findIndex((d) => d.id === activeDrill.id) + 1) % DRILL_SCENARIOS.length;
                  handleSwitchDrill(DRILL_SCENARIOS[nextIndex].id);
                }}
                className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6 flex items-center justify-center gap-2"
              >
                <ListFilter className="w-4 h-4" />
                <span>Choose Another Drill</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
