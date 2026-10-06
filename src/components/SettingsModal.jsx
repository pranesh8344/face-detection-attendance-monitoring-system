import React from 'react';
import { 
  Settings, 
  X, 
  Sliders, 
  Clock, 
  Volume2, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  confidenceThreshold, 
  setConfidenceThreshold,
  lateTimeThreshold,
  setLateTimeThreshold,
  soundEnabled,
  setSoundEnabled,
  onResetData,
  onResetTodayAttendance
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 p-6 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" /> System Configuration & Rules
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-5">
          
          {/* Confidence Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <label className="font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" /> Facial Match Threshold
              </label>
              <span className="font-mono-hud font-bold text-cyan-400 text-sm">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceThreshold}
              onChange={e => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <p className="text-[11px] text-slate-400">
              Minimum similarity required for identity match verification (Default: 75%).
            </p>
          </div>

          {/* Late Time Threshold */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" /> Late Cut-off Threshold Time
            </label>
            <input
              type="time"
              value={lateTimeThreshold}
              onChange={e => setLateTimeThreshold(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono-hud text-sm focus:border-cyan-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Students scanning after this time will automatically be tagged as "Late".
            </p>
          </div>

          {/* Audio Toggles */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-sm font-semibold text-white">Audio & Speech Alerts</div>
                <div className="text-[11px] text-slate-400">Chimes and text-to-speech feedback</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={e => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {/* Reset Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reset & Data Controls</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onResetTodayAttendance}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Today's Logs
              </button>
              <button
                type="button"
                onClick={onResetData}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Restore Default Roster
              </button>
            </div>
          </div>

        </div>

        <div className="flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-md"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
