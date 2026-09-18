import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tv, Volume2, Clock, AlertTriangle, Activity } from 'lucide-react';

export const PublicTVDisplay: React.FC = () => {
  const { queueState } = useApp();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString());
    }, 1000);
    setTimeStr(new Date().toLocaleTimeString());
    return () => clearInterval(interval);
  }, []);

  const inConsultationTokens = queueState?.tokens.filter(t => t.status === 'in_consultation') || [];
  const upcomingTokens = queueState?.tokens
    .filter(t => t.status === 'waiting')
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 8) || [];

  return (
    <div className="min-h-[85vh] flex flex-col justify-between space-y-6">
      
      {/* Top Banner Bar for TV Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex items-center justify-between shadow-2xl bg-slate-900/90">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Tv className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-wider text-white">
              HOSPITAL MAIN WAITING DISPLAY
            </h1>
            <p className="text-sm font-semibold text-amber-300">
              Please proceed to your assigned Consultation Room when your Token is called.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 text-slate-400 font-mono text-sm">
            <Volume2 className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>Audio Announcements Active</span>
          </div>
          <div className="text-right font-mono">
            <span className="text-3xl font-black text-white block">{timeStr}</span>
            <span className="text-xs text-teal-400 font-bold uppercase tracking-widest">LIVE DIGITAL QUEUE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Big Panel: NOW SERVING */}
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-emerald-500/40 p-8 flex flex-col justify-between bg-slate-950/80 shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-xl font-black text-emerald-400 tracking-widest uppercase flex items-center">
                <Activity className="w-6 h-6 mr-3 text-emerald-400 animate-pulse" /> NOW SERVING AT CONSULTATION ROOMS
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE VISITS
              </span>
            </div>

            {inConsultationTokens.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-6xl font-mono font-black text-slate-700">---</div>
                <p className="text-lg text-slate-400 font-semibold">Doctors Preparing for Next Tokens</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {inConsultationTokens.map(tok => (
                  <div
                    key={tok.id}
                    className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-teal-950/50 border-2 border-emerald-500/60 shadow-xl flex items-center justify-between glow-teal"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        TOKEN NUMBER
                      </span>
                      <span className="text-5xl md:text-6xl font-black font-mono text-emerald-300 tracking-wider">
                        {tok.tokenNumber}
                      </span>
                      <p className="text-sm font-extrabold text-white mt-2">{tok.patientName}</p>
                    </div>

                    <div className="text-right bg-slate-950/80 px-6 py-4 rounded-2xl border border-emerald-500/30">
                      <span className="text-xs font-bold text-slate-400 block uppercase">PROCEED TO</span>
                      <span className="text-2xl md:text-3xl font-black text-teal-300 block">{tok.roomNo}</span>
                      <span className="text-xs font-semibold text-slate-400 mt-1 block">{tok.assignedDoctorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>🔊 Chime will sound when token is called</span>
            <span className="text-teal-400 font-bold">HealthQueue AI Real-Time Streaming</span>
          </div>
        </div>

        {/* Right Panel: UPCOMING IN QUEUE */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 p-8 flex flex-col justify-between bg-slate-950/80">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-lg font-black text-amber-400 tracking-wider uppercase flex items-center">
                <Clock className="w-5 h-5 mr-2 text-amber-400" /> UPCOMING TOKENS
              </h3>
              <span className="text-xs text-slate-400 font-mono">NEXT IN LINE</span>
            </div>

            <div className="space-y-4">
              {upcomingTokens.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No upcoming tokens in queue.
                </div>
              ) : (
                upcomingTokens.map((tok, idx) => (
                  <div
                    key={tok.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      tok.severityLevel === 1
                        ? 'bg-red-950/40 border-red-500/60 glow-red'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 font-bold text-xs text-slate-300 flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-mono text-2xl font-black text-white">{tok.tokenNumber}</span>
                        <p className="text-xs text-slate-400 font-medium">{tok.patientName}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold block ${
                        tok.severityLevel === 1 ? 'bg-red-500/20 text-red-400' :
                        tok.severityLevel === 2 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-teal-500/20 text-teal-300'
                      }`}>
                        {tok.severityLabel.split(' ')[0]}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-1">Est. {tok.estimatedWaitMinutes}m</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center font-semibold">
            Emergency Triage Tokens are automatically fast-tracked to the front of the queue.
          </div>
        </div>

      </div>

    </div>
  );
};
