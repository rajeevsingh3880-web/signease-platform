@echo off
echo ========================================================
echo Starting SignEase E-Sign Full-Stack Platform
echo Backend: Spring Boot 3.2 (Port 8080)
echo Frontend: Vite SPA (Port 5173)
echo Database: PostgreSQL (Port 5432)
echo ========================================================

start "SignEase Backend (Spring Boot)" cmd /k "cd /d %~dp0backend && call run-dev.bat"
start "SignEase Frontend (Vite SPA)" cmd /k "cd /d %~dp0frontend && call run-frontend.bat"

echo.
echo Services launched in separate windows!
echo Frontend will be accessible at: http://localhost:5173
echo Backend REST API accessible at: http://localhost:8080
echo.

