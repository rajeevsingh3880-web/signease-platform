@echo off
echo ========================================================
echo Launching SignEase Modern Frontend (Vite + SPA)...
echo ========================================================
cd /d "%~dp0"

if not exist "node_modules\" (
    echo Installing frontend dependencies (npm install)...
    call npm install
)

echo Starting Vite Frontend Dev Server at http://localhost:5173...
call npm run dev

