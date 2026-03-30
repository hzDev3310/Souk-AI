#!/bin/bash

echo "🚀 Starting Souk-AI Docker containers..."
docker compose up -d --build

echo "📦 Installing Composer dependencies..."
docker compose exec -T app composer install

echo "📦 Installing Node.js dependencies..."
docker compose exec -T app npm install

# Check if .env exists, if not, create it
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    docker compose exec -T app php artisan key:generate
fi

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🗄️ Running database migrations..."
docker compose exec -T app php artisan migrate --force

echo "🏗️ Building frontend assets..."
docker compose exec -T app npm run build

echo "👤 Creating default admin curator account..."
docker compose exec -T app php artisan tinker --execute="
if (!App\Models\User::where('email', 'admin@souk.ai')->exists()) {
    \$user = new App\Models\User;
    \$user->id = (string) Illuminate\Support\Str::uuid();
    \$user->name = 'Master Curator';
    \$user->email = 'admin@souk.ai';
    \$user->password = bcrypt('123456');
    \$user->role = App\Enums\UserRole::ADMIN;
    \$user->save();

    \$admin = new App\Models\Admin;
    \$admin->user_id = \$user->id;
    \$admin->platform_commission_admin = 10.00;
    \$admin->platform_commission_share = 5.00;
    \$admin->save();

    echo 'Master Curator created successfully!';
} else {
    echo 'Master Curator already exists, skipping creation.';
}
"

echo "✅ Souk.AI is ready at http://localhost:8000"
