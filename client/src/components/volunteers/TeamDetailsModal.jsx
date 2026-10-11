import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { unlockTeamContacts } from '../../services/volunteerService';

export default function TeamDetailsModal({ team, isOpen, onClose, onJoinRequest }) {
  const { lang } = useLanguage();
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedData, setUnlockedData] = useState(null);
  const [unlockError, setUnlockError] = useState('');

  if (!isOpen || !team) return null;

  const handleUnlock = async (e) => {
    e?.preventDefault();
    if (!secretKeyInput.trim()) {
      setUnlockError('Please enter your 6-digit Secret Key (e.g. SEC-123456)');
      return;
    }
    setUnlockError('');
    setIsUnlocking(true);
    try {
      const data = await unlockTeamContacts(team.teamId || team._id, secretKeyInput.trim());
      setUnlockedData(data);
    } catch (err) {
      setUnlockError(err.response?.data?.message || 'Invalid or unverified Secret Key. Only admin-approved volunteers can unlock contacts.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleClose = () => {
    setSecretKeyInput('');
    setUnlockedData(null);
    setUnlockError('');
    onClose();
  };

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
            onClick={handleClose}
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

        {/* Confidential Contact & Volunteer Privacy Gate */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Team Leader / Commander:
              </p>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {team.leaderName}
              </p>
            </div>
            <div className="text-right">
              {unlockedData ? (
                <div>
                  <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 block">
                    📞 {unlockedData.leaderPhone}
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block">
                    ✓ Unlocked ({unlockedData.verifiedAs})
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block">
                    🔒 +91 ••••• •••••
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">
                    Private & Locked
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Unlocked Team Roster & Details */}
          {unlockedData ? (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-black text-slate-800 dark:text-slate-200">
                <span>🛡️ Verified Volunteer Fleet Contact Roster:</span>
                <span className="text-[10px] text-emerald-600 font-bold">Authorized Access</span>
              </div>
              <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-xl bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
                {unlockedData.approvedMembers && unlockedData.approvedMembers.length > 0 ? (
                  unlockedData.approvedMembers.map((m, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{m.fullName}</strong>
                        <span className="text-[10px] text-slate-400">{m.role}</span>
                      </div>
                      <a
                        href={`tel:${m.phone}`}
                        className="font-mono font-bold text-teal-600 dark:text-teal-400 text-xs hover:underline flex items-center gap-1"
                      >
                        <span>📞</span>
                        <span>{m.phone}</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">Leader is currently the sole active contact.</p>
                )}
              </div>
            </div>
          ) : (
            /* Locked State with Secret Key Prompt */
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                🔒 <strong>Volunteer Privacy Protection:</strong> Volunteer mobile numbers are strictly confidential and hidden from public view. Only members verified and approved by the admin can view contact details using their assigned <strong>Secret Key</strong>.
              </p>
              <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Secret Key (e.g. SEC-123456)"
                  value={secretKeyInput}
                  onChange={(e) => {
                    setSecretKeyInput(e.target.value);
                    if (unlockError) setUnlockError('');
                  }}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
                />
                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
                >
                  <span>🔑</span>
                  <span>{isUnlocking ? 'Verifying...' : 'Unlock Contact'}</span>
                </button>
              </form>
              {unlockError && (
                <p className="text-[11px] text-rose-500 font-semibold mt-1.5">
                  ⚠️ {unlockError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              handleClose();
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
