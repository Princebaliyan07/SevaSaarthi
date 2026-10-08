import { useState, useEffect } from 'react';
import {
  registerFirstResponder,
  searchFirstResponders,
  sendAadhaarOtp,
  verifyAadhaarOtp,
} from '../../services/firstResponderService';

// ─── Constants & Cadre Speciality Presets ────────────────────────────────────

const SPECIFICATIONS = [
  { value: 'all', label: 'All Cadres', icon: '👥' },
  { value: 'Doctor', label: 'Doctor', icon: '🩺' },
  { value: 'Nurse', label: 'Nurse', icon: '💉' },
  { value: 'NCC/NSS Volunteer', label: 'NCC/NSS', icon: '🎖️' },
  { value: 'Ex-Army/Defence', label: 'Ex-Army', icon: '🪖' },
  { value: 'Paramedic', label: 'Paramedic', icon: '🚑' },
  { value: 'NDRF/SDRF Trained', label: 'NDRF/SDRF', icon: '⛑️' },
];

const SPECIALITY_SUGGESTIONS = {
  Doctor: [
    'Trauma & Emergency Surgeon',
    'General Surgeon',
    'Cardiologist (Heart Specialist)',
    'Orthopedic (Bone & Fracture)',
    'General Physician (MD Medicine)',
    'Pediatrician (Child Specialist)',
    'Pulmonologist (Lungs / Breathing)',
    'Neurologist & Brain Trauma',
    'Critical Care & Anesthesiologist',
  ],
  Nurse: [
    'ICU / Critical Care Specialist Nurse',
    'Emergency Trauma Triage Nurse',
    'OT (Operation Theatre) Nurse',
    'Pediatric & Neonatal Nurse',
    'Cardiac Care Nurse',
    'General Medical Nurse',
  ],
  'NCC/NSS Volunteer': [
    'First Aid & CPR Certified',
    'Disaster Evacuation & Relief',
    'Crowd Triage & Stampede Control',
    'Emergency Blood Donor Team',
    'Basic Life Support (BLS)',
  ],
  'Ex-Army/Defence': [
    'Combat Medic & Field Trauma',
    'Tactical Casualty Care (TCCC)',
    'High-Altitude & Extraction Specialist',
    'Quick Reaction Medical Team',
    'Military Veteran Paramedic',
  ],
  Paramedic: [
    'Advanced Cardiac Life Support (ACLS)',
    'Ambulance Emergency Technician',
    'Airway & Severe Burn Management',
    'Basic Trauma Life Support (BTLS)',
  ],
  'NDRF/SDRF Trained': [
    'Collapsed Structure Search & Rescue (CSSR)',
    'Flood & Deep Water Rescue',
    'Rope & Mountain Cliff Rescue',
    'Hazmat & CBRN Chemical Response',
  ],
};

const SPEC_COLORS = {
  Doctor: {
    gradient: 'from-blue-600 to-indigo-600',
    border: 'border-blue-400/40 dark:border-blue-700/50',
    lightBg: 'bg-blue-50/70 dark:bg-blue-950/30',
    badge: 'bg-blue-600 text-white',
    icon: '🩺',
  },
  Nurse: {
    gradient: 'from-pink-600 to-rose-600',
    border: 'border-pink-400/40 dark:border-pink-700/50',
    lightBg: 'bg-pink-50/70 dark:bg-pink-950/30',
    badge: 'bg-pink-600 text-white',
    icon: '💉',
  },
  'NCC/NSS Volunteer': {
    gradient: 'from-emerald-600 to-teal-700',
    border: 'border-emerald-400/40 dark:border-emerald-700/50',
    lightBg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    badge: 'bg-emerald-700 text-white',
    icon: '🎖️',
  },
  'Ex-Army/Defence': {
    gradient: 'from-amber-600 to-orange-700',
    border: 'border-amber-400/40 dark:border-amber-700/50',
    lightBg: 'bg-amber-50/70 dark:bg-amber-950/30',
    badge: 'bg-amber-700 text-white',
    icon: '🪖',
  },
  Paramedic: {
    gradient: 'from-orange-600 to-red-600',
    border: 'border-orange-400/40 dark:border-orange-700/50',
    lightBg: 'bg-orange-50/70 dark:bg-orange-950/30',
    badge: 'bg-orange-600 text-white',
    icon: '🚑',
  },
  'NDRF/SDRF Trained': {
    gradient: 'from-teal-600 to-cyan-700',
    border: 'border-teal-400/40 dark:border-teal-700/50',
    lightBg: 'bg-teal-50/70 dark:bg-teal-950/30',
    badge: 'bg-teal-700 text-white',
    icon: '⛑️',
  },
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const EMPTY_FORM = {
  name: '',
  contactNumber: '',
  specification: 'Doctor',
  speciality: 'Trauma & Emergency Surgeon',
  age: '',
  gender: 'Male',
  location: '',
  lat: null,
  lng: null,
  aadhaarNumber: '',
  isAadhaarVerified: false,
  profilePhoto: '',
  proofCertificate: '',
  videoCallAllowed: false,
  videoCallLink: '',
};

// ─── Sub-component: Responder Card ──────────────────────────────────────────

function ResponderCard({ responder, onViewProof }) {
  const colors = SPEC_COLORS[responder.specification] || SPEC_COLORS.Doctor;

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-md ${colors.lightBg} ${colors.border}`}
    >
      {/* Top Accent Gradient Line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colors.gradient}`} />

      {/* Profile & Cadre Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            {responder.profilePhoto ? (
              <img
                src={responder.profilePhoto}
                alt={responder.name}
                className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-2xl shadow-inner border border-white/60">
                {colors.icon}
              </div>
            )}
            <span
              title="Active First Responder"
              className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight">
                {responder.name}
              </h4>
              {responder.isAadhaarVerified && (
                <span
                  title="UIDAI Verified Identity"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                >
                  <span>🛡️</span> Verified
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-teal-700 dark:text-teal-400 mt-0.5 leading-snug">
              {responder.speciality || responder.specification}
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {responder.age} yrs · {responder.gender}
            </p>
          </div>
        </div>

        {/* Specification Cadre Pill */}
        <span
          className={`shrink-0 rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-xs ${colors.badge}`}
        >
          {colors.icon} {responder.specification}
        </span>
      </div>

      {/* Location & Live Proximity Distance */}
      <div className="rounded-2xl bg-white/80 dark:bg-slate-900/70 p-3 mb-3 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs">
        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate max-w-[65%]">
          <span className="text-sm">📍</span>
          <span className="truncate font-semibold">{responder.location}</span>
        </span>

        {responder.distanceKm !== null && responder.distanceKm !== undefined ? (
          <span className="shrink-0 font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/25 text-[11px] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            {responder.distanceKm} km away
          </span>
        ) : (
          <span className="shrink-0 text-[10px] text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-lg">
            ⚡ Quick Response Area
          </span>
        )}
      </div>

      {/* Verified Govt Proof / Certificate Badge */}
      {responder.proofCertificate && (
        <div className="mb-3 flex items-center justify-between text-[11px] bg-slate-100/90 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
          <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
            <span className="text-xs">📜</span>
            <span>Govt ID / Medical Proof</span>
          </span>
          <button
            type="button"
            onClick={() => onViewProof(responder.proofCertificate, responder.name)}
            className="inline-flex items-center gap-1 rounded-lg bg-teal-600/10 px-2 py-0.5 text-teal-700 dark:text-teal-300 hover:bg-teal-600 hover:text-white font-bold text-[10px] transition"
          >
            <span>View Proof</span>
            <span>↗</span>
          </button>
        </div>
      )}

      {/* Action Buttons: 1-Tap Emergency Call & Video First Aid */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={`tel:${responder.contactNumber.replace(/\s/g, '')}`}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:opacity-95 hover:shadow-lg active:scale-95"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" />
          </svg>
          <span>Call: {responder.contactNumber}</span>
        </a>

        {responder.videoCallAllowed ? (
          <a
            href={responder.videoCallLink || `tel:${responder.contactNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2.5 text-xs font-black text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
            title="Video Consultation Allowed for Emergency Guidance"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              />
            </svg>
            <span>Video</span>
          </a>
        ) : (
          <div
            className="flex items-center gap-1 rounded-xl bg-slate-200/90 dark:bg-slate-800 px-3 py-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400"
            title="Physical on-site first aid only"
          >
            <span>📵</span>
            <span>No Video</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-component: Registration Modal (Strict Proof & Real SMS OTP) ─────────

function RegistrationModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Aadhaar OTP Verification States
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // When specification changes, auto-select default speciality
  const handleSpecChange = (spec) => {
    set('specification', spec);
    const defaults = SPECIALITY_SUGGESTIONS[spec] || [];
    set('speciality', defaults[0] || 'General Emergency First Aid');
  };

  // Convert uploaded files to Base64 Data URL
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('File size must be less than 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      set(field, reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  // Send real SMS OTP to phone
  const handleSendAadhaarOtp = async () => {
    setError('');
    setOtpMessage('');

    const cleanAadhaar = aadhaarInput.replace(/\s/g, '');
    if (cleanAadhaar.length !== 12 || !/^\d+$/.test(cleanAadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    if (!form.contactNumber || form.contactNumber.replace(/\D/g, '').length < 10) {
      setError('Please enter your 10-digit mobile number above first, to receive the OTP.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await sendAadhaarOtp(cleanAadhaar, form.contactNumber);
      if (res.success) {
        setOtpSent(true);
        setOtpMessage(res.message);
        setResendTimer(60); // 60s cooldown
      } else {
        setError(res.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err?.message || 'Could not send OTP to mobile. Please verify mobile number.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify real SMS OTP
  const handleVerifyAadhaarOtp = async () => {
    setError('');
    const cleanAadhaar = aadhaarInput.replace(/\s/g, '');
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError('Please enter the 6-digit OTP sent to your phone.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await verifyAadhaarOtp(cleanAadhaar, otpInput.trim());
      if (res.success && res.verified) {
        set('aadhaarNumber', cleanAadhaar);
        set('isAadhaarVerified', true);
        setOtpMessage('✅ Aadhaar Identity Verified via UIDAI SMS Gateway!');
      } else {
        setError(res.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please check the code sent to your phone.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit form with strict proof and verification checks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.contactNumber || !form.location || !form.age) {
      setError('Please fill in all basic personal details.');
      return;
    }

    // STRICT PROOF CHECK: "without proof no registration"
    if (!form.proofCertificate || !form.proofCertificate.trim()) {
      setError(
        '⚠️ REGISTRATION BLOCKED: Proof document (Medical Council ID, NCC/NSS Certificate, or Ex-Serviceman ID) is strictly mandatory. Unverified registrations are not allowed.'
      );
      return;
    }

    // STRICT PROFILE PHOTO CHECK
    if (!form.profilePhoto || !form.profilePhoto.trim()) {
      setError('⚠️ Profile photo is required for visual identification by patients and teams.');
      return;
    }

    // STRICT AADHAAR VERIFICATION CHECK
    if (!form.isAadhaarVerified) {
      setError('⚠️ Aadhaar mobile OTP verification is mandatory before registration.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerFirstResponder(form);
      if (res.success) {
        onSuccess(form.name);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-8 border border-slate-200/80 dark:border-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 px-6 py-5 flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-xl shadow-inner">
              🚑
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight">Verified First Responder Registration</h3>
              <p className="text-xs text-white/80">
                Strict Verification: Proof &amp; Aadhaar OTP Mandated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition active:scale-95"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Name & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajendra Singh"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number (for SMS OTP) *
              </label>
              <input
                type="tel"
                maxLength={10}
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={form.contactNumber}
                onChange={(e) => set('contactNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Specification Cadre */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Cadre / Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIFICATIONS.filter((s) => s.value !== 'all').map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleSpecChange(s.value)}
                  className={`rounded-2xl border py-2.5 px-2 text-[11px] font-black transition text-center ${
                    form.specification === s.value
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  <span className="block text-base mb-0.5">{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speciality Selection (Body part / Specialisation) */}
          <div className="rounded-2xl border border-teal-200/80 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-950/25 p-4 space-y-2.5">
            <label className="block text-xs font-black text-teal-900 dark:text-teal-200">
              🎯 Medical / Response Speciality (e.g. Trauma Surgeon, CPR, Combat Medic) *
            </label>

            {/* Presets suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {(SPECIALITY_SUGGESTIONS[form.specification] || []).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('speciality', s)}
                  className={`text-[10px] font-bold rounded-xl px-2.5 py-1 border transition ${
                    form.speciality === s
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-teal-200 dark:border-teal-800 hover:border-teal-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <input
              type="text"
              placeholder="Or enter custom speciality (e.g. Pediatric Trauma, Orthopedic)"
              value={form.speciality}
              onChange={(e) => set('speciality', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Age, Gender & Location */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                placeholder="e.g. 32"
                value={form.age}
                onChange={(e) => set('age', e.target.value)}
                min={18}
                max={80}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender *
              </label>
              <select
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Area / City *
              </label>
              <input
                type="text"
                placeholder="e.g. Chandni Chowk, Delhi"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* 📄 MANDATORY PROOF DOCUMENT & 📸 PROFILE PHOTO SECTION */}
          <div className="rounded-2xl border-2 border-rose-300/80 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-xs font-black text-rose-900 dark:text-rose-200">
                  Mandatory Verification Proof (Required by Law) *
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300">
                  Registration without genuine proof will be rejected.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Proof Certificate */}
              <div className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-800 p-3 space-y-2">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  📄 Govt ID / Certificate Proof *
                </label>
                {form.proofCertificate ? (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-300/60">
                    <span>✓ Document Uploaded</span>
                    <button
                      type="button"
                      onClick={() => set('proofCertificate', '')}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, 'proofCertificate')}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-100 file:text-rose-800 hover:file:bg-rose-200 cursor-pointer"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Upload Medical Reg ID / NCC/NSS Cert / Ex-Army Card
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Photo */}
              <div className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-white dark:bg-slate-800 p-3 space-y-2">
                <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                  📸 Responder Profile Photo *
                </label>
                {form.profilePhoto ? (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-300/60">
                    <img
                      src={form.profilePhoto}
                      alt="Profile"
                      className="h-9 w-9 rounded-lg object-cover"
                    />
                    <span>✓ Photo Set</span>
                    <button
                      type="button"
                      onClick={() => set('profilePhoto', '')}
                      className="text-rose-600 hover:underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-100 file:text-teal-800 hover:file:bg-teal-200 cursor-pointer"
                      required
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Clear face photo for recognition
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🛡️ REAL AADHAAR MOBILE SMS OTP VERIFICATION */}
          <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/25 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <span>🛡️</span> Real Aadhaar OTP Verification (UIDAI Mobile Linked) *
                </p>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  A 6-digit OTP will be dispatched via SMS to your mobile.
                </p>
              </div>

              {form.isAadhaarVerified && (
                <span className="rounded-full bg-emerald-600 text-white font-black text-[10px] px-3 py-1 flex items-center gap-1 shadow-sm">
                  ✓ Verified
                </span>
              )}
            </div>

            {!form.isAadhaarVerified ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={14}
                    placeholder="Enter 12-digit Aadhaar (e.g. 1234 5678 9012)"
                    value={aadhaarInput}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 12);
                      setAadhaarInput(v.replace(/(\d{4})(?=\d)/g, '$1 '));
                    }}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={otpLoading || aadhaarInput.replace(/\s/g, '').length !== 12 || resendTimer > 0}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {otpLoading
                      ? 'Sending SMS...'
                      : resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : 'Send SMS OTP'}
                  </button>
                </div>

                {otpSent && (
                  <div className="rounded-xl bg-white dark:bg-slate-800 p-3.5 border border-amber-300 dark:border-amber-800 space-y-2 shadow-xs">
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      Enter the 6-digit OTP received on your mobile (+91 {form.contactNumber}):
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-base font-mono tracking-widest text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAadhaarOtp}
                        disabled={otpLoading || otpInput.length !== 6}
                        className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-300/60">
                <span>✅</span>
                <span>
                  Aadhaar XXXX-XXXX-{form.aadhaarNumber.slice(-4)} Verified and securely linked!
                </span>
              </div>
            )}

            {otpMessage && (
              <p className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                {otpMessage}
              </p>
            )}
          </div>

          {/* Video Calling Permissions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  📹 Allow Video Calling?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allow citizens to start quick video guidance for CPR, bandages, or triage
                </p>
              </div>
              <button
                type="button"
                onClick={() => set('videoCallAllowed', !form.videoCallAllowed)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.videoCallAllowed ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.videoCallAllowed ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {form.videoCallAllowed && (
              <input
                type="text"
                placeholder="Google Meet / Zoom link (or leave blank to use phone video)"
                value={form.videoCallLink}
                onChange={(e) => set('videoCallLink', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          </div>

          {error && (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-300 dark:border-rose-700 p-3.5 text-xs font-bold text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-500/30 transition hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? '⏳ Verifying & Registering...' : '✅ Complete Registration & Join Network'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component: First Responder Network ─────────────────────────────────

export default function FirstResponderNetwork() {
  const [searchLocation, setSearchLocation] = useState('');
  const [specFilter, setSpecFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [successName, setSuccessName] = useState('');
  const [userCoords, setUserCoords] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [activeProofModal, setActiveProofModal] = useState(null);

  // Search function
  const executeSearch = async (loc, spec = specFilter, coords = userCoords) => {
    setLoading(true);
    setSearchError('');
    setSearched(false);
    try {
      const res = await searchFirstResponders(
        loc,
        spec,
        coords?.lat || null,
        coords?.lng || null
      );
      setResults(res.data || []);
      setSearched(true);
    } catch (err) {
      setSearchError('Could not fetch responders. Please try again.');
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchLocation.trim()) return;
    executeSearch(searchLocation.trim(), specFilter, userCoords);
  };

  // Live GPS detection
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        setIsDetectingLocation(false);

        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await resp.json();
          const place =
            data.address?.suburb ||
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            'Nearby Location';
          setSearchLocation(place);
          executeSearch(place, specFilter, coords);
        } catch (err) {
          setSearchLocation('Live GPS Location');
          executeSearch('Delhi', specFilter, coords);
        }
      },
      () => {
        setIsDetectingLocation(false);
        setSearchError('Unable to detect location. Please check browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRegSuccess = (name) => {
    setShowRegModal(false);
    setSuccessName(name);
    setTimeout(() => setSuccessName(''), 8000);
    if (searchLocation.trim()) {
      executeSearch(searchLocation.trim(), specFilter, userCoords);
    }
  };

  return (
    <section className="space-y-6 pt-2">
      {/* 🌟 Glowing Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-teal-300/80 dark:border-teal-700/60 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/15 p-7 sm:p-9 shadow-lg backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/15 px-3.5 py-1 text-xs font-black text-teal-800 dark:text-teal-300 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
              <span>🚑 Uber for First Aid · Golden Hour Rapid Network</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Instant Medical Help Reaching You in 2–3 Minutes
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When someone collapses or has cardiac distress in a crowd, registered doctors,
              nurses, NCC/NSS volunteers and ex-army personnel nearby are alerted to reach the patient{' '}
              <strong>before the ambulance gets through</strong>.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: '🩺', label: 'Surgeons & Doctors' },
                { icon: '💉', label: 'Trauma Nurses' },
                { icon: '🎖️', label: 'NCC / NSS Volunteers' },
                { icon: '🪖', label: 'Ex-Defence Medics' },
                { icon: '📜', label: 'Verified Proof Mandated' },
                { icon: '🛡️', label: 'Aadhaar Verified' },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col items-end gap-2.5 shrink-0">
            <button
              onClick={() => setShowRegModal(true)}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-500/30 transition-all hover:opacity-95 hover:shadow-2xl active:scale-95"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
              <span>Register as First Responder</span>
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
              Requires Govt ID Proof &amp; Aadhaar Mobile OTP
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successName && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-md">
          <span className="text-2xl">🎉</span>
          <div>
            <p>
              Welcome <strong>{successName}</strong>! Your registration with verified proof is live.
            </p>
            <p className="text-xs font-normal text-emerald-700 dark:text-emerald-400 mt-0.5">
              Patients and emergency teams in your vicinity can now discover you for urgent first aid.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar with GPS Location */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔍</span>
            <span>Search Nearby Responders by Location or Speciality</span>
          </h3>

          <button
            type="button"
            onClick={handleDetectLiveLocation}
            disabled={isDetectingLocation}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500/15 px-4 py-2 text-xs font-black text-teal-800 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 active:scale-95 transition shadow-2xs"
          >
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />
            <span>{isDetectingLocation ? 'Detecting Live GPS...' : '📍 Use My Live Location'}</span>
          </button>
        </div>

        {/* Input & Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              📍
            </span>
            <input
              type="text"
              placeholder="Enter area, city or speciality (e.g. Chandni Chowk, Delhi, Trauma Surgeon)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchLocation.trim()}
            className="rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Cadre Filter Buttons */}
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
            Filter by Cadre:
          </p>
          <div className="flex flex-wrap gap-2">
            {SPECIFICATIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setSpecFilter(s.value);
                  if (searchLocation.trim()) {
                    executeSearch(searchLocation.trim(), s.value, userCoords);
                  }
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                  specFilter === s.value
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4">
          {searchError ? (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 p-4 text-sm text-rose-700 dark:text-rose-300 font-semibold">
              ⚠️ {searchError}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-3">
              <span className="text-4xl">🔍</span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                No First Responders found matching "{searchLocation}"
                {specFilter !== 'all' ? ` (${specFilter})` : ''}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Be the first verified doctor, nurse or volunteer in this area to register and save lives
                during medical emergencies!
              </p>
              <button
                type="button"
                onClick={() => setShowRegModal(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-teal-700"
              >
                📝 Register with Proof in This Area
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  ✅ Found <span className="text-teal-600">{results.length}</span> verified responder
                  {results.length > 1 ? 's' : ''} near "{searchLocation}"
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ⚡ Ordered by live distance proximity
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((r) => (
                  <ResponderCard
                    key={r._id}
                    responder={r}
                    onViewProof={(proof, name) => setActiveProofModal({ proof, name })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proof Viewer Modal */}
      {activeProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Verified Proof of {activeProofModal.name}
                </h4>
              </div>
              <button
                onClick={() => setActiveProofModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 p-2 bg-slate-50 dark:bg-slate-950">
              <img
                src={activeProofModal.proof}
                alt="Certificate Document Proof"
                className="w-full rounded-xl object-contain shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && (
        <RegistrationModal
          onClose={() => setShowRegModal(false)}
          onSuccess={handleRegSuccess}
        />
      )}
    </section>
  );
}
