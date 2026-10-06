import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LAYERS = [
  { id: 'flood', label: 'Flood-prone', labelHi: 'बाढ़ प्रवण', active: true },
  { id: 'landslide', label: 'Landslide-prone', labelHi: 'भूस्खलन प्रवण', active: true },
  { id: 'cloudburst', label: 'Cloudburst history', labelHi: 'बादल फटने का इतिहास', active: true },
  { id: 'rainfall', label: 'Heavy rainfall', labelHi: 'भारी वर्षा', active: false },
  { id: 'cyclone', label: 'Cyclone risk', labelHi: 'चक्रवात जोखिम', active: false },
  { id: 'past', label: 'Past incidents', labelHi: 'पिछली घटनाएं', active: true },
  { id: 'official', label: 'Official alerts (none active)', labelHi: 'आधिकारिक अलर्ट (कोई सक्रिय नहीं)', active: false },
];

export default function HazardLayerStack({ onLayersChange }) {
  const { lang } = useLanguage();
  const [activeLayers, setActiveLayers] = useState(
    LAYERS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.active }), {})
  );

  const toggleLayer = (id) => {
    setActiveLayers((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      onLayersChange?.(updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-semibold text-ink-soft">
        {lang === 'hi' ? 'परतें:' : 'Layers:'}
      </span>
      {LAYERS.map((layer) => {
        const isActive = !!activeLayers[layer.id];
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => toggleLayer(layer.id)}
            className={`rounded-full px-3 py-1 transition-all font-medium ${
              isActive
                ? 'bg-brand text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {lang === 'hi' ? layer.labelHi : layer.label}
          </button>
        );
      })}
    </div>
  );
}
