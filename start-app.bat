@echo off
echo Starting SkillShare PWA...
echo.

echo Installing dependencies...
call npm install
call npm run install-all

echo.
echo Starting servers...
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.

start "Backend Server" cmd /k "cd backend && node src/working-server.js"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Servers are starting...
echo Open your browser and go to: http://localhost:3000
echo.
echo Demo Login Credentials:
echo Email: john@example.com
echo Password: password123
echo.
pause

