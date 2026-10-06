import { useState } from 'react';
import Badge from '../common/Badge';
import { reportMissingPerson } from '../../services/melaService';
import { useLanguage } from '../../context/LanguageContext';

export default function MissingPersonForm({ onReportCreated }) {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [lastSeen, setLastSeen] = useState('');
  const [clothing, setClothing] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [createdCase, setCreatedCase] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !age || !lastSeen.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया नाम, आयु और अंतिम स्थान भरें।' : 'Please enter Name, Age, and Last Seen Location.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        age: Number(age),
        gender,
        lastSeenLocation: lastSeen.trim(),
        clothing: clothing.trim() || (lang === 'hi' ? 'सामान्य परिधान' : 'Standard attire'),
        contactPhone: contactPhone.trim() || '+91 98765 43210',
        reportedBy: lang === 'hi' ? 'परिजनों द्वारा रिपोर्ट' : 'Family Member',
      };

      const res = await reportMissingPerson(payload);
      const caseData = res?.data || res;
      setCreatedCase(caseData);
      onReportCreated?.(caseData);

      // Clear form for next entry
      setName('');
      setAge('');
      setLastSeen('');
      setClothing('');
      setContactPhone('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📢</span>
          <span>{t('mela.reportMissingTitle')}</span>
        </h3>
        <span className="text-[11px] font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-full dark:text-rose-400">
          MongoDB Live Broadcast
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('mela.name')} *
          </label>
          <input
            type="text"
            required
            placeholder={lang === 'hi' ? 'उदा. सीता देवी' : 'e.g. Sita Devi'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('mela.age')} *
            </label>
            <input
              type="number"
              required
              min="1"
              max="120"
              placeholder="65"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'hi' ? 'लिंग' : 'Gender'}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('mela.lastSeen')} *
          </label>
          <input
            type="text"
            required
            placeholder={lang === 'hi' ? 'उदा. संगम घाट 3, अक्षयवट के पास' : 'e.g. Sangam Gate 3, near Akshayavat'}
            value={lastSeen}
            onChange={(e) => setLastSeen(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'hi' ? 'कपड़े / पहचान' : 'Clothing / Marks'}
            </label>
            <input
              type="text"
              placeholder={lang === 'hi' ? 'उदा. पीली साड़ी, लाल किनारा' : 'e.g. Yellow Saree, Red border'}
              value={clothing}
              onChange={(e) => setClothing(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {lang === 'hi' ? 'संपर्क मोबाइल' : 'Contact Phone'}
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-sos w-full font-black py-2.5 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-105 active:scale-98"
        >
          {submitting ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{lang === 'hi' ? 'MongoDB में सेव हो रहा है...' : 'Saving to MongoDB Atlas...'}</span>
            </>
          ) : (
            <>
              <span>🚨</span>
              <span>{t('mela.createReport')}</span>
            </>
          )}
        </button>
      </form>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal italic">
        🔒 {t('mela.privacyNote')}
      </p>

      {/* Case created confirmation alert */}
      {createdCase && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs space-y-1.5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 text-sm">
              ✅ {createdCase.caseId}
            </span>
            <Badge type="high">{createdCase.status || (lang === 'hi' ? 'लापता' : 'Missing')}</Badge>
          </div>
          <p className="font-bold text-slate-900 dark:text-white">
            {lang === 'hi'
              ? `${createdCase.name} (${createdCase.age} वर्ष) की रिपोर्ट MongoDB Atlas में सुरक्षित दर्ज हो गई है।`
              : `Report for ${createdCase.name} (${createdCase.age} yrs) successfully saved to MongoDB Atlas.`}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'स्थान:' : 'Location:'} {createdCase.lastSeenLocation} · {createdCase.nearestHelpDesk || 'Gate 3 Help Desk'}
          </p>
        </div>
      )}
    </div>
  );
}
