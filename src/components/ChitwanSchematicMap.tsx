import React from 'react';
import { MagicVehicle, TransitRoute, TransitStop, Language } from '../types/transit';
import { toNepaliNumber } from '../services/gpsSimulator';

interface ChitwanSchematicMapProps {
  routes: TransitRoute[];
  stops: TransitStop[];
  vehicles: MagicVehicle[];
  selectedRouteId: string | null;
  selectedVehicleId: string | null;
  selectedStopId: string | null;
  language: Language;
  onSelectVehicle: (vehicleId: string) => void;
  onSelectStop: (stopId: string) => void;
}

/**
 * High-clarity vector map of Bharatpur & Chitwan
 * Maps geographic coordinates [lat 27.58 - 27.71, lng 84.34 - 84.52] into SVG viewBox [0 0 1000 700]
 */
export const ChitwanSchematicMap: React.FC<ChitwanSchematicMapProps> = ({
  routes,
  stops,
  vehicles,
  selectedRouteId,
  selectedVehicleId,
  selectedStopId,
  language,
  onSelectVehicle,
  onSelectStop,
}) => {
  // Coordinate bounding box for Chitwan metropolitan area
  const MIN_LAT = 27.575;
  const MAX_LAT = 27.715;
  const MIN_LNG = 84.340;
  const MAX_LNG = 84.525;

  const project = (lat: number, lng: number): [number, number] => {
    const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 900 + 50;
    // Invert Y because latitude increases northward
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 600 + 50;
    return [Math.round(x), Math.round(y)];
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none">
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full"
        style={{ minHeight: '560px' }}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="transit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
          </pattern>
          {/* River gradient */}
          <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
          </linearGradient>
          {/* Forest gradient */}
          <linearGradient id="forest-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background Grid */}
        <rect width="1000" height="700" fill="#f8fafc" />
        <rect width="1000" height="700" fill="url(#transit-grid)" />

        {/* Geographic Zones */}
        {/* Tikoli National Forest Corridor */}
        <path
          d="M 620,180 C 680,240 730,340 780,420 L 880,390 C 830,290 770,200 710,130 Z"
          fill="url(#forest-grad)"
          stroke="#86efac"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <text x="730" y="270" fill="#15803d" fontSize="12" fontWeight="bold" opacity="0.7" transform="rotate(35, 730, 270)">
          {language === 'ne' ? 'टिकौली जैविक मार्ग (जंगल)' : 'Tikoli Forest Corridor'}
        </text>

        {/* Chitwan National Park Buffer */}
        <rect x="250" y="580" width="700" height="110" rx="16" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5" />
        <text x="500" y="640" fill="#166534" fontSize="14" fontWeight="800" textAnchor="middle" opacity="0.6">
          {language === 'ne' ? 'चितवन राष्ट्रिय निकुञ्ज क्षेत्र (Chitwan National Park)' : 'Chitwan National Park Buffer Zone'}
        </text>

        {/* Narayani River on the West */}
        <path
          d="M 410,20 C 430,90 440,140 450,190 C 455,240 435,320 380,410 C 330,490 280,560 210,690 L 150,690 C 230,560 290,480 340,400 C 390,320 405,250 400,190 C 390,130 380,80 360,20 Z"
          fill="url(#river-grad)"
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <text x="320" y="320" fill="#0284c7" fontSize="13" fontWeight="bold" opacity="0.75" transform="rotate(-65, 320, 320)">
          {language === 'ne' ? 'नारायणी नदी (Narayani River)' : 'Narayani River'}
        </text>

        {/* Major Roads / Highway base network */}
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
          {language === 'ne' ? 'पूर्व-पश्चिम महेन्द्र राजमार्ग' : 'East-West Mahendra Highway'}
        </text>

        {/* Route Polylines */}
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const strokeWidth = isSelected ? 8 : 5;
          const opacity = selectedRouteId ? (isSelected ? 1.0 : 0.25) : 0.85;

          const points = route.waypoints.map(([lat, lng]) => project(lat, lng));
          const pathD = points.reduce((acc, [x, y], idx) => {
            return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
          }, '');

          return (
            <g key={route.id} className="cursor-pointer">
              {/* Outer glow for selected route */}
              {isSelected && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={strokeWidth + 8}
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Route line */}
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

          return (
            <g
              key={stop.id}
              onClick={() => onSelectStop(stop.id)}
              className="cursor-pointer transition-transform hover:scale-125"
            >
              {/* Ripple on selected stop */}
              {isSelected && (
                <circle cx={cx} cy={cy} r="18" fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
              )}
              {/* Stop circle */}
              <circle
                cx={cx}
                cy={cy}
                r={isHub ? 7 : 5}
                fill={isSelected ? '#f59e0b' : isHub ? '#0f172a' : '#475569'}
                stroke="#ffffff"
                strokeWidth={isHub ? 2.5 : 1.5}
              />
              {/* Stop label */}
              {(isHub || isSelected) && (
                <g>
                  <rect
                    x={cx + 9}
                    y={cy - 12}
                    width={Math.max(65, (language === 'ne' ? stop.nameNe : stop.nameEn).length * 7)}
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
              onClick={() => onSelectVehicle(vehicle.id)}
              className="cursor-pointer transition-transform"
            >
              {/* Radar pulse ring */}
              <circle r={isSelected ? "22" : "16"} fill={routeColor} fillOpacity="0.2" className="animate-ping" />

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

              {/* License Plate & Occupancy Tag underneath */}
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
      </svg>
    </div>
  );
};
