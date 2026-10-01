import React from 'react';
import { AppViewMode, Language } from '../types/transit';
import { Radio, MapPin, Route, Bus, BookOpen, Calculator, Globe } from 'lucide-react';

interface NavbarProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenDriverModal: () => void;
  onOpenFareModal: () => void;
  onOpenGuideModal: () => void;
  isDriverBroadcasting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  language,
  onToggleLanguage,
  onOpenDriverModal,
  onOpenFareModal,
  onOpenGuideModal,
  isDriverBroadcasting,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-sm">
            M
          </div>
          <button
            onClick={() => onViewChange('map')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-display font-black text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              MagicTrack <span className="text-amber-600 font-extrabold text-sm sm:text-base">Bharatpur</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => onViewChange('map')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'map'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'नक्सा र जीपीएस' : 'Live Map'}</span>
          </button>

          <button
            onClick={() => onViewChange('planner')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'planner'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'यात्रा योजना' : 'Trip Planner'}</span>
          </button>

          <button
            onClick={() => onViewChange('routes')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'routes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'रुट नम्बरहरू' : 'Magic Routes'}</span>
          </button>

          <button
            onClick={() => onViewChange('fleet')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'fleet'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:text-slate-900'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>{language === 'ne' ? 'सबै म्याजिकहरू' : 'Fleet Status'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Driver Mode Button */}
          <button
            onClick={onOpenDriverModal}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              isDriverBroadcasting
                ? 'bg-emerald-600 text-white shadow-md animate-pulse ring-2 ring-emerald-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isDriverBroadcasting
                ? language === 'ne'
                  ? 'चालक प्रसारण जारी...'
                  : 'Broadcasting GPS'
                : language === 'ne'
                ? 'चालक मोड'
                : 'Driver Mode'}
            </span>
            <span className="sm:hidden">
              {isDriverBroadcasting ? 'LIVE' : 'Driver'}
            </span>
          </button>

          {/* Fare Guide */}
          <button
            onClick={onOpenFareModal}
            title={language === 'ne' ? 'भाडा दर' : 'Fare Calculator'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Hackathon Guide */}
          <button
            onClick={onOpenGuideModal}
            title={language === 'ne' ? 'परियोजना गाइड' : 'Hackathon Guide'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'ne' ? 'EN' : 'नेपाली'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-slate-50 text-[11px] font-semibold text-slate-600">
        <button
          onClick={() => onViewChange('map')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            currentView === 'map' ? 'text-amber-700 font-bold' : ''
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>{language === 'ne' ? 'नक्सा' : 'Map'}</span>
        </button>
        <button
          onClick={() => onViewChange('planner')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            currentView === 'planner' ? 'text-amber-700 font-bold' : ''
          }`}
        >
          <Route className="w-3 h-3" />
          <span>{language === 'ne' ? 'योजना' : 'Plan'}</span>
        </button>
        <button
          onClick={() => onViewChange('routes')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            currentView === 'routes' ? 'text-amber-700 font-bold' : ''
          }`}
        >
          <Bus className="w-3 h-3" />
          <span>{language === 'ne' ? 'रुट' : 'Routes'}</span>
        </button>
        <button
          onClick={() => onViewChange('fleet')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            currentView === 'fleet' ? 'text-amber-700 font-bold' : ''
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span>{language === 'ne' ? 'सवारी' : 'Fleet'}</span>
        </button>
      </div>
    </header>
  );
};
