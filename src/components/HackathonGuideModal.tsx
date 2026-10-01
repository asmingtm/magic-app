import React, { useState } from 'react';
import { X, BookOpen, Terminal, Cpu, Award, CheckCircle2, Copy, Sparkles, ExternalLink } from 'lucide-react';
import { Language } from '../types/transit';

interface HackathonGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HackathonGuideModal: React.FC<HackathonGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const setupCommands = [
    {
      title: '1. Clone repository from GitHub',
      cmd: 'git clone https://github.com/asmingtm/hackdays.git\ncd hackdays',
    },
    {
      title: '2. Install all dependencies',
      cmd: 'npm install',
    },
    {
      title: '3. Run the development server',
      cmd: 'npm run dev',
    },
    {
      title: '4. Build production bundle (optional)',
      cmd: 'npm run build',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-base">
                {language === 'ne' ? 'ह्याक-डेज परियोजना गाइड र सेटअप' : 'Hack-Days Pitch & Setup Guide'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Theme: "Everyday problems, smart solutions" · Bharatpur, Chitwan
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Pitch Card */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Hackathon Theme: "Everyday problems, smart solutions"</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>The Everyday Problem:</strong> In Bharatpur & Narayangarh, hundreds of thousands of commuters, patients heading to Bharatpur Hospital, and university students (AFU Rampur, CMC, Birendra Campus) rely on Tata Magic microvans. Because there is no schedule or tracking, people wait 20–40 minutes at chowks without knowing if a Route 1 (Ring Road) van is coming or if it will be full.
            </p>
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>The Smart Solution:</strong> <em>MagicTrack Chitwan</em> turns everyday smart devices into a real-time transit telemetry network. It shows live vehicle locations, remaining seat capacity, upcoming arrivals, and official regulated fares with zero expensive municipality infrastructure required.
            </p>
          </div>

          {/* Setup Guide */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">
                How to Setup and Run This Project (Step-by-Step)
              </h4>
            </div>

            <div className="space-y-2.5">
              {setupCommands.map((item, idx) => (
                <div key={idx} className="bg-slate-900 text-slate-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-400">
                    <span>{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, idx)}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono text-[10px] cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="font-mono text-xs bg-slate-950/60 p-2 rounded-lg overflow-x-auto text-emerald-400">
                    {item.cmd}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <h4 className="font-bold text-sm text-slate-900">
                System Architecture & Real-World Implementation
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  1. Magic Driver Side (Telemetry)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Drivers simply open the web portal (or a dedicated lightweight Android app / $12 ESP32 OBD tracker in the van). A single tap on "Start Broadcast" broadcasts GPS latitude, longitude, and seat status via WebSocket/HTTP.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  2. Passenger Side (Navigation)
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Citizens access the web app instantly via QR codes posted at key chowks (Pulchowk, Chaubiskothi, Lions Chowk, etc.). No app install needed. Real-time Leaflet map tracks approaching vans with live ETAs.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  3. Geospatial Engine
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Haversine formula computes exact distances along Bharatpur's road grid, calculates vehicle bearings, and estimates arrival minutes dynamically taking into account traffic speeds.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  4. Social & Economic Impact
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Enforces official fare transparency (prevents overcharging students), reduces commuter anxiety, enhances women's safety during late-evening travel, and increases passenger turnover for Magic drivers.
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Repository Link */}
          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
            <span className="text-slate-600 font-mono text-xs">
              GitHub: asmingtm/hackdays.git
            </span>
            <span className="text-[11px] text-amber-700 font-bold">
              Ready for presentation!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
