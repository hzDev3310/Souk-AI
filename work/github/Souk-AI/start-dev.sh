#!/bin/bash

# 1. Start Docker containers in background
echo "🚀 Starting Souk-AI in Development Mode..."
docker compose up -d

# 2. Key Check: If node_modules is missing, install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules missing. Installing dependencies inside container..."
    docker compose exec app npm install
fi

# 3. DB Check: Ensure .env and basic setup
if [ ! -f .env ]; then
    echo "📄 Initializing .env environment..."
    cp .env.example .env
    docker compose exec app php artisan key:generate
fi

# 4. Starting the Dev Server in Foreground (Crucial for HMR)
echo "⚡ Starting Vite Development Server (HMR)..."
echo "💡 INFO: Keeping this terminal open ensures Hot Reloading works."
echo "💡 INFO: Press Ctrl+C to stop."
echo "------------------------------------------------------------"

# Run Vite in foreground so the user sees logs and HMR stays active
docker compose exec app npm run dev
