@echo off
cd /d "%~dp0"
set "NODE_DIR="
for %%I in (node.exe) do if not "%%~$PATH:I"=="" set "NODE_DIR=%%~dpI"
if not defined NODE_DIR if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles%\nodejs\"
if not defined NODE_DIR if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_DIR=%LOCALAPPDATA%\Programs\nodejs\"
if not defined NODE_DIR (
    echo Node.js and npm are required but were not found in PATH.
    echo Install the Node.js LTS release from https://nodejs.org/ and try again.
    pause
    exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"

where npm >nul 2>nul
if errorlevel 1 (
    echo npm.cmd was not found beside Node.js at "%NODE_DIR%".
    pause
    exit /b 1
)

echo Starting the complete VivaMate AI project...
call npm start
if errorlevel 1 (
    echo VivaMate could not start. Check the error above.
    pause
    exit /b 1
)
