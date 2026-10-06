import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useEmergency } from '../../context/EmergencyContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import VoiceSearchModal from './VoiceSearchModal';

const NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/healthcare', key: 'nav.healthcare' },
  { to: '/disaster', key: 'nav.disaster' },
  { to: '/mela', key: 'nav.mela' },
  { to: '/volunteers', key: 'nav.volunteers' },
  { to: '/ai-saarthi', key: 'nav.ai' },
  { to: '/command-centre', key: 'nav.command' },
  { to: '/resources', key: 'nav.resources' },
];

export default function Navbar() {
  const { t } = useLanguage();
  const { startEmergency } = useEmergency();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative whitespace-nowrap rounded-xl px-2.5 xl:px-3 py-1.5 text-xs xl:text-[13px] font-bold transition-all duration-200 ${
      isActive
        ? 'bg-brand/15 text-brand-dark dark:bg-brand-light/20 dark:text-brand-light font-black shadow-xs'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-bold transition-all ${
      isActive
        ? 'bg-brand/15 text-brand-dark dark:bg-brand-light/20 dark:text-brand-light'
        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-850'
    }`;

  const goEmergency = () => {
    startEmergency();
    setOpen(false);
    navigate('/emergency');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/95">
      <div className="flex h-16 sm:h-18 w-full items-center justify-between gap-1.5 px-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-2.5 shrink-0" aria-label="SevaSaarthi home">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-civic-dark text-lg sm:text-xl font-black text-white shadow-md shadow-brand/25 transition-transform duration-200 group-hover:scale-105">
            S
          </span>
          <span className="block text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-brand-dark dark:text-white dark:group-hover:text-brand-light">
            {t('brand.name')}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={linkClass}>
              {t(i.key)}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Theme Switcher Toggle (Sun / Moon) */}
          <ThemeToggle />

          {/* Voice Search Button (Desktop / Tablet) */}
          <button
            type="button"
            onClick={() => setShowVoice(true)}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-1.5 text-slate-700 shadow-xs backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-100 hover:text-brand dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-brand-light"
            title="Voice Assistant"
            aria-label="Voice Search"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>

          {/* Profile Link (Desktop / Tablet) */}
          <Link
            to="/profile"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-1.5 text-slate-700 shadow-xs backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-100 hover:text-brand dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-brand-light"
            title="Profile"
            aria-label="Profile"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Language Switcher (Desktop / Tablet) */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Emergency SOS Button */}
          <button
            type="button"
            onClick={goEmergency}
            className="btn-sos animate-sosPulse shrink-0 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black uppercase tracking-wider shadow-md shadow-rose-600/30 whitespace-nowrap"
          >
            <span className="sm:hidden">🚨 SOS</span>
            <span className="hidden sm:inline">{t('nav.emergency')}</span>
          </button>

          {/* Mobile/Tablet Menu Toggle Button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-1.5 text-slate-700 shadow-xs backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t('nav.menu')}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {open && (
        <nav id="mobile-nav" className="border-t border-slate-200/80 bg-white/98 p-4 backdrop-blur-2xl lg:hidden dark:border-slate-800/80 dark:bg-slate-900/98 animate-fadeIn">
          {/* Mobile Top Tools (Language, Voice & Profile) */}
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <LanguageSwitcher />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setShowVoice(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <span>🎙️</span>
                <span>Voice</span>
              </button>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
              >
                <span>👤</span>
                <span>Profile</span>
              </Link>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.end} className={mobileLinkClass} onClick={() => setOpen(false)}>
                <span>{t(i.key)}</span>
                <span className="text-slate-400">→</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      {/* Voice Search Modal */}
      <VoiceSearchModal isOpen={showVoice} onClose={() => setShowVoice(false)} />
    </header>
  );
}
