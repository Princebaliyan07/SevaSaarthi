import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-1.5 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-amber-300 dark:hover:border-slate-700 dark:hover:bg-slate-700"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        // Sun Icon for Dark Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 rotate-0 transition-transform duration-500 hover:rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon Icon for Light Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 -rotate-12 transition-transform duration-500 hover:rotate-0 text-slate-700 hover:text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
