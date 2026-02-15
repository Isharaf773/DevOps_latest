@echo off
REM Food Delivery App - Docker Start Script (Windows)
REM Usage: start.bat

echo.
echo ╔════════════════════════════════════════════╗
echo ║ 🍔 Food Delivery App - Docker Startup     ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env
    echo ✅ Created .env file. Please update it with your actual values.
    echo 📝 Edit .env and add your credentials, then run this script again.
    pause
    exit /b 0
)

echo Select deployment mode:
echo 1) Production (optimized builds)
echo 2) Development (with hot reload)
echo.
set /p choice="Enter choice [1-2]: "

echo.
echo Starting services...
echo.

if "%choice%"=="1" (
    echo 🚀 Starting in PRODUCTION mode...
    docker-compose up --build
) else if "%choice%"=="2" (
    echo 🔧 Starting in DEVELOPMENT mode (hot reload enabled)...
    docker-compose -f docker-compose.dev.yml up --build
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)

pause
