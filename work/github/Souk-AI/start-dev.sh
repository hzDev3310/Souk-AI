#!/bin/bash

echo "🚀 Starting Souk-AI in Development Mode..."
docker compose up -d

echo "📦 Ensuring dependencies are current..."
docker compose exec -T app composer install
docker compose exec -T app npm install

# Check if .env exists, if not, create it
if [ ! -f .env ]; then
    echo "📄 Initializing environment..."
    cp .env.example .env
    docker compose exec -T app php artisan key:generate
fi

echo "🗄️ Running migrations..."
docker compose exec -T app php artisan migrate --force

echo "⚡ Starting Vite Development Server (HMR)..."
echo "💡 Tip: Keep this terminal open to see frontend changes instantly!"
docker compose exec app npm run dev
