import { useEffect, useState, useCallback } from 'react';
import Badge from '../components/common/Badge';
import InteractiveMelaMap from '../components/mela/InteractiveMelaMap';
import FacilityAdminModal from '../components/mela/FacilityAdminModal';
import UnifiedLostFoundReportingModal from '../components/mela/UnifiedLostFoundReportingModal';
import UnifiedLostFoundDirectory from '../components/mela/UnifiedLostFoundDirectory';
import ReportDetailModal from '../components/mela/ReportDetailModal';
import MelaCrowdSafetyAlertsSection from '../components/mela/MelaCrowdSafetyAlertsSection';
import CrowdAlertAdminModal from '../components/mela/CrowdAlertAdminModal';
import CrowdDensityGrid from '../components/mela/CrowdDensityGrid';

import {
  getMelaOverview,
  getMelaFacilities,
  createMelaFacility,
  updateMelaFacility,
  deleteMelaFacility,
  getLostFoundReports,
  createLostFoundReport,
  updateReportStatus,
  getMelaAlerts,
  createMelaAlert,
  resolveMelaAlert,
  getMelaMaps,
  getCrowdZones,
} from '../services/melaService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function MelaSurakshaPage() {
  const { lang, t } = useLanguage();
  const { user, isAdmin, loginAs } = useAuth();

  // Data states
  const [data, setData] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reportsData, setReportsData] = useState({ reports: [], pagination: {} });
  const [maps, setMaps] = useState([]);
  const [crowdZones, setCrowdZones] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState('prayagraj_kumbh');

  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Map focus interaction
  const [focusedLocation, setFocusedLocation] = useState(null);

  // Modals
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [pickedCoords, setPickedCoords] = useState(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Load all live Mela data from MongoDB
  const fetchAllData = useCallback(async () => {
    try {
      const [overviewRes, facilitiesRes, alertsRes, reportsRes, mapsRes, zonesRes] = await Promise.all([
        getMelaOverview(),
        getMelaFacilities(),
        getMelaAlerts(),
        getLostFoundReports({ limit: 12 }),
        getMelaMaps(),
        getCrowdZones(),
      ]);

      if (overviewRes) setData(overviewRes);
      setFacilities(facilitiesRes || []);
      setAlerts(alertsRes || []);
      setReportsData(reportsRes || { reports: [], pagination: {} });
      setMaps(mapsRes || []);
      setCrowdZones(zonesRes || []);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching Mela data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // Auto-refresh every 15 seconds so MongoDB updates reflect automatically
    const interval = setInterval(fetchAllData, 15000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // Facility handlers
  const handleSaveFacility = async (formData, id) => {
    if (id) {
      await updateMelaFacility(id, formData);
    } else {
      await createMelaFacility(formData);
    }
    await fetchAllData();
  };

  const handleDeleteFacility = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility from the live map?')) {
      await deleteMelaFacility(id);
      await fetchAllData();
    }
  };

  // Report filters handler
  const handleReportFilterChange = async (filters) => {
    setReportsLoading(true);
    try {
      const res = await getLostFoundReports(filters);
      setReportsData(res);
    } catch (err) {
      console.error('Error filtering reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  // Report creation handler
  const handleReportCreated = async (payload) => {
    const res = await createLostFoundReport(payload);
    await fetchAllData();
    return res;
  };

  // Update report review status
  const handleUpdateReportStatus = async (id, status) => {
    await updateReportStatus(id, { status });
    await fetchAllData();
  };

  // Alert handlers
  const handleSaveAlert = async (formData) => {
    await createMelaAlert(formData);
    await fetchAllData();
  };

  const handleResolveAlert = async (id) => {
    await resolveMelaAlert(id);
    await fetchAllData();
  };

  // Focus on map from an alert
  const handleViewAlertOnMap = (coords) => {
    setFocusedLocation(coords);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  if (loading && !data) {
    return (
      <div className="container-page py-20 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-semibold text-slate-500">Loading live Mela GIS telemetry & database...</p>
      </div>
    );
  }

  const isMatchMap = (itemMapId) => {
    if (!itemMapId) return selectedMapId === 'prayagraj_kumbh';
    return itemMapId === selectedMapId;
  };

  const defaultMaps = [
    {
      mapId: 'prayagraj_kumbh',
      name: 'Prayagraj Maha Kumbh 2025 (Sangam Ground)',
      imageUrl: '/mela-blueprint-map.jpg',
      description: 'Sangam confluence, Akhada camp, Kalpwas sectors, and pontoon bridges ground layout.',
      isDefault: true,
    },
  ];
  const allMaps = maps && maps.length > 0 ? maps : defaultMaps;
  const currentMap = allMaps.find((m) => m.mapId === selectedMapId) || allMaps[0] || defaultMaps[0];

  const scopedFacilities = facilities.filter((f) => isMatchMap(f.mapId));
  const scopedAlerts = alerts.filter((a) => isMatchMap(a.mapId));
  const scopedReports = reportsData.reports.filter((r) => isMatchMap(r.mapId));
  const scopedCrowdZones = crowdZones.filter((z) => isMatchMap(z.mapId));

  const counters = [
    { label: `${currentMap?.name ? currentMap.name.split(' ')[0] : 'Mela'} Status`, val: data?.crowdStatus || 'Normal', isStatus: true, color: 'from-amber-500 to-orange-600' },
    { label: 'Active Facilities', val: scopedFacilities.length, color: 'from-teal-500 to-emerald-600' },
    { label: 'Official Alerts', val: scopedAlerts.filter((a) => a.status === 'Active').length, color: 'from-rose-500 to-red-600' },
    { label: 'Missing Cases', val: scopedReports.length, color: 'from-indigo-500 to-blue-600' },
    { label: 'Monitored Zones', val: scopedCrowdZones.length, color: 'from-cyan-500 to-teal-600' },
  ];

  return (
    <div className="container-page py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">
            <span className="gradient-title">{t('mela.title')}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Viewing fair & layout: <strong className="text-teal-600 dark:text-teal-400">{currentMap?.name}</strong>
            </p>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Atlas Live
            </span>
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400">Refreshed: {lastRefreshed}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchAllData}
            className="btn-outline text-xs py-2 px-3.5 font-bold flex items-center gap-2"
          >
            <span>🔄</span>
            <span>{lang === 'hi' ? 'रीफ्रेश' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* 5 Metric Counters */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
        {counters.map((c, i) => (
          <div key={i} className="glass-card relative overflow-hidden p-4.5 flex flex-col justify-between">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.color}`} />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{c.label}</span>
            <span
              className={`mt-2 font-black ${
                c.isStatus ? 'text-xl text-amber-600 dark:text-amber-400' : 'text-3xl text-slate-900 dark:text-white'
              }`}
            >
              {c.val}
            </span>
          </div>
        ))}
      </div>

      {/* FEATURE 1: INTERACTIVE MELA MAP (Citizen View) */}
      <section className="space-y-4">
        <InteractiveMelaMap
          facilities={facilities}
          alerts={scopedAlerts}
          maps={maps}
          selectedMapId={selectedMapId}
          onSelectMap={(id) => setSelectedMapId(id)}
          focusedLocation={focusedLocation}
          isAdmin={false}
          lang={lang}
        />
      </section>

      {/* FEATURE 3: MELA CROWD SAFETY & OFFICIAL ALERTS (Citizen View) */}
      <section className="space-y-4">
        <MelaCrowdSafetyAlertsSection
          alerts={scopedAlerts}
          isAdmin={false}
          onViewOnMap={handleViewAlertOnMap}
          lang={lang}
        />
      </section>

      {/* FEATURE 2: UNIFIED MISSING PERSONS DIRECTORY (Citizen View) */}
      <section className="space-y-4">
        <UnifiedLostFoundDirectory
          reports={scopedReports}
          pagination={reportsData.pagination}
          loading={reportsLoading}
          isAdmin={false}
          onOpenReportModal={(id) => {
            setSelectedReportId(id);
            setDetailModalOpen(true);
          }}
          onOpenNewReport={() => setReportModalOpen(true)}
          onFilterChange={handleReportFilterChange}
          lang={lang}
        />
      </section>

      {/* Bottom Crowd Density Reference Grid */}
      <section className="glass-card p-6 space-y-4 border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>👥</span>
            <span>{t('mela.crowdZones')} — {currentMap?.name}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {scopedCrowdZones.length} Zone{scopedCrowdZones.length !== 1 ? 's' : ''} Monitored
          </span>
        </div>
        <CrowdDensityGrid zones={scopedCrowdZones} />
      </section>

      {/* CITIZEN MODALS */}
      {/* 1. Missing Person Report Filing Modal */}
      <UnifiedLostFoundReportingModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportCreated={handleReportCreated}
        currentMapName={currentMap?.name}
        selectedMapId={selectedMapId}
        lang={lang}
      />

      {/* 2. Report Detail & Found Matching Modal (Citizen View) */}
      <ReportDetailModal
        reportId={selectedReportId}
        isOpen={detailModalOpen}
        isAdmin={false}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedReportId(null);
        }}
        onStatusUpdated={fetchAllData}
        lang={lang}
      />
    </div>
  );
}
