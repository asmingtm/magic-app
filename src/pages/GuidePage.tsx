import React, { useState } from 'react';
import { Terminal, Cpu, Award, Copy, CheckCircle2, BookOpen, ExternalLink } from 'lucide-react';
import { Language } from '../types/transit';

interface GuidePageProps {
  language: Language;
}

export const GuidePage: React.FC<GuidePageProps> = ({ language }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {language === 'ne' ? 'ह्याक-डेज परियोजना गाइड र सेटअप' : 'Hack-Days Pitch & Setup Guide'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Theme: "Everyday problems, smart solutions" · Bharatpur, Chitwan · GitHub: asmingtm/hackdays.git
            </p>
          </div>
        </div>
      </div>

      {/* Pitch Card */}
      <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black text-base">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Hackathon Theme: "Everyday problems, smart solutions"</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
          <strong>The Everyday Problem:</strong> In Bharatpur & Narayangarh, hundreds of thousands of commuters, patients heading to Bharatpur Hospital, and university students (AFU Rampur, CMC, Birendra Campus) rely on Tata Magic microvans. Because there is no schedule or tracking, people wait 20–40 minutes at chowks without knowing if a Route 1 (Ring Road) van is coming or if it will be full.
        </p>
        <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
          <strong>The Smart Solution:</strong> <em>MagicTrack Chitwan</em> turns everyday smart devices into a real-time transit tracking network. It shows live vehicle locations, remaining seat capacity, upcoming arrivals, and official regulated fares with zero expensive municipality infrastructure required.
        </p>
      </div>

      {/* Setup Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            How to Setup and Run This Project (Step-by-Step)
          </h3>
        </div>

        <div className="space-y-3">
          {setupCommands.map((item, idx) => (
            <div key={idx} className="bg-slate-900 text-slate-100 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                <span>{item.title}</span>
                <button
                  onClick={() => copyToClipboard(item.cmd, idx)}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-mono text-xs cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="font-mono text-xs bg-slate-950 p-2.5 rounded-lg overflow-x-auto text-emerald-400">
                {item.cmd}
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            System Architecture & Real-World Implementation
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              1. Vehicle Real-Time GPS Tracking
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Vans can broadcast location via phone GPS or an affordable OBD tracker. Updates broadcast GPS latitude, longitude, and seat status via WebSocket/HTTP.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              2. Passenger Side (Navigation)
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Citizens access the web app instantly via QR codes posted at key chowks (Pulchowk, Chaubiskothi, Lions Chowk, etc.). No app install needed. Real-time Leaflet map tracks approaching vans with live ETAs.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              3. Geospatial Engine
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Haversine formula computes exact distances along Bharatpur's road grid, calculates vehicle bearings, and estimates arrival minutes dynamically taking into account traffic speeds.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              4. Social & Economic Impact
            </span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforces official fare transparency (prevents overcharging students), reduces commuter anxiety, enhances women's safety during late-evening travel, and increases passenger turnover for Magic drivers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
