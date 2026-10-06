"""
===================================================================
FACE DETECTION ATTENDANCE MONITORING SYSTEM (PYTHON OPENCV)
===================================================================
Author: AI Vision Studio
Description: Real-time OpenCV face detection & attendance logging system
Exports attendance records automatically to Excel (.xlsx) and CSV (.csv).
"""

import cv2
import os
import csv
import pandas as pd
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, ttk

# Ensure Data Directory exists
DATA_DIR = os.path.join(os.path.dirname(__file__), "attendance_data")
os.makedirs(DATA_DIR, exist_ok=True)

CSV_FILE = os.path.join(DATA_DIR, f"Attendance_{datetime.now().strftime('%Y-%m-%d')}.csv")
EXCEL_FILE = os.path.join(DATA_DIR, f"Attendance_{datetime.now().strftime('%Y-%m-%d')}.xlsx")

# Initialize CSV if not exists
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Student ID", "Student Name", "Department", "Date", "Time In", "Status"])

def log_attendance(student_id, name, department, status="Present"):
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%I:%M:%S %p")

    # Check if already logged today
    already_logged = False
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode='r') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 4 and row[0] == student_id and row[3] == date_str:
                    already_logged = True
                    break

    if not already_logged:
        with open(CSV_FILE, mode='a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([student_id, name, department, date_str, time_str, status])

        # Also update Excel file
        df = pd.read_csv(CSV_FILE)
        df.to_excel(EXCEL_FILE, index=False)
        print(f"[SUCCESS] Attendance logged for {name} ({student_id}) at {time_str}")
        return True
    else:
        print(f"[INFO] {name} ({student_id}) already marked attendance today.")
        return False


def start_face_scanner():
    print("[INFO] Starting OpenCV Face Detection Camera...")
    
    # Load OpenCV Haar Cascade classifier for face detection
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("[ERROR] Could not open webcam.")
        return

    # Sample pre-enrolled student database
    enrolled_students = [
        {"id": "STU-1001", "name": "Pranesh R", "dept": "CSE"},
        {"id": "STU-1002", "name": "Kavitha S", "dept": "AI & DS"},
        {"id": "STU-1003", "name": "Arun Kumar", "dept": "ECE"}
    ]

    current_index = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        for (x, y, w, h) in faces:
            student = enrolled_students[current_index % len(enrolled_students)]

            # Draw cyber green bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), (212, 182, 6), 2)
            cv2.rectangle(frame, (x, y - 35), (x + w, y), (212, 182, 6), cv2.FILLED)

            font = cv2.FONT_HERSHEY_SIMPLEX
            label = f"{student['name']} ({student['id']})"
            cv2.putText(frame, label, (x + 6, y - 10), font, 0.5, (0, 0, 0), 2)

            # Auto mark attendance on detection
            success = log_attendance(student["id"], student["name"], student["dept"])
            if success:
                cv2.putText(frame, "VERIFIED PRESENT!", (x, y + h + 25), font, 0.6, (0, 255, 0), 2)

        # Display Scanner HUD
        cv2.putText(frame, "FACE AI ATTENDANCE CAMERA - PRESS 'q' TO EXIT", (20, 40), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, "PRESS 'n' TO SWITCH TARGET DEMO STUDENT", (20, 70), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

        cv2.imshow("Face Detection Attendance System (OpenCV)", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('n'):
            current_index += 1
            print(f"[SWITCH] Target set to: {enrolled_students[current_index % len(enrolled_students)]['name']}")

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    print("=====================================================")
    print("      FACE DETECTION ATTENDANCE SYSTEM (PYTHON)      ")
    print("=====================================================")
    start_face_scanner()
