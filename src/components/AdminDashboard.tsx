import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  Stethoscope, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Plus, 
  CheckCircle, 
  TrendingUp, 
  Sliders,
  Terminal,
  Building
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { queueState, registerDoctor, emergencyOverride } = useApp();
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  const [newDoc, setNewDoc] = useState({
    name: '',
    specialization: '',
    departmentId: 'dept-gen',
    roomNo: 'Room 301'
  });

  const stats = queueState?.stats || {
    totalTokensToday: 0,
    waitingCount: 0,
    inConsultationCount: 0,
    completedCount: 0,
    emergencyCount: 0,
    avgWaitMinutes: 0
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) return alert('Doctor name is required');
    await registerDoctor(newDoc);
    setShowDoctorModal(false);
    setNewDoc({ name: '', specialization: '', departmentId: 'dept-gen', roomNo: 'Room 301' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Hospital Command Center
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                Real-time queue monitoring, doctor allocation & priority override controls
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDoctorModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-purple-600/20 hover:brightness-110 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Doctor</span>
        </button>
      </div>

      {/* Top Overview Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Total Patients Today</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{stats.totalTokensToday}</div>
          <div className="text-[11px] text-teal-400 font-semibold flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% from yesterday
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Active Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300">{stats.waitingCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Patients waiting</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>In Consultation</span>
            <Stethoscope className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{stats.inConsultationCount}</div>
          <div className="text-[11px] text-emerald-400 font-medium">Active visits</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Emergency Cases</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400">{stats.emergencyCount}</div>
          <div className="text-[11px] text-red-400 font-semibold">Critical Triage</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2 col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
            <span>Avg Wait Time</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-300">{stats.avgWaitMinutes}m</div>
          <div className="text-[11px] text-cyan-400 font-medium">Optimized by AI</div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Department Load Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel rounded-3xl border border-slate-800 p-6">
            <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center">
              <Building className="w-5 h-5 text-purple-400 mr-2" /> Department Load & Doctor Roster
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {queueState?.departments.map(dept => {
                const deptTokens = queueState.tokens.filter(t => t.departmentId === dept.id);
                const deptWaiting = deptTokens.filter(t => t.status === 'waiting').length;
                const deptDocs = queueState.doctors.filter(d => d.departmentId === dept.id);

                return (
                  <div key={dept.id} className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold uppercase text-slate-400">{dept.code}</span>
                        <h3 className="text-base font-extrabold text-white">{dept.name}</h3>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                        deptWaiting > 3 ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'
                      }`}>
                        {deptWaiting} Waiting
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400 font-medium">Assigned Doctors:</span>
                      {deptDocs.length === 0 ? (
                        <p className="text-xs text-slate-500">No doctor on duty</p>
                      ) : (
                        deptDocs.map(doc => (
                          <div key={doc.id} className="flex justify-between items-center text-xs">
                            <span className="text-slate-200 font-medium">{doc.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              doc.status === 'in_consultation' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {doc.roomNo} ({doc.status})
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Queue Override Table */}
          <div className="glass-panel rounded-3xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <Sliders className="w-5 h-5 text-teal-400 mr-2" /> Queue Priority Management
              </h2>
              <span className="text-xs text-slate-400">Total Tokens: {queueState?.tokens.length || 0}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-3 px-2">Token</th>
                    <th className="py-3 px-2">Patient</th>
                    <th className="py-3 px-2">Dept</th>
                    <th className="py-3 px-2">Priority</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {queueState?.tokens.map(tok => (
                    <tr key={tok.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-2 font-mono font-bold text-teal-300">{tok.tokenNumber}</td>
                      <td className="py-3 px-2 font-medium text-white">{tok.patientName}</td>
                      <td className="py-3 px-2 text-slate-400">{tok.departmentName || tok.departmentId}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          tok.severityLevel === 1 ? 'bg-red-500/20 text-red-400' :
                          tok.severityLevel === 2 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {tok.priorityScore} pts
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-300">{tok.status}</td>
                      <td className="py-3 px-2 text-right">
                        {tok.severityLevel !== 1 && tok.status === 'waiting' && (
                          <button
                            onClick={() => emergencyOverride(tok.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800 text-[11px] font-bold"
                          >
                            Escalate ER
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Real-Time Audit Log Timeline */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <Terminal className="w-4 h-4 text-purple-400 mr-2" /> Live Triage & System Audit Log
              </h3>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1 font-mono text-xs">
              {queueState?.logs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="text-purple-400 font-bold">[{log.action}]</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">{log.message}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 text-center font-mono">
            HealthQueue AI Hospital Operations OS • Multi-Department Sync
          </div>
        </div>

      </div>

      {/* Onboard Doctor Modal */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border border-slate-700 max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Onboard New Physician</h3>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Doctor Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Katherine Vance"
                  value={newDoc.name}
                  onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  placeholder="Cardiologist, Neurologist, General..."
                  value={newDoc.specialization}
                  onChange={e => setNewDoc({ ...newDoc, specialization: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={newDoc.departmentId}
                    onChange={e => setNewDoc({ ...newDoc, departmentId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    {queueState?.departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room / Bay No.</label>
                  <input
                    type="text"
                    required
                    value={newDoc.roomNo}
                    onChange={e => setNewDoc({ ...newDoc, roomNo: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
