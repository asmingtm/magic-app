import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types/transit';
import { Radio, MapPin, Route, Bus, BookOpen, Calculator, Globe, Settings, Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../pages/SettingsPage';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/map')) return true;
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
            M
          </div>
          <Link
            to="/"
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              MagicTrack <span className="text-amber-600 font-extrabold text-sm sm:text-base">Bharatpur</span>
            </span>
          </Link>
        </div>

        {/* Zone 2: One-word nav links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'नक्सा' : 'Map'}</span>
          </Link>

          <Link
            to="/planner"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/planner')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'योजना' : 'Planner'}</span>
          </Link>

          <Link
            to="/routes"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/routes')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'रुट' : 'Routes'}</span>
          </Link>

          <Link
            to="/fleet"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/fleet')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>{language === 'ne' ? 'फ्लीट' : 'Fleet'}</span>
          </Link>

          <Link
            to="/fares"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/fares')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'भाडा' : 'Fares'}</span>
          </Link>

          <Link
            to="/settings"
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/settings')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'सेटिङ' : 'Settings'}</span>
          </Link>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Route Link */}
          <Link
            to="/settings"
            title={language === 'ne' ? 'सेटिङहरू' : 'Settings'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isActive('/settings')
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
          </Link>

          {/* Hackathon Guide Route Link */}
          <Link
            to="/guide"
            title={language === 'ne' ? 'परियोजना गाइड' : 'Hackathon Pitch'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isActive('/guide')
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </Link>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'EN' : 'नेपाली'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 px-2 py-1.5 bg-slate-50 dark:bg-slate-950 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
        <Link
          to="/"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>{language === 'ne' ? 'नक्सा' : 'Map'}</span>
        </Link>
        <Link
          to="/planner"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/planner') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <Route className="w-3 h-3" />
          <span>{language === 'ne' ? 'योजना' : 'Planner'}</span>
        </Link>
        <Link
          to="/routes"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/routes') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <Bus className="w-3 h-3" />
          <span>{language === 'ne' ? 'रुट' : 'Routes'}</span>
        </Link>
        <Link
          to="/fleet"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/fleet') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>{language === 'ne' ? 'फ्लीट' : 'Fleet'}</span>
        </Link>
        <Link
          to="/fares"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/fares') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <Calculator className="w-3 h-3" />
          <span>{language === 'ne' ? 'भाडा' : 'Fares'}</span>
        </Link>
        <Link
          to="/settings"
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            isActive('/settings') ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
          }`}
        >
          <Settings className="w-3 h-3" />
          <span>{language === 'ne' ? 'सेटिङ' : 'Settings'}</span>
        </Link>
      </div>
    </header>
  );
};
