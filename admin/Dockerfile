# Admin Panel Dockerfile - React Vite App
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install simple HTTP server
RUN npm install -g http-server

# Copy built files from builder
COPY --from=builder /app/dist /app/dist

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})" || exit 1

# Start the server
CMD ["http-server", "dist", "-p", "3001", "-a", "0.0.0.0", "-g"]
