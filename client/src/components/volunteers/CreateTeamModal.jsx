import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CreateTeamModal({ isOpen, onClose, onCreateTeam }) {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teamCategory: 'Citizen Action Group',
    supportedDisasters: ['Floods', 'General Emergency'],
    location: '',
    city: 'Prayagraj',
    district: 'Prayagraj',
    state: 'Uttar Pradesh',
    pincode: '',
    serviceArea: 'Within 25 km radius',
    leaderName: '',
    leaderPhone: '',
    capacity: 50,
    skills: ['First Aid', 'Food Distribution'],
    registrationDocRef: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim() || !formData.leaderName.trim() || !formData.leaderPhone.trim()) {
      setError('Please provide team name, location, and leader contact details.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreateTeam(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create team');
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
              Create a Volunteer Team
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Form a new disaster relief unit in your district
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Yamuna Flood Rescue & Relief Squad"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={formData.teamCategory}
                onChange={(e) => setFormData((p) => ({ ...p, teamCategory: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option>Citizen Action Group</option>
                <option>Community NGO</option>
                <option>Red Cross / Medical Corps</option>
                <option>Civil Defence</option>
                <option>NDRF/SDRF Affiliate</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Capacity</label>
              <input
                type="number"
                min="5"
                max="200"
                value={formData.capacity}
                onChange={(e) => setFormData((p) => ({ ...p, capacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Headquarters / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sector 3, Sangam Ghat"
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Team Leader Name *</label>
              <input
                type="text"
                required
                placeholder="Leader full name"
                value={formData.leaderName}
                onChange={(e) => setFormData((p) => ({ ...p, leaderName: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Leader Phone *</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.leaderPhone}
                onChange={(e) => setFormData((p) => ({ ...p, leaderPhone: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mission Description</label>
              <textarea
                rows={2}
                placeholder="Explain the purpose and focus of this volunteer team..."
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            * Note: New teams are registered with <strong>Pending Verification</strong> status until reviewed by District Command.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 shadow-md shadow-teal-600/20"
            >
              {submitting ? 'Creating Team...' : 'Submit Team for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
