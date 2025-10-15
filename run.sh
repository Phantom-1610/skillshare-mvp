#!/bin/bash
echo "Starting SkillShare..."
echo

echo "Starting backend server..."
cd backend
node src/server.js &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Waiting for frontend to start..."
sleep 8

echo "Opening browser..."
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
fi

echo "App is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
