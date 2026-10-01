import React, { useState, useEffect, useCallback } from 'react';
import { AppViewMode, Language, MagicVehicle, OccupancyStatus } from './types/transit';
import { TRANSIT_ROUTES, TRANSIT_STOPS, INITIAL_MAGIC_VEHICLES, BHARATPUR_CENTER } from './data/bharatpurTransitData';
import { advanceSimulatedVehicles, findNearestStop, toNepaliNumber } from './services/gpsSimulator';
import { Navbar } from './components/Navbar';
import { MagicMap } from './components/MagicMap';
import { RoutePlanner } from './components/RoutePlanner';
import { RoutesList } from './components/RoutesList';
import { LiveFleetTracker } from './components/LiveFleetTracker';
import { DriverBroadcastModal } from './components/DriverBroadcastModal';
import { FareCalculatorModal } from './components/FareCalculatorModal';
import { HackathonGuideModal } from './components/HackathonGuideModal';
import { Play, Pause, FastForward, Navigation, Bus, Clock, ShieldCheck, MapPin, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('map');
  const [language, setLanguage] = useState<Language>('en');
  const [vehicles, setVehicles] = useState<MagicVehicle[]>(INITIAL_MAGIC_VEHICLES);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(1.0);

  // Modals
  const [isDriverModalOpen, setIsDriverModalOpen] = useState<boolean>(false);
  const [isFareModalOpen, setIsFareModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isDriverBroadcasting, setIsDriverBroadcasting] = useState<boolean>(false);
  const [broadcastingVehicleId, setBroadcastingVehicleId] = useState<string | null>(null);

  // Real-time animation timer
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setVehicles((prev) => advanceSimulatedVehicles(prev, simulationSpeedMultiplier));
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationSpeedMultiplier]);

  // Handle Driver broadcast
  const handleToggleDriverBroadcast = useCallback(
    (vehicleId: string, isBroadcasting: boolean, occupancy: OccupancyStatus, availableSeats: number) => {
      setIsDriverBroadcasting(isBroadcasting);
      setBroadcastingVehicleId(isBroadcasting ? vehicleId : null);

      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === vehicleId) {
            return {
              ...v,
              isDriverBroadcasting: isBroadcasting,
              occupancy,
              availableSeats,
              speedKmH: isBroadcasting ? 30 : v.speedKmH,
              lastUpdated: 'Just now (Driver Live)',
            };
          }
          return v;
        })
      );

      if (isBroadcasting) {
        setSelectedVehicleId(vehicleId);
        setCurrentView('map');
      }
    },
    []
  );

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
          // Find closest Bharatpur stop
          const nearest = findNearestStop(loc.lat, loc.lng, TRANSIT_STOPS);
          setSelectedStopId(nearest.stop.id);
        },
        () => {
          // Fallback to Chaubiskothi central hub
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

  // Add a new dummy Magic van to the Bharatpur transit map
  const handleAddDummyVan = (routeId: string) => {
    const route = TRANSIT_ROUTES.find((r) => r.id === routeId) || TRANSIT_ROUTES[0];
    const randomPlateNum = Math.floor(1000 + Math.random() * 9000);
    const prefixes = ['ना १ ज', 'बा १ ज', 'ना २ ज', 'बा २ ज'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const drivers = [
      'Ganesh Gurung (गणेश गुरुङ)',
      'Rajesh Thapa (राजेश थापा)',
      'Pooja Shrestha (पूजा श्रेष्ठ)',
      'Dipak Regmi (दिपक रेग्मी)',
      'Santosh Adhikari (सन्तोष अधिकारी)',
      'Bina Mahato (बिना महतो)',
    ];
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const seats = Math.floor(Math.random() * 10);
    const occupancy: OccupancyStatus = seats === 0 ? 'full' : seats <= 3 ? 'moderate' : 'empty';

    // Pick a random waypoint along the route
    const randomWpIndex = Math.floor(Math.random() * (route.waypoints.length - 1));
    const chosenWp = route.waypoints[randomWpIndex];

    const newVan: MagicVehicle = {
      id: `dummy-magic-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      plateNumber: `${randomPrefix} ${randomPlateNum}`,
      driverName: randomDriver,
      routeId: route.id,
      routeNumber: route.routeNumber,
      currentLat: chosenWp[0] + (Math.random() - 0.5) * 0.002,
      currentLng: chosenWp[1] + (Math.random() - 0.5) * 0.002,
      heading: Math.floor(Math.random() * 360),
      speedKmH: Math.floor(22 + Math.random() * 14),
      occupancy,
      availableSeats: seats,
      totalSeats: 10,
      currentStopIndex: Math.min(randomWpIndex, route.stops.length - 1),
      nextStopId: route.stops[1]?.id || route.stops[0].id,
      nextStopNameEn: route.stops[1]?.nameEn || route.stops[0].nameEn,
      nextStopNameNe: route.stops[1]?.nameNe || route.stops[0].nameNe,
      estimatedNextStopSec: 90,
      lastUpdated: 'Just now (Dummy Van)',
    };

    setVehicles((prev) => [newVan, ...prev]);
    setSelectedVehicleId(newVan.id);
  };

  const handleResetFleet = () => {
    setVehicles(INITIAL_MAGIC_VEHICLES);
    setSelectedVehicleId(null);
  };

  // Inspect selected items
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const activeStop = TRANSIT_STOPS.find((s) => s.id === selectedStopId);
  const activeRoute = TRANSIT_ROUTES.find((r) => r.id === selectedRouteId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'ne' : 'en'))}
        onOpenDriverModal={() => setIsDriverModalOpen(true)}
        onOpenFareModal={() => setIsFareModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        isDriverBroadcasting={isDriverBroadcasting}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'map' && (
          <div className="relative flex-1 flex flex-col min-h-[calc(100vh-64px)]">
            {/* Route Filter Ribbon */}
            <div className="bg-white border-b border-slate-200 px-4 py-2.5 z-20 overflow-x-auto">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 min-w-max">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                    {language === 'ne' ? 'रुट छान्नुहोस्:' : 'Routes:'}
                  </span>

                  <button
                    onClick={() => setSelectedRouteId(null)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedRouteId === null
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'ne' ? 'सबै रुटहरू' : 'All Routes'}
                  </button>

                  {TRANSIT_ROUTES.map((route) => {
                    const isSelected = selectedRouteId === route.id;
                    return (
                      <button
                        key={route.id}
                        onClick={() => setSelectedRouteId(isSelected ? null : route.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'text-white shadow-sm ring-2 ring-slate-900'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        style={{
                          backgroundColor: isSelected ? route.color : undefined,
                        }}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }}></span>
                        <span>Route {route.routeNumber}</span>
                        <span className="font-normal opacity-85 text-[11px]">
                          ({route.isCircular ? (language === 'ne' ? 'चक्रिय' : 'Loop') : (language === 'ne' ? 'सीधा' : 'Direct')})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Simulation Control Bar */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {language === 'ne' ? 'सिमुलेसन' : 'Telemetry'}
                  </span>

                  <button
                    onClick={() => setIsSimulationRunning((prev) => !prev)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                    title={isSimulationRunning ? 'Pause simulation' : 'Resume simulation'}
                  >
                    {isSimulationRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => setSimulationSpeedMultiplier((prev) => (prev === 1.0 ? 2.0 : prev === 2.0 ? 0.5 : 1.0))}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white rounded border border-slate-200 text-slate-800 cursor-pointer"
                    title="Toggle speed"
                  >
                    {simulationSpeedMultiplier}x
                  </button>

                  <button
                    onClick={handleLocateUser}
                    className="p-1 hover:bg-slate-200 rounded text-amber-600 cursor-pointer"
                    title={language === 'ne' ? 'मेरो स्थान पत्ता लगाउनुहोस्' : 'Find My Location'}
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Map Viewport */}
            <div
              className="relative flex-1 w-full"
              style={{ height: 'calc(100vh - 120px)', minHeight: '580px', width: '100%' }}
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
                onSelectVehicle={(id) => {
                  setSelectedVehicleId(id);
                  setSelectedStopId(null);
                }}
                onSelectStop={(id) => {
                  setSelectedStopId(id);
                  setSelectedVehicleId(null);
                }}
                onAddDummyVan={handleAddDummyVan}
                onResetFleet={handleResetFleet}
              />

              {/* Float Card: Selected Vehicle or Stop Inspector */}
              {activeVehicle && (
                <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
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
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {activeVehicle.plateNumber}
                      </span>
                      {activeVehicle.isDriverBroadcasting && (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ● BROADCASTING
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedVehicleId(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-700 font-semibold mb-2">
                    👨‍✈️ {activeVehicle.driverName}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {language === 'ne' ? 'गति' : 'Current Speed'}
                      </span>
                      <span className="font-black text-slate-900">
                        {language === 'ne' ? toNepaliNumber(activeVehicle.speedKmH) : activeVehicle.speedKmH} km/h
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {language === 'ne' ? 'खाली सिट' : 'Open Seats'}
                      </span>
                      <span className="font-black text-emerald-600">
                        {activeVehicle.availableSeats} of {activeVehicle.totalSeats}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs mb-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'ne' ? 'अघिल्लो बिसौनी' : 'Next Approaching Stop'}
                    </span>
                    <span className="font-bold text-slate-900">
                      {language === 'ne' ? activeVehicle.nextStopNameNe : activeVehicle.nextStopNameEn}
                    </span>
                    <span className="text-amber-600 font-semibold text-[11px] ml-1">
                      (~{Math.ceil(activeVehicle.estimatedNextStopSec / 60)} min)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRouteId(activeVehicle.routeId);
                      }}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {language === 'ne' ? 'सम्पूर्ण रुट हेर्नुहोस्' : 'Filter this Route'}
                    </button>

                    <button
                      onClick={() => {
                        setCurrentView('planner');
                      }}
                      className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {language === 'ne' ? 'चढ्ने योजना' : 'Plan Trip'}
                    </button>
                  </div>
                </div>
              )}

              {/* Float Card: Selected Stop Inspector */}
              {activeStop && !activeVehicle && (
                <div className="absolute bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-30 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-4 transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                        📍
                      </div>
                      <span className="font-bold text-sm text-slate-900">
                        {language === 'ne' ? activeStop.nameNe : activeStop.nameEn}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedStopId(null)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">
                    📍 {language === 'ne' ? activeStop.landmarkNe : activeStop.landmarkEn}
                  </p>

                  <div className="text-xs font-bold text-slate-700 mb-2">
                    {language === 'ne' ? 'यस चोक भएर जाने म्याजिकहरू:' : 'Incoming Magic Vans at this Stop:'}
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3">
                    {vehicles
                      .filter((v) => v.nextStopId === activeStop.id || Math.random() < 0.3)
                      .slice(0, 3)
                      .map((v) => (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehicleId(v.id)}
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg flex items-center justify-between cursor-pointer border border-slate-100"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-white px-1.5 py-0.5 rounded bg-slate-900">
                              R{v.routeNumber}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-800">
                              {v.plateNumber}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-amber-600">
                            ~{Math.ceil(v.estimatedNextStopSec / 60)} min
                          </span>
                        </div>
                      ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('planner');
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'ne' ? 'यहाँबाट यात्रा योजना बनाउनुहोस्' : 'Plan Trip from this Stop'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'planner' && (
          <RoutePlanner
            stops={TRANSIT_STOPS}
            routes={TRANSIT_ROUTES}
            vehicles={vehicles}
            language={language}
            onLocateUser={handleLocateUser}
            userLocation={userLocation}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onNavigateToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'routes' && (
          <RoutesList
            routes={TRANSIT_ROUTES}
            vehicles={vehicles}
            language={language}
            onSelectRoute={(id) => setSelectedRouteId(id)}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onNavigateToMap={() => setCurrentView('map')}
          />
        )}

        {currentView === 'fleet' && (
          <LiveFleetTracker
            vehicles={vehicles}
            routes={TRANSIT_ROUTES}
            language={language}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onNavigateToMap={() => setCurrentView('map')}
          />
        )}
      </main>

      {/* Modals */}
      <DriverBroadcastModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        routes={TRANSIT_ROUTES}
        vehicles={vehicles}
        language={language}
        onToggleDriverBroadcast={handleToggleDriverBroadcast}
        isDriverBroadcasting={isDriverBroadcasting}
      />

      <FareCalculatorModal
        isOpen={isFareModalOpen}
        onClose={() => setIsFareModalOpen(false)}
        stops={TRANSIT_STOPS}
        routes={TRANSIT_ROUTES}
        language={language}
      />

      <HackathonGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-800">MagicTrack Bharatpur</span>
            <span>·</span>
            <span>Chitwan, Nepal</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Hack-Days Guide & Setup
            </button>
            <button
              onClick={() => setIsFareModalOpen(true)}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Chitwan Fare Chart
            </button>
            <button
              onClick={() => setIsDriverModalOpen(true)}
              className="hover:text-amber-600 transition-colors cursor-pointer"
            >
              Driver GPS Portal
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Built for Hack-days: "Everyday problems, smart solutions"
          </div>
        </div>
      </footer>
    </div>
  );
}
