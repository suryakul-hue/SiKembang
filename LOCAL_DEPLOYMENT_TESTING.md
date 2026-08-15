# 🧪 Local Deployment Testing Guide

## 🎯 Goal
Test that your deployment scripts work correctly BEFORE deploying to production.

---

## ✅ Pre-Test Checklist

- [ ] You have Docker installed (optional but recommended)
- [ ] You have SSH access to test server (or using local testing)
- [ ] You have copied all files in this repo
- [ ] Node.js 18+ installed locally
- [ ] PHP 8.2+ installed locally

---

## 🔬 Method 1: Local Testing (Fastest)

### **Test Composer Install with Flag**
```bash
# In your SiKembang directory
rm -rf vendor  # Remove vendor to test fresh install

# Test the exact command that will run on server
composer install \
  --ignore-platform-req=proc-open \
  --prefer-dist \
  --no-dev \
  --no-interaction \
  --optimize-autoloader

# If successful, you see:
# "Installing dependencies from lock file"
# "✓ Composer finished successfully"
```

### **Test Full Deploy Script**
```bash
# Create test environment
cp .env.example .env.test
sed -i 's/APP_ENV=local/APP_ENV=testing/' .env.test

# Run deploy script (with test mode)
APP_ENV=testing bash deploy.sh

# Check output for:
# ✓ Installing composer dependencies
# ✓ Installing database migrations
# ✓ Building frontend assets
# ✓ Optimizing application
# ✓ Deployment completed successfully!
```

### **Test Asset Build**
```bash
# Clear node_modules to test fresh install
rm -rf node_modules

# Test build
npm ci  # Clean install (like CI/CD does)
npm run build

# Verify output:
ls -la public/build/
# Should show manifest.json, *.js, *.css files
```

---

## 🐳 Method 2: Docker Testing (Most Realistic)

### **Test in Docker Container (Simulates Shared Hosting)**

**Create `Dockerfile.test`:**
```dockerfile
FROM php:8.2-cli

# Simulate shared hosting (disable proc_open)
RUN echo "disable_functions = proc_open,proc_close,proc_get_status,proc_nice,proc_open,proc_terminate" \
    >> /usr/local/etc/php/php.ini

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip nodejs npm \
    libpq-dev sqlite3 \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy project
COPY . .

# Run deployment test
CMD bash deploy.sh
```

**Test it:**
```bash
# Build test image
docker build -f Dockerfile.test -t sikembang-test .

# Run test
docker run --rm sikembang-test

# Expected output:
# 🚀 Deploying SiKembang...
# 📦 Installing composer dependencies...
# [vendor files being installed]
# ✅ Deployment completed successfully!
```

---

## 🔗 Method 3: Test SSH to Staging Server

### **If you have a staging/test server:**

```bash
# 1. SSH to staging server
ssh user@staging-server.com

# 2. Create test directory
mkdir -p ~/sikembang-test
cd ~/sikembang-test

# 3. Clone the repo
git clone https://github.com/your-username/SiKembang.git .

# 4. Run deploy script
bash deploy.sh

# 5. Verify
curl http://localhost:8000
# or
php artisan serve

# 6. Check logs
tail -f storage/logs/laravel.log
```

---

## 🔍 Verification Steps

After running any test method, verify:

### **1. Composer Install Success**
```bash
ls -la vendor/
# Should show many directories and files

composer info
# Should list all installed packages
```

### **2. Assets Built**
```bash
ls -la public/build/
# Should show:
# - manifest.json
# - app-*.js
# - app-*.css
```

### **3. Database Ready**
```bash
ls -la database/
# Should show database.sqlite (if using SQLite)

php artisan migrate:status
# Should show all migrations as "Ran"
```

### **4. Environment**
```bash
php artisan config:show
# Should show APP_ENV=production

php artisan env
# Should output: production
```

### **5. Cache**
```bash
ls -la bootstrap/cache/
# Should show:
# - config.php
# - routes.php
# - events.php
```

---

## 🧩 Test Each Component

### **Test 1: Composer (With proc_open disabled)**
```bash
# Simulate disabled proc_open
php -d disable_functions=proc_open -r "
\$proc = new \stdClass();
echo 'proc_open ' . (function_exists('proc_open') ? 'enabled' : 'disabled') . PHP_EOL;
"

# Output: proc_open disabled ✓

# Try composer install anyway
composer install --ignore-platform-req=proc-open

# Should work fine ✓
```

### **Test 2: Database Migrations**
```bash
php artisan migrate:refresh
# Should show all migrations running

php artisan tinker
>>> DB::connection()->getPdo()
# Should return PDO object

>>> User::count()
# Should return number (0 if no users yet)
```

### **Test 3: Frontend Routes**
```bash
php artisan serve

# Then in browser:
# http://localhost:8000         ← Welcome page
# http://localhost:8000/login   ← Login page  
# http://localhost:8000/dashboard ← Dashboard (requires auth)
```

### **Test 4: API Endpoints**
```bash
# Test health check
curl http://localhost:8000/up
# Response: {"status":"ok"}

# Test API (if you have API routes)
curl http://localhost:8000/api/recipes
```

---

## 📊 Test Report Template

After testing, create a report:

```markdown
## Deployment Test Report - 2026-08-15

### Environment
- PHP Version: 8.2.0
- Node Version: 22.0.0
- Server: Shared Hosting / Docker / Local
- proc_open Status: DISABLED

### Tests Performed
- [x] Composer Install (with flag)
- [x] npm Install & Build
- [x] Database Migrations
- [x] Asset Build Verification
- [x] Environment Configuration
- [x] Cache Configuration

### Results
✅ All tests passed

### Issues Found
None

### Ready for Production?
✅ YES - Ready to deploy

### Next Steps
1. Deploy to production server
2. Run migrations
3. Verify domain works
4. Monitor logs for errors
```

---

## ⚡ Quick Test Commands

Run these one by one:

```bash
# 1. Fresh install test
rm -rf vendor && composer install --ignore-platform-req=proc-open

# 2. Build test
rm -rf node_modules && npm ci && npm run build

# 3. Database test
php artisan migrate --force

# 4. Serve test (5 seconds)
timeout 5 php artisan serve || true

# 5. Summary
echo "✅ All tests completed!"
echo "Ready for deployment? YES"
```

---

## 🐛 Debugging Tests

### If Composer Install Fails
```bash
# Check PHP info
php -i | grep -A 5 "disable_functions"

# Try with verbose output
composer install \
  --ignore-platform-req=proc-open \
  -vvv

# See detailed error messages
```

### If Build Fails
```bash
# Check npm issues
npm audit

# Try clean build
rm -rf node_modules package-lock.json
npm ci --verbose
npm run build --verbose
```

### If Migration Fails
```bash
# Check database exists
ls -la database/database.sqlite

# Check connection
php artisan tinker
>>> DB::connection()->getDriverName()
>>> DB::connection()->getPdo()

# See migration details
php artisan migrate:status
```

---

## 🎯 Test Success Criteria

✅ Test is successful if ALL of these work:

1. **Composer Install** - No errors with `--ignore-platform-req=proc-open`
2. **npm Build** - Assets built in `public/build/`
3. **Database** - Migrations run successfully
4. **Routes** - Can visit `/` and `/login` without errors
5. **Cache** - Config and routes cached
6. **Logs** - No ERROR entries in recent logs

---

## 🚀 Ready for Production?

After all tests pass:

```bash
# 1. Clean up test files
rm -rf .env.test

# 2. Commit test results
git add .
git commit -m "test: deployment verification complete"

# 3. Push to production
git push origin main

# 4. Deploy to server (via GitHub Actions or manual)
bash deploy.sh  # On server
```

---

## 📝 Pro Tips

1. **Always test in clean environment**
   ```bash
   git clone repo /tmp/test-sikembang
   cd /tmp/test-sikembang
   bash deploy.sh
   ```

2. **Use Docker to simulate exact host environment**
   ```bash
   docker run -it php:8.2-cli bash
   # Inside container
   php -d disable_functions=proc_open -r "composer install --help"
   ```

3. **Test migrations don't have side effects**
   ```bash
   php artisan migrate:reset
   php artisan migrate
   php artisan migrate:reset
   php artisan migrate  # Should work twice without issues
   ```

4. **Verify .env isn't committed**
   ```bash
   git status | grep .env
   # Should output nothing (not tracked)
   ```

---

## ❓ FAQ

**Q: Should I test on production?**
A: NO! Always test on staging or local first.

**Q: Do I need Docker to test?**
A: No, but it's helpful. Local testing works too.

**Q: How long does testing take?**
A: ~5-10 minutes for full test suite.

**Q: What if tests fail?**
A: Follow debugging steps above or check QUICK_FIX_PROC_OPEN.md

**Q: Do I need to test every push?**
A: No, GitHub Actions does it automatically. But test once before first deploy.

---

**Version**: 1.0
**Status**: Ready to test
**Last Updated**: 2026-08-15
