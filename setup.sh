#!/bin/bash
echo "Setting up SkillShare..."
echo

echo "Installing backend dependencies..."
cd backend
npm install
echo

echo "Installing frontend dependencies..."
cd ../frontend
npm install
echo

echo "Creating environment file..."
cd ../backend
if [ ! -f .env ]; then
    echo "MONGODB_URI=mongodb+srv://skillshare:0000@cluster0.kospmpf.mongodb.net/skillshare?retryWrites=true&w=majority&appName=Cluster0" > .env
    echo "JWT_SECRET=skillshare-secret-key-2024-production" >> .env
    echo "PORT=5000" >> .env
    echo "NODE_ENV=development" >> .env
    echo "Environment file created!"
else
    echo "Environment file already exists!"
fi
echo

echo "Setup complete! Run './run.sh' to start the app."
