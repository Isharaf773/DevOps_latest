# syntax=docker/dockerfile:1
# Frontend (customer app) - React + Vite, served by nginx

FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# CI target: docker build --target lint ./frontend
FROM base AS lint
COPY . .
RUN npm run lint

# Development target (docker-compose.dev.yml)
FROM base AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS build
COPY . .
RUN npm run build

# Production image
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/40-env-config.sh /docker-entrypoint.d/40-env-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-env-config.sh && chmod +x /docker-entrypoint.d/40-env-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
