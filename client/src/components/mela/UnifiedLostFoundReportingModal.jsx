import { useState } from 'react';

export default function UnifiedLostFoundReportingModal({
  isOpen,
  onClose,
  onReportCreated,
  lang = 'en',
}) {
  const [reportType, setReportType] = useState('missing_person');
  const [submitting, setSubmitting] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    // Person fields
    personName: '',
    personAge: '',
    personGender: 'Male',
    clothingDescription: '',
    distinguishingFeatures: '',
    relationshipToPerson: '',
    // Item fields
    itemCategory: 'Bag/Luggage',
    itemDescription: '',
    // Common fields
    location: '',
    dateTimeApprox: 'Today, recent',
    photoUrl: '',
    // Reporter Contact (Private)
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.trim() || !form.reporterName.trim() || !form.reporterPhone.trim()) {
      setError('Please provide location, reporter name, and phone number.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...form, reportType };
      const res = await onReportCreated(payload);
      setSuccessInfo(res);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const REPORT_TYPES = [
    { type: 'missing_person', label: 'Missing Person', labelHi: 'लापता व्यक्ति', icon: '👤', color: 'border-rose-500 bg-rose-50 text-rose-800' },
    { type: 'lost_item', label: 'Lost Item', labelHi: 'खोया सामान', icon: '🎒', color: 'border-amber-500 bg-amber-50 text-amber-800' },
    { type: 'found_person', label: 'Found Person', labelHi: 'मिला व्यक्ति (सुरक्षित)', icon: '🤝', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
    { type: 'found_item', label: 'Found Item', labelHi: 'पाया सामान', icon: '📦', color: 'border-blue-500 bg-blue-50 text-blue-800' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="glass-card w-full max-w-xl my-6 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'लापता / खोया-पाया रिपोर्ट दर्ज करें' : 'Unified Lost & Found Reporting System'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Success Screen with Secret Access Key */}
        {successInfo ? (
          <div className="space-y-4 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2 font-black text-base">
              <span>✅</span>
              <span>Report Submitted Successfully!</span>
            </div>
            <p className="text-xs leading-relaxed">
              Your official reference ID has been registered in the database. Notice: Private contact info is securely isolated and never shown on public listings.
            </p>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/40 space-y-1.5 font-mono text-xs">
              <div>
                <span className="text-slate-500">Report Reference ID: </span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {successInfo.reportRefId}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Secret Access Key (Save this): </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 break-all">
                  {successInfo.secretAccessKey}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              💡 Use this Secret Access Key to track review status and chat privately with administrators or claimants without disclosing your private contact number publicly.
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Close & View Directory
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

            {/* 4 Report Type Selector Buttons */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                Select Report Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {REPORT_TYPES.map((t) => {
                  const isSelected = reportType === t.type;
                  return (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setReportType(t.type)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-500/10 text-teal-900 dark:text-teal-200 shadow-xs ring-2 ring-teal-500/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span className="mt-1 text-xs">{lang === 'hi' ? t.labelHi : t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Person-specific Fields */}
            {(reportType === 'missing_person' || reportType === 'found_person') && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {reportType === 'missing_person' ? 'Person Name (if known)' : 'Person Name or "Unknown"'}
                    </label>
                    <input
                      type="text"
                      value={form.personName}
                      onChange={(e) => setForm({ ...form, personName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Approx Age
                    </label>
                    <input
                      type="number"
                      value={form.personAge}
                      onChange={(e) => setForm({ ...form, personAge: e.target.value })}
                      placeholder="e.g. 65"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      placeholder="e.g. Son / Good Samaritan"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Clothing & Identifying Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.clothingDescription}
                    onChange={(e) => setForm({ ...form, clothingDescription: e.target.value })}
                    placeholder="e.g. Yellow cotton saree with red borders, brown canvas shoes..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Item-specific Fields */}
            {(reportType === 'lost_item' || reportType === 'found_item') && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Item Category *
                    </label>
                    <select
                      value={form.itemCategory}
                      onChange={(e) => setForm({ ...form, itemCategory: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Bag/Luggage">Bag / Luggage</option>
                      <option value="Mobile/Electronics">Mobile / Electronics</option>
                      <option value="Documents/Wallet">Documents / Wallet / Cash</option>
                      <option value="Jewelry/Valuables">Jewelry / Gold</option>
                      <option value="Other">Other Article</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Distinguishing Marks
                    </label>
                    <input
                      type="text"
                      value={form.distinguishingFeatures}
                      onChange={(e) => setForm({ ...form, distinguishingFeatures: e.target.value })}
                      placeholder="e.g. Red ribbon on zipper, scratched glass"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Item Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.itemDescription}
                    onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
                    placeholder="Describe color, brand, contents without exposing sensitive credentials..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Common Incident Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location (Last Seen / Found) *
                </label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Near Pontoon Bridge 2 / Gate 4"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  placeholder="e.g. Today, approx 10:15 AM"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Private Contact Section */}
            <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-500/20 space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                <span>🔒</span>
                <span>Private Reporter Information (Protected from Public Display)</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.reporterName}
                    onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.reporterPhone}
                    onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                {submitting ? 'Registering...' : 'Submit Official Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
