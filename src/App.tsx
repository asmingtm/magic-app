import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Language, MagicVehicle } from './types/transit';
import { TRANSIT_ROUTES, TRANSIT_STOPS, INITIAL_MAGIC_VEHICLES } from './data/bharatpurTransitData';
import { advanceSimulatedVehicles, findNearestStop } from './services/gpsSimulator';
import { Navbar } from './components/Navbar';
import { MagicMap } from './components/MagicMap';
import { RoutePlanner } from './components/RoutePlanner';
import { RoutesList } from './components/RoutesList';
import { LiveFleetTracker } from './components/LiveFleetTracker';
import { FaresPage } from './pages/FaresPage';
import { SettingsPage, ThemeMode, BasemapProvider } from './pages/SettingsPage';
import { 
  RiNavigationLine, 
  RiCloseLine, 
  RiUser3Line, 
  RiMapPin2Fill, 
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateTrigger, setLocateTrigger] = useState<number>(0);
  const [locationNotice, setLocationNotice] = useState<{
    type: 'success' | 'info' | 'warn';
    message: string;
    details?: string;
  } | null>(null);

  // Auto-dismiss location notice after 5 seconds
  useEffect(() => {
    if (!locationNotice) return;
    const timer = setTimeout(() => setLocationNotice(null), 5000);
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
  const applyLocation = (lat: number, lng: number, isRealGps: boolean) => {
    setUserLocation({ lat, lng });
    setLocateTrigger(Date.now());
    setSelectedVehicleId(null);
    setSelectedStopId(null);
    setIsLocating(false);

    const nearest = findNearestStop(lat, lng, TRANSIT_STOPS);
    const nearestStopName = language === 'ne' ? nearest.stop.nameNe : nearest.stop.nameEn;
    const distMeters = Math.round(nearest.distanceKm * 1000);

    if (isRealGps) {
      setLocationNotice({
        type: 'success',
        message: language === 'ne' ? 'तपाईंको जीपीएस स्थान पत्ता लाग्यो!' : 'Live GPS location detected!',
        details: language === 'ne'
          ? `नजिकैको म्याजिक बिसौनी: ${nearestStopName} (~${distMeters} मिटर)`
          : `Nearest Magic Stop: ${nearestStopName} (~${distMeters}m away)`,
      });
    } else {
      setLocationNotice({
        type: 'info',
        message: language === 'ne'
          ? 'ब्राउजर जीपीएस अनुपलब्ध। भरतपुर चौबीसकोठी हब केन्द्र छानियो।'
          : 'GPS restricted or unavailable in browser. Centered at Chaubiskothi hub.',
        details: language === 'ne'
          ? `नजिकैको म्याजिक बिसौनी: ${nearestStopName}`
          : `Nearest Magic Stop: ${nearestStopName}`,
      });
    }
  };

  // Robust User Geolocation Handler with multiple fallbacks
  const handleLocateUser = () => {
    setIsLocating(true);

    if (!('geolocation' in navigator)) {
      applyLocation(27.6798, 84.4350, false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        applyLocation(position.coords.latitude, position.coords.longitude, true);
      },
      () => {
        // Fallback: try with low accuracy (faster, works indoors or in emulation)
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            applyLocation(pos.coords.latitude, pos.coords.longitude, true);
          },
          () => {
            // Safe fallback to central Bharatpur passenger hub
            applyLocation(27.6798, 84.4350, false);
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
    );
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
        />

        {/* Real-time Location Toast Notification */}
        {locationNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 flex items-start gap-3 transition-all">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <RiNavigationLine className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-gray-900 dark:text-gray-100">
                {locationNotice.message}
              </div>
              {locationNotice.details && (
                <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5">
                  {locationNotice.details}
                </div>
              )}
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
