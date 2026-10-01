import React, { useState, useMemo } from 'react';
import { MagicVehicle, TransitRoute, Language } from '../types/transit';
import { toNepaliNumber } from '../services/gpsSimulator';
import { Bus, Search, Filter, Gauge, Users, MapPin, Radio, ArrowRight } from 'lucide-react';

interface LiveFleetTrackerProps {
  vehicles: MagicVehicle[];
  routes: TransitRoute[];
  language: Language;
  onSelectVehicle: (vehicleId: string) => void;
  onNavigateToMap: () => void;
}

export const LiveFleetTracker: React.FC<LiveFleetTrackerProps> = ({
  vehicles,
  routes,
  language,
  onSelectVehicle,
  onNavigateToMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');
  const [selectedOccupancyFilter, setSelectedOccupancyFilter] = useState<string>('all');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesSearch =
        v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.nextStopNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.nextStopNameNe.includes(searchQuery);

      const matchesRoute = selectedRouteFilter === 'all' || v.routeId === selectedRouteFilter;
      const matchesOccupancy = selectedOccupancyFilter === 'all' || v.occupancy === selectedOccupancyFilter;

      return matchesSearch && matchesRoute && matchesOccupancy;
    });
  }, [vehicles, searchQuery, selectedRouteFilter, selectedOccupancyFilter]);

  // Aggregate stats
  const totalSeatsOpen = vehicles.reduce((sum, v) => sum + v.availableSeats, 0);
  const avgSpeed = Math.round(vehicles.reduce((sum, v) => sum + v.speedKmH, 0) / (vehicles.length || 1));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {language === 'ne' ? 'प्रत्यक्ष जीपीएस फ्लीट अनुगमन' : 'Real-Time GPS Fleet Monitor'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            {language === 'ne' ? 'भरतपुर म्याजिक भ्यान स्थिति' : 'Active Bharatpur Magic Vans'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {language === 'ne'
              ? 'भरतपुर सडकमा गुडीरहेका सबै म्याजिकहरूको प्रत्यक्ष स्थान, गति र खाली सिट।'
              : 'Live tracking of all microvans currently in service across Narayangarh and Bharatpur.'}
          </p>
        </div>

        <button
          onClick={onNavigateToMap}
          className="px-4 py-2.5 bg-slate-900 dark:bg-amber-500 dark:text-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer"
        >
          <span>{language === 'ne' ? 'नक्सामा हेर्नुहोस्' : 'Open Live Map'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">
              {language === 'ne' ? 'सक्रिय म्याजिक संख्या' : 'Active Magic Vans'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'ne' ? toNepaliNumber(vehicles.length) : vehicles.length}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'ne' ? 'गाडी' : 'online'}</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">
              {language === 'ne' ? 'औसत गति' : 'Average Fleet Speed'}
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {language === 'ne' ? toNepaliNumber(avgSpeed) : avgSpeed}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">km/h</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">
              {language === 'ne' ? 'उपलब्ध खाली सिट' : 'Open Passenger Seats'}
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {language === 'ne' ? toNepaliNumber(totalSeatsOpen) : totalSeatsOpen}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{language === 'ne' ? 'सिट बाँकी' : 'available'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ne'
                ? 'नम्बर प्लेट वा चालकको नाम खोज्नुहोस्...'
                : 'Search plate number, driver, or stop...'
            }
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Route filter */}
          <select
            value={selectedRouteFilter}
            onChange={(e) => setSelectedRouteFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">{language === 'ne' ? 'सबै रुटहरू' : 'All Routes'}</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                Route {r.routeNumber} ({language === 'ne' ? r.nameNe : r.nameEn})
              </option>
            ))}
          </select>

          {/* Occupancy filter */}
          <select
            value={selectedOccupancyFilter}
            onChange={(e) => setSelectedOccupancyFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">{language === 'ne' ? 'सबै सिट स्थिति' : 'All Occupancy'}</option>
            <option value="empty">{language === 'ne' ? 'सिट खाली' : 'Seats Available'}</option>
            <option value="moderate">{language === 'ne' ? 'केही सिट' : 'Few Seats'}</option>
            <option value="full">{language === 'ne' ? 'भरिभराउ / प्याक' : 'Full'}</option>
          </select>
        </div>
      </div>

      {/* Fleet Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const route = routes.find((r) => r.id === vehicle.routeId);
          const isBroadcasting = vehicle.isDriverBroadcasting;

          return (
            <div
              key={vehicle.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: route?.color || '#0284c7' }}
                    >
                      R{vehicle.routeNumber}
                    </span>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {vehicle.plateNumber}
                    </span>
                  </div>

                  {isBroadcasting ? (
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>LIVE GPS</span>
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vehicle.occupancy === 'empty'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : vehicle.occupancy === 'moderate'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {vehicle.occupancy === 'empty'
                        ? language === 'ne'
                          ? 'सिट खाली'
                          : 'Seats Open'
                        : vehicle.occupancy === 'moderate'
                        ? language === 'ne'
                          ? 'केही सिट'
                          : 'Few Seats'
                        : language === 'ne'
                        ? 'प्याक'
                        : 'Full'}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-2">
                  👨‍✈️ {vehicle.driverName}
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                      {language === 'ne' ? 'रुट:' : 'Route:'}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[170px]">
                      {language === 'ne' ? route?.nameNe : route?.nameEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                      {language === 'ne' ? 'अघिल्लो बिसौनी:' : 'Next Stop:'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {language === 'ne' ? vehicle.nextStopNameNe : vehicle.nextStopNameEn}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
                      {language === 'ne' ? 'खाली सिट संख्या:' : 'Available Seats:'}
                    </span>
                    <span className="font-black text-emerald-700 dark:text-emerald-400">
                      {vehicle.availableSeats} of {vehicle.totalSeats}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <Gauge className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {language === 'ne' ? toNepaliNumber(vehicle.speedKmH) : vehicle.speedKmH} km/h
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectVehicle(vehicle.id);
                    onNavigateToMap();
                  }}
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-amber-500 dark:text-slate-950 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{language === 'ne' ? 'ट्र्याक गर्नुहोस्' : 'Live Track'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <Bus className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-sm">
            {language === 'ne'
              ? 'कुनै म्याजिक फेला परेन। कृपया फिल्टर बदल्नुहोस्।'
              : 'No matching Magic vans found. Try adjusting your filters.'}
          </p>
        </div>
      )}
    </div>
  );
};
