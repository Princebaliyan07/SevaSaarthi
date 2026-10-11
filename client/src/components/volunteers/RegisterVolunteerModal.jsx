import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ALL_SKILLS = [
  'First Aid & Triage',
  'Medical Assistance',
  'Food Distribution',
  'Aquatic & Boat Rescue',
  'Search & Evacuation',
  'Emergency Transportation',
  'Medicine Doorstep Delivery',
  'Elderly & Disabled Escort',
  'Crowd & Perimeter Control',
  'Shelter Management',
  'Language Translation',
  'Logistics & Supply Packing',
  'Ham Radio / Communication',
  'Disaster Field Reporting',
];

export default function RegisterVolunteerModal({ isOpen, onClose, onRegisterSuccess }) {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const [form, setForm] = useState({
    // Step 1: Personal
    fullName: '',
    phone: '',
    email: '',
    dob: '',
    state: 'Uttar Pradesh',
    district: 'Prayagraj',
    city: 'Prayagraj',
    pincode: '211001',
    preferredServiceArea: '',
    // Step 2: Skills
    skills: ['First Aid & Triage', 'Food Distribution'],
    qualifications: '',
    // Step 3: Availability
    availableDays: ['Weekends', 'Emergency Callouts'],
    availableHours: '4-8 hours/week',
    emergencyAvailability: true,
    travelDistanceKm: 20,
    hasVehicle: false,
    vehicleType: 'Two Wheeler',
    languages: ['Hindi', 'English'],
    // Step 4: Identity & Consent
    idType: 'Aadhaar Virtual ID',
    idReference: '',
    consentGiven: true,
  });

  if (!isOpen) return null;

  const toggleSkill = (sk) => {
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(sk) ? p.skills.filter((s) => s !== sk) : [...p.skills, sk],
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.fullName.trim() || !form.phone.trim() || !form.city.trim()) {
        setError('Please complete all required personal details.');
        return;
      }
    }
    if (step === 2) {
      if (form.skills.length === 0) {
        setError('Please select at least one relief skill.');
        return;
      }
    }
    if (step === 4) {
      if (!form.consentGiven) {
        setError('Informed consent is mandatory for legal relief deployment.');
        return;
      }
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await onRegisterSuccess(form);
      setSuccessResult(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-2xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>🤝</span>
              <span>Civic Volunteer Enrollment Desk</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              National & Regional Disaster Relief Volunteer Registration Portal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* 5-Step Progress Bar */}
        {!successResult && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span className={step >= 1 ? 'text-teal-600 dark:text-teal-400' : ''}>1. Personal Details</span>
              <span className={step >= 2 ? 'text-teal-600 dark:text-teal-400' : ''}>2. Relief Skills</span>
              <span className={step >= 3 ? 'text-teal-600 dark:text-teal-400' : ''}>3. Availability</span>
              <span className={step >= 4 ? 'text-teal-600 dark:text-teal-400' : ''}>4. Identity Check</span>
              <span className={step >= 5 ? 'text-teal-600 dark:text-teal-400' : ''}>5. Review & Submit</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {successResult ? (
          <div className="py-8 text-center space-y-4">
            <div className="text-5xl">🎖️</div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">
              Volunteer Application Enrolled!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your official application reference ID is{' '}
              <strong className="font-mono text-teal-600 dark:text-teal-400 font-black">
                {successResult.regId || 'VOL-REG-CONFIRMED'}
              </strong>
              . Your details have been securely logged in the relief registry. The District Command Officer will review your credentials for active field dispatch.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white"
            >
              Close & View Opportunities
            </button>
          </div>
        ) : (
          <div>
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={form.fullName}
                      onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      placeholder="ananya@example.com"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">State *</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District *</label>
                    <input
                      type="text"
                      required
                      value={form.district}
                      onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City / Tehsil *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Local Service Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Sangam Ghats, Naini industrial corridor, Civil Lines"
                      value={form.preferredServiceArea}
                      onChange={(e) => setForm((p) => ({ ...p, preferredServiceArea: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white">
                    Next: Relief Skills →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Relief Skills */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Select Your Specialized Skills (Multiple):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SKILLS.map((sk) => {
                      const isSel = form.skills.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => toggleSkill(sk)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isSel
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Certifications & Formal Qualifications (if any):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, St. John Ambulance Certified, NCC Cadet, Ex-defence"
                    value={form.qualifications}
                    onChange={(e) => setForm((p) => ({ ...p, qualifications: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                  <p className="text-[10px] text-slate-400">
                    Note: Uncertified volunteers will not be deployed into hazardous deep-water rescue missions.
                  </p>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
                  >
                    ← Back
                  </button>
                  <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white">
                    Next: Availability →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Availability & Logistics */}
            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Available Hours Commitment</label>
                    <select
                      value={form.availableHours}
                      onChange={(e) => setForm((p) => ({ ...p, availableHours: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option>4-8 hours/week</option>
                      <option>10-20 hours/week</option>
                      <option>Full-time deployment</option>
                      <option>Emergency callouts only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Travel Distance (km)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={form.travelDistanceKm}
                      onChange={(e) => setForm((p) => ({ ...p, travelDistanceKm: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vehicle Available for Delivery?</label>
                    <select
                      value={form.hasVehicle ? 'Yes' : 'No'}
                      onChange={(e) => setForm((p) => ({ ...p, hasVehicle: e.target.value === 'Yes' }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>

                  {form.hasVehicle && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Vehicle Type</label>
                      <select
                        value={form.vehicleType}
                        onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option>Two Wheeler / Scooter</option>
                        <option>Car / SUV</option>
                        <option>Pickup / Mini Truck</option>
                        <option>Boat / Inflatable Craft</option>
                      </select>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.emergencyAvailability}
                    onChange={(e) => setForm((p) => ({ ...p, emergencyAvailability: e.target.checked }))}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>24x7 Emergency Availability:</strong> I consent to receiving urgent SOS dispatches during active disaster alerts.
                  </span>
                </label>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
                  >
                    ← Back
                  </button>
                  <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white">
                    Next: Identity Check →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Identity Verification & Privacy Protection */}
            {step === 4 && (
              <form onSubmit={handleNext} className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <span>🔒</span>
                    <span>Identity Privacy & Data Minimization Notice</span>
                  </h4>
                  <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
                    To safeguard disaster relief integrity and avoid fraud, we verify volunteer identities. In compliance with privacy guidelines, <strong>we never store raw unmasked Aadhaar numbers or identity card photos on public servers</strong>. Only a masked reference code is maintained.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Identity Document Type</label>
                    <select
                      value={form.idType}
                      onChange={(e) => setForm((p) => ({ ...p, idType: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <option>Aadhaar Virtual ID</option>
                      <option>Voter ID</option>
                      <option>Driving License</option>
                      <option>Government / Student ID</option>
                      <option>Not Provided</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Document / Virtual ID Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VID-9874-xxxx"
                      value={form.idReference}
                      onChange={(e) => setForm((p) => ({ ...p, idReference: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consentGiven}
                    onChange={(e) => setForm((p) => ({ ...p, consentGiven: e.target.checked }))}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    I give explicit informed consent for the disaster administration to verify my volunteer credentials for relief deployment.
                  </span>
                </label>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
                  >
                    ← Back
                  </button>
                  <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white">
                    Next: Review Application →
                  </button>
                </div>
              </form>
            )}

            {/* STEP 5: Review & Final Submission */}
            {step === 5 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Review Your Application Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Volunteer Name:</span>
                      <strong className="text-slate-900 dark:text-white">{form.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Phone:</span>
                      <strong className="text-slate-900 dark:text-white">{form.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Location:</span>
                      <strong className="text-slate-900 dark:text-white">{form.city}, {form.district}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Availability:</span>
                      <strong className="text-slate-900 dark:text-white">{form.availableHours}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Selected Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.skills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 shadow-md shadow-teal-600/20"
                  >
                    {submitting ? 'Submitting to Database...' : 'Submit Official Volunteer Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
