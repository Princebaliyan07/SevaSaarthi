import { useState, useEffect } from 'react';
import {
  registerFirstResponder,
  searchFirstResponders,
  sendAadhaarOtp,
  verifyAadhaarOtp,
} from '../../services/firstResponderService';

// ─── Constants & Speciality Presets ──────────────────────────────────────────

const SPECIFICATIONS = [
  { value: 'all', label: 'All Responders', icon: '👥' },
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
    'Orthopedic (Bone & Joint)',
    'General Physician',
    'Pediatrician (Child Specialist)',
    'Pulmonologist (Respiratory/Lungs)',
    'Neurologist / Neurosurgeon',
    'Anesthesiologist & Critical Care',
  ],
  Nurse: [
    'ICU / Critical Care Specialist Nurse',
    'Emergency Trauma Nurse',
    'OT (Operation Theatre) Nurse',
    'Pediatric & Neonatal Nurse',
    'Cardiac Care Nurse',
    'General Ward & Triage Nurse',
  ],
  'NCC/NSS Volunteer': [
    'First Aid & CPR Certified',
    'Disaster Relief & Evacuation',
    'Crowd Triage & Traffic Control',
    'Blood Donor & Emergency Logistics',
    'Basic Life Support (BLS)',
  ],
  'Ex-Army/Defence': [
    'Combat Medic & Field Trauma',
    'Tactical Casualty Care (TCCC)',
    'Emergency Search & Extraction',
    'Disaster Quick Reaction Specialist',
    'Military Paramedic',
  ],
  Paramedic: [
    'Advanced Life Support (ALS) Specialist',
    'Ambulance Emergency Technician',
    'Cardiac Life Support (ACLS)',
    'Airway & Burn Management',
  ],
  'NDRF/SDRF Trained': [
    'Collapsed Structure Search & Rescue (CSSR)',
    'Flood & Deep Water Rescue',
    'Rope & Mountain Rescue',
    'Hazmat & Chemical Emergency Response',
  ],
};

const SPEC_COLORS = {
  Doctor: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    border: 'border-blue-300/70 dark:border-blue-700/50',
    badge: 'bg-blue-600 text-white',
    icon: '🩺',
  },
  Nurse: {
    bg: 'bg-pink-500/10 dark:bg-pink-500/15',
    border: 'border-pink-300/70 dark:border-pink-700/50',
    badge: 'bg-pink-600 text-white',
    icon: '💉',
  },
  'NCC/NSS Volunteer': {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-300/70 dark:border-emerald-700/50',
    badge: 'bg-emerald-700 text-white',
    icon: '🎖️',
  },
  'Ex-Army/Defence': {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-300/70 dark:border-amber-700/50',
    badge: 'bg-amber-700 text-white',
    icon: '🪖',
  },
  Paramedic: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    border: 'border-orange-300/70 dark:border-orange-700/50',
    badge: 'bg-orange-600 text-white',
    icon: '🚑',
  },
  'NDRF/SDRF Trained': {
    bg: 'bg-teal-500/10 dark:bg-teal-500/15',
    border: 'border-teal-300/70 dark:border-teal-700/50',
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
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors.bg} ${colors.border}`}
    >
      {/* Top Banner with Profile Photo & Verification */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {responder.profilePhoto ? (
            <img
              src={responder.profilePhoto}
              alt={responder.name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 text-2xl shadow-inner border border-white/50">
              {colors.icon}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                {responder.name}
              </h4>
              {responder.isAadhaarVerified && (
                <span
                  title="Aadhaar UIDAI Verified"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                >
                  <span>🛡️</span> Verified
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
              {responder.speciality || responder.specification}
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {responder.age} yrs · {responder.gender}
            </p>
          </div>
        </div>

        {/* Specification Pill */}
        <span
          className={`shrink-0 rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-wide shadow-xs ${colors.badge}`}
        >
          {colors.icon} {responder.specification}
        </span>
      </div>

      {/* Location & Live Distance */}
      <div className="rounded-xl bg-white/70 dark:bg-slate-900/60 p-2.5 mb-3 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate max-w-[70%]">
          <span>📍</span>
          <span className="truncate font-medium">{responder.location}</span>
        </span>

        {responder.distanceKm !== null && responder.distanceKm !== undefined ? (
          <span className="shrink-0 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 text-[11px]">
            ⚡ {responder.distanceKm} km away
          </span>
        ) : (
          <span className="shrink-0 text-[10px] text-slate-400 font-semibold">
            Nearby
          </span>
        )}
      </div>

      {/* Verified Certificate Pill if available */}
      {responder.proofCertificate && (
        <div className="mb-3 flex items-center justify-between text-[11px] bg-slate-100/80 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
          <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
            <span>📜</span> Govt ID / Medical Council Proof
          </span>
          <button
            type="button"
            onClick={() => onViewProof(responder.proofCertificate, responder.name)}
            className="text-teal-600 dark:text-teal-400 font-bold hover:underline text-[10px]"
          >
            View Doc ↗
          </button>
        </div>
      )}

      {/* Action Buttons: 1-Tap Call & Video Call */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={`tel:${responder.contactNumber.replace(/\s/g, '')}`}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition-all hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg active:scale-95"
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
            title="Video Consultation Allowed"
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
            className="flex items-center gap-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 px-3 py-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400"
            title="Responder prefers voice calls / physical first aid"
          >
            <span>📵</span>
            <span>No Video</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-component: Registration Modal ───────────────────────────────────────

function RegistrationModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Aadhaar OTP States
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  // When specification changes, set default speciality
  const handleSpecChange = (spec) => {
    set('specification', spec);
    const defaults = SPECIALITY_SUGGESTIONS[spec] || [];
    set('speciality', defaults[0] || 'General Response');
  };

  // Convert uploaded image file to Base64 Data URL
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      set(field, reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Auto-detect responder's coordinates for distance matching
  const handleDetectCoordinates = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('lat', pos.coords.latitude);
        set('lng', pos.coords.longitude);
      },
      () => {
        console.warn('Coordinates auto-detection failed');
      }
    );
  };

  useEffect(() => {
    handleDetectCoordinates();
  }, []);

  // Send Aadhaar OTP
  const handleSendAadhaarOtp = async () => {
    setError('');
    setOtpMessage('');
    const clean = aadhaarInput.replace(/\s/g, '');
    if (clean.length !== 12 || !/^\d+$/.test(clean)) {
      setError('Please enter a valid 12-digit Aadhaar number.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await sendAadhaarOtp(clean, form.contactNumber);
      if (res.success) {
        setOtpSent(true);
        setOtpMessage(res.message);
        if (res.demoOtp) {
          setDemoOtpHint(`(Demo OTP for testing: ${res.demoOtp})`);
        }
      } else {
        setError(res.message || 'Could not send OTP');
      }
    } catch (err) {
      setError(err?.message || 'Failed to send Aadhaar verification OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify Aadhaar OTP
  const handleVerifyAadhaarOtp = async () => {
    setError('');
    const clean = aadhaarInput.replace(/\s/g, '');
    if (!otpInput.trim()) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    try {
      const res = await verifyAadhaarOtp(clean, otpInput.trim());
      if (res.success && res.verified) {
        set('aadhaarNumber', clean);
        set('isAadhaarVerified', true);
        setOtpMessage('✅ Aadhaar Verified Successfully with UIDAI Gateway!');
        setDemoOtpHint('');
      } else {
        setError(res.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err?.message || 'Invalid or expired OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Submit registration form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.contactNumber || !form.location || !form.age) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (!form.isAadhaarVerified) {
      setError('Please complete Aadhaar OTP verification to register as a verified first responder.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden my-8 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 px-6 py-5 flex items-center justify-between text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚑</span>
              <h3 className="text-lg font-black">Register as First Responder</h3>
            </div>
            <p className="text-xs text-white/80 mt-0.5">
              Verified Doctors, Nurses &amp; Volunteers — Uber for First Aid
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition"
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
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={form.contactNumber}
                onChange={(e) => set('contactNumber', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Specification / Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Specification / Primary Role *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIFICATIONS.filter((s) => s.value !== 'all').map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => handleSpecChange(s.value)}
                  className={`rounded-xl border py-2 px-2 text-[11px] font-black transition text-center ${
                    form.specification === s.value
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speciality Selection (Body part / Specialisation) */}
          <div className="rounded-2xl border border-teal-100 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20 p-4 space-y-2">
            <label className="block text-xs font-bold text-teal-900 dark:text-teal-300">
              🎯 Medical / Response Speciality (e.g. Surgeon, Trauma, CPR) *
            </label>

            {/* Suggestions buttons */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(SPECIALITY_SUGGESTIONS[form.specification] || []).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set('speciality', s)}
                  className={`text-[10px] font-bold rounded-lg px-2.5 py-1 border transition ${
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
              placeholder="Or enter custom speciality (e.g. Orthopedic Trauma Surgeon)"
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

          {/* 🛡️ Aadhaar Number & OTP Verification */}
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <span>🛡️</span> Aadhaar Verification (Govt Mandated) *
                </p>
                <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                  Ensures trusted first responders and eliminates fake profiles.
                </p>
              </div>

              {form.isAadhaarVerified && (
                <span className="rounded-full bg-emerald-500 text-white font-black text-[10px] px-2.5 py-1 flex items-center gap-1 shadow-xs">
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
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendAadhaarOtp}
                    disabled={otpLoading || aadhaarInput.replace(/\s/g, '').length !== 12}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
                  >
                    {otpLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>

                {otpSent && (
                  <div className="rounded-xl bg-white dark:bg-slate-800 p-3 border border-amber-200 dark:border-amber-800 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      Enter 6-digit OTP received on registered mobile:{' '}
                      {demoOtpHint && (
                        <span className="text-emerald-600 font-mono text-[11px] font-bold">
                          {demoOtpHint}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="6-digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value.slice(0, 6))}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-mono tracking-widest text-center text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyAadhaarOtp}
                        disabled={otpLoading || otpInput.length < 4}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-300/60">
                <span>✅</span>
                <span>
                  Aadhaar XXXX-XXXX-{form.aadhaarNumber.slice(-4)} Verified and Linked to Profile!
                </span>
              </div>
            )}

            {otpMessage && (
              <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                {otpMessage}
              </p>
            )}
          </div>

          {/* Photo & Certificate Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Profile Photo */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                📸 Profile Photo
              </label>
              {form.profilePhoto ? (
                <div className="flex items-center gap-3">
                  <img
                    src={form.profilePhoto}
                    alt="Preview"
                    className="h-12 w-12 rounded-xl object-cover border border-slate-300 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => set('profilePhoto', '')}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Change photo
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                />
              )}
            </div>

            {/* Proof Certificate / Govt ID */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-3.5 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                📄 Certificate / Proof ID
              </label>
              {form.proofCertificate ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>✓</span> Document Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => set('proofCertificate', '')}
                    className="text-xs text-rose-600 hover:underline font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, 'proofCertificate')}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              )}
              <p className="text-[10px] text-slate-400">
                Medical registration ID, NCC/NSS Certificate, or Ex-Service card
              </p>
            </div>
          </div>

          {/* Video Calling Permission */}
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
            <div className="rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 py-3.5 text-sm font-black text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? '⏳ Saving & Registering...' : '✅ Complete Registration & Join Network'}
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

  // Search function with optional coords
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

  // Live Location Detection
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

        // Reverse geocode or use city approximation
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
            'My Current Location';
          setSearchLocation(place);
          executeSearch(place, specFilter, coords);
        } catch (err) {
          setSearchLocation('Live GPS Location');
          executeSearch('Delhi', specFilter, coords);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        setSearchError('Unable to detect location. Please check browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleRegSuccess = (name) => {
    setShowRegModal(false);
    setSuccessName(name);
    setTimeout(() => setSuccessName(''), 7000);
    // Refresh search if location present
    if (searchLocation.trim()) {
      executeSearch(searchLocation.trim(), specFilter, userCoords);
    }
  };

  return (
    <section className="space-y-6 pt-2">
      {/* Hero Header Box */}
      <div className="rounded-3xl overflow-hidden border border-teal-200/80 dark:border-teal-800/50 bg-gradient-to-br from-teal-50 via-emerald-50/70 to-cyan-50 dark:from-teal-950/40 dark:via-emerald-950/30 dark:to-cyan-950/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/15 px-3.5 py-1 text-xs font-black text-teal-800 dark:text-teal-300">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              🚑 First Responder Emergency Grid — Uber for First Aid
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Instant Medical Help Within 2–3 Minutes
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              When someone collapses or suffers cardiac arrest in a crowd, registered doctors,
              nurses, NCC/NSS volunteers and ex-army personnel nearby are notified to reach the victim{' '}
              <strong>before the ambulance gets stuck in traffic</strong>.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: '🩺', label: 'Surgeons & Doctors' },
                { icon: '💉', label: 'Critical Care Nurses' },
                { icon: '🎖️', label: 'NCC / NSS Volunteers' },
                { icon: '🪖', label: 'Ex-Defence Medics' },
                { icon: '🛡️', label: 'Aadhaar Verified' },
              ].map((t) => (
                <span
                  key={t.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 px-3 py-1 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs"
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Action CTA */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => setShowRegModal(true)}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-teal-500/30 transition-all hover:from-teal-700 hover:to-emerald-700 active:scale-95"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
              <span>Register as Responder</span>
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
              Join with Aadhaar Verification &amp; Save Lives
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successName && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700 p-4 text-sm font-bold text-emerald-800 dark:text-emerald-300 shadow-sm animate-fadeIn">
          <span className="text-2xl">🎉</span>
          <div>
            <p>
              Congratulations <strong>{successName}</strong>! Your registration is complete and verified.
            </p>
            <p className="text-xs font-normal text-emerald-700 dark:text-emerald-400 mt-0.5">
              Citizens in your area can now find you in emergencies for first aid assistance.
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔍</span>
            <span>Search Nearby Responders by Location or Speciality</span>
          </h3>

          {/* Live GPS button */}
          <button
            type="button"
            onClick={handleDetectLiveLocation}
            disabled={isDetectingLocation}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500/10 px-3.5 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 active:scale-95 transition"
          >
            <span>📍</span>
            <span>{isDetectingLocation ? 'Detecting GPS...' : 'Use My Live Location'}</span>
          </button>
        </div>

        {/* Input Bar */}
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

        {/* Specification Filter Chips */}
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

      {/* Search Results Display */}
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
                Be the first doctor, nurse or volunteer in this area to register and help save lives
                during medical emergencies!
              </p>
              <button
                type="button"
                onClick={() => setShowRegModal(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-teal-700"
              >
                📝 Register Now in This Area
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
                  ⚡ Ordered by nearest live proximity
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

      {/* Proof Preview Modal */}
      {activeProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                📜 Verified Certificate / Govt ID of {activeProofModal.name}
              </h4>
              <button
                onClick={() => setActiveProofModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 p-2">
              <img
                src={activeProofModal.proof}
                alt="Certificate Proof"
                className="w-full rounded-lg object-contain"
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
