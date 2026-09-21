import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { QueueState, RoleMode, PatientToken, Doctor } from '../types';

interface AppContextType {
  role: RoleMode;
  setRole: (role: RoleMode) => void;
  queueState: QueueState | null;
  isConnected: boolean;
  activeToken: PatientToken | null;
  setActiveToken: (token: PatientToken | null) => void;
  activeDoctorId: string;
  setActiveDoctorId: (id: string) => void;
  notificationAlert: { message: string; type: 'emergency' | 'call' | 'info' } | null;
  clearNotification: () => void;
  generateToken: (formData: any) => Promise<PatientToken>;
  updateTokenStatus: (tokenId: string, status: string, doctorId?: string) => Promise<void>;
  emergencyOverride: (tokenId: string) => Promise<void>;
  registerDoctor: (doctorData: any) => Promise<void>;
  playAudioChime: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<RoleMode>('patient');
  const [queueState, setQueueState] = useState<QueueState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeToken, setActiveToken] = useState<PatientToken | null>(null);
  const [activeDoctorId, setActiveDoctorId] = useState<string>('doc-1');
  const [notificationAlert, setNotificationAlert] = useState<{ message: string; type: 'emergency' | 'call' | 'info' } | null>(null);

  // Play audio alert chime using Web Audio API synthesized chime
  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  useEffect(() => {
    // Dynamic Socket URL target (port 5000 for backend)
  const socketUrl = 'https://hospital-fzpl.onrender.com';

    const socket: Socket = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('queue:state', (data: QueueState) => {
      setQueueState(data);
    });

    socket.on('patient:called', (payload: { token: PatientToken; audioChime?: boolean }) => {
      playAudioChime();
      setNotificationAlert({
        message: `📢 TOKEN ${payload.token.tokenNumber} (${payload.token.patientName}) IS CALLED TO ${payload.token.roomNo}!`,
        type: 'call'
      });
    });

    socket.on('emergency:alert', (payload: { message: string }) => {
      playAudioChime();
      setNotificationAlert({
        message: payload.message,
        type: 'emergency'
      });
    });

    // Helper for API endpoint
  const getApiUrl = (path: string) =>
  https://hospital-fzpl.onrender.com${path};

    // Initial fetch
    fetch(getApiUrl('/api/queue-status'))
      .then(res => res.json())
      .then(data => setQueueState(data))
      .catch(err => console.log('Fetch error:', err));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper for API fetch
  const getApiUrl = (path: string) => window.location.port === '3000' ? `http://localhost:5000${path}` : path;

  // Update active token object dynamically when queueState updates
  useEffect(() => {
    if (activeToken && queueState) {
      const updated = queueState.tokens.find(t => t.id === activeToken.id);
      if (updated) {
        setActiveToken(updated);
      }
    }
  }, [queueState]);

  const clearNotification = () => setNotificationAlert(null);

  const generateToken = async (formData: any): Promise<PatientToken> => {
    const res = await fetch(getApiUrl('/api/tokens/generate'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.token) {
      setActiveToken(data.token);
    }
    return data.token;
  };

  const updateTokenStatus = async (tokenId: string, status: string, doctorId?: string) => {
    await fetch(getApiUrl('/api/tokens/update-status'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId, status, doctorId: doctorId || activeDoctorId })
    });
  };

  const emergencyOverride = async (tokenId: string) => {
    await fetch(getApiUrl('/api/emergency/override'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId })
    });
  };

  const registerDoctor = async (doctorData: any) => {
    await fetch(getApiUrl('/api/doctors/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData)
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        queueState,
        isConnected,
        activeToken,
        setActiveToken,
        activeDoctorId,
        setActiveDoctorId,
        notificationAlert,
        clearNotification,
        generateToken,
        updateTokenStatus,
        emergencyOverride,
        registerDoctor,
        playAudioChime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
