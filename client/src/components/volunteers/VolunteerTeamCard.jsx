import { useLanguage } from '../../context/LanguageContext';

export default function VolunteerTeamCard({
  team,
  onJoin = null,
  onViewDetails = null,
}) {
  const { lang } = useLanguage();

  if (!team) return null;

  const isVerified = team.verificationStatus === 'Verified' || team.isVerified;
  const isAtCapacity = team.operationalStatus === 'At Capacity';
  const isUnavailable = team.operationalStatus === 'Temporarily Unavailable' || team.operationalStatus === 'Inactive';

  const STATUS_STYLES = {
    'Accepting Members': 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300',
    'Active Relief Operation': 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 animate-pulse',
    'At Capacity': 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
    'Temporarily Unavailable': 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300',
    Inactive: 'bg-slate-100 text-slate-500 border-slate-300',
  };

  return (
    <div className="glass-card p-5 border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between space-y-4">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {team.name}
              </h3>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                  <span>✓</span>
                  <span>Verified Team</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <span>⏳</span>
                  <span>Pending Check</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span>📍 {team.location}</span>
              {team.distanceText && (
                <>
                  <span>·</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {team.distanceText}
                  </span>
                </>
              )}
            </p>
          </div>

          <span
            className={`shrink-0 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border ${
              STATUS_STYLES[team.operationalStatus] || STATUS_STYLES['Accepting Members']
            }`}
          >
            {team.operationalStatus || 'Accepting Members'}
          </span>
        </div>

        {team.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
            {team.description}
          </p>
        )}

        {/* Member Count & Capacity Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <span>
              Team Strength: <strong className="text-slate-900 dark:text-white">{team.activeMembers || 1}</strong> members
            </span>
            <span className="text-[11px] font-mono">
              Cap: {team.capacity || 50}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAtCapacity ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{
                width: `${Math.min(100, Math.round(((team.activeMembers || 1) / (team.capacity || 50)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Skills & Disasters Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {team.skills?.slice(0, 3).map((sk, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {sk}
            </span>
          ))}
          {team.skills?.length > 3 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 text-slate-400">
              +{team.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-[11px] text-slate-400">
          Leader: <span className="font-bold text-slate-700 dark:text-slate-300">{team.leaderName}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(team)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-xs"
            >
              Details
            </button>
          )}

          {onJoin && (
            <button
              type="button"
              disabled={isAtCapacity || isUnavailable}
              onClick={() => onJoin(team)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isAtCapacity || isUnavailable
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              {isAtCapacity
                ? lang === 'hi'
                  ? 'टीम भरी है'
                  : 'At Capacity'
                : lang === 'hi'
                ? 'शामिल हों'
                : 'Join Team'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
