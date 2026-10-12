import { useState, useEffect } from 'react';
import Badge from '../components/common/Badge';
import { useAuth, ROLES } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_PROFILE = {
  candidateId: 'SS-CAD-2026-94812',
  name: 'Ramesh Kumar',
  phone: '+91 98765 43210',
  email: 'ramesh.kumar@sevasaarthi.in',
  location: 'Prayagraj, Uttar Pradesh',
  roleTitle: 'Community First Responder & Citizen',
  bloodGroup: 'O+',
  allergies: 'Penicillin, Dust Mites',
  conditions: 'Mild Hypertension (Managed)',
  emergencyContact: 'Sunita Kumar (Spouse)',
  emergencyPhone: '+91 98765 43219',
  organDonor: true,
  aadhaarMasked: 'XXXX-XXXX-4819',
  isAadhaarVerified: true,
  policeVerified: true,
  photoUrl: '',
};

export default function ProfilePage() {
  const { lang, t } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);

  const { user, role, loginAs } = useAuth();

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_candidate_profile');
      if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    } catch {
      /* ignore */
    }
    return DEFAULT_PROFILE;
  });

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.name && (!formData.name || formData.name === 'Ramesh Kumar')) {
      setFormData((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('ss_candidate_profile', JSON.stringify(formData));
    } catch {
      /* ignore */
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...formData, photoUrl: reader.result };
      setFormData(updated);
      try {
        localStorage.setItem('ss_candidate_profile', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(formData.candidateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="container-page py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-500/15 text-lg shadow-2xs">
              👤
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {tx('Candidate & Citizen Emergency Profile', 'कैंडिडेट एवं नागरिक इमरजेंसी प्रोफ़ाइल')}
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {tx(
              'Unified civic identity, emergency medical health card, and volunteer response records.',
              'एकीकृत नागरिक पहचान, इमरजेंसी स्वास्थ्य कार्ड एवं स्वयंसेवक सेवा रिकॉर्ड।'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            ID: {formData.candidateId}
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            className="rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition"
          >
            {copied ? tx('✓ Copied', '✓ कॉपी हुआ') : tx('Copy ID', 'कॉपी ID')}
          </button>
        </div>
      </div>

      {/* Active Development / Coming Soon Notice Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/20 p-5 shadow-sm dark:border-amber-600/60 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-2xl shadow-2xs">
            🚧
          </span>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-sm font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                {tx('Candidate Profile · Currently Working on This Feature', 'कैंडिडेट प्रोफ़ाइल · इस फीचर पर कार्य प्रगति पर है')}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-2xs animate-pulse">
                <span>⚡</span>
                <span>{tx('Coming Soon', 'जल्द आ रहा है')}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950/90 dark:text-amber-200/90 leading-relaxed font-medium">
              {hi ? (
                <>
                  हम वर्तमान में <strong>कैंडिडेट और नागरिक प्रोफाइल</strong> को और अधिक परिष्कृत (polish) करने पर काम कर रहे हैं।
                  प्रत्येक नागरिक, स्वयंसेवक और उम्मीदवार का एक संपूर्ण डिजिटल कार्ड होगा जिसमें उनका <strong>सत्यापित आधार, इमरजेंसी स्वास्थ्य कार्ड, विशेषज्ञता व लाइव सेवा इतिहास</strong> एक ही जगह सुरक्षित रहेगा।
                </>
              ) : (
                <>
                  We are actively polishing this unified <strong>Candidate & Citizen Profile</strong> feature!
                  Every individual will have this dedicated digital profile where verified Aadhaar, emergency health records, volunteer badges, and live rescue dispatches display seamlessly.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Role Preview Switcher Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {tx('Candidate Role Preview Mode', 'कैंडिडेट रोल पूर्वावलोकन')}
          </span>
          <span className="text-sm font-black text-teal-700 dark:text-teal-400 capitalize">
            {role || 'Citizen'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => loginAs(r)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
                role === r
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form + Card Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left: Emergency Health Card Form */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🩺</span>
              <span>{tx('Emergency Health Card & Personal Details', 'इमरजेंसी हेल्थ कार्ड एवं व्यक्तिगत विवरण')}</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {tx('Triage Ready', 'प्राथमिक उपचार हेतु तैयार')}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Photo & Name Row */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-750">
              <div className="relative shrink-0">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-teal-500"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-2xl font-black text-white">
                    {formData.name?.charAt(0) || 'U'}
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700">
                  <span className="text-[10px]">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {tx('Profile Photo & ID Picture', 'प्रोफ़ाइल फ़ोटो एवं ID चित्र')}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {tx('Upload a clear face photo for immediate recognition in emergencies.', 'इमरजेंसी में तुरंत पहचान के लिए स्पष्ट फ़ोटो अपलोड करें।')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Full Name', 'पूरा नाम')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Mobile Contact Phone', 'मोबाइल संपर्क नंबर')}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Blood Group', 'ब्लड ग्रुप')}
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Location / City', 'स्थान / शहर')}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Known Allergies', 'ज्ञात एलर्जी')}
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Pre-existing Health Conditions', 'चिकित्सा स्थिति')}
                </label>
                <input
                  type="text"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Primary Emergency Guardian', 'प्राथमिक इमरजेंसी अभिभावक')}
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {tx('Guardian Phone Number', 'अभिभावक फ़ोन नंबर')}
                </label>
                <input
                  type="text"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-teal-600 px-6 py-3 text-sm font-black text-white shadow-md hover:bg-teal-700 transition"
              >
                {saved ? tx('✓ Saved Successfully', '✓ सफलतापूर्वक सुरक्षित हुआ') : tx('Save Emergency Profile', 'इमरजेंसी प्रोफ़ाइल सुरक्षित करें')}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Digital Badge Card & Live Dispatches */}
        <div className="space-y-6 lg:col-span-5">
          {/* Live ID Card Preview */}
          <div className="rounded-3xl border border-teal-300/80 dark:border-teal-800 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/15 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-teal-200/80 dark:border-teal-850 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300">
                {tx('Official Civic ID Preview', 'नागरिक पहचान पत्र पूर्वावलोकन')}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                {tx('Active', 'सक्रिय')}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-teal-500"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-xl font-black text-white">
                  {formData.name?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {formData.name}
                </h3>
                <p className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {formData.roleTitle}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formData.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block uppercase">
                  {tx('Blood Group', 'ब्लड ग्रुप')}
                </span>
                <span className="text-lg font-black text-rose-700 dark:text-rose-300">
                  {formData.bloodGroup}
                </span>
              </div>

              <div className="rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  {tx('Aadhaar Status', 'आधार स्थिति')}
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
                  {tx('Verified 🛡️', 'सत्यापित 🛡️')}
                </span>
              </div>
            </div>
          </div>

          {/* Activity & Ticket History */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              {tx('Active Requests & Saved Tickets', 'सक्रिय अनुरोध एवं सुरक्षित टिकट')}
            </h2>

            <div className="space-y-2.5">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    SS-EMG-2026-50401
                  </span>
                  <Badge type="high">Medical</Badge>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Emergency ambulance triage
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  District Government Hospital · Dispatched
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                    BK-849201
                  </span>
                  <Badge type="verified">Confirmed</Badge>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Teleconsult with Dr. A. Sharma
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Today 4:30 PM · Video Room Link Ready
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    SS-DEL-2026-000231
                  </span>
                  <Badge type="official">In Transit</Badge>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Paracetamol generic order
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Volunteer A. Singh · ETA 35 min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
