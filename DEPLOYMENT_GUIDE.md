# 🚀 Deployment Guide untuk SiKembang

## ⚠️ Masalah: proc_open Disabled di Shared Hosting

Jika Anda mengalami error:
```
The Process class relies on proc_open, which is not available on your PHP installation.
```

Ini adalah masalah umum di **Shared Hosting** (cPanel, Plesk, dll) karena keamanan.

---

## ✅ Solusi Cepat

### **Untuk GitHub Actions Workflow**
Jika Anda menggunakan GitHub Actions untuk deployment, update workflow Anda:

```yaml
- name: Install Composer Dependencies
  run: |
    composer install \
      --prefer-dist \
      --ignore-platform-req=proc-open \
      --no-dev \
      --no-interaction \
      --optimize-autoloader
```

### **Untuk Shared Hosting (Manual/cPanel)**
1. SSH ke server Anda:
   ```bash
   ssh user@your-domain.com
   cd public_html/sikembang
   ```

2. Jalankan:
   ```bash
   composer install \
     --prefer-dist \
     --ignore-platform-req=proc-open \
     --no-dev \
     --no-interaction \
     --optimize-autoloader
   ```

3. Jalankan deployment script:
   ```bash
   bash deploy.sh
   ```

### **Untuk Shared Hosting (Git Push Auto-Deploy)**
Jika hosting provider Anda mendukung webhook deployment:

1. Buat file `deploy.php` di root:
   ```php
   <?php
   // deploy.php - Hanya untuk testing, hapus setelah deploy
   if ($_GET['token'] === 'your-secret-token') {
       shell_exec('cd ' . __DIR__ . ' && bash deploy.sh');
       echo "Deployment started";
   } else {
       echo "Unauthorized";
   }
   ?>
   ```

2. Konfigurasi webhook di GitHub → Settings → Webhooks → Payload URL:
   ```
   https://your-domain.com/deploy.php?token=your-secret-token
   ```

---

## 🎯 Platform-Specific Guides

### **1. Shared Hosting (cPanel/Plesk) + SSH Access**
```bash
# 1. SSH ke server
ssh user@domain.com

# 2. Navigate ke project
cd public_html/sikembang

# 3. Pull latest code
git pull origin main

# 4. Install dependencies dengan flag proc_open
composer install --prefer-dist --ignore-platform-req=proc-open --no-dev

# 5. Run migrations
php artisan migrate --force

# 6. Build assets
npm ci && npm run build

# 7. Optimize
php artisan config:cache
php artisan route:cache

# Done!
```

### **2. Heroku**
Heroku biasanya tidak ada masalah proc_open. Jika ada:

Create `Procfile`:
```
web: vendor/bin/heroku-php-apache2 public/
```

Create `heroku.yml` (optional):
```yaml
build:
  languages:
    - php
  config:
    PHP_VERSION: 8.2
```

Deploy:
```bash
git push heroku main
```

### **3. AWS Elastic Beanstalk**
1. Create `.ebextensions/composer.config`:
   ```
   commands:
     01_composer_install:
       command: |
         composer install \
           --prefer-dist \
           --no-dev \
           --ignore-platform-req=proc-open \
           --optimize-autoloader
       leader_only: true
   ```

2. Deploy:
   ```bash
   eb deploy
   ```

### **4. DigitalOcean App Platform**
1. Connect GitHub repository
2. Build command:
   ```bash
   composer install --prefer-dist --ignore-platform-req=proc-open --no-dev && npm ci && npm run build
   ```

3. Run command:
   ```bash
   php artisan migrate --force
   ```

### **5. Linode/Akamai Cloud**
1. Deploy via CLI:
   ```bash
   linode-cli linodes create \
     --image linode/ubuntu22.04 \
     --type g6-standard-1 \
     --region us-east
   ```

2. SSH dan setup:
   ```bash
   curl https://raw.githubusercontent.com/suryakul-hue/SiKembang/main/deploy.sh | bash
   ```

### **6. Docker (Recommended untuk Production)**
Create `Dockerfile`:
```dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpq-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Install dependencies
RUN composer install \
    --prefer-dist \
    --no-dev \
    --no-interaction \
    --optimize-autoloader \
    --ignore-platform-req=proc-open

# Build frontend
RUN npm ci && npm run build

# Setup permissions
RUN chown -R www-data:www-data storage bootstrap/cache

CMD ["php-fpm"]
```

Build & Deploy:
```bash
docker build -t sikembang:latest .
docker run -p 8000:9000 sikembang:latest
```

---

## 🔐 Environment Variables

Pastikan `.env` Anda memiliki:

```env
APP_NAME=SiKembang
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-generated-key
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=sikembang
DB_USERNAME=root
DB_PASSWORD=your-password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT=https://your-domain.com/auth/google/callback
```

---

## 📋 Pre-Deployment Checklist

- [ ] `.env` configured for production
- [ ] `APP_KEY` generated (`php artisan key:generate`)
- [ ] Database migrations ready
- [ ] Frontend assets built (`npm run build`)
- [ ] Storage directory writable
- [ ] Session driver set (database/redis)
- [ ] Queue driver set (if using jobs)
- [ ] Mail configured
- [ ] Google OAuth credentials added
- [ ] SSL certificate installed

---

## ❌ Jika Masih Error

### Error: "proc_open not available"
```bash
# Gunakan flag ini
composer install --ignore-platform-req=proc-open
```

### Error: "npm not found"
```bash
# Install Node.js di server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Error: "Permission denied" on storage
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Error: "Database migration failed"
```bash
# Check database connection
php artisan tinker
>>> DB::connection()->getPdo()

# Or reset and re-migrate
php artisan migrate:reset --force
php artisan migrate --force
```

---

## 🆘 Hubungi Support

Jika error persisten:
1. Hubungi hosting provider Anda
2. Minta mereka untuk enable `proc_open`
3. Atau minta untuk custom PHP configuration

Biasanya shared hosting provider bisa enable ini via control panel atau ticket support.

---

## 📞 Quick Command Reference

```bash
# Installation
composer install --ignore-platform-req=proc-open --no-dev

# Database
php artisan migrate --force
php artisan db:seed

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Assets
npm ci
npm run build

# Cleanup
php artisan cache:clear
php artisan session:flush

# Storage
php artisan storage:link

# All in one
bash deploy.sh
```

---

**Version**: SiKembang v1.0 - Deployment Ready
**Last Updated**: 2026-08-15
