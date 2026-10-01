import React, { useState, useMemo } from 'react';
import { TransitStop, TransitRoute, Language } from '../types/transit';
import { calculateDistanceKm, toNepaliNumber } from '../services/gpsSimulator';
import { 
  RiCloseLine, 
  RiCalculatorLine, 
  RiShieldCheckLine, 
  RiGraduationCapLine, 
  RiInformationLine 
} from 'react-icons/ri';
import { CustomSelect } from './CustomSelect';

interface FareCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  stops: TransitStop[];
  routes: TransitRoute[];
  language: Language;
}

export const FareCalculatorModal: React.FC<FareCalculatorModalProps> = ({
  isOpen,
  onClose,
  stops,
  routes,
  language,
}) => {
  const [fromStopId, setFromStopId] = useState<string>('stop-pulchowk');
  const [toStopId, setToStopId] = useState<string>('stop-hospital');
  const [isStudent, setIsStudent] = useState<boolean>(false);

  if (!isOpen) return null;

  const fromStop = stops.find((s) => s.id === fromStopId) || stops[0];
  const toStop = stops.find((s) => s.id === toStopId) || stops[1];

  const stopOptions = useMemo(() => {
    return stops.map((s) => ({
      value: s.id,
      label: language === 'ne' ? s.nameNe : s.nameEn,
      sublabel: language === 'ne' ? s.landmarkNe : s.landmarkEn,
      badge: s.isMajorHub ? (language === 'ne' ? 'हब' : 'Hub') : undefined,
      badgeColor: s.isMajorHub ? '#2563eb' : undefined,
    }));
  }, [stops, language]);

  const straightDist = calculateDistanceKm(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
  const roadDist = Math.max(1.0, Number((straightDist * 1.25).toFixed(1)));

  // Official Chitwan fare structure: Minimum Rs. 20 (up to 3km), then Rs. 3 per km
  const baseRate = 20;
  const rawFare = Math.min(65, Math.max(20, Math.round(baseRate + Math.max(0, roadDist - 3) * 3)));
  const finalFare = isStudent ? Math.round(rawFare * 0.55) : rawFare;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1e1f20] rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden my-8 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <RiCalculatorLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {language === 'ne' ? 'चितवन भरतपुर म्याजिक भाडा क्यालकुलेटर' : 'Bharatpur Magic Fare Calculator'}
              </h3>
              <p className="text-[11px] text-gray-400">
                {language === 'ne' ? 'भरतपुर महानगरपालिका आधिकारिक भाडा दर' : 'Official Bharatpur Metropolitan Transit Rates'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Interactive Calculator Box */}
          <div className="bg-gray-50 dark:bg-neutral-900 p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  {language === 'ne' ? 'शुरुवाती चोक:' : 'Boarding Stop:'}
                </label>
                <CustomSelect
                  value={fromStopId}
                  onChange={setFromStopId}
                  options={stopOptions}
                  searchable={true}
                  searchPlaceholder={language === 'ne' ? 'चोक खोज्नुहोस्...' : 'Search stop...'}
                  ariaLabel={language === 'ne' ? 'शुरुवाती चोक' : 'Boarding stop'}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                  {language === 'ne' ? 'गन्तव्य चोक:' : 'Drop-off Stop:'}
                </label>
                <CustomSelect
                  value={toStopId}
                  onChange={setToStopId}
                  options={stopOptions}
                  searchable={true}
                  searchPlaceholder={language === 'ne' ? 'चोक खोज्नुहोस्...' : 'Search stop...'}
                  ariaLabel={language === 'ne' ? 'गन्तव्य चोक' : 'Drop-off stop'}
                />
              </div>
            </div>

            {/* Student Discount Toggle */}
            <label className="flex items-center gap-3 p-3 bg-white dark:bg-[#1e1f20] rounded-xl border border-gray-200 dark:border-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <RiGraduationCapLine className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  {language === 'ne' ? 'विद्यार्थी परिचय पत्र (४५% छुट)' : 'Student / Senior Concession (45% Off)'}
                </span>
              </div>
            </label>

            {/* Result Display */}
            <div className="p-4 bg-neutral-900 dark:bg-neutral-950 text-white rounded-xl flex items-center justify-between border border-neutral-800">
              <div>
                <span className="text-[10px] uppercase text-gray-400 font-semibold block">
                  {language === 'ne' ? 'तोकिएको आधिकारिक भाडा' : 'Official Regulated Fare'}
                </span>
                <span className="text-xs text-gray-300">
                  {language === 'ne' ? `दूरी: ~${toNepaliNumber(roadDist)} कि.मी.` : `Highway Distance: ~${roadDist} km`}
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-blue-400">
                  Rs. {language === 'ne' ? toNepaliNumber(finalFare) : finalFare}
                </span>
                {isStudent && (
                  <span className="text-[10px] text-emerald-400 block font-medium">
                    (Standard: Rs. {rawFare})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Standard Route Fare Chart */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <RiInformationLine className="w-3.5 h-3.5 text-gray-400" />
              <span>{language === 'ne' ? 'प्रमुख रुटहरूको भाडा तालिका' : 'Standard Magic Route Tariffs'}</span>
            </h4>

            <div className="border border-gray-200 dark:border-neutral-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2.5">{language === 'ne' ? 'रुट' : 'Route'}</th>
                    <th className="p-2.5">{language === 'ne' ? 'दूरी' : 'Distance'}</th>
                    <th className="p-2.5">{language === 'ne' ? 'साधारण' : 'Standard'}</th>
                    <th className="p-2.5 text-emerald-700 dark:text-emerald-400">{language === 'ne' ? 'विद्यार्थी' : 'Student'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {routes.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-neutral-900/60">
                      <td className="p-2.5 font-semibold">
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-white mr-1.5 font-bold" style={{ backgroundColor: r.color }}>
                          R{r.routeNumber}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">{language === 'ne' ? r.nameNe : r.nameEn}</span>
                      </td>
                      <td className="p-2.5 text-gray-600 dark:text-gray-400">{r.totalDistanceKm} km</td>
                      <td className="p-2.5 font-semibold text-gray-900 dark:text-gray-100">Rs. {r.baseFareNpr} - {r.maxFareNpr}</td>
                      <td className="p-2.5 font-semibold text-emerald-700 dark:text-emerald-400">
                        Rs. {Math.round(r.baseFareNpr * 0.55)} - {Math.round(r.maxFareNpr * 0.55)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & Transparency Guarantee */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200/80 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <RiShieldCheckLine className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="font-medium">
              {language === 'ne'
                ? 'आधिकारिक नियम: तोकिएको दर मात्र मान्य। विद्यार्थी तथा ज्येष्ठ नागरिकलाई ४५% छुट अनिवार्य।'
                : 'Official: Fixed rates only. Mandatory 45% discount for students & seniors.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
