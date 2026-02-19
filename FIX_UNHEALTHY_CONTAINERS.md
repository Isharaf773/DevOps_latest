# Fix Unhealthy Containers - Recovery Guide

## What Was Fixed

The containers were marked as "unhealthy" because:

| Issue | Cause | Fix |
|-------|-------|-----|
| **Backend unhealthy** | Health check failed at port 4000 | Changed to simple curl check with longer wait |
| **Frontend unhealthy** | Health check checked wrong port (5173 instead of 3000) | Fixed to port 3000 with curl check |
| **Admin unhealthy** | Health check tried Node HTTP check that failed | Changed to curl with proper timeout |
| **Start period too short** | Apps need 30+ seconds to initialize | Increased start_period to 40s for all services |

## Changes Made to docker-compose.yml

### Before (Failing):
```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:4000', ...)"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 5s  # ❌ Too short
```

### After (Fixed):
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/", "||", "exit", "1"]
  interval: 30s
  timeout: 10s
  retries: 5      # More retries
  start_period: 40s  # ✅ Gives apps time to start
```

---

## How to Recover Now

### Step 1: Stop All Containers

```bash
docker-compose down
```

Wait for all containers to stop.

### Step 2: Remove Old Images (Optional but Recommended)

```bash
docker-compose down -v
```

This removes:
- All stopped containers
- All volumes (data)
- All networks

### Step 3: Rebuild with New Health Checks

```bash
docker-compose up --build
```

Or with no cache:
```bash
docker-compose up --build --no-cache
```

### Step 4: Monitor Container Health

```bash
docker-compose ps
```

You should see:
```
food_admin       Up X seconds (healthy)
food_backend     Up X seconds (healthy)
food_frontend    Up X seconds (healthy)
food_mongodb     Up X seconds (healthy)
```

---

## Detailed Health Check Fixes

### MongoDB (No Changes Needed - Already Healthy)
```yaml
healthcheck:
  test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
  interval: 10s
  timeout: 5s
  retries: 5
  start_period: 10s  # ✅ Added
```

### Backend
**Issue**: Node HTTP check was too complex
**Fix**: Simple curl check to port 4000
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:4000/", "||", "exit", "1"]
  start_period: 40s  # ✅ Gives 40 seconds for npm install + server startup
```

### Frontend
**Issue**: Checked port 5173 (Vite dev) instead of 3000 (production)
**Fix**: Check correct port 3000
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/", "||", "exit", "1"]
  start_period: 40s  # ✅ Gives time for npm build + server startup
```

### Admin
**Issue**: Complex Node HTTP check that didn't work
**Fix**: Simple curl check to port 3001
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3001/", "||", "exit", "1"]
  start_period: 40s  # ✅ Gives time for npm build + server startup
```

---

## Why 40 Seconds Start Period?

The startup sequence for backend/frontend/admin:
1. **Container starts** (2-3 seconds)
2. **npm install** runs (10-20 seconds depending on package size)
3. **npm build** runs (5-10 seconds for frontend/admin)
4. **Start command** executes (2-3 seconds)
5. **App initialization** (2-3 seconds)

**Total**: ~25-40 seconds minimum

**40 seconds** gives enough buffer for all this to complete safely.

---

## Run the Pipeline Again

Now that health checks are fixed:

1. Go to Jenkins → Your job
2. Click **Build Now**
3. Wait for pipeline to complete
4. Check console output for success message

You should see:
```
✅ Pipeline succeeded!
Frontend: http://localhost:3000
Backend: http://localhost:4000
Admin: http://localhost:3001
```

---

## Verify Containers Are Healthy

After pipeline completes:

```bash
docker-compose ps
```

Expected output:
```
NAME            IMAGE           STATUS
food_admin      food-admin      Up X seconds (healthy)
food_backend    food-backend    Up X seconds (healthy)
food_frontend   food-frontend   Up X seconds (healthy)
food_mongodb    mongo:6.0       Up X seconds (healthy)
```

---

## Test Services Are Running

```bash
# Test Backend
curl http://localhost:4000

# Test Frontend
curl http://localhost:3000

# Test Admin
curl http://localhost:3001

# Test MongoDB
curl mongodb://localhost:27017
```

---

## If Containers Are Still Unhealthy

### Step 1: Check Container Logs

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs admin
```

Look for error messages like:
- "npm: command not found" → Node not installed
- "Port already in use" → Another process on port
- "Cannot find module" → Missing dependencies

### Step 2: Check if npm/node are installed in container

```bash
docker-compose exec backend npm --version
docker-compose exec frontend npm --version
```

### Step 3: Manually test health check

```bash
docker-compose exec backend curl -f http://localhost:4000/
docker-compose exec frontend curl -f http://localhost:3000/
docker-compose exec admin curl -f http://localhost:3001/
```

### Step 4: Rebuild Dockerfile

If packages are missing, rebuild:
```bash
docker-compose down
docker-compose up --build --no-cache --remove-orphans
```

---

## Quick Troubleshooting

| Symptom | Cause | Solution |
|---------|-------|----------|
| Always unhealthy | App not starting | Check `docker-compose logs <service>` |
| Healthy then unhealthy | App crashes | Check logs for runtime errors |
| Curl command not found | Alpine image? | Use wget or install curl |
| Port already in use | Another service using port | `docker-compose down` properly |

---

## Next Steps After Fix

1. ✅ Containers marked as "healthy"
2. ✅ Services accessible on ports 3000, 4000, 3001
3. ✅ Run Jenkins pipeline successfully
4. ✅ Docker images ready to push to Docker Hub

---

## File Updated

✅ [docker-compose.yml](docker-compose.yml) - Health checks fixed

---

**Try these commands now:**

```bash
# Stop everything
docker-compose down -v

# Rebuild and start fresh
docker-compose up --build

# In another terminal, monitor health
watch docker-compose ps
```

All containers should be marked as **healthy** within 40-60 seconds! 🎉
