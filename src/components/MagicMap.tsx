import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MagicVehicle, TransitRoute, TransitStop, Language } from '../types/transit';
import { BHARATPUR_CENTER } from '../data/bharatpurTransitData';
import { toNepaliNumber } from '../services/gpsSimulator';
import { ChitwanSchematicMap } from './ChitwanSchematicMap';

interface MagicMapProps {
  routes: TransitRoute[];
  stops: TransitStop[];
  vehicles: MagicVehicle[];
  selectedRouteId: string | null;
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  userLocation: { lat: number; lng: number } | null;
  language: Language;
  onSelectVehicle: (vehicleId: string) => void;
  onSelectStop: (stopId: string) => void;
  onAddDummyVan: (routeId: string) => void;
  onResetFleet?: () => void;
}

export const MagicMap: React.FC<MagicMapProps> = ({
  routes,
  stops,
  vehicles,
  selectedRouteId,
  selectedVehicleId,
  selectedStopId,
  userLocation,
  language,
  onSelectVehicle,
  onSelectStop,
  onAddDummyVan,
  onResetFleet,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesLayerRef = useRef<L.FeatureGroup | null>(null);
  const stopsLayerRef = useRef<L.FeatureGroup | null>(null);
  const vehiclesLayerRef = useRef<L.FeatureGroup | null>(null);
  const userLayerRef = useRef<L.FeatureGroup | null>(null);
  const vehicleMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const [showAddVanMenu, setShowAddVanMenu] = React.useState(false);
  const [mapMode, setMapMode] = useState<'leaflet' | 'schematic'>('leaflet');

  const handleCenterBharatpur = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(BHARATPUR_CENTER, 13, { animate: true });
    }
  };

  const handleToggleMapMode = (mode: 'leaflet' | 'schematic') => {
    setMapMode(mode);
    if (mode === 'leaflet') {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  };

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BHARATPUR_CENTER,
      zoom: 13,
      zoomControl: false,
    });

    // High clarity CartoDB Voyager tiles with OpenStreetMap data
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO',
      subdomains: 'abcd',
    });
    tileLayer.addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Layer groups
    const polylinesLayer = L.featureGroup().addTo(map);
    const stopsLayer = L.featureGroup().addTo(map);
    const vehiclesLayer = L.featureGroup().addTo(map);
    const userLayer = L.featureGroup().addTo(map);

    polylinesLayerRef.current = polylinesLayer;
    stopsLayerRef.current = stopsLayer;
    vehiclesLayerRef.current = vehiclesLayer;
    userLayerRef.current = userLayer;
    mapInstanceRef.current = map;

    // Auto-detect container resize to guarantee tile rendering
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 250);
    const t3 = setTimeout(() => map.invalidateSize(), 600);
    const t4 = setTimeout(() => map.invalidateSize(), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Render Polylines for routes
  useEffect(() => {
    const layer = polylinesLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    routes.forEach((route) => {
      const isSelected = selectedRouteId === route.id;
      const opacity = selectedRouteId ? (isSelected ? 0.95 : 0.25) : 0.75;
      const weight = isSelected ? 6 : 4;

      const polyline = L.polyline(route.waypoints, {
        color: route.color,
        weight,
        opacity,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: route.isCircular ? undefined : undefined,
      });

      polyline.bindTooltip(
        `<strong>Route ${route.routeNumber}</strong>: ${language === 'ne' ? route.nameNe : route.nameEn}`,
        { sticky: true, className: 'transit-tooltip' }
      );

      layer.addLayer(polyline);
    });
  }, [routes, selectedRouteId, language]);

  // 3. Render Stops
  useEffect(() => {
    const layer = stopsLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    stops.forEach((stop) => {
      const isSelected = selectedStopId === stop.id;
      const isHub = stop.isMajorHub;

      const stopHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
          <div class="w-3.5 h-3.5 rounded-full ${
            isSelected
              ? 'bg-amber-500 ring-4 ring-amber-300 ring-opacity-75 scale-125'
              : isHub
              ? 'bg-slate-900 border-2 border-white shadow-md'
              : 'bg-slate-600 border border-white shadow-sm'
          }"></div>
          ${
            isHub || isSelected
              ? `<div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-800 shadow border border-slate-200 pointer-events-none">
                  ${language === 'ne' ? stop.nameNe : stop.nameEn}
                </div>`
              : ''
          }
        </div>
      `;

      const stopIcon = L.divIcon({
        html: stopHtml,
        className: 'stop-marker-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon });

      const popupContent = `
        <div class="p-2 text-slate-900 min-w-[200px]">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span class="text-xs font-bold text-amber-700 uppercase tracking-wide">
              ${language === 'ne' ? 'म्याजिक स्टेसन' : 'Magic Stop'}
            </span>
          </div>
          <h4 class="font-bold text-sm text-slate-900">${stop.nameEn}</h4>
          <p class="text-xs text-slate-600 mb-1 font-medium">${stop.nameNe}</p>
          <div class="text-[11px] text-slate-500 border-t border-slate-100 pt-1 mt-1">
            📍 ${language === 'ne' ? stop.landmarkNe : stop.landmarkEn}
          </div>
          <div class="mt-2 text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-1 flex items-center justify-between">
            <span>${language === 'ne' ? 'रुटहरू:' : 'Routes:'}</span>
            <span class="font-bold">1, 2, 3, 4, 5</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260 });
      marker.on('click', () => {
        onSelectStop(stop.id);
      });

      layer.addLayer(marker);
    });
  }, [stops, selectedStopId, language, onSelectStop]);

  // 4. Update or Create Magic Vehicles
  useEffect(() => {
    const layer = vehiclesLayerRef.current;
    if (!layer) return;

    const markersMap = vehicleMarkersMapRef.current;
    const activeVehicleIds = new Set(vehicles.map((v) => v.id));

    // Remove deleted vehicles
    markersMap.forEach((marker, id) => {
      if (!activeVehicleIds.has(id)) {
        layer.removeLayer(marker);
        markersMap.delete(id);
      }
    });

    vehicles.forEach((vehicle) => {
      const isSelected = selectedVehicleId === vehicle.id;
      const isBroadcasting = vehicle.isDriverBroadcasting;
      const route = routes.find((r) => r.id === vehicle.routeId);
      const routeColor = route?.color || '#0284c7';

      // Occupancy styling
      const occupancyDotColor =
        vehicle.occupancy === 'empty'
          ? 'bg-emerald-500'
          : vehicle.occupancy === 'moderate'
          ? 'bg-amber-500'
          : 'bg-rose-500';

      const html = `
        <div class="magic-marker group cursor-pointer ${isSelected ? 'scale-110' : ''}">
          <div class="magic-marker-inner relative">
            <!-- Pulsing Ring for Live Tracking -->
            <div class="gps-pulse" style="background-color: ${routeColor}40"></div>
            
            <!-- Vehicle Body -->
            <div class="relative flex items-center justify-center w-9 h-9 rounded-xl shadow-lg border-2 border-white transition-all"
                 style="background: linear-gradient(135deg, ${routeColor}, ${routeColor}dd);">
              
              <!-- Route Badge in Corner -->
              <span class="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] font-black px-1 py-0.2 rounded shadow">
                R${vehicle.routeNumber}
              </span>

              <!-- Tata Magic Microvan Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-8-7h7c.55 0 1-.45 1-1V6.5c0-.28-.22-.5-.5-.5h-7a.5.5 0 0 0-.5.5V9c0 .55.45 1 1 1z"/>
              </svg>

              <!-- Direction Pointer -->
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px]"
                   style="border-t-color: ${routeColor}; transform: rotate(${vehicle.heading}deg);"></div>
            </div>

            <!-- Plate Number Tag -->
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full ${occupancyDotColor}"></span>
              <span>${vehicle.plateNumber}</span>
              ${isBroadcasting ? '<span class="text-emerald-400">● LIVE</span>' : ''}
            </div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: 'magic-vehicle-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      let marker = markersMap.get(vehicle.id);

      if (!marker) {
        marker = L.marker([vehicle.currentLat, vehicle.currentLng], { icon: customIcon });
        marker.on('click', () => {
          onSelectVehicle(vehicle.id);
        });
        layer.addLayer(marker);
        markersMap.set(vehicle.id, marker);
      } else {
        marker.setLatLng([vehicle.currentLat, vehicle.currentLng]);
        marker.setIcon(customIcon);
      }

      // Detailed popup
      const occupancyLabel =
        vehicle.occupancy === 'empty'
          ? language === 'ne'
            ? 'सिट खाली छ'
            : 'Seats Available'
          : vehicle.occupancy === 'moderate'
          ? language === 'ne'
            ? 'केही सिट मात्र'
            : 'Few Seats Left'
          : language === 'ne'
          ? 'भरिभराउ / प्याक'
          : 'Full / Crowded';

      const popupContent = `
        <div class="p-2.5 min-w-[210px] text-slate-900">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[11px] font-black text-white" style="background-color: ${routeColor}">
              Route ${vehicle.routeNumber}
            </span>
            <span class="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
              ${vehicle.plateNumber}
            </span>
          </div>
          
          <div class="text-xs text-slate-700 font-semibold mb-1">
            👨‍✈️ ${vehicle.driverName}
          </div>

          <div class="grid grid-cols-2 gap-2 my-2 bg-slate-50 p-2 rounded-lg text-[11px]">
            <div>
              <div class="text-slate-400 text-[10px] uppercase font-bold">${language === 'ne' ? 'गति' : 'Speed'}</div>
              <div class="font-bold text-slate-800">${language === 'ne' ? toNepaliNumber(vehicle.speedKmH) : vehicle.speedKmH} km/h</div>
            </div>
            <div>
              <div class="text-slate-400 text-[10px] uppercase font-bold">${language === 'ne' ? 'सिट' : 'Seats'}</div>
              <div class="font-bold text-slate-800">${vehicle.availableSeats} / ${vehicle.totalSeats}</div>
            </div>
          </div>

          <div class="text-xs mb-1">
            <span class="text-slate-400 text-[10px] uppercase font-bold block">${language === 'ne' ? 'अघिल्लो बिसौनी' : 'Next Stop'}</span>
            <span class="font-bold text-slate-900">
              ${language === 'ne' ? vehicle.nextStopNameNe : vehicle.nextStopNameEn}
            </span>
            <span class="text-[11px] text-amber-600 font-medium ml-1">
              (~${Math.ceil(vehicle.estimatedNextStopSec / 60)} min)
            </span>
          </div>

          <div class="mt-2 text-[10px] flex items-center justify-between border-t border-slate-100 pt-1.5 text-slate-500">
            <span>Status:</span>
            <span class="font-semibold text-slate-800">${occupancyLabel}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280 });
    });
  }, [vehicles, routes, selectedVehicleId, language, onSelectVehicle]);

  // 5. User GPS Location Marker
  useEffect(() => {
    const layer = userLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    if (userLocation) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-300 ring-opacity-60"></div>
          <div class="gps-pulse" style="background-color: rgba(37, 99, 235, 0.3);"></div>
        </div>
      `;

      const userIcon = L.divIcon({
        html: userHtml,
        className: 'user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindTooltip(language === 'ne' ? 'तपाईंको स्थान (तपाईं यहाँ हुनुहुन्छ)' : 'Your Location', {
        permanent: false,
        direction: 'top',
      });
      layer.addLayer(userMarker);

      // Accuracy circle
      const accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
        radius: 80,
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1,
      });
      layer.addLayer(accuracyCircle);
    }
  }, [userLocation, language]);

  // 6. Smooth pan to selected vehicle or stop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedVehicleId) {
      const v = vehicles.find((item) => item.id === selectedVehicleId);
      if (v) {
        map.panTo([v.currentLat, v.currentLng], { animate: true, duration: 0.8 });
      }
    } else if (selectedStopId) {
      const s = stops.find((item) => item.id === selectedStopId);
      if (s) {
        map.panTo([s.lat, s.lng], { animate: true, duration: 0.8 });
      }
    }
  }, [selectedVehicleId, selectedStopId, vehicles, stops]);

  return (
    <div
      className="relative w-full bg-slate-100 overflow-hidden"
      style={{ height: 'calc(100vh - 120px)', minHeight: '580px', width: '100%' }}
    >
      {/* 1. Leaflet Interactive Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: '580px',
          display: mapMode === 'leaflet' ? 'block' : 'none',
        }}
      />

      {/* 2. Zero-dependency Bharatpur Transit Vector Schematic Map */}
      {mapMode === 'schematic' && (
        <div style={{ width: '100%', height: '100%', minHeight: '580px' }}>
          <ChitwanSchematicMap
            routes={routes}
            stops={stops}
            vehicles={vehicles}
            selectedRouteId={selectedRouteId}
            selectedVehicleId={selectedVehicleId}
            selectedStopId={selectedStopId}
            language={language}
            onSelectVehicle={onSelectVehicle}
            onSelectStop={onSelectStop}
          />
        </div>
      )}

      {/* Map Overlay Controls */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Fleet count badge */}
          <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
            <div className="text-xs font-semibold text-slate-800">
              {language === 'ne' ? 'भरतपुर प्रत्यक्ष म्याजिक' : 'Bharatpur Live Transit'}
            </div>
            <span className="text-[11px] text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
              {vehicles.length} {language === 'ne' ? 'म्याजिक' : 'vans'}
            </span>
          </div>

          {/* Map Mode Switcher */}
          <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 text-xs">
            <button
              onClick={() => handleToggleMapMode('leaflet')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                mapMode === 'leaflet'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗺️ {language === 'ne' ? 'सडक नक्सा' : 'Street Map'}
            </button>
            <button
              onClick={() => handleToggleMapMode('schematic')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                mapMode === 'schematic'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🧭 {language === 'ne' ? 'ट्रान्जिट नक्सा' : 'Transit Vector'}
            </button>
          </div>

          {/* Center Map button */}
          {mapMode === 'leaflet' && (
            <button
              onClick={handleCenterBharatpur}
              className="bg-white/95 backdrop-blur-md hover:bg-slate-100 p-2 rounded-xl shadow-md border border-slate-200 text-slate-700 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
              title={language === 'ne' ? 'भरतपुर केन्द्रित गर्नुहोस्' : 'Center on Bharatpur'}
            >
              <span>🎯</span>
              <span className="hidden sm:inline">{language === 'ne' ? 'केन्द्र' : 'Center'}</span>
            </button>
          )}

          {/* Quick Add Dummy Van Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddVanMenu((prev) => !prev)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-2 rounded-xl shadow-md text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>➕</span>
              <span>{language === 'ne' ? 'डमी म्याजिक थप्नुहोस्' : 'Add Dummy Van'}</span>
            </button>

            {showAddVanMenu && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-30 space-y-1">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'ne' ? 'कुन रुटमा थप्ने?' : 'Select Route to Spawn:'}
                </div>
                {routes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onAddDummyVan(r.id);
                      setShowAddVanMenu(false);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span
                      className="w-5 h-5 rounded-md text-white font-black text-[10px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: r.color }}
                    >
                      R{r.routeNumber}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate">
                        {language === 'ne' ? r.nameNe : r.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {r.isCircular ? 'Circular Loop' : 'Direct Corridor'}
                      </div>
                    </div>
                  </button>
                ))}

                {onResetFleet && (
                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        onResetFleet();
                        setShowAddVanMenu(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-[11px] text-slate-500 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      ↺ {language === 'ne' ? 'मूल फ्लीट रिसेट गर्नुहोस्' : 'Reset to Default Fleet'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Legend on bottom left */}
      <div className="hidden sm:flex absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs gap-4 items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="text-slate-700 text-[11px] font-medium">{language === 'ne' ? 'सिट खाली' : 'Seats open'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
          <span className="text-slate-700 text-[11px] font-medium">{language === 'ne' ? 'केही सिट' : 'Few seats'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
          <span className="text-slate-700 text-[11px] font-medium">{language === 'ne' ? 'भरिभराउ (प्याक)' : 'Full'}</span>
        </div>
      </div>
    </div>
  );
};
