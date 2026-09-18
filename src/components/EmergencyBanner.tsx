import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Bell, X, Volume2 } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { notificationAlert, clearNotification } = useApp();

  if (!notificationAlert) return null;

  const isEmergency = notificationAlert.type === 'emergency';

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-lg w-full p-4 rounded-3xl border shadow-2xl backdrop-blur-xl animate-bounce-short transition-all ${
      isEmergency 
        ? 'bg-red-950/90 border-red-500/80 text-white glow-red' 
        : 'bg-teal-950/90 border-teal-500/80 text-white glow-teal'
    }`}>
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3">
          <div className={`p-2.5 rounded-2xl ${isEmergency ? 'bg-red-500/20 text-red-400' : 'bg-teal-500/20 text-teal-300'}`}>
            {isEmergency ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {isEmergency ? 'Critical Emergency Broadcast' : 'Real-Time Queue Announcement'}
            </h4>
            <p className="text-sm font-extrabold mt-0.5 leading-snug">
              {notificationAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={clearNotification}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
