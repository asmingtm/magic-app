import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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

  // Theme state with local persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('magictrack_theme') as ThemeMode) || 'light';
  });

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

  // Apply Dark Mode class to documentElement
  const isDark = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  // User Geolocation Handler
  const handleLocateUser = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          const nearest = findNearestStop(loc.lat, loc.lng, TRANSIT_STOPS);
          setSelectedStopId(nearest.stop.id);
        },
        () => {
          setUserLocation({ lat: 27.6798, lng: 84.4350 });
          setSelectedStopId('stop-chaubiskothi');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: 27.6798, lng: 84.4350 });
      setSelectedStopId('stop-chaubiskothi');
    }
  };

  const handleResetFleet = () => {
    setVehicles(INITIAL_MAGIC_VEHICLES);
    setSelectedVehicleId(null);
  };

  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const activeStop = TRANSIT_STOPS.find((s) => s.id === selectedStopId);

  // Map View Component - Full height viewport below navbar with no footer
  const MapView = (
    <div className="relative flex-1 flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full overflow-hidden">
      <div className="relative w-full h-full">
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
        />

        {/* Locate User Button */}
        <button
          onClick={handleLocateUser}
          className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-neutral-800 px-3 py-2 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          title={language === 'ne' ? 'मेरो स्थान' : 'Locate My Position'}
        >
          <RiNavigationLine className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">{language === 'ne' ? 'मेरो स्थान' : 'Locate'}</span>
        </button>

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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#131314] flex flex-col text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <Navbar language={language} />

      <main className="flex-1 flex flex-col">
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
