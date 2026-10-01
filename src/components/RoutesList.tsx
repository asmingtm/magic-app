import React, { useState } from 'react';
import { TransitRoute, TransitStop, MagicVehicle, Language } from '../types/transit';
import { toNepaliNumber } from '../services/gpsSimulator';
import { Bus, MapPin, Clock, ArrowRight, Compass, Users } from 'lucide-react';

interface RoutesListProps {
  routes: TransitRoute[];
  vehicles: MagicVehicle[];
  language: Language;
  onSelectRoute: (routeId: string) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onNavigateToMap: () => void;
}

export const RoutesList: React.FC<RoutesListProps> = ({
  routes,
  vehicles,
  language,
  onSelectRoute,
  onSelectVehicle,
  onNavigateToMap,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0].id);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const activeRouteVehicles = vehicles.filter((v) => v.routeId === activeRoute.id);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
            {language === 'ne' ? 'चितवन भरतपुरका म्याजिक रुटहरू' : 'Chitwan Bharatpur Magic Routes'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {language === 'ne'
              ? 'भरतपुर महानगरपालिका तथा आसपासका सबै आधिकारिक म्याजिक रुट र बिसौनीहरू।'
              : 'Explore all registered Magic microvan corridors across Bharatpur Metropolitan City.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {language === 'ne' ? 'कुल रुटहरू:' : 'Total Routes:'}
          </span>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-black text-xs">
            {language === 'ne' ? toNepaliNumber(routes.length) : routes.length}
          </span>
        </div>
      </div>

      {/* Routes Grid / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {routes.map((route) => {
          const isSelected = route.id === activeRoute.id;
          const routeVehiclesCount = vehicles.filter((v) => v.routeId === route.id).length;

          return (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm"
                    style={{ backgroundColor: route.color }}
                  >
                    R{route.routeNumber}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {routeVehiclesCount} {language === 'ne' ? 'गाडी' : 'vans'}
                  </span>
                </div>

                <h3 className="font-bold text-sm line-clamp-1">
                  {language === 'ne' ? route.nameNe : route.nameEn}
                </h3>
                <p className={`text-[11px] line-clamp-2 mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'ne' ? route.descriptionNe : route.descriptionEn}
                </p>
              </div>

              <div className={`mt-3 pt-2 text-[11px] flex items-center justify-between border-t ${
                isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
              }`}>
                <span>{route.isCircular ? (language === 'ne' ? 'चक्रिय' : 'Loop') : (language === 'ne' ? 'सीधा' : 'Linear')}</span>
                <span className="font-bold">Rs. {route.baseFareNpr} - {route.maxFareNpr}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Route Detail Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Banner with Route Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md"
              style={{ backgroundColor: activeRoute.color }}
            >
              R{activeRoute.routeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ne' ? `रुट नं. ${toNepaliNumber(activeRoute.routeNumber)}` : `Magic Route ${activeRoute.routeNumber}`}
                </span>
                {activeRoute.isCircular && (
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md">
                    {language === 'ne' ? 'चक्रिय मार्ग (Ring Road)' : 'Circular Ring Road'}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {language === 'ne' ? activeRoute.nameNe : activeRoute.nameEn}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {language === 'ne' ? activeRoute.descriptionNe : activeRoute.descriptionEn}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onSelectRoute(activeRoute.id);
              onNavigateToMap();
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-center transition-colors cursor-pointer"
          >
            <span>{language === 'ne' ? 'नक्सामा ट्र्याक गर्नुहोस्' : 'View on Live Map'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {language === 'ne' ? 'कुल दूरी' : 'Total Distance'}
            </span>
            <span className="text-lg font-black text-slate-900">
              {language === 'ne' ? toNepaliNumber(activeRoute.totalDistanceKm) : activeRoute.totalDistanceKm} km
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {language === 'ne' ? 'एक फन्को समय' : 'Avg. Round Trip'}
            </span>
            <span className="text-lg font-black text-slate-900">
              ~{language === 'ne' ? toNepaliNumber(activeRoute.avgDurationMins) : activeRoute.avgDurationMins} min
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {language === 'ne' ? 'भाडा दर' : 'Fare Range'}
            </span>
            <span className="text-lg font-black text-slate-900">
              Rs. {activeRoute.baseFareNpr} - {activeRoute.maxFareNpr}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {language === 'ne' ? 'सक्रिय म्याजिकहरू' : 'Active Magic Fleet'}
            </span>
            <span className="text-lg font-black text-emerald-700">
              {activeRouteVehicles.length} {language === 'ne' ? 'गाडी' : 'vans running'}
            </span>
          </div>
        </div>

        {/* Two-column layout: Stops Timeline & Active Magic Vans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Stops Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>{language === 'ne' ? 'यस रुटका बिसौनीहरू (Stops)' : 'Official Stops on this Route'}</span>
            </h4>

            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
              {activeRoute.stops.map((stop, idx) => (
                <div key={`${stop.id}-${idx}`} className="relative group py-1">
                  <div className="absolute -left-[23px] top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-500 group-hover:scale-125 transition-transform"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-800">
                        {language === 'ne' ? stop.nameNe : stop.nameEn}
                      </span>
                      {stop.isMajorHub && (
                        <span className="ml-2 text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          {language === 'ne' ? 'मुख्य चोक' : 'Major Hub'}
                        </span>
                      )}
                      <p className="text-[11px] text-slate-400">
                        {language === 'ne' ? stop.landmarkNe : stop.landmarkEn}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Magic Vans Running on this Route */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Bus className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ne' ? 'हाल चल्दै गरेका म्याजिकहरू' : 'Live Vehicles Currently Active'}</span>
            </h4>

            {activeRouteVehicles.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                {language === 'ne'
                  ? 'यस रुटमा अहिले कुनै म्याजिक सक्रिय छैन।'
                  : 'No active vehicles currently tracked on this route.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeRouteVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-all flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          {vehicle.plateNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            vehicle.occupancy === 'empty'
                              ? 'bg-emerald-100 text-emerald-800'
                              : vehicle.occupancy === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {vehicle.occupancy === 'empty'
                            ? language === 'ne'
                              ? 'खाली (सिट उपलब्ध)'
                              : 'Seats Available'
                            : vehicle.occupancy === 'moderate'
                            ? language === 'ne'
                              ? 'केही सिट मात्र'
                              : 'Few Seats'
                            : language === 'ne'
                            ? 'भरिभराउ'
                            : 'Full'}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 font-medium">
                        {vehicle.driverName}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        {language === 'ne' ? 'अघिल्लो बिसौनी:' : 'Next Stop:'}{' '}
                        <span className="font-semibold text-slate-800">
                          {language === 'ne' ? vehicle.nextStopNameNe : vehicle.nextStopNameEn}
                        </span>{' '}
                        · {vehicle.speedKmH} km/h
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectVehicle(vehicle.id);
                        onNavigateToMap();
                      }}
                      className="px-3 py-1.5 bg-white hover:bg-slate-900 hover:text-white border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                    >
                      {language === 'ne' ? 'ट्र्याक' : 'Track'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
