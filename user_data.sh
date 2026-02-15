#!/bin/bash
set -e

echo "🚀 Initializing Food Delivery Server..."

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt-get install -y git

# Add ec2-user to docker group
sudo usermod -aG docker ubuntu

# Clone repository
cd /home/ubuntu
sudo -u ubuntu git clone ${docker_compose_url} food-delivery
cd food-delivery

# Create environment file
sudo tee /home/ubuntu/food-delivery/.env > /dev/null <<EOF
NODE_ENV=production
MONGO_URI=mongodb+srv://foodstack:123456789ABC@cluster0.meh5b9n.mongodb.net/food
JWT_SECRET=$(openssl rand -hex 32)
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_API_URL=http://localhost:4000
EOF

# Set permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/food-delivery

# Start services
cd /home/ubuntu/food-delivery
sudo -u ubuntu docker-compose up -d

echo "✅ Server initialization complete!"
echo "Frontend: http://$(hostname -I):3000"
echo "Backend: http://$(hostname -I):4000"
echo "Admin: http://$(hostname -I):3001"
