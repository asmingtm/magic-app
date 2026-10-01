import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Language, MagicVehicle } from './types/transit';
import { TRANSIT_ROUTES, TRANSIT_STOPS, INITIAL_MAGIC_VEHICLES, BHARATPUR_CENTER } from './data/bharatpurTransitData';
import { advanceSimulatedVehicles, findNearestStop, calculateDistanceKm } from './services/gpsSimulator';
import { Navbar } from './components/Navbar';
import { MagicMap } from './components/MagicMap';
import { RoutePlanner } from './components/RoutePlanner';
import { RoutesList } from './components/RoutesList';
import { LiveFleetTracker } from './components/LiveFleetTracker';
import { FaresPage } from './pages/FaresPage';
import { SettingsPage, ThemeMode, BasemapProvider } from './pages/SettingsPage';
import { ChitwanLocationModal } from './components/ChitwanLocationModal';
import { 
  RiNavigationLine, 
  RiCloseLine, 
  RiUser3Line, 
  RiMapPin2Fill, 
  RiMapPin2Line,
  RiAlertLine,
  RiCursorLine,
  RiArrowRightLine, 
  RiSpeedLine, 
  RiGroupLine 
} from 'react-icons/ri';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMapPage = location.pathname === '/' || location.pathname === '/map';

  // Theme state with local persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('magictrack_theme') as ThemeMode) || 'light';
  });

  // System dark preference listener
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemIsDark);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = isDark ? 'light' : 'dark';
      return next;
    });
  };

  // Language state with local persistence
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('magictrack_lang') as Language) || 'en';
  });

  // Basemap provider state with safe fallback
  const [basemap, setBasemap] = useState<BasemapProvider>(() => {
    const saved = localStorage.getItem('magictrack_basemap') as BasemapProvider;
    if (saved === 'carto-voyager' || saved === 'esri-free' || saved === 'carto-dark' || saved === 'schematic') {
      return saved;
    }
    return 'carto-voyager';
  });

  // Simulation settings
  const [isSimulationRunning] = useState<boolean>(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(1.0);

  // Fleet state
  const [vehicles, setVehicles] = useState<MagicVehicle[]>(INITIAL_MAGIC_VEHICLES);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(() => {
    const saved = localStorage.getItem('magictrack_user_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) return parsed;
      } catch (e) {}
    }
    // Default to central Bharatpur passenger hub (Chaubiskothi) so user is immediately anchored in Chitwan
    return { lat: 27.6798, lng: 84.4350 };
  });
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [isTapToPinActive, setIsTapToPinActive] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateTrigger, setLocateTrigger] = useState<number>(0);
  const [locationNotice, setLocationNotice] = useState<{
    type: 'success' | 'info' | 'warn';
    message: string;
    details?: string;
  } | null>(null);

  // Auto-dismiss location notice after 6 seconds
  useEffect(() => {
    if (!locationNotice) return;
    const timer = setTimeout(() => setLocationNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [locationNotice]);

  // Apply Dark Mode class to documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('magictrack_theme', theme);
  }, [theme, isDark]);

  useEffect(() => {
    localStorage.setItem('magictrack_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('magictrack_basemap', basemap);
  }, [basemap]);

  // Real-time animation timer
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setVehicles((prev) => advanceSimulatedVehicles(prev, simulationSpeedMultiplier));
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationSpeedMultiplier]);

  // Helper to commit location and trigger map centering
  const applyLocation = (
    lat: number,
    lng: number,
    isRealGps: boolean,
    customName?: { en: string; ne: string }
  ) => {
    const loc = { lat, lng };
    setUserLocation(loc);
    localStorage.setItem('magictrack_user_location', JSON.stringify(loc));
    setLocateTrigger(Date.now());
    setSelectedVehicleId(null);
    setSelectedStopId(null);
    setIsLocating(false);

    const nearest = findNearestStop(lat, lng, TRANSIT_STOPS);
    const stopName = customName
      ? (language === 'ne' ? customName.ne : customName.en)
      : (language === 'ne' ? nearest.stop.nameNe : nearest.stop.nameEn);
    const distMeters = Math.round(nearest.distanceKm * 1000);

    if (isRealGps) {
      setLocationNotice({
        type: 'success',
        message: language === 'ne' ? 'चितवन जीपीएस स्थान पत्ता लाग्यो!' : 'Live GPS location detected in Chitwan!',
        details: language === 'ne'
          ? `नजिकैको म्याजिक बिसौनी: ${stopName} (~${distMeters} मिटर)`
          : `Nearest Magic Stop: ${stopName} (~${distMeters}m away)`,
      });
    } else {
      setLocationNotice({
        type: 'info',
        message: language === 'ne'
          ? `स्थान छानियो: ${stopName}`
          : `Location set: ${stopName}`,
        details: language === 'ne'
          ? `नजिकैको म्याजिक बिसौनी: ${nearest.stop.nameNe} (~${distMeters} मिटर)`
          : `Nearest Magic Stop: ${nearest.stop.nameEn} (~${distMeters}m away)`,
      });
    }
  };

  // Robust User Geolocation Handler with Kathmandu / ISP out-of-Chitwan detection
  const handleLocateUser = () => {
    setIsLocating(true);

    if (!('geolocation' in navigator)) {
      applyLocation(27.6798, 84.4350, false);
      setShowLocationModal(true);
      return;
    }

    const processCoords = (lat: number, lng: number) => {
      // Calculate distance from central Bharatpur
      const distFromBharatpur = calculateDistanceKm(lat, lng, BHARATPUR_CENTER[0], BHARATPUR_CENTER[1]);

      // Kathmandu is ~95km away (longitude > 85.0). All Nepal ISPs route IP geolocation to Kathmandu!
      // If coordinates are outside Chitwan transit zone (> 35 km away):
      if (distFromBharatpur > 35) {
        setIsLocating(false);
        // Do NOT send the map to Kathmandu! Keep in Chitwan (saved location or Chaubiskothi)
        const chitwanLat = userLocation?.lat || 27.6798;
        const chitwanLng = userLocation?.lng || 84.4350;
        applyLocation(chitwanLat, chitwanLng, false);
        setLocateTrigger(Date.now());

        // Warn user and open the Chitwan location selector modal
        setLocationNotice({
          type: 'warn',
          message: language === 'ne'
            ? 'इन्टरनेटले काठमाडौं देखायो (~९५ किमी टाढा)!'
            : 'Browser IP routed to Kathmandu (~95km away)!',
          details: language === 'ne'
            ? 'नेपालका धेरैजसो ISP ले काठमाडौं देखाउँछन्। म्याजिक एप चितवनका लागि भएकाले स्थान चितवनमा राखिएको छ। तल आफ्नो चोक छान्नुहोस्।'
            : 'Nepal ISP GeoIP placed you in Kathmandu. Position kept in Chitwan transit zone. Choose your Chowk below.',
        });
        setShowLocationModal(true);
        return;
      }

      // Valid GPS inside Chitwan!
      applyLocation(lat, lng, true);
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        processCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        // Fallback: try with low accuracy (faster, works indoors or in emulation)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            processCoords(pos.coords.latitude, pos.coords.longitude);
          },
          () => {
            setIsLocating(false);
            const chitwanLat = userLocation?.lat || 27.6798;
            const chitwanLng = userLocation?.lng || 84.4350;
            applyLocation(chitwanLat, chitwanLng, false);
            setLocationNotice({
              type: 'info',
              message: language === 'ne'
                ? 'जीपीएस अनुपलब्ध। स्थान भरतपुर चौबिसकोठीमा राखियो।'
                : 'GPS unavailable. Position set to Bharatpur Chaubiskothi hub.',
              details: language === 'ne'
                ? 'आफ्नो चोक छान्न वा नक्सामा थिच्न सक्नुहुन्छ।'
                : 'You can tap on map or pick your exact chowk anytime.',
            });
            setShowLocationModal(true);
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
    );
  };

  const handleUpdateUserLocation = (lat: number, lng: number) => {
    applyLocation(lat, lng, false);
  };

  const handleSelectChitwanChowk = (lat: number, lng: number, nameEn: string, nameNe: string) => {
    applyLocation(lat, lng, false, { en: nameEn, ne: nameNe });
  };

  const handleActivateTapToPin = () => {
    setIsTapToPinActive(true);
    setLocationNotice({
      type: 'info',
      message: language === 'ne' ? '🎯 नक्सामा जहाँ पनि थिच्नुहोस्' : '🎯 Tap anywhere on the Chitwan map',
      details: language === 'ne'
        ? 'नक्सामा जहाँ थिच्नुहुन्छ, त्यहीँ तपाईंको निलो पिन सर्नेछ।'
        : 'Your blue user pin will move directly to the tapped coordinate.',
    });
  };

  const handleResetFleet = () => {
    setVehicles(INITIAL_MAGIC_VEHICLES);
    setSelectedVehicleId(null);
  };

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const activeStop = TRANSIT_STOPS.find((s) => s.id === selectedStopId);

  // Map View Component - Full height viewport below navbar with no unintended scroll
  const MapView = (
    <div className="relative flex-1 flex flex-col h-[calc(100dvh-56px)] sm:h-[calc(100dvh-64px)] w-full overflow-hidden">
      <div className="relative w-full h-full flex-1 overflow-hidden">
        <MagicMap
          routes={TRANSIT_ROUTES}
          stops={TRANSIT_STOPS}
          vehicles={vehicles}
          selectedRouteId={selectedRouteId}
          selectedVehicleId={selectedVehicleId}
          selectedStopId={selectedStopId}
          userLocation={userLocation}
          language={language}
          basemap={basemap}
          isDark={isDark}
          onSelectRoute={setSelectedRouteId}
          onBasemapChange={setBasemap}
          onSelectVehicle={(id) => {
            setSelectedVehicleId(id);
            setSelectedStopId(null);
          }}
          onSelectStop={(id) => {
            setSelectedStopId(id);
            setSelectedVehicleId(null);
          }}
          onResetFleet={handleResetFleet}
          onLocateUser={handleLocateUser}
          isLocating={isLocating}
          locateTrigger={locateTrigger}
          onUpdateUserLocation={handleUpdateUserLocation}
          onOpenLocationModal={() => setShowLocationModal(true)}
          isTapToPinActive={isTapToPinActive}
          onDisableTapToPin={() => setIsTapToPinActive(false)}
        />

        {/* Real-time Location Toast Notification */}
        {locationNotice && (
          <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all ${
            locationNotice.type === 'warn'
              ? 'border-amber-300 dark:border-amber-700/70 ring-2 ring-amber-400/20'
              : 'border-gray-200 dark:border-neutral-800'
          }`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              locationNotice.type === 'warn'
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
            }`}>
              {locationNotice.type === 'warn' ? (
                <RiAlertLine className="w-4 h-4" />
              ) : (
                <RiNavigationLine className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                {locationNotice.message}
              </div>
              {locationNotice.details && (
                <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {locationNotice.details}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  <RiMapPin2Line className="w-3 h-3" />
                  <span>{language === 'ne' ? 'चितवन चोक रोज्नुहोस्' : 'Pick Chitwan Chowk'}</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setLocationNotice(null)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg cursor-pointer"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Selected Vehicle Card */}
        {activeVehicle && (
          <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 p-4 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs"
                  style={{
                    backgroundColor:
                      TRANSIT_ROUTES.find((r) => r.id === activeVehicle.routeId)?.color || '#1a73e8',
                  }}
                >
                  R{activeVehicle.routeNumber}
                </span>
                <span className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100">
                  {activeVehicle.plateNumber}
                </span>
                {activeVehicle.isDriverBroadcasting && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedVehicleId(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg cursor-pointer"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 font-medium mb-2.5">
              <RiUser3Line className="w-3.5 h-3.5 text-gray-400" />
              <span>{activeVehicle.driverName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 dark:bg-neutral-900 p-2.5 rounded-xl mb-3 border border-gray-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                  <RiSpeedLine className="w-3.5 h-3.5 text-gray-400" />
                  {language === 'ne' ? 'गति' : 'Current Speed'}
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {activeVehicle.speedKmH} km/h
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 flex items-center gap-1 mb-0.5">
                  <RiGroupLine className="w-3.5 h-3.5 text-gray-400" />
                  {language === 'ne' ? 'खाली सिट' : 'Open Seats'}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {activeVehicle.availableSeats} of {activeVehicle.totalSeats}
                </span>
              </div>
            </div>

            <div className="text-xs mb-3">
              <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-0.5">
                {language === 'ne' ? 'अघिल्लो बिसौनी' : 'Next Approaching Stop'}
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {language === 'ne' ? activeVehicle.nextStopNameNe : activeVehicle.nextStopNameEn}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] ml-1.5">
                (~{Math.ceil(activeVehicle.estimatedNextStopSec / 60)} min)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedRouteId(activeVehicle.routeId);
                }}
                className="flex-1 py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'ne' ? 'रुट फिल्टर' : 'Filter Route'}
              </button>

              <button
                onClick={() => navigate('/plan')}
                className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{language === 'ne' ? 'योजना' : 'Plan Trip'}</span>
                <RiArrowRightLine className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Selected Stop Card */}
        {activeStop && !activeVehicle && (
          <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-800 p-4 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  <RiMapPin2Fill className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  {language === 'ne' ? activeStop.nameNe : activeStop.nameEn}
                </span>
              </div>

              <button
                onClick={() => setSelectedStopId(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg cursor-pointer"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              {language === 'ne' ? activeStop.landmarkNe : activeStop.landmarkEn}
            </p>

            <button
              onClick={() => navigate('/plan')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{language === 'ne' ? 'यहाँबाट यात्रा योजना बनाउनुहोस्' : 'Plan Trip from this Stop'}</span>
              <RiArrowRightLine className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`bg-[#f8f9fa] dark:bg-[#131314] flex flex-col text-gray-900 dark:text-gray-100 font-sans transition-colors ${isMapPage ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      <Navbar language={language} isDark={isDark} onToggleTheme={handleToggleTheme} />

      <main className={`flex-1 flex flex-col ${isMapPage ? 'overflow-hidden' : ''}`}>
        <Routes>
          <Route path="/" element={MapView} />
          <Route path="/map" element={MapView} />
          <Route
            path="/plan"
            element={
              <RoutePlanner
                stops={TRANSIT_STOPS}
                routes={TRANSIT_ROUTES}
                vehicles={vehicles}
                language={language}
                onLocateUser={handleLocateUser}
                userLocation={userLocation}
                onSelectRoute={(id) => setSelectedRouteId(id)}
                onSelectVehicle={(id) => setSelectedVehicleId(id)}
                onNavigateToMap={() => navigate('/')}
                onOpenLocationModal={() => setShowLocationModal(true)}
              />
            }
          />
          <Route
            path="/planner"
            element={
              <RoutePlanner
                stops={TRANSIT_STOPS}
                routes={TRANSIT_ROUTES}
                vehicles={vehicles}
                language={language}
                onLocateUser={handleLocateUser}
                userLocation={userLocation}
                onSelectRoute={(id) => setSelectedRouteId(id)}
                onSelectVehicle={(id) => setSelectedVehicleId(id)}
                onNavigateToMap={() => navigate('/')}
                onOpenLocationModal={() => setShowLocationModal(true)}
              />
            }
          />
          <Route
            path="/fare"
            element={<FaresPage stops={TRANSIT_STOPS} routes={TRANSIT_ROUTES} language={language} />}
          />
          <Route
            path="/fares"
            element={<FaresPage stops={TRANSIT_STOPS} routes={TRANSIT_ROUTES} language={language} />}
          />
          <Route
            path="/routes"
            element={
              <RoutesList
                routes={TRANSIT_ROUTES}
                vehicles={vehicles}
                language={language}
                onSelectRoute={(id) => setSelectedRouteId(id)}
                onSelectVehicle={(id) => setSelectedVehicleId(id)}
                onNavigateToMap={() => navigate('/')}
              />
            }
          />
          <Route
            path="/fleet"
            element={
              <LiveFleetTracker
                vehicles={vehicles}
                routes={TRANSIT_ROUTES}
                language={language}
                onSelectVehicle={(id) => setSelectedVehicleId(id)}
                onNavigateToMap={() => navigate('/')}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                theme={theme}
                onThemeChange={setTheme}
                language={language}
                onLanguageChange={setLanguage}
                basemap={basemap}
                onBasemapChange={setBasemap}
                simulationSpeed={simulationSpeedMultiplier}
                onSimulationSpeedChange={setSimulationSpeedMultiplier}
                onResetFleet={handleResetFleet}
              />
            }
          />
          <Route path="*" element={MapView} />
        </Routes>
      </main>

      {/* Chitwan Location Selector Modal */}
      <ChitwanLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        stops={TRANSIT_STOPS}
        currentLocation={userLocation}
        onSelectLocation={handleSelectChitwanChowk}
        onActivateTapToPin={handleActivateTapToPin}
        onRetryGps={handleLocateUser}
        isLocating={isLocating}
        language={language}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
