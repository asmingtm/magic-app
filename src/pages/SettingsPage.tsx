import React from 'react';
import { Language } from '../types/transit';
import { 
  RiSunLine, 
  RiMoonLine, 
  RiComputerLine, 
  RiRoadMapLine, 
  RiGlobalLine, 
  RiDashboard3Line, 
  RiRefreshLine, 
  RiCheckboxCircleFill 
} from 'react-icons/ri';

export type ThemeMode = 'light' | 'dark' | 'system';
export type BasemapProvider = 'carto-voyager' | 'esri-free' | 'carto-dark' | 'schematic';

interface SettingsPageProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  basemap: BasemapProvider;
  onBasemapChange: (basemap: BasemapProvider) => void;
  simulationSpeed: number;
  onSimulationSpeedChange: (speed: number) => void;
  onResetFleet: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  basemap,
  onBasemapChange,
  simulationSpeed,
  onSimulationSpeedChange,
  onResetFleet,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {language === 'ne' ? 'सेटिङ' : 'Settings'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {language === 'ne' ? 'थिम, नक्सा, भाषा र सिमुलेसन' : 'Theme, map tiles, language & simulation speed'}
        </p>
      </div>

      {/* Theme Settings (Dark Mode) */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <RiMoonLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{language === 'ne' ? 'थिम' : 'Theme'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onThemeChange('light')}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
            title="Light theme for daylight"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <RiSunLine className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                {language === 'ne' ? 'उज्यालो' : 'Light'}
              </span>
            </div>
            {theme === 'light' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            onClick={() => onThemeChange('dark')}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
            title="Dark theme for night transit"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 text-blue-400 flex items-center justify-center">
                <RiMoonLine className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                {language === 'ne' ? 'गाढा' : 'Dark'}
              </span>
            </div>
            {theme === 'dark' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            onClick={() => onThemeChange('system')}
            className={`p-3.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'system'
                ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
            title="Sync with device settings"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                <RiComputerLine className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                {language === 'ne' ? 'प्रणाली' : 'System'}
              </span>
            </div>
            {theme === 'system' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Basemap Settings */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RiRoadMapLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ne' ? 'नक्सा प्रदायक र शैली' : 'Map Basemap Provider'}</span>
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
            {language === 'ne'
              ? 'कुनै पनि एपीआई कुञ्जी नचाहिने निःशुल्क ओपनस्ट्रीटम्याप वा तपाईंको CARTO कुञ्जी सहितको ट्रान्जिट नक्सा छान्नुहोस्।'
              : 'Choose between 100% Free OpenStreetMap (No API Key needed) or CARTO Basemaps.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* CARTO Voyager (with Key) */}
          <button
            onClick={() => onBasemapChange('carto-voyager')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'carto-voyager'
                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  CARTO KEY (ACTIVE)
                </span>
                <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  CARTO Voyager (Recommended)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Clean street basemap with official highway landmarks.
              </p>
            </div>
            {basemap === 'carto-voyager' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
          </button>

          {/* 100% Free ESRI World Street Map */}
          <button
            onClick={() => onBasemapChange('esri-free')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'esri-free'
                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                  100% FREE · NO KEY
                </span>
                <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  ESRI World Street Map
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Free worldwide street map without API keys.
              </p>
            </div>
            {basemap === 'esri-free' && <RiCheckboxCircleFill className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
          </button>

          {/* CARTO Dark Matter */}
          <button
            onClick={() => onBasemapChange('carto-dark')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'carto-dark'
                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-white">
                  DARK THEME
                </span>
                <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  CARTO Dark Matter
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Midnight dark map tiles optimized for dark mode with glowing transit routes.
              </p>
            </div>
            {basemap === 'carto-dark' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
          </button>

          {/* Schematic */}
          <button
            onClick={() => onBasemapChange('schematic')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'schematic'
                ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/50'
                : 'border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  OFFLINE / VECTOR
                </span>
                <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                  Chitwan Transit Schematic
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                Zero external network tiles. Direct vector canvas with rivers, highways & chowks.
              </p>
            </div>
            {basemap === 'schematic' && <RiCheckboxCircleFill className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
          </button>
        </div>
      </div>

      {/* Language & Simulation Speed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language */}
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RiGlobalLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ne' ? 'भाषा (Language)' : 'App Language'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChange('en')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                language === 'en'
                  ? 'bg-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ne')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                language === 'ne'
                  ? 'bg-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
              }`}
            >
              नेपाली (Nepali)
            </button>
          </div>
        </div>

        {/* Simulation Speed */}
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <RiDashboard3Line className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{language === 'ne' ? 'सिमुलेसन गति' : 'Simulation Speed'}</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSimulationSpeedChange(0.5)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 0.5
                  ? 'bg-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
              }`}
            >
              0.5x Slow
            </button>
            <button
              onClick={() => onSimulationSpeedChange(1.0)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 1.0
                  ? 'bg-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
              }`}
            >
              1.0x Normal
            </button>
            <button
              onClick={() => onSimulationSpeedChange(2.0)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 2.0
                  ? 'bg-blue-600 text-white border-transparent shadow-xs'
                  : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'
              }`}
            >
              2.0x Fast
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Management */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {language === 'ne' ? 'भरतपुर म्याजिक फ्लीट रिसेट' : 'Reset Simulated Fleet'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'ne'
              ? 'थपिएका सबै डमी म्याजिकहरू हटाएर पूर्वनिर्धारित अवस्थामा फर्काउनुहोस्।'
              : 'Restore the initial highway Magic vans on Routes 1 through 5.'}
          </p>
        </div>

        <button
          onClick={onResetFleet}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RiRefreshLine className="w-3.5 h-3.5" />
          <span>{language === 'ne' ? 'फ्लीट रिसेट गर्नुहोस्' : 'Reset Fleet'}</span>
        </button>
      </div>
    </div>
  );
};
