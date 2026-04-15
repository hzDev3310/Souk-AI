#!/bin/bash

# Check if .env exists, if not create it
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "🧹 Cleaning up existing processes and containers..."
docker compose down >/dev/null 2>&1 || true
fuser -k 5173/tcp >/dev/null 2>&1 || true
fuser -k 5174/tcp >/dev/null 2>&1 || true
fuser -k 8000/tcp >/dev/null 2>&1 || true

# Start Docker containers in the background
echo "🚀 Starting Docker containers (Nginx, PHP, MySQL)..."
docker compose up -d

# Wait a few seconds for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 2

# Run the development environment (React/Vite, Queues, Logs)
echo "✨ Starting Frontend (Vite) and Backend development tools..."
echo "Press Ctrl+C to stop the development servers (Docker will keep running in background)."
docker compose exec app composer dev




echo "projoct runnig on http://localhost:8000"
