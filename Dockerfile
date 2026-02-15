# Root Dockerfile for quick single-container deployment (optional)
# Use docker-compose.yml for the recommended multi-container setup

FROM node:18-alpine

WORKDIR /app

# This is a placeholder. Use docker-compose.yml for the complete setup
# Copy and run all three services (backend, frontend, admin)

RUN echo "Please use docker-compose up to start all services"

CMD ["npm", "--version"]
