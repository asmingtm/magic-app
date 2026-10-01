import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Language } from '../types/transit';
import { 
  RiBus2Fill, 
  RiMapPin2Line, 
  RiRouteLine, 
  RiBus2Line, 
  RiDashboard3Line, 
  RiCalculatorLine, 
  RiSettings3Line,
  RiSunLine,
  RiMoonLine
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  language: Language;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ language, isDark = false, onToggleTheme }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/' || currentPath === '/map')) return true;
    if (path === '/plan' && (currentPath === '/plan' || currentPath === '/planner')) return true;
    if (path === '/fare' && (currentPath === '/fare' || currentPath === '/fares')) return true;
    if (path === '/routes' && currentPath === '/routes') return true;
    if (path === '/fleet' && currentPath === '/fleet') return true;
    if (path === '/settings' && currentPath === '/settings') return true;
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#131314] border-b border-gray-200 dark:border-neutral-800 transition-colors shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Gemini-Style Clean Re-branded Logo + Title */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-sm">
            <RiBus2Fill className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors leading-tight">
              MagicTrack <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">Bharatpur</span>
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium hidden sm:inline leading-tight">
              {language === 'ne' ? 'चितवन राजमार्ग म्याजिक ट्रान्जिट' : 'Chitwan Highway Transit'}
            </span>
          </div>
        </Link>

        {/* Clean Neutral Gray Nav with Blue Primary Accents */}
        <nav className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-900 p-1 rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-neutral-800">
          <Link
            to="/"
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
          >
            <RiMapPin2Line className="w-4 h-4" />
            <span className="capitalize">{language === 'ne' ? 'नक्सा' : 'Map'}</span>
          </Link>

          <Link
            to="/plan"
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/plan')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
          >
            <RiRouteLine className="w-4 h-4" />
            <span className="capitalize">{language === 'ne' ? 'योजना' : 'Plan'}</span>
          </Link>

          <Link
            to="/routes"
            className={`hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors items-center gap-1.5 ${
              isActive('/routes')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
          >
            <RiBus2Line className="w-4 h-4" />
            <span className="capitalize">{language === 'ne' ? 'रुटहरू' : 'Routes'}</span>
          </Link>

          <Link
            to="/fleet"
            className={`hidden lg:flex px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors items-center gap-1.5 ${
              isActive('/fleet')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
          >
            <RiDashboard3Line className="w-4 h-4" />
            <span className="capitalize">{language === 'ne' ? 'फ्लीट' : 'Fleet'}</span>
          </Link>

          <Link
            to="/fare"
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/fare')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
          >
            <RiCalculatorLine className="w-4 h-4" />
            <span className="capitalize">{language === 'ne' ? 'भाडा' : 'Fare'}</span>
          </Link>

          <Link
            to="/settings"
            className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/settings')
                ? 'bg-white dark:bg-[#1e1f20] text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800'
            }`}
            title={language === 'ne' ? 'सेटिङ' : 'Settings'}
          >
            <RiSettings3Line className="w-4 h-4" />
            <span className="hidden sm:inline capitalize">{language === 'ne' ? 'सेटिङ' : 'Settings'}</span>
          </Link>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/70 dark:hover:bg-neutral-800 transition-colors cursor-pointer ml-0.5"
              title={isDark ? (language === 'ne' ? 'उज्यालो मोड' : 'Switch to Light Mode') : (language === 'ne' ? 'गाढा मोड' : 'Switch to Dark Mode')}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? (
                    <RiSunLine className="w-4 h-4 text-amber-400" />
                  ) : (
                    <RiMoonLine className="w-4 h-4 text-gray-700" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
