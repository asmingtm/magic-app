import { TransitStop, TransitRoute, MagicVehicle } from '../types/transit';

export const BHARATPUR_CENTER: [number, number] = [27.6820, 84.4310];

export const TRANSIT_STOPS: TransitStop[] = [
  {
    id: 'stop-pulchowk',
    nameEn: 'Narayangarh Pulchowk',
    nameNe: 'नारायणगढ पुलचोक',
    lat: 27.6938,
    lng: 84.4225,
    landmarkEn: 'Narayani River Bridge, Main Bazaar',
    landmarkNe: 'नारायणी नदी पुल, मुख्य बजार',
    isMajorHub: true,
  },
  {
    id: 'stop-sahidchowk',
    nameEn: 'Sahid Chowk',
    nameNe: 'शहिद चोक',
    lat: 27.6912,
    lng: 84.4258,
    landmarkEn: 'Old Narayangarh Post Office',
    landmarkNe: 'पुरानो हुलाक कार्यालय',
    isMajorHub: false,
  },
  {
    id: 'stop-lionschowk',
    nameEn: 'Lions Chowk',
    nameNe: 'लायन्स चोक',
    lat: 27.6885,
    lng: 84.4288,
    landmarkEn: 'Lions Club Building, Narayangarh Gateway',
    landmarkNe: 'लायन्स क्लब भवन, नारायणगढ प्रवेशद्वार',
    isMajorHub: true,
  },
  {
    id: 'stop-chaubiskothi',
    nameEn: 'Chaubiskothi',
    nameNe: 'चौबिसकोठी',
    lat: 27.6798,
    lng: 84.4350,
    landmarkEn: 'Bharatpur Central Roundabout & Highway Junction',
    landmarkNe: 'भरतपुर मुख्य चोक तथा राजमार्ग जंक्शन',
    isMajorHub: true,
  },
  {
    id: 'stop-hospital',
    nameEn: 'Bharatpur Hospital',
    nameNe: 'भरतपुर अस्पताल',
    lat: 27.6745,
    lng: 84.4340,
    landmarkEn: 'Birendra Multiple Campus & Govt. Hospital',
    landmarkNe: 'वीरेन्द्र बहुमुखी क्याम्पस र सरकारी अस्पताल',
    isMajorHub: true,
  },
  {
    id: 'stop-cmc',
    nameEn: 'Chitwan Medical College (CMC)',
    nameNe: 'चितवन मेडिकल कलेज (सीएमसी)',
    lat: 27.6695,
    lng: 84.4270,
    landmarkEn: 'Teaching Hospital, Kailashnagar',
    landmarkNe: 'शिक्षण अस्पताल, कैलाश नगर',
    isMajorHub: false,
  },
  {
    id: 'stop-hakimchowk',
    nameEn: 'Hakim Chowk',
    nameNe: 'हाकिम चोक',
    lat: 27.6750,
    lng: 84.4420,
    landmarkEn: 'Government Offices, District Administration',
    landmarkNe: 'जिल्ला प्रशासन कार्यालय, सरकारी अड्डा',
    isMajorHub: true,
  },
  {
    id: 'stop-parasbuspark',
    nameEn: 'Central Bus Terminal (Paras Buspark)',
    nameNe: 'केन्द्रीय बस टर्मिनल (पारस बसपार्क)',
    lat: 27.6680,
    lng: 84.4452,
    landmarkEn: 'Long Route Bus Terminal & Highway Node',
    landmarkNe: 'लामो दूरीको बसपार्क तथा राजमार्ग नोड',
    isMajorHub: true,
  },
  {
    id: 'stop-bypass',
    nameEn: 'Bypass Road Junction',
    nameNe: 'बाइपास सडक जंक्शन',
    lat: 27.6855,
    lng: 84.4425,
    landmarkEn: 'Ganesthan Temple Road',
    landmarkNe: 'गणेशथान मन्दिर जाने बाटो',
    isMajorHub: false,
  },
  {
    id: 'stop-aptari',
    nameEn: 'Aptari Chowk',
    nameNe: 'आँपटारी चोक',
    lat: 27.7025,
    lng: 84.4295,
    landmarkEn: 'Mugling Highway entry, Water Tanki',
    landmarkNe: 'मुग्लिन राजमार्ग प्रवेश, खानेपानी ट्याङ्की',
    isMajorHub: true,
  },
  {
    id: 'stop-krishnapur',
    nameEn: 'Krishnapur Chowk',
    nameNe: 'कृष्णपुर चोक',
    lat: 27.6610,
    lng: 84.4375,
    landmarkEn: 'Krishnapur Secondary School',
    landmarkNe: 'कृष्णपुर मा.वि.',
    isMajorHub: false,
  },
  {
    id: 'stop-geetanagar',
    nameEn: 'Geetanagar Chowk',
    nameNe: 'गीतानगर चोक',
    lat: 27.6320,
    lng: 84.4150,
    landmarkEn: 'South Chitwan Bazaar Hub',
    landmarkNe: 'दक्षिणी चितवन बजार केन्द्र',
    isMajorHub: true,
  },
  {
    id: 'stop-mangalpur',
    nameEn: 'Mangalpur Bazaar',
    nameNe: 'मंगलपुर बजार',
    lat: 27.6650,
    lng: 84.3780,
    landmarkEn: 'West Chitwan Commercial Center',
    landmarkNe: 'पश्चिम चितवन व्यापारिक केन्द्र',
    isMajorHub: true,
  },
  {
    id: 'stop-rampur',
    nameEn: 'Rampur Campus (AFU)',
    nameNe: 'रामपुर क्याम्पस (कृषि तथा वन वि.वि.)',
    lat: 27.6490,
    lng: 84.3530,
    landmarkEn: 'Agriculture & Forestry University Main Gate',
    landmarkNe: 'कृषि तथा वन विज्ञान विश्वविद्यालय मुख्य गेट',
    isMajorHub: true,
  },
  {
    id: 'stop-gondrang',
    nameEn: 'Gondrang Chowk',
    nameNe: 'गोन्द्रङ चोक',
    lat: 27.6520,
    lng: 84.4690,
    landmarkEn: 'East Bharatpur Welcome Gate',
    landmarkNe: 'भरतपुर पूर्व स्वागत द्वार',
    isMajorHub: false,
  },
  {
    id: 'stop-tandi',
    nameEn: 'Ratnanagar (Tandi / Sauraha Chowk)',
    nameNe: 'रत्ननगर (टाँडी / सौराहा चोक)',
    lat: 27.6180,
    lng: 84.5150,
    landmarkEn: 'Sauraha Tourism Entrance & Tandi Bazaar',
    landmarkNe: 'सौराहा पर्यटन प्रवेशद्वार तथा टाँडी बजार',
    isMajorHub: true,
  },
  {
    id: 'stop-jagatpur',
    nameEn: 'Jagatpur (Chitwan National Park Gate)',
    nameNe: 'जगतपुर (निकुञ्ज प्रवेशद्वार)',
    lat: 27.5850,
    lng: 84.3980,
    landmarkEn: 'Kasara CNP Headquarters Route',
    landmarkNe: 'कसरा राष्ट्रिय निकुञ्ज मुख्य कार्यालय बाटो',
    isMajorHub: true,
  }
];

export const TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: 'route-1',
    routeNumber: '1',
    nameEn: 'Ring Road Circular (चक्रिय मार्ग)',
    nameNe: 'रिंगरोड चक्रिय मार्ग',
    descriptionEn: 'The busiest circular route connecting Narayangarh, Chaubiskothi, Buspark & Aptari.',
    descriptionNe: 'नारायणगढ, चौबिसकोठी, बसपार्क र आँपटारी जोड्ने सबैभन्दा बढी चल्ने चक्रिय रुट।',
    color: '#0284c7', // Sky Blue
    isCircular: true,
    totalDistanceKm: 11.2,
    avgDurationMins: 32,
    baseFareNpr: 20,
    maxFareNpr: 30,
    stops: [
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-sahidchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-lionschowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-chaubiskothi')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-hakimchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-parasbuspark')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-bypass')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-aptari')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
    ],
    waypoints: [
      [27.6938, 84.4225], // Pulchowk (Narayani Bridge Entry)
      [27.6925, 84.4242], // Main Bazaar Road
      [27.6912, 84.4258], // Sahid Chowk
      [27.6898, 84.4273], // Narayangarh Commercial strip
      [27.6885, 84.4288], // Lions Chowk
      [27.6865, 84.4302], // Bharatpur 4-lane Highway
      [27.6842, 84.4318], // Narayangarh-Bharatpur Highway
      [27.6820, 84.4335], // Towards Chaubiskothi
      [27.6798, 84.4350], // Chaubiskothi Roundabout
      [27.6782, 84.4372], // East-West Highway
      [27.6766, 84.4398], // Approach to Hakim Chowk
      [27.6750, 84.4420], // Hakim Chowk (Admin Node)
      [27.6730, 84.4428], // Central Bus Terminal Road
      [27.6705, 84.4438], // Bus Terminal approach
      [27.6680, 84.4452], // Paras Buspark (Central Terminal)
      [27.6710, 84.4450], // Ring Road East
      [27.6750, 84.4445], // Ring Road East corridor
      [27.6800, 84.4438], // Bypass road heading north
      [27.6855, 84.4425], // Bypass Road Junction (Ganesthan road)
      [27.6900, 84.4402], // North Bypass Road
      [27.6945, 84.4365], // Bypass Road Curve
      [27.6985, 84.4330], // Towards Aptari
      [27.7025, 84.4295], // Aptari Chowk (Mugling Highway entry)
      [27.7005, 84.4275], // Narayangarh Bypass road downhill
      [27.6980, 84.4255], // Riverfront road
      [27.6958, 84.4238], // Narayangarh bridge approach
      [27.6938, 84.4225], // Return to Pulchowk (Loop complete)
    ]
  },
  {
    id: 'route-2',
    routeNumber: '2',
    nameEn: 'Pulchowk - Hospital - CMC - Geetanagar',
    nameNe: 'पुलचोक - अस्पताल - सीएमसी - गीतानगर',
    descriptionEn: 'Major medical and residential corridor serving Bharatpur Hospital, CMC & Geetanagar.',
    descriptionNe: 'भरतपुर अस्पताल, सीएमसी शिक्षण अस्पताल र गीतानगर जोड्ने मुख्य रुट।',
    color: '#16a34a', // Emerald Green
    isCircular: false,
    totalDistanceKm: 13.5,
    avgDurationMins: 38,
    baseFareNpr: 20,
    maxFareNpr: 35,
    stops: [
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-lionschowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-chaubiskothi')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-hospital')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-cmc')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-krishnapur')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-geetanagar')!,
    ],
    waypoints: [
      [27.6938, 84.4225], // Pulchowk
      [27.6912, 84.4258], // Sahid Chowk
      [27.6885, 84.4288], // Lions Chowk
      [27.6842, 84.4318], // Highway
      [27.6798, 84.4350], // Chaubiskothi
      [27.6775, 84.4346], // Hospital Road turn
      [27.6745, 84.4340], // Bharatpur Hospital
      [27.6720, 84.4310], // Link road to CMC
      [27.6695, 84.4270], // CMC Teaching Hospital
      [27.6655, 84.4315], // Krishnapur Link
      [27.6610, 84.4375], // Krishnapur Chowk
      [27.6530, 84.4310], // South Chitwan Highway
      [27.6440, 84.4240], // Ujjan Road
      [27.6380, 84.4190], // Geetanagar approach
      [27.6320, 84.4150], // Geetanagar Chowk
    ]
  },
  {
    id: 'route-3',
    routeNumber: '3',
    nameEn: 'Pulchowk - Mangalpur - Rampur (AFU)',
    nameNe: 'पुलचोक - मंगलपुर - रामपुर (कृषि क्याम्पस)',
    descriptionEn: 'The student and western farming belt route to Agriculture & Forestry University.',
    descriptionNe: 'विद्यार्थी र पश्चिम चितवनवासीका लागि रामपुर कृषि विश्वविद्यालय रुट।',
    color: '#d97706', // Amber
    isCircular: false,
    totalDistanceKm: 12.8,
    avgDurationMins: 35,
    baseFareNpr: 25,
    maxFareNpr: 40,
    stops: [
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-sahidchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-mangalpur')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-rampur')!,
    ],
    waypoints: [
      [27.6938, 84.4225], // Pulchowk
      [27.6912, 84.4258], // Sahid Chowk
      [27.6870, 84.4210], // Riverbank West road
      [27.6820, 84.4120], // Toward Mangalpur Road
      [27.6770, 84.4020], // Belchok Road
      [27.6710, 84.3900], // Shivalaya Road
      [27.6650, 84.3780], // Mangalpur Bazaar
      [27.6600, 84.3680], // Rampur link
      [27.6550, 84.3600], // Campus avenue
      [27.6490, 84.3530], // Rampur AFU Main Gate
    ]
  },
  {
    id: 'route-4',
    routeNumber: '4',
    nameEn: 'Narayangarh - Chaubiskothi - Tandi (Ratnanagar)',
    nameNe: 'नारायणगढ - चौबिसकोठी - टाँडी (रत्ननगर)',
    descriptionEn: 'East-West highway link through Tikoli forest to Sauraha entrance / Ratnanagar.',
    descriptionNe: 'टिकौली जंगल हुँदै सौराहा प्रवेशद्वार रत्ननगर (टाँडी) जोड्ने द्रुत राजमार्ग रुट।',
    color: '#7c3aed', // Purple
    isCircular: false,
    totalDistanceKm: 17.5,
    avgDurationMins: 42,
    baseFareNpr: 30,
    maxFareNpr: 50,
    stops: [
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-lionschowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-chaubiskothi')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-parasbuspark')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-gondrang')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-tandi')!,
    ],
    waypoints: [
      [27.6938, 84.4225], // Pulchowk
      [27.6885, 84.4288], // Lions Chowk
      [27.6798, 84.4350], // Chaubiskothi
      [27.6750, 84.4420], // Hakim Chowk
      [27.6680, 84.4452], // Paras Buspark
      [27.6600, 84.4560], // Highway East
      [27.6520, 84.4690], // Gondrang Chowk
      [27.6440, 84.4810], // Tikoli Forest Entry
      [27.6360, 84.4920], // Tikoli Mid-Corridor
      [27.6280, 84.5030], // Ratnanagar border
      [27.6180, 84.5150], // Tandi / Sauraha Chowk
    ]
  },
  {
    id: 'route-5',
    routeNumber: '5',
    nameEn: 'Pulchowk - Geetanagar - Jagatpur (Kasara)',
    nameNe: 'पुलचोक - गीतानगर - जगतपुर (कसरा)',
    descriptionEn: 'Deep south Chitwan route serving national park gateway and rural ecotourism.',
    descriptionNe: 'चितवन राष्ट्रिय निकुञ्ज कसरा प्रवेशद्वार तथा जगतपुर जोड्ने दक्षिणी रुट।',
    color: '#e11d48', // Rose
    isCircular: false,
    totalDistanceKm: 21.0,
    avgDurationMins: 50,
    baseFareNpr: 35,
    maxFareNpr: 60,
    stops: [
      TRANSIT_STOPS.find(s => s.id === 'stop-pulchowk')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-chaubiskothi')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-geetanagar')!,
      TRANSIT_STOPS.find(s => s.id === 'stop-jagatpur')!,
    ],
    waypoints: [
      [27.6938, 84.4225], // Pulchowk
      [27.6885, 84.4288], // Lions Chowk
      [27.6798, 84.4350], // Chaubiskothi
      [27.6530, 84.4310], // Southward highway
      [27.6320, 84.4150], // Geetanagar Chowk
      [27.6200, 84.4100], // Patihani Road
      [27.6080, 84.4050], // Patihani Bazaar
      [27.5950, 84.4010], // Approach to Kasara
      [27.5850, 84.3980], // Jagatpur (CNP Headquarters Gate)
    ]
  }
];

export const INITIAL_MAGIC_VEHICLES: MagicVehicle[] = [
  {
    id: 'magic-101',
    plateNumber: 'ना १ ज २४५८',
    driverName: 'Ram Bahadur Gurung (रामबहादुर)',
    routeId: 'route-1',
    routeNumber: '1',
    currentLat: 27.6885,
    currentLng: 84.4288,
    heading: 145,
    speedKmH: 26,
    occupancy: 'moderate',
    availableSeats: 3,
    totalSeats: 10,
    currentStopIndex: 2,
    nextStopId: 'stop-chaubiskothi',
    nextStopNameEn: 'Chaubiskothi',
    nextStopNameNe: 'चौबिसकोठी',
    estimatedNextStopSec: 140,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-102',
    plateNumber: 'ना १ ज ५१२४',
    driverName: 'Bikash Thapa (विकास थापा)',
    routeId: 'route-1',
    routeNumber: '1',
    currentLat: 27.6720,
    currentLng: 84.4440,
    heading: 320,
    speedKmH: 29,
    occupancy: 'empty',
    availableSeats: 7,
    totalSeats: 10,
    currentStopIndex: 5,
    nextStopId: 'stop-bypass',
    nextStopNameEn: 'Bypass Road Junction',
    nextStopNameNe: 'बाइपास सडक जंक्शन',
    estimatedNextStopSec: 210,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-103',
    plateNumber: 'ना २ ज ७८१२',
    driverName: 'Suresh Adhikari (सुरेश अधिकारी)',
    routeId: 'route-1',
    routeNumber: '1',
    currentLat: 27.7010,
    currentLng: 84.4300,
    heading: 220,
    speedKmH: 32,
    occupancy: 'full',
    availableSeats: 0,
    totalSeats: 10,
    currentStopIndex: 7,
    nextStopId: 'stop-pulchowk',
    nextStopNameEn: 'Narayangarh Pulchowk',
    nextStopNameNe: 'नारायणगढ पुलचोक',
    estimatedNextStopSec: 90,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-104',
    plateNumber: 'बा १ ज ९०११',
    driverName: 'Prakash Pandey (प्रकाश पाण्डे)',
    routeId: 'route-1',
    routeNumber: '1',
    currentLat: 27.6930,
    currentLng: 84.4235,
    heading: 135,
    speedKmH: 25,
    occupancy: 'moderate',
    availableSeats: 4,
    totalSeats: 10,
    currentStopIndex: 0,
    nextStopId: 'stop-sahidchowk',
    nextStopNameEn: 'Sahid Chowk',
    nextStopNameNe: 'शहिद चोक',
    estimatedNextStopSec: 80,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-105',
    plateNumber: 'ना १ ज ६३३४',
    driverName: 'Nirajan Gautam (निरञ्जन गौतम)',
    routeId: 'route-1',
    routeNumber: '1',
    currentLat: 27.6820,
    currentLng: 84.4335,
    heading: 140,
    speedKmH: 28,
    occupancy: 'empty',
    availableSeats: 8,
    totalSeats: 10,
    currentStopIndex: 3,
    nextStopId: 'stop-hakimchowk',
    nextStopNameEn: 'Hakim Chowk',
    nextStopNameNe: 'हाकिम चोक',
    estimatedNextStopSec: 120,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-201',
    plateNumber: 'बा १ ज ३३९०',
    driverName: 'Dinesh Shrestha (दिनेश श्रेष्ठ)',
    routeId: 'route-2',
    routeNumber: '2',
    currentLat: 27.6770,
    currentLng: 84.4345,
    heading: 180,
    speedKmH: 24,
    occupancy: 'moderate',
    availableSeats: 4,
    totalSeats: 10,
    currentStopIndex: 2,
    nextStopId: 'stop-hospital',
    nextStopNameEn: 'Bharatpur Hospital',
    nextStopNameNe: 'भरतपुर अस्पताल',
    estimatedNextStopSec: 75,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-202',
    plateNumber: 'ना १ ज ९४११',
    driverName: 'Santosh Chaudhary (सन्तोष चौधरी)',
    routeId: 'route-2',
    routeNumber: '2',
    currentLat: 27.6480,
    currentLng: 84.4230,
    heading: 200,
    speedKmH: 34,
    occupancy: 'empty',
    availableSeats: 6,
    totalSeats: 10,
    currentStopIndex: 5,
    nextStopId: 'stop-geetanagar',
    nextStopNameEn: 'Geetanagar Chowk',
    nextStopNameNe: 'गीतानगर चोक',
    estimatedNextStopSec: 180,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-203',
    plateNumber: 'ना २ ज १५५०',
    driverName: 'Mohan Kafle (मोहन काफ्ले)',
    routeId: 'route-2',
    routeNumber: '2',
    currentLat: 27.6690,
    currentLng: 84.4280,
    heading: 160,
    speedKmH: 27,
    occupancy: 'moderate',
    availableSeats: 3,
    totalSeats: 10,
    currentStopIndex: 4,
    nextStopId: 'stop-krishnapur',
    nextStopNameEn: 'Krishnapur Chowk',
    nextStopNameNe: 'कृष्णपुर चोक',
    estimatedNextStopSec: 110,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-301',
    plateNumber: 'ना १ ज १८२९',
    driverName: 'Kiran Mahato (किरण महतो)',
    routeId: 'route-3',
    routeNumber: '3',
    currentLat: 27.6710,
    currentLng: 84.3890,
    heading: 240,
    speedKmH: 31,
    occupancy: 'moderate',
    availableSeats: 2,
    totalSeats: 10,
    currentStopIndex: 2,
    nextStopId: 'stop-mangalpur',
    nextStopNameEn: 'Mangalpur Bazaar',
    nextStopNameNe: 'मंगलपुर बजार',
    estimatedNextStopSec: 130,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-302',
    plateNumber: 'बा ३ ज ४४८०',
    driverName: 'Bijay Aryal (विजय अर्याल)',
    routeId: 'route-3',
    routeNumber: '3',
    currentLat: 27.6530,
    currentLng: 84.3600,
    heading: 230,
    speedKmH: 33,
    occupancy: 'full',
    availableSeats: 0,
    totalSeats: 10,
    currentStopIndex: 3,
    nextStopId: 'stop-rampur',
    nextStopNameEn: 'Rampur Campus (AFU)',
    nextStopNameNe: 'रामपुर क्याम्पस (कृषि क्याम्पस)',
    estimatedNextStopSec: 60,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-401',
    plateNumber: 'बा २ ज ८९४४',
    driverName: 'Prem Giri (प्रेम गिरी)',
    routeId: 'route-4',
    routeNumber: '4',
    currentLat: 27.6420,
    currentLng: 84.4820,
    heading: 120,
    speedKmH: 38,
    occupancy: 'full',
    availableSeats: 1,
    totalSeats: 10,
    currentStopIndex: 4,
    nextStopId: 'stop-tandi',
    nextStopNameEn: 'Ratnanagar (Tandi / Sauraha Chowk)',
    nextStopNameNe: 'रत्ननगर (टाँडी / सौराहा चोक)',
    estimatedNextStopSec: 240,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-402',
    plateNumber: 'ना १ ज ७०२२',
    driverName: 'Raju Danuwar (राजु दनुवार)',
    routeId: 'route-4',
    routeNumber: '4',
    currentLat: 27.6600,
    currentLng: 84.4550,
    heading: 110,
    speedKmH: 35,
    occupancy: 'empty',
    availableSeats: 9,
    totalSeats: 10,
    currentStopIndex: 3,
    nextStopId: 'stop-gondrang',
    nextStopNameEn: 'Gondrang Chowk',
    nextStopNameNe: 'गोन्द्रङ चोक',
    estimatedNextStopSec: 150,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-501',
    plateNumber: 'ना १ ज ४१५५',
    driverName: 'Dipendra Regmi (दिपेन्द्र रेग्मी)',
    routeId: 'route-5',
    routeNumber: '5',
    currentLat: 27.6010,
    currentLng: 84.4010,
    heading: 195,
    speedKmH: 30,
    occupancy: 'moderate',
    availableSeats: 5,
    totalSeats: 10,
    currentStopIndex: 2,
    nextStopId: 'stop-jagatpur',
    nextStopNameEn: 'Jagatpur (CNP Gate)',
    nextStopNameNe: 'जगतपुर (निकुञ्ज प्रवेशद्वार)',
    estimatedNextStopSec: 160,
    lastUpdated: 'Just now',
  },
  {
    id: 'magic-502',
    plateNumber: 'ना २ ज ५८९१',
    driverName: 'Kamal Pariyar (कमल परियार)',
    routeId: 'route-5',
    routeNumber: '5',
    currentLat: 27.6250,
    currentLng: 84.4120,
    heading: 190,
    speedKmH: 32,
    occupancy: 'empty',
    availableSeats: 7,
    totalSeats: 10,
    currentStopIndex: 1,
    nextStopId: 'stop-geetanagar',
    nextStopNameEn: 'Geetanagar Chowk',
    nextStopNameNe: 'गीतानगर चोक',
    estimatedNextStopSec: 110,
    lastUpdated: 'Just now',
  }
];
