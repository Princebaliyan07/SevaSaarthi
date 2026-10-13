import { useState, useEffect } from 'react';
import { getReportDetails, submitPossibleMatch, sendReportMessage } from '../../services/melaService';

export default function ReportDetailModal({
  reportId,
  isOpen,
  onClose,
  isAdmin = false,
  onStatusUpdated = null,
  initialOpenFound = false,
  lang = 'en',
}) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [keyNotice, setKeyNotice] = useState(null); // { type: 'error' | 'warning' | 'info', text: string }

  // Found Person Intake Form
  const [showFoundForm, setShowFoundForm] = useState(initialOpenFound);
  const [foundLocation, setFoundLocation] = useState('');
  const [foundPhotoUrl, setFoundPhotoUrl] = useState('');
  const [finderName, setFinderName] = useState('');
  const [finderContact, setFinderContact] = useState('');
  const [foundNotes, setFoundNotes] = useState('');
  const [submittingFound, setSubmittingFound] = useState(false);
  const [issuedFinderKey, setIssuedFinderKey] = useState('');

  // Private chat message
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (isOpen && reportId) {
      if (initialOpenFound) setShowFoundForm(true);
      loadReportData();
    }
  }, [isOpen, reportId, initialOpenFound]);

  const loadReportData = async (key = '') => {
    setLoading(true);
    setKeyNotice(null);
    try {
      const data = await getReportDetails(reportId, key || secretKeyInput);
      setReport(data);
      setIsAuthorized(Boolean(data.isAuthorizedViewer || isAdmin));

      if (data.finderStatusPending) {
        if (data.finderVerificationState === 'rejected') {
          setKeyNotice({
            type: 'error',
            text: lang === 'hi'
              ? '❌ एडमिन ने इस मैच को अस्वीकार (Rejected) कर दिया है। गुप्त कुंजी (Secret Key) अमान्य हो गई है और संपर्क विवरण नहीं देखा जा सकता।'
              : '❌ Admin has rejected this match. Your Secret Key is invalid and contact details remain locked.',
          });
        } else {
          setKeyNotice({
            type: 'warning',
            text: lang === 'hi'
              ? '⏳ आपकी रिपोर्ट दर्ज है! परंतु एडमिन द्वारा "Verified Match" अनुमोदित होने के बाद ही यह सीक्रेट की परिवार के नंबर को अनलॉक करेगी।'
              : '⏳ Found report recorded! This Secret Key will unlock family contact details once Admin reviews both photos and approves "Verified Match".',
          });
        }
      }
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
      alert(lang === 'hi' ? 'कृपया बताएं कि व्यक्ति कहां मिला।' : 'Please provide the location where the person was found.');
      return;
    }
    setSubmittingFound(true);
    try {
      const res = await submitPossibleMatch(reportId, {
        foundLocation: foundLocation.trim(),
        foundPhotoUrl: foundPhotoUrl.trim(),
        finderName: finderName.trim() || 'Volunteer / Police Post',
        finderContact: finderContact.trim(),
        notes: foundNotes.trim(),
      });
      if (res?.finderSecretKey) {
        setIssuedFinderKey(res.finderSecretKey);
      }
      setShowFoundForm(false);
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
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-2xl my-4 sm:my-6 rounded-3xl bg-white p-5 sm:p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
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
                  <div className="relative w-full h-48 bg-slate-950/90 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                    {report.photoUrl ? (
                      <img
                        src={report.photoUrl}
                        alt="Photo when missing"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 space-y-1 p-4">
                        <span className="text-3xl">👤</span>
                        <span className="text-[10px] font-semibold">No photo provided at filing</span>
                      </div>
                    )}
                  </div>
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
                  <div className="relative w-full h-48 bg-slate-950/90 rounded-xl overflow-hidden border border-emerald-500/30 flex items-center justify-center">
                    {report.foundPhotoUrl ? (
                      <img
                        src={report.foundPhotoUrl}
                        alt="Photo when found"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 space-y-1 p-4">
                        <span className="text-3xl">🔍</span>
                        <span className="text-[10px] font-semibold">Awaiting found photo upload</span>
                      </div>
                    )}
                  </div>
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

            {/* Finder Key Issued Banner */}
            {issuedFinderKey && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-2 border-emerald-400 text-emerald-950 dark:text-emerald-200 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <h4 className="font-black text-xs text-emerald-900 dark:text-emerald-100">
                      {lang === 'hi' ? 'सूचना दर्ज! आपकी गुप्त कुंजी (Finder Secret Key):' : 'Found Report Saved! Your Finder Secret Key:'}
                    </h4>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      {lang === 'hi'
                        ? 'कृपया इस कुंजी को सुरक्षित रखें। जब एडमिन दोनों फ़ोटो मिलाकर "Verified Match" पर मंज़ूरी देगा, तभी यह कुंजी परिवार के नंबर को खोलेगी। यदि एडमिन अस्वीकार (Reject) करेगा तो यह काम नहीं करेगी।'
                        : 'Keep this key safe. Once Admin verifies the match against missing records, this key will unlock the family contact details. If Admin rejects the match, access remains locked.'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-emerald-400/60 font-mono text-sm font-black text-emerald-700 dark:text-emerald-300 select-all">
                  <span>🔑</span>
                  <span className="flex-1">{issuedFinderKey}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(issuedFinderKey);
                      alert(lang === 'hi' ? 'सीक्रेट कुंजी कॉपी हो गई!' : 'Secret Key copied to clipboard!');
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {lang === 'hi' ? 'कॉपी' : 'Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* Notice when secret key is entered but status is not yet Verified Match */}
            {keyNotice && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-start gap-2.5 ${
                  keyNotice.type === 'error'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-200'
                    : 'bg-amber-50 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200'
                }`}
              >
                <span className="text-base shrink-0">{keyNotice.type === 'error' ? '🛑' : '⏳'}</span>
                <p className="leading-relaxed">{keyNotice.text}</p>
              </div>
            )}

            {/* Private Contact Isolation Box */}
            {isAuthorized ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] flex items-center gap-1.5">
                    <span>🔓</span>
                    <span>Safeguarded Contact Vault (Authorized Access)</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                    Case: {report.status}
                  </span>
                </div>

                {/* If verified match or resolved, reveal contact number with direct call option */}
                {isAdmin || report.status === 'Verified Match' || report.status === 'Resolved' ? (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 space-y-1">
                    <p className="text-xs">
                      <span className="font-semibold text-slate-500">Family Reporter:</span>{' '}
                      <strong className="text-slate-900 dark:text-white">{report.reporterName}</strong>
                    </p>
                    <p className="text-xs flex items-center justify-between">
                      <span>
                        <span className="font-semibold text-slate-500">Phone Number:</span>{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          {report.reporterPhone || 'Not provided'}
                        </strong>
                      </span>
                      {report.reporterPhone && (
                        <a
                          href={`tel:${report.reporterPhone}`}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
                        >
                          <span>📞</span>
                          <span>Call Family Directly</span>
                        </a>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
                    <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                      <span>🔒</span>
                      <span>Phone Number Encrypted Until Official Match Verification</span>
                    </div>
                    <p>
                      In accordance with citizen privacy guidelines, the family's contact phone number remains strictly masked until an administrative officer marks this case as <strong>Verified Match</strong>.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>🔒</span> {lang === 'hi' ? 'कॉन्टैक्ट्स सुरक्षित' : 'Reporter Contacts Protected'}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'hi'
                      ? 'क्या आप परिवार या खोजकर्ता हैं? विवरण अनलॉक करने के लिए Secret Key डालें (केवल एडमिन अनुमोदन के बाद कार्य करेगी)।'
                      : 'Are you the family or finder? Enter your Secret Key (unlocks contacts once Admin approves match).'}
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
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Current Location Where Person Found *"
                      value={foundLocation}
                      onChange={(e) => setFoundLocation(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 text-xs"
                    />

                    {/* Photo File Picker for Found Person */}
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <span>📸</span>
                          <span>Upload Found Person Photo (For Admin Verification)</span>
                        </span>
                        {foundPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setFoundPhotoUrl('')}
                            className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>🗑️</span>
                            <span>Remove Photo</span>
                          </button>
                        )}
                      </div>

                      {foundPhotoUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={foundPhotoUrl}
                            alt="Found preview"
                            className="h-14 w-14 object-cover rounded-lg border border-emerald-500/50 shadow-xs"
                          />
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ Found photo ready for admin comparison
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <label className="flex-1 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800 cursor-pointer text-[11px] text-slate-600 dark:text-slate-300 font-semibold transition-all">
                            <span>📁 Choose Photo from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert('Photo size exceeds 5MB. Please choose a smaller image.');
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onloadend = () => setFoundPhotoUrl(reader.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <span className="text-[10px] text-slate-400">or</span>
                          <input
                            type="url"
                            placeholder="Paste image URL..."
                            value={foundPhotoUrl}
                            onChange={(e) => setFoundPhotoUrl(e.target.value)}
                            className="flex-1 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1.5 text-xs"
                          />
                        </div>
                      )}
                    </div>
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
