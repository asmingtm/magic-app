import React, { useState, useRef, useEffect } from 'react';
import { MagicVehicle, TransitRoute, TransitStop, Language } from '../types/transit';
import { toNepaliNumber } from '../services/gpsSimulator';
import { 
  RiAddLine, 
  RiSubtractLine, 
  RiFocus2Line, 
  RiDragMoveLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCloseLine
} from 'react-icons/ri';

interface ChitwanSchematicMapProps {
  routes: TransitRoute[];
  stops: TransitStop[];
  vehicles: MagicVehicle[];
  selectedRouteId: string | null;
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  userLocation?: { lat: number; lng: number } | null;
  language: Language;
  onSelectVehicle: (vehicleId: string) => void;
  onSelectStop: (stopId: string) => void;
  onSelectRoute?: (routeId: string | null) => void;
}

export const ChitwanSchematicMap: React.FC<ChitwanSchematicMapProps> = ({
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
  onSelectRoute,
}) => {
  // Pan and zoom state for freely moving around
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  // Coordinate bounding box for Chitwan metropolitan area
  const MIN_LAT = 27.575;
  const MAX_LAT = 27.715;
  const MIN_LNG = 84.340;
  const MAX_LNG = 84.525;

  const project = (lat: number, lng: number): [number, number] => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 900 + 50;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 600 + 50;
    return [Math.round(x), Math.round(y)];
  };

  // Robust Pointer-based drag navigation (works with mouse, touch, pen across frames)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking on control buttons or interactive panels, don't drag map
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    didDragRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if pointer capture unsupported
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didDragRef.current = true;
    }

    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Fallback
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((z) => Math.min(3.5, Math.max(0.6, Number((z * factor).toFixed(2)))));
  };

  // Directional Pan buttons step
  const PAN_STEP = 80;
  const panUp = () => setPan((p) => ({ ...p, y: p.y + PAN_STEP }));
  const panDown = () => setPan((p) => ({ ...p, y: p.y - PAN_STEP }));
  const panLeft = () => setPan((p) => ({ ...p, x: p.x + PAN_STEP }));
  const panRight = () => setPan((p) => ({ ...p, x: p.x - PAN_STEP }));

  const handleZoomIn = () => setZoom((z) => Math.min(3.5, Number((z * 1.25).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, Number((z / 1.25).toFixed(2))));
  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Keyboard navigation when focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only when container or its children are active, or mouse is over map
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;
      if (e.key === 'ArrowUp') panUp();
      else if (e.key === 'ArrowDown') panDown();
      else if (e.key === 'ArrowLeft') panLeft();
      else if (e.key === 'ArrowRight') panRight();
      else if (e.key === '+' || e.key === '=') handleZoomIn();
      else if (e.key === '-' || e.key === '_') handleZoomOut();
      else if (e.key === '0') handleReset();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeRoute = routes.find((r) => r.id === selectedRouteId);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`relative w-full h-full bg-[#f8f9fa] dark:bg-[#131314] overflow-hidden select-none outline-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{ touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      title={language === 'ne' ? 'नक्सा सार्न तान्नुहोस् · जुम गर्न स्क्रोल गर्नुहोस्' : 'Drag to pan · Scroll to zoom'}
    >
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full pointer-events-auto"
        style={{ minHeight: '560px' }}
      >
        <defs>
          <pattern id="transit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* Scalable & Pannable Group */}
        <g transform={`translate(${500 + pan.x}, ${350 + pan.y}) scale(${zoom}) translate(-500, -350)`}>
          {/* Background Grid */}
          <rect width="1000" height="700" fill="#f8f9fa" />
          <rect width="1000" height="700" fill="url(#transit-grid)" />

          {/* Geographic Zones */}
          {/* Tikoli National Forest Corridor */}
          <path
            d="M 620,180 C 680,240 730,340 780,420 L 880,390 C 830,290 770,200 710,130 Z"
            fill="#dcfce7"
            stroke="#86efac"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text x="730" y="270" fill="#15803d" fontSize="11" fontWeight="bold" opacity="0.85" transform="rotate(35, 730, 270)">
            {language === 'ne' ? 'टिकौली जैविक मार्ग' : 'Tikoli Forest Corridor'}
          </text>

          {/* Chitwan National Park Buffer */}
          <rect x="250" y="580" width="700" height="110" rx="16" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
          <text x="500" y="640" fill="#166534" fontSize="13" fontWeight="800" textAnchor="middle" opacity="0.75">
            {language === 'ne' ? 'चितवन राष्ट्रिय निकुञ्ज' : 'Chitwan National Park Zone'}
          </text>

          {/* Narayani River on the West */}
          <path
            d="M 410,20 C 430,90 440,140 450,190 C 455,240 435,320 380,410 C 330,490 280,560 210,690 L 150,690 C 230,560 290,480 340,400 C 390,320 405,250 400,190 C 390,130 380,80 360,20 Z"
            fill="#e0f2fe"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />
          <text x="320" y="320" fill="#0284c7" fontSize="12" fontWeight="bold" opacity="0.85" transform="rotate(-65, 320, 320)">
            {language === 'ne' ? 'नारायणी नदी' : 'Narayani River'}
          </text>

          {/* East-West Mahendra Highway */}
          <path
            d="M 450,190 L 515,280 L 565,340 L 670,410 L 890,520"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 450,190 L 515,280 L 565,340 L 670,410 L 890,520"
            fill="none"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x="760" y="475" fill="#64748b" fontSize="10" fontWeight="bold" transform="rotate(27, 760, 475)">
            {language === 'ne' ? 'महेन्द्र राजमार्ग' : 'Mahendra Highway'}
          </text>

          {/* Route Polylines */}
          {routes.map((route) => {
            const isSelected = selectedRouteId === route.id;
            const strokeWidth = isSelected ? 9 : 5;
            const opacity = selectedRouteId ? (isSelected ? 1.0 : 0.18) : 0.85;

            const points = route.waypoints.map(([lat, lng]) => project(lat, lng));
            const pathD = points.reduce((acc, [x, y], idx) => {
              return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
            }, '');

            const shortName = language === 'ne' ? (route.shortNameNe || route.nameNe) : (route.shortNameEn || route.nameEn);

            return (
              <g 
                key={route.id} 
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoute?.(isSelected ? null : route.id);
                }}
              >
                <title>{`Route ${route.routeNumber}: ${shortName} (${language === 'ne' ? 'छान्नुहोस्' : 'Click to select'})`}</title>
                {/* Outer Glow Halo for Selected Route */}
                {isSelected && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={route.color}
                    strokeWidth={strokeWidth + 12}
                    strokeOpacity="0.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {/* Route Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Transit Stops */}
          {stops.map((stop) => {
            const [cx, cy] = project(stop.lat, stop.lng);
            const isSelected = selectedStopId === stop.id;
            const isHub = stop.isMajorHub;

            // Check if stop is part of the selected route
            const isOnSelectedRoute = activeRoute 
              ? activeRoute.stops.some(s => s.id === stop.id)
              : true;
            
            const stopOpacity = selectedRouteId ? (isOnSelectedRoute ? 1.0 : 0.25) : 1.0;

            return (
              <g
                key={stop.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStop(stop.id);
                }}
                opacity={stopOpacity}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                <title>{`${language === 'ne' ? stop.nameNe : stop.nameEn} · ${language === 'ne' ? stop.landmarkNe : stop.landmarkEn}`}</title>
                {/* Selected ripple */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r="18" fill="#1a73e8" fillOpacity="0.25" className="animate-ping" />
                )}
                {/* Stop circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHub ? 7 : 5}
                  fill={isSelected ? '#1a73e8' : isHub ? '#1f2937' : '#4b5563'}
                  stroke="#ffffff"
                  strokeWidth={isHub ? 2.5 : 1.5}
                />
                {/* Stop label */}
                {(isHub || isSelected || (selectedRouteId && isOnSelectedRoute)) && (
                  <g>
                    <rect
                      x={cx + 9}
                      y={cy - 12}
                      width={Math.max(60, (language === 'ne' ? stop.nameNe : stop.nameEn).length * 7)}
                      height="18"
                      rx="5"
                      fill="#ffffff"
                      fillOpacity="0.95"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <text
                      x={cx + 14}
                      y={cy + 1}
                      fill="#0f172a"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {language === 'ne' ? stop.nameNe : stop.nameEn}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Dynamic Animated Magic Vans */}
          {vehicles.map((vehicle) => {
            const [vx, vy] = project(vehicle.currentLat, vehicle.currentLng);
            const route = routes.find((r) => r.id === vehicle.routeId);
            const routeColor = route?.color || '#0284c7';
            const isSelected = selectedVehicleId === vehicle.id;
            const isOnSelectedRoute = selectedRouteId ? vehicle.routeId === selectedRouteId : true;
            const vehicleOpacity = selectedRouteId ? (isOnSelectedRoute ? 1.0 : 0.3) : 1.0;

            const occupancyColor =
              vehicle.occupancy === 'empty'
                ? '#10b981'
                : vehicle.occupancy === 'moderate'
                ? '#f59e0b'
                : '#f43f5e';

            return (
              <g
                key={vehicle.id}
                transform={`translate(${vx}, ${vy})`}
                opacity={vehicleOpacity}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVehicle(vehicle.id);
                }}
                className="cursor-pointer transition-transform"
              >
                <title>{`R${vehicle.routeNumber} (${vehicle.plateNumber}) · ${vehicle.speedKmH} km/h · ${vehicle.availableSeats} seats open`}</title>
                {/* Radar pulse ring */}
                <circle r={isSelected ? '22' : '16'} fill={routeColor} fillOpacity="0.2" className="animate-ping" />

                {/* Van Body Rect */}
                <rect
                  x="-16"
                  y="-13"
                  width="32"
                  height="26"
                  rx="7"
                  fill={routeColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
                />

                {/* Mini Windshield */}
                <rect x="-10" y="-9" width="20" height="7" rx="2" fill="#ffffff" fillOpacity="0.85" />

                {/* Route Number on Roof */}
                <text x="0" y="8" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                  R{vehicle.routeNumber}
                </text>

                {/* License Plate underneath */}
                <rect
                  x="-36"
                  y="16"
                  width="72"
                  height="15"
                  rx="4"
                  fill="#0f172a"
                  fillOpacity="0.9"
                />
                <circle cx="-28" cy="23.5" r="2.5" fill={occupancyColor} />
                <text x="0" y="27" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  {vehicle.plateNumber}
                </text>
              </g>
            );
          })}

          {/* User Live Location Beacon */}
          {userLocation && (() => {
            const [ux, uy] = project(userLocation.lat, userLocation.lng);
            return (
              <g key="user-location-schematic" transform={`translate(${ux}, ${uy})`}>
                <title>{language === 'ne' ? 'तपाईंको हालको स्थान' : 'Your Live Location'}</title>
                {/* Radar pulse rings */}
                <circle r="24" fill="#2563eb" fillOpacity="0.25" className="animate-ping" />
                <circle r="14" fill="#3b82f6" fillOpacity="0.4" />
                <circle r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                {/* User label */}
                <rect x="-24" y="-30" width="48" height="18" rx="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                <text x="0" y="-18" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">
                  {language === 'ne' ? 'तपाईं' : 'YOU'}
                </text>
              </g>
            );
          })()}
        </g>
      </svg>

      {/* Floating Directional D-Pad & Zoom Controls with Hover Tooltips */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-800 select-none">
        {/* D-Pad Pan Navigation */}
        <div className="grid grid-cols-3 gap-0.5 p-0.5 bg-gray-50 dark:bg-neutral-900 rounded-xl">
          <div />
          <button
            onClick={panUp}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center"
            title={language === 'ne' ? 'माथि सार्नुहोस्' : 'Pan Up (↑)'}
          >
            <RiArrowUpLine className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={panLeft}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center"
            title={language === 'ne' ? 'बायाँ सार्नुहोस्' : 'Pan Left (←)'}
          >
            <RiArrowLeftLine className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-950/60 rounded-lg text-blue-600 dark:text-blue-400 transition-colors cursor-pointer flex items-center justify-center"
            title={language === 'ne' ? 'केन्द्रमा फर्काउनुहोस्' : 'Reset View (0)'}
          >
            <RiFocus2Line className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={panRight}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center"
            title={language === 'ne' ? 'दायाँ सार्नुहोस्' : 'Pan Right (→)'}
          >
            <RiArrowRightLine className="w-3.5 h-3.5" />
          </button>
          <div />
          <button
            onClick={panDown}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer flex items-center justify-center"
            title={language === 'ne' ? 'तल सार्नुहोस्' : 'Pan Down (↓)'}
          >
            <RiArrowDownLine className="w-3.5 h-3.5" />
          </button>
          <div />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 w-full justify-between pt-1 border-t border-gray-100 dark:border-neutral-800">
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title={language === 'ne' ? 'जुम बढाउनुहोस्' : 'Zoom In (+)'}
          >
            <RiAddLine className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono font-bold text-gray-500">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
            title={language === 'ne' ? 'जुम घटाउनुहोस्' : 'Zoom Out (-)'}
          >
            <RiSubtractLine className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle Drag Hint Badge with Hover Tooltip */}
      <div 
        className="hidden sm:flex absolute bottom-4 left-4 z-20 items-center gap-1.5 bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-[10px] text-gray-500 dark:text-gray-400 font-medium"
        title={language === 'ne' ? 'माउस वा औंलाले तानेर सार्नुहोस् वा एरो बटनहरू थिच्नुहोस्' : 'Click & drag or use arrows to pan across Chitwan. Scroll to zoom.'}
      >
        <RiDragMoveLine className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>{language === 'ne' ? 'तानेर सार्नुहोस् · स्क्रोल जुम' : 'Drag to pan · Scroll to zoom'}</span>
      </div>

      {/* Active Route Filter Banner in Schematic view if selected */}
      {activeRoute && (
        <div className="absolute top-20 right-4 z-20 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-gray-200 dark:border-neutral-800 flex items-center gap-2 text-xs">
          <span 
            className="w-5 h-5 rounded-md text-white font-bold text-[10px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: activeRoute.color }}
          >
            R{activeRoute.routeNumber}
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            {language === 'ne' ? (activeRoute.shortNameNe || activeRoute.nameNe) : (activeRoute.shortNameEn || activeRoute.nameEn)}
          </span>
          <button
            onClick={() => onSelectRoute?.(null)}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg cursor-pointer ml-1"
            title={language === 'ne' ? 'रुट फिल्टर हटाउनुहोस्' : 'Clear route filter'}
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
