import { useLanguage } from '../../context/LanguageContext';

export default function ReliefCampaignCard({ title, percent = 50 }) {
  const { lang } = useLanguage();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-ink">
        <span>{title}</span>
        <span className="text-ink-soft">
          {percent}% {lang === 'hi' ? 'लक्ष्य पूरा' : 'of goal'}
        </span>
      </div>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
