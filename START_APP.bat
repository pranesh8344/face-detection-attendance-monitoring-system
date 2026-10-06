@echo off
title Face Detection Attendance System Launcher
echo ========================================================
echo   Launching Face Detection Attendance Monitoring System
echo ========================================================
echo.

if not exist "node_modules\" (
    echo [INFO] Installing project dependencies... Please wait...
    cmd /c npm install
    echo.
)

echo Starting local web server... Please wait a few seconds...
echo The website will open automatically in your browser once ready!
echo.
cmd /c npm run dev -- --open
pause
