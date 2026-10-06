import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Volume2, 
  VolumeX, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, soundEnabled, setSoundEnabled, todayCount = 0 }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'scanner', label: 'Face AI Scanner', icon: Camera },
    { id: 'students', label: 'Students Roster', icon: Users },
    { id: 'attendance', label: 'Attendance Logs', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 bg-slate-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
              <Camera className="w-6 h-6 text-white animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  FACE<span className="text-cyan-400 font-extrabold">ID</span> ATTENDANCE
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-3 h-3" /> v2.4 AI Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Smart Vision Attendance System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.id === 'attendance' && todayCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-cyan-400 text-slate-950 font-bold">
                      {todayCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* System Info & Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Clock & Date Badge */}
            <div className="hidden lg:flex flex-col items-end px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-right font-mono-hud">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs tracking-wider">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {timeStr}
              </div>
              <span className="text-[11px] text-slate-400">{dateStr}</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Audio Alerts Enabled" : "Audio Muted"}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20' 
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
              title="System Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
