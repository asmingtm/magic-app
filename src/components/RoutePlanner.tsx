import React, { useState, useMemo, useEffect } from 'react';
import { TransitStop, TransitRoute, MagicVehicle, Language } from '../types/transit';
import { calculateDistanceKm, estimatePickupArrival, toNepaliNumber, findNearestStop } from '../services/gpsSimulator';
import { 
  RiArrowUpDownLine, 
  RiNavigationLine, 
  RiTimeLine, 
  RiBus2Line, 
  RiCompass3Line, 
  RiAlertLine, 
  RiArrowRightLine, 
  RiMapPin2Line 
} from 'react-icons/ri';
import { CustomSelect } from './CustomSelect';

interface RoutePlannerProps {
  stops: TransitStop[];
  routes: TransitRoute[];
  vehicles: MagicVehicle[];
  language: Language;
  onLocateUser: () => void;
  userLocation: { lat: number; lng: number } | null;
  onSelectRoute: (routeId: string) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onNavigateToMap: () => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  stops,
  routes,
  vehicles,
  language,
  onLocateUser,
  userLocation,
  onSelectRoute,
  onSelectVehicle,
  onNavigateToMap,
}) => {
  const [fromStopId, setFromStopId] = useState<string>('stop-chaubiskothi');
  const [toStopId, setToStopId] = useState<string>('stop-pulchowk');

  // Auto-select nearest stop when user location is detected
  useEffect(() => {
    if (userLocation) {
      const nearest = findNearestStop(userLocation.lat, userLocation.lng, stops);
      if (nearest.stop.id !== toStopId) {
        setFromStopId(nearest.stop.id);
      }
    }
  }, [userLocation, stops]);

  const fromStop = useMemo(() => stops.find((s) => s.id === fromStopId) || stops[0], [stops, fromStopId]);
  const toStop = useMemo(() => stops.find((s) => s.id === toStopId) || stops[1], [stops, toStopId]);

  const stopOptions = useMemo(() => {
    return stops.map((s) => ({
      value: s.id,
      label: language === 'ne' ? s.nameNe : s.nameEn,
      sublabel: language === 'ne' ? s.landmarkNe : s.landmarkEn,
      badge: s.isMajorHub ? (language === 'ne' ? 'हब' : 'Hub') : undefined,
      badgeColor: s.isMajorHub ? '#2563eb' : undefined,
    }));
  }, [stops, language]);

  // Swap From & To
  const handleSwapStops = () => {
    setFromStopId(toStopId);
    setToStopId(fromStopId);
  };

  // Find Route options connecting fromStop and toStop
  const matchingRoutes = useMemo(() => {
    return routes.filter((route) => {
      const hasFrom = route.stops.some((s) => s.id === fromStopId);
      const hasTo = route.stops.some((s) => s.id === toStopId);
      return hasFrom && hasTo;
    });
  }, [routes, fromStopId, toStopId]);

  const bestRoute: TransitRoute | undefined = matchingRoutes[0] || routes[0];

  // Calculate distance between stops
  const straightDistanceKm = useMemo(() => {
    return Number(calculateDistanceKm(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng).toFixed(1));
  }, [fromStop, toStop]);

  // Road distance estimate (typically 1.25x straight distance in Bharatpur highway grid)
  const roadDistanceKm = Number((straightDistanceKm * 1.25).toFixed(1));
  const estimatedMins = Math.max(5, Math.round(roadDistanceKm * 2.8));

  // Fare calculations based on Chitwan Yatayat Magic standards
  const standardFare = Math.min(50, Math.max(20, Math.round(20 + Math.max(0, roadDistanceKm - 3) * 3)));
  const studentFare = Math.round(standardFare * 0.55); // 45% discount in Nepal

  // Find nearest incoming vehicle on this route approaching fromStop
  const nearestIncomingVehicle = useMemo(() => {
    if (!bestRoute) return null;
    const routeVehicles = vehicles.filter((v) => v.routeId === bestRoute.id);
    if (routeVehicles.length === 0) return null;

    let closest = routeVehicles[0];
    let minMinutes = estimatePickupArrival(closest, fromStop);

    for (let i = 1; i < routeVehicles.length; i++) {
      const mins = estimatePickupArrival(routeVehicles[i], fromStop);
      if (mins < minMinutes) {
        minMinutes = mins;
        closest = routeVehicles[i];
      }
    }

    return { vehicle: closest, etaMins: minMinutes };
  }, [bestRoute, vehicles, fromStop]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Title Header */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-0.5">
          {language === 'ne' ? 'भरतपुर म्याजिक यात्रा योजना' : 'Bharatpur Magic Journey Planner'}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'ne' ? 'रुट, समय र आधिकारिक भाडा' : 'Optimal routes, live ETA & fares'}
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Origin Stop */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {language === 'ne' ? 'कहाँबाट:' : 'From:'}
              </label>
              <button
                type="button"
                onClick={onLocateUser}
                title={language === 'ne' ? 'मेरो हालको स्थान पत्ता लगाउनुहोस्' : 'Detect my location via GPS'}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RiNavigationLine className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{language === 'ne' ? 'मेरो जीपीएस' : 'My Location'}</span>
              </button>
            </div>
            <CustomSelect
              value={fromStopId}
              onChange={setFromStopId}
              options={stopOptions}
              searchable={true}
              searchPlaceholder={language === 'ne' ? 'चोक वा बिसौनी खोज्नुहोस्...' : 'Search stop or chowk...'}
              ariaLabel={language === 'ne' ? 'कहाँबाट' : 'From stop'}
            />
            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              <RiMapPin2Line className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{language === 'ne' ? fromStop.landmarkNe : fromStop.landmarkEn}</span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwapStops}
              className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-full transition-transform active:rotate-180 cursor-pointer shadow-xs border border-gray-200 dark:border-neutral-700"
              title={language === 'ne' ? 'स्थान साट्नुहोस्' : 'Swap origin and destination'}
            >
              <RiArrowUpDownLine className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Stop */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {language === 'ne' ? 'कहाँ जाने:' : 'To:'}
            </label>
            <CustomSelect
              value={toStopId}
              onChange={setToStopId}
              options={stopOptions}
              searchable={true}
              searchPlaceholder={language === 'ne' ? 'चोक वा बिसौनी खोज्नुहोस्...' : 'Search stop or chowk...'}
              ariaLabel={language === 'ne' ? 'कहाँ जाने' : 'To stop'}
            />
            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
              <RiMapPin2Line className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{language === 'ne' ? toStop.landmarkNe : toStop.landmarkEn}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Solution Card - NO GRADIENTS */}
      {fromStopId === toStopId ? (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 text-center text-blue-900 dark:text-blue-200">
          <RiAlertLine className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-base mb-1">
            {language === 'ne' ? 'कृपया फरक गन्तव्य छान्नुहोस्' : 'Please select a different destination'}
          </h3>
          <p className="text-xs text-blue-800 dark:text-blue-300">
            {language === 'ne'
              ? 'शुरुवाती चोक र गन्तव्य एउटै छानिएको छ।'
              : 'Origin and destination stops are currently the same.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xs overflow-hidden divide-y divide-gray-100 dark:divide-neutral-800 transition-colors">
          {/* Top recommendation banner (Solid clean gray, NO gradients) */}
          <div className="p-6 bg-gray-50 dark:bg-neutral-900 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xs"
                style={{ backgroundColor: bestRoute?.color || '#1a73e8' }}
              >
                R{bestRoute?.routeNumber}
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  {language === 'ne' ? 'सिफारिस गरिएको म्याजिक रुट' : 'Recommended Highway Route'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {language === 'ne' ? bestRoute?.nameNe : bestRoute?.nameEn}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                if (bestRoute) onSelectRoute(bestRoute.id);
                onNavigateToMap();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{language === 'ne' ? 'नक्सामा हेर्नुहोस्' : 'View on Live Map'}</span>
              <RiArrowRightLine className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/60 dark:bg-neutral-900/60">
            <div className="p-3 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-neutral-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase block">
                {language === 'ne' ? 'अनुमानित समय' : 'Est. Travel Time'}
              </span>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 mt-0.5">
                <RiTimeLine className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {language === 'ne' ? toNepaliNumber(estimatedMins) : estimatedMins} {language === 'ne' ? 'मिनेट' : 'mins'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-neutral-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase block">
                {language === 'ne' ? 'सडक दूरी' : 'Highway Distance'}
              </span>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 mt-0.5">
                <RiCompass3Line className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {language === 'ne' ? toNepaliNumber(roadDistanceKm) : roadDistanceKm} km
                </span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-neutral-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase block">
                {language === 'ne' ? 'साधारण भाडा' : 'Standard Fare'}
              </span>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-gray-500">Rs.</span>
                <span>{language === 'ne' ? toNepaliNumber(standardFare) : standardFare}</span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-neutral-800">
              <span className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase block">
                {language === 'ne' ? 'विद्यार्थी छुट' : 'Student Fare (45% off)'}
              </span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-emerald-600">Rs.</span>
                <span>{language === 'ne' ? toNepaliNumber(studentFare) : studentFare}</span>
              </div>
            </div>
          </div>

          {/* Real-Time Incoming Magic Van Alert */}
          {nearestIncomingVehicle && (
            <div className="p-6">
              <div className="bg-neutral-900 dark:bg-neutral-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                      {language === 'ne' ? 'नजिकै आइपुग्दै गरेको म्याजिक' : 'Nearest Approaching Magic Van'}
                    </span>
                  </div>
                  <div className="text-lg font-bold flex items-center gap-2">
                    <RiBus2Line className="w-5 h-5 text-blue-400" />
                    <span>{nearestIncomingVehicle.vehicle.plateNumber}</span>
                    <span className="text-xs font-normal text-gray-400">
                      ({nearestIncomingVehicle.vehicle.driverName})
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {language === 'ne' ? 'हालको गति:' : 'Speed:'} {nearestIncomingVehicle.vehicle.speedKmH} km/h ·{' '}
                    {language === 'ne' ? 'उपलब्ध सिट:' : 'Seats open:'}{' '}
                    <span className="text-emerald-400 font-bold">
                      {nearestIncomingVehicle.vehicle.availableSeats} of {nearestIncomingVehicle.vehicle.totalSeats}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-gray-400 font-bold">
                      {language === 'ne' ? 'आइपुग्ने समय' : 'Estimated Arrival'}
                    </div>
                    <div className="text-2xl font-bold text-blue-400 tabular-nums">
                      ~{nearestIncomingVehicle.etaMins} {language === 'ne' ? 'मिनेट' : 'min'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectVehicle(nearestIncomingVehicle.vehicle.id);
                      onNavigateToMap();
                    }}
                    className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'ne' ? 'ट्र्याक गर्नुहोस्' : 'Live Track'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stops along this journey */}
          <div className="p-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {language === 'ne' ? 'यस यात्राका मुख्य बिसौनीहरू:' : 'Stops Sequence along Route:'}
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-neutral-800">
              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white dark:border-[#1e1f20] shadow-xs"></div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'ne' ? 'प्रस्थान:' : 'Boarding at:'} {language === 'ne' ? fromStop.nameNe : fromStop.nameEn}
                  </span>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{language === 'ne' ? fromStop.landmarkNe : fromStop.landmarkEn}</p>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-3 h-3 rounded-full bg-gray-400 border-2 border-white dark:border-[#1e1f20]"></div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  <span>{language === 'ne' ? 'सवारी:' : 'Ride on:'} </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Magic Route {bestRoute?.routeNumber} ({bestRoute?.isCircular ? 'Loop' : 'Direct Highway'})
                  </span>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-[#1e1f20] shadow-xs"></div>
                <div>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                    {language === 'ne' ? 'गन्तव्य:' : 'Drop-off at:'} {language === 'ne' ? toStop.nameNe : toStop.nameEn}
                  </span>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{language === 'ne' ? toStop.landmarkNe : toStop.landmarkEn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
