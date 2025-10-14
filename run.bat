@echo off
echo Starting SkillShare...
start "Backend" cmd /k "cd /d %~dp0backend && node src/server.js"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo App running!
pause

