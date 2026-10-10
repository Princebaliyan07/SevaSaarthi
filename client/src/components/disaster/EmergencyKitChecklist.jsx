import { useState, useEffect } from 'react';
import {
  Package,
  Waves,
  Activity,
  Sun,
  CheckCircle2,
  Circle,
  RotateCcw,
  Calendar,
  BellRing,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  BookmarkCheck,
} from 'lucide-react';
import { EMERGENCY_KIT_CATEGORIES } from '../../data/emergencyKitData';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP = {
  Package,
  Waves,
  Activity,
  Sun,
};

const STORAGE_KEY_KIT = 'ss_emergency_kit_checks';
const STORAGE_KEY_REVIEW = 'ss_kit_last_reviewed';
const STORAGE_KEY_REMINDER = 'ss_kit_reminder_days';

export default function EmergencyKitChecklist() {
  const { lang } = useLanguage();

  const [activeCategoryId, setActiveCategoryId] = useState('general');
  const [checkedItems, setCheckedItems] = useState({});
  const [lastReviewedDate, setLastReviewedDate] = useState(null);
  const [reminderActive, setReminderActive] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedChecks = JSON.parse(localStorage.getItem(STORAGE_KEY_KIT) || '{}');
      const savedReview = localStorage.getItem(STORAGE_KEY_REVIEW);
      const savedReminder = localStorage.getItem(STORAGE_KEY_REMINDER);

      setCheckedItems(savedChecks);
      if (savedReview) {
        setLastReviewedDate(new Date(savedReview));
      } else {
        // Default to today
        const now = new Date();
        setLastReviewedDate(now);
        localStorage.setItem(STORAGE_KEY_REVIEW, now.toISOString());
      }
      setReminderActive(savedReminder === 'true');
    } catch {
      // ignore
    }
  }, []);

  // Save checks whenever they change
  const toggleItem = (itemId) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem(STORAGE_KEY_KIT, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleMarkReviewedToday = () => {
    const now = new Date();
    setLastReviewedDate(now);
    try {
      localStorage.setItem(STORAGE_KEY_REVIEW, now.toISOString());
    } catch {
      // ignore
    }
    setSaveToast('Marked as reviewed today!');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleToggleReminder = () => {
    const nextVal = !reminderActive;
    setReminderActive(nextVal);
    try {
      localStorage.setItem(STORAGE_KEY_REMINDER, String(nextVal));
    } catch {
      // ignore
    }
    setSaveToast(nextVal ? 'Periodic 30-day review reminder scheduled!' : 'Reminder disabled.');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleConfirmReset = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(STORAGE_KEY_KIT);
    } catch {
      // ignore
    }
    setShowResetModal(false);
    setSaveToast('Checklist successfully reset.');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const activeCategory =
    EMERGENCY_KIT_CATEGORIES.find((c) => c.id === activeCategoryId) || EMERGENCY_KIT_CATEGORIES[0];
  const totalItems = activeCategory.items.length;
  const completedItemsCount = activeCategory.items.filter((item) => !!checkedItems[item.id]).length;
  const percentage = Math.round((completedItemsCount / totalItems) * 100);

  // Overall readiness across ALL categories
  const allItems = EMERGENCY_KIT_CATEGORIES.flatMap((c) => c.items);
  const totalAllItems = allItems.length;
  const totalAllChecked = allItems.filter((i) => !!checkedItems[i.id]).length;
  const overallPercentage = Math.round((totalAllChecked / totalAllItems) * 100);

  const CatIcon = ICON_MAP[activeCategory.icon] || Package;

  return (
    <section id="emergency-kit" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 text-brand font-bold text-xs uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Survival Go-Bag</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
            Emergency Kit Readiness
          </h2>
          <p className="text-sm text-ink-soft max-w-2xl mt-1 leading-relaxed">
            Prepare essential supplies before an emergency occurs. Track your readiness across all disaster types.
          </p>
        </div>

        {/* Global Progress Indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4 shrink-0 sm:min-w-[240px]">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={overallPercentage >= 80 ? 'text-emerald-500' : 'text-brand'}
                strokeDasharray={`${overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-ink">{overallPercentage}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft block">
              Total Kit Readiness
            </span>
            <span className="text-sm font-extrabold text-ink">
              {totalAllChecked} of {totalAllItems} items packed
            </span>
            <span className="text-[10px] text-brand-dark font-semibold block">
              {overallPercentage === 100 ? 'Go-Bag Fully Ready' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {EMERGENCY_KIT_CATEGORIES.map((category) => {
          const IconComp = ICON_MAP[category.icon] || Package;
          const isSelected = category.id === activeCategoryId;
          const catChecked = category.items.filter((i) => !!checkedItems[i.id]).length;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategoryId(category.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-brand text-white border-brand shadow-sm shadow-brand/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-brand/40 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{lang === 'hi' ? category.nameHi : category.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-brand-dark'
                }`}
              >
                {catChecked}/{category.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Checklist Card */}
      <div className="card bg-white p-5 sm:p-7 space-y-6 border border-slate-200">
        {/* Category Description Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-surface p-4 border border-line">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-brand flex items-center justify-center shrink-0">
              <CatIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ink">
                {lang === 'hi' ? activeCategory.nameHi : activeCategory.name}
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">
                {lang === 'hi' ? activeCategory.descHi : activeCategory.desc}
              </p>
              <p className="text-[11px] font-semibold text-brand-dark mt-1">
                Tip: {activeCategory.recommendation}
              </p>
            </div>
          </div>

          {/* Category Progress Bar */}
          <div className="sm:text-right shrink-0 min-w-[140px] space-y-1">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-ink">
              <span>{completedItemsCount} of {totalItems} items</span>
              <span className="text-brand-dark">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Feedback toast if any */}
        {saveToast && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Interactive Items Checkboxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeCategory.items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-brand/40 hover:bg-slate-50'
                }`}
              >
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-extrabold leading-snug ${
                        isChecked ? 'line-through text-emerald-900' : 'text-ink'
                      }`}
                    >
                      {lang === 'hi' ? item.titleHi : item.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                      {item.quantity}
                    </span>
                  </div>

                  <p className="text-[11px] text-ink-soft leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer: Last Reviewed Date, Review Reminder & Reset Button */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          {/* Last reviewed */}
          <div className="flex items-center gap-2 text-ink-soft">
            <Calendar className="w-4 h-4 text-brand shrink-0" />
            <span>
              Last reviewed:{' '}
              <strong className="text-ink">
                {lastReviewedDate
                  ? lastReviewedDate.toLocaleDateString('en-IN', { dateStyle: 'medium' })
                  : 'Never'}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleMarkReviewedToday}
              className="text-brand hover:underline font-bold text-[11px] ml-1"
            >
              (Mark Today)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Optional 30-day reminder toggle */}
            <button
              type="button"
              onClick={handleToggleReminder}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition-all flex items-center gap-1.5 ${
                reminderActive
                  ? 'bg-teal-50 text-brand-dark border-teal-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Schedule periodic reminder"
            >
              <BellRing className="w-3.5 h-3.5 text-brand" />
              <span>{reminderActive ? 'Reminder Active (30d)' : 'Set 30d Reminder'}</span>
            </button>

            {/* Reset checklist */}
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="rounded-xl px-3 py-1.5 text-xs font-bold border border-slate-200 text-sos hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-sos flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-ink">Reset Emergency Kit?</h3>
                <p className="text-xs text-ink-soft">
                  Are you sure you want to uncheck all items? This will clear your saved progress.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="btn-outline text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="btn-sos text-xs py-2 px-4"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
