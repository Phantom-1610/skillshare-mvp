@echo off
echo Starting SkillShare...

echo.
echo Starting backend...
cd backend
start "Backend" cmd /k "node src/server.js"
cd ..

timeout /t 3 /nobreak > nul

echo.
echo Starting frontend...
cd frontend
start "Frontend" cmd /k "npm run dev"
cd ..

timeout /t 5 /nobreak > nul

echo.
echo App starting! 
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Opening browser...
start http://localhost:3000

pause


