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
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');

  const handleTypeChange = (type) => {
    setSelectedType(type);
    if (onFilterChange) onFilterChange({ reportType: type, status: selectedStatus, search });
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    if (onFilterChange) onFilterChange({ reportType: selectedType, status, search });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterChange) onFilterChange({ reportType: selectedType, status: selectedStatus, search });
  };

  const TYPE_TABS = [
    { key: 'all', label: 'All Cases', labelHi: 'सभी मामले', icon: '📋' },
    { key: 'missing_person', label: 'Missing Persons', labelHi: 'लापता व्यक्ति', icon: '👤' },
    { key: 'lost_item', label: 'Lost Items', labelHi: 'खोया सामान', icon: '🎒' },
    { key: 'found_person', label: 'Found Persons', labelHi: 'मिले व्यक्ति', icon: '🤝' },
    { key: 'found_item', label: 'Found Items', labelHi: 'पाया सामान', icon: '📦' },
  ];

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
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔍</span>
            <span>{lang === 'hi' ? 'खोया-पाया व लापता व्यक्ति सर्च डायरेक्टरी' : 'Lost & Found / Missing Persons Registry'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'hi'
              ? 'गोपनीय संपर्क सुरक्षा, मैच सत्यापन और आधिकारिक प्रशासनिक समीक्षा प्रणाली।'
              : 'Publicly approved records only. Private contact numbers and emails remain protected.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all shrink-0"
        >
          <span>➕</span>
          <span>{lang === 'hi' ? 'नई रिपोर्ट दर्ज करें' : 'File a Report'}</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        {/* Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTypeChange(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedType === tab.key
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{lang === 'hi' ? tab.labelHi : tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              placeholder={lang === 'hi' ? 'केस ID, नाम, सामान या स्थान से खोजें...' : 'Search by reference ID, person name, item or location...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
          </form>

          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Possible Match">Possible Match</option>
            <option value="Verified Match">Verified Match</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports Listing */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading verified reports from MongoDB...</div>
      ) : reports.length === 0 ? (
        <div className="py-10 text-center space-y-2 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
          <span className="text-2xl">📭</span>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'कोई रिपोर्ट नहीं मिली।' : 'No verified reports found matching your criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => {
            const isPerson = rep.reportType === 'missing_person' || rep.reportType === 'found_person';
            return (
              <div
                key={rep.reportRefId || rep._id}
                className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4.5 space-y-3 hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
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

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {rep.personName || rep.itemDescription || 'Incident Article'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      📍 {rep.location} · ⏰ {rep.dateTimeApprox}
                    </p>
                  </div>

                  {isPerson ? (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      {rep.clothingDescription && (
                        <p>
                          <span className="font-semibold text-slate-500">Attire:</span> {rep.clothingDescription}
                        </p>
                      )}
                      {rep.personAge && (
                        <p>
                          <span className="font-semibold text-slate-500">Age:</span> {rep.personAge} yrs ({rep.personGender})
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-500">Category:</span> {rep.itemCategory}
                    </div>
                  )}

                  {rep.matchNotes && (
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-[10px] text-amber-800 dark:text-amber-300 border border-amber-300">
                      ⚠️ Candidate Match Note: {rep.matchNotes}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>🔒 Protected Contacts</span>
                    {rep.messages?.length > 0 && <span>· 💬 {rep.messages.length}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && onUpdateStatus && (
                      <select
                        value={rep.status}
                        onChange={(e) => onUpdateStatus(rep.reportRefId || rep._id, e.target.value)}
                        className="text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-slate-800 dark:text-white"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Possible Match">Possible Match</option>
                        <option value="Verified Match">Verified Match</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenReportModal(rep.reportRefId || rep._id)}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 border border-teal-500/20 transition-all"
                    >
                      View Case →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
