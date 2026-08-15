#!/bin/bash
# Deploy script untuk Shared Hosting dengan proc_open disabled
# Letakkan file ini di root project (deploy.sh)
# Chmod +x deploy.sh, lalu jalankan: ./deploy.sh

set -e

echo "🚀 Deploying SiKembang..."

# 1. Install composer dependencies (dengan flag untuk skip proc_open)
echo "📦 Installing composer dependencies..."
composer install \
    --prefer-dist \
    --no-dev \
    --ignore-platform-req=proc-open \
    --no-interaction \
    --optimize-autoloader

# 2. Copy .env jika belum ada
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ .env created"
fi

# 3. Generate application key
echo "🔑 Generating application key..."
php artisan key:generate --force

# 4. Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

# 5. Build frontend assets
echo "🎨 Building frontend assets..."
npm ci --prefer-offline
npm run build

# 6. Cache optimization
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Clear old caches
php artisan cache:clear
php artisan session:flush

# 8. Storage link
php artisan storage:link 2>/dev/null || true

echo "✅ Deployment completed successfully!"
