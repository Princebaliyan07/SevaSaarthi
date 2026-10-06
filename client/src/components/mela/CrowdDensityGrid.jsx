import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CrowdDensityGrid({ zones = [] }) {
  const { lang, t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState(zones[0] || null);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'critical':
        return 'bg-sos text-white';
      case 'high':
        return 'bg-alert text-white';
      case 'moderate':
        return 'bg-amber-100 text-amber-900 border border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-900 border border-emerald-300';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {zones.map((z) => {
          const isSelected = selectedZone?.id === z.id;
          return (
            <button
              key={z.id}
              type="button"
              onClick={() => setSelectedZone(z)}
              className={`flex h-28 flex-col justify-between rounded-xl p-4 text-left transition-all ${
                z.color
              } ${
                isSelected
                  ? 'ring-2 ring-brand-dark shadow-md scale-[1.02]'
                  : 'hover:shadow-card opacity-95 hover:opacity-100'
              }`}
            >
              <span className="text-sm font-extrabold">{z.name}</span>
              <span className={`self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(z.status)}`}>
                {z.status}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-line bg-surface p-3 text-xs">
        <span className="block font-semibold text-ink-soft">
          {t('mela.tapZone')}
        </span>
        <p className="mt-1 font-bold text-ink">
          {selectedZone
            ? selectedZone.advisory
            : 'Sangam Ghat: crowd critical. Use alternate exit via Gate 4. Demo data.'}
        </p>
      </div>
    </div>
  );
}
