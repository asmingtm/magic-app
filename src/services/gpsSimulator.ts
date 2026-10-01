import { MagicVehicle, TransitRoute, TransitStop, OccupancyStatus } from '../types/transit';
import { TRANSIT_ROUTES, TRANSIT_STOPS } from '../data/bharatpurTransitData';

/**
 * Computes Haversine distance in kilometers between two geo coordinates
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates bearing heading in degrees from point A to point B
 */
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Finds the nearest stop to a given coordinate
 */
export function findNearestStop(lat: number, lng: number, stops: TransitStop[] = TRANSIT_STOPS): { stop: TransitStop; distanceKm: number } {
  let closest = stops[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < stops.length; i++) {
    const dist = calculateDistanceKm(lat, lng, stops[i].lat, stops[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = stops[i];
    }
  }

  return { stop: closest, distanceKm: minDistance };
}

/**
 * Moves simulated vehicles one step along their route path
 */
export function advanceSimulatedVehicles(vehicles: MagicVehicle[], speedMultiplier = 1.0): MagicVehicle[] {
  return vehicles.map((vehicle) => {
    // If vehicle is live driver broadcast, don't simulate it
    if (vehicle.isDriverBroadcasting) {
      return vehicle;
    }

    const route = TRANSIT_ROUTES.find((r) => r.id === vehicle.routeId);
    if (!route || route.waypoints.length < 2) return vehicle;

    const waypoints = route.waypoints;
    const currentLat = vehicle.currentLat;
    const currentLng = vehicle.currentLng;

    // Find closest waypoint segment in a forward-biased local window to preserve highway travel direction
    let nearestIndex = vehicle.waypointIndex ?? 0;
    if (nearestIndex < 0 || nearestIndex >= waypoints.length) nearestIndex = 0;

    // Search within a focused window around current waypoint index first
    const searchWindow = 12;
    let minWaypointDist = Infinity;
    let bestIndex = nearestIndex;

    const startIdx = Math.max(0, nearestIndex - 2);
    const endIdx = Math.min(waypoints.length - 1, nearestIndex + searchWindow);
    
    for (let i = startIdx; i <= endIdx; i++) {
      const d = calculateDistanceKm(currentLat, currentLng, waypoints[i][0], waypoints[i][1]);
      if (d < minWaypointDist) {
        minWaypointDist = d;
        bestIndex = i;
      }
    }

    // If drifted too far, do full scan fallback
    if (minWaypointDist > 0.5) {
      for (let i = 0; i < waypoints.length; i++) {
        const d = calculateDistanceKm(currentLat, currentLng, waypoints[i][0], waypoints[i][1]);
        if (d < minWaypointDist) {
          minWaypointDist = d;
          bestIndex = i;
        }
      }
    }
    nearestIndex = bestIndex;

    // Determine target waypoint based on circular vs linear route
    let currentDirection = vehicle.direction || 'forward';
    let nextWaypointIndex: number;

    if (route.isCircular) {
      nextWaypointIndex = (nearestIndex + 1) % waypoints.length;
    } else {
      if (currentDirection === 'forward') {
        if (nearestIndex >= waypoints.length - 1) {
          currentDirection = 'backward';
          nextWaypointIndex = Math.max(0, waypoints.length - 2);
        } else {
          nextWaypointIndex = nearestIndex + 1;
        }
      } else {
        if (nearestIndex <= 0) {
          currentDirection = 'forward';
          nextWaypointIndex = Math.min(waypoints.length - 1, 1);
        } else {
          nextWaypointIndex = nearestIndex - 1;
        }
      }
    }

    const targetWp = waypoints[nextWaypointIndex];

    // Compute direction vector
    const dLat = targetWp[0] - currentLat;
    const dLng = targetWp[1] - currentLng;
    const distToTarget = Math.sqrt(dLat * dLat + dLng * dLng);

    // Calculate movement step size based on vehicle speed
    // 0.00035 in degrees is ~35-40 meters
    const stepSize = 0.00035 * (vehicle.speedKmH / 28) * speedMultiplier;

    let newLat: number;
    let newLng: number;
    let heading = vehicle.heading;
    let currentWpIndex = nearestIndex;

    if (distToTarget <= stepSize || distToTarget === 0) {
      // Reached waypoint, advance to next
      newLat = targetWp[0];
      newLng = targetWp[1];
      currentWpIndex = nextWaypointIndex;

      let lookAheadIndex: number;
      if (route.isCircular) {
        lookAheadIndex = (nextWaypointIndex + 1) % waypoints.length;
      } else {
        lookAheadIndex = currentDirection === 'forward'
          ? Math.min(waypoints.length - 1, nextWaypointIndex + 1)
          : Math.max(0, nextWaypointIndex - 1);
      }
      heading = calculateBearing(newLat, newLng, waypoints[lookAheadIndex][0], waypoints[lookAheadIndex][1]);
    } else {
      newLat = currentLat + (dLat / distToTarget) * stepSize;
      newLng = currentLng + (dLng / distToTarget) * stepSize;
      heading = calculateBearing(currentLat, currentLng, targetWp[0], targetWp[1]);
    }

    // Dynamic speed flutter (22 - 34 km/h) simulating Bharatpur street traffic
    const speedDrift = (Math.random() - 0.5) * 1.5;
    const speedKmH = Math.min(36, Math.max(18, Math.round(vehicle.speedKmH + speedDrift)));

    // Find next upcoming stop along route
    const nextStopInfo = findNextUpcomingStop(newLat, newLng, route);

    // Fluctuate available seats occasionally
    let seats = vehicle.availableSeats;
    let occupancy: OccupancyStatus = vehicle.occupancy;
    if (Math.random() < 0.08) {
      const change = Math.floor(Math.random() * 3) - 1;
      seats = Math.max(0, Math.min(vehicle.totalSeats, seats + change));
      if (seats === 0) occupancy = 'full';
      else if (seats <= 3) occupancy = 'moderate';
      else occupancy = 'empty';
    }

    return {
      ...vehicle,
      currentLat: newLat,
      currentLng: newLng,
      heading,
      speedKmH,
      availableSeats: seats,
      occupancy,
      direction: currentDirection,
      waypointIndex: currentWpIndex,
      nextStopId: nextStopInfo.stop.id,
      nextStopNameEn: nextStopInfo.stop.nameEn,
      nextStopNameNe: nextStopInfo.stop.nameNe,
      estimatedNextStopSec: Math.max(15, Math.round(nextStopInfo.distanceKm / (speedKmH / 3600))),
      lastUpdated: '1s ago',
    };
  });
}

/**
 * Finds the upcoming stop along the vehicle's direction of travel
 */
function findNextUpcomingStop(lat: number, lng: number, route: TransitRoute): { stop: TransitStop; distanceKm: number } {
  const stops = route.stops;
  let minDistance = Infinity;
  let nextStop = stops[0];

  for (const stop of stops) {
    const dist = calculateDistanceKm(lat, lng, stop.lat, stop.lng);
    // Ignore stops very close behind (under 80 meters)
    if (dist > 0.08 && dist < minDistance) {
      minDistance = dist;
      nextStop = stop;
    }
  }

  return { stop: nextStop, distanceKm: minDistance === Infinity ? 0.3 : minDistance };
}

/**
 * Calculates ETA for a vehicle to reach a target passenger pickup stop
 */
export function estimatePickupArrival(vehicle: MagicVehicle, stop: TransitStop): number {
  const dist = calculateDistanceKm(vehicle.currentLat, vehicle.currentLng, stop.lat, stop.lng);
  const avgSpeedKmPerMin = Math.max(15, vehicle.speedKmH) / 60;
  const minutes = Math.max(1, Math.round(dist / avgSpeedKmPerMin));
  return minutes;
}

/**
 * Converts English number to Nepali numerals
 */
export function toNepaliNumber(num: number | string): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num
    .toString()
    .split('')
    .map((char) => {
      const parsed = parseInt(char, 10);
      return !isNaN(parsed) ? nepaliDigits[parsed] : char;
    })
    .join('');
}
