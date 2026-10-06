import { useState } from 'react';
import Badge from '../components/common/Badge';
import { useAuth, ROLES } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProfilePage() {
  const { lang, t } = useLanguage();
  const { user, role, loginAs } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Kumar',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    allergies: 'Penicillin, Dust',
    conditions: 'Mild Hypertension',
    emergencyContact: 'Sunita Kumar (Spouse) - +91 98765 43219',
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container-page py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
          {t('profile.title')}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {t('profile.subtitle')}
        </p>
      </div>

      {/* Role Preview Switcher */}
      <div className="card p-4 bg-white flex flex-wrap items-center justify-between gap-3 border-brand/20">
        <div>
          <span className="text-xs font-bold text-ink-soft uppercase tracking-wider block">
            Current Profile Role Preview
          </span>
          <span className="text-sm font-bold text-brand capitalize">
            {role}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => loginAs(r)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                role === r
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-surface text-ink hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
        {/* Medical ID Form */}
        <div className="card p-6 bg-white space-y-4 md:col-span-7">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2">
            Emergency Health Card & Contacts
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-ink">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-ink">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
                >
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink">Known Allergies</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-ink">Pre-existing Health Conditions</label>
              <input
                type="text"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink">Primary Emergency Guardian</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line p-2 text-sm text-ink focus:border-brand focus:outline-none"
              />
            </div>

            <button type="submit" className="btn-primary mt-2">
              {saved ? '✓ Saved Successfully' : t('profile.save')}
            </button>
          </form>
        </div>

        {/* Activity & Ticket History */}
        <div className="card p-6 bg-white space-y-4 md:col-span-5">
          <h2 className="text-lg font-bold text-ink border-b border-line pb-2">
            Active Requests & Saved Tickets
          </h2>

          <div className="space-y-3">
            <div className="rounded-lg border border-line bg-surface p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sos">SS-EMG-2026-50401</span>
                <Badge type="high">Medical</Badge>
              </div>
              <p className="font-semibold text-ink">Emergency ambulance triage</p>
              <p className="text-[11px] text-ink-soft">District Government Hospital · Dispatched</p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-brand">BK-849201</span>
                <Badge type="verified">Confirmed</Badge>
              </div>
              <p className="font-semibold text-ink">Teleconsult with Dr. A. Sharma</p>
              <p className="text-[11px] text-ink-soft">Today 4:30 PM · Video Room Link Ready</p>
            </div>

            <div className="rounded-lg border border-line bg-surface p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-civic">SS-DEL-2026-000231</span>
                <Badge type="official">In Transit</Badge>
              </div>
              <p className="font-semibold text-ink">Paracetamol generic order</p>
              <p className="text-[11px] text-ink-soft">Volunteer A. Singh · ETA 35 min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
