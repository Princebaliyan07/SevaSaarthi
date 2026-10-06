import { useState } from 'react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function VolunteerTeamCard({
  teamName,
  badgeType = 'verified',
  badgeLabel = 'Verified team',
  memberCount = 42,
  onJoin,
}) {
  const { lang, t } = useLanguage();
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    setJoined(true);
    onJoin?.(teamName);
  };

  return (
    <div className="card flex items-center justify-between p-4 bg-white transition-shadow hover:shadow-card">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-ink">{teamName}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              badgeType === 'verified'
                ? 'bg-emerald-700 text-white'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {badgeLabel}
          </span>
        </div>
        <p className="text-xs text-ink-soft">
          {memberCount} {lang === 'hi' ? 'सदस्य' : 'members'}
        </p>
      </div>

      <button
        type="button"
        onClick={handleJoin}
        disabled={joined}
        className={joined ? 'btn-outline text-xs' : 'btn-primary text-xs'}
      >
        {joined ? (lang === 'hi' ? '✓ शामिल हुए' : '✓ Joined') : t('volunteers.join')}
      </button>
    </div>
  );
}
