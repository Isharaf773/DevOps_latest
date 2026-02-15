#!/bin/bash
# Food Delivery App - Docker Start Script
# Usage: ./start.sh or bash start.sh

set -e

echo "╔════════════════════════════════════════════╗"
echo "║ 🍔 Food Delivery App - Docker Startup     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your actual values."
    echo "📝 Edit .env and add your credentials, then run this script again."
    exit 0
fi

# Ask user for deployment mode
echo "Select deployment mode:"
echo "1) Production (optimized builds)"
echo "2) Development (with hot reload)"
echo ""
read -p "Enter choice [1-2]: " choice

echo ""
echo "Starting services..."
echo ""

case $choice in
    1)
        echo "🚀 Starting in PRODUCTION mode..."
        docker-compose up --build
        ;;
    2)
        echo "🔧 Starting in DEVELOPMENT mode (hot reload enabled)..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac
