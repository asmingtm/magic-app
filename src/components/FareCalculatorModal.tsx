import React, { useState } from 'react';
import { TransitStop, TransitRoute, Language } from '../types/transit';
import { calculateDistanceKm, toNepaliNumber } from '../services/gpsSimulator';
import { X, Calculator, ShieldCheck, GraduationCap, Info } from 'lucide-react';

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

  const straightDist = calculateDistanceKm(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng);
  const roadDist = Math.max(1.0, Number((straightDist * 1.25).toFixed(1)));

  // Official Chitwan fare structure: Minimum Rs. 20 (up to 3km), then Rs. 3 per km
  const baseRate = 20;
  const rawFare = Math.min(65, Math.max(20, Math.round(baseRate + Math.max(0, roadDist - 3) * 3)));
  const finalFare = isStudent ? Math.round(rawFare * 0.55) : rawFare;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base">
                {language === 'ne' ? 'चितवन भरतपुर म्याजिक भाडा क्यालकुलेटर' : 'Bharatpur Magic Fare Calculator'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ne' ? 'भरतपुर महानगरपालिका आधिकारिक भाडा दर' : 'Official Bharatpur Metropolitan Transit Rates'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Interactive Calculator Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ne' ? 'शुरुवाती चोक:' : 'Boarding Stop:'}
                </label>
                <select
                  value={fromStopId}
                  onChange={(e) => setFromStopId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {stops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {language === 'ne' ? s.nameNe : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {language === 'ne' ? 'गन्तव्य चोक:' : 'Drop-off Stop:'}
                </label>
                <select
                  value={toStopId}
                  onChange={(e) => setToStopId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isStudent}
                onChange={(e) => setIsStudent(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
              />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">
                  {language === 'ne' ? 'विद्यार्थी परिचय पत्र (४५% छुट)' : 'Student / Senior Concession (45% Off)'}
                </span>
              </div>
            </label>

            {/* Result Display */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold block">
                  {language === 'ne' ? 'तोकिएको आधिकारिक भाडा' : 'Official Regulated Fare'}
                </span>
                <span className="text-xs text-slate-300">
                  {language === 'ne' ? `दूरी: ~${toNepaliNumber(roadDist)} कि.मी.` : `Distance: ~${roadDist} km`}
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">
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
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'ne' ? 'प्रमुख रुटहरूको भाडा तालिका' : 'Standard Magic Route Tariffs'}</span>
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5">{language === 'ne' ? 'रुट' : 'Route'}</th>
                    <th className="p-2.5">{language === 'ne' ? 'दूरी' : 'Distance'}</th>
                    <th className="p-2.5">{language === 'ne' ? 'साधारण' : 'Standard'}</th>
                    <th className="p-2.5 text-emerald-700">{language === 'ne' ? 'विद्यार्थी' : 'Student'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {routes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold">
                        <span className="px-1.5 py-0.5 rounded text-[10px] text-white mr-1.5" style={{ backgroundColor: r.color }}>
                          R{r.routeNumber}
                        </span>
                        <span>{language === 'ne' ? r.nameNe : r.nameEn}</span>
                      </td>
                      <td className="p-2.5 text-slate-600">{r.totalDistanceKm} km</td>
                      <td className="p-2.5 font-bold text-slate-900">Rs. {r.baseFareNpr} - {r.maxFareNpr}</td>
                      <td className="p-2.5 font-bold text-emerald-700">
                        Rs. {Math.round(r.baseFareNpr * 0.55)} - {Math.round(r.maxFareNpr * 0.55)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & Transparency Guarantee */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {language === 'ne' ? 'चितवन यातायात नियम र पारदर्शिता:' : 'Chitwan Transport Regulations:'}
              </span>
              <span>
                {language === 'ne'
                  ? 'कुनै पनि चालकले तोकिएको भन्दा बढी भाडा लिन पाइँदैन। विद्यार्थी तथा जेष्ठ नागरिक परिचय पत्र देखाएमा अनिवार्य ४५% छुट उपलब्ध गराउनुपर्छ।'
                  : 'Fares are strictly regulated by District Transport Management Committee. 45% discount is legally mandatory with valid student/senior cards.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
