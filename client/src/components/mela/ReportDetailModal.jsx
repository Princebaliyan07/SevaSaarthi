import { useState, useEffect } from 'react';
import { getReportDetails, submitPossibleMatch, sendReportMessage } from '../../services/melaService';

export default function ReportDetailModal({
  reportId,
  isOpen,
  onClose,
  isAdmin = false,
  onStatusUpdated = null,
  lang = 'en',
}) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Found Person Intake Form
  const [showFoundForm, setShowFoundForm] = useState(false);
  const [foundLocation, setFoundLocation] = useState('');
  const [foundPhotoUrl, setFoundPhotoUrl] = useState('');
  const [finderName, setFinderName] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [foundNotes, setFoundNotes] = useState('');
  const [submittingFound, setSubmittingFound] = useState(false);

  // Private chat message
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportData();
    }
  }, [isOpen, reportId]);

  const loadReportData = async (key = '') => {
    setLoading(true);
    try {
      const data = await getReportDetails(reportId, key || secretKeyInput);
      setReport(data);
      setIsAuthorized(Boolean(data.isAuthorizedViewer || isAdmin));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockWithKey = (e) => {
    e.preventDefault();
    if (!secretKeyInput.trim()) return;
    loadReportData(secretKeyInput.trim());
  };

  const handleSubmitFound = async (e) => {
    e.preventDefault();
    if (!foundLocation.trim()) {
      alert('Please provide the location where the person was found.');
      return;
    }
    setSubmittingFound(true);
    try {
      await submitPossibleMatch(reportId, {
        foundLocation: foundLocation.trim(),
        foundPhotoUrl: foundPhotoUrl.trim(),
        finderName: finderName.trim() || 'Volunteer / Police Post',
        finderContact: finderContact.trim(),
        notes: foundNotes.trim(),
      });
      setShowFoundForm(false);
      setFoundLocation('');
      setFoundPhotoUrl('');
      setFoundNotes('');
      await loadReportData();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      alert(`Could not record found update: ${err.message}`);
    } finally {
      setSubmittingFound(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setSendingMessage(true);
    try {
      await sendReportMessage(reportId, {
        text: chatMessage.trim(),
        secretKey: secretKeyInput.trim(),
        senderName: isAdmin ? 'Mela Command Admin' : 'Family Member',
      });
      setChatMessage('');
      await loadReportData();
    } catch (err) {
      alert(`Could not send message: ${err.message}`);
    } finally {
      setSendingMessage(false);
    }
  };

  if (!isOpen) return null;

  const STATUS_TAGS = {
    Submitted: 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
    'Under Review': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300',
    'Possible Match': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300',
    'Verified Match': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300',
    Resolved: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300',
    Rejected: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300',
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="glass-card w-full max-w-2xl my-6 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              {report?.reportRefId || reportId}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                STATUS_TAGS[report?.status] || STATUS_TAGS.Submitted
              }`}
            >
              {report?.status || 'Submitted'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading case file...</div>
        ) : !report ? (
          <div className="py-12 text-center text-xs text-rose-500">Case not found.</div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* DUAL PHOTO COMPARISON SECTION (Missing vs Found) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>📸</span>
                  <span>Photo Verification & Comparison</span>
                </span>
                <span className="text-[10px] text-slate-500">
                  Dual-photo comparison for administrative verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1: When Missing */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      🔴 Photo When Reported Missing
                    </span>
                  </div>
                  {report.photoUrl ? (
                    <img
                      src={report.photoUrl}
                      alt="Photo when missing"
                      className="w-full h-44 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-full h-44 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <span className="text-2xl">👤</span>
                      <span className="text-[10px]">No photo provided at filing</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Last Seen: <strong>{report.location}</strong> ({report.dateTimeApprox})
                  </p>
                </div>

                {/* Photo 2: When Found */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      🟢 Photo When Located / Found
                    </span>
                  </div>
                  {report.foundPhotoUrl ? (
                    <img
                      src={report.foundPhotoUrl}
                      alt="Photo when found"
                      className="w-full h-44 object-cover rounded-lg border border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-full h-44 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 space-y-1">
                      <span className="text-2xl">🔍</span>
                      <span className="text-[10px]">Awaiting found photo upload</span>
                    </div>
                  )}
                  {report.foundLocation ? (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                      📍 Located At: {report.foundLocation}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">Not yet found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Case Details */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {report.personName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {report.personGender} · {report.personAge || 'Age unknown'} yrs · Relation: {report.relationshipToPerson || 'Family'}
                  </p>
                </div>
              </div>

              {report.clothingDescription && (
                <p className="text-slate-700 dark:text-slate-300 pt-1">
                  <strong>Attire / Clothing: </strong> {report.clothingDescription}
                </p>
              )}
              {report.distinguishingFeatures && (
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Physical Identification: </strong> {report.distinguishingFeatures}
                </p>
              )}

              {/* Display location where found if available */}
              {report.foundLocation && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 font-semibold">
                  🎯 Found Person Location: <strong>{report.foundLocation}</strong>
                  {report.foundFinderName && <span className="block text-[11px] text-emerald-700 dark:text-emerald-400">Reported by: {report.foundFinderName}</span>}
                </div>
              )}
            </div>

            {/* Private Contact Isolation Box */}
            {isAuthorized ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-1">
                <span className="font-bold text-[11px] block">
                  🔓 Authorized Contact Telemetry (Admin / Owner Verified):
                </span>
                <p>
                  <span className="font-semibold">Reporter:</span> {report.reporterName} ({report.reporterPhone})
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🔒</span> Reporter Contacts Protected
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Are you the family reporter? Enter Secret Key to unlock contact & private messages.
                  </p>
                </div>
                <form onSubmit={handleUnlockWithKey} className="flex items-center gap-1.5 w-full sm:w-auto">
                  <input
                    type="password"
                    placeholder="Enter Secret Key..."
                    value={secretKeyInput}
                    onChange={(e) => setSecretKeyInput(e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
                  >
                    Unlock
                  </button>
                </form>
              </div>
            )}

            {/* ACTION: REPORT THIS PERSON AS FOUND BY VOLUNTEER OR POLICE */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🤝</span>
                    <span>Have you found or located this person?</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Upload the found person's photo and exact current location so the admin can compare both photos and verify.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFoundForm(!showFoundForm)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0"
                >
                  {showFoundForm ? 'Cancel' : 'Report Person Found'}
                </button>
              </div>

              {showFoundForm && (
                <form onSubmit={handleSubmitFound} className="pt-2 space-y-2.5 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Current Location Where Person Found *"
                      value={foundLocation}
                      onChange={(e) => setFoundLocation(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                    <input
                      type="url"
                      placeholder="Found Person Photo URL (Direct Link)"
                      value={foundPhotoUrl}
                      onChange={(e) => setFoundPhotoUrl(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (Volunteer / Police / Good Samaritan)"
                      value={finderName}
                      onChange={(e) => setFinderName(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Your Contact Phone (optional)"
                      value={finderContact}
                      onChange={(e) => setFinderContact(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Condition of person (safe, receiving first aid, at police booth)..."
                    value={foundNotes}
                    onChange={(e) => setFoundNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingFound}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs disabled:opacity-50"
                    >
                      {submittingFound ? 'Saving...' : 'Submit Found Details for Admin Verification'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Secure Report-Linked Messaging */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>💬</span>
                <span>Case Verification & Secure Communication</span>
              </h4>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {(!report.messages || report.messages.length === 0) ? (
                  <p className="text-[11px] text-slate-400 italic">No notes in this case thread yet.</p>
                ) : (
                  report.messages.map((m, i) => (
                    <div
                      key={m.messageId || i}
                      className={`p-2.5 rounded-xl text-xs space-y-1 ${
                        m.senderRole === 'admin'
                          ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-500/20 text-teal-950 dark:text-teal-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold">{m.senderName} ({m.senderRole})</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              {isAuthorized ? (
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    required
                    placeholder="Type private case update..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              ) : (
                <p className="text-[10px] text-slate-400 italic">
                  * Unlock with your Secret Access Key to message directly with administration.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
