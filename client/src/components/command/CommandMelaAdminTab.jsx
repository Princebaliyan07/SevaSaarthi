import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FACILITY_CATEGORIES } from '../mela/InteractiveMelaMap';

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

  const [activeSubTab, setActiveSubTab] = useState('verification'); // 'verification' | 'facilities' | 'alerts'

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
      {/* HIGHLIGHTED HEADER WITH ADMIN AUTHENTICATION */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white shadow-2xl border-2 border-teal-500/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
              <span>COMMAND CENTRE · MAHA KUMBH OPERATIONS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Official Mela Layout & Pilgrim Reunification Command
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Direct administrative authorization to update the 2D layout map, manage markers (toilets, drinking water, medical camps), verify missing persons via dual photo comparison, and broadcast crowd safety alerts.
            </p>
          </div>

          {/* Quick Admin Auth Box */}
          <div className="shrink-0">
            {!isAdmin ? (
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    🔒 Command Officer Login
                  </span>
                  <button
                    type="button"
                    onClick={() => loginAs('admin')}
                    className="text-[10px] font-bold text-teal-300 underline"
                  >
                    (Quick Preview)
                  </button>
                </div>
                {loginError && <p className="text-rose-400 text-[10px]">{loginError}</p>}
                <form onSubmit={handleAdminLogin} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Phone"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-24 rounded-lg bg-white/15 px-2 py-1 text-xs text-white placeholder:text-slate-400 border border-white/20"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-24 rounded-lg bg-white/15 px-2 py-1 text-xs text-white placeholder:text-slate-400 border border-white/20"
                  />
                  <button
                    type="submit"
                    disabled={loggingIn}
                    className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                  >
                    {loggingIn ? '...' : 'Sign In'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-right space-y-1">
                <div className="flex items-center gap-2 justify-end">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300">Authorized: {user?.name || 'Command Officer'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loginAs('citizen')}
                  className="text-[10px] text-slate-300 hover:text-white underline font-semibold"
                >
                  Switch to Visitor Mode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3 Quick Navigation Pill Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setActiveSubTab('verification')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeSubTab === 'verification'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <span>📸</span>
            <span>Photo Verification Queue ({reports.filter((r) => r.status === 'Possible Match').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('facilities')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeSubTab === 'facilities'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <span>🗺️</span>
            <span>Mela Map & Facility Markers ({facilities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeSubTab === 'alerts'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <span>🚨</span>
            <span>Crowd Safety Alerts ({alerts.filter((a) => a.status === 'Active').length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: DUAL PHOTO COMPARISON & VERIFICATION QUEUE */}
      {activeSubTab === 'verification' && (
        <div className="glass-card p-6 space-y-5 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>📸</span>
                <span>Missing Persons Dual Photo Verification & Matching Desk</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compare photos provided when reported missing with photos uploaded by finders, verify matching facial details, review found location, and mark Verified Match.
              </p>
            </div>
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              Total Cases: {reports.length}
            </span>
          </div>

          <div className="space-y-4">
            {reports.map((rep) => {
              const isMatchCandidate = rep.status === 'Possible Match';
              const isVerified = rep.status === 'Verified Match' || rep.status === 'Resolved';

              return (
                <div
                  key={rep.reportRefId || rep._id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isMatchCandidate
                      ? 'border-amber-500/50 bg-amber-50/30 dark:border-amber-500/30 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                      : isVerified
                      ? 'border-emerald-500/40 bg-emerald-50/20 dark:border-emerald-500/20 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-5">
                    {/* Left: Dual Photos Side-by-Side for Direct Comparison */}
                    <div className="flex items-center gap-3 shrink-0 w-full lg:w-72">
                      {/* Photo 1: When Missing */}
                      <div className="flex-1 space-y-1">
                        <span className="block text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">
                          🔴 When Missing
                        </span>
                        <div className="h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
                          {rep.photoUrl ? (
                            <img
                              src={rep.photoUrl}
                              alt="When missing"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                              No Photo
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Photo 2: When Found */}
                      <div className="flex-1 space-y-1">
                        <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                          🟢 When Found
                        </span>
                        <div className="h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500/50">
                          {rep.foundPhotoUrl ? (
                            <img
                              src={rep.foundPhotoUrl}
                              alt="When found"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] p-2 text-center">
                              <span>⏳</span>
                              <span>Awaiting Photo</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details & Found Location */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {rep.reportRefId}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {rep.personName} ({rep.personGender}, {rep.personAge || 'Age unknown'} yrs)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Seen Location:</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">📍 {rep.location}</span>
                          <span className="block text-[10px] text-slate-400">Time: {rep.dateTimeApprox}</span>
                        </div>

                        <div className={`p-2.5 rounded-xl border ${
                          rep.foundLocation
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-50 dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-400'
                        }`}>
                          <span className="text-[10px] font-bold uppercase block">Location Where Person Found:</span>
                          <span className="font-bold">
                            {rep.foundLocation ? `🎯 ${rep.foundLocation}` : 'Not yet located'}
                          </span>
                          {rep.foundFinderName && (
                            <span className="block text-[10px] opacity-80">Reported by: {rep.foundFinderName}</span>
                          )}
                        </div>
                      </div>

                      {rep.clothingDescription && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>Attire: </strong> {rep.clothingDescription}
                        </p>
                      )}
                    </div>

                    {/* Right: Administrative Verification Action */}
                    <div className="shrink-0 flex flex-col items-end gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        {isAdmin ? (
                          <select
                            value={rep.status}
                            onChange={(e) => onUpdateReportStatus(rep.reportRefId || rep._id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Possible Match">Possible Match</option>
                            <option value="Verified Match">✅ Verified Match</option>
                            <option value="Resolved">Resolved / Reunited</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span className="font-bold text-xs">{rep.status}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenReportModal(rep.reportRefId || rep._id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                      >
                        Inspect Case File & Chat →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: FACILITIES MANAGEMENT */}
      {activeSubTab === 'facilities' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Mela Map Facilities & Pin Markers
              </h3>
              <p className="text-xs text-slate-500">
                Manage all toilets, drinking water points, medical tents, entry/exit gates on the 2D layout.
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenAddFacility}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                ➕ Add New Marker
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-mono text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Facility Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Blueprint Coordinates</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {facilities.map((fac) => {
                  const cat = FACILITY_CATEGORIES[fac.category] || FACILITY_CATEGORIES.help_desk;
                  return (
                    <tr key={fac.facilityId || fac._id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="p-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{fac.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{fac.facilityId}</span>
                      </td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </td>
                      <td className="p-3">{fac.sector}</td>
                      <td className="p-3 font-mono text-[11px]">
                        X: {fac.mapX}%, Y: {fac.mapY}%
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          {fac.status}
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
                          <span className="text-slate-400 italic">Login required</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ALERTS */}
      {activeSubTab === 'alerts' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Official Crowd Safety Directives
              </h3>
              <p className="text-xs text-slate-500">
                Broadcast warnings for high crowd surges, bridge closures, and safety protocols.
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={onOpenCreateAlert}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
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
                  <th className="p-3 text-right">Action</th>
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
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
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
    </div>
  );
}
