import { useState } from 'react';
import Badge from '../common/Badge';
import { useLanguage } from '../../context/LanguageContext';

const HISTORIC_DISASTERS = [
  {
    id: 'kedarnath',
    title: 'Cloudburst: Kedarnath, Uttarakhand',
    titleHi: 'बादल फटना: केदारनाथ, उत्तराखंड',
    year: '2013',
    season: 'Monsoon',
    impact: 'Landslides, major loss of life',
    impactHi: 'भूस्खलन, भारी जन-धन की हानि',
    advice: 'Do not camp near rivers. Check IMD alerts before travel.',
    adviceHi: 'नदियों के पास तंबू न लगाएं। यात्रा से पहले आईएमडी अलर्ट देखें।',
    x: 44,
    y: 20,
    coords: '30.7346° N, 79.0669° E',
    reliefCenter: 'Rishikesh Transit Camp · 140 km',
  },
  {
    id: 'kerala',
    title: 'Monsoon Inundation: Kerala Basin',
    titleHi: 'मानसून बाढ़: केरल बेसिन',
    year: '2018',
    season: 'Monsoon',
    impact: 'Widespread dam overflow & urban flooding',
    impactHi: 'व्यापक बांध ओवरफ्लो और शहरी जलभराव',
    advice: 'Evacuate riverbank lowlands upon red alerts.',
    adviceHi: 'रेड अलर्ट पर नदी किनारे के निचले इलाकों से सुरक्षित निकलें।',
    x: 36,
    y: 86,
    coords: '9.9312° N, 76.2673° E',
    reliefCenter: 'Aluva Flood Shelter Hub · 12 km',
  },
  {
    id: 'odisha',
    title: 'Extremely Severe Cyclone: Fani, Odisha',
    titleHi: 'अति तीव्र चक्रवात: फानी, ओडिशा',
    year: '2019',
    season: 'Summer',
    impact: 'Coastal storm surge & power infrastructure damage',
    impactHi: 'तटीय तूफानी लहरें और बिजली ढांचे को भारी नुकसान',
    advice: 'Move to multi-purpose cyclone shelters 24h prior to landfall.',
    adviceHi: 'तूफान टकराने से 24 घंटे पहले पक्के चक्रवात आश्रय में जाएं।',
    x: 68,
    y: 56,
    coords: '19.8135° N, 85.8312° E',
    reliefCenter: 'Puri District Cyclone Center · 4 km',
  },
  {
    id: 'rajasthan',
    title: 'Severe Heatwave: Thar Basin',
    titleHi: 'भीषण लू / हीटवेव: थार बेसिन',
    year: '2024',
    season: 'Summer',
    impact: 'Peak temperature exceeded 49.2°C; heat stroke casualties',
    impactHi: 'तापमान 49.2°C के पार; हीट स्ट्रोक के मरीज',
    advice: 'Stay hydrated with ORS, avoid outdoors between 12 PM - 4 PM.',
    adviceHi: 'ओआरएस पिएं, दोपहर 12 से 4 के बीच धूप में न निकलें।',
    x: 24,
    y: 40,
    coords: '26.9124° N, 70.9004° E',
    reliefCenter: 'Churu Community Cooling Center · 2 km',
  },
  {
    id: 'chamoli',
    title: 'Flash Flood: Chamoli, Uttarakhand',
    titleHi: 'अचानक बाढ़: चमोली, उत्तराखंड',
    year: '2021',
    season: 'Winter',
    impact: 'Glacial burst triggered Rishiganga surge',
    impactHi: 'ग्लेशियर टूटने से ऋषिगंगा में भीषण सैलाब',
    advice: 'Install early acoustic warning sensors on glacial outwash plains.',
    adviceHi: 'ग्लेशियर नदी क्षेत्रों में पूर्व चेतावनी सेंसर का पालन करें।',
    x: 48,
    y: 22,
    coords: '30.5500° N, 79.5667° E',
    reliefCenter: 'Joshimath Emergency Shelter · 18 km',
  },
];

export default function SeasonalRiskMap({ activeSeason = 'Monsoon' }) {
  const { lang, t } = useLanguage();
  const [selectedIncident, setSelectedIncident] = useState(HISTORIC_DISASTERS[0]);

  // Filter markers if desired or show relevant seasonal markers
  const seasonalIncidents = HISTORIC_DISASTERS.filter(
    (d) => d.season.toLowerCase() === activeSeason.toLowerCase()
  );
  const displayMarkers = seasonalIncidents.length > 0 ? seasonalIncidents : HISTORIC_DISASTERS;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
      {/* Visual GIS Hazard Map */}
      <div className="card overflow-hidden bg-white p-4 lg:col-span-7">
        <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
          <span className="text-xs font-bold text-ink-soft uppercase tracking-wider">
            {lang === 'hi' ? 'जीआईएस मौसमी जोखिम मानचित्र' : 'GIS Seasonal Hazard Overlay'}
          </span>
          <span className="text-xs font-semibold text-brand">
            Season: {activeSeason}
          </span>
        </div>

        <div className="relative mx-auto h-80 w-full max-w-md rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full max-h-72 filter drop-shadow"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* India Boundary */}
            <path
              d="M 38 12 L 46 16 L 44 24 L 56 26 L 68 28 L 74 34 L 88 33 L 92 40 L 84 45 L 75 44 L 70 56 L 62 68 L 52 88 L 48 88 L 40 76 L 28 66 L 24 50 L 32 38 L 34 26 Z"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Northern Kashmir Extension */}
            <path
              d="M 38 12 L 42 6 L 46 8 L 46 16 Z"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="1.2"
            />

            {/* Simulated River Basin Flood Polygon during Monsoon */}
            {activeSeason === 'Monsoon' && (
              <path
                d="M 44 28 Q 58 38 72 48 Q 66 52 50 42 Z"
                fill="#38BDF8"
                fillOpacity="0.4"
                stroke="#0284C7"
                strokeWidth="0.8"
                strokeDasharray="2 1"
              />
            )}

            {/* Simulated Coastal Cyclone Path during Summer/Post-Monsoon */}
            {(activeSeason === 'Summer' || activeSeason === 'Post-Monsoon') && (
              <path
                d="M 76 74 Q 68 62 65 52"
                fill="none"
                stroke="#F97316"
                strokeWidth="1.8"
                strokeDasharray="3 1"
              />
            )}

            {/* Disaster / Risk Point Pins */}
            {displayMarkers.map((item) => {
              const isSelected = selectedIncident.id === item.id;
              return (
                <g
                  key={item.id}
                  className="cursor-pointer transition-all hover:scale-125"
                  onClick={() => setSelectedIncident(item)}
                >
                  <circle
                    cx={item.x}
                    cy={item.y}
                    r={isSelected ? '4' : '3'}
                    fill={isSelected ? '#C81E1E' : '#D97706'}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                  <text
                    x={item.x}
                    y={item.y + 1}
                    textAnchor="middle"
                    fontSize="2.5"
                    fill="#FFFFFF"
                    fontWeight="bold"
                  >
                    !
                  </text>
                  <text
                    x={item.x + 4}
                    y={item.y + 1.2}
                    fontSize="3.2"
                    fontWeight={isSelected ? 'bold' : '500'}
                    fill="#1E293B"
                    className="select-none font-sans"
                  >
                    {item.title.split(':')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Incident Detail Box matching Page 5 wireframe */}
      <div className="card p-5 bg-white lg:col-span-5 space-y-4">
        <div className="border-b border-line pb-3">
          <h3 className="text-lg font-bold text-ink">
            {lang === 'hi' ? selectedIncident.titleHi : selectedIncident.title}
          </h3>
          <p className="mt-1 font-mono text-xs text-ink-soft">
            Coordinates: {selectedIncident.coords}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-1 border-b border-line/60">
            <span className="font-semibold text-ink-soft">{t('disaster.year')}</span>
            <span className="font-bold text-ink">{selectedIncident.year}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-line/60">
            <span className="font-semibold text-ink-soft">{t('disaster.impact')}</span>
            <span className="text-right font-medium text-ink max-w-[60%]">
              {lang === 'hi' ? selectedIncident.impactHi : selectedIncident.impact}
            </span>
          </div>

          <div className="py-1">
            <span className="block font-semibold text-ink-soft">{t('disaster.advice')}</span>
            <p className="mt-1 text-xs text-ink leading-relaxed font-medium">
              {lang === 'hi' ? selectedIncident.adviceHi : selectedIncident.advice}
            </p>
          </div>

          <div className="rounded-lg bg-surface p-3 text-xs">
            <span className="block font-semibold text-ink-soft">Nearest Designated Shelter:</span>
            <span className="font-bold text-brand-dark">{selectedIncident.reliefCenter}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-ink-soft">{t('disaster.historicalNote')}</span>
          <Badge type="demo" />
        </div>
      </div>
    </div>
  );
}
