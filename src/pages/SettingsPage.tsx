import React from 'react';
import { Language } from '../types/transit';
import { Sun, Moon, Laptop, Map, Globe, Gauge, Shield, RefreshCw, CheckCircle2, Info } from 'lucide-react';

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
          {language === 'ne' ? 'सेटिङहरू र प्राथमिकताहरू' : 'Settings & Preferences'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'ne'
            ? 'डार्क मोड, नक्सा प्रदायक, भाषा र भरतपुर म्याजिक सिमुलेसन कन्फिगर गर्नुहोस्।'
            : 'Configure Dark Mode, map basemap tile provider, language, and transit simulation.'}
        </p>
      </div>

      {/* Theme Settings (Dark Mode) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Moon className="w-4 h-4 text-amber-500" />
            <span>{language === 'ne' ? 'रंग थिम (डार्क मोड)' : 'Appearance & Theme'}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {language === 'ne'
              ? 'रातको समयमा म्याजिक हेर्दा आँखाको आरामका लागि डार्क मोड छान्न सक्नुहुन्छ।'
              : 'Switch between light and dark themes for comfortable night-time transit navigation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onThemeChange('light')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'light'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {language === 'ne' ? 'उज्यालो (Light)' : 'Light Mode'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Daytime clarity</span>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={() => onThemeChange('dark')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {language === 'ne' ? 'गाढा (Dark)' : 'Dark Mode'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Night navigation</span>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
          </button>

          <button
            onClick={() => onThemeChange('system')}
            className={`p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
              theme === 'system'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                  {language === 'ne' ? 'प्रणाली अनुसार (System)' : 'System Default'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Follow device</span>
              </div>
            </div>
            {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </div>

      {/* Map Tile Basemap Provider */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500" />
            <span>{language === 'ne' ? 'नक्सा प्रदायक र शैली' : 'Map Basemap Provider'}</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
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
                ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 ring-2 ring-amber-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                  CARTO KEY (ACTIVE)
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  CARTO Voyager (Recommended)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                High-definition, clean cartography with official CARTO Basemaps key loaded. Clear road outlines & labels.
              </p>
            </div>
            {basemap === 'carto-voyager' && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 ml-2" />}
          </button>

          {/* 100% Free ESRI World Street Map (No Key Required) */}
          <button
            onClick={() => onBasemapChange('esri-free')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'esri-free'
                ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                  100% FREE · NO KEY REQUIRED
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  ESRI World Street Map
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Completely free worldwide street map. Zero rate limits, zero API key needed, verified 100% uptime.
              </p>
            </div>
            {basemap === 'esri-free' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
          </button>

          {/* CARTO Dark Matter */}
          <button
            onClick={() => onBasemapChange('carto-dark')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'carto-dark'
                ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-white">
                  DARK THEME
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  CARTO Dark Matter
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Midnight dark map tiles optimized for dark mode with glowing transit routes.
              </p>
            </div>
            {basemap === 'carto-dark' && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
          </button>

          <button
            onClick={() => onBasemapChange('schematic')}
            className={`p-4 rounded-xl border text-left flex items-start justify-between cursor-pointer transition-all ${
              basemap === 'schematic'
                ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-400'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                  OFFLINE / VECTOR
                </span>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Chitwan Transit Schematic
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero external network tiles. Direct vector canvas with rivers, highways & chowks.
              </p>
            </div>
            {basemap === 'schematic' && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
          </button>
        </div>
      </div>

      {/* Language & Simulation Speed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-500" />
            <span>{language === 'ne' ? 'भाषा (Language)' : 'App Language'}</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChange('en')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                language === 'en'
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ne')}
              className={`py-2.5 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                language === 'ne'
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              नेपाली (Nepali)
            </button>
          </div>
        </div>

        {/* Simulation Speed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-500" />
            <span>{language === 'ne' ? 'सिमुलेसन गति' : 'Simulation Speed'}</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSimulationSpeedChange(0.5)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 0.5
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              0.5x Slow
            </button>
            <button
              onClick={() => onSimulationSpeedChange(1.0)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 1.0
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              1.0x Normal
            </button>
            <button
              onClick={() => onSimulationSpeedChange(2.0)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                simulationSpeed === 2.0
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 border-transparent shadow'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              2.0x Fast
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'ne' ? 'भरतपुर म्याजिक फ्लीट रिसेट' : 'Reset Simulated Fleet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ne'
              ? 'थपिएका सबै डमी म्याजिकहरू हटाएर पूर्वनिर्धारित अवस्थामा फर्काउनुहोस्।'
              : 'Restore the initial 14 Magic vans on Routes 1 through 5.'}
          </p>
        </div>

        <button
          onClick={onResetFleet}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'ne' ? 'फ्लीट रिसेट गर्नुहोस्' : 'Reset Fleet'}</span>
        </button>
      </div>
    </div>
  );
};
