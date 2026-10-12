import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth, ROLES } from '../../context/AuthContext';

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

export default function CandidateProfileModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);

  const { user, role, loginAs } = useAuth();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ss_candidate_profile');
      if (saved) return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    } catch {
      /* ignore */
    }
    return DEFAULT_PROFILE;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync logged in user name if available
  useEffect(() => {
    if (user?.name && (!profile.name || profile.name === 'Ramesh Kumar')) {
      setProfile((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e?.preventDefault();
    try {
      localStorage.setItem('ss_candidate_profile', JSON.stringify(profile));
    } catch {
      /* ignore */
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyId = () => {
    try {
      navigator.clipboard.writeText(profile.candidateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, photoUrl: reader.result };
      setProfile(updated);
      try {
        localStorage.setItem('ss_candidate_profile', JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-profile-title"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/75 p-3 sm:p-5 backdrop-blur-md transition-all animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Line */}
        <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-5 sm:px-6 py-4 dark:border-slate-800 shrink-0 bg-slate-50/70 dark:bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-500/15 text-lg shadow-2xs">
              👤
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="candidate-profile-title"
                  className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white"
                >
                  {tx('Candidate & Citizen Profile', 'कैंडिडेट और नागरिक प्रोफ़ाइल')}
                </h2>
                <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-black text-teal-800 dark:text-teal-300">
                  {tx('Unified ID', 'एकीकृत पहचान')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {tx('Personal Emergency Identity Card & Civic Credentials', 'व्यक्तिगत इमरजेंसी पहचान पत्र एवं नागरिक क्रेडेंशियल')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-2xs ${
                isEditing
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750'
              }`}
            >
              <span>{isEditing ? '✕' : '✏️'}</span>
              <span>{isEditing ? tx('Cancel', 'रद्द करें') : tx('Edit', 'संपादित करें')}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Active Development / Coming Soon Notice Banner */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/20 p-4 shadow-sm dark:border-amber-600/60 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-amber-950/40">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xl">
                🚧
              </span>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    {tx('Candidate Profile · Active Development', 'कैंडिडेट प्रोफ़ाइल · सक्रिय विकास जारी है')}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white shadow-2xs animate-pulse">
                    <span>⚡</span>
                    <span>{tx('Coming Soon', 'जल्द आ रहा है')}</span>
                  </span>
                </div>
                <p className="text-xs text-amber-950/90 dark:text-amber-200/90 leading-relaxed font-medium">
                  {hi ? (
                    <>
                      हम वर्तमान में प्रत्येक उम्मीदवार (Candidate), स्वयंसेवक और नागरिक के लिए इस समर्पित प्रोफ़ाइल कार्ड पर काम कर रहे हैं।
                      यहाँ आपका <strong>सत्यापित आधार, इमरजेंसी हेल्थ कार्ड, मेडिकल क्रेडेंशियल और लाइव सेवा रिकॉर्ड</strong> एक ही जगह प्रदर्शित होगा।
                    </>
                  ) : (
                    <>
                      We are currently polishing this unified Candidate & Citizen Profile card!
                      Every individual will have this dedicated card displaying their <strong>verified identity, emergency health credentials, volunteer badges, and live incident records</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 animate-fadeIn">
              <span>✅</span>
              <span>{tx('Profile details saved successfully to your emergency card!', 'प्रोफ़ाइल विवरण आपके इमरजेंसी कार्ड में सफलतापूर्वक सुरक्षित कर दिए गए!')}</span>
            </div>
          )}

          {/* Profile Card Main Layout */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 p-4 sm:p-5 shadow-xs space-y-5">
            {/* User Profile Header (Photo, Name, ID, Badges) */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Avatar with Camera Overlay */}
              <div className="relative group shrink-0">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="h-20 w-20 rounded-2xl object-cover border-2 border-teal-500 shadow-md"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-600 text-3xl font-black text-white shadow-md">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                {/* Upload Photo Button */}
                <label
                  title={tx('Upload custom photo', 'फ़ोटो अपलोड करें')}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700 transition"
                >
                  <span className="text-xs">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* Active indicator */}
                <span
                  title={tx('Active & Ready for Emergency', 'सक्रिय एवं इमरजेंसी हेतु तैयार')}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                >
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {profile.name}
                  </h3>

                  {profile.isAadhaarVerified && (
                    <span
                      title={tx('UIDAI Identity Verified', 'UIDAI पहचान सत्यापित')}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-black text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                    >
                      <span>🛡️</span>
                      <span>{tx('UIDAI Verified', 'सत्यापित')}</span>
                    </span>
                  )}

                  {profile.policeVerified && (
                    <span
                      title={tx('Police Verification Completed', 'पुलिस सत्यापन पूर्ण')}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-black text-blue-800 dark:text-blue-300 border border-blue-500/30"
                    >
                      <span>👮</span>
                      <span>{tx('Civic Cleared', 'पुलिस सत्यापित')}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {profile.roleTitle}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{profile.location}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span>📞</span>
                    <span>{profile.phone}</span>
                  </span>
                </div>

                {/* Candidate ID Chip */}
                <div className="pt-1.5 flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-mono text-[11px] font-bold bg-slate-200/80 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-700">
                    ID: {profile.candidateId}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
                  >
                    {copied ? tx('✓ Copied!', '✓ कॉपी हुआ!') : tx('Copy ID', 'कॉपी ID')}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Preview Switcher */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {tx('Current Profile Role Preview', 'वर्तमान प्रोफ़ाइल रोल पूर्वावलोकन')}
                </span>
                <span className="text-xs font-black text-teal-700 dark:text-teal-400 capitalize">
                  {role || 'Citizen'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => loginAs(r)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-all ${
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

            {/* Editable Form vs Display Grid */}
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Full Name', 'पूरा नाम')}
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Phone Number', 'फ़ोन नंबर')}
                    </label>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Blood Group', 'ब्लड ग्रुप')}
                    </label>
                    <select
                      value={profile.bloodGroup}
                      onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
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
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
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
                      value={profile.allergies}
                      onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Medical Conditions', 'चिकित्सा स्थिति')}
                    </label>
                    <input
                      type="text"
                      value={profile.conditions}
                      onChange={(e) => setProfile({ ...profile, conditions: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Emergency Contact (Guardian)', 'इमरजेंसी संपर्क (अभिभावक)')}
                    </label>
                    <input
                      type="text"
                      value={profile.emergencyContact}
                      onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {tx('Guardian Phone Number', 'अभिभावक फ़ोन नंबर')}
                    </label>
                    <input
                      type="text"
                      value={profile.emergencyPhone}
                      onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-sm text-slate-900 dark:text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 font-bold text-slate-700 dark:text-slate-300"
                  >
                    {tx('Cancel', 'रद्द करें')}
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-teal-600 px-5 py-2 font-black text-white shadow-md hover:bg-teal-700"
                  >
                    {tx('Save Changes', 'सुरक्षित करें')}
                  </button>
                </div>
              </form>
            ) : (
              /* Display Mode */
              <div className="space-y-4">
                {/* Medical Emergency Highlights */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <span>🩺</span>
                    <span>{tx('Emergency Health Card (First Responders View)', 'इमरजेंसी हेल्थ कार्ड (फर्स्ट रिस्पॉन्डर्स हेतु)')}</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-2xl border border-rose-200/90 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 p-3">
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
                        {tx('Blood Group', 'ब्लड ग्रुप')}
                      </span>
                      <span className="text-xl font-black text-rose-700 dark:text-rose-300">
                        {profile.bloodGroup}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        {tx('Allergies', 'एलर्जी')}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                        {profile.allergies || tx('None reported', 'कोई नहीं')}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        {tx('Conditions', 'चिकित्सा स्थिति')}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                        {profile.conditions || tx('Healthy', 'स्वस्थ')}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-3">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                        {tx('Organ Donor', 'अंग दाता')}
                      </span>
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                        {profile.organDonor ? tx('Registered ✅', 'पंजीकृत ✅') : tx('No', 'नहीं')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Guardian Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      {tx('Primary Emergency Contact / Guardian', 'प्राथमिक इमरजेंसी अभिभावक')}
                    </span>
                    <p className="text-xs font-black text-slate-900 dark:text-white">
                      {profile.emergencyContact}
                    </p>
                    <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400">
                      {profile.emergencyPhone}
                    </p>
                  </div>

                  <a
                    href={`tel:${profile.emergencyPhone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:opacity-95"
                  >
                    <span>📞</span>
                    <span>{tx('Call Guardian', 'अभिभावक को कॉल करें')}</span>
                  </a>
                </div>

                {/* Verified Credentials & Badges */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <span>🎖️</span>
                    <span>{tx('Verified Civic Credentials & Training', 'सत्यापित नागरिक क्रेडेंशियल व प्रशिक्षण')}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center gap-2.5">
                      <span className="text-lg">🩺</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          First Aid & CPR Certified
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          St. John Ambulance · Valid till 2027
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center gap-2.5">
                      <span className="text-lg">🛡️</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          UIDAI Aadhaar Linked
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {profile.aadhaarMasked} · OTP Authenticated
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Incident Activity Log */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <span>📋</span>
                    <span>{tx('Recent Emergency & Incident Activity', 'हालिया इमरजेंसी एवं गतिविधि लॉग')}</span>
                  </h4>

                  <div className="space-y-1.5">
                    {[
                      {
                        code: 'SS-EMG-2026-50401',
                        title: 'Emergency Medical Triage',
                        meta: 'District Hospital Prayagraj · Dispatched',
                        status: 'Dispatched',
                        badge: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
                      },
                      {
                        code: 'BK-849201',
                        title: 'Teleconsultation with Dr. A. Sharma',
                        meta: 'Completed Video Consultation',
                        status: 'Completed',
                        badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
                      },
                      {
                        code: 'SS-MED-2026-0091',
                        title: 'Jan Aushadhi Generic Medicine Order',
                        meta: 'Paracetamol & ORS · Delivered via Volunteer',
                        status: 'Delivered',
                        badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
                      },
                    ].map((item) => (
                      <div
                        key={item.code}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {item.code}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.meta}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${item.badge}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 px-5 sm:px-6 py-3.5 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>🔒</span>
            <span>{tx('End-to-End Encrypted Citizen Medical ID', 'सुरक्षित व एन्क्रिप्टेड नागरिक मेडिकल ID')}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/profile"
              onClick={onClose}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition"
            >
              <span>📄</span>
              <span>{tx('Full Profile Page', 'पूरा प्रोफ़ाइल पृष्ठ')}</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-black text-white shadow-md hover:bg-teal-700 transition"
            >
              {tx('Close', 'बंद करें')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
