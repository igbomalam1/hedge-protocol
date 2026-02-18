# VPS Setup Guide for Hedgehogs Worker

This guide will help you set up your Hostinger VPS to run the `hedge-worker` 24/7.

## Prerequisites
- A VPS (Ubuntu 22.04 or 24.04 recommended) from Hostinger.
- Access to the VPS terminal (via SSH or Hostinger Browser Terminal).
- Your GitHub URL: `https://github.com/igbomalam1/hedge-protocol`
- Your `.env` file contents (Private Keys, API Keys).

## Step 1: Update System & Install Tools
Run these commands one by one in your VPS terminal:

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Git and Curl
sudo apt install git curl -y
```

## Step 2: Install Node.js (Version 20)
We use NodeSource to get the latest stable Node.js.

```bash
# Download setup script
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify install
node -v
# Should show v20.x.x
```

## Step 3: Install Process Manager (PM2)
PM2 ensures your worker stays alive forever and restarts if it crashes.

```bash
sudo npm install -g pm2
```

## Step 4: Clone Your Repository

```bash
# Clone the project
git clone https://github.com/igbomalam1/hedge-protocol.git

# Enter the directory
cd hedge-protocol
```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Configure Environment
You need to create the `.env` file with your keys.

```bash
# Open nano editor
nano .env
```

**Paste your `.env` content here.** (Right-click to paste in most terminals).
Make sure it includes:
- `PRIVATE_KEY=...`
- `NEXT_PUBLIC_RECEIVER_ADDRESS=...`
- `INFURA_IDS=...`
- `TG_BOT_TOKEN=...`
- `TG_CHAT_ID=...`

Press `Ctrl+X`, then `Y`, then `Enter` to save and exit.

## Step 7: Start the Worker
We use the `ecosystem.config.js` file I just verified/pushing to the repo.

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save the process list so it starts on reboot
pm2 save
pm2 startup
```

*(Copy/paste the command output by `pm2 startup` if it asks you to run one)*

## Managing the Worker

- **View Logs**: `pm2 logs hedge-worker`
- **Stop Worker**: `pm2 stop hedge-worker`
- **Restart Worker**: `pm2 restart hedge-worker`
- **Check Status**: `pm2 status`

Your worker is now running 24/7! 🚀
