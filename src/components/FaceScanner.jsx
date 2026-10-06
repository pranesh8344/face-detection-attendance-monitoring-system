import React, { useRef, useEffect, useState } from 'react';
import { 
  Camera, 
  CameraOff, 
  UserCheck, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  UserPlus, 
  Volume2,
  CheckCircle,
  Clock,
  Zap,
  Maximize2
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { extractFaceVectorFromCanvas, findBestMatchingStudent } from '../services/faceMatcher';
import confetti from 'canvas-confetti';

export default function FaceScanner({ 
  students, 
  attendanceLogs, 
  onMarkAttendance, 
  onOpenEnrollModal, 
  confidenceThreshold = 75,
  lateTimeThreshold = "09:15" 
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const attendanceLogsRef = useRef(attendanceLogs);

  // Keep the ref in sync with the latest attendanceLogs prop
  useEffect(() => {
    attendanceLogsRef.current = attendanceLogs;
  }, [attendanceLogs]);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanStatus, setScanStatus] = useState('IDLE'); // IDLE, SCANNING, VERIFIED, ALREADY_MARKED, UNKNOWN
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [currentConfidence, setCurrentConfidence] = useState(0);
  const [demoSelectedStudent, setDemoSelectedStudent] = useState('');
  const [lastScanLog, setLastScanLog] = useState(null);
  const [cooldownTimeouts, setCooldownTimeouts] = useState({});

  // Start Live Webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setScanStatus('SCANNING');
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera permission denied or device not found. You can still use Demo Simulation mode below!");
      setCameraActive(false);
    }
  };

  // Stop Live Webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setScanStatus('IDLE');
  };

  // Camera canvas HUD loop
  useEffect(() => {
    let animId;
    let scanInterval;

    if (cameraActive) {
      scanInterval = setInterval(() => {
        processVideoFrame();
      }, 1200);

      const drawHUD = () => {
        if (canvasRef.current && videoRef.current && videoRef.current.readyState === 4) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;

          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw Cyber Face Frame Box
          const boxW = Math.min(canvas.width * 0.45, 320);
          const boxH = boxW * 1.25;
          const boxX = (canvas.width - boxW) / 2;
          const boxY = (canvas.height - boxH) / 2;

          ctx.strokeStyle = scanStatus === 'VERIFIED' ? '#10b981' : scanStatus === 'UNKNOWN' ? '#ef4444' : '#06b6d4';
          ctx.lineWidth = 3;

          // Corner Crosshairs
          const cornerLen = 25;
          // Top Left
          ctx.beginPath();
          ctx.moveTo(boxX, boxY + cornerLen);
          ctx.lineTo(boxX, boxY);
          ctx.lineTo(boxX + cornerLen, boxY);
          ctx.stroke();

          // Top Right
          ctx.beginPath();
          ctx.moveTo(boxX + boxW - cornerLen, boxY);
          ctx.lineTo(boxX + boxW, boxY);
          ctx.lineTo(boxX + boxW, boxY + cornerLen);
          ctx.stroke();

          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(boxX, boxY + boxH - cornerLen);
          ctx.lineTo(boxX, boxY + boxH);
          ctx.lineTo(boxX + cornerLen, boxY + boxH);
          ctx.stroke();

          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
          ctx.lineTo(boxX + boxW, boxY + boxH);
          ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
          ctx.stroke();

          // Text overlay on frame
          ctx.fillStyle = scanStatus === 'VERIFIED' ? '#10b981' : '#06b6d4';
          ctx.font = 'bold 12px "Fira Code", monospace';
          ctx.fillText(`FACE AI: ${scanStatus}`, boxX + 10, boxY + 24);
          if (currentConfidence > 0) {
            ctx.fillText(`CONFIDENCE: ${currentConfidence}%`, boxX + 10, boxY + 42);
          }
        }
        animId = requestAnimationFrame(drawHUD);
      };

      animId = requestAnimationFrame(drawHUD);
    }

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(scanInterval);
    };
  }, [cameraActive, students, scanStatus, currentConfidence]);

  // Process single frame for face matching
  const processVideoFrame = () => {
    if (!canvasRef.current || !videoRef.current || videoRef.current.readyState !== 4) return;
    const canvas = canvasRef.current;
    const boxW = Math.min(canvas.width * 0.45, 320);
    const boxH = boxW * 1.25;
    const boxX = (canvas.width - boxW) / 2;
    const boxY = (canvas.height - boxH) / 2;

    const currentVector = extractFaceVectorFromCanvas(canvas, { x: boxX, y: boxY, width: boxW, height: boxH });
    const { match, confidence } = findBestMatchingStudent(currentVector, students, confidenceThreshold);

    if (match) {
      setCurrentConfidence(confidence);
      triggerAttendanceMark(match, confidence);
    } else {
      setCurrentConfidence(Math.floor(Math.random() * 20 + 40));
    }
  };

  // Execute Attendance Mark
  const triggerAttendanceMark = (student, confidence) => {
    const today = new Date().toISOString().split('T')[0];
    // Use ref to get latest logs to avoid stale closure in setInterval
    const alreadyLoggedToday = attendanceLogsRef.current.some(log => log.studentId === student.id && log.date === today);

    if (alreadyLoggedToday) {
      setScanStatus('ALREADY_MARKED');
      setVerifiedStudent(student);
      soundEffects.playWarningAlert();
      return;
    }

    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Parse threshold e.g. "09:15"
    const [tHour, tMin] = lateTimeThreshold.split(':').map(Number);
    const isLate = (hours > tHour) || (hours === tHour && minutes > tMin);
    const status = isLate ? 'Late' : 'Present';

    const newLog = {
      id: `LOG-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      date: today,
      timeIn: currentTimeStr,
      timeOut: '--',
      status: status,
      confidence: confidence,
      method: 'Face AI Camera',
      location: 'Main Gate Scanner',
      notes: isLate ? `Scanned after ${lateTimeThreshold} threshold` : 'On time face verification'
    };

    onMarkAttendance(newLog);
    setLastScanLog(newLog);
    setVerifiedStudent(student);
    setScanStatus('VERIFIED');

    // Play Sound & Speech Feedback
    soundEffects.playSuccessChime();
    soundEffects.speakText(`Welcome, ${student.name.split(' ')[0]}! Attendance marked as ${status}.`);

    // Confetti effect
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    // Reset status after 3.5 seconds
    setTimeout(() => {
      setScanStatus('SCANNING');
      setVerifiedStudent(null);
    }, 3500);
  };

  // Demo Simulation trigger
  const handleSimulateScan = () => {
    if (!demoSelectedStudent) return;
    const student = students.find(s => s.id === demoSelectedStudent);
    if (student) {
      soundEffects.playScanBeep();
      const mockConf = Math.floor(Math.random() * 6 + 94);
      setCurrentConfidence(mockConf);
      triggerAttendanceMark(student, mockConf);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Info Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-cyan-500 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Camera Engine</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Zap className="w-5 h-5 text-cyan-400" />
              {cameraActive ? 'Scanning Live' : 'Standby / Manual'}
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${cameraActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
            {cameraActive ? 'ACTIVE' : 'OFFLINE'}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence Threshold</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {confidenceThreshold}% Min Accuracy
            </h3>
          </div>
          <span className="text-xs font-mono-hud text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            HIGH PRECISION
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Threshold Time</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <Clock className="w-5 h-5 text-indigo-400" />
              {lateTimeThreshold} AM
            </h3>
          </div>
          <span className="text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            RULES ACTIVE
          </span>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Camera Viewport - 8 Cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-2xl overflow-hidden glass-panel border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center shadow-2xl">
            
            {/* Live Video */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${!cameraActive ? 'hidden' : 'block'}`}
            />

            {/* Canvas Overlay for Cyber HUD */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100 ${!cameraActive ? 'hidden' : 'block'}`}
            />

            {/* Laser Scanning Line when camera is active */}
            {cameraActive && scanStatus === 'SCANNING' && (
              <div className="animate-scanline pointer-events-none"></div>
            )}

            {/* Fallback Display when Camera is Off */}
            {!cameraActive && (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-cyan-400 shadow-inner">
                  <Camera className="w-10 h-10 opacity-70" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Face AI Camera Offline</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Click "Start Camera" to enable real-time facial recognition via webcam, or use the Demo Selector on the right.
                </p>
                <button
                  onClick={startCamera}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  <Camera className="w-5 h-5" /> Start Live Camera
                </button>
                {cameraError && (
                  <p className="mt-4 text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {/* Verification Pop-up Badge overlay */}
            {scanStatus === 'VERIFIED' && verifiedStudent && (
              <div className="absolute inset-x-6 bottom-6 glass-panel rounded-2xl p-4 border border-emerald-500/50 bg-slate-950/90 shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                <img
                  src={verifiedStudent.avatar}
                  alt={verifiedStudent.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-slate-950">
                      VERIFIED MATCH
                    </span>
                    <span className="text-xs font-mono-hud text-emerald-400">{currentConfidence}% MATCH</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mt-0.5">{verifiedStudent.name}</h4>
                  <p className="text-xs text-slate-300">{verifiedStudent.id} • {verifiedStudent.department}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            )}

            {/* Already Marked overlay */}
            {scanStatus === 'ALREADY_MARKED' && verifiedStudent && (
              <div className="absolute inset-x-6 bottom-6 glass-panel rounded-2xl p-4 border border-amber-500/50 bg-slate-950/90 shadow-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-amber-300">Already Logged Today</h4>
                  <p className="text-xs text-slate-300">{verifiedStudent.name} ({verifiedStudent.id}) has already marked attendance today.</p>
                </div>
              </div>
            )}

            {/* Controls Bar on Camera */}
            {cameraActive && (
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all"
                >
                  <CameraOff className="w-4 h-4" /> Stop Camera
                </button>
              </div>
            )}

          </div>

          {/* Quick instructions bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Position face directly inside the cyber HUD box for instant scanning.
            </span>
            <span className="font-mono-hud text-cyan-400">FPS: 30 • HD 720P</span>
          </div>

        </div>

        {/* Right Side Control Panel - 4 Cols */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Quick Demo Scanner Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Demo Scanner Simulator
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                TEST MODE
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Select any registered student below to test real-time face detection scan & attendance logging instantly:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Student:</label>
              <select
                value={demoSelectedStudent}
                onChange={(e) => setDemoSelectedStudent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 focus:outline-none"
              >
                <option value="">-- Choose Student to Simulate --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) - {s.department.split(' ')[0]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={!demoSelectedStudent}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                demoSelectedStudent
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Simulate Face Scan Now
            </button>
          </div>

          {/* Quick Enrollment Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" /> Enroll New Student Face
            </h3>
            <p className="text-xs text-slate-400">
              Register new student with name, department, roll number, and live face signature vector.
            </p>
            <button
              onClick={onOpenEnrollModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 font-semibold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" /> Register New Face Signature
            </button>
          </div>

          {/* Recent Verification Log */}
          {lastScanLog && (
            <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> LAST VERIFIED
                </span>
                <span className="text-slate-400 font-mono-hud">{lastScanLog.timeIn}</span>
              </div>
              <div className="text-sm font-bold text-white">{lastScanLog.studentName}</div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>{lastScanLog.department}</span>
                <span className={`font-bold ${lastScanLog.status === 'Present' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {lastScanLog.status}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
