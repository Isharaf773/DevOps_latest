#!/bin/sh
# Food Delivery App - start script (Linux / macOS / WSL / Git Bash)
#   sh start.sh          -> production-style stack (nginx, built images)
#   sh start.sh dev      -> development stack with hot reload
#   sh start.sh down     -> stop everything
set -e

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed. Install Docker Desktop / Docker Engine first."; exit 1
fi

if docker compose version >/dev/null 2>&1; then
    DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DC="docker-compose"
else
    echo "Docker Compose is not installed."; exit 1
fi

rand() { (openssl rand -hex "$1" 2>/dev/null) || (head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'); }

if [ ! -f .env ]; then
    echo ".env not found - creating it from .env.example with random secrets"
    cp .env.example .env
    sed -i.bak "s/change_me_to_a_long_random_string/$(rand 32)/; s/change_me_mongo_password/$(rand 12)/" .env && rm -f .env.bak
    echo "Created .env (edit it to add STRIPE_SECRET_KEY etc.)"
fi

case "${1:-prod}" in
    prod) $DC up -d --build
          echo ""
          echo "Frontend: http://localhost:3000"
          echo "Admin:    http://localhost:3001"
          echo "API:      http://localhost:4000/health" ;;
    dev)  $DC -f docker-compose.dev.yml up --build ;;
    down) $DC down ;;
    *)    echo "Usage: sh start.sh [prod|dev|down]"; exit 1 ;;
esac
