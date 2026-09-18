import React from 'react';
import { useApp } from '../context/AppContext';
import { RoleMode } from '../types';
import { 
  Activity, 
  UserCheck, 
  Stethoscope, 
  ShieldAlert, 
  Tv, 
  Wifi, 
  WifiOff, 
  Sparkles,
  UserPlus
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, isConnected, queueState, activeDoctorId, setActiveDoctorId } = useApp();

  const activeDoc = queueState?.doctors.find(d => d.id === activeDoctorId);

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRole('patient')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-300 bg-clip-text text-transparent">
                  HealthQueue
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  <Sparkles className="w-3 h-3 mr-1" /> AI Triage
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Smart Priority & Real-Time Token System
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher (Hackathon Demo Bar) */}
          <nav className="flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
            <button
              onClick={() => setRole('patient')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                role === 'patient'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient</span>
            </button>

            <button
              onClick={() => setRole('doctor')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                role === 'doctor'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor</span>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => setRole('public_tv')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                role === 'public_tv'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="hidden md:inline">Waiting Room TV</span>
              <span className="md:hidden">TV</span>
            </button>
          </nav>

          {/* Right Status & Doctor Profile selector if doctor role */}
          <div className="flex items-center space-x-3">
            {role === 'doctor' && queueState?.doctors && (
              <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400 font-medium">Logged Doctor:</span>
                <select
                  value={activeDoctorId}
                  onChange={(e) => setActiveDoctorId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-teal-300 border-none outline-none cursor-pointer"
                >
                  {queueState.doctors.map(doc => (
                    <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
                      {doc.name} ({doc.roomNo})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Live Socket Status Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold">
              {isConnected ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 hidden sm:inline">Live Sync</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 hidden sm:inline">Connecting...</span>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
