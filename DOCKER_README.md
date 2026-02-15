# 🐳 Docker Setup Guide - Food Delivery App

## Project Structure
- **Backend** (Node.js/Express) - API Server on port 4000
- **Frontend** (React/Vite) - Customer App on port 3000  
- **Admin** (React/Vite) - Admin Dashboard on port 3001
- **MongoDB** - Database on port 27017

## Prerequisites
- Docker (v20.10+)
- Docker Compose (v2.0+)
- Windows, macOS, or Linux

## Quick Start

### 1️⃣ Clone Configuration
```bash
# Copy environment file
cp .env.example .env
```

### 2️⃣ Update Environment Variables
Edit `.env` with your actual configuration:
```env
MONGO_PASSWORD=your_secure_password
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
VITE_API_URL=http://localhost:4000
```

### 3️⃣ Build & Start Services
```bash
# Production mode (optimized builds)
docker-compose up --build

# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up --build
```

### 4️⃣ Access Applications
- **Frontend** (Customer): http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **API**: http://localhost:4000
- **MongoDB**: localhost:27017

## Available Commands

### Start Services
```bash
# Production - Build and start
docker-compose up --build

# Production - Start without rebuilding
docker-compose up

# Development - With volumes for code changes
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose up -d
```

### Stop Services
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (careful - deletes data!)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin
docker-compose logs -f mongodb

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Rebuild Specific Service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
docker-compose up -d --build admin
```

### Access Container Shell
```bash
# Backend
docker exec -it food_backend /bin/sh

# Frontend
docker exec -it food_frontend /bin/sh

# Admin
docker exec -it food_admin /bin/sh

# MongoDB
docker exec -it food_mongodb mongosh -u admin -p password
```

## Database Management

### Connect to MongoDB
```bash
# Using docker exec
docker exec -it food_mongodb mongosh -u admin -p password

# Or from your application
mongodb://admin:password@mongodb:27017/fooddb?authSource=admin
```

### Backup Database
```bash
docker exec food_mongodb mongodump --out /data/db_backup --username admin --password password --authenticationDatabase admin
```

### Restore Database
```bash
docker exec food_mongodb mongorestore /data/db_backup --username admin --password password --authenticationDatabase admin
```

## Production Deployment

### Build Images Only (without starting)
```bash
docker-compose build
```

### Push to Registry
```bash
# Tag images
docker tag food-backend:latest your-registry/food-backend:latest
docker tag food-frontend:latest your-registry/food-frontend:latest
docker tag food-admin:latest your-registry/food-admin:latest

# Push to registry (Docker Hub, AWS ECR, etc.)
docker push your-registry/food-backend:latest
docker push your-registry/food-frontend:latest
docker push your-registry/food-admin:latest
```

### Docker Hub Deployment Example
```bash
# Login to Docker Hub
docker login

# Build and push
docker-compose build
docker tag food-backend:latest yourusername/food-backend:1.0.0
docker push yourusername/food-backend:1.0.0
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Change port in docker-compose.yml
# Change "3000:3000" to "3002:3000"
```

### Containers Won't Start
```bash
# Check logs
docker-compose logs -f

# Rebuild everything
docker-compose down -v
docker-compose up --build

# Clean dangling images
docker image prune -a
```

### Database Connection Issues
```bash
# Verify MongoDB is running
docker-compose ps

# Test connection
docker exec food_backend curl http://mongodb:27017

# Check MongoDB logs
docker-compose logs mongodb
```

### Memory Issues on Windows
- Increase Docker Desktop memory allocation:
  - Settings → Resources → Memory (recommended: 4GB+)
  - Swap: 1GB+

### Volumes Not Syncing (Development)
```bash
# Restart Docker
docker-compose down
docker-compose -f docker-compose.dev.yml up

# Or rebuild
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

## Performance Optimization

### Multi-stage Builds
All Dockerfiles use multi-stage builds to reduce final image size:
- Smaller images = faster deployment
- Better security = less vulnerable software

### Caching Strategy
```bash
# Clean up unused resources
docker system prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune -a
```

## Security Best Practices

1. **Change Default Passwords**
   - Update `MONGO_PASSWORD` in `.env`
   - Update `JWT_SECRET` with a strong key

2. **Use .env for Secrets** ✅
   - Never commit `.env` to git
   - Use `.env.example` for templates

3. **Network Isolation** ✅
   - Services communicate via Docker network
   - Only exposed ports are accessible externally

4. **Health Checks** ✅
   - All services include health checks
   - Docker automatically restarts unhealthy containers

5. **Non-root User** (Future Enhancement)
   - Run containers as non-root for better security

## Development Workflow

### Make Code Changes
```bash
# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Changes in frontend/, admin/, backend/src reflect automatically
```

### Run Database Migrations
```bash
docker exec -it food_backend npm run migrate
```

### Install New Dependencies
```bash
# Stop containers
docker-compose down

# Update package.json
# Then rebuild
docker-compose up --build
```

## File Structure
```
FOOD/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
├── admin/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml (Production)
├── docker-compose.dev.yml (Development)
├── .env.example
└── README.md
```

## Support & Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)
- [Node.js Docker](https://hub.docker.com/_/node)
- [Nginx Docker](https://hub.docker.com/_/nginx)

## License
Your Project License Here

---

**Happy containerizing! 🚀**
