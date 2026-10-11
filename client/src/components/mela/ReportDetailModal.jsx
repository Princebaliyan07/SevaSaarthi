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

  // Match submission state
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [candidateId, setCandidateId] = useState('');
  const [matchNotes, setMatchNotes] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [submittingMatch, setSubmittingMatch] = useState(false);

  // Private chat message state
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && reportId) {
      loadReportData();
    }
  }, [isOpen, reportId]);

  const loadReportData = async (key = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportDetails(reportId, key || secretKeyInput);
      setReport(data);
      setIsAuthorized(Boolean(data.isAuthorizedViewer || isAdmin));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockWithKey = (e) => {
    e.preventDefault();
    if (!secretKeyInput.trim()) return;
    loadReportData(secretKeyInput.trim());
  };

  const handleSubmitMatch = async (e) => {
    e.preventDefault();
    if (!candidateId.trim() && !matchNotes.trim()) return;
    setSubmittingMatch(true);
    try {
      await submitPossibleMatch(reportId, {
        candidateReportRefId: candidateId.trim(),
        notes: matchNotes.trim(),
        claimantName: claimantName.trim(),
      });
      setShowMatchForm(false);
      setCandidateId('');
      setMatchNotes('');
      await loadReportData();
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      alert(`Could not submit match claim: ${err.message}`);
    } finally {
      setSubmittingMatch(false);
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
        senderName: isAdmin ? 'Admin Desk' : 'Reporter',
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

  const STATUS_COLORS = {
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
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
              {report?.reportRefId || reportId}
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                STATUS_COLORS[report?.status] || STATUS_COLORS.Submitted
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
          <div className="py-12 text-center text-xs text-slate-400">Loading verified case file...</div>
        ) : !report ? (
          <div className="py-12 text-center text-xs text-rose-500">Report not found.</div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Top Overview Cards */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {report.personName || report.itemDescription || 'Incident Record'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    📍 {report.location} · ⏰ {report.dateTimeApprox}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">
                  {report.reportType.replace('_', ' ')}
                </span>
              </div>

              {/* Specific Details */}
              {report.clothingDescription && (
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Clothing / Attire: </span>
                  {report.clothingDescription}
                </p>
              )}
              {report.distinguishingFeatures && (
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Identifying Marks: </span>
                  {report.distinguishingFeatures}
                </p>
              )}
              {report.itemCategory && (
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Category: </span>
                  {report.itemCategory}
                </p>
              )}
            </div>

            {/* Private Contact Isolation Box */}
            {isAuthorized ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-1">
                <span className="font-bold text-[11px] block">
                  🔓 Authorized Contact Telemetry (Admin / Owner Verified):
                </span>
                <p>
                  <span className="font-semibold">Reporter Name:</span> {report.reporterName}
                </p>
                <p>
                  <span className="font-semibold">Reporter Phone:</span> {report.reporterPhone}
                </p>
                {report.reporterEmail && (
                  <p>
                    <span className="font-semibold">Email:</span> {report.reporterEmail}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🔒</span> Contact Details Protected
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Are you the reporter of this case? Enter your Secret Access Key to unlock private details and communication.
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

            {/* Possible Match Action */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    🤝 Submit Possible Match Claim
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Recognize this person or item? Submit candidate details for official administrative review without marking as found automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMatchForm(!showMatchForm)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs shrink-0"
                >
                  {showMatchForm ? 'Cancel' : 'Submit Match'}
                </button>
              </div>

              {showMatchForm && (
                <form onSubmit={handleSubmitMatch} className="pt-2 space-y-2.5 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Candidate Report ID (if known, e.g. SR-FNDP-...)"
                      value={candidateId}
                      onChange={(e) => setCandidateId(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Your Name (Claimant)"
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe how the person/item matches (location, time, distinctive marks)..."
                    value={matchNotes}
                    onChange={(e) => setMatchNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingMatch}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs disabled:opacity-50"
                    >
                      {submittingMatch ? 'Submitting...' : 'Send for Admin Verification'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Secure Report-Linked Private Messaging */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>💬</span>
                <span>Secure Case Discussion (Private Thread)</span>
              </h4>

              {/* Messages Feed */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(!report.messages || report.messages.length === 0) ? (
                  <p className="text-[11px] text-slate-400 italic">No messages in this case thread yet.</p>
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

              {/* Send message if authorized */}
              {isAuthorized ? (
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    required
                    placeholder="Type secure private update..."
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
                  * Unlock with your Secret Access Key above to post in this private communication channel.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
