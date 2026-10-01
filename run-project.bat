@echo off
cd /d "%~dp0"

:: ── 1. Locate Node.js ────────────────────────────────────────────────────────
set "NODE_DIR="

if exist "%ProgramFiles%\nodejs\node.exe"            set "NODE_DIR=%ProgramFiles%\nodejs\"
if not defined NODE_DIR if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_DIR=%LOCALAPPDATA%\Programs\nodejs\"

if not defined NODE_DIR (
    for /f "delims=" %%I in ('where node.exe 2^>nul') do (
        if not defined NODE_DIR if exist "%%~dpInpm.cmd" set "NODE_DIR=%%~dpI"
    )
)

if not defined NODE_DIR (
    echo.
    echo  Node.js was not found on this machine.
    echo  Install the LTS release from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"

:: ── 2. Verify npm is present ─────────────────────────────────────────────────
if not exist "%NODE_DIR%npm.cmd" (
    echo.
    echo  npm.cmd was not found at "%NODE_DIR%".
    echo  Reinstall Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: ── 3. Launch the project ────────────────────────────────────────────────────
echo.
echo  Starting VivaMate AI...
echo  Backend  ^>  http://localhost:5000
echo  Frontend ^>  http://localhost:5173
echo.
echo  Press Ctrl+C to stop both services.
echo.

"%NODE_DIR%node.exe" scripts\run-project.js %*

if errorlevel 1 (
    echo.
    echo  VivaMate stopped with an error. See the output above.
    echo.
    pause
    exit /b 1
)
