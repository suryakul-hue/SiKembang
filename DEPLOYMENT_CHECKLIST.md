# SiKembang - Deployment Checklist

## ✅ Fixes Applied

### 1. Authentication Views
- [x] Created `resources/views/auth/login.blade.php`
- [x] Created `resources/views/auth/verify-email.blade.php`
- [x] Created `resources/views/auth/confirm-password.blade.php`
- [x] Created `resources/views/auth/two-factor-challenge.blade.php`
- [x] Created `resources/views/auth/register.blade.php`
- [x] Created `resources/views/auth/reset-password.blade.php`
- [x] Created `resources/views/auth/forgot-password.blade.php`

### 2. Model Relationships
- [x] Added `stuntingRecords()` relationship in User model
- [x] Added `weekReminders()` relationship in User model

### 3. Controller Fixes
- [x] Removed `DailyReminder` reference from AuthenticatedSessionController
- [x] Removed unused `index()` method from AuthenticatedSessionController

### 4. Form Requests
- [x] Fixed ProfileUpdateRequest validation (gender rule was inside email array)

### 5. Configuration
- [x] Created `.env` file from `.env.example`
- [x] Created `database/database.sqlite`

## 🚀 Pre-Deployment Steps

1. **Database Setup** (Run these in terminal)
   ```bash
   php artisan migrate --force
   php artisan db:seed  # if seeders exist
   ```

2. **Asset Build**
   ```bash
   npm run build
   ```

3. **Cache Optimization**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Storage Link**
   ```bash
   php artisan storage:link
   ```

## 📋 Deployment Environment (.env)
Make sure to set these for production:
- `APP_DEBUG=false`
- `APP_ENV=production`
- `APP_KEY=<generated>`
- `DB_CONNECTION=mysql` (if using MySQL instead of SQLite)
- `DB_HOST=<your-host>`
- `DB_DATABASE=<your-db>`
- `DB_USERNAME=<your-user>`
- `DB_PASSWORD=<your-password>`
- Google OAuth credentials if needed

## 🧪 Testing (Optional)
```bash
php artisan test
```

## ⚠️ Important Notes
- All Fortify views now redirect to Inertia React pages
- Using SQLite for development (change to MySQL for production)
- Gender options: 'laki-laki', 'perempuan', 'L', 'P' (for biodata setup)
- Admin middleware configured at `app/Http/Middleware/Admin.php`
- Two-factor authentication available (configured in Fortify)

## ✨ Features Verified
- ✅ Authentication (Login, Register, Password Reset)
- ✅ User Profile Management
- ✅ Stunting Detection & History
- ✅ Recipe Management (Admin only)
- ✅ Weekly Tablet Reminder (for female users)
- ✅ Education Content
- ✅ Hemoglobin Information
- ✅ Google OAuth Integration
- ✅ Role-based Access Control (Admin)

## 📞 Troubleshooting
If you encounter:
1. `PHP OpenSSL error` - Install libssl1.1 (system level)
2. `Migration errors` - Ensure database file exists and is writable
3. `Asset not loading` - Run `npm run build` and `php artisan storage:link`
4. `Class not found` - Run `composer dump-autoload`
