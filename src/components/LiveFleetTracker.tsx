import React, { useState, useMemo } from 'react';
import { MagicVehicle, TransitRoute, Language } from '../types/transit';
import { toNepaliNumber } from '../services/gpsSimulator';
import { 
  RiBus2Line, 
  RiSearchLine, 
  RiDashboard3Line, 
  RiGroupLine, 
  RiArrowRightLine 
} from 'react-icons/ri';
import { CustomSelect, SelectOption } from './CustomSelect';

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

  const routeFilterOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'all', label: language === 'ne' ? 'सबै रुटहरू' : 'All Routes' },
      ...routes.map((r) => ({
        value: r.id,
        label: `Route ${r.routeNumber} (${language === 'ne' ? r.nameNe : r.nameEn})`,
        badge: `R${r.routeNumber}`,
        badgeColor: r.color,
      })),
    ];
  }, [routes, language]);

  const occupancyFilterOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'all', label: language === 'ne' ? 'सबै सिट स्थिति' : 'All Occupancy' },
      { value: 'empty', label: language === 'ne' ? 'सिट खाली' : 'Seats Available' },
      { value: 'moderate', label: language === 'ne' ? 'केही सिट' : 'Few Seats' },
      { value: 'full', label: language === 'ne' ? 'भरिभराउ / प्याक' : 'Full' },
    ];
  }, [language]);

  // Aggregate stats
  const totalSeatsOpen = vehicles.reduce((sum, v) => sum + v.availableSeats, 0);
  const avgSpeed = Math.round(vehicles.reduce((sum, v) => sum + v.speedKmH, 0) / (vehicles.length || 1));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {language === 'ne' ? 'प्रत्यक्ष जीपीएस फ्लीट अनुगमन' : 'Real-Time Highway Fleet Monitor'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {language === 'ne' ? 'भरतपुर म्याजिक भ्यान स्थिति' : 'Active Bharatpur Highway Vans'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'ne'
              ? 'प्रत्यक्ष स्थान, गति र खाली सिट स्थिति'
              : 'Live position, speed & seat status'}
          </p>
        </div>

        <button
          onClick={onNavigateToMap}
          title={language === 'ne' ? 'प्रत्यक्ष नक्सा दृश्यमा जानुहोस्' : 'Switch to live interactive map view'}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto cursor-pointer shadow-xs"
        >
          <span>{language === 'ne' ? 'नक्सामा हेर्नुहोस्' : 'Open Live Map'}</span>
          <RiArrowRightLine className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <RiBus2Line className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">
              {language === 'ne' ? 'सक्रिय म्याजिक संख्या' : 'Active Magic Vans'}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'ne' ? toNepaliNumber(vehicles.length) : vehicles.length}{' '}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{language === 'ne' ? 'गाडी' : 'online'}</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <RiDashboard3Line className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">
              {language === 'ne' ? 'औसत गति' : 'Average Fleet Speed'}
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'ne' ? toNepaliNumber(avgSpeed) : avgSpeed}{' '}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">km/h</span>
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-5 border border-gray-200 dark:border-neutral-800 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <RiGroupLine className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 block">
              {language === 'ne' ? 'उपलब्ध खाली सिट' : 'Open Passenger Seats'}
            </span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {language === 'ne' ? toNepaliNumber(totalSeatsOpen) : totalSeatsOpen}{' '}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{language === 'ne' ? 'सिट बाँकी' : 'available'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-4 border border-gray-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between transition-colors">
        <div className="relative w-full md:w-80">
          <RiSearchLine className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ne'
                ? 'नम्बर प्लेट वा चालकको नाम खोज्नुहोस्...'
                : 'Search plate number, driver, or stop...'
            }
            className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Route filter */}
          <div className="w-full sm:w-56">
            <CustomSelect
              value={selectedRouteFilter}
              onChange={setSelectedRouteFilter}
              options={routeFilterOptions}
              ariaLabel={language === 'ne' ? 'रुट फिल्टर' : 'Route filter'}
            />
          </div>

          {/* Occupancy filter */}
          <div className="w-full sm:w-44">
            <CustomSelect
              value={selectedOccupancyFilter}
              onChange={setSelectedOccupancyFilter}
              options={occupancyFilterOptions}
              ariaLabel={language === 'ne' ? 'सिट स्थिति' : 'Occupancy filter'}
            />
          </div>
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
              className="bg-white dark:bg-[#1e1f20] rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: route?.color || '#1a73e8' }}
                    >
                      R{vehicle.routeNumber}
                    </span>
                    <span className="font-mono font-bold text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                      {vehicle.plateNumber}
                    </span>
                  </div>

                  {isBroadcasting ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>LIVE GPS</span>
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        vehicle.occupancy === 'empty'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : vehicle.occupancy === 'moderate'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
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

                <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {vehicle.driverName}
                </div>

                <div className="grid grid-cols-2 gap-2 my-2.5 bg-gray-50 dark:bg-neutral-900 p-2.5 rounded-xl border border-gray-100 dark:border-neutral-800 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      {language === 'ne' ? 'गति' : 'Speed'}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {vehicle.speedKmH} km/h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      {language === 'ne' ? 'सिट' : 'Seats'}
                    </span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {vehicle.availableSeats} of {vehicle.totalSeats}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                    {language === 'ne' ? 'अघिल्लो बिसौनी' : 'Next Stop'}
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {language === 'ne' ? vehicle.nextStopNameNe : vehicle.nextStopNameEn}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] ml-1.5">
                    (~{Math.ceil(vehicle.estimatedNextStopSec / 60)} min)
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectVehicle(vehicle.id);
                  onNavigateToMap();
                }}
                className="w-full py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-gray-800 dark:text-gray-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{language === 'ne' ? 'नक्सामा प्रत्यक्ष हेर्नुहोस्' : 'Track on Live Map'}</span>
                <RiArrowRightLine className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
