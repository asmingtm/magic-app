import React, { useState, useMemo } from 'react';
import { TransitStop, TransitRoute, MagicVehicle, Language } from '../types/transit';
import { calculateDistanceKm, estimatePickupArrival, toNepaliNumber } from '../services/gpsSimulator';
import { ArrowUpDown, Navigation, Clock, ShieldCheck, Bus, Compass, AlertCircle, ArrowRight } from 'lucide-react';

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

  const fromStop = useMemo(() => stops.find((s) => s.id === fromStopId) || stops[0], [stops, fromStopId]);
  const toStop = useMemo(() => stops.find((s) => s.id === toStopId) || stops[1], [stops, toStopId]);

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

  // Road distance estimate (typically 1.25x straight distance in Bharatpur grid)
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">
          {language === 'ne' ? 'भरतपुर म्याजिक यात्रा योजना' : 'Bharatpur Magic Journey Planner'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          {language === 'ne'
            ? 'चोक छान्नुहोस् र कुन म्याजिक चढ्ने, भाडा दर र आउने समय तत्काल हेर्नुहोस्।'
            : 'Find which Magic route to take, estimated travel time, real-time incoming van, and official fares.'}
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Origin Stop */}
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {language === 'ne' ? 'कहाँबाट (शुरुवाती चोक):' : 'Starting From (Origin):'}
              </label>
              <button
                type="button"
                onClick={onLocateUser}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <Navigation className="w-3 h-3" />
                <span>{language === 'ne' ? 'मेरो जीपीएस' : 'My Location'}</span>
              </button>
            </div>
            <select
              value={fromStopId}
              onChange={(e) => setFromStopId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {language === 'ne' ? stop.nameNe : stop.nameEn} {stop.isMajorHub ? '★' : ''}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 truncate">
              📍 {language === 'ne' ? fromStop.landmarkNe : fromStop.landmarkEn}
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              type="button"
              onClick={handleSwapStops}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full transition-transform active:rotate-180 cursor-pointer shadow-sm"
              title="Swap stops"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Stop */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'ne' ? 'कहाँ जाने (गन्तव्य):' : 'Going To (Destination):'}
            </label>
            <select
              value={toStopId}
              onChange={(e) => setToStopId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {language === 'ne' ? stop.nameNe : stop.nameEn} {stop.isMajorHub ? '★' : ''}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-400 truncate">
              📍 {language === 'ne' ? toStop.landmarkNe : toStop.landmarkEn}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Solution Card */}
      {fromStopId === toStopId ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
          <h3 className="font-bold text-base mb-1">
            {language === 'ne' ? 'कृपया फरक गन्तव्य छान्नुहोस्' : 'Please select a different destination'}
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300">
            {language === 'ne'
              ? 'शुरुवाती चोक र गन्तव्य एउटै छानिएको छ।'
              : 'Origin and destination stops are currently the same.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {/* Top recommendation banner */}
          <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-50 dark:via-amber-950/20 to-transparent flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow"
                style={{ backgroundColor: bestRoute?.color || '#0284c7' }}
              >
                R{bestRoute?.routeNumber}
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  {language === 'ne' ? 'सिफारिस गरिएको म्याजिक रुट' : 'Recommended Magic Route'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'ne' ? bestRoute?.nameNe : bestRoute?.nameEn}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                if (bestRoute) onSelectRoute(bestRoute.id);
                onNavigateToMap();
              }}
              className="px-4 py-2 bg-slate-900 dark:bg-amber-500 dark:text-slate-950 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{language === 'ne' ? 'नक्सामा हेर्नुहोस्' : 'View on Live Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                {language === 'ne' ? 'अनुमानित समय' : 'Est. Travel Time'}
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  {language === 'ne' ? toNepaliNumber(estimatedMins) : estimatedMins} {language === 'ne' ? 'मिनेट' : 'mins'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                {language === 'ne' ? 'सडक दूरी' : 'Road Distance'}
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>
                  {language === 'ne' ? toNepaliNumber(roadDistanceKm) : roadDistanceKm} km
                </span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                {language === 'ne' ? 'साधारण भाडा' : 'Standard Fare'}
              </span>
              <div className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-slate-500">Rs.</span>
                <span>{language === 'ne' ? toNepaliNumber(standardFare) : standardFare}</span>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 font-bold uppercase block">
                {language === 'ne' ? 'विद्यार्थी छुट' : 'Student Fare (45% off)'}
              </span>
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="text-sm font-semibold text-emerald-600">Rs.</span>
                <span>{language === 'ne' ? toNepaliNumber(studentFare) : studentFare}</span>
              </div>
            </div>
          </div>

          {/* Real-Time Incoming Magic Van Alert */}
          {nearestIncomingVehicle && (
            <div className="p-6">
              <div className="bg-slate-900 dark:bg-slate-800/90 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 dark:border-slate-700">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                      {language === 'ne' ? 'नजिकै आइपुग्दै गरेको म्याजिक' : 'Nearest Incoming Magic Van'}
                    </span>
                  </div>
                  <div className="text-lg font-black flex items-center gap-2">
                    <Bus className="w-5 h-5 text-amber-400" />
                    <span>{nearestIncomingVehicle.vehicle.plateNumber}</span>
                    <span className="text-xs font-normal text-slate-300">
                      ({nearestIncomingVehicle.vehicle.driverName})
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {language === 'ne' ? 'हालको गति:' : 'Speed:'} {nearestIncomingVehicle.vehicle.speedKmH} km/h ·{' '}
                    {language === 'ne' ? 'उपलब्ध सिट:' : 'Seats open:'}{' '}
                    <span className="text-emerald-400 font-bold">
                      {nearestIncomingVehicle.vehicle.availableSeats} of {nearestIncomingVehicle.vehicle.totalSeats}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase text-slate-400 font-bold">
                      {language === 'ne' ? 'आइपुग्ने समय' : 'Estimated Arrival'}
                    </div>
                    <div className="text-2xl font-black text-amber-400 tabular-nums">
                      ~{nearestIncomingVehicle.etaMins} {language === 'ne' ? 'मिनेट' : 'min'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectVehicle(nearestIncomingVehicle.vehicle.id);
                      onNavigateToMap();
                    }}
                    className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'ne' ? 'ट्र्याक गर्नुहोस्' : 'Live Track'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stops along this journey */}
          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              {language === 'ne' ? 'यस यात्राका मुख्य बिसौनीहरू:' : 'Stops Sequence along Route:'}
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900 shadow"></div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'ne' ? 'प्रस्थान:' : 'Boarding at:'} {language === 'ne' ? fromStop.nameNe : fromStop.nameEn}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'ne' ? fromStop.landmarkNe : fromStop.landmarkEn}</p>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-3 h-3 rounded-full bg-slate-400 border-2 border-white dark:border-slate-900"></div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span>{language === 'ne' ? 'सवारी:' : 'Ride on:'} </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    Magic Route {bestRoute?.routeNumber} ({bestRoute?.isCircular ? 'Circular' : 'Direct'})
                  </span>
                </div>
              </div>

              <div className="relative flex items-center gap-3">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-amber-600 border-2 border-white dark:border-slate-900 shadow"></div>
                <div>
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {language === 'ne' ? 'गन्तव्य:' : 'Drop-off at:'} {language === 'ne' ? toStop.nameNe : toStop.nameEn}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{language === 'ne' ? toStop.landmarkNe : toStop.landmarkEn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
