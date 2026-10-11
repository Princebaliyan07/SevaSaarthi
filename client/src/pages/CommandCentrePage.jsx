import { useEffect, useState } from 'react';
import Badge from '../components/common/Badge';
import IncidentQueueTable from '../components/command/IncidentQueueTable';
import AnalyticsCharts from '../components/command/AnalyticsCharts';
import AgencyStatusCards from '../components/command/AgencyStatusCards';
import CommandMelaAdminTab from '../components/command/CommandMelaAdminTab';
import FacilityAdminModal from '../components/mela/FacilityAdminModal';
import CrowdAlertAdminModal from '../components/mela/CrowdAlertAdminModal';
import ReportDetailModal from '../components/mela/ReportDetailModal';

import { getIncidents, getCommandStats, updateIncidentStatus } from '../services/incidentService';
import {
  getMelaFacilities,
  createMelaFacility,
  updateMelaFacility,
  deleteMelaFacility,
  getMelaAlerts,
  createMelaAlert,
  resolveMelaAlert,
  getLostFoundReports,
  updateReportStatus,
} from '../services/melaService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function CommandCentrePage() {
  const { lang, t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const [activeMainTab, setActiveMainTab] = useState('incidents'); // 'incidents' | 'mela_ops'

  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Mela Admin State
  const [facilities, setFacilities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);

  // Modals
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const loadData = async () => {
    const [incList, statData, facList, alertList, repData] = await Promise.all([
      getIncidents(),
      getCommandStats(),
      getMelaFacilities({ includeUnpublished: 'true' }),
      getMelaAlerts({ includeInactive: 'true' }),
      getLostFoundReports({ limit: 50 }),
    ]);

    setIncidents(incList || []);
    setStats(statData);
    setFacilities(facList || []);
    setAlerts(alertList || []);
    setReports(repData?.reports || []);
    if (incList?.length > 0 && !selectedIncident) setSelectedIncident(incList[0]);
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 20000);
    return () => clearInterval(timer);
  }, []);

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
    alert(`Action "${actionName}" triggered for incident ${selectedIncident?.id}`);
  };

  // Mela Ops Handlers
  const handleSaveFacility = async (formData, id) => {
    if (id) await updateMelaFacility(id, formData);
    else await createMelaFacility(formData);
    await loadData();
  };

  const handleDeleteFacility = async (id) => {
    if (window.confirm('Delete facility record from database?')) {
      await deleteMelaFacility(id);
      await loadData();
    }
  };

  const handleSaveAlert = async (formData) => {
    await createMelaAlert(formData);
    await loadData();
  };

  const handleResolveAlert = async (id) => {
    await resolveMelaAlert(id);
    await loadData();
  };

  const handleUpdateReportStatus = async (id, status) => {
    await updateReportStatus(id, { status });
    await loadData();
  };

  if (!stats) {
    return <div className="container-page py-16 text-center text-sm text-slate-500">Loading Command Telemetry...</div>;
  }

  const METRIC_CARDS = [
    { label: t('command.activeEmergencies'), val: stats.activeEmergencies, color: 'text-rose-600 dark:text-rose-400', bar: 'from-rose-500 to-red-600' },
    { label: t('command.openIncidents'), val: stats.openIncidents, color: 'text-amber-600 dark:text-amber-400', bar: 'from-amber-500 to-orange-500' },
    { label: 'Mela Facilities', val: facilities.length, color: 'text-teal-600 dark:text-teal-400', bar: 'from-teal-500 to-emerald-500' },
    { label: 'Active Alerts', val: alerts.filter((a) => a.status === 'Active').length, color: 'text-blue-600 dark:text-blue-400', bar: 'from-blue-500 to-indigo-500' },
    { label: 'Lost & Found Queue', val: reports.length, color: 'text-violet-600 dark:text-violet-400', bar: 'from-violet-500 to-purple-600' },
    { label: t('command.resolved'), val: stats.resolved, color: 'text-emerald-600 dark:text-emerald-400', bar: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="container-page py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">
            <span className="gradient-title">{t('command.title')}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('command.subtitle')}</p>
            <Badge type="verified" full />
          </div>
        </div>

        {/* Tab Switcher between General Incident Operations & Mela Administration */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveMainTab('incidents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMainTab === 'incidents'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🚨 Incident Queue & SOS
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('mela_ops')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'mela_ops'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>🕉️</span>
            <span>Mela Command & Admin Operations</span>
          </button>
        </div>
      </div>

      {/* 6 Executive Metric Counters */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {METRIC_CARDS.map((m, i) => (
          <div key={i} className="glass-card relative overflow-hidden p-4.5 flex flex-col justify-between">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.bar}`} />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{m.label}</span>
            <span className={`mt-2 text-3xl font-black ${m.color}`}>
              {m.val}
            </span>
          </div>
        ))}
      </div>

      {activeMainTab === 'incidents' ? (
        <>
          {/* Incident Queue & Analytics Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Incident Queue Table */}
            <div className="lg:col-span-6">
              <IncidentQueueTable
                incidents={incidents}
                selectedId={selectedIncident?.id}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Selected Incident Action Drawer / Card */}
            <div className="space-y-6 lg:col-span-6">
              {selectedIncident && (
                <div className="glass-card p-6 space-y-5 border-teal-500/30 dark:border-teal-400/30">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedIncident.title}
                      </h3>
                      <Badge type={selectedIncident.severity}>
                        {selectedIncident.severity?.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                      {selectedIncident.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs dark:border-slate-800 dark:bg-slate-900/80">
                    <div>
                      <span className="block text-slate-400 font-medium">{t('command.reported')}</span>
                      <strong className="text-slate-900 dark:text-white block mt-0.5">{selectedIncident.reportedAt}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">{t('command.team')}</span>
                      <strong className="text-slate-900 dark:text-white block mt-0.5">{selectedIncident.team}</strong>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">{t('command.eta')}</span>
                      <strong className="text-teal-600 dark:text-teal-400 font-bold block mt-0.5">{selectedIncident.eta}</strong>
                    </div>
                  </div>

                  {selectedIncident.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50/70 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                      📝 {selectedIncident.notes}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAction('Assign team')}
                      className="btn-primary text-xs"
                    >
                      {t('command.assignTeam')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedIncident.id, 'Resolved')}
                      className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:from-emerald-500 hover:to-teal-600 transition-all"
                    >
                      ✓ {t('command.markResolved')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction('Escalate to SDRF/NDRF')}
                      className="btn-sos text-xs"
                    >
                      ⚡ {t('command.escalate')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analytics Charts */}
          <section>
            <AnalyticsCharts
              incidentsByType={stats.incidentsByType}
              responseTimeTrend={stats.responseTimeTrend}
            />
          </section>

          {/* Inter-Agency Status Overview */}
          <section>
            <AgencyStatusCards agencies={stats.agencies} />
          </section>
        </>
      ) : (
        /* Mela Operations Tab with Direct Admin Control */
        <section>
          <CommandMelaAdminTab
            facilities={facilities}
            alerts={alerts}
            reports={reports}
            onOpenAddFacility={() => {
              setEditingFacility(null);
              setFacilityModalOpen(true);
            }}
            onOpenEditFacility={(fac) => {
              setEditingFacility(fac);
              setFacilityModalOpen(true);
            }}
            onDeleteFacility={handleDeleteFacility}
            onOpenCreateAlert={() => setAlertModalOpen(true)}
            onResolveAlert={handleResolveAlert}
            onUpdateReportStatus={handleUpdateReportStatus}
            onOpenReportModal={(id) => {
              setSelectedReportId(id);
              setDetailModalOpen(true);
            }}
            lang={lang}
          />
        </section>
      )}

      {/* Admin Modals */}
      <FacilityAdminModal
        facility={editingFacility}
        isOpen={facilityModalOpen}
        onClose={() => {
          setFacilityModalOpen(false);
          setEditingFacility(null);
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
    </div>
  );
}
