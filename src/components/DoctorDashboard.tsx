import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PatientToken } from '../types';
import { 
  Stethoscope, 
  UserCheck, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Clock, 
  Activity, 
  FileText,
  Send,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorDashboard: React.FC = () => {
  const { queueState, activeDoctorId, setActiveDoctorId, updateTokenStatus, emergencyOverride } = useApp();

  const [prescriptionNote, setPrescriptionNote] = useState('');
  const [rxSaved, setRxSaved] = useState(false);

  const activeDoc = queueState?.doctors.find(d => d.id === activeDoctorId) || queueState?.doctors[0];

  // Filter tokens for this doctor's department or assigned to this doctor
  const departmentTokens = queueState?.tokens.filter(
    t => t.departmentId === activeDoc?.departmentId || t.assignedDoctorId === activeDoc?.id
  ) || [];

  // Sort queue by AI priority score descending
  const waitingQueue = departmentTokens
    .filter(t => t.status === 'waiting')
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const currentConsultation = departmentTokens.find(
    t => t.status === 'in_consultation' && t.assignedDoctorId === activeDoc?.id
  );

  const nextPatient = waitingQueue[0];

  const handleCallPatient = async (token: PatientToken) => {
    await updateTokenStatus(token.id, 'in_consultation', activeDoc?.id);
  };

  const handleCompleteConsultation = async (token: PatientToken) => {
    await updateTokenStatus(token.id, 'completed', activeDoc?.id);
    setPrescriptionNote('');
    setRxSaved(false);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Bar: Doctor Selector & Status Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-white">
                {activeDoc?.name || 'Dr. Specialist'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeDoc?.roomNo || 'Room 101'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {activeDoc?.specialization} • Department Triage Portal
            </p>
          </div>
        </div>

        {/* Doctor Switcher & Doctor Stats */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs">
            <span className="text-slate-400 block font-medium">Switch Active Doctor Profile:</span>
            <select
              value={activeDoctorId}
              onChange={e => setActiveDoctorId(e.target.value)}
              className="bg-transparent text-sm font-bold text-teal-300 border-none outline-none cursor-pointer mt-0.5"
            >
              {queueState?.doctors.map(doc => (
                <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-center">
            <span className="text-slate-400 block text-[11px] font-medium">Patients Served Today</span>
            <span className="text-lg font-extrabold text-emerald-400">{activeDoc?.totalServedToday || 0}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Active Patient Consultation Card */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <Activity className="w-5 h-5 text-teal-400 mr-2" /> Active Patient Consultation
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                currentConsultation ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {currentConsultation ? 'IN CONSULTATION' : 'IDLE - WAITING FOR PATIENT'}
              </span>
            </div>

            {currentConsultation ? (
              <div className="space-y-6">
                
                {/* Patient Header Box */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-black font-mono text-teal-300">{currentConsultation.tokenNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        currentConsultation.severityLevel === 1 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                        currentConsultation.severityLevel === 2 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      }`}>
                        {currentConsultation.severityLabel}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mt-2">{currentConsultation.patientName}</h3>
                    <p className="text-xs text-slate-400">
                      Age: {currentConsultation.patientAge} • Contact: {currentConsultation.patientPhone || 'N/A'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">AI Priority Rating</span>
                    <span className="text-2xl font-black text-teal-400">{currentConsultation.priorityScore}/100</span>
                  </div>
                </div>

                {/* Symptoms & AI Clinical Recommendation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Chief Symptoms</span>
                    <p className="text-sm text-slate-200 font-medium">{currentConsultation.symptoms}</p>
                    <div className="flex items-center space-x-2 mt-3 text-xs text-amber-400 font-semibold">
                      <Flame className="w-4 h-4" />
                      <span>Pain Score: {currentConsultation.painScore} / 10</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs font-semibold text-teal-400 block mb-1">AI Triage Directive</span>
                    <p className="text-xs text-slate-300">{currentConsultation.aiRecommendation}</p>
                  </div>
                </div>

                {/* Quick Prescription / Clinical Notes Input */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                    <span className="flex items-center"><FileText className="w-4 h-4 text-teal-400 mr-1.5" /> Digital Clinical Notes & Rx</span>
                    {rxSaved && <span className="text-emerald-400 flex items-center text-[11px]"><Check className="w-3.5 h-3.5 mr-1" /> Rx Saved</span>}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Enter diagnosis, prescribed medications, follow-up instructions..."
                    value={prescriptionNote}
                    onChange={e => setPrescriptionNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => setRxSaved(true)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                  >
                    Save Rx Note
                  </button>
                </div>

                {/* Complete Visit Button */}
                <button
                  onClick={() => handleCompleteConsultation(currentConsultation)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Complete Consultation & Call Next</span>
                </button>

              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-300">No Patient Currently in Consultation</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Select a patient from the AI priority queue on the right to start consultation.
                  </p>
                </div>

                {nextPatient && (
                  <button
                    onClick={() => handleCallPatient(nextPatient)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 hover:brightness-110 transition-all inline-flex items-center space-x-2"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Call Highest Priority Token #{nextPatient.tokenNumber}</span>
                  </button>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: AI Priority Queue List */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <Flame className="w-4 h-4 text-amber-400 mr-2" /> AI Priority Queue ({waitingQueue.length})
              </h3>
              <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-semibold border border-teal-500/20">
                Auto-Ranked
              </span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {waitingQueue.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Queue is clear! No waiting patients.
                </div>
              ) : (
                waitingQueue.map((tok) => (
                  <div
                    key={tok.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      tok.severityLevel === 1
                        ? 'bg-red-950/30 border-red-500/50 glow-red'
                        : tok.severityLevel === 2
                        ? 'bg-amber-950/20 border-amber-500/40 glow-amber'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-base font-extrabold text-white">
                          {tok.tokenNumber}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold uppercase ${
                          tok.severityLevel === 1 ? 'bg-red-500/30 text-red-300' :
                          tok.severityLevel === 2 ? 'bg-amber-500/30 text-amber-300' :
                          'bg-teal-500/20 text-teal-300'
                        }`}>
                          {tok.severityLabel.split(' ')[0]}
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-teal-400">
                        Score: {tok.priorityScore}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{tok.patientName} ({tok.patientAge} yrs)</span>
                      <span className="text-slate-400 text-[11px]">{tok.symptoms}</span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCallPatient(tok)}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-teal-500/10"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Room {activeDoc?.roomNo}</span>
                      </button>

                      {tok.severityLevel !== 1 && (
                        <button
                          onClick={() => emergencyOverride(tok.id)}
                          title="Bump to Emergency Max Priority"
                          className="py-2 px-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-800 text-xs font-bold transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center">
            Patients are automatically prioritized using symptoms, pain index, and wait decay.
          </div>

        </div>

      </div>

    </div>
  );
};
