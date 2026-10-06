import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

export default function AgencyStatusCards({ agencies = [] }) {
  const { lang } = useLanguage();

  return (
    <div className="card p-5 bg-white space-y-4">
      <div className="flex items-center justify-between border-b border-line pb-2.5">
        <h3 className="text-base font-bold text-ink">
          {lang === 'hi' ? 'एजेंसी तत्परता एवं परिनियोजन' : 'Agency Readiness & Deployment'}
        </h3>
        <Badge type="verified">{lang === 'hi' ? 'सक्रिय समन्वय' : 'Active Inter-Agency'}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agencies.map((agency) => {
          const total = agency.deployed + agency.available;
          const pct = Math.round((agency.deployed / total) * 100);
          return (
            <div
              key={agency.name}
              className="rounded-xl border border-line bg-surface p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-ink leading-tight">{agency.name}</h4>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    agency.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : agency.status === 'High Load'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {agency.status}
                </span>
              </div>

              <div className="flex justify-between text-ink-soft">
                <span>Deployed: <strong className="text-ink">{agency.deployed}</strong></span>
                <span>Standby: <strong className="text-ink">{agency.available}</strong></span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
