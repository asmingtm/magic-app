import React, { useState } from 'react';
import { TransitStop, TransitRoute, Language } from '../types/transit';
import { calculateDistanceKm, toNepaliNumber } from '../services/gpsSimulator';
import { 
  RiCalculatorLine, 
  RiShieldCheckLine, 
  RiGraduationCapLine, 
  RiInformationLine 
} from 'react-icons/ri';

interface FaresPageProps {
  stops: TransitStop[];
  routes: TransitRoute[];
  language: Language;
}

export const FaresPage: React.FC<FaresPageProps> = ({
  stops,
  routes,
  language,
}) => {
  const [fromStopId, setFromStopId] = useState<string>('stop-pulchowk');
  const [toStopId, setToStopId] = useState<string>('stop-hospital');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  const fromStop = stops.find((s) => s.id === fromStopId) || stops[0];
  const toStop = stops.find((s) => s.id === toStopId) || stops[1];

  const straightDist = calculateDistanceKm(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
  const roadDist = Math.max(1.0, Number((straightDist * 1.25).toFixed(1)));

  // Official Chitwan fare structure: Minimum Rs. 20 (up to 3km), then Rs. 3 per km
  const baseRate = 20;
  const rawFare = Math.min(65, Math.max(20, Math.round(baseRate + Math.max(0, roadDist - 3) * 3)));
  const finalFare = isStudent ? Math.round(rawFare * 0.55) : rawFare;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <RiCalculatorLine className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {language === 'ne' ? 'चितवन भरतपुर म्याजिक भाडा दर' : 'Bharatpur Magic Fare Calculator'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {language === 'ne' ? 'आधिकारिक भाडा दर र ४५% विद्यार्थी छुट तालिका' : 'Regulated transit rates & 45% student concession'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              {language === 'ne' ? 'शुरुवाती चोक:' : 'Boarding Stop:'}
            </label>
            <select
              value={fromStopId}
              onChange={(e) => setFromStopId(e.target.value)}
              className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ne' ? s.nameNe : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              {language === 'ne' ? 'गन्तव्य चोक:' : 'Drop-off Stop:'}
            </label>
            <select
              value={toStopId}
              onChange={(e) => setToStopId(e.target.value)}
              className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ne' ? s.nameNe : s.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Discount Toggle */}
        <label className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <RiGraduationCapLine className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                {language === 'ne' ? 'विद्यार्थी परिचय पत्र (४५% छुट)' : 'Student / Senior Concession (45% Discount)'}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'ne' ? 'नेपाल सरकार यातायात नियमावली बमोजिम' : 'Under Ministry of Transport regulations'}
              </span>
            </div>
          </div>
        </label>

        {/* Result Display */}
        <div className="p-5 bg-neutral-900 dark:bg-neutral-950 text-white rounded-2xl flex items-center justify-between shadow-sm border border-neutral-800">
          <div>
            <span className="text-[10px] uppercase text-gray-400 font-semibold block">
              {language === 'ne' ? 'तोकिएको आधिकारिक भाडा' : 'Official Regulated Fare'}
            </span>
            <span className="text-xs text-gray-300">
              {language === 'ne' ? `दूरी: ~${toNepaliNumber(roadDist)} कि.मी.` : `Highway Distance: ~${roadDist} km`}
            </span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-bold text-blue-400">
              Rs. {language === 'ne' ? toNepaliNumber(finalFare) : finalFare}
            </span>
            {isStudent && (
              <span className="text-[11px] text-emerald-400 block font-medium">
                (Standard: Rs. {rawFare})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Standard Tariffs Table */}
      <div className="bg-white dark:bg-[#1e1f20] rounded-2xl p-6 border border-gray-200 dark:border-neutral-800 shadow-xs transition-colors space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 uppercase tracking-wider flex items-center gap-2">
          <RiInformationLine className="w-4 h-4 text-gray-400" />
          <span>{language === 'ne' ? 'भरतपुरका सबै रुटहरूको भाडा तालिका' : 'Bharatpur Magic Route Tariffs'}</span>
        </h3>

        <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 font-semibold text-[11px]">
              <tr>
                <th className="p-3">{language === 'ne' ? 'रुट' : 'Route'}</th>
                <th className="p-3">{language === 'ne' ? 'दूरी' : 'Distance'}</th>
                <th className="p-3">{language === 'ne' ? 'साधारण' : 'Standard'}</th>
                <th className="p-3 text-emerald-700 dark:text-emerald-400">{language === 'ne' ? 'विद्यार्थी' : 'Student (45% off)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {routes.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-neutral-900/60">
                  <td className="p-3 font-semibold">
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-white mr-1.5 font-bold" style={{ backgroundColor: r.color }}>
                      R{r.routeNumber}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">{language === 'ne' ? r.nameNe : r.nameEn}</span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{r.totalDistanceKm} km</td>
                  <td className="p-3 font-semibold text-gray-900 dark:text-gray-100">Rs. {r.baseFareNpr} - {r.maxFareNpr}</td>
                  <td className="p-3 font-semibold text-emerald-700 dark:text-emerald-400">
                    Rs. {Math.round(r.baseFareNpr * 0.55)} - {Math.round(r.maxFareNpr * 0.55)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
          <RiShieldCheckLine className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-medium">
            {language === 'ne'
              ? 'आधिकारिक नियम: तोकिएको दर मात्र मान्य। विद्यार्थी तथा ज्येष्ठ नागरिकलाई ४५% छुट अनिवार्य।'
              : 'Official: Fixed rates only. Mandatory 45% discount for students & seniors with ID.'}
          </span>
        </div>
      </div>
    </div>
  );
};
