import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AiTriageAssistant } from './AiTriageAssistant';
import { 
  Clock, 
  UserCheck, 
  AlertTriangle, 
  Activity, 
  Stethoscope, 
  CheckCircle, 
  Zap, 
  Users,
  ChevronRight,
  Plus
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { activeToken, queueState, emergencyOverride } = useApp();
  const [showGenerator, setShowGenerator] = useState<boolean>(!activeToken);

  const waitingTokens = queueState?.tokens.filter(t => t.status === 'waiting') || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Top Welcome / Status Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Patient Care Portal
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Track your digital token, real-time queue position, and estimated doctor availability
          </p>
        </div>

        <button
          onClick={() => setShowGenerator(!showGenerator)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs md:text-sm border border-slate-700 flex items-center space-x-2 transition-all"
        >
          {showGenerator ? (
            <span>View Active Ticket</span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Generate New Digital Token</span>
            </>
          )}
        </button>
      </div>

      {/* Generator Modal / Form View if toggled or no active token */}
      {showGenerator ? (
        <AiTriageAssistant onSuccess={() => setShowGenerator(false)} />
      ) : activeToken ? (
        
        /* Digital Token Display Ticket */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Digital Ticket Card */}
          <div className="lg:col-span-7 glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Your Digital Pass</span>
                <span className="text-sm font-semibold text-slate-200">{activeToken.patientName}</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center space-x-1.5 ${
                activeToken.status === 'in_consultation' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' :
                activeToken.status === 'completed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span className="uppercase">{activeToken.status.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Token Number Display */}
            <div className="py-8 text-center space-y-3 my-auto">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                Token Reference Number
              </span>
              <div className="inline-block text-5xl md:text-7xl font-black bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent tracking-wider py-2 font-mono">
                {activeToken.tokenNumber}
              </div>

              {/* Priority Rating */}
              <div className="flex items-center justify-center space-x-2 pt-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                  activeToken.severityLevel === 1 ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                  activeToken.severityLevel === 2 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                  'bg-teal-500/20 text-teal-300 border-teal-500/40'
                }`}>
                  {activeToken.severityLabel} (AI Score: {activeToken.priorityScore})
                </span>
              </div>
            </div>

            {/* Stats Row: Position & Est. Wait Time */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
              <div className="text-center border-r border-slate-800 pr-2">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs font-semibold mb-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>Patients Ahead</span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">
                  {activeToken.status === 'in_consultation' ? 0 : activeToken.countAhead ?? 0}
                </div>
              </div>

              <div className="text-center pl-2">
                <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Waiting Time</span>
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-amber-300">
                  {activeToken.status === 'in_consultation' ? 'Now Serving' : `${activeToken.estimatedWaitMinutes ?? 5} mins`}
                </div>
              </div>
            </div>

            {/* Doctor & Location Info */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Assigned Physician</span>
                  <span className="font-bold text-white text-sm">{activeToken.assignedDoctorName || 'Duty Doctor'}</span>
                </div>
              </div>

              <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 text-right w-full sm:w-auto">
                <span className="text-slate-400 block text-[11px]">Room / Bay</span>
                <span className="font-bold text-teal-300">{activeToken.roomNo || 'Triage Room'}</span>
              </div>
            </div>

            {/* Emergency Bump Request Button */}
            {activeToken.status === 'waiting' && activeToken.severityLevel !== 1 && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    if (confirm('Request immediate emergency priority escalation for severe pain/condition change?')) {
                      emergencyOverride(activeToken.id);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Zap className="w-4 h-4 text-red-400 animate-bounce" />
                  <span>Condition Worsened? Trigger Emergency Escalation</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Panel: Live Hospital Queue Feed */}
          <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
                  <Activity className="w-4 h-4 text-teal-400 mr-2" /> Live Hospital Queue Feed
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {waitingTokens.length} Active Queue
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {queueState?.tokens.map((tok) => {
                  const isCurrent = tok.id === activeToken.id;
                  return (
                    <div
                      key={tok.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-teal-950/30 border-teal-500/50 glow-teal'
                          : 'bg-slate-900/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm font-bold text-white">
                            {tok.tokenNumber}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            tok.severityLevel === 1 ? 'bg-red-500/20 text-red-400' :
                            tok.severityLevel === 2 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {tok.severityLabel.split(' ')[0]}
                          </span>
                        </div>

                        <span className={`text-xs font-semibold ${
                          tok.status === 'in_consultation' ? 'text-emerald-400 font-bold' :
                          tok.status === 'completed' ? 'text-slate-500' : 'text-amber-300'
                        }`}>
                          {tok.status === 'in_consultation' ? 'In Consult' : tok.status === 'completed' ? 'Done' : 'Waiting'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                        <span>{tok.patientName}</span>
                        <span>{tok.roomNo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              💡 Please remain near the waiting room or keep your phone nearby for SMS alerts.
            </div>

          </div>

        </div>

      ) : null}

    </div>
  );
};
