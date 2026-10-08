import { useState } from 'react';
import { registerFirstResponder, searchFirstResponders } from '../../services/firstResponderService';

// ─── Constants ───────────────────────────────────────────────────────────────

const SPECIFICATIONS = [
  { value: 'all', label: 'All Responders', icon: '👥' },
  { value: 'Doctor', label: 'Doctor', icon: '🩺' },
  { value: 'Nurse', label: 'Nurse', icon: '💉' },
  { value: 'NCC/NSS Volunteer', label: 'NCC/NSS', icon: '🎖️' },
  { value: 'Ex-Army/Defence', label: 'Ex-Army', icon: '🪖' },
  { value: 'Paramedic', label: 'Paramedic', icon: '🚑' },
  { value: 'NDRF/SDRF Trained', label: 'NDRF/SDRF', icon: '⛑️' },
];

const SPEC_COLORS = {
  'Doctor':           { bg: 'bg-blue-500/15 dark:bg-blue-500/20',   border: 'border-blue-300/60 dark:border-blue-600/40', badge: 'bg-blue-600 text-white',  icon: '🩺' },
  'Nurse':            { bg: 'bg-pink-500/15 dark:bg-pink-500/20',    border: 'border-pink-300/60 dark:border-pink-600/40', badge: 'bg-pink-600 text-white',   icon: '💉' },
  'NCC/NSS Volunteer':{ bg: 'bg-green-500/15 dark:bg-green-500/20',  border: 'border-green-300/60 dark:border-green-600/40',badge: 'bg-green-700 text-white', icon: '🎖️' },
  'Ex-Army/Defence':  { bg: 'bg-amber-500/15 dark:bg-amber-500/20',  border: 'border-amber-300/60 dark:border-amber-600/40',badge: 'bg-amber-700 text-white', icon: '🪖' },
  'Paramedic':        { bg: 'bg-orange-500/15 dark:bg-orange-500/20',border: 'border-orange-300/60',                        badge: 'bg-orange-600 text-white',icon: '🚑' },
  'NDRF/SDRF Trained':{ bg: 'bg-teal-500/15 dark:bg-teal-500/20',   border: 'border-teal-300/60 dark:border-teal-600/40',  badge: 'bg-teal-700 text-white',  icon: '⛑️' },
};

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const EMPTY_FORM = {
  name: '', contactNumber: '', specification: 'Doctor',
  age: '', gender: 'Male', location: '',
  videoCallAllowed: false, videoCallLink: '',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ResponderCard({ responder }) {
  const colors = SPEC_COLORS[responder.specification] || SPEC_COLORS['Doctor'];
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${colors.bg} ${colors.border}`}>
      {/* Specification badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{colors.icon}</span>
          <div>
            <p className="font-black text-slate-900 dark:text-white text-sm leading-tight">{responder.name}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{responder.age}y · {responder.gender}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${colors.badge}`}>
          {colors.icon} {responder.specification}
        </span>
      </div>

      {/* Location */}
      <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-3">
        <span>📍</span>
        <span className="line-clamp-1">{responder.location}</span>
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <a
          href={`tel:${responder.contactNumber.replace(/\s/g, '')}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-black text-white transition hover:bg-emerald-700 active:scale-95"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/>
          </svg>
          Call {responder.contactNumber}
        </a>

        {responder.videoCallAllowed ? (
          <a
            href={responder.videoCallLink || `tel:${responder.contactNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700 active:scale-95"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
            </svg>
            Video
          </a>
        ) : (
          <span className="flex items-center gap-1 rounded-xl bg-slate-200 dark:bg-slate-700 px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
            📵 No Video
          </span>
        )}
      </div>
    </div>
  );
}

function RegistrationModal({ onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.contactNumber || !form.location || !form.age) {
      setError('Please fill all required fields.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">🚑 Register as First Responder</h2>
            <p className="text-xs text-white/80 mt-0.5">Save lives near you — like Uber for First Aid</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Dr. Rajendra Singh"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Number *</label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.contactNumber}
              onChange={e => set('contactNumber', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Specification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Specification / Role *</label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIFICATIONS.filter(s => s.value !== 'all').map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set('specification', s.value)}
                  className={`rounded-xl border py-2 px-1 text-[11px] font-black transition text-center ${
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

          {/* Age + Gender row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Age *</label>
              <input
                type="number"
                placeholder="e.g. 35"
                value={form.age}
                onChange={e => set('age', e.target.value)}
                min={18} max={80}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
              <select
                value={form.gender}
                onChange={e => set('gender', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {GENDER_OPTIONS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Location (Area, City) *</label>
            <input
              type="text"
              placeholder="e.g. Chandni Chowk, Delhi"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <p className="text-[10px] text-slate-400 mt-0.5">Enter area + city so people nearby can find you</p>
          </div>

          {/* Video Calling */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">📹 Allow Video Calling?</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Patients can contact you via video for remote first aid guidance</p>
              </div>
              <button
                type="button"
                onClick={() => set('videoCallAllowed', !form.videoCallAllowed)}
                className={`relative h-6 w-11 rounded-full transition-colors ${form.videoCallAllowed ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.videoCallAllowed ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {form.videoCallAllowed && (
              <input
                type="text"
                placeholder="Google Meet / Zoom link (optional — or use phone for video)"
                value={form.videoCallLink}
                onChange={e => set('videoCallLink', e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 px-4 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? '⏳ Registering...' : '✅ Register as First Responder'}
          </button>

          <p className="text-center text-[10px] text-slate-400">
            Your data is stored securely. You can contact us to update or remove your listing.
          </p>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FirstResponderNetwork() {
  const [searchLocation, setSearchLocation] = useState('');
  const [specFilter, setSpecFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [successName, setSuccessName] = useState('');

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchLocation.trim()) return;
    setLoading(true);
    setSearchError('');
    setSearched(false);
    try {
      const res = await searchFirstResponders(searchLocation.trim(), specFilter);
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

  const handleRegSuccess = (name) => {
    setShowRegModal(false);
    setSuccessName(name);
    setTimeout(() => setSuccessName(''), 5000);
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="rounded-3xl overflow-hidden border border-teal-200/60 dark:border-teal-800/40 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/40 dark:via-emerald-950/40 dark:to-cyan-950/40 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/15 px-3 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              🚑 First Responder Network — Like Uber for First Aid
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Find Nearby Doctors, Nurses & Volunteers
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Registered doctors, nurses, NCC/NSS volunteers and ex-army people in your area get an alert when someone nearby collapses.
              They reach the patient in <strong>2–3 minutes</strong>, before the ambulance can get through.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[{icon:'🩺',label:'Verified Doctors'},{icon:'💉',label:'Nurses'},{icon:'🎖️',label:'NCC/NSS'},{icon:'🪖',label:'Ex-Army'},{icon:'🚑',label:'Paramedics'},{icon:'⛑️',label:'NDRF Trained'}].map(t => (
                <span key={t.label} className="inline-flex items-center gap-1 rounded-full bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {t.icon} {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Register CTA */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => setShowRegModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-teal-500/30 transition hover:from-teal-700 hover:to-emerald-700 active:scale-95"
            >
              <span className="text-lg">📝</span>
              Register as Responder
            </button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
              Are you a doctor, nurse or volunteer?<br/>Register to appear in search results
            </p>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {successName && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700 px-4 py-3 text-sm font-bold text-emerald-800 dark:text-emerald-300">
          <span className="text-xl">✅</span>
          <span><strong>{successName}</strong> registered successfully! You'll now appear in nearby search results.</span>
        </div>
      )}

      {/* Search Panel */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>🔍</span> Search Nearby First Responders
        </h3>

        {/* Location search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
            <input
              type="text"
              placeholder="Enter your area or city (e.g. Chandni Chowk, Delhi)"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchLocation.trim()}
            className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700 active:scale-95 disabled:opacity-60"
          >
            {loading ? '⏳' : 'Search'}
          </button>
        </form>

        {/* Specification Filter */}
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Filter by Specification:</p>
          <div className="flex flex-wrap gap-2">
            {SPECIFICATIONS.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSpecFilter(s.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                  specFilter === s.value
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {searchError ? (
            <div className="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700 p-4 text-sm text-rose-700 dark:text-rose-300 font-semibold">
              ⚠️ {searchError}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-8 text-center space-y-3">
              <p className="text-3xl">😔</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No first responders found near <strong>"{searchLocation}"</strong>
                {specFilter !== 'all' ? ` with specification "${specFilter}"` : ''}.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Be the first to register in your area and help save lives!
              </p>
              <button
                onClick={() => setShowRegModal(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-xs font-black text-white hover:bg-teal-700"
              >
                📝 Register Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  ✅ Found <span className="text-teal-600">{results.length}</span> first responder{results.length > 1 ? 's' : ''} near "{searchLocation}"
                </p>
                <span className="text-[11px] text-slate-400">Tap Call to connect instantly</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {results.map(r => (
                  <ResponderCard key={r._id} responder={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How it works */}
      {!searched && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { step: '1', icon: '🆘', title: 'Someone Collapses', desc: 'A person near you needs immediate first aid — every second counts.' },
            { step: '2', icon: '🔔', title: 'Responders Notified', desc: 'Registered doctors, nurses & volunteers nearby are alerted instantly.' },
            { step: '3', icon: '🚑', title: '2-3 Min Response', desc: 'Responder reaches before the ambulance — saving critical golden minutes.' },
          ].map(s => (
            <div key={s.step} className="rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-5 text-center space-y-2">
              <div className="text-3xl">{s.icon}</div>
              <span className="inline-block rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 px-2.5 py-0.5 text-[10px] font-black">STEP {s.step}</span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">{s.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
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
