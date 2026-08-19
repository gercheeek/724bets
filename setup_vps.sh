#!/bin/bash
set -e
echo "Setting up Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs build-essential
echo "Setting up backend directory..."
mkdir -p /opt/724bets-backend
mv /root/deploy.tar.gz /opt/724bets-backend/
cd /opt/724bets-backend
tar -xzf deploy.tar.gz
echo "Installing dependencies..."
npm install
npm install -g pm2
echo "Starting backend..."
pm2 start socket_server.cjs --name "724bets-api" || pm2 restart "724bets-api"
pm2 save
pm2 startup
echo "Setup complete."
