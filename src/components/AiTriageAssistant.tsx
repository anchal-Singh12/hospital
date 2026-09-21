import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  AlertTriangle, 
  Heart, 
  Stethoscope, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AiTriageAssistant: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { queueState, generateToken } = useApp();

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: 32,
    patientPhone: '',
    departmentId: 'dept-er',
    symptoms: '',
    painScore: 5,
    highRiskVitals: false,
  });

  const [aiPreview, setAiPreview] = useState<{
    severityLevel: number;
    severityLabel: string;
    severityColor: string;
    priorityScore: number;
    detectedFlags: string[];
    aiRecommendation: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Live assessment preview when symptoms/pain changes
  useEffect(() => {
    const backendUrl = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
      ? 'http://localhost:5000'
      : 'https://hospital-fzpl.onrender.com';

    const timer = setTimeout(() => {
      fetch(`${backendUrl}/api/triage/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(data => setAiPreview(data))
        .catch(err => console.log(err));
    }, 200);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName) return alert('Please enter patient name');
    setLoading(true);

    try {
      const token = await generateToken(formData);
      setLoading(false);
      
      // Fire confetti effect on successful token generation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      alert('Error generating digital token');
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            AI Triage & Digital Token Generator
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Instant priority assessment for minimal wait times & emergency fast-tracking
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Patient Details & Triage Input */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Mercer"
                value={formData.patientName}
                onChange={e => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age *
              </label>
              <input
                type="number"
                required
                min="0"
                max="120"
                value={formData.patientAge}
                onChange={e => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number (SMS Notifications)
              </label>
              <input
                type="tel"
                placeholder="+1 555-0199"
                value={formData.patientPhone}
                onChange={e => setFormData({ ...formData, patientPhone: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Department
              </label>
              <select
                value={formData.departmentId}
                onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              >
                {queueState?.departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Symptoms description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Describe Symptoms / Reason for Visit *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Chest tightness, shortness of breath, high fever, acute injury..."
              value={formData.symptoms}
              onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Keywords like "chest pain", "bleeding", "stroke" automatically flag emergency triage.
            </p>
          </div>

          {/* Pain Scale Slider */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-300 flex items-center">
                <Flame className="w-4 h-4 text-amber-400 mr-1.5" /> Pain Level (1 to 10)
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                formData.painScore >= 8 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                formData.painScore >= 5 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                Score: {formData.painScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.painScore}
              onChange={e => setFormData({ ...formData, painScore: Number(e.target.value) })}
              className="w-full accent-teal-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Critical Vitals Checkbox */}
          <div className="flex items-center space-x-3 bg-red-950/20 border border-red-900/30 rounded-2xl p-3.5">
            <input
              type="checkbox"
              id="highRiskVitals"
              checked={formData.highRiskVitals}
              onChange={e => setFormData({ ...formData, highRiskVitals: e.target.checked })}
              className="w-4 h-4 accent-red-500 rounded cursor-pointer"
            />
            <label htmlFor="highRiskVitals" className="text-xs text-red-200 cursor-pointer font-medium">
              Flag Critical Vitals (Abnormal Heart Rate, SpO2 &lt; 90%, Unresponsive State)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-base shadow-xl shadow-teal-500/20 hover:brightness-110 active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Generating Token...</span>
            ) : (
              <>
                <span>Issue Digital Token & Join Queue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

        </div>

        {/* Right Column: AI Triage Live Assessment Box */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative">
          
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 mr-1.5" /> AI Priority Calculation
              </span>
              <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full font-semibold border border-teal-500/20">
                Real-Time
              </span>
            </div>

            {aiPreview ? (
              <div className="space-y-4">
                
                {/* Severity Badge */}
                <div className={`p-4 rounded-2xl border ${
                  aiPreview.severityLevel === 1 ? 'bg-red-500/10 border-red-500/30 glow-red' :
                  aiPreview.severityLevel === 2 ? 'bg-amber-500/10 border-amber-500/30 glow-amber' :
                  'bg-teal-500/10 border-teal-500/30 glow-teal'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase text-slate-400">Assigned Triage Tier</span>
                    <span className="text-xs font-extrabold text-white">Score: {aiPreview.priorityScore}/100</span>
                  </div>
                  <h3 className={`text-lg font-black tracking-wide ${
                    aiPreview.severityLevel === 1 ? 'text-red-400 animate-pulse' :
                    aiPreview.severityLevel === 2 ? 'text-amber-400' :
                    'text-teal-300'
                  }`}>
                    {aiPreview.severityLabel}
                  </h3>
                </div>

                {/* Flags Detected */}
                {aiPreview.detectedFlags.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">Detected AI Clinical Flags:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiPreview.detectedFlags.map((flag, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                          ⚡ {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendation */}
                <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-teal-400 block">AI Triage Routing Directive:</span>
                  <p>{aiPreview.aiRecommendation}</p>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Enter symptoms to evaluate AI priority level
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>HealthQueue AI Triage v2.4</span>
            <span className="text-teal-400/80 font-medium">Zero-Wait Priority Handling</span>
          </div>

        </div>

      </form>
    </div>
  );
};
