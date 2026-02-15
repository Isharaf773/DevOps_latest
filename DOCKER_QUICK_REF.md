# Docker Quick Reference 🐳

## 🚀 Quick Commands

### Start Everything
```bash
# Windows
.\start.bat

# macOS/Linux
bash start.sh

# Or directly
docker-compose up --build
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f          # All services
docker-compose logs -f backend  # Specific service
```

## 📱 Access Points

| Service | URL | Port |
|---------|-----|------|
| Frontend (User App) | http://localhost:3000 | 3000 |
| Admin Panel | http://localhost:3001 | 3001 |
| Backend API | http://localhost:4000 | 4000 |
| MongoDB | localhost:27017 | 27017 |

## 🛠️ Common Tasks

### Rebuild a Service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
docker-compose up -d --build admin
```

### Shell Access
```bash
docker exec -it food_backend /bin/sh
docker exec -it food_frontend /bin/sh
docker exec -it food_admin /bin/sh
docker exec -it food_mongodb mongosh -u admin -p password
```

### View Container Status
```bash
docker-compose ps
```

### Clean Up
```bash
docker-compose down -v        # Remove volumes
docker system prune           # Clean dangling images
docker image prune -a         # Remove all unused images
```

## 📝 Initial Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your values:**
   - Database password
   - JWT secret
   - API keys (Stripe, Cloudinary, etc.)

3. **Start services:**
   ```bash
   docker-compose up --build
   ```

## ⚠️ Troubleshooting

**Port already in use?**
```bash
# Kill process (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or change port in docker-compose.yml
```

**Container won't start?**
```bash
docker-compose logs -f          # Check logs
docker-compose down -v          # Reset everything
docker-compose up --build       # Start fresh
```

**Memory issues?**
- Docker Desktop → Settings → Resources → Increase Memory to 4GB+

## 📚 Full Documentation
See [DOCKER_README.md](./DOCKER_README.md) for complete guide

---

**Configuration:** Review `.env.example` and update `.env` with your settings
**Development:** Use `docker-compose.dev.yml` for hot reload
**Production:** Use `docker-compose.yml` for optimized builds
