import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TransitRoute, Language } from '../types/transit';
import { MapPin, Route as RouteIcon, Calculator, Settings as SettingsIcon } from 'lucide-react';

interface NavbarProps {
  routes?: TransitRoute[];
  selectedRouteId?: string | null;
  onSelectRoute?: (routeId: string | null) => void;
  language: Language;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/map')) return true;
    if (path === '/plan' && (currentPath === '/plan' || currentPath === '/planner')) return true;
    if (path === '/fare' && (currentPath === '/fare' || currentPath === '/fares')) return true;
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      {/* Top Bar: LOGO+TITLE, map, plan, fare and settings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* LOGO + TITLE */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base sm:text-lg shadow-sm">
            M
          </div>
          <span className="font-display font-black text-base sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
            MagicTrack <span className="text-amber-600 font-extrabold text-xs sm:text-sm">Bharatpur</span>
          </span>
        </Link>

        {/* Clean nav: map, plan, fare, settings */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="capitalize">{language === 'ne' ? 'नक्सा' : 'map'}</span>
          </Link>

          <Link
            to="/plan"
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/plan')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{language === 'ne' ? 'योजना' : 'plan'}</span>
          </Link>

          <Link
            to="/fare"
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/fare')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span className="capitalize">{language === 'ne' ? 'भाडा' : 'fare'}</span>
          </Link>

          <Link
            to="/settings"
            className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/settings')
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span className="capitalize">{language === 'ne' ? 'सेटिङ' : 'settings'}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
