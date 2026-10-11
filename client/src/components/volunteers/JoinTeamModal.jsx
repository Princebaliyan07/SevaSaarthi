import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function JoinTeamModal({ team, isOpen, onClose, onSubmitJoin }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentLocation: '',
    skills: ['First Aid'],
    availability: 'Flexible / On-Call',
    qualifications: '',
    reason: '',
    safetyGuidelinesAgreed: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !team) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.reason.trim()) {
      setError('Please provide your full name, phone number, and reason for joining.');
      return;
    }
    if (!formData.safetyGuidelinesAgreed) {
      setError('You must agree to the disaster relief safety guidelines.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmitJoin(team.teamId, formData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit join request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Join Volunteer Team
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submitting membership request to <strong className="text-teal-600 dark:text-teal-400">{team.name}</strong>
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

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="text-5xl">✅</div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              Request Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Your application has been dispatched to <strong>{team.leaderName}</strong> and District Relief Command. Once approved, you will be enrolled into the official team registry.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Current Location / Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Civil Lines, Sector 4"
                  value={formData.currentLocation}
                  onChange={(e) => setFormData((p) => ({ ...p, currentLocation: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Qualifications / Prior Experience
              </label>
              <input
                type="text"
                placeholder="e.g. Red Cross certified, NCC Cadet, Swimming, Paramedic"
                value={formData.qualifications}
                onChange={(e) => setFormData((p) => ({ ...p, qualifications: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for Joining This Unit *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Explain why you wish to deploy with this disaster relief team..."
                value={formData.reason}
                onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.safetyGuidelinesAgreed}
                onChange={(e) => setFormData((p) => ({ ...p, safetyGuidelinesAgreed: e.target.checked }))}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                I agree to the <strong>Disaster Relief Code of Conduct</strong> and declare that I will only undertake missions under authorized supervision.
              </span>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 shadow-md shadow-teal-600/20"
              >
                {submitting ? 'Submitting...' : 'Send Membership Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
