@echo off
cd /d "%~dp0"
where npm >nul 2>nul
if errorlevel 1 (
    echo Node.js and npm are required but were not found in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting VivaMate-AI backend...
start "VivaMate Backend" cmd /k "cd /d ""%~dp0backend"" && npm install && npm run dev"

echo Starting VivaMate-AI frontend...
start "VivaMate Frontend" cmd /k "cd /d ""%~dp0client"" && npm install && npm run dev -- --host 0.0.0.0"

echo VivaMate is starting. Open http://localhost:5173/
pause
