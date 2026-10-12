import { useEffect, useState } from 'react';
import Badge from '../components/common/Badge';
import IncidentQueueTable from '../components/command/IncidentQueueTable';
import AnalyticsCharts from '../components/command/AnalyticsCharts';
import AgencyStatusCards from '../components/command/AgencyStatusCards';
import CommandMelaAdminTab from '../components/command/CommandMelaAdminTab';
import CommandReliefAdminTab from '../components/command/CommandReliefAdminTab';
import FacilityAdminModal from '../components/mela/FacilityAdminModal';
import CrowdAlertAdminModal from '../components/mela/CrowdAlertAdminModal';
import ReportDetailModal from '../components/mela/ReportDetailModal';
import AddGroundMapModal from '../components/mela/AddGroundMapModal';

import { getIncidents, getCommandStats, updateIncidentStatus, deleteIncident } from '../services/incidentService';
import {
  getMelaFacilities,
  createMelaFacility,
  updateMelaFacility,
  deleteMelaFacility,
  getMelaAlerts,
  createMelaAlert,
  resolveMelaAlert,
  deleteMelaAlert,
  getLostFoundReports,
  updateReportStatus,
  getMelaMaps,
  createMelaMap,
  deleteMelaMap,
  getCrowdZones,
  createCrowdZone,
  updateCrowdZone,
  deleteCrowdZone,
} from '../services/melaService';
import { getHospitals } from '../services/hospitalService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

/* Shared look for every panel on this page */
const PANEL =
  'rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900';

const getNavItems = (t) => [
  {
    id: 'mela_ops',
    icon: '🕉️',
    label: t('command.melaOps'),
    title: t('command.melaOps'),
    desc: t('command.melaOpsDesc'),
  },
  {
    id: 'volunteer_ops',
    icon: '🤝',
    label: t('command.reliefVolunteers'),
    title: t('command.reliefVolunteers'),
    desc: t('command.reliefVolunteersDesc'),
  },
  {
    id: 'incidents',
    icon: '🚨',
    label: t('command.emergencyIncidents'),
    title: t('command.emergencyIncidents'),
    desc: t('command.emergencyIncidentsDesc'),
  },
  {
    id: 'healthcare',
    icon: '🏥',
    label: t('command.hospitals'),
    title: t('command.hospitals'),
    desc: t('command.hospitalsDesc'),
  },
];

export default function CommandCentrePage() {
  const { lang, t } = useLanguage();
  const { user, isAdmin, login, logout } = useAuth();

  const NAV_ITEMS = getNavItems(t);

  // Admin login form state
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [activeMainTab, setActiveMainTab] = useState('mela_ops'); // 'mela_ops' | 'volunteer_ops' | 'incidents' | 'healthcare'


  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Mela admin state
  const [facilities, setFacilities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [crowdZones, setCrowdZones] = useState([]);
  const [maps, setMaps] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState('prayagraj_kumbh');
  // Track IDs that the admin has deleted — filter them out even if backend re-returns them
  const deletedAlertIds = useState(() => new Set(['MA-ALERT-01', 'MA-ALERT-02']))[0];

  // Load status
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Coming Soon modal
  const [comingSoonAction, setComingSoonAction] = useState(null);

  // Modals
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [pickedCoords, setPickedCoords] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [addMapModalOpen, setAddMapModalOpen] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [incList, statData, facList, alertList, repData, hospList, zonesList, mapsList] = await Promise.all([
        getIncidents(),
        getCommandStats(),
        getMelaFacilities({ includeUnpublished: 'true' }),
        getMelaAlerts({ includeInactive: 'true' }),
        getLostFoundReports({ limit: 50 }),
        getHospitals(),
        getCrowdZones(),
        getMelaMaps(),
      ]);

      setIncidents(incList || []);
      setStats(statData);
      setFacilities(facList || []);
      // Filter out legacy hardcoded demo alerts and any admin-deleted alerts
      setAlerts((alertList || []).filter((a) => !deletedAlertIds.has(a.alertId) && !deletedAlertIds.has(String(a._id))));
      setReports(repData?.reports || []);
      setHospitals(hospList || []);
      setCrowdZones(zonesList || []);
      setMaps(mapsList || []);

      // Keep the selected incident across auto-refreshes (and refresh its data);
      // only fall back to the first incident when nothing is selected yet.
      setSelectedIncident((prev) => {
        if (!prev) return incList?.[0] || null;
        return (incList || []).find((i) => i.id === prev.id) || prev;
      });

      setLoadError(false);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading command data:', err);
      setLoadError(true);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      const timer = setInterval(loadData, 20000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    if (!adminPhone.trim() || !adminPassword) return;
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await login(adminPhone.trim(), adminPassword);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        setAdminPassword('');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed');
    } finally {
      setLoggingIn(false);
    }
  };

  /* ---------- Admin Login Gate: Only visible after successful sign-in ---------- */
  if (!isAdmin) {
    return (
      <div className="container-page py-12 sm:py-20 flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-md">
          <div className="relative rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-none">
            {/* Header Badge & Title */}
            <div className="text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-3xl shadow-lg shadow-teal-500/25">
                🛡️
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('command.title')}
              </h1>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-800 dark:bg-teal-950/40 dark:text-teal-300">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                {t('command.adminAccess')}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t('command.loginDesc')}
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                <span className="text-sm">⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleAdminSignIn} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('command.idLabel')}
                </label>
                <div className="relative mt-1">
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="username"
                    required
                    placeholder={t('command.idPlaceholder')}
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('command.passwordLabel')}
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder={t('command.passwordPlaceholder')}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loggingIn || !adminPhone.trim() || !adminPassword}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3 text-sm font-black text-white shadow-md shadow-teal-600/30 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingIn ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('command.signingIn')}
                  </>
                ) : (
                  <>
                    <span>{t('command.signInBtn')}</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }


  const handleStatusChange = async (id, newStatus) => {
    await updateIncidentStatus(id, newStatus);
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedIncident?.id === id) {
      setSelectedIncident((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAction = (actionName) => {
    setComingSoonAction(actionName);
  };

  const handleDeleteIncident = async (id) => {
    if (!window.confirm('Delete this incident / SOS report from database?')) return;
    try {
      await deleteIncident(id);
      setIncidents((prev) => prev.filter((item) => item.id !== id));
      if (selectedIncident?.id === id) {
        setSelectedIncident(null);
      }
    } catch (err) {
      console.error('Failed to delete incident:', err);
    }
  };

  // Mela ops handlers
  const handleSaveFacility = async (formData, id) => {
    if (id) {
      await updateMelaFacility(id, formData);
    } else {
      // Always stamp the currently selected map so facilities don't bleed across maps
      await createMelaFacility({ ...formData, mapId: selectedMapId || 'prayagraj_kumbh' });
    }
    await loadData();
  };

  const handleDeleteFacility = async (id) => {
    if (window.confirm('Delete facility record from database?')) {
      await deleteMelaFacility(id);
      await loadData();
    }
  };

  // Alerts are only created from this page. (The old code called updateMelaAlert, which was
  // never imported and would crash on edit, so the unused edit branch was removed.)
  const handleSaveAlert = async (formData) => {
    await createMelaAlert({ ...formData, mapId: selectedMapId || 'prayagraj_kumbh' });
    await loadData();
  };

  const handleResolveAlert = async (id) => {
    try {
      setAlerts((prev) => prev.map((a) => (a.alertId === id || a._id === id ? { ...a, status: 'Resolved' } : a)));
      await resolveMelaAlert(id);
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      await loadData();
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    // Mark this ID as deleted immediately — prevents reappearance from backend refreshes
    deletedAlertIds.add(id);
    try {
      setAlerts((prev) => prev.filter((a) => a.alertId !== id && a._id !== id));
      await deleteMelaAlert(id);
    } catch (err) {
      console.error('Failed to delete alert:', err);
    } finally {
      await loadData();
    }
  };

  const handleUpdateReportStatus = async (id, status) => {
    await updateReportStatus(id, { status });
    await loadData();
  };

  /* ---------- Loading / error states ---------- */
  if (!stats) {
    return (
      <div className="container-page py-20 text-center">
        {loadError ? (
          <div className="mx-auto max-w-sm space-y-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Could not load command data.
            </p>
            <p className="text-xs text-slate-500">Check your connection or the server, then try again.</p>
            <button type="button" onClick={loadData} className="btn-primary text-sm">
              Try again
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <span className="h-3 w-3 animate-pulse rounded-full bg-teal-500" />
            Loading command data...
          </div>
        )}
      </div>
    );
  }

  const activeAlerts = alerts.filter((a) => a.status === 'Active').length;

  const METRIC_CARDS = [
    { label: t('command.activeEmergencies'), val: stats.activeEmergencies, dot: 'bg-rose-500', num: 'text-rose-600 dark:text-rose-400' },
    { label: t('command.openIncidents'), val: stats.openIncidents, dot: 'bg-amber-500', num: 'text-amber-600 dark:text-amber-400' },
    { label: t('command.melaFacilities'), val: facilities.length, dot: 'bg-teal-500', num: 'text-teal-600 dark:text-teal-400' },
    { label: t('command.activeAlerts'), val: activeAlerts, dot: 'bg-blue-500', num: 'text-blue-600 dark:text-blue-400' },
    { label: t('command.lostFound'), val: reports.length, dot: 'bg-violet-500', num: 'text-violet-600 dark:text-violet-400' },
    { label: t('command.resolved'), val: stats.resolved, dot: 'bg-emerald-500', num: 'text-emerald-600 dark:text-emerald-400' },
  ];

  // Small number badge shown next to a nav item
  const navBadge = (id) => {
    if (id === 'incidents' && stats.activeEmergencies > 0) return { n: stats.activeEmergencies, cls: 'bg-rose-500 text-white' };
    if (id === 'mela_ops' && reports.length > 0) return { n: reports.length, cls: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100' };
    return null;
  };

  const current = NAV_ITEMS.find((n) => n.id === activeMainTab) || NAV_ITEMS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ============ TOP HORIZONTAL ADMIN BAR ============ */}
      <div className={`${PANEL} p-4 sm:p-5 mb-8 space-y-4`}>
        {/* Top line: Brand + Admin Account + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-2xl shadow-md shadow-teal-600/20 text-white">
              🛡️
            </span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t('command.title')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('command.adminDashboard')}
              </p>
            </div>
          </div>

          {/* Right section: Sync status, Refresh, Officer profile, Sign out */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span className={`h-2 w-2 rounded-full bg-emerald-500 ${refreshing ? 'animate-pulse' : ''}`} />
                {loadError ? t('command.syncProblem') : t('command.liveSync')}
              </span>
              <span className="text-[10px] text-slate-400">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : t('command.waitingData')}
              </span>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={refreshing}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>{refreshing ? t('command.refreshing') : t('command.refreshNow')}</span>
            </button>

            {/* Officer details badge */}
            <div className="hidden md:flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-800/60">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800 text-xs font-black dark:bg-teal-950 dark:text-teal-300">
                👤
              </span>
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {user?.name || 'Command Officer'}
                </p>
                <p className="font-mono text-[10px] text-slate-500">{user?.phone || 'Admin'}</p>
              </div>
            </div>

            {/* Horizontal Sign Out Button */}
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-600 shadow-sm transition hover:bg-rose-100 hover:text-rose-700 active:scale-95 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
              title={t('command.signOut')}
            >
              <span>🔒</span>
              <span>{t('command.signOut')}</span>
            </button>
          </div>
        </div>

        {/* Bottom line: Horizontal Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" aria-label="Command centre sections">
          {NAV_ITEMS.map((item) => {
            const active = activeMainTab === item.id;
            const badge = navBadge(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMainTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition shadow-xs ${
                  active
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/25'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-base" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
                {badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${active ? 'bg-white/25 text-white' : badge.cls}`}>
                    {badge.n}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ============ MAIN CONTENT AREA ============ */}
      <div className="min-w-0 space-y-6">
        {/* Page header */}
          <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                {current.title}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">{current.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('command.liveSync')}
              </span>
            </div>
          </header>


          {/* Summary numbers */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {METRIC_CARDS.map((m) => (
              <div key={m.label} className={`${PANEL} p-4`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${m.dot}`} />
                  <span className="text-xs font-semibold leading-tight text-slate-500 dark:text-slate-400">{m.label}</span>
                </div>
                <p className={`mt-2 text-2xl font-extrabold sm:text-3xl ${m.num}`}>{m.val}</p>
              </div>
            ))}
          </div>

          {/* ---------- SECTION: MELA OPERATIONS ---------- */}
          {activeMainTab === 'mela_ops' && (
            <section>
              <CommandMelaAdminTab
                facilities={facilities}
                alerts={alerts}
                reports={reports}
                crowdZones={crowdZones}
                maps={maps}
                selectedMapId={selectedMapId}
                onSelectMap={(mapId) => setSelectedMapId(mapId)}
                onOpenAddMap={() => setAddMapModalOpen(true)}
                onDeleteMap={async (mapId) => {
                  if (!window.confirm('Delete this ground map? All its facilities will remain in the database but will be unlinked.')) return;
                  try {
                    const remaining = maps.filter((m) => m.mapId !== mapId);
                    setMaps(remaining);
                    if (selectedMapId === mapId) {
                      setSelectedMapId(remaining[0]?.mapId || '');
                    }
                    await deleteMelaMap(mapId);
                  } catch (err) {
                    console.error('Failed to delete map:', err);
                  } finally {
                    await loadData();
                  }
                }}
                onCreateCrowdZone={async (data) => {
                  await createCrowdZone({ ...data, mapId: selectedMapId || 'prayagraj_kumbh' });
                  await loadData();
                }}
                onUpdateCrowdZone={async (id, data) => {
                  await updateCrowdZone(id, data);
                  await loadData();
                }}
                onDeleteCrowdZone={async (id) => {
                  await deleteCrowdZone(id);
                  await loadData();
                }}
                onOpenAddFacility={(coords) => {
                  setEditingFacility(null);
                  setPickedCoords(coords || null);
                  setFacilityModalOpen(true);
                }}
                onOpenEditFacility={(fac) => {
                  setEditingFacility(fac);
                  setPickedCoords(null);
                  setFacilityModalOpen(true);
                }}
                onDeleteFacility={handleDeleteFacility}
                onOpenCreateAlert={() => setAlertModalOpen(true)}
                onResolveAlert={handleResolveAlert}
                onDeleteAlert={handleDeleteAlert}
                onUpdateReportStatus={handleUpdateReportStatus}
                onOpenReportModal={(id) => {
                  setSelectedReportId(id);
                  setDetailModalOpen(true);
                }}
                lang={lang}
              />
            </section>
          )}

          {/* ---------- SECTION: RELIEF AND VOLUNTEERS ---------- */}
          {activeMainTab === 'volunteer_ops' && (
            <section>
              <CommandReliefAdminTab />
            </section>
          )}

          {/* ---------- SECTION: INCIDENTS ---------- */}
          {activeMainTab === 'incidents' && (
            <div className="space-y-6">
              {/* ===== TOP ROW: VOICE SOS RECORDINGS & SELECTED INCIDENT DETAIL SIDE-BY-SIDE ===== */}
              <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                {/* Voice SOS Recordings Panel */}
                {(() => {
                  const sosRecordings = incidents.filter((i) => i.audioUrl);
                  return (
                    <div className={`${PANEL} p-5 sm:p-6 space-y-4`}>
                      <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-base">🎙️</span>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Voice SOS Recordings</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {sosRecordings.length} recording{sosRecordings.length !== 1 ? 's' : ''} received — Police Command Audio Log
                          </p>
                        </div>
                        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/50 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          LIVE
                        </span>
                      </div>

                      {sosRecordings.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">
                          No voice recordings in the emergency log yet.
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                          {sosRecordings.map((rec) => (
                            <div
                              key={rec.id}
                              className="rounded-2xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 p-4 space-y-3 transition hover:border-rose-300 dark:hover:border-rose-800"
                            >
                              {/* Caller info row */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="h-7 w-7 rounded-full bg-rose-200 dark:bg-rose-900/60 flex items-center justify-center text-sm">👤</span>
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {rec.citizenName || 'Unknown Caller'}
                                  </span>
                                  {rec.citizenPhone && (
                                    <a
                                      href={`tel:${rec.citizenPhone}`}
                                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-800 px-2 py-0.5 font-mono text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                                    >
                                      📞 {rec.citizenPhone}
                                    </a>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-800/80 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                    <span>📅</span>
                                    <span>
                                      {(() => {
                                        const raw = rec.reportedAt || rec.createdAt || rec.dateTime;
                                        if (!raw) return 'Recent';
                                        // If already formatted with date
                                        if (typeof raw === 'string' && raw.includes(',')) return raw;
                                        const parsed = new Date(raw);
                                        if (!isNaN(parsed.getTime())) {
                                          return parsed.toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                          });
                                        }
                                        return raw;
                                      })()}
                                    </span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteIncident(rec.id)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2 py-1 text-[11px] font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 active:scale-95 dark:border-rose-900/50 dark:bg-slate-800 dark:text-rose-400"
                                    title="Delete voice recording"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </div>

                              {rec.location && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  📍 {rec.location}
                                </p>
                              )}

                              {/* Audio player */}
                              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                              <audio
                                controls
                                src={rec.audioUrl}
                                className="w-full h-10 rounded-xl"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Selected Incident Detail Panel */}
                {selectedIncident ? (
                  <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {selectedIncident.title}
                        </h3>
                        <Badge type={selectedIncident.severity}>
                          {selectedIncident.severity?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {selectedIncident.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteIncident(selectedIncident.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                          title="Delete selected incident report"
                        >
                          🗑️ Delete Alert
                        </button>
                      </div>
                    </div>

                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60">
                      <div>
                        <dt className="font-medium text-slate-400">{t('command.reported')}</dt>
                        <dd className="mt-0.5 font-bold text-slate-900 dark:text-white">
                          {(() => {
                            const raw = selectedIncident.reportedAt || selectedIncident.createdAt || selectedIncident.dateTime;
                            if (!raw) return 'Recent';
                            if (typeof raw === 'string' && raw.includes(',')) return raw;
                            const parsed = new Date(raw);
                            if (!isNaN(parsed.getTime())) {
                              return parsed.toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              });
                            }
                            return raw;
                          })()}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">{t('command.team')}</dt>
                        <dd className="mt-0.5 font-bold text-slate-900 dark:text-white">{selectedIncident.team}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">{t('command.eta')}</dt>
                        <dd className="mt-0.5 font-bold text-teal-600 dark:text-teal-400">{selectedIncident.eta}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-400">Caller</dt>
                        <dd className="mt-0.5 font-bold text-rose-600 dark:text-rose-400 truncate">
                          {selectedIncident.citizenName || selectedIncident.name || 'Citizen'}
                        </dd>
                      </div>
                    </dl>

                    {/* Full Address / Location Banner */}
                    {selectedIncident.location && (
                      <div className="flex items-start gap-2 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/70 dark:bg-teal-950/30 p-3 text-xs text-teal-950 dark:text-teal-200">
                        <span className="text-base shrink-0">📍</span>
                        <div>
                          <strong className="block font-bold">Location & Coordinates:</strong>
                          <span className="font-semibold text-teal-800 dark:text-teal-300">
                            {selectedIncident.location}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Voice SOS Audio Recording & Caller Info (Police Admin View Only) */}
                    {(selectedIncident.audioUrl || selectedIncident.citizenPhone) && (
                      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/30 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-black text-rose-700 dark:text-rose-300">
                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                            🎙️ Emergency Voice SOS Dispatch
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                            Police Command Audio
                          </span>
                        </div>

                        {(selectedIncident.citizenName || selectedIncident.citizenPhone) && (
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            {selectedIncident.citizenName && (
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                Caller: <strong>{selectedIncident.citizenName}</strong>
                              </span>
                            )}
                            {selectedIncident.citizenPhone && (
                              <a
                                href={`tel:${selectedIncident.citizenPhone}`}
                                className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900 flex items-center gap-1 hover:underline"
                              >
                                <span>📞</span> {selectedIncident.citizenPhone}
                              </a>
                            )}
                          </div>
                        )}

                        {selectedIncident.audioUrl && (
                          <div className="pt-1">
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <audio
                              controls
                              src={selectedIncident.audioUrl}
                              className="w-full h-10 rounded-xl"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {selectedIncident.notes && (
                      <p className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                        📝 {selectedIncident.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2.5">
                      <button type="button" onClick={() => handleAction('Assign team')} className="btn-primary text-xs">
                        {t('command.assignTeam')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction('Mark Resolved')}
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        ✓ {t('command.markResolved')}
                      </button>
                      <button type="button" onClick={() => handleAction('Escalate to SDRF/NDRF')} className="btn-sos text-xs">
                        ⚡ {t('command.escalate')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`${PANEL} p-12 text-center text-sm text-slate-500 flex flex-col items-center justify-center min-h-[300px]`}>
                    <span className="text-3xl mb-2">📋</span>
                    <span>Select an incident from the queue table below to view and manage details.</span>
                  </div>
                )}
              </div>

              {/* ===== FULL-WIDTH WIDE INCIDENT QUEUE TABLE (WITH DELETE ON EVERY ALERT) ===== */}
              <div className="w-full">
                <IncidentQueueTable
                  incidents={incidents}
                  selectedId={selectedIncident?.id}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  onStatusChange={handleStatusChange}
                  onDeleteIncident={handleDeleteIncident}
                />
              </div>

              <AnalyticsCharts
                incidentsByType={stats.incidentsByType}
                responseTimeTrend={stats.responseTimeTrend}
              />

              <AgencyStatusCards agencies={stats.agencies} />
            </div>
          )}

          {/* ---------- SECTION: HOSPITALS ---------- */}
          {activeMainTab === 'healthcare' && (
            <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                <span className="text-base" aria-hidden="true">ℹ️</span>
                <p className="leading-relaxed">
                  <strong className="font-bold">About this data: </strong>
                  Hospital names, addresses and Google Maps links are real. Emergency phone numbers and bed or oxygen availability are demonstration data.
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
                    {hospitals.slice(0, 15).map((h) => (
                      <tr key={h.id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
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
        </div>

      {/* Admin modals */}
      <FacilityAdminModal
        facility={editingFacility}
        initialCoords={pickedCoords}
        isOpen={facilityModalOpen}
        onClose={() => {
          setFacilityModalOpen(false);
          setEditingFacility(null);
          setPickedCoords(null);
        }}
        onSave={handleSaveFacility}
        lang={lang}
      />

      <CrowdAlertAdminModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        onSave={handleSaveAlert}
        lang={lang}
      />

      <AddGroundMapModal
        isOpen={addMapModalOpen}
        onClose={() => setAddMapModalOpen(false)}
        onSave={async (mapData) => {
          const res = await createMelaMap(mapData);
          await loadData();
          const targetId = res?.mapId || mapData?.mapId;
          if (targetId) setSelectedMapId(targetId);
        }}
        lang={lang}
      />

      <ReportDetailModal
        reportId={selectedReportId}
        isOpen={detailModalOpen}
        isAdmin={isAdmin}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedReportId(null);
        }}
        onStatusUpdated={loadData}
        lang={lang}
      />

      {/* Coming Soon / Working on it Modal */}
      {comingSoonAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl text-center dark:border-amber-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-950/60">
              🚧
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'जल्द आ रहा है / प्रगति पर है' : 'Coming Soon / Working On It'}
            </h3>
            <p className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
              Action: &quot;{comingSoonAction}&quot;
            </p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'hi'
                ? 'यह सुविधा वर्तमान में विकास के अधीन है और आगामी अपडेट में सक्रिय होगी।'
                : 'This command action is currently under development and will be connected to automated live dispatch soon.'}
            </p>
            <button
              type="button"
              onClick={() => setComingSoonAction(null)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-700 hover:to-orange-700 transition active:scale-95"
            >
              {lang === 'hi' ? 'ठीक है' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}