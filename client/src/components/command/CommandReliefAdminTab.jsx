import { useState, useEffect } from 'react';
import {
  getReliefCommandOverview,
  getVolunteerApplications,
  reviewVolunteerApplication,
  getVolunteerTeams,
  reviewVolunteerTeam,
  deleteVolunteerTeam,
  getTeamJoinRequests,
  reviewTeamJoinRequest,
  getReliefCampaigns,
  createReliefCampaign,
  deleteReliefCampaign,
  getReliefSuppliers,
  reviewSupplier,
  getSupplyOrders,
  updateSupplyOrderStatus,
  getAuditLogs,
} from '../../services/volunteerService';
import { PANEL, INPUT, LABEL, BTN, Pill, SectionHead, EmptyState, DataTable, ROW, Tabs } from './commandUi';

const INITIAL_CAMPAIGN = {
  title: '',
  disasterType: 'Flood Relief',
  location: '',
  description: '',
  targetAmount: 250000,
  recipientAgency: 'District Disaster Relief Fund',
  needsText:
    'Clean Drinking Water (2000 Litres), Ready-to-eat Food Packets (1500 Packs), ORS Packets (3000 Sachets)',
  qrCodePhoto: '',
  upiId: '',
};

// Show only the last 4 characters of an ID number in tables (full number stays in the ID preview)
const maskId = (v) => {
  if (!v) return '';
  const s = String(v);
  return s.length > 4 ? `•••• ${s.slice(-4)}` : s;
};

const appTone = (status) => (status === 'Approved' ? 'green' : status === 'Pending' ? 'amber' : 'rose');

export default function CommandReliefAdminTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview | applications | teams | campaigns | suppliers | orders | audits
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data
  const [applications, setApplications] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState(INITIAL_CAMPAIGN);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null); // { title, url, name, idNumber, idType }

  const loadData = async () => {
    setLoading(true);
    try {
      // Fast: campaigns + overview first so the screen appears quickly
      const [ovData, campsData] = await Promise.all([getReliefCommandOverview(), getReliefCampaigns()]);
      setOverview(ovData);
      setCampaigns(campsData || []);
      setLoading(false);

      // Then the rest in the background
      const [appsData, teamsData, reqsData, supsData, ordsData, auditsData] = await Promise.all([
        getVolunteerApplications(),
        getVolunteerTeams(),
        getTeamJoinRequests(),
        getReliefSuppliers(),
        getSupplyOrders(),
        getAuditLogs(),
      ]);
      setApplications(appsData || []);
      setTeams(teamsData || []);
      setTeamRequests(reqsData || []);
      setSuppliers(supsData || []);
      setOrders(ordsData || []);
      setAuditLogs(auditsData || []);
    } catch (err) {
      console.error('Error loading relief command data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------- Handlers ---------- */
  const handleAppReview = async (regId, status) => {
    const notes = prompt(
      `Notes for ${status} application:`,
      status === 'Approved' ? 'Verified by disaster coordinator.' : 'Information mismatch.'
    );
    if (notes === null) return;
    try {
      await reviewVolunteerApplication(regId, { status, adminNotes: notes });
      await loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleTeamReview = async (teamId, verificationStatus) => {
    if (!window.confirm(`Mark team as ${verificationStatus}?`)) return;
    try {
      await reviewVolunteerTeam(teamId, { verificationStatus });
      await loadData();
    } catch (err) {
      alert('Error updating team verification: ' + err.message);
    }
  };

  const handleJoinReqReview = async (requestId, status) => {
    try {
      await reviewTeamJoinRequest(requestId, { status, adminNotes: `Processed as ${status}` });
      await loadData();
    } catch (err) {
      alert('Error updating join request: ' + err.message);
    }
  };

  const handleSupplierReview = async (supplierId, verificationStatus) => {
    if (!window.confirm(`Mark supplier as ${verificationStatus}?`)) return;
    try {
      await reviewSupplier(supplierId, { verificationStatus });
      await loadData();
    } catch (err) {
      alert('Error reviewing supplier: ' + err.message);
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await updateSupplyOrderStatus(orderId, { status });
      await loadData();
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  const handleCreateCampaignSubmit = async (e) => {
    e.preventDefault();
    if (creatingCampaign) return; // prevent double submit
    setCreatingCampaign(true);
    try {
      const verifiedNeeds = newCampaign.needsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((item) => ({
          item,
          requestedQty: 1000,
          fundedQty: 0,
          deliveredQty: 0,
          unit: 'Units',
          unitCost: 50,
        }));

      await createReliefCampaign({
        title: newCampaign.title,
        disasterType: newCampaign.disasterType,
        location: newCampaign.location,
        description: newCampaign.description,
        targetAmount: Number(newCampaign.targetAmount) || 200000,
        recipientAgency: newCampaign.recipientAgency,
        qrCodePhoto: newCampaign.qrCodePhoto || '',
        upiId: newCampaign.upiId || '',
        verifiedNeeds: verifiedNeeds.length
          ? verifiedNeeds
          : [{ item: 'Emergency Kits', requestedQty: 500, fundedQty: 0, deliveredQty: 0, unit: 'kits', unitCost: 100 }],
      });

      setShowCampaignModal(false);
      setNewCampaign({ ...INITIAL_CAMPAIGN, needsText: '' });
      // Only reload campaigns (fast)
      const freshCamps = await getReliefCampaigns();
      setCampaigns(freshCamps || []);
    } catch (err) {
      alert('Could not launch campaign: ' + err.message);
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (
      !window.confirm(
        `Permanently delete team "${teamName || teamId}"?\nThis removes the team and any pending join requests.`
      )
    )
      return;
    try {
      await deleteVolunteerTeam(teamId);
      await loadData();
    } catch (err) {
      alert('Error deleting team: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteCampaign = async (campaignId, campaignTitle) => {
    if (
      !window.confirm(
        `Permanently delete relief campaign "${campaignTitle || campaignId}"?\nThis cannot be undone.`
      )
    )
      return;
    try {
      await deleteReliefCampaign(campaignId);
      await loadData();
    } catch (err) {
      alert('Error deleting campaign: ' + (err.response?.data?.message || err.message));
    }
  };

  /* ---------- Derived ---------- */
  const pendingApps = applications.filter((a) => a.status === 'Pending');
  const pendingJoinCount = teamRequests.filter((r) => r.status === 'Pending' || r.status === 'Pending Review').length;

  const subTabs = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'applications', icon: '📋', label: 'Volunteers', count: pendingApps.length },
    { id: 'teams', icon: '👥', label: 'Teams', count: teams.length },
    { id: 'campaigns', icon: '🎯', label: 'Campaigns', count: campaigns.length },
    { id: 'suppliers', icon: '🏪', label: 'Certified shops', count: suppliers.length },
    { id: 'orders', icon: '📦', label: 'Supply orders', count: orders.length },
    { id: 'audits', icon: '🛡️', label: 'Audit trail' },
  ];

  const metrics = [
    { label: 'Total volunteers', val: overview?.volunteers?.total || applications.length, dot: 'bg-teal-500', num: 'text-teal-600 dark:text-teal-400' },
    { label: 'Verified teams', val: overview?.teams?.verified || teams.filter((t) => t.verificationStatus === 'Verified').length, dot: 'bg-emerald-500', num: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Active campaigns', val: overview?.campaigns?.active || campaigns.length, dot: 'bg-blue-500', num: 'text-blue-600 dark:text-blue-400' },
    { label: 'Funds confirmed', val: `₹${(overview?.campaigns?.totalRaised || 0).toLocaleString('en-IN')}`, dot: 'bg-indigo-500', num: 'text-indigo-600 dark:text-indigo-400' },
    { label: 'Certified shops', val: overview?.suppliers?.verified || suppliers.filter((s) => s.verificationStatus === 'Verified').length, dot: 'bg-amber-500', num: 'text-amber-600 dark:text-amber-400' },
    { label: 'Active deliveries', val: overview?.orders?.active || orders.filter((o) => o.status !== 'Delivered').length, dot: 'bg-rose-500', num: 'text-rose-600 dark:text-rose-400' },
  ];

  return (
    <div className="space-y-5">
      {/* ================= HEADER ================= */}
      <div className={`${PANEL} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6`}>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Disaster relief hub</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Manage volunteers, teams, relief campaigns, certified shops and supply deliveries in one place.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => setShowCampaignModal(true)} className={BTN.primary}>
            + Launch campaign
          </button>
          <button type="button" onClick={loadData} disabled={loading} className={BTN.secondary}>
            {loading ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <Tabs tabs={subTabs} active={activeSubTab} onChange={setActiveSubTab} ariaLabel="Relief sections" />

      {/* ================= OVERVIEW ================= */}
      {activeSubTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {metrics.map((m) => (
              <div key={m.label} className={`${PANEL} p-4`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${m.dot}`} />
                  <span className="text-xs font-semibold leading-tight text-slate-500 dark:text-slate-400">{m.label}</span>
                </div>
                <p className={`mt-2 text-2xl font-extrabold ${m.num}`}>{m.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Pending volunteers */}
            <div className={`${PANEL} space-y-3 p-5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Volunteer applications waiting ({pendingApps.length})
                </h3>
                <button type="button" onClick={() => setActiveSubTab('applications')} className="text-xs font-bold text-teal-600 hover:underline">
                  View all
                </button>
              </div>

              {pendingApps.length === 0 ? (
                <EmptyState icon="✅" title="Nothing waiting for review" />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingApps.slice(0, 4).map((app) => (
                    <div key={app._id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <strong className="block truncate text-xs font-bold text-slate-900 dark:text-white">{app.fullName}</strong>
                        <p className="truncate text-[11px] text-slate-500">
                          {app.city}, {app.district} · {app.skills?.slice(0, 3).join(', ')}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button type="button" onClick={() => handleAppReview(app._id, 'Approved')} className={BTN.success}>
                          Approve
                        </button>
                        <button type="button" onClick={() => handleAppReview(app._id, 'Rejected')} className={BTN.softDanger}>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders in progress */}
            <div className={`${PANEL} space-y-3 p-5`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent supply orders</h3>
                <button type="button" onClick={() => setActiveSubTab('orders')} className="text-xs font-bold text-teal-600 hover:underline">
                  Manage all
                </button>
              </div>

              {orders.length === 0 ? (
                <EmptyState icon="📦" title="No supply orders yet" />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord._id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900 dark:text-white">{ord.orderNumber}</strong>
                          <Pill tone={ord.status === 'Delivered' ? 'green' : 'amber'}>{ord.status}</Pill>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {ord.items?.map((it) => `${it.item} (${it.quantity})`).join(', ')} · To: {ord.deliveryLocation?.dropPoint}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">₹{ord.totalAmount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= VOLUNTEER APPLICATIONS ================= */}
      {activeSubTab === 'applications' && (
        <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
          <SectionHead
            title="Volunteer applications"
            desc="Review volunteer records, skills and identity proofs (ID numbers are masked)."
          >
            <Pill>{applications.length} total</Pill>
          </SectionHead>

          {applications.length === 0 ? (
            <EmptyState icon="📋" title="No applications yet" />
          ) : (
            <DataTable columns={['Applicant', 'Location', 'Skills', 'Identity proof', 'Availability', 'Status', 'Actions']} lastRight minWidth={900}>
              {applications.map((app) => (
                <tr key={app._id} className={ROW}>
                  <td className="px-3 py-3">
                    <strong className="block font-bold text-slate-900 dark:text-white">{app.fullName}</strong>
                    <span className="text-[11px] text-slate-400">{app.mobileNumber || 'Number hidden'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span>{app.city}, {app.district}</span>
                    <span className="block text-[11px] text-slate-400">{app.state} · {app.pincode}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {app.skills?.map((sk, idx) => (
                        <span key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold dark:bg-slate-800">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      {app.maskedIdentityNumber || 'Proof submitted'}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-600">{app.idType || 'Aadhaar / Govt ID'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="block font-semibold">{app.availabilityType}</span>
                    <span className="text-[11px] text-slate-400">{app.emergencyAvailability ? '⚡ Ready for emergencies' : 'Standard'}</span>
                  </td>
                  <td className="px-3 py-3">
                    <Pill tone={appTone(app.status)}>{app.status}</Pill>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {app.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => handleAppReview(app._id, 'Approved')} className={BTN.success}>
                          Approve
                        </button>
                        <button type="button" onClick={() => handleAppReview(app._id, 'Rejected')} className={BTN.softDanger}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= TEAMS ================= */}
      {activeSubTab === 'teams' && (
        <div className="space-y-5">
          <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
            <SectionHead title="Volunteer teams" desc="Verify new relief teams and check their size." />

            {teams.length === 0 ? (
              <EmptyState icon="👥" title="No teams registered yet" />
            ) : (
              <DataTable columns={['Team', 'Location', 'Members', 'Leader', 'Status', 'Verification', 'Actions']} lastRight minWidth={980}>
                {teams.map((tm) => (
                  <tr key={tm._id} className={ROW}>
                    <td className="px-3 py-3">
                      <strong className="block font-bold text-slate-900 dark:text-white">{tm.name}</strong>
                      <span className="text-[11px] text-slate-400">{tm.skills?.join(', ')}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span>{tm.location}</span>
                      <span className="block text-[11px] text-slate-400">{tm.serviceArea}</span>
                    </td>
                    <td className="px-3 py-3 font-mono">
                      <strong className="text-slate-900 dark:text-white">{tm.activeMembers || 1}</strong> / {tm.capacity || 50}
                    </td>
                    <td className="px-3 py-3">
                      <span className="block font-bold text-slate-900 dark:text-white">{tm.leaderName || 'Coordinator'}</span>
                      {tm.aadhaarNumber && (
                        <span className="block font-mono text-[11px] text-teal-700 dark:text-teal-300">
                          🆔 {tm.idProofType || 'Aadhaar'}: {maskId(tm.aadhaarNumber)}
                        </span>
                      )}
                      {tm.idProofPhoto && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImageModal({
                              title: `Leader ID proof: ${tm.name}`,
                              url: tm.idProofPhoto,
                              name: tm.leaderName,
                              idType: tm.idProofType || 'Aadhaar Card',
                              idNumber: tm.aadhaarNumber,
                            })
                          }
                          className="mt-1 inline-flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                        >
                          🖼️ View ID photo
                        </button>
                      )}
                      {tm.registrationDocRef && (
                        <span className="block font-mono text-[11px] text-slate-400">Ref: {tm.registrationDocRef}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Pill>{tm.operationalStatus}</Pill>
                    </td>
                    <td className="px-3 py-3">
                      <Pill tone={tm.verificationStatus === 'Verified' ? 'teal' : 'amber'}>{tm.verificationStatus}</Pill>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {tm.verificationStatus !== 'Verified' ? (
                          <button type="button" onClick={() => handleTeamReview(tm.teamId || tm._id, 'Verified')} className={BTN.primary}>
                            Verify
                          </button>
                        ) : (
                          <button type="button" onClick={() => handleTeamReview(tm.teamId || tm._id, 'Rejected')} className={BTN.secondary}>
                            Revoke
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteTeam(tm.teamId || tm._id, tm.name)}
                          className={BTN.softDanger}
                          title="Delete team permanently"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>

          {/* Join requests */}
          <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
            <SectionHead
              title={`Team join requests (${pendingJoinCount} waiting)`}
              desc="Approving a request creates a secret access key the volunteer uses to look up contacts."
            />

            {teamRequests.length === 0 ? (
              <EmptyState icon="📨" title="No join requests" />
            ) : (
              <DataTable columns={['Applicant', 'Team', 'Identity proof', 'Skills', 'Reason', 'Status and key', 'Action']} lastRight minWidth={980}>
                {teamRequests.map((req) => {
                  const isPending = req.status === 'Pending' || req.status === 'Pending Review';
                  const isApproved = req.status === 'Approved';
                  return (
                    <tr key={req._id || req.requestId} className={ROW}>
                      <td className="px-3 py-3">
                        <strong className="block font-bold text-slate-900 dark:text-white">{req.fullName}</strong>
                        <span className="font-mono text-[11px] text-slate-400">{req.phone}</span>
                      </td>
                      <td className="px-3 py-3">{req.teamName || req.teamId?.name || req.teamId || 'Selected team'}</td>
                      <td className="px-3 py-3">
                        {req.aadhaarNumber && (
                          <span className="block font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300">
                            🆔 {req.idProofType || 'Aadhaar'}: {maskId(req.aadhaarNumber)}
                          </span>
                        )}
                        {req.idProofPhoto && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewImageModal({
                                title: `Applicant ID proof: ${req.fullName}`,
                                url: req.idProofPhoto,
                                name: req.fullName,
                                idType: req.idProofType || 'Aadhaar Card',
                                idNumber: req.aadhaarNumber,
                              })
                            }
                            className="mt-1 inline-flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300"
                          >
                            🖼️ View ID photo
                          </button>
                        )}
                        {req.idProofRef && <span className="block font-mono text-[11px] text-slate-400">Ref: {req.idProofRef}</span>}
                        {!req.aadhaarNumber && !req.idProofPhoto && <span className="text-[11px] text-slate-400">ID not submitted</span>}
                      </td>
                      <td className="px-3 py-3">{req.skills?.slice(0, 2).join(', ')}</td>
                      <td className="max-w-xs truncate px-3 py-3">{req.reason || req.reasonForJoining || 'Ready to serve'}</td>
                      <td className="px-3 py-3">
                        <div className="space-y-1">
                          <Pill tone={isApproved ? 'green' : req.status === 'Rejected' ? 'rose' : 'amber'}>{req.status}</Pill>
                          {req.secretKey && (
                            <div>
                              <span className="inline-block rounded border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                                🔑 {req.secretKey}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleJoinReqReview(req.requestId || req._id, 'Approved')}
                              className={BTN.success}
                              title="Verify ID, approve the applicant and assign a secret key"
                            >
                              ✓ Approve and assign key
                            </button>
                            <button type="button" onClick={() => handleJoinReqReview(req.requestId || req._id, 'Rejected')} className={BTN.softDanger}>
                              Reject
                            </button>
                          </div>
                        ) : isApproved && req.secretKey ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">✓ Verified and active</span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </DataTable>
            )}
          </div>
        </div>
      )}

      {/* ================= CAMPAIGNS ================= */}
      {activeSubTab === 'campaigns' && (
        <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
          <SectionHead
            title="Relief campaigns"
            desc="Target funds, verified item needs, confirmed amounts and the agency receiving the help."
          >
            <button
              type="button"
              onClick={async () => {
                const freshCamps = await getReliefCampaigns();
                setCampaigns(freshCamps || []);
              }}
              className={BTN.secondary}
            >
              Sync
            </button>
            <button type="button" onClick={() => setShowCampaignModal(true)} className={BTN.primary}>
              + Launch campaign
            </button>
          </SectionHead>

          {campaigns.length === 0 ? (
            <EmptyState icon="🎯" title="No campaigns yet" hint='Click "Launch campaign" to start one.' />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {campaigns.map((camp) => {
                const pct = Math.min(100, Math.round(((camp.confirmedAmount || 0) / (camp.targetAmount || 1)) * 100));
                return (
                  <div
                    key={camp.campaignId || camp._id}
                    className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Pill tone="teal">{camp.disasterType}</Pill>
                        <h4 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{camp.title}</h4>
                        <p className="text-[11px] text-slate-500">📍 {camp.location}</p>
                      </div>
                      <Pill tone="green">{camp.status}</Pill>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-emerald-600">₹{(camp.confirmedAmount || 0).toLocaleString('en-IN')}</span>
                        <span className="text-slate-400">Target ₹{(camp.targetAmount || 1).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-right text-[11px] text-slate-400">{pct}% funded</p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <span className="block text-[11px] font-semibold text-slate-400">Verified needs</span>
                      {camp.verifiedNeeds?.map((n, idx) => (
                        <div key={idx} className="flex justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                          <span>{n.item}</span>
                          <span className="shrink-0 font-mono font-bold text-slate-900 dark:text-white">
                            {n.fundedQty || 0} / {n.requestedQty} {n.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <p className="min-w-0 truncate text-[11px] text-slate-400">
                        Agency: <strong>{camp.recipientAgency}</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.campaignId || camp._id, camp.title)}
                        className={BTN.softDanger}
                        title="Delete campaign permanently"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SUPPLIERS ================= */}
      {activeSubTab === 'suppliers' && (
        <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
          <SectionHead title="Certified local shops" desc="Medical stores, ration shops and verified suppliers of essential goods." />

          {suppliers.length === 0 ? (
            <EmptyState icon="🏪" title="No shops registered yet" />
          ) : (
            <DataTable columns={['Shop', 'Owner and contact', 'Location', 'License', 'Stock', 'Action']} lastRight minWidth={860}>
              {suppliers.map((s) => (
                <tr key={s._id} className={ROW}>
                  <td className="px-3 py-3">
                    <strong className="block font-bold text-slate-900 dark:text-white">{s.businessName}</strong>
                    <span className="text-[11px] font-semibold text-teal-600">{s.category}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span>{s.ownerName}</span>
                    <span className="block text-[11px] text-slate-400">{s.phone}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span>{s.address}</span>
                    <span className="block text-[11px] text-slate-400">{s.city}, {s.district}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="mb-1 block font-mono text-[11px] text-slate-500">Lic: {s.licenseNumber || 'Govt registered'}</span>
                    <Pill tone={s.verificationStatus === 'Verified' ? 'green' : 'amber'}>{s.verificationStatus}</Pill>
                  </td>
                  <td className="px-3 py-3 text-[11px] font-semibold">{s.catalog?.length || 0} items</td>
                  <td className="px-3 py-3 text-right">
                    {s.verificationStatus !== 'Verified' ? (
                      <button type="button" onClick={() => handleSupplierReview(s._id, 'Verified')} className={BTN.primary}>
                        Verify shop
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600">✓ Approved partner</span>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= ORDERS ================= */}
      {activeSubTab === 'orders' && (
        <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
          <SectionHead
            title="Supply orders"
            desc="Track each order from payment to delivery and move it to the next step."
          />

          {orders.length === 0 ? (
            <EmptyState icon="📦" title="No supply orders yet" />
          ) : (
            <DataTable columns={['Order', 'Items', 'Supplier', 'Drop point', 'Courier / volunteer', 'Status', 'Update step']} lastRight minWidth={960}>
              {orders.map((ord) => (
                <tr key={ord._id} className={ROW}>
                  <td className="px-3 py-3">
                    <strong className="block font-mono text-slate-900 dark:text-white">{ord.orderNumber}</strong>
                    <span className="text-[11px] text-slate-400">₹{ord.totalAmount}</span>
                  </td>
                  <td className="px-3 py-3">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="font-semibold text-slate-800 dark:text-slate-200">
                        {it.item} x {it.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="px-3 py-3">{ord.supplierId?.businessName || 'Local certified store'}</td>
                  <td className="px-3 py-3">{ord.deliveryLocation?.dropPoint}</td>
                  <td className="px-3 py-3 font-bold">{ord.volunteerId?.fullName || ord.assignedVolunteerName || 'Unassigned'}</td>
                  <td className="px-3 py-3">
                    <Pill tone={ord.status === 'Delivered' ? 'green' : 'teal'}>{ord.status}</Pill>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {ord.status !== 'Delivered' && (
                      <select
                        value={ord.status}
                        onChange={(e) => handleOrderStatus(ord._id, e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] font-semibold dark:border-slate-700 dark:bg-slate-800"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Accepted">Accepted by store</option>
                        <option value="Preparing">Preparing package</option>
                        <option value="Ready for Pickup">Ready for pickup</option>
                        <option value="Assigned for Delivery">Courier assigned</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered (complete)</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= AUDIT TRAIL ================= */}
      {activeSubTab === 'audits' && (
        <div className={`${PANEL} space-y-4 p-5 sm:p-6`}>
          <SectionHead
            title="Audit trail"
            desc="A record of volunteer approvals, campaign fund changes and supply dispatches."
          />

          {auditLogs.length === 0 ? (
            <EmptyState icon="🛡️" title="No activity recorded yet" />
          ) : (
            <DataTable columns={['Time', 'Action', 'Type', 'Done by', 'Details']} minWidth={760}>
              {auditLogs.map((log) => (
                <tr key={log._id} className={ROW}>
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp || log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 font-bold text-slate-900 dark:text-white">{log.action}</td>
                  <td className="px-3 py-3 font-mono text-[11px]">{log.entityType}</td>
                  <td className="px-3 py-3">{log.performedBy?.name || 'Command admin'}</td>
                  <td className="max-w-sm truncate px-3 py-3 text-[11px] text-slate-500">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= LAUNCH CAMPAIGN MODAL ================= */}
      {showCampaignModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onClick={() => setShowCampaignModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Launch relief campaign"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Launch relief campaign</h3>
              <button
                type="button"
                onClick={() => setShowCampaignModal(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 pt-4">
              <div>
                <label className={LABEL}>Campaign title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prayagraj Flash Flood Relief Drive"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  className={INPUT}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Disaster type</label>
                  <select
                    value={newCampaign.disasterType}
                    onChange={(e) => setNewCampaign({ ...newCampaign, disasterType: e.target.value })}
                    className={INPUT}
                  >
                    <option value="Flood Relief">Flood Relief</option>
                    <option value="Mela Heatwave">Mela Heatwave</option>
                    <option value="Earthquake Relief">Earthquake Relief</option>
                    <option value="Cyclone Emergency">Cyclone Emergency</option>
                    <option value="Stampede Medical Response">Stampede Medical Response</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Target amount (₹)</label>
                  <input
                    type="number"
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                    className={`${INPUT} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL}>Disaster location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangam Ghat and Sector 4, Prayagraj, UP"
                  value={newCampaign.location}
                  onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Recipient agency</label>
                <input
                  type="text"
                  value={newCampaign.recipientAgency}
                  onChange={(e) => setNewCampaign({ ...newCampaign, recipientAgency: e.target.value })}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Essential goods needed (separate with commas)</label>
                <textarea
                  rows={2}
                  value={newCampaign.needsText}
                  onChange={(e) => setNewCampaign({ ...newCampaign, needsText: e.target.value })}
                  placeholder="ORS sachets, clean water bottles, ration kits, first aid kits"
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>
                  Payment QR code <span className="font-normal text-slate-400">(optional, shown to donors)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onloadend = () => setNewCampaign((prev) => ({ ...prev, qrCodePhoto: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-1.5 file:font-semibold file:text-teal-700 hover:file:bg-teal-100 dark:text-slate-400"
                />
                {newCampaign.qrCodePhoto && (
                  <img src={newCampaign.qrCodePhoto} alt="QR preview" className="mt-2 h-28 w-28 rounded-xl border border-slate-300 object-contain" />
                )}
              </div>

              <div>
                <label className={LABEL}>
                  UPI ID <span className="font-normal text-slate-400">(optional, shown to donors)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. sevasaarthi@upi"
                  value={newCampaign.upiId || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, upiId: e.target.value })}
                  className={INPUT}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCampaignModal(false)} className={BTN.secondary}>
                  Cancel
                </button>
                <button type="submit" disabled={creatingCampaign} className={BTN.primary}>
                  {creatingCampaign ? 'Publishing...' : 'Publish campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ID PROOF PREVIEW MODAL ================= */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="w-full max-w-xl space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="ID proof preview"
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{previewImageModal.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {previewImageModal.name} · {previewImageModal.idType}:{' '}
                  <strong className="font-mono text-teal-600">{previewImageModal.idNumber || 'Masked proof'}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                aria-label="Close preview"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                ✕
              </button>
            </div>

            <div className="flex max-h-[70vh] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 dark:border-slate-700">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.title}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
              <span>Uploaded for admin identity checks only. Do not share.</span>
              <button type="button" onClick={() => setPreviewImageModal(null)} className={BTN.primary}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}