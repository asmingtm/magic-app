import React, { useState } from 'react';
import { TransitStop, TransitRoute, Language } from '../types/transit';
import { calculateDistanceKm, toNepaliNumber } from '../services/gpsSimulator';
import { Calculator, ShieldCheck, GraduationCap, Info } from 'lucide-react';

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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'ne' ? 'चितवन भरतपुर म्याजिक भाडा दर' : 'Bharatpur Magic Fare Calculator'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ne' ? 'भरतपुर महानगरपालिका आधिकारिक भाडा दर र छुट तालिका' : 'Official regulated transit rates & concession matrix for Chitwan district.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Calculator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {language === 'ne' ? 'शुरुवाती चोक:' : 'Boarding Stop:'}
            </label>
            <select
              value={fromStopId}
              onChange={(e) => setFromStopId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {stops.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'ne' ? s.nameNe : s.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {language === 'ne' ? 'गन्तव्य चोक:' : 'Drop-off Stop:'}
            </label>
            <select
              value={toStopId}
              onChange={(e) => setToStopId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
        <label className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {language === 'ne' ? 'विद्यार्थी परिचय पत्र (४५% छुट)' : 'Student / Senior Concession (45% Discount)'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ne' ? 'नेपाल सरकार यातायात नियमावली बमोजिम' : 'Under Ministry of Transport regulations'}
              </span>
            </div>
          </div>
        </label>

        {/* Result Display */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">
              {language === 'ne' ? 'तोकिएको आधिकारिक भाडा' : 'Official Regulated Fare'}
            </span>
            <span className="text-xs text-slate-300">
              {language === 'ne' ? `दूरी: ~${toNepaliNumber(roadDist)} कि.मी.` : `Road Distance: ~${roadDist} km`}
            </span>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-amber-400">
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          <span>{language === 'ne' ? 'भरतपुरका सबै रुटहरूको भाडा तालिका' : 'Bharatpur Magic Route Tariffs'}</span>
        </h3>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
              <tr>
                <th className="p-3">{language === 'ne' ? 'रुट' : 'Route'}</th>
                <th className="p-3">{language === 'ne' ? 'दूरी' : 'Distance'}</th>
                <th className="p-3">{language === 'ne' ? 'साधारण' : 'Standard'}</th>
                <th className="p-3 text-emerald-700 dark:text-emerald-400">{language === 'ne' ? 'विद्यार्थी' : 'Student (45% off)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {routes.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold">
                    <span className="px-1.5 py-0.5 rounded text-[10px] text-white mr-1.5" style={{ backgroundColor: r.color }}>
                      R{r.routeNumber}
                    </span>
                    <span className="text-slate-900 dark:text-white">{language === 'ne' ? r.nameNe : r.nameEn}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{r.totalDistanceKm} km</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Rs. {r.baseFareNpr} - {r.maxFareNpr}</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                    Rs. {Math.round(r.baseFareNpr * 0.55)} - {Math.round(r.maxFareNpr * 0.55)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
  );
};
