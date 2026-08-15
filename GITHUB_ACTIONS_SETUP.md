# ⚙️ GitHub Actions Deployment Setup

## 📋 Prerequisites

1. **GitHub Repository** - Fork atau push ke GitHub
2. **Shared Hosting dengan SSH Access** atau VPS
3. **SSH Key Pair** - Untuk secure connection

---

## 🔐 Setup GitHub Actions Secrets

Go to your GitHub Repository → Settings → Secrets and Variables → Actions

Add these secrets:

### **1. SERVER_HOST**
- **Value**: Your server IP or domain (e.g., `192.168.1.1` or `ssh.your-hosting.com`)
- **Description**: SSH host address

### **2. SERVER_USER**
- **Value**: Your SSH username (e.g., `root`, `ubuntu`, or `cpanel-user`)
- **Description**: SSH username for deployment

### **3. SERVER_SSH_KEY**
Generate SSH key pair if you don't have one:

```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f ~/.ssh/sikembang_deploy -C "sikembang-deploy"

# Copy private key (for GitHub secrets)
cat ~/.ssh/sikembang_deploy
```

- **Value**: Content of private key (`~/.ssh/sikembang_deploy`)
- **Description**: RSA private key (keep this secret!)

### **4. DEPLOY_PATH**
- **Value**: Full path to your project on server (e.g., `/home/username/public_html/sikembang`)
- **Description**: Path where SiKembang is deployed

### **5. SERVER_SSH_PORT** (Optional)
- **Value**: SSH port (default is `22`)
- **Description**: SSH port number

### **6. SLACK_WEBHOOK_URL** (Optional)
Get from Slack Workspace → Apps → Incoming Webhooks
- **Value**: Your Slack webhook URL
- **Description**: For deployment notifications

---

## 🚀 First-Time Setup on Server

1. **Generate SSH Key Pair**:
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/sikembang_deploy
   ```

2. **Copy Public Key to Server**:
   ```bash
   ssh-copy-id -i ~/.ssh/sikembang_deploy.pub username@your-server.com
   ```

   Or manually add to `~/.ssh/authorized_keys`:
   ```bash
   cat ~/.ssh/sikembang_deploy.pub | ssh username@your-server.com "cat >> ~/.ssh/authorized_keys"
   ```

3. **Verify Connection**:
   ```bash
   ssh -i ~/.ssh/sikembang_deploy username@your-server.com "echo 'Connected!'"
   ```

4. **Setup Project Directory**:
   ```bash
   ssh -i ~/.ssh/sikembang_deploy username@your-server.com << 'EOF'
   mkdir -p /path/to/sikembang
   cd /path/to/sikembang
   git init
   git remote add origin https://github.com/your-username/SiKembang.git
   git pull origin main
   EOF
   ```

---

## 📝 Environment Variables on Server

Create `.env` file on your server:

```bash
ssh username@your-server.com
cd /path/to/sikembang

cat > .env.production << 'EOF'
APP_NAME=SiKembang
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=sikembang_prod
DB_USERNAME=sikembang_user
DB_PASSWORD=your-secure-password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password

GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_REDIRECT=https://your-domain.com/auth/google/callback
EOF
```

---

## 🔑 SSH Key Setup Details

### On Local Machine (Generate Keys)
```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/sikembang_deploy -C "sikembang@github"

# Output:
# ~/.ssh/sikembang_deploy (private key - for GitHub)
# ~/.ssh/sikembang_deploy.pub (public key - for server)

# View private key for GitHub secrets
cat ~/.ssh/sikembang_deploy
```

### Copy to GitHub Secrets
1. Go to GitHub Repo → Settings → Secrets and Variables → Actions
2. New Repository Secret
3. Name: `SERVER_SSH_KEY`
4. Paste entire content of private key

### On Server (Add Public Key)
```bash
# Option 1: Using ssh-copy-id
ssh-copy-id -i ~/.ssh/sikembang_deploy.pub username@your-server.com

# Option 2: Manual
ssh username@your-server.com
cat >> ~/.ssh/authorized_keys << 'EOF'
<paste-content-of-sikembang_deploy.pub>
EOF
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

---

## ✅ Test Deployment

### Manual SSH Test
```bash
ssh -i ~/.ssh/sikembang_deploy -p 22 username@your-server.com "cd /path/to/sikembang && pwd"
```

### Trigger GitHub Action
1. Push code to `main` branch
2. Go to GitHub Repo → Actions
3. See workflow running
4. Check logs if any issues

### View Deployment Logs
```bash
# On your server
cd /path/to/sikembang
git log --oneline -5

# Check if files updated
ls -la

# Check Laravel logs
tail -f storage/logs/laravel.log
```

---

## 🐛 Troubleshooting

### Error: "Permission denied (publickey)"
```
Solution: Check if public key is properly added to server authorized_keys
ssh-copy-id -i ~/.ssh/sikembang_deploy.pub username@your-server.com
```

### Error: "No such file or directory"
```
Solution: DEPLOY_PATH doesn't exist. Create it first:
ssh username@your-server.com "mkdir -p /path/to/sikembang && cd /path/to/sikembang && git init"
```

### Error: "proc_open not available" (still?)
```
Solution: This should be fixed by --ignore-platform-req=proc-open flag
If still error, check your server PHP version and extensions
php -r "system('which proc_open');"  # Check if enabled
```

### Deployment stuck/slow
```
Solution: Check GitHub Actions logs
- Go to Actions tab
- Click on workflow run
- View logs for each step
```

---

## 🔄 CI/CD Pipeline Flow

```
1. Push code to main branch
   ↓
2. GitHub Actions triggers
   ↓
3. Checkout code
   ↓
4. Setup PHP + Node
   ↓
5. Install dependencies (with proc_open flag)
   ↓
6. Build frontend assets
   ↓
7. SSH into server
   ↓
8. Pull latest code
   ↓
9. Run migrations
   ↓
10. Clear caches
   ↓
11. Deploy complete ✅
```

---

## 💡 Security Best Practices

1. **Never commit .env files**
   ```bash
   # Verify in .gitignore
   cat .gitignore | grep .env
   ```

2. **Rotate SSH keys periodically**
   ```bash
   # Generate new key every 6-12 months
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/sikembang_deploy_v2
   ```

3. **Limit SSH key permissions**
   ```bash
   chmod 600 ~/.ssh/sikembang_deploy
   chmod 644 ~/.ssh/sikembang_deploy.pub
   ```

4. **Use SSH key with passphrase**
   ```bash
   ssh-keygen -t rsa -b 4096 -f ~/.ssh/sikembang_deploy -N "your-passphrase"
   ```
   (Note: GitHub Actions can't handle passphrased keys, use without passphrase)

5. **Restrict SSH key to specific IP**
   ```bash
   # In ~/.ssh/authorized_keys on server
   from="192.168.1.100" ssh-rsa AAAA...rest of key
   ```

---

## 📞 Advanced Configuration

### Deploy to Multiple Servers
Create multiple workflows or modify deploy.yml:

```yaml
strategy:
  matrix:
    server:
      - { host: "${{ secrets.SERVER_HOST_1 }}", user: "${{ secrets.SERVER_USER_1 }}" }
      - { host: "${{ secrets.SERVER_HOST_2 }}", user: "${{ secrets.SERVER_USER_2 }}" }
```

### Conditional Deployment
Only deploy on specific conditions:

```yaml
if: |
  github.ref == 'refs/heads/main' &&
  github.event_name == 'push' &&
  !contains(github.event.head_commit.message, '[skip-deploy]')
```

### Slack Notifications
Already included in deploy.yml. Just add `SLACK_WEBHOOK_URL` secret.

---

**Version**: 1.0
**Last Updated**: 2026-08-15
