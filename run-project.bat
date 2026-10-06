@echo off
setlocal
cd /d "%~dp0"

set "NPM_CMD="
where npm >nul 2>nul && set "NPM_CMD=npm"

if not defined NPM_CMD (
    set "RUNTIME_DIR=%LOCALAPPDATA%\VivaMateAI\node"
    if not exist "%LOCALAPPDATA%\VivaMateAI\node\npm.cmd" (
        echo Node.js is missing. Downloading a portable LTS runtime...
        powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\ensure-node.ps1"
        if errorlevel 1 goto :failed
    )
    set "NPM_CMD=%LOCALAPPDATA%\VivaMateAI\node\npm.cmd"
)

if not exist "%~dp0backend\node_modules\express" (
    echo Installing backend requirements...
    call "%NPM_CMD%" --prefix "%~dp0backend" ci
    if errorlevel 1 goto :failed
)

if not exist "%~dp0client\node_modules\vite" (
    echo Installing frontend requirements...
    call "%NPM_CMD%" --prefix "%~dp0client" ci
    if errorlevel 1 goto :failed
)

echo Starting VivaMate-AI backend...
start "VivaMate Backend" cmd /k "cd /d ""%~dp0backend"" && call ""%NPM_CMD%"" run dev"

echo Starting VivaMate-AI frontend...
start "VivaMate Frontend" cmd /k "cd /d ""%~dp0client"" && call ""%NPM_CMD%"" run dev -- --host 0.0.0.0"

echo VivaMate is starting. Opening http://localhost:5173/
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173/"
exit /b 0

:failed
echo.
echo VivaMate could not start. Check your internet connection and try again.
pause
exit /b 1
