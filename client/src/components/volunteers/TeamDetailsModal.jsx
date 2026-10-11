import { useLanguage } from '../../context/LanguageContext';

export default function TeamDetailsModal({ team, isOpen, onClose, onJoinRequest }) {
  const { lang } = useLanguage();

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-sm flex justify-center items-start pt-16 sm:pt-20 pb-12">
      <div className="glass-card w-full max-w-2xl my-4 overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {team.name}
              </h2>
              {team.verificationStatus === 'Verified' ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  ✓ Verified Team
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  ⏳ Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {team.teamCategory || 'Disaster Volunteer Unit'} · 📍 {team.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Description & Current Mission */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            About & Deployment
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {team.description || 'Dedicated local volunteer unit supporting disaster response, civic rescue, and community relief operations.'}
          </p>

          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-500/30 flex items-center gap-3">
            <span className="text-xl">🚨</span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Active Relief Mission
              </p>
              <p className="text-xs text-teal-900 dark:text-teal-200 font-semibold">
                {team.currentMission || 'Ready for emergency deployment'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Members</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {team.activeMembers || 1} / {team.capacity || 50}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Missions Done</span>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {team.completedMissions || 0}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {team.operationalStatus || 'Accepting Members'}
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Service Radius</span>
            <p className="text-xs font-black text-slate-700 dark:text-slate-300 mt-1 truncate">
              {team.serviceArea || '25 km'}
            </p>
          </div>
        </div>

        {/* Skills & Disasters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Specialized Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {team.skills?.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Disasters Supported
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {team.supportedDisasters?.map((dis, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                >
                  {dis}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Public Contact & Leader */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Team Leader / Commander:
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {team.leaderName}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {team.leaderPhone ? team.leaderPhone : 'Contact verified by Admin'}
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onJoinRequest(team);
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all"
          >
            Request to Join Team →
          </button>
        </div>
      </div>
    </div>
  );
}
