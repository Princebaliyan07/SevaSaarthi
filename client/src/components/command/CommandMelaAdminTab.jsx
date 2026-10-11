import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CommandMelaAdminTab({
  facilities = [],
  alerts = [],
  reports = [],
  onOpenAddFacility,
  onOpenEditFacility,
  onDeleteFacility,
  onOpenCreateAlert,
  onResolveAlert,
  onUpdateReportStatus,
  onOpenReportModal,
  lang = 'en',
}) {
  const { user, isAdmin, login, loginAs } = useAuth();
  const [adminPhone, setAdminPhone] = useState('9876543210');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [activeSubTab, setActiveSubTab] = useState('facilities'); // 'facilities' | 'alerts' | 'reports'

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await login(adminPhone, adminPassword);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Authentication Status */}
      <div className="glass-card p-5 sm:p-6 border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎛️</span>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Mela Suraksha Command & Field Operations
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20">
              Admin Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time administrative control over interactive map markers, public crowd alerts, and lost & found case file review.
          </p>
        </div>

        {/* Admin Login Box if not Admin */}
        {!isAdmin ? (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                🔒 Admin Login Required
              </span>
              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 underline"
              >
                (Quick Switch)
              </button>
            </div>
            {loginError && <p className="text-rose-600 text-[10px]">{loginError}</p>}
            <form onSubmit={handleAdminLogin} className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Admin Phone"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                className="w-28 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-[11px]"
              />
              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-28 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1.5 text-[11px]"
              />
              <button
                type="submit"
                disabled={loggingIn}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-[11px] disabled:opacity-50"
              >
                {loggingIn ? '...' : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="font-black text-slate-900 dark:text-white block">{user?.name}</span>
              <span className="text-[11px] text-teal-600 font-semibold capitalize">Role: {user?.role}</span>
            </div>
            <button
              type="button"
              onClick={() => loginAs('citizen')}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Exit Admin
            </button>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('facilities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'facilities'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📍 Map Facilities ({facilities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'alerts'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🚨 Crowd Safety Alerts ({alerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'reports'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📋 Lost & Found Review Queue ({reports.length})
        </button>
      </div>

      {/* Subtab 1: Facilities Table */}
      {activeSubTab === 'facilities' && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Facilities & Map Markers Management
            </h4>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAddFacility}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs"
              >
                ➕ Add New Facility
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">ID / Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Published</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {facilities.map((fac) => (
                  <tr key={fac.facilityId || fac._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{fac.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{fac.facilityId}</span>
                    </td>
                    <td className="p-3 capitalize">{fac.category.replace('_', ' ')}</td>
                    <td className="p-3">{fac.sector}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {fac.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px]">{fac.latitude}, {fac.longitude}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold ${fac.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {fac.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {isAdmin ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onOpenEditFacility(fac)}
                            className="text-teal-600 hover:underline font-bold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteFacility(fac.facilityId || fac._id)}
                            className="text-rose-600 hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-slate-400 italic">Login to edit</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Alerts Table */}
      {activeSubTab === 'alerts' && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Crowd Alerts & Public Safety Directives
            </h4>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenCreateAlert}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                📢 Broadcast New Alert
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Alert Title</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {alerts.map((a) => (
                  <tr key={a.alertId || a._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{a.title}</span>
                      <span className="text-[11px] text-slate-500">{a.recommendedAction}</span>
                    </td>
                    <td className="p-3">{a.alertType}</td>
                    <td className="p-3 font-bold">{a.severity}</td>
                    <td className="p-3">{a.affectedLocation}</td>
                    <td className="p-3 font-bold">{a.status}</td>
                    <td className="p-3 text-right">
                      {isAdmin && a.status === 'Active' ? (
                        <button
                          type="button"
                          onClick={() => onResolveAlert(a.alertId || a._id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Reports Review Queue */}
      {activeSubTab === 'reports' && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Missing Persons & Lost Articles Review Queue
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Last Seen / Found</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.map((rep) => (
                  <tr key={rep.reportRefId || rep._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="p-3 font-mono font-bold">{rep.reportRefId}</td>
                    <td className="p-3 capitalize">{rep.reportType.replace('_', ' ')}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      {rep.personName || rep.itemDescription}
                    </td>
                    <td className="p-3">{rep.location}</td>
                    <td className="p-3">
                      {isAdmin ? (
                        <select
                          value={rep.status}
                          onChange={(e) => onUpdateReportStatus(rep.reportRefId || rep._id, e.target.value)}
                          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-1 text-[11px] font-bold"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Possible Match">Possible Match</option>
                          <option value="Verified Match">Verified Match</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      ) : (
                        <span className="font-bold">{rep.status}</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenReportModal(rep.reportRefId || rep._id)}
                        className="text-teal-600 hover:underline font-bold"
                      >
                        Open Case File →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
