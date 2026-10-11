import { useState } from 'react';

export default function UnifiedLostFoundReportingModal({
  isOpen,
  onClose,
  onReportCreated,
  currentMapName = '',
  selectedMapId = 'prayagraj_kumbh',
  lang = 'en',
}) {
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    personName: '',
    personAge: '',
    personGender: 'Male',
    clothingDescription: '',
    distinguishingFeatures: '',
    relationshipToPerson: '',
    location: '',
    dateTimeApprox: 'Today, recent',
    photoUrl: '',
    // Private Contact Info (Protected)
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.personName.trim() || !form.location.trim() || !form.reporterName.trim() || !form.reporterPhone.trim()) {
      setError('Please provide missing person name, last-seen location, reporter name, and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        reportType: 'missing_person',
        mapId: selectedMapId || 'prayagraj_kumbh',
      };
      const res = await onReportCreated(payload);
      setSuccessInfo(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-xl my-4 sm:my-6 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 text-lg">
              👤
            </span>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {lang === 'hi' ? 'लापता व्यक्ति रिपोर्ट दर्ज करें' : 'Report a Missing Person'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Mahakumbh Pilgrim Tracing & Reunification Desk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {successInfo ? (
          <div className="space-y-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-black text-base">
              <span>✅</span>
              <span>Missing Person Case Registered Successfully!</span>
            </div>
            <p className="text-xs leading-relaxed">
              Case file transmitted to Mela Ground Police & Volunteer Search Network. Private reporter contact is safeguarded.
            </p>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/40 space-y-1.5 font-mono text-xs">
              <div>
                <span className="text-slate-500">Case Reference ID: </span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {successInfo.reportRefId}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Secret Access Key: </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 break-all">
                  {successInfo.secretAccessKey}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              💡 Keep this key safe to track verification updates and chat privately with authorities.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Done & View Registry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-200">
                ⚠️ {error}
              </div>
            )}

            {/* Person Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Missing Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.personName}
                    onChange={(e) => setForm({ ...form, personName: e.target.value })}
                    placeholder="e.g. Rameshwar Dayal"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age (approx)
                  </label>
                  <input
                    type="number"
                    value={form.personAge}
                    onChange={(e) => setForm({ ...form, personAge: e.target.value })}
                    placeholder="e.g. 68"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={form.personGender}
                    onChange={(e) => setForm({ ...form, personGender: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship to Person
                  </label>
                  <input
                    type="text"
                    value={form.relationshipToPerson}
                    onChange={(e) => setForm({ ...form, relationshipToPerson: e.target.value })}
                    placeholder="e.g. Son, Daughter, Brother"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Photo Upload & Live Verification Preview Section */}
              <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                    <span>📸</span>
                    <span>Photograph of Missing Person (Crucial for Verification)</span>
                  </label>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                    Used for Dual Photo Comparison
                  </span>
                </div>

                {form.photoUrl ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 flex items-center justify-center">
                    <img
                      src={form.photoUrl}
                      alt="Missing person preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, photoUrl: '' })}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center gap-1 transition-all"
                      >
                        <span>🗑️</span>
                        <span>Remove Photo</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded bg-emerald-600/95 text-white text-[10px] font-bold shadow-sm">
                      ✓ Photo Attached for Officer Verification
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="missing-photo-input"
                      className="border-2 border-dashed border-teal-500/40 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-teal-50/20 dark:bg-teal-950/20 hover:bg-teal-50/40 transition-all text-center group"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📷</span>
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                        Click to Choose / Upload Photo from Gallery
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        JPEG, PNG, WebP · Allows officials to compare face & clothing
                      </span>
                      <input
                        id="missing-photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Or link:</span>
                      <input
                        type="url"
                        value={form.photoUrl}
                        onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                        placeholder="Paste image link URL..."
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clothing & Physical Appearance
                </label>
                <textarea
                  rows={2}
                  value={form.clothingDescription}
                  onChange={(e) => setForm({ ...form, clothingDescription: e.target.value })}
                  placeholder="e.g. White kurta with saffron shawl, black specs, carrying cloth bag..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Incident Location & Timing */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Last Seen Location *
                </label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Gate 3 / Pontoon Bridge 2"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Approx Date & Time *
                </label>
                <input
                  type="text"
                  required
                  value={form.dateTimeApprox}
                  onChange={(e) => setForm({ ...form, dateTimeApprox: e.target.value })}
                  placeholder="e.g. Today, 09:30 AM"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Reporter Contact Information (Protected & Safeguarded with Guarantee) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="text-base">🛡️</span>
                  <span>Reporter Contact Details (Safeguarded from Public View)</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  🔒 Private & Encrypted
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Your contact telephone will <strong>never</strong> be posted publicly or displayed in open listings. It is strictly encrypted and accessible solely to authorized Command Officers once an official verified match is approved.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.reporterName}
                    onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.reporterPhone}
                    onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Registering Case...' : 'Submit Missing Person Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
