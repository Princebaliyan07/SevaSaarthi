import { useState } from 'react';
import SeasonalRiskMap from '../components/disaster/SeasonalRiskMap';
import HazardLayerStack from '../components/disaster/HazardLayerStack';
import PreparednessAccordion from '../components/disaster/PreparednessAccordion';
import { useLanguage } from '../context/LanguageContext';

const SEASONS = ['Summer', 'Monsoon', 'Winter', 'Post-Monsoon'];

export default function DisasterPage() {
  const { lang, t } = useLanguage();
  const [activeSeason, setActiveSeason] = useState('Monsoon');

  return (
    <div className="container-page py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl">
          {t('disaster.title')}
        </h1>
        <p className="text-sm text-ink-soft max-w-3xl leading-relaxed">
          {t('disaster.subtitle')}
        </p>
      </div>

      {/* Season Tabs & Layer Filter Stack matching Page 5 */}
      <div className="space-y-4">
        {/* Season Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-line pb-2">
          {SEASONS.map((season) => {
            const isCurrent = activeSeason === season;
            return (
              <button
                key={season}
                type="button"
                onClick={() => setActiveSeason(season)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-surface text-ink-soft hover:bg-white hover:text-ink'
                }`}
              >
                {season === 'Summer'
                  ? t('disaster.summer')
                  : season === 'Monsoon'
                  ? t('disaster.monsoon')
                  : season === 'Winter'
                  ? t('disaster.winter')
                  : t('disaster.postMonsoon')}
              </button>
            );
          })}
        </div>

        {/* Layer Filters */}
        <HazardLayerStack />
      </div>

      {/* Interactive GIS Hazard Map and Incident Details */}
      <SeasonalRiskMap activeSeason={activeSeason} />

      {/* Preparedness Guides Accordion (Before / During / After) */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-ink">
          {t('disaster.preparednessGuides')}
        </h2>
        <PreparednessAccordion />
      </section>
    </div>
  );
}
