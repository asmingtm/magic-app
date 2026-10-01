export type OccupancyStatus = 'empty' | 'moderate' | 'full';

export interface TransitStop {
  id: string;
  nameEn: string;
  nameNe: string;
  lat: number;
  lng: number;
  landmarkEn: string;
  landmarkNe: string;
  isMajorHub: boolean;
}

export interface TransitRoute {
  id: string;
  routeNumber: string;
  nameEn: string;
  nameNe: string;
  descriptionEn: string;
  descriptionNe: string;
  color: string;
  isCircular: boolean;
  totalDistanceKm: number;
  avgDurationMins: number;
  baseFareNpr: number;
  maxFareNpr: number;
  stops: TransitStop[];
  waypoints: [number, number][]; // lat, lng coordinates along the road
}

export interface MagicVehicle {
  id: string;
  plateNumber: string; // e.g., "ना १ ज २४५८"
  driverName: string;
  routeId: string;
  routeNumber: string;
  currentLat: number;
  currentLng: number;
  heading: number; // in degrees
  speedKmH: number;
  occupancy: OccupancyStatus;
  availableSeats: number;
  totalSeats: number;
  currentStopIndex: number;
  nextStopId: string;
  nextStopNameEn: string;
  nextStopNameNe: string;
  estimatedNextStopSec: number;
  lastUpdated: string;
  isDriverBroadcasting?: boolean;
}

export interface JourneyPlan {
  fromStop: TransitStop;
  toStop: TransitStop;
  recommendedRoute: TransitRoute;
  distanceKm: number;
  estimatedMins: number;
  standardFareNpr: number;
  studentFareNpr: number;
  nearestIncomingVehicle?: MagicVehicle;
  etaMinutesToPickup: number;
  intermediateStops: TransitStop[];
}

export type AppViewMode = 'map' | 'planner' | 'routes' | 'fleet' | 'guide';

export type Language = 'en' | 'ne';
