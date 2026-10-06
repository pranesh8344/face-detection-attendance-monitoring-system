import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { DEPARTMENT_LIST, getFormattedDate } from '../services/mockData';

export default function AttendanceLogs({ 
  attendanceLogs, 
  students, 
  onAddManualLog, 
  onDeleteLog 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(getFormattedDate(0));
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual Log Form State
  const [manualForm, setManualForm] = useState({
    studentId: '',
    status: 'Present',
    timeIn: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    notes: 'Manual entry by administrator'
  });

  const filteredLogs = attendanceLogs.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate === '' || log.date === selectedDate;
    const matchesStatus = selectedStatus === '' || log.status === selectedStatus;
    const matchesDept = selectedDept === '' || log.department === selectedDept;
    return matchesSearch && matchesDate && matchesStatus && matchesDept;
  });

  // Export to Excel .xlsx
  const handleExportExcel = () => {
    const exportData = filteredLogs.map((log, idx) => ({
      "S.No": idx + 1,
      "Log ID": log.id,
      "Student ID": log.studentId,
      "Student Name": log.studentName,
      "Department": log.department,
      "Date": log.date,
      "Time In": log.timeIn,
      "Time Out": log.timeOut,
      "Status": log.status,
      "AI Match Confidence": `${log.confidence}%`,
      "Verification Method": log.method,
      "Location": log.location,
      "Notes": log.notes
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, `Attendance_Report_${selectedDate || 'All'}.xlsx`);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.studentId) return;

    const student = students.find(s => s.id === manualForm.studentId);
    if (!student) return;

    const newLog = {
      id: `LOG-M-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      date: selectedDate || getFormattedDate(0),
      timeIn: manualForm.timeIn,
      timeOut: '--',
      status: manualForm.status,
      confidence: 100,
      method: 'Manual Entry',
      location: 'Admin Portal',
      notes: manualForm.notes
    };

    onAddManualLog(newLog);
    setIsManualModalOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" /> Late
          </span>
        );
      case 'Absent':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" /> Absent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Info className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" /> Attendance Master Logs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time biometric verification log records and export center.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" /> Manual Override
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Date Filter */}
        <div className="sm:col-span-3 relative">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Excused">Excused</option>
          </select>
        </div>

        {/* Dept Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Departments</option>
            {DEPARTMENT_LIST.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-xs font-semibold text-slate-400 border-b border-slate-800">
                <th className="py-3.5 px-4">Student & ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Date & Time In</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">AI Confidence</th>
                <th className="py-3.5 px-4">Method & Location</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => {
                  const student = students.find(s => s.id === log.studentId);
                  return (
                    <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                      
                      {/* Student */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {student?.avatar ? (
                            <img src={student.avatar} alt={log.studentName} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 text-xs">
                              {log.studentName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white">{log.studentName}</div>
                            <div className="text-xs font-mono-hud text-cyan-400">{log.studentId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-xs text-slate-300">{log.department}</td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 font-mono-hud text-xs">
                        <div className="text-white font-bold">{log.timeIn}</div>
                        <div className="text-slate-400">{log.date}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">{getStatusBadge(log.status)}</td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full ${log.confidence >= 95 ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                              style={{ width: `${log.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono-hud font-bold text-slate-300">{log.confidence}%</span>
                        </div>
                      </td>

                      {/* Method */}
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        <div className="text-slate-200 font-semibold">{log.method}</div>
                        <div className="text-[11px] text-slate-500">{log.location}</div>
                      </td>

                      {/* Notes */}
                      <td className="py-3.5 px-4 text-xs text-slate-400 italic max-w-xs truncate">
                        {log.notes}
                      </td>

                      {/* Delete */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 text-sm">
                    No attendance logs found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Override Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <PlusCircle className="w-5 h-5 text-cyan-400" /> Manual Attendance Override
            </h3>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Select Student *</label>
                <select
                  required
                  value={manualForm.studentId}
                  onChange={e => setManualForm({ ...manualForm, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Attendance Status</label>
                <select
                  value={manualForm.status}
                  onChange={e => setManualForm({ ...manualForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="Excused">Excused / On Leave</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Time In</label>
                <input
                  type="text"
                  value={manualForm.timeIn}
                  onChange={e => setManualForm({ ...manualForm, timeIn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono-hud text-sm focus:border-cyan-500 focus:outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Reason / Admin Note</label>
                <textarea
                  rows="2"
                  value={manualForm.notes}
                  onChange={e => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm"
                >
                  Save Manual Entry
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
