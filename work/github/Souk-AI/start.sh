#!/bin/bash

echo "🚀 Starting Souk-AI Docker containers..."
docker compose up -d --build

echo "📦 Installing Composer dependencies..."
docker compose exec app composer install

# Check if .env exists, if not, create it
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
    cp .env.example .env
    docker compose exec app php artisan key:generate
fi

echo "⏳ Waiting for MySQL to be ready..."
sleep 10

echo "🗄️ Running database migrations..."
docker compose exec app php artisan migrate

echo "👤 Creating default admin user..."
docker compose exec app php artisan tinker --execute="
if (!App\Models\User::where('email', 'admin@souk.ai')->exists()) {
    \$user = new App\Models\User;
    \$user->name = 'Admin';
    \$user->email = 'admin@souk.ai';
    \$user->password = bcrypt('123456');
    \$user->role = 'ADMIN';
    \$user->save();

    \$admin = new App\Models\Admin;
    \$admin->user_id = \$user->id;
    \$admin->platform_commission_admin = 10.00;
    \$admin->platform_commission_share = 5.00;
    \$admin->save();

    echo 'Admin user created successfully!';
} else {
    echo 'Admin user already exists, skipping creation.';
}
"
