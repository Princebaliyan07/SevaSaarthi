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

export default function CommandReliefAdminTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'applications' | 'teams' | 'campaigns' | 'suppliers' | 'orders' | 'audits'
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Subtab Data States
  const [applications, setApplications] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Create Campaign Modal State
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    disasterType: 'Flood Relief',
    location: '',
    description: '',
    targetAmount: 250000,
    recipientAgency: 'District Disaster Relief Fund',
    needsText: 'Clean Drinking Water (2000 Litres), Ready-to-eat Food Packets (1500 Packs), ORS Packets (3000 Sachets)',
  });

  // Full-size ID Proof Photo Preview Modal State
  const [previewImageModal, setPreviewImageModal] = useState(null); // { title, url, name, idNumber, idType }

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovData, appsData, teamsData, reqsData, campsData, supsData, ordsData, auditsData] = await Promise.all([
        getReliefCommandOverview(),
        getVolunteerApplications(),
        getVolunteerTeams(),
        getTeamJoinRequests(),
        getReliefCampaigns(),
        getReliefSuppliers(),
        getSupplyOrders(),
        getAuditLogs(),
      ]);

      setOverview(ovData);
      setApplications(appsData || []);
      setTeams(teamsData || []);
      setTeamRequests(reqsData || []);
      setCampaigns(campsData || []);
      setSuppliers(supsData || []);
      setOrders(ordsData || []);
      setAuditLogs(auditsData || []);
    } catch (err) {
      console.error('Error loading relief command data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers for Volunteer Applications
  const handleAppReview = async (regId, status) => {
    const notes = prompt(`Notes for ${status} application:`, status === 'Approved' ? 'Verified by disaster coordinator.' : 'Information mismatch.');
    if (notes === null) return;
    try {
      await reviewVolunteerApplication(regId, { status, adminNotes: notes });
      await loadData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Handlers for Teams
  const handleTeamReview = async (teamId, verificationStatus) => {
    if (!window.confirm(`Mark team as ${verificationStatus}?`)) return;
    try {
      await reviewVolunteerTeam(teamId, { verificationStatus });
      await loadData();
    } catch (err) {
      alert('Error updating team verification: ' + err.message);
    }
  };

  // Handlers for Team Join Requests
  const handleJoinReqReview = async (requestId, status) => {
    try {
      await reviewTeamJoinRequest(requestId, { status, adminNotes: `Processed as ${status}` });
      await loadData();
    } catch (err) {
      alert('Error updating join request: ' + err.message);
    }
  };

  // Handlers for Suppliers
  const handleSupplierReview = async (supplierId, verificationStatus) => {
    if (!window.confirm(`Mark supplier as ${verificationStatus}?`)) return;
    try {
      await reviewSupplier(supplierId, { verificationStatus });
      await loadData();
    } catch (err) {
      alert('Error reviewing supplier: ' + err.message);
    }
  };

  // Handlers for Supply Orders
  const handleOrderStatus = async (orderId, status) => {
    try {
      await updateSupplyOrderStatus(orderId, { status });
      await loadData();
    } catch (err) {
      alert('Error updating order: ' + err.message);
    }
  };

  // Handler for Creating Campaign
  const handleCreateCampaignSubmit = async (e) => {
    e.preventDefault();
    try {
      // Parse needsText into array
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
        verifiedNeeds: verifiedNeeds.length ? verifiedNeeds : [{ item: 'Emergency Kits', requestedQty: 500, fundedQty: 0, deliveredQty: 0, unit: 'kits', unitCost: 100 }],
      });

      setShowCampaignModal(false);
      setNewCampaign({
        title: '',
        disasterType: 'Flood Relief',
        location: '',
        description: '',
        targetAmount: 250000,
        recipientAgency: 'District Disaster Relief Fund',
        needsText: '',
      });
      await loadData();
    } catch (err) {
      alert('Failed to launch campaign: ' + err.message);
    }
  };

  // Handler for Deleting Team
  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to permanently delete team "${teamName || teamId}"?\nThis will remove the team and any pending join requests.`)) return;
    try {
      await deleteVolunteerTeam(teamId);
      await loadData();
    } catch (err) {
      alert('Error deleting team: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handler for Deleting Campaign
  const handleDeleteCampaign = async (campaignId, campaignTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete relief campaign "${campaignTitle || campaignId}"?\nThis cannot be undone.`)) return;
    try {
      await deleteReliefCampaign(campaignId);
      await loadData();
    } catch (err) {
      alert('Error deleting campaign: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white border border-teal-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <h2 className="text-lg font-black tracking-tight">Disaster Relief Operations Hub</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Atlas Active Sync
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Coordinate volunteers, teams, government campaigns, certified local shops, supply orders, and transparent donations.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCampaignModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Launch Campaign</span>
          </button>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>{loading ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 6 Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Command Overview' },
          { id: 'applications', label: `📋 Volunteers (${applications.filter(a => a.status === 'Pending').length} Pending)` },
          { id: 'teams', label: `👥 Teams (${teams.length})` },
          { id: 'campaigns', label: `🎯 Relief Campaigns (${campaigns.length})` },
          { id: 'suppliers', label: `🏪 Certified Shops (${suppliers.length})` },
          { id: 'orders', label: `📦 Supply Orders (${orders.length})` },
          { id: 'audits', label: '🛡️ Audit Trail' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: COMMAND OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: 'Total Volunteers', val: overview?.volunteers?.total || applications.length, color: 'text-teal-600 dark:text-teal-400', bar: 'from-teal-500 to-emerald-400' },
              { label: 'Active Teams', val: overview?.teams?.verified || teams.filter(t => t.verificationStatus === 'Verified').length, color: 'text-emerald-600 dark:text-emerald-400', bar: 'from-emerald-500 to-green-400' },
              { label: 'Active Campaigns', val: overview?.campaigns?.active || campaigns.length, color: 'text-blue-600 dark:text-blue-400', bar: 'from-blue-500 to-cyan-400' },
              { label: 'Funds Confirmed', val: `₹${(overview?.campaigns?.totalRaised || 0).toLocaleString('en-IN')}`, color: 'text-indigo-600 dark:text-indigo-400', bar: 'from-indigo-500 to-purple-400' },
              { label: 'Certified Shops', val: overview?.suppliers?.verified || suppliers.filter(s => s.verificationStatus === 'Verified').length, color: 'text-amber-600 dark:text-amber-400', bar: 'from-amber-500 to-orange-400' },
              { label: 'Active Deliveries', val: overview?.orders?.active || orders.filter(o => o.status !== 'Delivered').length, color: 'text-rose-600 dark:text-rose-400', bar: 'from-rose-500 to-pink-400' },
            ].map((m, i) => (
              <div key={i} className="glass-card relative overflow-hidden p-4 flex flex-col justify-between">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.bar}`} />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.label}</span>
                <span className={`mt-2 text-2xl font-black ${m.color}`}>{m.val}</span>
              </div>
            ))}
          </div>

          {/* 2 Column Quick Operations View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Volunteer Approvals */}
            <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>⏳</span>
                  <span>Pending Volunteer Applications ({applications.filter(a => a.status === 'Pending').length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('applications')}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  View All →
                </button>
              </div>

              {applications.filter(a => a.status === 'Pending').length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  ✓ No volunteer applications awaiting review.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.filter(a => a.status === 'Pending').slice(0, 4).map((app) => (
                    <div key={app._id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black text-slate-900 dark:text-white">{app.fullName}</strong>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {app.city}, {app.district}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Skills: {app.skills?.slice(0, 3).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAppReview(app._id, 'Approved')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppReview(app._id, 'Rejected')}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-[11px] font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Supply Pipeline Status */}
            <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📦</span>
                  <span>Urgent Supply Orders In-Transit</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('orders')}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  Manage All →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-medium">
                  No active supply orders currently in queue.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.slice(0, 4).map((ord) => (
                    <div key={ord._id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black text-slate-900 dark:text-white">{ord.orderNumber}</strong>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ord.items?.map(it => `${it.item} (${it.quantity})`).join(', ')} · To: {ord.deliveryLocation?.dropPoint}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        ₹{ord.totalAmount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VOLUNTEER APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Volunteer Applications Queue</h3>
              <p className="text-xs text-slate-500">
                Review submitted citizen volunteer records, verified skills, and masked identity proofs.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Total: {applications.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Skills & Experience</th>
                  <th className="p-3">Identity Proof</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white block font-bold">{app.fullName}</strong>
                      <span className="text-[10px] text-slate-400">{app.mobileNumber || 'Privacy Masked'}</span>
                    </td>
                    <td className="p-3">
                      <span>{app.city}, {app.district}</span>
                      <span className="block text-[10px] text-slate-400">{app.state} · {app.pincode}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.skills?.map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        {app.maskedIdentityNumber || 'Masked Proof Submitted'}
                      </span>
                      <span className="text-[10px] text-teal-600 font-semibold">
                        {app.idType || 'Aadhaar / Gov ID'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="block font-semibold">{app.availabilityType}</span>
                      <span className="text-[10px] text-slate-400">
                        {app.emergencyAvailability ? '⚡ Emergency Ready' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : app.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {app.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAppReview(app._id, 'Approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAppReview(app._id, 'Rejected')}
                            className="px-2 py-1 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: TEAMS & JOIN REQUESTS */}
      {activeSubTab === 'teams' && (
        <div className="space-y-6">
          {/* Teams Table */}
          <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Registered Volunteer Teams</h3>
                <p className="text-xs text-slate-500">
                  Verify newly proposed relief teams and inspect member capacity.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                  <tr>
                    <th className="p-3">Team Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Members / Capacity</th>
                    <th className="p-3">Leader</th>
                    <th className="p-3">Operational Status</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {teams.map((t) => (
                    <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="p-3">
                        <strong className="text-slate-900 dark:text-white block font-bold">{t.name}</strong>
                        <span className="text-[10px] text-slate-400">{t.skills?.join(', ')}</span>
                      </td>
                      <td className="p-3">
                        <span>{t.location}</span>
                        <span className="block text-[10px] text-slate-400">{t.serviceArea}</span>
                      </td>
                      <td className="p-3 font-mono">
                        <strong className="text-slate-900 dark:text-white">{t.activeMembers || 1}</strong> / {t.capacity || 50}
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{t.leaderName || 'Coordinator'}</span>
                        {t.aadhaarNumber && (
                          <span className="font-mono text-[10px] text-teal-700 dark:text-teal-300 block">
                            🆔 {t.idProofType || 'Aadhaar'}: {t.aadhaarNumber}
                          </span>
                        )}
                        {t.idProofPhoto && (
                          <button
                            type="button"
                            onClick={() => setPreviewImageModal({
                              title: `Leader ID Proof — ${t.name}`,
                              url: t.idProofPhoto,
                              name: t.leaderName,
                              idType: t.idProofType || 'Aadhaar Card',
                              idNumber: t.aadhaarNumber,
                            })}
                            className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-bold hover:bg-teal-100 transition-all cursor-pointer"
                          >
                            <span>🖼️</span>
                            <span>View ID Photo</span>
                          </button>
                        )}
                        {t.registrationDocRef && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Ref: {t.registrationDocRef}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                          {t.operationalStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.verificationStatus === 'Verified'
                            ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}>
                          {t.verificationStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.verificationStatus !== 'Verified' ? (
                            <button
                              type="button"
                              onClick={() => handleTeamReview(t.teamId || t._id, 'Verified')}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                            >
                              Verify Team
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTeamReview(t.teamId || t._id, 'Rejected')}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:text-rose-600 text-[10px] font-bold"
                            >
                              Revoke
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTeam(t.teamId || t._id, t.name)}
                            className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all"
                            title="Permanently Delete Team"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Join Requests Queue */}
          <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Team Membership Join Requests ({teamRequests.filter(r => r.status === 'Pending' || r.status === 'Pending Review').length} Pending Review)
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                🔒 Admin approval generates Secret Access Key for volunteer contact lookup
              </span>
            </div>
            {teamRequests.length === 0 ? (
              <p className="text-xs text-slate-400">No pending team membership requests.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                    <tr>
                      <th className="p-2.5">Applicant</th>
                      <th className="p-2.5">Requested Team</th>
                      <th className="p-2.5">Identity Proof & Verification</th>
                      <th className="p-2.5">Skills</th>
                      <th className="p-2.5">Reason</th>
                      <th className="p-2.5">Status & Secret Key</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {teamRequests.map((req) => {
                      const isPending = req.status === 'Pending' || req.status === 'Pending Review';
                      const isApproved = req.status === 'Approved';
                      return (
                        <tr key={req._id || req.requestId}>
                          <td className="p-2.5">
                            <strong className="font-bold text-slate-900 dark:text-white block">{req.fullName}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">{req.phone}</span>
                          </td>
                          <td className="p-2.5">{req.teamName || req.teamId?.name || req.teamId || 'Selected Team'}</td>
                          <td className="p-2.5">
                            {req.aadhaarNumber && (
                              <span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300 block">
                                🆔 {req.idProofType || 'Aadhaar'}: {req.aadhaarNumber}
                              </span>
                            )}
                            {req.idProofPhoto && (
                              <button
                                type="button"
                                onClick={() => setPreviewImageModal({
                                  title: `Applicant ID Proof — ${req.fullName}`,
                                  url: req.idProofPhoto,
                                  name: req.fullName,
                                  idType: req.idProofType || 'Aadhaar Card',
                                  idNumber: req.aadhaarNumber,
                                })}
                                className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-[10px] font-bold hover:bg-teal-100 cursor-pointer"
                              >
                                <span>🖼️</span>
                                <span>View ID Photo</span>
                              </button>
                            )}
                            {req.idProofRef && (
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Ref: {req.idProofRef}
                              </span>
                            )}
                            {!req.aadhaarNumber && !req.idProofPhoto && (
                              <span className="text-[10px] text-slate-400">ID Verification Pending</span>
                            )}
                          </td>
                          <td className="p-2.5">{req.skills?.slice(0, 2).join(', ')}</td>
                          <td className="p-2.5 max-w-xs truncate">{req.reason || req.reasonForJoining || 'Ready to serve'}</td>
                          <td className="p-2.5">
                            <div className="space-y-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                                isApproved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' :
                                req.status === 'Rejected' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' :
                                'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                              }`}>
                                {req.status}
                              </span>
                              {req.secretKey && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-400/30">
                                    🔑 {req.secretKey}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleJoinReqReview(req.requestId || req._id, 'Approved')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-xs transition-all flex items-center gap-1"
                                  title="Verify ID, approve applicant, and assign Secret PIN"
                                >
                                  <span>✓</span>
                                  <span>Verify & Assign Key</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleJoinReqReview(req.requestId || req._id, 'Rejected')}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-[10px] transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : isApproved && req.secretKey ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                ✓ Verified & Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Archived</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 4: RELIEF CAMPAIGNS & LIVE NEEDS */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Active Disaster Relief Campaigns</h3>
                <p className="text-xs text-slate-500">
                  Target funds, verified item quotas, confirmed amounts, and recipient agencies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCampaignModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition-all flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Launch New Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((camp) => (
                <div key={camp._id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300">
                        {camp.disasterType}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{camp.title}</h4>
                      <p className="text-[11px] text-slate-500">📍 {camp.location}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {camp.status}
                    </span>
                  </div>

                  {/* Fund Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600">₹{(camp.confirmedAmount || 0).toLocaleString('en-IN')}</span>
                      <span className="text-slate-400">Target: ₹{(camp.targetAmount || 1).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, Math.round(((camp.confirmedAmount || 0) / (camp.targetAmount || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Needs Items */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Verified Item Demands:</span>
                    {camp.verifiedNeeds?.map((n, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300">
                        <span>{n.item}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {n.fundedQty || 0} / {n.requestedQty} {n.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">
                      Agency: <strong>{camp.recipientAgency}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(camp.campaignId || camp._id, camp.title)}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold transition-all flex items-center gap-1"
                      title="Permanently Delete Campaign"
                    >
                      <span>🗑️</span>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CERTIFIED LOCAL SHOPS & SUPPLIERS */}
      {activeSubTab === 'suppliers' && (
        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Certified Local Shop Network</h3>
              <p className="text-xs text-slate-500">
                Medical stores, wholesale ration shops, and verified essential goods suppliers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Store Name & Category</th>
                  <th className="p-3">Owner & Contact</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">License & Verification</th>
                  <th className="p-3">Stock Items</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {suppliers.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white block font-bold">{s.businessName}</strong>
                      <span className="text-[10px] font-mono text-teal-600 font-bold">{s.category}</span>
                    </td>
                    <td className="p-3">
                      <span>{s.ownerName}</span>
                      <span className="block text-[10px] text-slate-400">{s.phone}</span>
                    </td>
                    <td className="p-3">
                      <span>{s.address}</span>
                      <span className="block text-[10px] text-slate-400">{s.city}, {s.district}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] block text-slate-500">Lic: {s.licenseNumber || 'Verified Gov Reg'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.verificationStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[11px] font-semibold">
                        {s.catalog?.length || 0} inventory items
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {s.verificationStatus !== 'Verified' ? (
                        <button
                          type="button"
                          onClick={() => handleSupplierReview(s._id, 'Verified')}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px]"
                        >
                          Verify Shop
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-bold">✓ Approved Partner</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 6: SUPPLY ORDERS & DISPATCH PIPELINE */}
      {activeSubTab === 'orders' && (
        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Essential Supplies Dispatch Pipeline</h3>
              <p className="text-xs text-slate-500">
                10-stage verified procurement lifecycle from donor sponsorship to field relief distribution.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Items & Qty</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3">Drop Location</th>
                  <th className="p-3">Courier / Volunteer</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Advance Step</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white block font-mono">{ord.orderNumber}</strong>
                      <span className="text-[10px] text-slate-400">₹{ord.totalAmount}</span>
                    </td>
                    <td className="p-3">
                      {ord.items?.map((it, idx) => (
                        <div key={idx} className="font-semibold text-slate-800 dark:text-slate-200">
                          {it.item} x {it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="p-3">
                      <span>{ord.supplierId?.businessName || 'Local Certified Store'}</span>
                    </td>
                    <td className="p-3">
                      <span>{ord.deliveryLocation?.dropPoint}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold">{ord.volunteerId?.fullName || ord.assignedVolunteerName || 'Unassigned'}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-500/20">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ord.status !== 'Delivered' && (
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatus(ord._id, e.target.value)}
                          className="text-[11px] p-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                        >
                          <option value="Paid">Paid</option>
                          <option value="Accepted">Accepted by Store</option>
                          <option value="Preparing">Preparing Package</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Assigned for Delivery">Assigned Courier</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered (Complete)</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 7: AUDIT TRAIL */}
      {activeSubTab === 'audits' && (
        <div className="glass-card p-5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">Immutable Relief Audit Trail</h3>
              <p className="text-xs text-slate-500">
                Log of all verified volunteer approvals, campaign fund allocations, and supply dispatches.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Performed By</th>
                  <th className="p-3">Details / Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="p-3 font-mono text-[10px] text-slate-400">
                      {new Date(log.timestamp || log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{log.action}</td>
                    <td className="p-3 font-mono text-[10px]">{log.entityType}</td>
                    <td className="p-3">{log.performedBy?.name || 'Command Admin'}</td>
                    <td className="p-3 max-w-sm truncate text-[11px] text-slate-500">
                      {JSON.stringify(log.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Launch Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Launch Disaster Relief Campaign</h3>
              <button
                type="button"
                onClick={() => setShowCampaignModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prayagraj Flash Flood Relief Drive"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Disaster Type</label>
                  <select
                    value={newCampaign.disasterType}
                    onChange={(e) => setNewCampaign({ ...newCampaign, disasterType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Flood Relief">Flood Relief</option>
                    <option value="Mela Heatwave">Mela Heatwave</option>
                    <option value="Earthquake Relief">Earthquake Relief</option>
                    <option value="Cyclone Emergency">Cyclone Emergency</option>
                    <option value="Stampede Medical Response">Stampede Medical Response</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={newCampaign.targetAmount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, targetAmount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Disaster Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangam Ghat & Sector 4, Prayagraj, UP"
                  value={newCampaign.location}
                  onChange={(e) => setNewCampaign({ ...newCampaign, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Recipient Agency / Official Custodian</label>
                <input
                  type="text"
                  value={newCampaign.recipientAgency}
                  onChange={(e) => setNewCampaign({ ...newCampaign, recipientAgency: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Verified Essential Goods Needed (comma-separated)</label>
                <textarea
                  rows={2}
                  value={newCampaign.needsText}
                  onChange={(e) => setNewCampaign({ ...newCampaign, needsText: e.target.value })}
                  placeholder="ORS Sachets, Clean Water Bottles, Ration Kits, First Aid Kits"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black shadow-md"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ID Proof Full-Size Inspection Modal */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="glass-card w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {previewImageModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Applicant / Leader: <strong>{previewImageModal.name}</strong> · {previewImageModal.idType}: <strong className="font-mono text-teal-600">{previewImageModal.idNumber || 'Masked Proof'}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.title}
                className="max-h-[68vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Verified encrypted document uploaded for administrative KYC.</span>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
