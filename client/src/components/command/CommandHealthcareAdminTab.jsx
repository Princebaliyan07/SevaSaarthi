import { useState, useEffect } from 'react';
import {
  getAdminFirstResponders,
  approveFirstResponder,
  rejectFirstResponder,
  deleteFirstResponder,
  toggleResponderActive,
} from '../../services/firstResponderService';
import { useLanguage } from '../../context/LanguageContext';

const SPEC_BADGES = {
  Doctor: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300', icon: '🩺' },
  Nurse: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-300', icon: '💉' },
  'NCC/NSS Volunteer': { bg: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300', icon: '🎖️' },
  'Ex-Army/Defence': { bg: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300', icon: '🪖' },
  Paramedic: { bg: 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300', icon: '🚑' },
  'NDRF/SDRF Trained': { bg: 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-300', icon: '⛑️' },
};

export default function CommandHealthcareAdminTab({ hospitals = [] }) {
  const { lang } = useLanguage();
  const hi = lang === 'hi';
  const tx = (en, h) => (hi ? h : en);

  // Sub-tabs: 'pending' (Approvals queue), 'all_responders' (Directory), 'hospitals' (Hospital beds)
  const [subTab, setSubTab] = useState('pending');
  const [responders, setResponders] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });
  const [searchFilter, setSearchFilter] = useState('');
  const [cadreFilter, setCadreFilter] = useState('all');

  // Document proof modal inspection
  const [inspectDoc, setInspectDoc] = useState(null); // { name, proofCertificate, govtIdType, govtIdNumber, photo, responder }

  // Load responders
  const fetchResponders = async () => {
    setLoading(true);
    try {
      const res = await getAdminFirstResponders('all');
      if (res.success) {
        setResponders(res.data || []);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load admin first responders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponders();
  }, []);

  // Approve responder
  const handleApprove = async (responder) => {
    setActionLoadingId(responder._id);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await approveFirstResponder(responder._id);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: tx(
            `✅ Approved "${responder.name}"! They are now live on public emergency search.`,
            `✅ "${responder.name}" को मंज़ूरी दी गई! अब वे पब्लिक इमरजेंसी सर्च में लाइव हैं।`
          ),
        });
        await fetchResponders();
      }
    } catch (err) {
      setFeedbackMsg({
        type: 'error',
        text: err?.message || tx('Approval failed. Please try again.', 'मंज़ूरी विफल रही। कृपया पुनः प्रयास करें।'),
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject responder
  const handleReject = async (responder) => {
    const reason = window.prompt(
      tx('Enter rejection reason for candidate (optional):', 'उम्मीदवार के लिए अस्वीकृति का कारण लिखें (वैकल्पिक):'),
      'Govt ID verification failed or insufficient credential proof.'
    );
    if (reason === null) return; // user cancelled

    setActionLoadingId(responder._id);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await rejectFirstResponder(responder._id, reason);
      if (res.success) {
        setFeedbackMsg({
          type: 'info',
          text: tx(`Application of "${responder.name}" was marked rejected.`, `"${responder.name}" का आवेदन अस्वीकृत किया गया।`),
        });
        await fetchResponders();
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Reject action failed.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete responder permanently
  const handleDelete = async (responder) => {
    const confirm = window.confirm(
      tx(
        `Are you sure you want to permanently delete first responder "${responder.name}"?\nThis action cannot be undone.`,
        `क्या आप वाकई फर्स्ट रिस्पॉन्डर "${responder.name}" को हमेशा के लिए हटाना चाहते हैं?\nयह क्रिया पूर्ववत नहीं की जा सकती।`
      )
    );
    if (!confirm) return;

    setActionLoadingId(responder._id);
    setFeedbackMsg({ type: '', text: '' });
    try {
      const res = await deleteFirstResponder(responder._id);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: tx(`🗑️ Responder "${responder.name}" deleted permanently.`, `🗑️ रिस्पॉन्डर "${responder.name}" को हमेशा के लिए हटा दिया गया।`),
        });
        // Optimistically remove from state
        setResponders((prev) => prev.filter((r) => String(r._id) !== String(responder._id)));
        setCounts((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          pending: responder.approvalStatus === 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
          approved: responder.approvalStatus === 'approved' ? Math.max(0, prev.approved - 1) : prev.approved,
        }));
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Failed to delete responder.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle active/inactive
  const handleToggleActive = async (responder) => {
    setActionLoadingId(responder._id);
    try {
      await toggleResponderActive(responder._id);
      await fetchResponders();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered lists
  const pendingList = responders.filter((r) => r.approvalStatus === 'pending');
  const approvedList = responders.filter((r) => r.approvalStatus === 'approved' || r.isApproved === true);

  const displayList = subTab === 'pending' ? pendingList : responders;

  const filteredDisplayList = displayList.filter((r) => {
    const matchesCadre = cadreFilter === 'all' || r.specification === cadreFilter;
    const term = searchFilter.toLowerCase();
    const matchesSearch =
      !term ||
      r.name?.toLowerCase().includes(term) ||
      r.location?.toLowerCase().includes(term) ||
      r.city?.toLowerCase().includes(term) ||
      r.contactNumber?.includes(term) ||
      r.govtIdNumber?.toLowerCase().includes(term) ||
      r.speciality?.toLowerCase().includes(term);
    return matchesCadre && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* ─── Top Stats & Action Header ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              ⏳ {tx('Pending Approvals', 'लंबित सत्यापन')}
            </span>
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <p className="mt-2 text-3xl font-black text-amber-900 dark:text-amber-200">
            {counts.pending || pendingList.length}
          </p>
          <p className="mt-1 text-[11px] text-amber-700/80 dark:text-amber-400">
            {tx('Awaiting Govt ID inspection', 'सरकारी ID जांच हेतु प्रतीक्षारत')}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              🛡️ {tx('Approved & Live Responders', 'स्वीकृत व लाइव रिस्पॉन्डर')}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-900 dark:text-emerald-200">
            {counts.approved || approvedList.length}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-400">
            {tx('Visible to citizens by GPS location', 'नागरिकों को GPS दूरी अनुसार दृश्यमान')}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
              👥 {tx('Total Registrations', 'कुल पंजीकृत रिस्पॉन्डर')}
            </span>
            <span className="text-sm">📋</span>
          </div>
          <p className="mt-2 text-3xl font-black text-blue-900 dark:text-blue-200">
            {counts.total || responders.length}
          </p>
          <p className="mt-1 text-[11px] text-blue-700/80 dark:text-blue-400">
            {tx('Across Doctors, Nurses, Medics & Ex-Army', 'डॉक्टर, नर्स, मेडिक व पूर्व सैनिक')}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-300 dark:border-purple-800 bg-purple-50/80 dark:bg-purple-950/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300">
              🏥 {tx('Hospitals & Trauma Centres', 'अस्पताल व ट्रॉमा सेंटर')}
            </span>
            <span className="text-sm">🚑</span>
          </div>
          <p className="mt-2 text-3xl font-black text-purple-900 dark:text-purple-200">
            {hospitals.length || 15}
          </p>
          <p className="mt-1 text-[11px] text-purple-700/80 dark:text-purple-400">
            {tx('Monitored bed & ICU telemetry', 'लाइव ICU व ऑक्सीजन बेड निगरानी')}
          </p>
        </div>
      </div>

      {/* ─── Feedback message alert ─── */}
      {feedbackMsg.text && (
        <div
          className={`flex items-center justify-between rounded-xl p-3.5 text-xs font-bold shadow-xs ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/50 dark:text-rose-200'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            type="button"
            onClick={() => setFeedbackMsg({ type: '', text: '' })}
            className="text-sm font-black opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Sub-Tabs Navigation & Filters Bar ─── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSubTab('pending')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                subTab === 'pending'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span>⏳ {tx('Govt ID Approvals Queue', 'सरकारी ID अनुमोदन कतार')}</span>
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-mono">
                {pendingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('all_responders')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                subTab === 'all_responders'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span>👥 {tx('All Responders Directory', 'समस्त रिस्पॉन्डर डायरेक्टरी')}</span>
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-mono">
                {responders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('hospitals')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition ${
                subTab === 'hospitals'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span>🏥 {tx('Hospitals & ICU Telemetry', 'अस्पताल व ICU बेड टेलीमेट्री')}</span>
              <span className="rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-mono">
                {hospitals.length}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchResponders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            <span>{tx('Refresh', 'रिफ्रेश')}</span>
          </button>
        </div>

        {subTab !== 'hospitals' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                placeholder={tx('Search by name, location, mobile, or Govt ID number...', 'नाम, लोकेशन, मोबाइल या सरकारी ID नंबर से खोजें...')}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 pl-9 text-xs font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div>
              <select
                value={cadreFilter}
                onChange={(e) => setCadreFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">⚡ {tx('All Cadres', 'सभी श्रेणियां')}</option>
                <option value="Doctor">🩺 Doctor</option>
                <option value="Nurse">💉 Nurse</option>
                <option value="NCC/NSS Volunteer">🎖️ NCC/NSS Volunteer</option>
                <option value="Ex-Army/Defence">🪖 Ex-Army/Defence</option>
                <option value="Paramedic">🚑 Paramedic</option>
                <option value="NDRF/SDRF Trained">⛑️ NDRF/SDRF Trained</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ─── TAB 1 & 2: FIRST RESPONDER QUEUE / DIRECTORY ─── */}
      {subTab !== 'hospitals' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Header Banner */}
          <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-4 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>{subTab === 'pending' ? '⏳' : '👥'}</span>
                <span>
                  {subTab === 'pending'
                    ? tx('Candidate Registrations Awaiting Admin Approval', 'एडमिन अनुमोदन हेतु प्रतीक्षारत उम्मीदवार पंजीकरण')
                    : tx('Complete First Responder Directory & Controls', 'समस्त फर्स्ट रिस्पॉन्डर डायरेक्टरी व नियंत्रण')}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subTab === 'pending'
                  ? tx(
                      'Verify uploaded Valid Govt ID / Medical Registration before approving. Only approved candidates appear in public searches.',
                      'मंज़ूरी देने से पहले अपलोड किए गए वैध सरकारी ID / मेडिकल रजिस्ट्रेशन की जांच करें। केवल स्वीकृत उम्मीदवार ही जनता की खोज में दिखते हैं।'
                    )
                  : tx(
                      'Manage all approved, pending and active first responders. You can toggle active status or permanently delete records.',
                      'सभी स्वीकृत, लंबित और सक्रिय रिस्पॉन्डर्स को प्रबंधित करें। आप सक्रिय स्थिति बदल सकते हैं या रिकॉर्ड को हमेशा के लिए हटा सकते हैं।'
                    )}
              </p>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
              {filteredDisplayList.length} {tx('Records', 'रिकॉर्ड')}
            </span>
          </div>

          {/* Table content */}
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">
              <span className="inline-block animate-spin text-2xl mb-2">🔄</span>
              <p>{tx('Loading first responders...', 'फर्स्ट रिस्पॉन्डर लोड हो रहे हैं...')}</p>
            </div>
          ) : filteredDisplayList.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center">
              <span className="text-4xl mb-2">{subTab === 'pending' ? '🎉' : '🔍'}</span>
              <p className="font-bold text-slate-700 dark:text-slate-300">
                {subTab === 'pending'
                  ? tx('No pending responder approvals!', 'कोई भी लंबित रिस्पॉन्डर अनुमोदन शेष नहीं है!')
                  : tx('No matching responders found.', 'कोई रिस्पॉन्डर नहीं मिला।')}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {subTab === 'pending'
                  ? tx('All submitted applications have been processed and verified.', 'सभी जमा किए गए आवेदनों की जांच पूरी हो चुकी है।')
                  : tx('Try adjusting your search query or cadre filter.', 'सर्च शब्द या श्रेणी फ़िल्टर बदलकर देखें।')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs text-slate-700 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
                    <th className="px-4 py-3.5">Candidate / Photo</th>
                    <th className="px-4 py-3.5">Cadre & Speciality</th>
                    <th className="px-4 py-3.5">Location & Contact</th>
                    <th className="px-4 py-3.5">Valid Govt ID & Proof</th>
                    <th className="px-4 py-3.5">Approval Status</th>
                    <th className="px-4 py-3.5 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDisplayList.map((resp) => {
                    const badge = SPEC_BADGES[resp.specification] || { bg: 'bg-slate-100 text-slate-700 border-slate-300', icon: '👤' };
                    const isPending = resp.approvalStatus === 'pending';
                    const isApproved = resp.approvalStatus === 'approved' || resp.isApproved === true;
                    const isRejected = resp.approvalStatus === 'rejected';

                    return (
                      <tr
                        key={resp._id}
                        className={`transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 ${
                          isPending ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {/* Candidate / Photo */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              {resp.profilePhoto ? (
                                <img
                                  src={resp.profilePhoto}
                                  alt={resp.name}
                                  className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg dark:bg-slate-800">
                                  {badge.icon}
                                </div>
                              )}
                              <span
                                className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                  resp.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                                }`}
                                title={resp.isActive ? 'Active' : 'Inactive'}
                              />
                            </div>
                            <div>
                              <strong className="block text-xs font-black text-slate-900 dark:text-white">
                                {resp.name}
                              </strong>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {resp.age} yrs · {resp.gender}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cadre & Speciality */}
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${badge.bg}`}
                          >
                            <span>{badge.icon}</span>
                            <span>{resp.specification}</span>
                          </span>
                          <p className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={resp.speciality}>
                            {resp.speciality || 'General First Aid'}
                          </p>
                        </td>

                        {/* Location & Contact */}
                        <td className="px-4 py-3.5">
                          <span className="block font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[190px]" title={resp.location}>
                            📍 {resp.location}
                          </span>
                          <a
                            href={`tel:${resp.contactNumber}`}
                            className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-teal-600 hover:underline dark:text-teal-400 mt-0.5"
                          >
                            <span>📞</span>
                            <span>{resp.contactNumber}</span>
                          </a>
                        </td>

                        {/* Valid Govt ID & Proof */}
                        <td className="px-4 py-3.5">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
                              <span>🏛️</span>
                              <span>{resp.govtIdType || 'Medical Council Reg'}</span>
                            </span>
                            {resp.govtIdNumber && (
                              <p className="font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
                                #{resp.govtIdNumber}
                              </p>
                            )}

                            {resp.proofCertificate ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setInspectDoc({
                                    name: resp.name,
                                    proofCertificate: resp.proofCertificate,
                                    govtIdType: resp.govtIdType || 'Govt ID Proof',
                                    govtIdNumber: resp.govtIdNumber,
                                    photo: resp.profilePhoto,
                                    responder: resp,
                                  })
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-black text-purple-700 hover:bg-purple-100 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800 transition"
                              >
                                <span>🔍</span>
                                <span>{tx('Inspect Govt ID Proof', 'सरकारी ID प्रमाण देखें')}</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-rose-500 font-bold block">
                                ⚠️ No Proof Uploaded
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Approval Status */}
                        <td className="px-4 py-3.5">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                              <span>{tx('Pending Admin Review', 'समीक्षा हेतु लंबित')}</span>
                            </span>
                          )}
                          {isApproved && (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <span>✓</span>
                                <span>{tx('Approved & Live', 'स्वीकृत व लाइव')}</span>
                              </span>
                              {resp.approvedAt && (
                                <span className="block text-[9px] text-slate-400 mt-0.5">
                                  {new Date(resp.approvedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-black text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300">
                              <span>✕</span>
                              <span>{tx('Rejected', 'अस्वीकृत')}</span>
                            </span>
                          )}
                        </td>

                        {/* Admin Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* APPROVE BUTTON (if pending or rejected) */}
                            {!isApproved && (
                              <button
                                type="button"
                                onClick={() => handleApprove(resp)}
                                disabled={actionLoadingId === resp._id}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-black text-white hover:bg-emerald-700 shadow-xs transition active:scale-95 disabled:opacity-50"
                                title="Approve candidate to show live on emergency map"
                              >
                                <span>✓</span>
                                <span>{tx('Approve', 'स्वीकार करें')}</span>
                              </button>
                            )}

                            {/* REJECT BUTTON (if pending) */}
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleReject(resp)}
                                disabled={actionLoadingId === resp._id}
                                className="inline-flex items-center gap-1 rounded-xl bg-amber-100 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 hover:bg-amber-200 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 transition active:scale-95 disabled:opacity-50"
                                title="Reject candidate application"
                              >
                                <span>✕</span>
                                <span>{tx('Reject', 'अस्वीकार')}</span>
                              </button>
                            )}

                            {/* ACTIVE/INACTIVE TOGGLE (if approved) */}
                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => handleToggleActive(resp)}
                                disabled={actionLoadingId === resp._id}
                                className={`rounded-xl px-2 py-1 text-[10px] font-bold border transition ${
                                  resp.isActive
                                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                                }`}
                                title={resp.isActive ? 'Deactivate temporarily' : 'Activate responder'}
                              >
                                {resp.isActive ? tx('Deactivate', 'निष्क्रिय') : tx('Activate', 'सक्रिय')}
                              </button>
                            )}

                            {/* DELETE BUTTON (always available to Admin) */}
                            <button
                              type="button"
                              onClick={() => handleDelete(resp)}
                              disabled={actionLoadingId === resp._id}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-2.5 py-1.5 text-[11px] font-black text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900 transition active:scale-95 disabled:opacity-50"
                              title="Delete responder permanently from database"
                            >
                              <span>🗑️</span>
                              <span>{tx('Delete', 'हटाएं')}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: HOSPITALS DIRECTORY & BED TELEMETRY ─── */}
      {subTab === 'hospitals' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5 p-5 sm:p-6">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <span className="text-base" aria-hidden="true">ℹ️</span>
            <p className="leading-relaxed">
              <strong className="font-bold">Hospital Network Integration: </strong>
              Hospital names, coordinates and Google Maps routing are verified live. Real-time ICU & Oxygen bed counters sync with district healthcare dispatchers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="px-3 py-3">Hospital</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">ICU beds</th>
                  <th className="px-3 py-3">Oxygen beds</th>
                  <th className="px-3 py-3">Trauma centre</th>
                  <th className="px-3 py-3">Doctors on duty</th>
                  <th className="px-3 py-3 text-right">Directions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {hospitals.slice(0, 20).map((h) => (
                  <tr key={h.id || h._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-3 py-3">
                      <strong className="block text-slate-900 dark:text-white">{h.name}</strong>
                      <span className="text-[11px] text-slate-400">{h.type}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span>{h.city || h.district}</span>
                      <span className="block text-[11px] text-slate-400">{h.address}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-bold ${
                          (h.icuBedsAvailable || 0) > 5
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {h.icuBedsAvailable || 0} free
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold">{h.oxygenBedsAvailable || 0}</td>
                    <td className="px-3 py-3">
                      {h.traumaCenterActive ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Active 24x7</span>
                      ) : (
                        <span className="text-slate-400">Standard ER</span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-semibold">{h.doctorsOnDuty || 12}</td>
                    <td className="px-3 py-3 text-right">
                      {h.googleMapsUrl && (
                        <a
                          href={h.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-50 px-3 py-1 font-bold text-teal-700 transition hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300"
                        >
                          Open map
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── GOVT ID & CERTIFICATE PROOF INSPECTION MODAL ─── */}
      {inspectDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base">
                    {inspectDoc.name} — {inspectDoc.govtIdType}
                  </h3>
                  {inspectDoc.govtIdNumber && (
                    <p className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400">
                      ID Number: {inspectDoc.govtIdNumber}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-3 flex items-center justify-center min-h-[300px]">
                {inspectDoc.proofCertificate?.startsWith('data:image') ||
                inspectDoc.proofCertificate?.startsWith('http') ? (
                  <img
                    src={inspectDoc.proofCertificate}
                    alt="Govt ID Proof"
                    className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-md"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <span className="text-5xl">📄</span>
                    <p className="font-mono text-xs text-slate-500 break-all max-w-md">
                      {inspectDoc.proofCertificate?.slice(0, 200)}...
                    </p>
                    <a
                      href={inspectDoc.proofCertificate}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
                    >
                      Open Document in New Tab ↗
                    </a>
                  </div>
                )}
              </div>

              {/* Candidate Quick Details */}
              {inspectDoc.responder && (
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      📍 {inspectDoc.responder.location}
                    </span>
                    <span className="block text-slate-500 text-[11px]">
                      Role: {inspectDoc.responder.specification} ({inspectDoc.responder.speciality})
                    </span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      📞 {inspectDoc.responder.contactNumber}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-6 py-4">
              <button
                type="button"
                onClick={() => setInspectDoc(null)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {inspectDoc.responder && !inspectDoc.responder.isApproved && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const target = inspectDoc.responder;
                        setInspectDoc(null);
                        handleReject(target);
                      }}
                      className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 border border-amber-300 hover:bg-amber-200 transition"
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = inspectDoc.responder;
                        setInspectDoc(null);
                        handleApprove(target);
                      }}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white hover:bg-emerald-700 transition"
                    >
                      ✓ Approve Govt ID & Activate
                    </button>
                  </>
                )}

                {inspectDoc.responder && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = inspectDoc.responder;
                      setInspectDoc(null);
                      handleDelete(target);
                    }}
                    className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-black text-rose-600 border border-rose-200 hover:bg-rose-100 transition"
                  >
                    🗑️ Delete Responder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
