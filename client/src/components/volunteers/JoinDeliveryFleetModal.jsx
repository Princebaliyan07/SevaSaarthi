import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const VEHICLE_OPTIONS = [
  { value: 'bicycle', label: '🚲 Bicycle', desc: 'Small parcels, short range' },
  { value: 'motorcycle', label: '🏍️ Motorcycle / Scooter', desc: 'Fast delivery, urban zones' },
  { value: 'auto', label: '🛺 Auto Rickshaw', desc: 'Medium loads, 3–5 km range' },
  { value: 'car', label: '🚗 Car / SUV', desc: 'Large bags, multi-stop delivery' },
  { value: 'mini-truck', label: '🚛 Mini Truck / Tempo', desc: 'Bulk relief supplies' },
  { value: 'on-foot', label: '🚶 On Foot', desc: 'Camp-to-tent last-mile handover' },
];

const AVAILABILITY = ['Morning (6am–12pm)', 'Afternoon (12pm–6pm)', 'Evening (6pm–10pm)', 'Night (10pm–6am)', 'Anytime'];

export default function JoinDeliveryFleetModal({ isOpen, onClose }) {
  const { lang } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    vehicleType: 'motorcycle',
    licenseNumber: '',
    availability: 'Anytime',
    canCarryWeight: '20',
    emergencyContact: '',
    agreeToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const set = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      setError('Please agree to the Volunteer Code of Conduct before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // Submit to volunteer registration endpoint (delivery role)
      const res = await fetch('/api/v1/volunteer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          city: formData.city,
          area: formData.area,
          skills: ['Delivery & Logistics', `Vehicle: ${formData.vehicleType}`],
          availability: formData.availability,
          role: 'delivery-fleet',
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber,
          canCarryWeightKg: Number(formData.canCarryWeight) || 20,
          emergencyContact: formData.emergencyContact,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Registration failed. Please try again.');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedVehicle = VEHICLE_OPTIONS.find((v) => v.value === formData.vehicleType);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex justify-center items-start pt-16 pb-12 px-3">
      <div className="glass-card w-full max-w-lg my-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/15 text-2xl">🚚</span>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Join Delivery Volunteer Fleet</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pick up relief goods from registered stores & deliver to victims
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-all"
            >
              ✕
            </button>
          </div>

          {/* How it works mini-banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-amber-700/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">How Delivery Fleet Works</p>
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-700 dark:text-slate-300">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 font-semibold">📦 Order arrives</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-semibold">📱 You get notified</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 font-semibold">🏪 Pick up from shop</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 font-semibold">🤝 Hand to victims</span>
            </div>
          </div>
        </div>

        {submitted ? (
          /* ── Success State ── */
          <div className="p-8 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-3xl">✅</div>
            <div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">You're on the Fleet!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                Welcome, <strong>{formData.name}</strong>! Your application is under review. Once verified, you'll receive delivery mission notifications on <strong>{formData.phone}</strong>.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 w-full text-left space-y-1">
              <p className="font-bold">📋 What happens next:</p>
              <p>• Admin verifies your details within 24–48 hours</p>
              <p>• You'll get an SMS with your volunteer ID</p>
              <p>• When a food/medicine order is placed near <strong>{formData.city}</strong>, you'll be notified to pick up from the registered store</p>
              <p>• Digital delivery receipt generated on handover</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-sm transition-all shadow-md"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold">
                {error}
              </div>
            )}

            {/* Personal Info */}
            <div className="space-y-1">
              <p className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">👤 Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ravi Shankar Gupta"
                    value={formData.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <p className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">📍 Your Delivery Zone</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prayagraj"
                    value={formData.city}
                    onChange={(e) => set('city', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Lines, Daraganj"
                    value={formData.area}
                    onChange={(e) => set('area', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="space-y-2">
              <p className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">🚛 Vehicle & Capacity</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {VEHICLE_OPTIONS.map((v) => (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() => set('vehicleType', v.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      formData.vehicleType === v.value
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <p className="font-bold text-slate-800 dark:text-white text-[11px]">{v.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Carry Capacity (kg)</label>
                  <input
                    type="number"
                    min="5"
                    max="2000"
                    value={formData.canCarryWeight}
                    onChange={(e) => set('canCarryWeight', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Driving License (optional)</label>
                  <input
                    type="text"
                    placeholder="UP-14 20230012345"
                    value={formData.licenseNumber}
                    onChange={(e) => set('licenseNumber', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <p className="font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">🕐 Availability</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => set('availability', a)}
                    className={`px-3 py-1.5 rounded-full border font-semibold text-[11px] transition-all ${
                      formData.availability === a
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-teal-300'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency contact */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">Emergency Contact Number</label>
              <input
                type="tel"
                placeholder="Family member phone"
                value={formData.emergencyContact}
                onChange={(e) => set('emergencyContact', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Volunteer stats info box */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-base font-black text-teal-600 dark:text-teal-400">24h</p>
                <p className="text-[10px] text-slate-500">Verification Time</p>
              </div>
              <div>
                <p className="text-base font-black text-amber-600 dark:text-amber-400">₹0</p>
                <p className="text-[10px] text-slate-500">No Fee to Join</p>
              </div>
              <div>
                <p className="text-base font-black text-emerald-600 dark:text-emerald-400">100%</p>
                <p className="text-[10px] text-slate-500">Traceable Delivery</p>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => set('agreeToTerms', e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600"
              />
              <span className="text-slate-600 dark:text-slate-400 leading-relaxed">
                I agree to SevaSaarthi's <span className="text-teal-600 font-bold underline">Volunteer Code of Conduct</span>. I will make deliveries honestly and provide digital proof (photo) on handover. I understand all delivery missions are tracked and logged.
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black shadow-md flex items-center gap-2 transition-all disabled:opacity-60"
              >
                <span>{submitting ? 'Submitting...' : '🚚 Join the Fleet'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
