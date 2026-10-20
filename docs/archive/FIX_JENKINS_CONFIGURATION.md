# Jenkins Pipeline Configuration - Complete Fix

## Problem
Jenkins is showing "Checkout" stage which means it's using the **old pipeline** from Git, not your updated Jenkinsfile.

This happens when Jenkins job is configured as:
- **Pipeline script from SCM** (Git) ← Uses Git version, not local file
- Instead of:
- **Pipeline script** (Direct) ← Uses direct script

---

## Solution: Configure Jenkins Job Correctly

### Option 1: Use Pipeline Script (Easiest - Recommended)

**Steps:**

1. Go to your Jenkins job: `http://localhost:8080/job/food`
2. Click **Configure** (on the left)
3. Under **Pipeline** section, change:
   - **Definition:** From "Pipeline script from SCM" → **"Pipeline script"**
   
4. If you see **SCM** dropdown, select **Pipeline script**

5. In the **Script** text area, paste this complete pipeline:

```groovy
pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_USERNAME = credentials('docker-hub-username')
        DOCKER_PASSWORD = credentials('docker-hub-token')
        NODE_ENV = "production"
        WORKSPACE_PATH = "${WORKSPACE}"
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Prepare') {
            steps {
                echo '📦 Preparing workspace...'
                echo "Workspace: ${WORKSPACE_PATH}"
            }
        }

        stage('Verify Project') {
            steps {
                echo '🔍 Verifying project structure...'
                bat '''
                    @echo off
                    if exist "backend\package.json" (
                        echo ✅ Backend found
                    ) else (
                        echo ❌ Backend not found
                        exit /b 1
                    )
                    if exist "frontend\package.json" (
                        echo ✅ Frontend found
                    ) else (
                        echo ❌ Frontend not found
                        exit /b 1
                    )
                    if exist "admin\package.json" (
                        echo ✅ Admin found
                    ) else (
                        echo ❌ Admin not found
                        exit /b 1
                    )
                '''
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo '🔨 Building backend...'
                        dir('backend') {
                            bat 'call npm install'
                            bat 'call npm run build || echo No build script'
                        }
                    }
                }

                stage('Build Frontend') {
                    steps {
                        echo '🔨 Building frontend...'
                        dir('frontend') {
                            bat 'call npm install'
                            bat 'call npm run build'
                        }
                    }
                }

                stage('Build Admin') {
                    steps {
                        echo '🔨 Building admin...'
                        dir('admin') {
                            bat 'call npm install'
                            bat 'call npm run build'
                        }
                    }
                }
            }
        }

        stage('Test') {
            parallel {
                stage('Test Backend') {
                    steps {
                        echo '✅ Testing backend...'
                        dir('backend') {
                            bat 'call npm test || echo No tests configured'
                        }
                    }
                }

                stage('Test Frontend') {
                    steps {
                        echo '✅ Testing frontend...'
                        dir('frontend') {
                            bat 'call npm test || echo No tests configured'
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo '🐳 Building Docker images...'
                bat 'docker-compose build --no-cache'
                echo "✅ Docker images built successfully"
                
                echo "🔐 Logging in to Docker Hub..."
                bat '''
                    @echo off
                    setlocal enabledelayedexpansion
                    set DOCKER_USER=%DOCKER_USERNAME%
                    set DOCKER_PASS=%DOCKER_PASSWORD%
                    echo !DOCKER_PASS! | docker login -u !DOCKER_USER! --password-stdin
                '''
                
                echo "🏷️ Tagging Docker images..."
                bat '''
                    @echo off
                    setlocal enabledelayedexpansion
                    set DOCKER_USER=%DOCKER_USERNAME%
                    docker tag food_backend:latest !DOCKER_USER!/food-backend:latest
                    docker tag food_frontend:latest !DOCKER_USER!/food-frontend:latest
                    docker tag food_admin:latest !DOCKER_USER!/food-admin:latest
                '''
                
                echo "📤 Pushing images to Docker Hub..."
                bat '''
                    @echo off
                    setlocal enabledelayedexpansion
                    set DOCKER_USER=%DOCKER_USERNAME%
                    docker push !DOCKER_USER!/food-backend:latest
                    docker push !DOCKER_USER!/food-frontend:latest
                    docker push !DOCKER_USER!/food-admin:latest
                '''
                
                echo "🔓 Logging out from Docker Hub..."
                bat 'docker logout'
                echo "✅ Docker operations completed"
            }
        }

        stage('Deploy') {
            steps {
                echo "🚀 Deploying application..."
                bat '''
                    @echo off
                    docker-compose down || echo Containers stopped
                    docker-compose up -d
                    timeout /t 10 /nobreak
                    docker-compose ps
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "💚 Running health checks..."
                bat '''
                    @echo off
                    echo Checking services...
                    curl -f http://localhost:4000 >nul 2>&1 && echo ✅ Backend healthy || echo ⚠️ Backend starting
                    curl -f http://localhost:3000 >nul 2>&1 && echo ✅ Frontend healthy || echo ⚠️ Frontend starting
                    curl -f http://localhost:3001 >nul 2>&1 && echo ✅ Admin healthy || echo ⚠️ Admin starting
                '''
            }
        }
    }

    post {
        always {
            echo '📊 Pipeline execution completed'
        }
        success {
            echo '✅ Pipeline succeeded!'
            echo 'Services running at:'
            echo '  Frontend: http://localhost:3000'
            echo '  Backend: http://localhost:4000'
            echo '  Admin: http://localhost:3001'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
```

6. Click **Save**
7. Go back to job
8. Click **Build Now**

---

### Option 2: Commit to Git (If using Git)

If your Jenkins job is pulling from Git:

```bash
git add Jenkinsfile
git commit -m "Update pipeline: remove checkout, add prepare stage"
git push origin main
```

Then in Jenkins:
1. Click **Build Now**
2. Jenkins will pull latest Jenkinsfile from Git

---

## Quick Checklist

After making changes:

- [ ] Jenkins job shows **Pipeline script** (not "Pipeline script from SCM")
- [ ] Script area has the full pipeline code
- [ ] Click **Save**
- [ ] Go back to job page
- [ ] Click **Build Now**
- [ ] Pipeline should now show: Prepare, Verify Project, Build, Test, Docker, Deploy, Health Check
- [ ] No more "Checkout" stage!

---

## Why This Problem Happened

Your current Jenkins job setup:
```
Jenkins Job
    ↓
Configured with: "Pipeline script from SCM"
    ↓
Points to: Git repository
    ↓
Loads: Old Jenkinsfile from Git
    ↓
Tries to: checkout scm ← FAILS
```

The fix:
```
Jenkins Job
    ↓
Configure with: "Pipeline script"
    ↓
Paste: Updated pipeline code
    ↓
Loads: Direct script (not from Git)
    ↓
Skips: checkout stage entirely ← WORKS
```

---

## Visual Guide

**Current Config (Wrong):**
```
Jenkins > food job > Configure > Pipeline
┌─────────────────────────────────┐
│ Definition: Pipeline script from SCM ← CHANGE THIS
│ SCM: Git
│ Repository URL: https://github.com/...
│ Script path: Jenkinsfile
└─────────────────────────────────┘
```

**Fixed Config (Right):**
```
Jenkins > food job > Configure > Pipeline
┌─────────────────────────────────┐
│ Definition: Pipeline script ✅
│ Script: [PASTE FULL PIPELINE CODE]
└─────────────────────────────────┘
```

---

## Troubleshooting

**Q: Where is the "Configure" button?**
A: On job page, left sidebar, click "Configure"

**Q: Can't find Pipeline section?**
A: Scroll down the Configure page, it's usually in the middle

**Q: Script is too long to paste?**
A: That's OK, it should fit. Use Ctrl+A to select all, Ctrl+C to copy.

**Q: Still seeing "Checkout" stage?**
A: Jenkins might be cached. Try:
1. Click **Build Now** again
2. Or restart Jenkins: `sudo systemctl restart jenkins`

---

## Final Step: Build!

After configuring:
1. Go to your job: `http://localhost:8080/job/food`
2. Click **Build Now** (green button, top right)
3. Wait ~30 seconds
4. Pipeline should complete successfully ✅

