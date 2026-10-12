import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import InteractiveMelaMap, { FACILITY_CATEGORIES } from '../mela/InteractiveMelaMap';
import { PANEL, INPUT, LABEL, BTN, Pill, SectionHead, EmptyState, DataTable, ROW, Tabs } from './commandUi';

const EMPTY_ZONE = { name: '', description: '', advisory: '', status: 'Normal', density: 0 };
const ZONE_TONE = { Normal: 'green', Moderate: 'amber', High: 'orange', Critical: 'rose' };

export default function CommandMelaAdminTab({
  facilities = [],
  alerts = [],
  reports = [],
  crowdZones = [],
  maps = [],
  selectedMapId = 'prayagraj_kumbh',
  onSelectMap = null,
  onOpenAddMap = null,
  onDeleteMap = null,
  onCreateCrowdZone = null,
  onUpdateCrowdZone = null,
  onDeleteCrowdZone = null,
  onOpenAddFacility,
  onOpenEditFacility,
  onDeleteFacility,
  onOpenCreateAlert,
  onResolveAlert,
  onDeleteAlert = null,
  onUpdateReportStatus,
  onOpenReportModal,
  lang = 'en',
}) {
  const { user, isAdmin } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('verification');
  const [updatingZoneId, setUpdatingZoneId] = useState(null);
  const [showAddZoneForm, setShowAddZoneForm] = useState(false);
  const [newZone, setNewZone] = useState(EMPTY_ZONE);
  const [savingZone, setSavingZone] = useState(false);

  const isMatchMap = (itemMapId) => {
    if (!itemMapId) return selectedMapId === 'prayagraj_kumbh';
    return itemMapId === selectedMapId;
  };

  const allMaps = maps || [];
  const activeMap = allMaps.find((m) => m.mapId === selectedMapId) || allMaps[0] || null;

  const scopedReports = reports.filter((r) => isMatchMap(r.mapId));
  const scopedFacilities = facilities.filter((f) => isMatchMap(f.mapId));
  const scopedAlerts = alerts.filter((a) => isMatchMap(a.mapId));
  const scopedCrowdZones = crowdZones.filter((z) => isMatchMap(z.mapId));

  const resetZoneForm = () => {
    setShowAddZoneForm(false);
    setNewZone(EMPTY_ZONE);
  };

  const subTabs = [
    { id: 'verification', icon: '📸', label: 'Photo verification', count: scopedReports.filter((r) => r.status === 'Possible Match').length },
    { id: 'facilities', icon: '🗺️', label: 'Map and facilities', count: scopedFacilities.length },
    { id: 'alerts', icon: '🚨', label: 'Safety alerts', count: scopedAlerts.filter((a) => a.status === 'Active').length },
    { id: 'crowd_zones', icon: '👥', label: 'Crowd zones', count: scopedCrowdZones.length },
  ];

  return (
    <div className="space-y-5">
      {/* ================= HEADER: map, sign-in ================= */}
      <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Mela layout and missing-person desk
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Working on <strong className="text-slate-800 dark:text-slate-200">{activeMap?.name}</strong>. Everything below belongs to this map only.
            </p>
          </div>

          {/* Official Administrative Status */}
          <div className="shrink-0">
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {user?.name || 'Command Officer'} (Admin Verified)
              </span>
            </div>
          </div>
        </div>

        {/* Map selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
            <span className="shrink-0 text-xs font-semibold text-slate-500">Active map</span>
            {allMaps.map((m) => {
              const isSelected = activeMap?.mapId === m.mapId;
              return (
                <div key={m.mapId} className="group flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectMap && onSelectMap(m.mapId)}
                    aria-pressed={isSelected}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span aria-hidden="true">{isSelected ? '📍' : '🗺️'}</span>
                    {m.name}
                  </button>
                  {isAdmin && onDeleteMap && m.mapId !== 'prayagraj_kumbh' && (
                    <button
                      type="button"
                      title={`Delete map: ${m.name}`}
                      aria-label={`Delete map ${m.name}`}
                      onClick={() => onDeleteMap(m.mapId)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-xs text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 shadow-xs"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {isAdmin && onOpenAddMap && (
            <button type="button" onClick={onOpenAddMap} className={BTN.primary}>
              + Add ground map
            </button>
          )}
        </div>
      </div>

      {/* ================= SUB TABS ================= */}
      <Tabs tabs={subTabs} active={activeSubTab} onChange={setActiveSubTab} ariaLabel="Mela sections" />

      {/* ================= 1. PHOTO VERIFICATION ================= */}
      {activeSubTab === 'verification' && (
        <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
          <SectionHead
            title="Missing-person verification"
            desc="Compare the photo from the family with the photo from the finder, check where the person was found, then mark a verified match."
          >
            <Pill>{scopedReports.length} case{scopedReports.length !== 1 ? 's' : ''}</Pill>
          </SectionHead>

          {scopedReports.length === 0 ? (
            <EmptyState icon="🔎" title="No missing-person reports yet" hint={`Nothing has been reported for ${activeMap?.name}.`} />
          ) : (
            <div className="space-y-4">
              {scopedReports.map((rep) => {
                const isMatchCandidate = rep.status === 'Possible Match';
                const isVerified = rep.status === 'Verified Match' || rep.status === 'Resolved';

                return (
                  <article
                    key={rep.reportRefId || rep._id}
                    className={`rounded-2xl border p-4 sm:p-5 ${
                      isMatchCandidate
                        ? 'border-amber-300 bg-amber-50/50 dark:border-amber-700/50 dark:bg-amber-950/20'
                        : isVerified
                        ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                      {/* Photos side by side */}
                      <div className="grid w-full shrink-0 grid-cols-2 gap-3 lg:w-72">
                        <figure className="space-y-1.5">
                          <figcaption className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-rose-500" /> When missing
                          </figcaption>
                          <div className="h-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                            {rep.photoUrl ? (
                              <img src={rep.photoUrl} alt="Person when reported missing" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-slate-400">No photo</div>
                            )}
                          </div>
                        </figure>
                        <figure className="space-y-1.5">
                          <figcaption className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> When found
                          </figcaption>
                          <div className="h-28 overflow-hidden rounded-xl border-2 border-emerald-300 bg-slate-100 dark:border-emerald-800 dark:bg-slate-800">
                            {rep.foundPhotoUrl ? (
                              <img src={rep.foundPhotoUrl} alt="Person when found" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center text-[11px] text-slate-400">
                                <span aria-hidden="true">⏳</span>
                                Waiting for photo
                              </div>
                            )}
                          </div>
                        </figure>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {rep.reportRefId}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {rep.personName} ({rep.personGender}, {rep.personAge || 'age unknown'}{rep.personAge ? ' yrs' : ''})
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                            <p className="text-[11px] font-semibold text-slate-400">Last seen</p>
                            <p className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">📍 {rep.location}</p>
                            <p className="text-[11px] text-slate-400">{rep.dateTimeApprox}</p>
                          </div>
                          <div
                            className={`rounded-xl border p-3 ${
                              rep.foundLocation
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
                                : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/60'
                            }`}
                          >
                            <p className="text-[11px] font-semibold opacity-80">Found at</p>
                            <p className="mt-0.5 font-semibold">
                              {rep.foundLocation ? `🎯 ${rep.foundLocation}` : 'Not located yet'}
                            </p>
                            {rep.foundFinderName && (
                              <p className="text-[11px] opacity-80">Reported by {rep.foundFinderName}</p>
                            )}
                          </div>
                        </div>

                        {rep.clothingDescription && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            <strong>Clothing: </strong>
                            {rep.clothingDescription}
                          </p>
                        )}

                        {/* Contact revealed only after verification */}
                        {isVerified ? (
                          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <div>
                              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                                🔓 Verified reporter contact
                              </p>
                              <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {rep.reporterName}: {rep.reporterPhone || 'Number protected'}
                              </p>
                            </div>
                            {rep.reporterPhone && (
                              <a
                                href={`tel:${rep.reporterPhone}`}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700"
                              >
                                📞 Call family
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-500 dark:bg-slate-800/60">
                            🔒 The family's phone number stays hidden until the case is marked "Verified Match".
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex w-full shrink-0 flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-800 lg:w-auto lg:items-end lg:border-t-0 lg:pt-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500">Status</span>
                          {isAdmin ? (
                            <select
                              value={rep.status}
                              onChange={(e) => onUpdateReportStatus(rep.reportRefId || rep._id, e.target.value)}
                              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Possible Match">Possible Match</option>
                              <option value="Verified Match">✅ Verified Match</option>
                              <option value="Resolved">Resolved / Reunited</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          ) : (
                            <Pill tone={isVerified ? 'green' : isMatchCandidate ? 'amber' : 'slate'}>{rep.status}</Pill>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenReportModal(rep.reportRefId || rep._id)}
                          className={BTN.primary}
                        >
                          Open case file and chat
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 2. FACILITIES ================= */}
      {activeSubTab === 'facilities' && (
        <div className={`${PANEL} space-y-6 p-5 sm:p-6`}>
          <SectionHead
            title="Map facilities and markers"
            desc="Click the map to place a marker anywhere on the layout, or manage the existing markers in the table. Changes show on the visitor map straight away."
          >
            {isAdmin && (
              <button type="button" onClick={() => onOpenAddFacility()} className={BTN.primary}>
                + Add marker
              </button>
            )}
          </SectionHead>

          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <InteractiveMelaMap
              facilities={facilities}
              alerts={alerts}
              maps={maps}
              selectedMapId={selectedMapId}
              onSelectMap={onSelectMap}
              onOpenAddMap={onOpenAddMap}
              onDeleteMap={onDeleteMap}
              isAdmin={isAdmin}
              onAddFacility={onOpenAddFacility}
              onEditFacility={onOpenEditFacility}
              onDeleteFacility={onDeleteFacility}
              lang={lang}
            />
          </div>

          {scopedFacilities.length === 0 ? (
            <EmptyState icon="📍" title="No markers on this map yet" hint='Use "Add marker" or click the map to place one.' />
          ) : (
            <DataTable columns={['Facility', 'Category', 'Sector', 'Map position', 'Status', 'Actions']} lastRight>
              {scopedFacilities.map((fac) => {
                const cat = FACILITY_CATEGORIES[fac.category] || FACILITY_CATEGORIES.help_desk;
                return (
                  <tr key={fac.facilityId || fac._id} className={ROW}>
                    <td className="px-3 py-3">
                      <span className="block font-bold text-slate-900 dark:text-white">{fac.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">{fac.facilityId}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <span aria-hidden="true">{cat.icon}</span>
                        {cat.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">{fac.sector}</td>
                    <td className="px-3 py-3 font-mono text-[11px]">
                      X {fac.mapX}%, Y {fac.mapY}%
                    </td>
                    <td className="px-3 py-3">
                      <Pill tone="green">{fac.status}</Pill>
                    </td>
                    <td className="px-3 py-3 text-right">
                      {isAdmin ? (
                        <div className="flex items-center justify-end gap-3">
                          <button type="button" onClick={() => onOpenEditFacility(fac)} className="font-bold text-teal-600 hover:underline">
                            Edit
                          </button>
                          <button type="button" onClick={() => onDeleteFacility(fac.facilityId || fac._id)} className="font-bold text-rose-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400">Sign in to edit</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= 3. ALERTS ================= */}
      {activeSubTab === 'alerts' && (
        <div className={`${PANEL} space-y-5 p-5 sm:p-6`}>
          <SectionHead
            title="Crowd safety alerts"
            desc={`Broadcast warnings about crowd surges, closed bridges and safety rules for ${activeMap?.name}.`}
          >
            {isAdmin && (
              <button type="button" onClick={onOpenCreateAlert} className={BTN.danger}>
                📢 Broadcast alert
              </button>
            )}
          </SectionHead>

          {scopedAlerts.length === 0 ? (
            <EmptyState icon="✅" title="No alerts for this map" hint='Use "Broadcast alert" to create one.' />
          ) : (
            <DataTable columns={['Alert', 'Type', 'Severity', 'Location', 'Status', 'Action']} lastRight>
              {scopedAlerts.map((a) => (
                <tr key={a.alertId || a._id} className={ROW}>
                  <td className="px-3 py-3">
                    <span className="block font-bold text-slate-900 dark:text-white">{a.title}</span>
                    <span className="text-[11px] text-slate-500">{a.recommendedAction}</span>
                  </td>
                  <td className="px-3 py-3">{a.alertType}</td>
                  <td className="px-3 py-3 font-semibold">{a.severity}</td>
                  <td className="px-3 py-3">{a.affectedLocation}</td>
                  <td className="px-3 py-3">
                    <Pill tone={a.status === 'Active' ? 'rose' : 'slate'}>{a.status}</Pill>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isAdmin && a.status === 'Active' && onResolveAlert && (
                        <button type="button" onClick={() => onResolveAlert(a.alertId || a._id)} className={BTN.success}>
                          Resolve
                        </button>
                      )}
                      {isAdmin && onDeleteAlert && (
                        <button
                          type="button"
                          onClick={() => onDeleteAlert(a.alertId || a._id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 active:scale-95 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                          title="Delete alert"
                        >
                          🗑️
                        </button>
                      )}
                      {!isAdmin && <span className="text-slate-300">-</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </div>
      )}

      {/* ================= 4. CROWD ZONES ================= */}
      {activeSubTab === 'crowd_zones' && (
        <div className={`${PANEL} space-y-6 p-5 sm:p-6`}>
          <SectionHead
            title="Crowd zones"
            desc={`Add and update crowd zones for ${activeMap?.name}. They appear live on the visitor Mela page.`}
          >
            <Pill>{scopedCrowdZones.length} zone{scopedCrowdZones.length !== 1 ? 's' : ''}</Pill>
            {onCreateCrowdZone && (
              <button
                type="button"
                onClick={() => (showAddZoneForm ? resetZoneForm() : setShowAddZoneForm(true))}
                className={showAddZoneForm ? BTN.secondary : BTN.primary}
              >
                {showAddZoneForm ? 'Cancel' : '+ Add zone'}
              </button>
            )}
          </SectionHead>

          {/* Add zone form */}
          {showAddZoneForm && onCreateCrowdZone && (
            <div className="space-y-4 rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900/50 dark:bg-teal-950/20">
              <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200">New crowd zone</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className={LABEL}>Zone name *</label>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder="e.g. Sangam Ghat Gate 3"
                    value={newZone.name}
                    onChange={(e) => setNewZone((z) => ({ ...z, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className={LABEL}>Starting status</label>
                  <select
                    className={INPUT}
                    value={newZone.status}
                    onChange={(e) => setNewZone((z) => ({ ...z, status: e.target.value }))}
                  >
                    <option>Normal</option>
                    <option>Moderate</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Crowd density (0 to 100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={INPUT}
                    value={newZone.density}
                    onChange={(e) => setNewZone((z) => ({ ...z, density: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className={LABEL}>Description (optional)</label>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder="Short location note"
                    value={newZone.description}
                    onChange={(e) => setNewZone((z) => ({ ...z, description: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>Official advisory</label>
                  <input
                    type="text"
                    className={INPUT}
                    placeholder="e.g. Heavy crowd, use the alternate exit via Gate 4"
                    value={newZone.advisory}
                    onChange={(e) => setNewZone((z) => ({ ...z, advisory: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={resetZoneForm} className={BTN.secondary}>
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingZone || !newZone.name.trim()}
                  onClick={async () => {
                    if (!newZone.name.trim()) return;
                    setSavingZone(true);
                    try {
                      await onCreateCrowdZone({ ...newZone, mapId: selectedMapId });
                      resetZoneForm();
                    } catch (err) {
                      alert('Could not create zone: ' + (err.response?.data?.message || err.message));
                    } finally {
                      setSavingZone(false);
                    }
                  }}
                  className={BTN.primary}
                >
                  {savingZone ? 'Saving...' : 'Create zone'}
                </button>
              </div>
            </div>
          )}

          {scopedCrowdZones.length === 0 && !showAddZoneForm && (
            <EmptyState icon="👥" title={`No crowd zones for ${activeMap?.name} yet`} hint='Click "+ Add zone" to start monitoring a crowd area.' />
          )}

          {scopedCrowdZones.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scopedCrowdZones.map((zone) => {
                const zoneKey = zone.zoneId || zone.id || zone._id;
                const density = zone.density ?? 0;
                const barColor =
                  density >= 85 ? 'bg-rose-500' : density >= 65 ? 'bg-orange-500' : density >= 45 ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <div
                    key={zoneKey}
                    className="space-y-3.5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">{zone.name}</h4>
                        {zone.description && <p className="truncate text-[11px] text-slate-400">{zone.description}</p>}
                      </div>
                      <Pill tone={ZONE_TONE[zone.status] || 'green'}>{zone.status}</Pill>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Crowd density</span>
                        <strong className="font-mono text-slate-900 dark:text-white">{density}%</strong>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(density, 100)}%` }} />
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      <span className="mb-0.5 block font-semibold text-slate-400">Official advisory</span>
                      {zone.advisory || 'Standard movement rules.'}
                    </div>

                    {isAdmin && onUpdateCrowdZone && (
                      <div className="space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <span className="block text-[11px] font-semibold text-slate-400">Quick status change</span>
                        <div className="grid grid-cols-4 gap-1">
                          {['Normal', 'Moderate', 'High', 'Critical'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              disabled={updatingZoneId === zoneKey}
                              onClick={async () => {
                                setUpdatingZoneId(zoneKey);
                                try {
                                  const densityMap = { Normal: 25, Moderate: 55, High: 80, Critical: 95 };
                                  await onUpdateCrowdZone(zoneKey, { status: st, density: densityMap[st] });
                                } catch (err) {
                                  alert('Update failed: ' + err.message);
                                } finally {
                                  setUpdatingZoneId(null);
                                }
                              }}
                              className={`rounded-lg px-1.5 py-1.5 text-[11px] font-bold transition ${
                                zone.status === st
                                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isAdmin && onDeleteCrowdZone && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm(`Delete zone "${zone.name}"? This cannot be undone.`)) return;
                          try {
                            await onDeleteCrowdZone(zoneKey);
                          } catch (err) {
                            alert('Delete failed: ' + err.message);
                          }
                        }}
                        className={`${BTN.softDanger} w-full !py-1.5`}
                      >
                        🗑️ Remove zone
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}