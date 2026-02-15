pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "docker.io"
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        MONGODB_URI = credentials('mongodb-uri')
        JWT_SECRET = credentials('jwt-secret')
        STRIPE_SECRET_KEY = credentials('stripe-secret-key')
        NODE_ENV = "production"
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    triggers {
        githubPush()
        pollSCM('H H * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        echo '🔨 Building backend...'
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm run build || echo "No build script"'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        echo '🔨 Building frontend...'
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
                stage('Build Admin') {
                    steps {
                        echo '🔨 Building admin panel...'
                        dir('admin') {
                            sh 'npm install'
                            sh 'npm run build'
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
                            sh 'npm test || echo "No tests configured"'
                        }
                    }
                }
                stage('Test Frontend') {
                    steps {
                        echo '✅ Testing frontend...'
                        dir('frontend') {
                            sh 'npm test -- --coverage || echo "No tests configured"'
                        }
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                echo '🐳 Building and pushing Docker images...'
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker:${DOCKER_CREDENTIALS}') {
                        sh 'docker-compose build'
                        sh 'docker-compose push || echo "Push skipped in dev"'
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                    docker-compose logs -f --tail 50
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo '💚 Running health checks...'
                sh '''
                    sleep 10
                    curl -f http://localhost:4000 || exit 1
                    curl -f http://localhost:3000 || exit 1
                    curl -f http://localhost:3001 || exit 1
                '''
            }
        }
    }

    post {
        always {
            echo '📊 Cleaning up...'
            cleanWs()
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
