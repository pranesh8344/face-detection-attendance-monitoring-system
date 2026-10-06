# 🎯 Face Detection Attendance Monitoring System
> **Modern Web & Python AI Biometric Attendance System with Live Camera Scanner, Facial Feature Vectors, Analytics Dashboard, and Excel Report Exporting.**

---

## 🌟 English Overview
This project is a complete **Face Detection Attendance Monitoring System** built with **React, Vite, Web Audio API, HTML5 Canvas, and OpenCV**. It provides an interactive web-based biometric scanner alongside a standalone Python desktop engine.

### Key Features
- 🎥 **Real-time Camera Face AI Scanner**: Live HUD overlay box, scanning laser animation, distance indicators, and confidence score.
- 🔊 **Audio & Speech Synth Alerts**: Plays success chimes and speaks student names ("Welcome, Pranesh! Attendance marked.").
- 👥 **Biometric Roster Management**: Enroll new students with name, ID, department, and live camera face signature snapshot.
- 📊 **Attendance Logs & Filters**: Search, filter by date/department/status, and manual admin attendance override.
- 📁 **One-Click Excel (.xlsx) & CSV Export**: Instantly export structured attendance reports.
- 📈 **Analytics Dashboard**: Real-time turnout rates, late scan counts, department compliance progress bars, and AI accuracy metrics.
- 🐍 **Standalone Python OpenCV Script**: Desktop alternative with OpenCV Haar cascade detection.

---

## 🚀 How to Run the Web Application

### Prerequisites
- Node.js (v18+)

### Steps:
1. Open your terminal in the project directory:
   ```bash
   cd "d:\Face detection attendence monitoring system"
   ```
2. Start the local Vite development server:
   ```bash
   cmd /c npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 🐍 How to Run the Python OpenCV Script

1. Install required Python packages:
   ```bash
   pip install -r python/requirements.txt
   ```
2. Launch the OpenCV Face Detector:
   ```bash
   python python/attendance_system.py
   ```
3. Press `q` to quit or `n` to cycle through sample students in camera preview. Attendance logs are saved to `python/attendance_data/`.

---

## 📜 தமிழ் விளக்கம் (Tamil Project Summary)
இந்த திட்டம் **முக அடையாளம் காணும் வருகை பதிவு முறை (Face Detection Attendance Monitoring System)** ஆகும். 

### முக்கிய சிறப்பம்சங்கள்:
1. **நேரடி கேமரா ஸ்கேனர் (Live Web Camera Scanner)**: கேமரா மூலம் முகத்தை துல்லியமாக கண்டறிந்து வருகையை உடனடியாக பதிவு செய்யும்.
2. **ஒலி மற்றும் குரல் அறிவிப்பு (Voice Feedback)**: வருகை பதிவானதும் "Welcome! Attendance Marked" என்று குரல் மூலம் தெரிவிக்கும்.
3. **மாணவர்கள் பதிவு (Student Enrollment)**: புதிய மாணவர்களின் பெயர், ரோல் எண், துறை மற்றும் புகைப்படத்தை எளிதாக பதிவு செய்யலாம்.
4. **எக்செல் அறிக்கை (Excel Report Export)**: வருகை பதிவுகளை ஒரே கிளிக் மூலம் Excel (.xlsx) கோப்பாக பதிவிறக்கம் செய்யலாம்.
5. **பைதான் பதிப்பு (Python Version)**: கணினியில் நேரடியாக இயக்க Python OpenCV ஸ்கிரிப்ட்டும் கொடுக்கப்பட்டுள்ளது.

---
© 2026 AI Vision Studio • All Rights Reserved.
