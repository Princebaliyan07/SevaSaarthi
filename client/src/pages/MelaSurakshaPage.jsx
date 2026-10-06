import { useEffect, useState, useCallback } from 'react';
import Badge from '../components/common/Badge';
import CrowdDensityGrid from '../components/mela/CrowdDensityGrid';
import MissingPersonForm from '../components/mela/MissingPersonForm';
import ReunificationLog from '../components/mela/ReunificationLog';
import { getMelaOverview, reunitePerson } from '../services/melaService';
import { useLanguage } from '../context/LanguageContext';

export default function MelaSurakshaPage() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reunitingId, setReunitingId] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchLiveMelaData = useCallback(async () => {
    try {
      const res = await getMelaOverview();
      setData(res);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error fetching Mela data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveMelaData();
    // Auto-refresh every 12 seconds so MongoDB changes reflect automatically
    const interval = setInterval(fetchLiveMelaData, 12000);
    return () => clearInterval(interval);
  }, [fetchLiveMelaData]);

  const handleReunite = async (caseId) => {
    try {
      setReunitingId(caseId);
      await reunitePerson(caseId);
      await fetchLiveMelaData();
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setReunitingId(null);
    }
  };

  const handleReportCreated = async (newCase) => {
    // Immediately reload data from MongoDB Atlas
    await fetchLiveMelaData();
  };

  if (loading && !data) {
    return (
      <div className="container-page py-20 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <p className="text-sm font-semibold text-slate-500">Loading live Mela telemetry from MongoDB...</p>
      </div>
    );
  }

  const missingCases = data?.missingCases || [];
  const filteredCases = missingCases.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.caseId?.toLowerCase().includes(q) ||
      c.lastSeenLocation?.toLowerCase().includes(q)
    );
  });

  const activeCase = missingCases[0] || null;

  const counters = [
    { label: t('mela.crowdStatus'), val: data.crowdStatus, isStatus: true, color: 'from-amber-500 to-orange-600' },
    { label: t('mela.medicalCamps'), val: data.medicalCamps, color: 'from-teal-500 to-emerald-600' },
    { label: t('mela.openIncidents'), val: data.openIncidents, color: 'from-rose-500 to-red-600' },
    { label: t('mela.missingReports'), val: missingCases.length, color: 'from-indigo-500 to-blue-600' },
    { label: t('mela.helpDesks'), val: data.helpDesks, color: 'from-cyan-500 to-teal-600' },
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
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('mela.subtitle')}</p>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Atlas Live
            </span>
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400">Refreshed: {lastRefreshed}</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={fetchLiveMelaData}
          className="btn-outline text-xs py-2 px-3.5 font-bold flex items-center gap-2"
        >
          <span>🔄</span>
          <span>{lang === 'hi' ? 'लाइव डेटा रीफ्रेश करें' : 'Refresh from MongoDB'}</span>
        </button>
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

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Crowd Zones & Dynamic Missing Persons List */}
        <div className="space-y-8 lg:col-span-7">
          {/* Crowd Zones */}
          <section className="glass-card p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>👥</span>
              <span>{t('mela.crowdZones')}</span>
            </h2>
            <CrowdDensityGrid zones={data.zones} />
          </section>

          {/* Dynamic Missing Persons Registry from MongoDB */}
          <section className="glass-card p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📋</span>
                  <span>{lang === 'hi' ? 'लापता व्यक्तियों की लाइव सूची (MongoDB)' : 'Live Missing Persons Registry (MongoDB)'}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'hi' ? 'कुल दर्ज मामले:' : 'Total Active Cases:'}{' '}
                  <span className="font-bold text-rose-600 dark:text-rose-400">{missingCases.length}</span>
                </p>
              </div>

              {/* Search filter */}
              <input
                type="text"
                placeholder={lang === 'hi' ? 'नाम या केस ID खोजें...' : 'Search name or Case ID...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 text-xs text-slate-900 shadow-xs focus:border-brand focus:outline-none dark:border-slate-800 dark:bg-slate-900/90 dark:text-white"
              />
            </div>

            {filteredCases.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                {searchTerm
                  ? lang === 'hi'
                    ? 'कोई परिणाम नहीं मिला।'
                    : 'No matching missing persons found.'
                  : lang === 'hi'
                  ? 'वर्तमान में कोई लापता मामला दर्ज नहीं है।'
                  : 'No missing person reports currently registered in MongoDB.'}
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredCases.map((caseItem) => {
                  const isReunited = caseItem.status === 'Located' || caseItem.status === 'reunited' || caseItem.rawStatus === 'reunited';
                  return (
                    <div
                      key={caseItem.caseId || caseItem.id}
                      className={`rounded-2xl border p-4.5 transition-all duration-200 ${
                        isReunited
                          ? 'border-emerald-500/30 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-950/20'
                          : 'border-rose-500/30 bg-white/90 hover:border-rose-500/50 hover:shadow-md dark:border-rose-500/20 dark:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                              {caseItem.caseId}
                            </span>
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">
                              {caseItem.name}
                            </h3>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({caseItem.gender || 'Other'}, {caseItem.age} yrs)
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            📍 <span className="font-semibold">{lang === 'hi' ? 'स्थान:' : 'Last Seen:'}</span> {caseItem.lastSeenLocation} · {caseItem.lastSeenTime || 'Recent'}
                          </p>

                          {caseItem.clothing && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              👕 <span className="font-semibold">{lang === 'hi' ? 'पहचान / कपड़े:' : 'Attire:'}</span> {caseItem.clothing}
                            </p>
                          )}

                          {caseItem.reportedBy && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              👤 {lang === 'hi' ? 'दर्जकर्ता:' : 'Reported By:'} {caseItem.reportedBy} {caseItem.contactPhone ? `· 📞 ${caseItem.contactPhone}` : ''}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <Badge type={isReunited ? 'verified' : 'high'}>
                            {isReunited ? (lang === 'hi' ? 'मिल गए' : 'Located') : (lang === 'hi' ? 'लापता' : 'Missing')}
                          </Badge>

                          {!isReunited && (
                            <button
                              type="button"
                              disabled={reunitingId === caseItem.caseId}
                              onClick={() => handleReunite(caseItem.caseId)}
                              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-50"
                            >
                              {reunitingId === caseItem.caseId
                                ? lang === 'hi' ? 'अपडेट हो रहा है...' : 'Updating...'
                                : `✅ ${lang === 'hi' ? 'पुनर्मिलन मार्क करें' : 'Mark Reunited'}`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Report missing person form & help points */}
        <div className="space-y-6 lg:col-span-5">
          <MissingPersonForm onReportCreated={handleReportCreated} />
          <ReunificationLog
            helpPoints={data.helpPoints}
            activeCase={activeCase}
            onReunite={handleReunite}
          />
        </div>
      </div>
    </div>
  );
}
