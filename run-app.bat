@echo off
echo Starting SkillShare PWA...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && node src/working-server.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo SkillShare PWA is now running!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Login:
echo Email: john@example.com
echo Password: password123
echo.
echo Or click "Quick Demo Login" button
echo.
pause
