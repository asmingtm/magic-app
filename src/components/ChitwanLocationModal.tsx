import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RiCloseLine, 
  RiMapPin2Line, 
  RiNavigationLine, 
  RiSearchLine, 
  RiCursorLine, 
  RiAlertLine,
  RiCheckLine,
  RiBuilding2Line,
  RiHospitalLine,
  RiDirectionLine
} from 'react-icons/ri';
import { TransitStop, Language } from '../types/transit';
import { calculateDistanceKm } from '../services/gpsSimulator';
import { BHARATPUR_CENTER } from '../data/bharatpurTransitData';

interface ChitwanLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: TransitStop[];
  currentLocation: { lat: number; lng: number } | null;
  onSelectLocation: (lat: number, lng: number, nameEn: string, nameNe: string) => void;
  onActivateTapToPin: () => void;
  onRetryGps: () => void;
  isLocating: boolean;
  language: Language;
}

export const ChitwanLocationModal: React.FC<ChitwanLocationModalProps> = ({
  isOpen,
  onClose,
  stops,
  currentLocation,
  onSelectLocation,
  onActivateTapToPin,
  onRetryGps,
  isLocating,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hubs' | 'hospitals'>('all');

  // Filter stops based on search query and category
  const filteredStops = useMemo(() => {
    let result = stops;

    if (filterType === 'hubs') {
      result = result.filter((s) => s.isMajorHub);
    } else if (filterType === 'hospitals') {
      result = result.filter(
        (s) => 
          s.id.includes('hospital') || 
          s.id.includes('cmc') || 
          s.nameEn.toLowerCase().includes('hospital') ||
          s.nameNe.includes('अस्पताल') ||
          s.landmarkEn.toLowerCase().includes('hospital')
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.nameEn.toLowerCase().includes(q) ||
          s.nameNe.toLowerCase().includes(q) ||
          s.landmarkEn.toLowerCase().includes(q) ||
          s.landmarkNe.toLowerCase().includes(q)
      );
    }

    return result;
  }, [stops, filterType, searchQuery]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#1e1f20] w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <RiMapPin2Line className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {language === 'ne' ? 'चितवनमा स्थान छान्नुहोस्' : 'Select Your Chitwan Location'}
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {language === 'ne' ? 'भरतपुर तथा नारायणगढ म्याजिक रुट' : 'Bharatpur & Narayangarh Transit Zone'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <RiCloseLine className="w-5 h-5" />
            </button>
          </div>

          {/* ISP Note Banner - Explains why Nepal browsers show Kathmandu */}
          <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5">
            <RiAlertLine className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-800 dark:text-amber-200 leading-relaxed">
              <span className="font-bold">
                {language === 'ne' ? 'लोकेसन काठमाडौं देखियो?' : 'Seeing Kathmandu in your browser?'}
              </span>{' '}
              {language === 'ne'
                ? 'नेपालका धेरैजसो इन्टरनेट (Wi-Fi/डेटा) को IP काठमाडौंमा दर्ता हुने हुँदा ब्राउजरले काठमाडौं देखाउँछ। तपाईंले तल आफ्नो चितवनको चोक रोजेर वा नक्सामा थिचेर सहि स्थान मिलाउन सक्नुहुन्छ।'
                : 'In Nepal, almost all ISP and cellular IP addresses resolve to Kathmandu. You can pick your Chitwan chowk below or tap directly on the map to set your location!'}
            </div>
          </div>

          {/* Actions Bar: Tap on Map & GPS Refresh */}
          <div className="px-5 pt-3.5 pb-2 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                onActivateTapToPin();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer text-center"
            >
              <RiCursorLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{language === 'ne' ? '🎯 नक्सामा जहाँ पनि थिच्नुहोस्' : '🎯 Tap Anywhere on Map'}</span>
            </button>

            <button
              onClick={onRetryGps}
              disabled={isLocating}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              <RiNavigationLine className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>
                {isLocating 
                  ? (language === 'ne' ? 'जाँच्दैछ...' : 'Checking...') 
                  : (language === 'ne' ? 'जीपीएस पुनः खोज्नुहोस्' : 'Retry Device GPS')}
              </span>
            </button>
          </div>

          {/* Search Input & Category Filters */}
          <div className="px-5 py-2.5 space-y-2.5">
            <div className="relative">
              <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ne'
                    ? 'चोक, अस्पताल, वा बसपार्क खोज्नुहोस्...'
                    : 'Search Chowk, Hospital, Buspark...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <RiCloseLine className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {language === 'ne' ? 'सबै चोकहरू' : 'All Chowks'} ({stops.length})
              </button>
              <button
                onClick={() => setFilterType('hubs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                  filterType === 'hubs'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                <RiBuilding2Line className="w-3.5 h-3.5" />
                <span>{language === 'ne' ? 'मुख्य हबहरू' : 'Major Hubs'}</span>
              </button>
              <button
                onClick={() => setFilterType('hospitals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                  filterType === 'hospitals'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                <RiHospitalLine className="w-3.5 h-3.5" />
                <span>{language === 'ne' ? 'अस्पताल' : 'Hospitals'}</span>
              </button>
            </div>
          </div>

          {/* Stops List */}
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1.5 min-h-[180px] max-h-[380px]">
            {filteredStops.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-xs">
                {language === 'ne' ? 'कुनै स्थान भेटिएन।' : 'No matching locations found.'}
              </div>
            ) : (
              filteredStops.map((stop) => {
                const isSelected =
                  currentLocation &&
                  Math.abs(currentLocation.lat - stop.lat) < 0.001 &&
                  Math.abs(currentLocation.lng - stop.lng) < 0.001;

                const distFromCenter = calculateDistanceKm(
                  stop.lat,
                  stop.lng,
                  BHARATPUR_CENTER[0],
                  BHARATPUR_CENTER[1]
                ).toFixed(1);

                return (
                  <button
                    key={stop.id}
                    onClick={() => {
                      onSelectLocation(stop.lat, stop.lng, stop.nameEn, stop.nameNe);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/70 text-blue-900 dark:text-blue-100 shadow-xs'
                        : 'bg-white dark:bg-neutral-900/60 border-gray-200 dark:border-neutral-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-neutral-800/70'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          stop.isMajorHub
                            ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold'
                            : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <RiMapPin2Line className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {language === 'ne' ? stop.nameNe : stop.nameEn}
                          </span>
                          {stop.isMajorHub && (
                            <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] px-1.5 py-0.2 rounded-md font-semibold">
                              {language === 'ne' ? 'मुख्य हब' : 'Hub'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                          {language === 'ne' ? stop.landmarkNe : stop.landmarkEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        ~{distFromCenter} km
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <RiCheckLine className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-neutral-700 group-hover:border-blue-500 flex items-center justify-center text-transparent group-hover:text-blue-500">
                          <RiDirectionLine className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>
              {language === 'ne'
                ? '💡 नक्सामा रहेको निलो पिनलाई तानेर (drag गरेर) पनि स्थान सार्न सकिन्छ।'
                : '💡 You can also drag the blue pin on the map anytime.'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold cursor-pointer transition-colors"
            >
              {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
