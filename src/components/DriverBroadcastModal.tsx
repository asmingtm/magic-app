import React, { useState } from 'react';
import { MagicVehicle, TransitRoute, Language, OccupancyStatus } from '../types/transit';
import { Radio, X, CheckCircle2, AlertTriangle, Shield, Smartphone, Power } from 'lucide-react';

interface DriverBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: TransitRoute[];
  vehicles: MagicVehicle[];
  language: Language;
  onToggleDriverBroadcast: (vehicleId: string, isBroadcasting: boolean, occupancy: OccupancyStatus, availableSeats: number) => void;
  isDriverBroadcasting: boolean;
}

export const DriverBroadcastModal: React.FC<DriverBroadcastModalProps> = ({
  isOpen,
  onClose,
  routes,
  vehicles,
  language,
  onToggleDriverBroadcast,
  isDriverBroadcasting,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || 'magic-101');
  const [selectedOccupancy, setSelectedOccupancy] = useState<OccupancyStatus>('moderate');
  const [availableSeats, setAvailableSeats] = useState<number>(4);
  const [broadcastMethod, setBroadcastMethod] = useState<'device' | 'simulated'>('simulated');
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const currentRoute = routes.find((r) => r.id === currentVehicle?.routeId);

  const handleStartBroadcast = () => {
    if (broadcastMethod === 'device' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setStatusMessage(
            language === 'ne'
              ? 'तपाईंको फोनको जीपीएस सक्रिय भयो र नक्सामा प्रसारण भइरहेको छ!'
              : 'Device GPS hooked! Location is now broadcasting live on Chitwan map.'
          );
          onToggleDriverBroadcast(selectedVehicleId, true, selectedOccupancy, availableSeats);
        },
        () => {
          setStatusMessage(
            language === 'ne'
              ? 'जीपीएस अनुमति नपाएकोले सिमुलेटेड मोडमा प्रसारण गरियो।'
              : 'GPS permission denied. Switched to simulated real-time mode.'
          );
          onToggleDriverBroadcast(selectedVehicleId, true, selectedOccupancy, availableSeats);
        }
      );
    } else {
      setStatusMessage(
        language === 'ne'
          ? 'सिमुलेटेड रुट प्रसारण सफलतापूर्वक शुरु भयो।'
          : 'Simulated Route GPS broadcast started successfully!'
      );
      onToggleDriverBroadcast(selectedVehicleId, true, selectedOccupancy, availableSeats);
    }
  };

  const handleStopBroadcast = () => {
    onToggleDriverBroadcast(selectedVehicleId, false, selectedOccupancy, availableSeats);
    setStatusMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-base">
                {language === 'ne' ? 'चालक जीपीएस प्रसारण मोड' : 'Magic Driver Broadcast Portal'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'ne' ? 'भरतपुर म्याजिक चालक कन्सोल' : 'Bharatpur Magic Driver Console'}
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Status Alert if broadcasting */}
          {isDriverBroadcasting && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <div className="text-xs">
                <span className="font-bold text-emerald-900 block">
                  {language === 'ne' ? 'प्रत्यक्ष प्रसारण सक्रिय छ!' : 'GPS Transmitter Active!'}
                </span>
                <span className="text-emerald-700 text-[11px]">
                  {language === 'ne'
                    ? 'यात्रुहरूले तपाईंको म्याजिक नक्सामा प्रत्यक्ष देखिरहेका छन्।'
                    : 'Passengers on MagicTrack Bharatpur can see your live position.'}
                </span>
              </div>
            </div>
          )}

          {/* Vehicle Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {language === 'ne' ? 'सवारी छान्नुहोस् (नम्बर प्लेट):' : 'Select Vehicle (Plate Number):'}
            </label>
            <select
              disabled={isDriverBroadcasting}
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} · {v.driverName} (Route {v.routeNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Current Route info */}
          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              {language === 'ne' ? 'तोकिएको रुट:' : 'Assigned Route:'}
            </span>
            <span className="font-bold text-slate-900">
              Route {currentVehicle?.routeNumber}: {language === 'ne' ? currentRoute?.nameNe : currentRoute?.nameEn}
            </span>
          </div>

          {/* Seat & Occupancy Controls */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ne' ? 'सिट स्थिति (यात्रु संख्या):' : 'Passenger Capacity & Occupancy:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedOccupancy('empty');
                  setAvailableSeats(7);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedOccupancy === 'empty'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {language === 'ne' ? 'सिट खाली (Empty)' : 'Empty / Plenty'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedOccupancy('moderate');
                  setAvailableSeats(3);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedOccupancy === 'moderate'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {language === 'ne' ? 'केही सिट (Few)' : 'Few Seats'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedOccupancy('full');
                  setAvailableSeats(0);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  selectedOccupancy === 'full'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {language === 'ne' ? 'भरिभराउ (Full)' : 'Full / Packed'}
              </button>
            </div>
          </div>

          {/* Available Seats Adjuster */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {language === 'ne' ? 'उपलब्ध खाली सिट संख्या:' : 'Available Seats Count:'}
              </span>
              <span className="text-[11px] text-slate-400">Total capacity: 10 passengers</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAvailableSeats((prev) => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center font-black text-sm text-slate-900">
                {availableSeats}
              </span>
              <button
                type="button"
                onClick={() => setAvailableSeats((prev) => Math.min(10, prev + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Transmission Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'ne' ? 'प्रसारण विधि:' : 'Telemetry Mode:'}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setBroadcastMethod('simulated')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                  broadcastMethod === 'simulated'
                    ? 'border-amber-500 bg-amber-50/50 font-bold text-amber-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-bold">
                  {language === 'ne' ? 'सिमुलेटेड रुट ड्राइभ' : 'Route Simulator'}
                </div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Auto-navigates Bharatpur roads
                </div>
              </button>

              <button
                type="button"
                onClick={() => setBroadcastMethod('device')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                  broadcastMethod === 'device'
                    ? 'border-amber-500 bg-amber-50/50 font-bold text-amber-900'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{language === 'ne' ? 'फोनको वास्तविक GPS' : 'Real Phone GPS'}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-normal">
                  Transmits phone coordinates
                </div>
              </button>
            </div>
          </div>

          {statusMessage && (
            <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              ✓ {statusMessage}
            </p>
          )}

          {/* Action Button */}
          <div>
            {isDriverBroadcasting ? (
              <button
                type="button"
                onClick={handleStopBroadcast}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Power className="w-4 h-4" />
                <span>{language === 'ne' ? 'प्रसारण बन्द गर्नुहोस्' : 'Stop GPS Broadcast'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartBroadcast}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ne' ? 'जीपीएस प्रसारण शुरु गर्नुहोस्' : 'Start Live GPS Broadcast'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
