@echo off
REM Food Delivery App - start script (Windows)
REM   start.bat        -> production-style stack
REM   start.bat dev    -> development stack with hot reload
REM   start.bat down   -> stop everything

where docker >nul 2>nul
if errorlevel 1 (
    echo Docker is not installed. Install Docker Desktop first.
    pause
    exit /b 1
)

if not exist ".env" (
    echo .env not found - creating it from .env.example with random secrets
    powershell -NoProfile -Command "(Get-Content .env.example) -replace 'change_me_to_a_long_random_string',([guid]::NewGuid().ToString('N')+[guid]::NewGuid().ToString('N')) -replace 'change_me_mongo_password',[guid]::NewGuid().ToString('N') | Set-Content -Encoding ascii .env"
    echo Created .env - edit it to add STRIPE_SECRET_KEY etc.
)

if /i "%1"=="dev" goto dev
if /i "%1"=="down" goto down

docker compose up -d --build
echo.
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3001
echo API:      http://localhost:4000/health
goto end

:dev
docker compose -f docker-compose.dev.yml up --build
goto end

:down
docker compose down

:end
