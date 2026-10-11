import { useState } from 'react';

export default function UnifiedLostFoundDirectory({
  reports = [],
  pagination = {},
  loading = false,
  onOpenReportModal,
  onOpenNewReport,
  onFilterChange,
  isAdmin = false,
  onUpdateStatus = null,
  lang = 'en',
}) {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (onFilterChange) onFilterChange({ status, search });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterChange) onFilterChange({ status: selectedStatus, search });
  };

  const STATUS_TAGS = {
    Submitted: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
    'Under Review': 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
    'Possible Match': 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300',
    'Verified Match': 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300',
    Resolved: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300',
    Rejected: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300',
  };

  return (
    <div className="glass-card p-6 space-y-6 border-slate-200/80 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 text-base">
              👤
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {lang === 'hi' ? 'महाकुंभ लापता व्यक्ति खोज एवं पुनर्मिलन केंद्र' : 'Missing Persons Registry & Tracing Desk'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'लापता व्यक्तियों की लाइव सूची, फ़ोटो सत्यापन, एवं सुरक्षित संपर्क सुरक्षा।'
              : 'Search verified missing persons cases. Compare photos and track safe reunification locations.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewReport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all shrink-0"
        >
          <span>📢</span>
          <span>{lang === 'hi' ? 'लापता व्यक्ति रिपोर्ट करें' : 'Report Missing Person'}</span>
        </button>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            placeholder={lang === 'hi' ? 'नाम, केस ID, कपड़े या स्थान से खोजें...' : 'Search by name, case ID, attire, or last seen location...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                if (onFilterChange) onFilterChange({ status: selectedStatus, search: '' });
              }}
              className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </form>

        <select
          value={selectedStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs shrink-0"
        >
          <option value="all">All Statuses ({reports.length})</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Possible Match">Possible Match (Found)</option>
          <option value="Verified Match">Verified Match</option>
          <option value="Resolved">Resolved / Reunited</option>
        </select>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading cases from MongoDB Atlas...</div>
      ) : reports.length === 0 ? (
        <div className="py-10 text-center space-y-2 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
          <span className="text-2xl">🕊️</span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'कोई मामला नहीं मिला।' : 'No matching missing persons cases registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((rep) => {
            const hasFoundPhoto = Boolean(rep.foundPhotoUrl);
            const isResolved = rep.status === 'Resolved' || rep.status === 'Verified Match';

            return (
              <div
                key={rep.reportRefId || rep._id}
                className={`group rounded-2xl border p-4 space-y-3 transition-all flex flex-col justify-between ${
                  isResolved
                    ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : rep.status === 'Possible Match'
                    ? 'border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/20'
                    : 'border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 hover:border-rose-400/50 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar with Case ID and Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {rep.reportRefId}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        STATUS_TAGS[rep.status] || STATUS_TAGS.Submitted
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  {/* Photo Showcase (Dual thumbnails if both exist) */}
                  <div className="flex gap-2">
                    {/* Missing photo */}
                    <div className="flex-1 relative h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {rep.photoUrl ? (
                        <img
                          src={rep.photoUrl}
                          alt={rep.personName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <span className="text-xl">👤</span>
                          <span className="text-[9px]">Missing Photo</span>
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-950/80 text-white backdrop-blur-xs">
                        When Missing
                      </span>
                    </div>

                    {/* Found photo if reported */}
                    {hasFoundPhoto && (
                      <div className="flex-1 relative h-32 rounded-xl overflow-hidden bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/60">
                        <img
                          src={rep.foundPhotoUrl}
                          alt="When found"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-700 text-white">
                          When Found
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Info */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      {rep.personName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {rep.personGender} · {rep.personAge ? `${rep.personAge} yrs` : 'Age unknown'}
                    </p>
                  </div>

                  {/* Locations */}
                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 font-semibold">Last Seen:</span> 📍 {rep.location} ({rep.dateTimeApprox})
                    </p>
                    {rep.foundLocation && (
                      <p className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                        🎯 Found At: {rep.foundLocation}
                      </p>
                    )}
                    {rep.clothingDescription && (
                      <p className="text-slate-500 line-clamp-1">
                        👕 {rep.clothingDescription}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    🔒 Contacts Protected
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenReportModal(rep.reportRefId || rep._id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 shadow-xs transition-all"
                  >
                    Compare & Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
