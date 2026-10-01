import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Language, MagicVehicle, OccupancyStatus } from './types/transit';
import { TRANSIT_ROUTES, TRANSIT_STOPS, INITIAL_MAGIC_VEHICLES } from './data/bharatpurTransitData';
import { advanceSimulatedVehicles, findNearestStop } from './services/gpsSimulator';
import { Navbar } from './components/Navbar';
import { MagicMap } from './components/MagicMap';
import { RoutePlanner } from './components/RoutePlanner';
import { RoutesList } from './components/RoutesList';
import { LiveFleetTracker } from './components/LiveFleetTracker';
import { SettingsPage, ThemeMode, BasemapProvider } from './pages/SettingsPage';
import { FaresPage } from './pages/FaresPage';
import { Navigation, X } from 'lucide-react';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
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

  // Map View Component
  const MapView = (
    <div className="relative flex-1 flex flex-col min-h-[calc(100vh-64px)]">
      {/* Interactive Map Viewport */}
      <div
        className="relative flex-1 w-full"
        style={{ height: 'calc(100vh - 64px)', minHeight: '580px', width: '100%' }}
      >
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

        {/* Locate User floating button */}
        <button
          onClick={handleLocateUser}
          className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
          title={language === 'ne' ? 'मेरो स्थान' : 'Locate My Position'}
        >
          <Navigation className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">{language === 'ne' ? 'मेरो स्थान' : 'Locate'}</span>
        </button>

        {/* Selected Vehicle Float Card */}
        {activeVehicle && (
          <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg text-white font-black text-xs flex items-center justify-center"
                  style={{
                    backgroundColor:
                      TRANSIT_ROUTES.find((r) => r.id === activeVehicle.routeId)?.color || '#0284c7',
                  }}
                >
                  R{activeVehicle.routeNumber}
                </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  {activeVehicle.plateNumber}
                </span>
                {activeVehicle.isDriverBroadcasting && (
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    ● BROADCASTING
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedVehicleId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-2">
              👨‍✈️ {activeVehicle.driverName}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {language === 'ne' ? 'गति' : 'Current Speed'}
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {activeVehicle.speedKmH} km/h
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  {language === 'ne' ? 'खाली सिट' : 'Open Seats'}
                </span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {activeVehicle.availableSeats} of {activeVehicle.totalSeats}
                </span>
              </div>
            </div>

            <div className="text-xs mb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {language === 'ne' ? 'अघिल्लो बिसौनी' : 'Next Approaching Stop'}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {language === 'ne' ? activeVehicle.nextStopNameNe : activeVehicle.nextStopNameEn}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold text-[11px] ml-1">
                (~{Math.ceil(activeVehicle.estimatedNextStopSec / 60)} min)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedRouteId(activeVehicle.routeId);
                }}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'ne' ? 'सम्पूर्ण रुट हेर्नुहोस्' : 'Filter this Route'}
              </button>

              <button
                onClick={() => navigate('/planner')}
                className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'ne' ? 'चढ्ने योजना' : 'Plan Trip'}
              </button>
            </div>
          </div>
        )}

        {/* Selected Stop Float Card */}
        {activeStop && !activeVehicle && (
          <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 transition-all">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                  📍
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'ne' ? activeStop.nameNe : activeStop.nameEn}
                </span>
              </div>

              <button
                onClick={() => setSelectedStopId(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              📍 {language === 'ne' ? activeStop.landmarkNe : activeStop.landmarkEn}
            </p>

            <button
              onClick={() => navigate('/planner')}
              className="w-full py-2 bg-slate-900 dark:bg-amber-500 dark:text-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {language === 'ne' ? 'यहाँबाट यात्रा योजना बनाउनुहोस्' : 'Plan Trip from this Stop'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar
        routes={TRANSIT_ROUTES}
        selectedRouteId={selectedRouteId}
        onSelectRoute={setSelectedRouteId}
        language={language}
      />

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

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800 dark:text-white">MagicTrack Bharatpur</span>
            <span>·</span>
            <span>Chitwan, Nepal</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Map
            </Link>
            <Link to="/plan" className="hover:text-amber-600 transition-colors">
              Plan
            </Link>
            <Link to="/fare" className="hover:text-amber-600 transition-colors">
              Fare
            </Link>
            <Link to="/settings" className="hover:text-amber-600 transition-colors">
              Settings
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Smart Microvan Transit Solution
          </div>
        </div>
      </footer>
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
