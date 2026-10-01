@echo off
cd /d "%~dp0"
set "NODE_DIR="
if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_DIR=%ProgramFiles%\nodejs\"
if not defined NODE_DIR if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_DIR=%LOCALAPPDATA%\Programs\nodejs\"
if not defined NODE_DIR (
    for /f "delims=" %%I in ('where node.exe 2^>nul') do (
        if exist "%%~dpInpm.cmd" set "NODE_DIR=%%~dpI"
    )
)
if not defined NODE_DIR (
    echo Node.js and npm are required but were not found in PATH.
    echo Install the Node.js LTS release from https://nodejs.org/ and try again.
    pause
    exit /b 1
)
set "PATH=%NODE_DIR%;%PATH%"

if not exist "%NODE_DIR%npm.cmd" (
    echo npm.cmd was not found beside Node.js at "%NODE_DIR%".
    pause
    exit /b 1
)

echo Starting the complete VivaMate AI project...
call "%NODE_DIR%npm.cmd" start -- %*
if errorlevel 1 (
    echo VivaMate could not start. Check the error above.
    pause
    exit /b 1
)
