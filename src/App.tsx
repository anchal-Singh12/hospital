import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicTVDisplay } from './components/PublicTVDisplay';
import { EmergencyBanner } from './components/EmergencyBanner';
import { Sparkles, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === 'patient' && <PatientDashboard />}
        {role === 'doctor' && <DoctorDashboard />}
        {role === 'admin' && <AdminDashboard />}
        {role === 'public_tv' && <PublicTVDisplay />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-medium">
            <span className="text-teal-400">HealthQueue AI v2.4</span>
            <span>•</span>
            <span>Zero-Wait Priority Hospital OS</span>
          </div>
          <p className="flex items-center">
            Built for Hackathon with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-red-500" /> React, Node.js & Socket.IO
          </p>
        </div>
      </footer>

      <EmergencyBanner />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
