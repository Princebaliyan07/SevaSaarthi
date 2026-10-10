import {
  Map,
  Activity,
  ShieldCheck,
  Award,
  FileText,
  Compass,
  Package,
  BookOpen,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DisasterSectionNav() {
  const { lang } = useLanguage();

  const navItems = [
    {
      id: 'gis-map',
      label: 'GIS Hazard Map',
      icon: Map,
      color: 'text-teal-700 bg-teal-50 hover:bg-teal-100 border-teal-200',
    },
    {
      id: 'risk-dashboard',
      label: 'Live Alerts & Risk %',
      icon: Activity,
      color: 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 animate-pulse-subtle',
      badge: 'Live',
    },
    {
      id: 'safety-centre',
      label: 'Safety Centre',
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    },
    {
      id: 'mock-drills',
      label: 'Mock Drills',
      icon: Award,
      color: 'text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200',
    },
    {
      id: 'action-plan',
      label: 'Action Plan',
      icon: FileText,
      color: 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      id: 'shelter-finder',
      label: 'Shelter Finder',
      icon: Compass,
      color: 'text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border-cyan-200',
    },
    {
      id: 'emergency-kit',
      label: 'Emergency Kit',
      icon: Package,
      color: 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
    {
      id: 'historical-guides',
      label: 'Field Guides',
      icon: BookOpen,
      color: 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200',
    },
  ];

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-gradient-to-r from-teal-400/95 to-teal-400/95 backdrop-blur-md border-y border-teal-300/30 shadow-lg">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* Highlighted Quick Jump Banner Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand to-emerald-500 text-white font-black text-xs uppercase tracking-wider shrink-0 shadow-md shadow-brand/30">
          <Zap className="w-4 h-4 fill-white animate-bounce" />
          <span>QUICK ACCESS</span>
        </div>

        {/* Highlighted Navigation Pills */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleScroll(item.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all border shadow-xs hover:scale-105 active:scale-95 whitespace-nowrap bg-white text-slate-800 hover:text-brand-dark hover:border-brand`}
              >
                <Icon className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black bg-rose-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
