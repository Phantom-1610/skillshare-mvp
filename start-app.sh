#!/bin/bash

echo "Starting SkillShare PWA..."
echo

echo "Installing dependencies..."
npm install
npm run install-all

echo
echo "Starting servers..."
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo

# Start backend in background
cd backend && node src/working-server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Servers are starting..."
echo "Open your browser and go to: http://localhost:3000"
echo
echo "Demo Login Credentials:"
echo "Email: john@example.com"
echo "Password: password123"
echo

# Wait for user to stop
echo "Press Ctrl+C to stop all servers"
wait

