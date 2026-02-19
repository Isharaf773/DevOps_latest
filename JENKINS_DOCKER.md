# Jenkins with Docker (Compose Override)

Use this project file to run Jenkins alongside the existing food stack.

## Start Docker service (Admin PowerShell)

sc.exe start com.docker.service

## Start Jenkins only

`docker compose -f docker-compose.yml -f docker-compose.jenkins.yml up -d jenkins`

## Check container

`docker ps`

`docker logs --tail 100 food_jenkins`

## Get initial admin password

`docker exec food_jenkins cat /var/jenkins_home/secrets/initialAdminPassword`

## Open Jenkins

http://localhost:8080

## Stop Jenkins

`docker compose -f docker-compose.yml -f docker-compose.jenkins.yml stop jenkins`
