@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found on PATH.
  echo Try opening index.html directly from this folder.
  pause
  exit /b 1
)
start "AI Health Preview Server" /min node preview-server.js
timeout /t 2 /nobreak >nul
start "" "http://localhost:4173/index.html"
