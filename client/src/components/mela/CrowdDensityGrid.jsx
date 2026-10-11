import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// Status config — card bg, border, text, pulse/flash animation class
const STATUS_CONFIG = {
  critical: {
    card: 'bg-rose-600 border-rose-700 text-white',
    badge: 'bg-white/20 text-white border border-white/30',
    bar: 'bg-white/80',
    barTrack: 'bg-rose-800',
    icon: '🚨',
    // Rapid red flash — CSS keyframe via inline style
    animation: 'critical-flash',
    label: 'CRITICAL',
  },
  high: {
    card: 'bg-orange-500 border-orange-600 text-white',
    badge: 'bg-white/20 text-white border border-white/30',
    bar: 'bg-white/80',
    barTrack: 'bg-orange-700',
    icon: '⚠️',
    animation: 'high-pulse',
    label: 'HIGH',
  },
  moderate: {
    card: 'bg-amber-100 border-amber-400 text-amber-900',
    badge: 'bg-amber-500 text-white border border-amber-600',
    bar: 'bg-amber-500',
    barTrack: 'bg-amber-200',
    icon: '🔶',
    animation: 'moderate-glow',
    label: 'MODERATE',
  },
  normal: {
    card: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    badge: 'bg-emerald-600 text-white border border-emerald-700',
    bar: 'bg-emerald-500',
    barTrack: 'bg-emerald-100',
    icon: '✅',
    animation: '',
    label: 'NORMAL',
  },
};

function FlashCard({ zone, isSelected, onClick }) {
  const key = (zone.status || 'normal').toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.normal;

  // Use inline keyframe animation via a style tag trick + animationName class
  const isCritical = key === 'critical';
  const isHigh = key === 'high';
  const isModerate = key === 'moderate';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all overflow-hidden
        ${cfg.card}
        ${isSelected ? 'ring-4 ring-offset-2 ring-white/60 shadow-2xl scale-[1.03]' : 'hover:shadow-xl hover:scale-[1.01]'}
        ${isCritical ? 'animate-[criticalFlash_0.8s_ease-in-out_infinite]' : ''}
        ${isHigh ? 'animate-[highPulse_1.4s_ease-in-out_infinite]' : ''}
        ${isModerate ? 'animate-[moderateGlow_2s_ease-in-out_infinite]' : ''}
      `}
      style={{
        animationName: isCritical
          ? 'criticalFlash'
          : isHigh
          ? 'highPulse'
          : isModerate
          ? 'moderateGlow'
          : 'none',
        animationDuration: isCritical ? '0.8s' : isHigh ? '1.4s' : '2s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}
    >
      {/* Status icon top-right */}
      <div className="absolute top-2.5 right-3 text-lg opacity-80">{cfg.icon}</div>

      {/* Zone name */}
      <span className="text-sm font-black pr-8 leading-snug">{zone.name}</span>

      {/* Density bar */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
          <span>Crowd Density</span>
          <span>{zone.density ?? '--'}%</span>
        </div>
        <div className={`h-1.5 w-full rounded-full ${cfg.barTrack}`}>
          <div
            className={`h-full rounded-full transition-all ${cfg.bar}`}
            style={{ width: `${Math.min(zone.density ?? 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Status badge */}
      <span className={`mt-2 self-start rounded-full px-2.5 py-0.5 text-[10px] font-black ${cfg.badge}`}>
        {cfg.label}
      </span>
    </button>
  );
}

export default function CrowdDensityGrid({ zones = [] }) {
  const { lang, t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState(null);

  // Auto-select highest severity zone on load
  useEffect(() => {
    if (zones.length === 0) return;
    const ORDER = ['critical', 'high', 'moderate', 'normal'];
    const sorted = [...zones].sort(
      (a, b) =>
        ORDER.indexOf((a.status || 'normal').toLowerCase()) -
        ORDER.indexOf((b.status || 'normal').toLowerCase())
    );
    setSelectedZone(sorted[0]);
  }, [zones]);

  if (zones.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-slate-400">
        No crowd zone data available. Admin will update live zones from Command Centre.
      </div>
    );
  }

  // Count by status
  const counts = zones.reduce((acc, z) => {
    const k = (z.status || 'normal').toLowerCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Inject keyframe animations via a style tag */}
      <style>{`
        @keyframes criticalFlash {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(220,38,38,0.7); }
          50% { opacity: 0.82; box-shadow: 0 0 0 12px rgba(220,38,38,0); }
        }
        @keyframes highPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(249,115,22,0.6); }
          50% { opacity: 0.88; box-shadow: 0 0 0 10px rgba(249,115,22,0); }
        }
        @keyframes moderateGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 12px 4px rgba(245,158,11,0.25); }
        }
      `}</style>

      {/* Summary legend bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {counts.critical > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-300 animate-pulse">
            🚨 Critical: {counts.critical}
          </span>
        )}
        {counts.high > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 font-bold border border-orange-300">
            ⚠️ High: {counts.high}
          </span>
        )}
        {counts.moderate > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-300">
            🔶 Moderate: {counts.moderate}
          </span>
        )}
        {counts.normal > 0 && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-300">
            ✅ Normal: {counts.normal}
          </span>
        )}
        <span className="ml-auto text-slate-400 text-[10px] italic">Admin-reported • Updates every 15s</span>
      </div>

      {/* Zone Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {zones.map((z) => (
          <FlashCard
            key={z.id || z._id}
            zone={z}
            isSelected={selectedZone?.id === z.id}
            onClick={() => setSelectedZone(z)}
          />
        ))}
      </div>

      {/* Selected Zone Advisory */}
      {selectedZone && (
        <div
          className={`rounded-2xl border-2 p-4 text-sm transition-all
            ${(selectedZone.status || '').toLowerCase() === 'critical'
              ? 'bg-rose-50 border-rose-400 text-rose-900'
              : (selectedZone.status || '').toLowerCase() === 'high'
              ? 'bg-orange-50 border-orange-300 text-orange-900'
              : (selectedZone.status || '').toLowerCase() === 'moderate'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
        >
          <div className="flex items-center gap-2 font-black text-sm mb-1">
            <span>{STATUS_CONFIG[(selectedZone.status || 'normal').toLowerCase()]?.icon}</span>
            <span>{selectedZone.name}</span>
            <span className="text-xs font-normal opacity-60">— Official Advisory</span>
          </div>
          <p className="font-semibold leading-relaxed">
            {selectedZone.advisory || 'No specific advisory at this time. Standard crowd management protocols in effect.'}
          </p>
          <p className="mt-1.5 text-[11px] opacity-60">
            Tap any zone card above to view its advisory · Admin-reported crowd conditions
          </p>
        </div>
      )}
    </div>
  );
}
