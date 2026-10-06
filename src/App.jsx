import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FaceScanner from './components/FaceScanner';
import StudentManager from './components/StudentManager';
import AttendanceLogs from './components/AttendanceLogs';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SettingsModal from './components/SettingsModal';
import { soundEffects } from './services/soundEffects';

import { 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE_LOGS, 
  getFormattedDate 
} from './services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // scanner, students, attendance, analytics
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  // Settings State
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [lateTimeThreshold, setLateTimeThreshold] = useState('09:15');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Student Database State with LocalStorage sync
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('face_attendance_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Attendance Logs State with LocalStorage sync
  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem('face_attendance_logs');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('face_attendance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('face_attendance_logs', JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  // Sync sound enabled state to the audio service
  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Handlers
  const handleMarkAttendance = (newLog) => {
    setAttendanceLogs(prev => [newLog, ...prev]);
  };

  const handleAddStudent = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm(`Are you sure you want to delete student ${studentId}?`)) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
    }
  };

  const handleDeleteLog = (logId) => {
    setAttendanceLogs(prev => prev.filter(l => l.id !== logId));
  };

  const handleResetData = () => {
    if (window.confirm("Reset student roster to default initial dataset?")) {
      setStudents(INITIAL_STUDENTS);
    }
  };

  const handleResetTodayAttendance = () => {
    if (window.confirm("Clear all attendance logs logged today?")) {
      const today = getFormattedDate(0);
      setAttendanceLogs(prev => prev.filter(l => l.date !== today));
    }
  };

  const todayStr = getFormattedDate(0);
  const todayCount = attendanceLogs.filter(l => l.date === todayStr).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        todayCount={todayCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {activeTab === 'scanner' && (
          <FaceScanner
            students={students}
            attendanceLogs={attendanceLogs}
            onMarkAttendance={handleMarkAttendance}
            onOpenEnrollModal={() => {
              setActiveTab('students');
              setIsEnrollModalOpen(true);
            }}
            confidenceThreshold={confidenceThreshold}
            lateTimeThreshold={lateTimeThreshold}
          />
        )}

        {activeTab === 'students' && (
          <StudentManager
            students={students}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            isEnrollModalOpen={isEnrollModalOpen}
            setIsEnrollModalOpen={setIsEnrollModalOpen}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceLogs
            attendanceLogs={attendanceLogs}
            students={students}
            onAddManualLog={handleMarkAttendance}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            students={students}
            attendanceLogs={attendanceLogs}
          />
        )}

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        confidenceThreshold={confidenceThreshold}
        setConfidenceThreshold={setConfidenceThreshold}
        lateTimeThreshold={lateTimeThreshold}
        setLateTimeThreshold={setLateTimeThreshold}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetData={handleResetData}
        onResetTodayAttendance={handleResetTodayAttendance}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🎯 Face ID Biometric Attendance Monitoring System • Built with React & OpenCV AI Vision</span>
          <span className="font-mono-hud text-cyan-400/80">Local Storage Sync Active • 100% Client Security</span>
        </div>
      </footer>

    </div>
  );
}
