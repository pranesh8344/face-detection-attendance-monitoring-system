import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  CheckCircle,
  Building2
} from 'lucide-react';
import { DEPARTMENT_LIST, getFormattedDate } from '../services/mockData';

export default function AnalyticsDashboard({ students, attendanceLogs }) {
  const today = getFormattedDate(0);
  const todayLogs = attendanceLogs.filter(l => l.date === today);

  const presentTodayCount = todayLogs.filter(l => l.status === 'Present').length;
  const lateTodayCount = todayLogs.filter(l => l.status === 'Late').length;
  const totalStudents = students.length || 1;
  
  const attendanceRate = Math.min(100, parseFloat((((presentTodayCount + lateTodayCount) / totalStudents) * 100).toFixed(1)));
  
  const avgConfidence = todayLogs.length > 0 
    ? (todayLogs.reduce((acc, curr) => acc + curr.confidence, 0) / todayLogs.length).toFixed(1)
    : 96.5;

  // Department Stats
  const deptStats = DEPARTMENT_LIST.map(dept => {
    const deptStudents = students.filter(s => s.department === dept);
    const deptLogsToday = todayLogs.filter(l => l.department === dept);
    const rate = deptStudents.length > 0 ? Math.round((deptLogsToday.length / deptStudents.length) * 100) : 0;
    return {
      department: dept,
      total: deptStudents.length,
      present: deptLogsToday.length,
      rate: Math.min(100, rate)
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" /> Attendance Intelligence Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric analytics & daily attendance compliance metrics.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono-hud text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
            SYSTEM STATUS: 99.9% ONLINE
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Roster</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{totalStudents}</span>
            <span className="text-xs text-emerald-400 font-semibold">Students</span>
          </div>
          <p className="text-[11px] text-slate-500">Biometric facial signatures active</p>
        </div>

        {/* Present Today */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Present Today</span>
            <UserCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{presentTodayCount}</span>
            <span className="text-xs text-slate-400">On Time</span>
          </div>
          <p className="text-[11px] text-slate-500">Verified before late threshold</p>
        </div>

        {/* Late Scans */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Late Scans</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{lateTodayCount}</span>
            <span className="text-xs text-slate-400">Late Entries</span>
          </div>
          <p className="text-[11px] text-slate-500">Scanned after 09:15 AM</p>
        </div>

        {/* Attendance Rate */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Turnout Rate</span>
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{attendanceRate}%</span>
            <span className="text-xs text-indigo-400 font-semibold">Today</span>
          </div>
          <p className="text-[11px] text-slate-500">Overall class attendance rate</p>
        </div>

      </div>

      {/* Analytics Charts & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Compliance Progress Bars - 7 Cols */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" /> Department Compliance Breakdown
            </h3>
            <span className="text-xs font-mono-hud text-slate-400">TODAY'S TURNOUT</span>
          </div>

          <div className="space-y-4">
            {deptStats.map(d => (
              <div key={d.department} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{d.department}</span>
                  <span className="font-mono-hud text-cyan-400 font-bold">{d.present}/{d.total} ({d.rate}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${d.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Camera Match Precision & Summary - 5 Cols */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> Biometric AI Match Precision
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Average face feature vector match accuracy score.
            </p>
          </div>

          {/* Precision Circle Gauge */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-500/40"></div>
              <div className="text-center">
                <span className="text-3xl font-extrabold text-white font-mono-hud">{avgConfidence}%</span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">AI Accuracy</p>
              </div>
            </div>
            <p className="text-xs text-center text-slate-300 max-w-xs">
              Powered by 10-point normalized facial descriptor vector algorithm.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Spoofing Protection</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>

        </div>

      </div>

    </div>
  );
}
