# 🔧 Quick Fix: proc_open Not Available Error

## 🚨 Error Message
```
ERROR: install: In Process.php line 147:

The Process class relies on proc_open, which is not available on your PHP installation.
```

---

## ✅ Instant Fix

### **Option 1: Use Flag (Fastest)**
```bash
composer install --ignore-platform-req=proc-open --prefer-dist --no-dev
```

### **Option 2: Update composer.json**
Add this to your `composer.json`:
```json
{
  "config": {
    "ignore-platform-req": ["proc-open"],
    "platform": {
      "php": "8.2.0"
    }
  }
}
```

Then run:
```bash
composer install --prefer-dist --no-dev
```

### **Option 3: Docker (Best for Production)**
```bash
docker run --rm -v $(pwd):/app \
  -w /app \
  composer:latest \
  install --ignore-platform-req=proc-open --prefer-dist --no-dev
```

---

## 🚀 Complete Deployment Flow (Fixed)

### **On Local Machine**
```bash
# 1. Pull latest
git pull origin main

# 2. Install with flag
composer install --ignore-platform-req=proc-open --prefer-dist --no-dev

# 3. Build assets
npm ci && npm run build

# 4. Commit (don't commit vendor/)
git add .
git commit -m "Build: frontend assets and config"
git push origin main
```

### **On Server (SSH)**
```bash
cd /path/to/sikembang

# 1. Pull latest
git pull origin main

# 2. Install dependencies with flag
composer install \
  --ignore-platform-req=proc-open \
  --prefer-dist \
  --no-dev \
  --no-interaction \
  --optimize-autoloader

# 3. Setup environment
cp .env.example .env
php artisan key:generate --force

# 4. Database setup
php artisan migrate --force

# 5. Build assets (if not already built)
npm ci
npm run build

# 6. Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

---

## 📋 Checklist

- [ ] Composer install dengan `--ignore-platform-req=proc-open` flag ✓
- [ ] Assets built dengan `npm run build` ✓
- [ ] Migrations run dengan `php artisan migrate --force` ✓
- [ ] Cache optimized dengan `php artisan config:cache` ✓
- [ ] Permissions set correctly ✓
- [ ] `.env` configured for production ✓

---

## 🆘 Still Getting Error?

### Check PHP Extensions
```bash
php -m | grep -E 'proc|json|dom|pdo'
```

### Check proc_open specifically
```bash
php -r "echo function_exists('proc_open') ? 'OK' : 'DISABLED';"
```

### Check disable_functions
```bash
php -r "echo ini_get('disable_functions');"
```

### Contact Host Provider
If `proc_open` is in `disable_functions`, you need to:
1. Ask host provider to enable it
2. Or use Docker (if available)
3. Or use different hosting

---

## 📝 composer.json Already Has Platform Config

Your `composer.json` already has:
```json
"config": {
  "platform": {
    "php": "8.2.0"
  }
}
```

This helps with platform compatibility. Just use the `--ignore-platform-req=proc-open` flag.

---

## 🎯 One-Command Fix

```bash
composer install \
  --ignore-platform-req=proc-open \
  --ignore-platform-req=ext-mbstring \
  --ignore-platform-req=ext-pdo \
  --prefer-dist \
  --no-dev \
  --no-interaction \
  --optimize-autoloader
```

---

## 💡 Pro Tips

### For Shared Hosting
```bash
# Most reliable method
bash deploy.sh
```

The `deploy.sh` script already has all the fixes built-in.

### For CI/CD (GitHub Actions)
Already fixed in `.github/workflows/deploy.yml`

The workflow uses:
```yaml
composer install \
  --ignore-platform-req=proc-open \
  --no-dev \
  --no-interaction
```

### For Development
```bash
# No flags needed in local development
composer install
npm install
npm run dev
```

---

## ❓ FAQ

**Q: Why is proc_open disabled?**
A: Security measure on shared hosting to prevent users from running arbitrary system processes.

**Q: Is it safe to ignore proc_open?**
A: Yes, it's only used by Composer for parallel downloads and optimization. Your app doesn't need it at runtime.

**Q: Does this affect app performance?**
A: No, only deployment. Runtime performance is unaffected.

**Q: Can I enable proc_open on my server?**
A: Usually no on shared hosting. On VPS/Dedicated, contact your provider.

**Q: What if I use Docker?**
A: Docker images typically have proc_open enabled. No issues there.

---

## 🎓 Learn More

- [Composer Documentation](https://getcomposer.org/doc/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Version**: 1.0
**Last Updated**: 2026-08-15
**Status**: ✅ READY FOR DEPLOYMENT
